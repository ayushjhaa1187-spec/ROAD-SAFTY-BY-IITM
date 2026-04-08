# RoadWatch 360

<div align="center">

# 🛣️ ROADWATCH 360
### AI-Powered Road Quality Monitoring & Public Transparency Platform
**Detect. Report. Verify. Improve.**

[![Hackathon](https://img.shields.io/badge/CoERS-Road%20Safety%20Hackathon-2563eb?style=for-the-badge)](#)
[![Track](https://img.shields.io/badge/Track-RoadWatch-8b5cf6?style=for-the-badge)](#)
[![AI Powered](https://img.shields.io/badge/AI-Road%20Intelligence-10b981?style=for-the-badge)](#)
[![Full Stack](https://img.shields.io/badge/Full%20Stack-Web%20Platform-f59e0b?style=for-the-badge)](#)
[![Maps](https://img.shields.io/badge/Geo-Location%20Aware-ef4444?style=for-the-badge)](#)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/ayushjhaa1187-spec/ROAD-SAFTY-BY-IITM.git
   cd ROAD-SAFTY-BY-IITM
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and add your Supabase credentials.

3. **Database Setup**
   Run the SQL migration in `supabase/migrations/20260408000000_initial_schema.sql` in your Supabase SQL Editor.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📌 Overview

**RoadWatch 360** is an AI-powered civic road monitoring platform that enables citizens to report road-quality issues, helps authorities visualize them on a map, and improves transparency in road infrastructure management.

This project is designed as a hackathon-ready product for the **RoadWatch** problem statement under the **National Road Safety Hackathon 2026**.

---

## ✨ Key Features

### 📍 Citizen Reporting
- Submit road issues with title, description, and media.
- Pin exact location using interactive maps.
- Select issue category (pothole, crack, waterlogging, etc.).

### 🧠 AI Assistance (Phase 3)
- Generate a structured complaint summary from raw user input.
- Suggest severity level based on issue description and type.

### 🗺️ Map-Based Dashboard
- View all reports on a city/locality map.
- Filter by status, severity, and issue type.

### 🛠️ Admin / Authority Workflow
- Review incoming issues and update statuses (Open → Verified → Resolved).

---

## 🛠️ Tech Stack

- **Next.js 15**: High-performance React framework.
- **Supabase**: Backend-as-a-Service (PostgreSQL + PostGIS).
- **Leaflet**: Geospatial visualization.
- **Tailwind CSS**: Premium design system.
- **Lucide React**: Modern iconography.

---

## 📂 Project Structure

- `src/app`: App Router pages (Reporting, Dashboard).
- `src/components`: Modular UI components (Reporting forms, Dashboard maps).
- `src/lib`: Core services (Supabase client, Utils).
- `supabase/migrations`: Database schema versioning.
- `docs`: Architecture, Assumptions, and Presentation outlines.

---

## 📜 License
This project is licensed under the **MIT License**.
