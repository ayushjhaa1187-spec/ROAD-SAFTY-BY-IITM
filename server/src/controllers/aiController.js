const aiService = require('../services/aiService');

const getComplaint = async (req, res) => {
  try {
    const { issueText, defects, location } = req.body;
    const result = await aiService.generateComplaint({ issueText, defects, location });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRiskScore = async (req, res) => {
  try {
    const { defects, roadType, proximityContext } = req.body;
    const result = await aiService.estimateRiskLevel({ defects, roadType, proximityContext });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getComplaint,
  getRiskScore
};
