const mongoose = require('mongoose');

const defectDetectionSchema = new mongoose.Schema({
  report_id: {
    type: String,
    required: true,
    index: true
  },
  segment_id: {
    type: String,
    index: true
  },
  defects: [{
    type: { type: String, required: true },
    confidence: Number,
    bbox: [Number]
  }],
  engine_version: {
    type: String,
    default: 'yolov8-baseline'
  },
  processed_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DefectDetection', defectDetectionSchema);
