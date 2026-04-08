const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/complaint', aiController.getComplaint);
router.post('/risk-score', aiController.getRiskScore);

module.exports = router;
