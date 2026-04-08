const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  section: String,
  title: String,
  description: String,
  fine_amount: Number,
  jurisdiction: { type: String, default: 'Central' }, // e.g., Kerala, Tamil Nadu, Central
  category: String, // e.g., Over-speeding, Parking, Helmet
});

module.exports = mongoose.model('Rule', ruleSchema);
