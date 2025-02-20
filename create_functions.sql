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
    ts.month::text,
    ROUND(COALESCE(CAST(SUM(ts.time_spent) as numeric), 0) / 3600, 2) as total_time
  FROM time_spent ts
  WHERE ts.user_email = p_user_email
    AND ts.month = p_month
  GROUP BY ts.month;
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
    ts.year::text,
    ROUND(COALESCE(CAST(SUM(ts.time_spent) as numeric), 0) / 3600, 2) as total_time
  FROM time_spent ts
  WHERE ts.user_email = p_user_email
    AND ts.year = p_year
  GROUP BY ts.year;
END;
$$; 