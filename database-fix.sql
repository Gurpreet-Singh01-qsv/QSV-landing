-- Fix the RLS policies to allow form submissions

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Allow public email submissions" ON waitlist;

-- Create a simpler policy that allows anonymous inserts
CREATE POLICY "Allow anonymous email submissions" ON waitlist
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Keep the read policy for authenticated users (admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated reads" ON waitlist;
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- Also allow public reads for now (we can restrict this later)
CREATE POLICY "Allow public reads" ON waitlist
  FOR SELECT 
  TO anon
  USING (true);