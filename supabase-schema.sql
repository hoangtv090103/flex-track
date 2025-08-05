-- FlexTrack Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table for user data (optional, for future use)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create workouts table
create table if not exists workouts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Clerk user ID (not UUID)
  date timestamp with time zone not null,
  exercises jsonb not null default '[]'::jsonb,
  duration integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists workouts_user_id_idx on workouts (user_id);
create index if not exists workouts_date_idx on workouts (date desc);
create index if not exists workouts_user_id_date_idx on workouts (user_id, date desc);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table workouts enable row level security;

-- Create policies for profiles table
drop policy if exists "Allow authenticated users to view profiles" on profiles;
create policy "Allow authenticated users to view profiles" on profiles
  for select using (true);

drop policy if exists "Allow users to update own profile" on profiles;
create policy "Allow users to update own profile" on profiles
  for update using (auth.uid() = id);

drop policy if exists "Allow users to insert own profile" on profiles;
create policy "Allow users to insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Create policies for workouts table
-- Note: We're using user_id (text) from Clerk, not auth.uid() from Supabase Auth

-- For development: Allow all operations (you should restrict this in production)
drop policy if exists "Allow all operations for authenticated users" on workouts;
create policy "Allow all operations for authenticated users" on workouts
  for all using (true);

-- For production, you would use more restrictive policies like:
-- drop policy if exists "Allow users to view own workouts" on workouts;
-- create policy "Allow users to view own workouts" on workouts
--   for select using (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- drop policy if exists "Allow users to insert own workouts" on workouts;
-- create policy "Allow users to insert own workouts" on workouts
--   for insert with check (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- drop policy if exists "Allow users to update own workouts" on workouts;
-- create policy "Allow users to update own workouts" on workouts
--   for update using (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- drop policy if exists "Allow users to delete own workouts" on workouts;
-- create policy "Allow users to delete own workouts" on workouts
--   for delete using (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Create a function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers to automatically update updated_at
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

drop trigger if exists update_workouts_updated_at on workouts;
create trigger update_workouts_updated_at
  before update on workouts
  for each row execute function update_updated_at_column();

-- Insert some sample data for testing (optional)
-- insert into workouts (user_id, date, exercises, duration, notes) values
-- (
--   'sample-user-id',
--   now() - interval '1 day',
--   '[
--     {
--       "id": "1",
--       "name": "Push-ups",
--       "sets": [
--         {"id": "1", "reps": 10, "weight": 0, "completed": true},
--         {"id": "2", "reps": 12, "weight": 0, "completed": true}
--       ],
--       "notes": ""
--     }
--   ]'::jsonb,
--   30,
--   'Sample workout'
-- );

-- Verify the schema
select 
  schemaname,
  tablename,
  tableowner
from pg_tables 
where schemaname = 'public' 
  and tablename in ('profiles', 'workouts');

-- Check if RLS is enabled
select 
  schemaname,
  tablename,
  rowsecurity
from pg_tables 
where schemaname = 'public' 
  and tablename in ('profiles', 'workouts');

-- Check policies
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
from pg_policies 
where schemaname = 'public' 
  and tablename in ('profiles', 'workouts');

-- Schema setup complete!
-- Your Supabase database is now ready for FlexTrack!
