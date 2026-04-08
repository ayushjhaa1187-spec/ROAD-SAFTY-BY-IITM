# RoadWatch Core Architecture

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + PostGIS)
- **Maps**: Leaflet + React-Leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **Hosting**: Vercel

## System Components
1. **Citizen Portal**: Mobile-responsive web interface for reporting road issues with photo and GPS location.
2. **Authority Dashboard**: Real-time monitoring board with geospatial visualization and priority-based reporting queue.
3. **AI Layer (Phase 2)**: Integration with Gemini/LLM to automate complaint generation and severity scoring.
4. **PostGIS Engine**: Used for geospatial queries, allowing authorities to filter issues by ward or administrative boundaries.

## Logical Flow
1. **Submission**: Citizen creates report -> Image uploaded to Supabase Storage -> Record saved to `reports` table.
2. **Validation**: AI/Reviewer verifies the report -> Status updated to `verified`.
3. **Forwarding**: System suggests responsible authority based on geography -> Record assigned to specific department.
4. **Resolution**: Authority updates status to `in_progress` then `resolved` -> Citizen notified (future phase).
