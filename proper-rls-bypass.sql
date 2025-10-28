-- Proper RLS with service role bypass

-- 1. Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies to start clean
DROP POLICY IF EXISTS "Allow inserts for everyone" ON waitlist;
DROP POLICY IF EXISTS "Allow reads for authenticated users" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous email submissions" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated email submissions" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads only" ON waitlist;
DROP POLICY IF EXISTS "Allow public reads" ON waitlist;

-- 3. Create policies that work with service role
-- Allow service role to bypass RLS (this is what your API uses)
CREATE POLICY "Service role bypass" ON waitlist
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Authenticated users can read" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow anonymous users to insert only (for form submissions)
CREATE POLICY "Anonymous users can insert" ON waitlist
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON waitlist TO service_role;
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON waitlist TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON waitlist TO authenticated;