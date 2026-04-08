const Telemetry = require('../models/Telemetry');
const { getSegmentId } = require('../utils/geoUtils');

const ingestTelemetry = async (req, res) => {
  try {
    const { trip_id, datapoints } = req.body;

    if (!datapoints || datapoints.length === 0) {
      return res.status(400).json({ error: 'No datapoints provided' });
    }

    // 1. Calculate Average Roughness for the whole batch/trip
    // Threshold for a "shock" (e.g., 2.0g deviation from gravity)
    const SHOCK_THRESHOLD = 2.0; 
    let peakCount = 0;
    const verticalVariances = [];

    datapoints.forEach(p => {
      const z = p.accel?.z || 9.8;
      const deviation = Math.abs(z - 9.8);
      verticalVariances.push(deviation);
      if (deviation > SHOCK_THRESHOLD) peakCount++;
    });

    const avgVariance = verticalVariances.reduce((a, b) => a + b, 0) / verticalVariances.length;
    
    // Roughness Score (0-100): Weighted combination of avg variance and peak frequency
    const peakFrequency = (peakCount / datapoints.length) * 100;
    const roughnessScore = Math.min(100, (avgVariance * 15) + (peakFrequency * 2));

    // 2. Assign Segment ID based on the first datapoint (for simplification)
    const centerLat = datapoints[0].lat;
    const centerLng = datapoints[0].lng;
    const segmentId = getSegmentId(centerLat, centerLng);

    const telemetry = new Telemetry({
      trip_id,
      segment_id: segmentId,
      datapoints,
      roughness_index: roughnessScore
    });

    await telemetry.save();
    
    res.json({
      message: 'Telemetry ingested successfully',
      segment_id: segmentId,
      roughness_score: roughnessScore,
      peaks_detected: peakCount
    });
  } catch (error) {
    console.error('Telemetry Ingest Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  ingestTelemetry
};
