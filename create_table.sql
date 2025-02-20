-- Drop existing table and dependencies
DROP TABLE IF EXISTS public.time_spent CASCADE;
DROP TABLE IF EXISTS public.fetch_history CASCADE;

-- Helper functions for generated columns
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

-- Create time_spent table
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

-- Create fetch_history table
CREATE TABLE public.fetch_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  records_count integer NOT NULL,
  status text NOT NULL,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX time_spent_user_email_idx ON public.time_spent(user_email);
CREATE INDEX time_spent_month_idx ON public.time_spent(month);
CREATE INDEX time_spent_year_idx ON public.time_spent(year);
CREATE INDEX time_spent_project_id_idx ON public.time_spent(project_id);
CREATE INDEX time_spent_issue_id_idx ON public.time_spent(issue_id);
CREATE INDEX fetch_history_user_email_idx ON public.fetch_history(user_email); 