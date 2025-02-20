/**
 * GitLab Time Spent - Database Setup
 * 
 * This script sets up the complete database structure for the GitLab Time Spent application.
 * Run this script to create or recreate the entire database structure.
 */

/*
This script sets up the GitLab Time Spent application database.
It will:
1. Create helper functions for generated columns
2. Create the time_spent table with indexes
3. Create functions to calculate time spent
4. Create row level security policies
*/

-- Step 1: Create helper functions
DO $$ BEGIN RAISE NOTICE 'Creating helper functions...'; END $$;

CREATE OR REPLACE FUNCTION get_month_str(ts timestamptz)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT to_char(date_trunc('month', $1)::date, 'YYYY-MM')
$$;

CREATE OR REPLACE FUNCTION get_year_str(ts timestamptz)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT to_char(date_trunc('year', $1)::date, 'YYYY')
$$;

-- Step 2: Create time_spent table
DO $$ BEGIN RAISE NOTICE 'Creating time_spent table...'; END $$;

DROP TABLE IF EXISTS public.time_spent CASCADE;

CREATE TABLE public.time_spent (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  project_id text NOT NULL,
  project_name text NOT NULL,
  issue_id text NOT NULL,
  issue_title text NOT NULL,
  time_spent numeric NOT NULL,
  spent_at timestamptz NOT NULL DEFAULT now(),
  month text GENERATED ALWAYS AS (get_month_str(spent_at)) STORED,
  year text GENERATED ALWAYS AS (get_year_str(spent_at)) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX time_spent_user_email_idx ON public.time_spent(user_email);
CREATE INDEX time_spent_month_idx ON public.time_spent(month);
CREATE INDEX time_spent_year_idx ON public.time_spent(year);
CREATE INDEX time_spent_project_id_idx ON public.time_spent(project_id);
CREATE INDEX time_spent_issue_id_idx ON public.time_spent(issue_id);

-- Step 3: Create functions
DO $$ BEGIN RAISE NOTICE 'Creating functions...'; END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS get_time_spent_by_month(text, text);
DROP FUNCTION IF EXISTS get_time_spent_by_year(text, text);

-- Function to get total time spent by month
CREATE OR REPLACE FUNCTION get_time_spent_by_month(
  p_user_email text,
  p_month text
)
RETURNS TABLE (
  month text,
  total_time numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    time_spent.month,
    COALESCE(CAST(SUM(time_spent.time_spent) as numeric), 0) as total_time
  FROM time_spent
  WHERE user_email = p_user_email
    AND month = p_month
  GROUP BY month;
END;
$$;

-- Function to get total time spent by year
CREATE OR REPLACE FUNCTION get_time_spent_by_year(
  p_user_email text,
  p_year text
)
RETURNS TABLE (
  year text,
  total_time numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    time_spent.year,
    COALESCE(CAST(SUM(time_spent.time_spent) as numeric), 0) as total_time
  FROM time_spent
  WHERE user_email = p_user_email
    AND year = p_year
  GROUP BY year;
END;
$$;

-- Step 4: Create policies
DO $$ BEGIN RAISE NOTICE 'Creating policies...'; END $$;

-- Enable Row Level Security
ALTER TABLE public.time_spent ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.time_spent;
DROP POLICY IF EXISTS "Enable insert based on user email" ON public.time_spent;
DROP POLICY IF EXISTS "Enable update based on user email" ON public.time_spent;
DROP POLICY IF EXISTS "Enable delete based on user email" ON public.time_spent;

-- Create read policy
CREATE POLICY "Enable read access for all users"
ON public.time_spent
FOR SELECT
TO public
USING (true);

-- Create insert policy
CREATE POLICY "Enable insert based on user email"
ON public.time_spent
FOR INSERT
TO public
WITH CHECK (user_email = current_setting('app.user_email', true));

-- Create update policy
CREATE POLICY "Enable update based on user email"
ON public.time_spent
FOR UPDATE
TO public
USING (user_email = current_setting('app.user_email', true))
WITH CHECK (user_email = current_setting('app.user_email', true));

-- Create delete policy
CREATE POLICY "Enable delete based on user email"
ON public.time_spent
FOR DELETE
TO public
USING (user_email = current_setting('app.user_email', true));

-- Verify setup
DO $$ BEGIN RAISE NOTICE 'Setup completed successfully!'; END $$; 