-- Enable Row Level Security first
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
WITH CHECK (true);

-- Create update policy
CREATE POLICY "Enable update based on user email"
ON public.time_spent
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Create delete policy
CREATE POLICY "Enable delete based on user email"
ON public.time_spent
FOR DELETE
TO public
USING (true); 