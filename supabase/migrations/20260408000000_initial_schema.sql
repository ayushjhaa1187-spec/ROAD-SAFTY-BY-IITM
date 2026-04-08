-- roadwatch-core initial schema

-- Enable PostGIS if possible (Supabase usually has it)
create extension if not exists postgis;

-- Users table (profiles extending supabase auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'citizen' check (role in ('citizen', 'admin', 'reviewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Authorities table
create table if not exists public.authorities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  department text not null,
  contact_email text,
  jurisdiction_area text, -- Could be a geometry polygon later
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reports table
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  issue_type text not null check (issue_type in ('pothole', 'crack', 'waterlogging', 'missing_sign', 'damaged_edge', 'other')),
  description text,
  lat double precision not null,
  lng double precision not null,
  location_point geography(point) generated always as (st_geogfromtext('POINT(' || lng || ' ' || lat || ')')) stored,
  severity text default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  status text default 'open' check (status in ('open', 'verified', 'forwarded', 'in_progress', 'resolved', 'closed')),
  authority_id uuid references public.authorities(id) on delete set null,
  ai_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Report Media table
create table if not exists public.report_media (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.reports(id) on delete cascade not null,
  url text not null,
  media_type text default 'image' check (media_type in ('image', 'video')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Status Updates (Timeline)
create table if not exists public.status_updates (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.reports(id) on delete cascade not null,
  status text not null,
  comment text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.authorities enable row level security;
alter table public.reports enable row level security;
alter table public.report_media enable row level security;
alter table public.status_updates enable row level security;

-- Policies
-- Profiles: Users can view their own profile, admins can view all
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Reports: Everyone can view, citizens can create, admins can update
create policy "Anyone can view reports" on public.reports for select using (true);
create policy "Citizens can create reports" on public.reports for insert with check (auth.role() = 'authenticated');
create policy "Admins/Reviewers can update reports" on public.reports for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'reviewer'))
);
