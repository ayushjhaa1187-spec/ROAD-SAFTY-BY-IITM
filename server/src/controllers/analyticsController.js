const Telemetry = require('../models/Telemetry');
const DefectDetection = require('../models/DefectDetection');
const Report = require('../models/Report');
const aiService = require('../services/aiService');

/**
 * Aggregates road intelligence into hotspots.
 */
const getHotspots = async (req, res) => {
  try {
    // 1. Aggregate Telemetry Roughness by Segment
    const telemetryStats = await Telemetry.aggregate([
      {
        $group: {
          _id: "$segment_id",
          avgRoughness: { $avg: "$roughness_index" },
          tripCount: { $count: {} }
        }
      }
    ]);

    // 2. Aggregate Defect Counts by Segment
    const defectStats = await DefectDetection.aggregate([
      { $unwind: "$defects" },
      {
        $group: {
          _id: "$segment_id",
          totalDefects: { $count: {} },
          avgConfidence: { $avg: "$defects.confidence" }
        }
      }
    ]);

    // 3. Aggregate Citizen Report Counts by Segment
    const reportStats = await Report.aggregate([
      {
        $group: {
          _id: "$segment_id",
          reportCount: { $count: {} }
        }
      }
    ]);

    // 4. Merge Data (in-memory for baseline, or use $lookup in production)
    const hotspots = telemetryStats.map(tel => {
      const defects = defectStats.find(d => d._id === tel._id) || { totalDefects: 0 };
      const reports = reportStats.find(r => r._id === tel._id) || { reportCount: 0 };

      // Composite Risk Index (0-100)
      // Weighted: 50% Roughness, 30% Detected Defects, 20% Citizen Reports
      const riskIndex = (tel.avgRoughness * 0.5) + 
                         (Math.min(10, defects.totalDefects) * 5) + 
                         (Math.min(5, reports.reportCount) * 4);

      return {
        segmentId: tel._id,
        roughnessScore: Math.round(tel.avgRoughness),
        defectCount: defects.totalDefects,
        reportCount: reports.reportCount,
        riskIndex: Math.round(Math.min(100, riskIndex))
      };
    }).sort((a, b) => b.riskIndex - a.riskIndex);

    res.json(hotspots);
  } catch (error) {
    console.error('Hotspot Aggregation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get detailed summary for a specific segment, including AI explanation.
 */
const getSegmentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all context for this segment
    const telemetry = await Telemetry.find({ segment_id: id }).limit(5);
    const detections = await DefectDetection.find({ segment_id: id }).limit(5);
    const reports = await Report.find({ segment_id: id }).limit(5);

    // AI Summary logic
    const aiExplanation = await aiService.estimateRiskLevel({
      defects: detections.flatMap(d => d.defects),
      roadType: 'urban',
      proximityContext: `Analyzed over ${telemetry.length} sensor trips and ${reports.length} citizen reports.`
    });

    res.json({
      segmentId: id,
      stats: {
        telemetry_trips: telemetry.length,
        detected_defects: detections.reduce((acc, curr) => acc + curr.defects.length, 0),
        citizen_reports: reports.length
      },
      ai_risk_analysis: aiExplanation,
      raw_context: {
        latest_telemetry: telemetry.map(t => ({ id: t._id, roughness: t.roughness_index })),
        latest_reports: reports.map(r => ({ id: r.id, type: r.issue_type }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHotspots,
  getSegmentDetails
};
