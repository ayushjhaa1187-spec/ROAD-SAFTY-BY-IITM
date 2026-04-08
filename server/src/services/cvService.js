const axios = require('axios');
const DefectDetection = require('../models/DefectDetection');

const CV_SERVICE_URL = process.env.CV_SERVICE_URL || 'http://localhost:8000';

/**
 * Analyzes an image for road defects using the Python CV microservice.
 */
const analyzeRoadImage = async (reportId, imageUrl) => {
  try {
    const response = await axios.post(`${CV_SERVICE_URL}/cv/analyze-image`, {
      image_url: imageUrl
    }, { timeout: 10000 });
    
    const defects = response.data.defects || [];

    // Store detections in MongoDB
    if (defects.length > 0) {
      await DefectDetection.create({
        report_id: reportId,
        defects: defects
      });
    }

    return defects;
  } catch (error) {
    console.error('CV Service Error:', error.message);
    
    // Fallback: Return empty defects if service is down, allowing AI to continue on text
    return [];
  }
};

module.exports = {
  analyzeRoadImage
};
