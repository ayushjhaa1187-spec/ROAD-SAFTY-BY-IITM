const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Telemetry = require('../models/Telemetry');
const DefectDetection = require('../models/DefectDetection');
const Report = require('../models/Report');
const { getSegmentId } = require('../utils/geoUtils');

dotenv.config({ path: '../../.env' });

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing demo data
    await Telemetry.deleteMany({});
    await DefectDetection.deleteMany({});
    await Report.deleteMany({});

    // Targeted areas near IIT Madras
    const roadPoints = [
      { name: 'Sardar Patel Road', lat: 13.0067, lng: 80.2206, risk: 0.8 },
      { name: 'OMR - IT Corridor', lat: 12.9866, lng: 80.2447, risk: 0.6 },
      { name: 'Besant Nagar Main', lat: 12.9975, lng: 80.2676, risk: 0.3 },
      { name: 'Velachery Bypass', lat: 12.9780, lng: 80.2200, risk: 0.9 },
      { name: 'Inner Ring Road', lat: 13.0180, lng: 80.2000, risk: 0.5 }
    ];

    console.log('Generating high-fidelity data for Chennai roads...');
    let totalSegments = 0;

    for (const point of roadPoints) {
      console.log(`Processing ${point.name}...`);
      // Create a cluster of segments around each main point
      for (let i = 0; i < 10; i++) {
        const lat = point.lat + (Math.random() - 0.5) * 0.01;
        const lng = point.lng + (Math.random() - 0.5) * 0.01;
        const segmentId = getSegmentId(lat, lng);
        
        const riskProfile = Math.min(1.0, point.risk + (Math.random() - 0.5) * 0.3);

        // 1. Generate Telemetry (Vibrations)
        const telemetryCount = Math.floor(Math.random() * 5) + 1;
        for (let t = 0; t < telemetryCount; t++) {
          await Telemetry.create({
            trip_id: `trip_${Math.random().toString(36).substr(2, 5)}`,
            segment_id: segmentId,
            roughness_index: riskProfile * 100,
            datapoints: [{ lat, lng, timestamp: new Date(), accel: { z: 9.8 + (riskProfile * 5) } }]
          });
        }

        // 2. Generate Defect Detections (High risk segments get more)
        if (riskProfile > 0.4) {
          const defectCount = Math.floor(riskProfile * 10);
          await DefectDetection.create({
            report_id: `rep_${segmentId}`,
            segment_id: segmentId,
            defects: Array(defectCount).fill(0).map(() => ({
              type: Math.random() > 0.5 ? 'pothole' : 'crack',
              confidence: 0.7 + Math.random() * 0.3,
              bbox: [100, 100, 200, 200]
            }))
          });
        }

        // 3. Generate Citizen Reports (Only for some)
        if (riskProfile > 0.7) {
          await Report.create({
            id: `cit_${segmentId}`,
            segment_id: segmentId,
            issue_type: 'pothole',
            description: 'Recurring pothole issue causing traffic delays.',
            lat,
            lng,
            severity: 'high'
          });
        }
        totalSegments++;
      }
    }

    console.log(`Success! Seeded ${totalSegments} segments with synthetic data.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
