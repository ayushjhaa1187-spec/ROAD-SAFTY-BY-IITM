const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/hotspots', analyticsController.getHotspots);
router.get('/segments/:id', analyticsController.getSegmentDetails);

module.exports = router;
