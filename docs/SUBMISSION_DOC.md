# RoadWatch 360 - National Road Safety Hackathon 2026

## 📋 Project Overview
RoadWatch 360 is an AI-powered road safety intelligence platform that integrates citizen reporting, computer vision, and telemetry data to identify road defects and hotspots before they lead to accidents.

## 🛠 Tech Stack & Packages Used

### Frontend (Next.js)
- `next`: React Framework (App Router)
- `react-leaflet`: Geospatial visualization
- `lucide-react`: Iconography
- `tailwind-merge` & `clsx`: UI utility classes

### Backend (Node.js/MERN)
- `express`: API Gateway
- `mongoose`: MongoDB Object Modeling
- `@google/generative-ai`: Gemini SDK for report analysis and risk summaries
- `axios`: Microservice communication
- `helmet` & `morgan`: Security and logging

### AI/CV Microservice (Python)
- `fastapi`: High-performance API framework
- `ultralytics`: YOLOv8 for road defect detection
- `opencv-python`: Image processing
- `pillow`: Image manipulation

### Database & Auth
- `Supabase`: PostgreSQL (PostGIS) for Stage 1 core, Auth, and Storage.
- `MongoDB`: Cross-modal R&D data (telemetry, hotspots, legal rules).

## 🛡️ Key Assumptions
1. **Model Weights**: The CV service uses a pre-trained YOLOv8n model for demonstration. For production, fine-tuning on Indian road datasets (RDD2022) is required.
2. **Telemetry**: Sensor data (vibrations) is currently simulated using batch ingestion of accelerometer z-axis deviations.
3. **Data Localization**: Demo data is seeded around major Chennai roads (IIT Madras, OMR, Sardar Patel Road) for geographic fidelity.
4. **Legal Intelligence**: The DriveLegal knowledge base contains a curated subset of MVA rules for demo purposes.

## 🏗️ System Architecture
1. **Citizen Layer**: Reports issue via Next.js web app.
2. **CV Layer**: Automated verification of photos via YOLOv8.
3. **AI Layer**: Gemini processes raw text + CV detections to generate formal complaints.
4. **Data Fusion**: Telemetry and reports are aggregated into 100m grid segments to identify "Hotspots."
5. **Governance Layer**: Authorities view high-risk segments on the Hotspot map for priority maintenance.
