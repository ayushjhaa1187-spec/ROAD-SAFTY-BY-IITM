const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: String,
  issue_type: String,
  description: String,
  lat: Number,
  lng: Number,
  segment_id: {
    type: String,
    index: true
  },
  severity: String,
  status: { type: String, default: 'open' },
  ai_summary: String,
  media_url: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
