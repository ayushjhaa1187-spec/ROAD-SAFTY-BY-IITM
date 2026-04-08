const Report = require('../models/Report');
const cvService = require('../services/cvService');
const aiService = require('../services/aiService');

const createReport = async (req, res) => {
  try {
    const { id, issue_type, description, lat, lng, media_url } = req.body;

    // 1. Trigger CV analysis if media_url exists
    let defects = [];
    if (media_url) {
      console.log(`Triggering CV analysis for report ${id}...`);
      defects = await cvService.analyzeRoadImage(id, media_url);
    }

    // 2. Trigger AI analysis (Multi-modal: takes description + defects)
    console.log(`Triggering AI analysis for report ${id}...`);
    const aiAnalysis = await aiService.generateComplaint({
      issueText: description,
      defects: defects,
      location: `${lat}, ${lng}`
    });

    const riskAnalysis = await aiService.estimateRiskLevel({
      defects: defects,
      roadType: 'urban', // can be dynamic
      proximityContext: 'unknown'
    });

    // 3. Save Report
    const report = new Report({
      id,
      issue_type,
      description,
      lat,
      lng,
      media_url,
      severity: riskAnalysis.risk_level || 'medium',
      ai_summary: aiAnalysis.complaint_text
    });

    await report.save();

    res.status(201).json({
      message: 'Report created with AI & CV insights',
      report,
      ai_analysis: aiAnalysis,
      cv_detections: defects
    });

  } catch (error) {
    console.error('Report Creation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport
};
