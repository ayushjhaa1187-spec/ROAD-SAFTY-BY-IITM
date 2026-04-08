const express = require('express');
const router = express.Router();
const { explainSOSRecommendation } = require('../services/aiService');

router.post('/triage', async (req, res) => {
  try {
    const { incident, facilities } = req.body;
    const result = await explainSOSRecommendation({ incident, facilities });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
