-- Enhanced Security and Features for QSV Waitlist

-- 1. Re-enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 2. Drop old policies
DROP POLICY IF EXISTS "Enable insert for all users" ON waitlist;
DROP POLICY IF EXISTS "Enable read for all users" ON waitlist;

-- 3. Create secure policies
-- Allow public to insert emails (for form submissions)
CREATE POLICY "Allow public email submissions" ON waitlist
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(email) <= 255
  );

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- 4. Add more detailed columns
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_utm_source ON waitlist(utm_source);
CREATE INDEX IF NOT EXISTS idx_waitlist_country ON waitlist(country);

-- 6. Create admin user (replace with your email)
-- You'll need to sign up with this email in Supabase Auth
-- INSERT INTO auth.users (email, email_confirmed_at, created_at, updated_at)
-- VALUES ('your-admin-email@example.com', NOW(), NOW(), NOW())
-- ON CONFLICT (email) DO NOTHING;

-- 7. Create admin role policy
CREATE POLICY "Admin full access" ON waitlist
  FOR ALL
  TO authenticated
  USING (auth.email() = 'your-admin-email@example.com')
  WITH CHECK (auth.email() = 'your-admin-email@example.com');

-- 8. Add email validation function
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;