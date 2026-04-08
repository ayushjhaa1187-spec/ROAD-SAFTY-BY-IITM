# Project Assumptions & Requirements

## Assumptions
- **Connectivity**: Users have at least 3G/4G connectivity at the time of reporting for image uploads.
- **Geography**: Initial focus is on Indian urban/rural roads (coordinates handled via WGS84).
- **Authorities**: For the demo, "Authorities" are simulated as departments (e.g., PWD, Municipality).
- **Authentication**: Users must be signed in to submit reports to prevent spam (using Supabase Auth).

## Packages Used
- `@supabase/supabase-js`: Database and Auth integration.
- `@supabase/ssr`: Server-side rendering support for Supabase.
- `leaflet`: Core mapping engine.
- `react-leaflet`: React wrapper for Leaflet.
- `lucide-react`: Modern icon set.
- `clsx` & `tailwind-merge`: Utility for dynamic Tailwind classes.
- `date-fns`: Date manipulation.

## Environment Requirements
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
