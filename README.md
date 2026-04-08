# 🛣️ ROADWATCH 360
### AI-Powered Road Quality Monitoring & Public Transparency Platform
**Detect. Report. Verify. Improve.**

[![Hackathon](https://img.shields.io/badge/CoERS-Road%20Safety%20Hackathon-2563eb?style=for-the-badge)](#)
[![Track](https://img.shields.io/badge/Track-RoadWatch-8b5cf6?style=for-the-badge)](#)
[![AI Powered](https://img.shields.io/badge/AI-Road%20Intelligence-10b981?style=for-the-badge)](#)
[![Full Stack](https://img.shields.io/badge/Full%20Stack-Web%20Platform-f59e0b?style=for-the-badge)](#)
[![Maps](https://img.shields.io/badge/Geo-Location%20Aware-ef4444?style=for-the-badge)](#)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/ayushjhaa1187-spec/ROAD-SAFETY-BY-IITM.git
   cd ROAD-SAFETY-BY-IITM
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` (Frontend) and `server/.env.example` to `server/.env` (Backend).
   Add your API keys and credentials:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini API Key
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
   - `MONGODB_URI`: MongoDB connection string

3. **Database Setup**
   - **Supabase**: Run migrations in `supabase/migrations/` (if available) or check `docs/architecture.md`.
   - **MongoDB**: The backend will automatically create collections on first run.

4. **Run Development**
   - **Frontend**: `npm run dev` (Port 3000)
   - **Backend**: `cd server && npm run dev` (Port 5000)
   - **CV Service**: `cd cv-service && uvicorn main:app --reload` (Port 8000)

---

## 📌 Overview

**RoadWatch 360** is an AI-powered civic road monitoring platform that enables citizens to report road-quality issues, helps authorities visualize them on a map, and improves transparency in road infrastructure management.

The platform is built around three core goals:
- **Monitor road quality** through structured issue reporting.
- **Assist authorities** with a dashboard for filtering, tracking, and prioritizing road problems.
- **Increase public transparency** by organizing road issue data in a clear, location-based system.

This project is designed as a hackathon-ready product for the **RoadWatch** problem statement under the **National Road Safety Hackathon 2026** (IIT Madras).

---

## ✨ Key Features

### 📍 Citizen Reporting
- Submit road issues with title, description, and media.
- Pin exact location using interactive maps.
- Select issue category (pothole, crack, waterlogging, etc.).

### 🧠 AI Intelligence (Vision + LLM)
- **Computer Vision**: Automated road defect detection using YOLOv8.
- **Natural Language**: Automated report summarization and severity classification using Gemini AI.
- **Predictive Analytics**: Identification of recurring problem areas and hotspots.

### 🗺️ Dynamic Monitoring Dashboard
- Real-time geospatial visualization of road quality.
- Administrative workflow: **Open → Verified → Forwarded → Resolved**.
- High-resolution data for maintenance prioritization and public accountability.

---

## 🏗️ System Architecture

RoadWatch 360 is built with a modular, scalable architecture:

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Leaflet.
- **Primary Backend**: Express 5 + Mongoose (MongoDB Atlas) for structured reports and analytics.
- **AI Core**: FastAPI + YOLOv8n for Computer Vision; Gemini AI for text analysis.
- **Auth & Media**: Supabase Auth & Storage.

---

## 📂 Project Structure

- `src/app/`: Next.js Frontend (Citizen App & Intelligence Dashboard).
- `server/`: MERN Backend handling business logic and analytics.
- `cv-service/`: Python microservice for YOLO-based defect detection.
- `docs/`: Technical documentation, presentation outlines, and deployment guides.

---

## 📄 Demo Accounts
- **Citizen**: `demo@roadwatch.ai` / `demo123`
- **Admin**: `admin@roadwatch.ai` / `admin123`

---

## 🛡️ License
MIT License - Developed for the National Road Safety Hackathon 2026.
