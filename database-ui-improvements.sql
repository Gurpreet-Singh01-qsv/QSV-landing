-- Improve Supabase Table UI and Structure

-- 1. Add better column comments for clarity in Supabase UI
COMMENT ON TABLE waitlist IS 'QSV Multiverse waitlist signups with analytics tracking';

COMMENT ON COLUMN waitlist.id IS 'Unique identifier';
COMMENT ON COLUMN waitlist.email IS 'User email address (unique)';
COMMENT ON COLUMN waitlist.created_at IS 'Signup timestamp';
COMMENT ON COLUMN waitlist.source IS 'Traffic source (landing_page, referral, etc.)';
COMMENT ON COLUMN waitlist.ip_address IS 'User IP address for analytics';
COMMENT ON COLUMN waitlist.user_agent IS 'Browser/device information';
COMMENT ON COLUMN waitlist.referrer IS 'Referring website URL';
COMMENT ON COLUMN waitlist.utm_source IS 'UTM campaign source';
COMMENT ON COLUMN waitlist.utm_medium IS 'UTM campaign medium';
COMMENT ON COLUMN waitlist.utm_campaign IS 'UTM campaign name';
COMMENT ON COLUMN waitlist.country IS 'User country (from IP geolocation)';
COMMENT ON COLUMN waitlist.city IS 'User city (from IP geolocation)';
COMMENT ON COLUMN waitlist.status IS 'Signup status (active, unsubscribed, etc.)';
COMMENT ON COLUMN waitlist.notes IS 'Admin notes about this signup';

-- 2. Create a view for better data presentation in Supabase
CREATE OR REPLACE VIEW waitlist_summary AS
SELECT 
  id,
  email,
  created_at::date as signup_date,
  created_at::time as signup_time,
  COALESCE(utm_source, source, 'direct') as traffic_source,
  COALESCE(country, 'Unknown') as location,
  status,
  CASE 
    WHEN created_at >= CURRENT_DATE THEN 'Today'
    WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 'This Week'
    WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 'This Month'
    ELSE 'Older'
  END as signup_period,
  notes
FROM waitlist
ORDER BY created_at DESC;

COMMENT ON VIEW waitlist_summary IS 'Formatted view of waitlist data for better readability';

-- 3. Create analytics views for quick insights
CREATE OR REPLACE VIEW daily_signups AS
SELECT 
  created_at::date as date,
  COUNT(*) as signups,
  COUNT(DISTINCT COALESCE(utm_source, source, 'direct')) as unique_sources,
  COUNT(DISTINCT country) as unique_countries
FROM waitlist 
GROUP BY created_at::date 
ORDER BY date DESC;

CREATE OR REPLACE VIEW source_analytics AS
SELECT 
  COALESCE(utm_source, source, 'direct') as source,
  COUNT(*) as total_signups,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_signups,
  MIN(created_at) as first_signup,
  MAX(created_at) as latest_signup
FROM waitlist 
GROUP BY COALESCE(utm_source, source, 'direct')
ORDER BY total_signups DESC;

CREATE OR REPLACE VIEW country_analytics AS
SELECT 
  COALESCE(country, 'Unknown') as country,
  COUNT(*) as total_signups,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM waitlist), 2) as percentage
FROM waitlist 
GROUP BY COALESCE(country, 'Unknown')
ORDER BY total_signups DESC;

-- 4. Add some sample data for testing (optional - remove if you don't want test data)
-- INSERT INTO waitlist (email, utm_source, utm_medium, utm_campaign, country, city) VALUES
-- ('test1@example.com', 'google', 'cpc', 'launch_campaign', 'United States', 'New York'),
-- ('test2@example.com', 'facebook', 'social', 'launch_campaign', 'Canada', 'Toronto'),
-- ('test3@example.com', 'twitter', 'social', 'launch_campaign', 'United Kingdom', 'London')
-- ON CONFLICT (email) DO NOTHING;

-- 5. Create a function to get quick stats (useful for API calls)
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_signups', (SELECT COUNT(*) FROM waitlist),
    'today_signups', (SELECT COUNT(*) FROM waitlist WHERE created_at >= CURRENT_DATE),
    'week_signups', (SELECT COUNT(*) FROM waitlist WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'month_signups', (SELECT COUNT(*) FROM waitlist WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'),
    'top_source', (SELECT COALESCE(utm_source, source, 'direct') FROM waitlist GROUP BY COALESCE(utm_source, source, 'direct') ORDER BY COUNT(*) DESC LIMIT 1),
    'top_country', (SELECT COALESCE(country, 'Unknown') FROM waitlist WHERE country IS NOT NULL GROUP BY country ORDER BY COUNT(*) DESC LIMIT 1)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;