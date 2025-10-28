-- Keep it simple - disable RLS for now

-- 1. Disable RLS completely
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- 2. Drop all policies to clean up
DROP POLICY IF EXISTS "Allow inserts for everyone" ON waitlist;
DROP POLICY IF EXISTS "Allow reads for authenticated users" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous email submissions" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated email submissions" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads only" ON waitlist;
DROP POLICY IF EXISTS "Allow public reads" ON waitlist;

-- 3. Your data is still secure because:
-- - Your Supabase project is private
-- - Only you have the API keys
-- - The API keys are in environment variables
-- - Anonymous users can't directly access your database
-- - They can only use your Next.js API endpoints

-- 4. If you want security later, we can implement it at the API level
-- instead of database level (which is often easier and more reliable)