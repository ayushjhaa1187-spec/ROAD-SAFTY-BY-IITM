const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const { lookupTrafficLaw } = require('../services/aiService');

/**
 * DriveLegal Query: RAG-style query (Search DB then Ask AI)
 */
router.post('/query', async (req, res) => {
  try {
    const { location, question } = req.body;

    // 1. Retrieval Layer: Find rules that match keywords in the question
    // Simple regex search for baseline
    const keywords = question.split(' ').filter(w => w.length > 3);
    const regexQuery = keywords.map(w => new RegExp(w, 'i'));
    
    const relevantRules = await Rule.find({
      $or: [
        { title: { $in: regexQuery } },
        { description: { $in: regexQuery } },
        { category: { $in: regexQuery } }
      ]
    }).limit(3);

    // 2. AI Layer: Pass retrieved rules to Gemini for natural language explanation
    const result = await lookupTrafficLaw({ 
      location, 
      question, 
      ruleContext: relevantRules 
    });

    res.json({
      query: question,
      ai_response: result,
      source_rules: relevantRules
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
