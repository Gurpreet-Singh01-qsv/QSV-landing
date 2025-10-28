-- Fix form submission after security changes

-- 1. Make sure anonymous users can still insert emails (for the form)
DROP POLICY IF EXISTS "Allow anonymous email submissions" ON waitlist;

CREATE POLICY "Allow anonymous email submissions" ON waitlist
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 2. Also allow authenticated users to insert
CREATE POLICY "Allow authenticated email submissions" ON waitlist
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- 3. Keep reads restricted to authenticated only
DROP POLICY IF EXISTS "Allow authenticated reads only" ON waitlist;

CREATE POLICY "Allow authenticated reads only" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- 4. Check current policies (for debugging)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'waitlist';