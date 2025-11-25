-- Fix Row Level Security (RLS) permissions for all tables
-- Run this in Supabase SQL Editor if you're getting permission denied errors

-- Enable RLS on tables (if not already enabled)
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_pool_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role full access to training_enrollments" ON training_enrollments;
DROP POLICY IF EXISTS "Allow service role full access to discovery_calls" ON discovery_calls;
DROP POLICY IF EXISTS "Allow service role full access to talent_pool_profiles" ON talent_pool_profiles;

-- Create policies that allow service_role (backend API) full access
CREATE POLICY "Allow service role full access to training_enrollments"
ON training_enrollments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role full access to discovery_calls"
ON discovery_calls
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role full access to talent_pool_profiles"
ON talent_pool_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also allow authenticated users to insert their own data
CREATE POLICY "Allow authenticated insert to training_enrollments"
ON training_enrollments
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to discovery_calls"
ON discovery_calls
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to talent_pool_profiles"
ON talent_pool_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anonymous inserts (for public forms)
CREATE POLICY "Allow anon insert to training_enrollments"
ON training_enrollments
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anon insert to discovery_calls"
ON discovery_calls
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anon insert to talent_pool_profiles"
ON talent_pool_profiles
FOR INSERT
TO anon
WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('training_enrollments', 'discovery_calls', 'talent_pool_profiles')
ORDER BY tablename, policyname;
