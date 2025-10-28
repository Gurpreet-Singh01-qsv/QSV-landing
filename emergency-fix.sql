-- Emergency fix: Temporarily disable RLS to get form working

-- 1. Disable RLS temporarily
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- 2. Check if this fixes the form, then we can re-enable with proper policies

-- 3. To re-enable later with working policies:
-- ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all operations" ON waitlist
--   FOR ALL 
--   TO anon, authenticated
--   USING (true)
--   WITH CHECK (true);