-- Re-enable security with simple, working policies

-- 1. Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 2. Create simple policies that work
-- Allow anyone to insert (for form submissions)
CREATE POLICY "Allow inserts for everyone" ON waitlist
  FOR INSERT 
  WITH CHECK (true);

-- Allow only authenticated users to read (for admin dashboard)
CREATE POLICY "Allow reads for authenticated users" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- 3. Test the policies
-- This should work (form submission):
-- INSERT INTO waitlist (email) VALUES ('test@example.com');

-- This should only work if you're logged into Supabase:
-- SELECT * FROM waitlist LIMIT 1;