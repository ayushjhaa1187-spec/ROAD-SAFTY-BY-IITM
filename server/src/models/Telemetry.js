const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  report_id: {
    type: String,
    required: false
  },
  trip_id: {
    type: String,
    required: true
  },
  segment_id: {
    type: String,
    index: true
  },
  datapoints: [{
    timestamp: Date,
    lat: Number,
    lng: Number,
    speed: Number,
    accel: {
      x: Number,
      y: Number,
      z: Number
    }
  }],
  roughness_index: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Geo index for spatial queries
telemetrySchema.index({ "datapoints.lat": 1, "datapoints.lng": 1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
