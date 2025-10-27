# QSV Database Setup

## 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project: "QSV Landing"

## 2. Create Waitlist Table
Run this SQL in Supabase SQL Editor:

```sql
-- Create waitlist table
CREATE TABLE waitlist (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'landing_page'
);

-- Create index for faster email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Enable Row Level Security (optional)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT TO authenticated
  USING (true);
```

## 3. Get API Keys
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - Anon/Public key

## 4. Update Environment Variables
Add to your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Test the Setup
1. Submit an email on your landing page
2. Check Supabase dashboard → Table Editor → waitlist
3. Visit `/admin` to see the dashboard

## Admin Dashboard
- Access: `your-domain.com/admin`
- Features:
  - View all signups
  - Export to CSV
  - Real-time stats
  - Filter by date