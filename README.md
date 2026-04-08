# RoadWatch Core

**RoadWatch Core** is a modular, AI-powered geospatial platform designed for the National Road Safety Hackathon 2026 (IIT Madras). It bridges the gap between citizens and authorities by providing a streamlined reporting system and a data-driven governance dashboard.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Database Setup**
   Run the SQL migration found in `supabase/migrations/20260408000000_initial_schema.sql` in your Supabase SQL Editor.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

- **Next.js 15**: High-performance React framework.
- **Supabase**: Backend-as-a-Service (PostgreSQL + PostGIS).
- **Leaflet**: Geospatial visualization.
- **Tailwind CSS**: Premium design system.
- **Lucide React**: Modern iconography.

## 📂 Project Structure

- `src/app`: App Router pages (Reporting, Dashboard).
- `src/components`: Modular UI components (Reporting forms, Dashboard maps).
- `src/lib`: Core services (Supabase client, Utils).
- `supabase/migrations`: Database schema versioning.
- `docs`: Architecture, Assumptions, and Presentation outlines.

## 🛡 License
MIT
