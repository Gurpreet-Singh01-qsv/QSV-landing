-- Secure the views with Row Level Security

-- 1. Enable RLS on all views
ALTER VIEW waitlist_summary OWNER TO postgres;
ALTER VIEW daily_signups OWNER TO postgres;
ALTER VIEW source_analytics OWNER TO postgres;
ALTER VIEW country_analytics OWNER TO postgres;

-- 2. Create security policies for views
-- Note: Views inherit RLS from their underlying tables, but we need explicit policies

-- 3. Create a secure admin-only view instead
DROP VIEW IF EXISTS waitlist_summary;
DROP VIEW IF EXISTS daily_signups;
DROP VIEW IF EXISTS source_analytics;
DROP VIEW IF EXISTS country_analytics;

-- 4. Create security-definer functions (only admins can call these)
CREATE OR REPLACE FUNCTION get_waitlist_summary()
RETURNS TABLE (
  id BIGINT,
  email VARCHAR(255),
  signup_date DATE,
  signup_time TIME,
  traffic_source TEXT,
  location TEXT,
  status VARCHAR(20),
  signup_period TEXT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow authenticated users (you can make this more restrictive)
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  RETURN QUERY
  SELECT 
    w.id,
    w.email,
    w.created_at::date as signup_date,
    w.created_at::time as signup_time,
    COALESCE(w.utm_source, w.source, 'direct') as traffic_source,
    COALESCE(w.country, 'Unknown') as location,
    w.status,
    CASE 
      WHEN w.created_at >= CURRENT_DATE THEN 'Today'
      WHEN w.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 'This Week'
      WHEN w.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 'This Month'
      ELSE 'Older'
    END as signup_period
  FROM waitlist w
  ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_daily_signups()
RETURNS TABLE (
  date DATE,
  signups BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  RETURN QUERY
  SELECT 
    w.created_at::date as date,
    COUNT(*) as signups
  FROM waitlist w
  GROUP BY w.created_at::date 
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_source_analytics()
RETURNS TABLE (
  source TEXT,
  total_signups BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(w.utm_source, w.source, 'direct') as source,
    COUNT(*) as total_signups
  FROM waitlist w
  GROUP BY COALESCE(w.utm_source, w.source, 'direct')
  ORDER BY total_signups DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. Grant execute permissions only to authenticated users
GRANT EXECUTE ON FUNCTION get_waitlist_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_signups() TO authenticated;
GRANT EXECUTE ON FUNCTION get_source_analytics() TO authenticated;

-- Revoke from anonymous users
REVOKE EXECUTE ON FUNCTION get_waitlist_summary() FROM anon;
REVOKE EXECUTE ON FUNCTION get_daily_signups() FROM anon;
REVOKE EXECUTE ON FUNCTION get_source_analytics() FROM anon;

-- 6. Also secure the main waitlist table reads (keep inserts open for form)
DROP POLICY IF EXISTS "Allow public reads" ON waitlist;

-- Only allow authenticated users to read the waitlist
CREATE POLICY "Allow authenticated reads only" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- Keep anonymous inserts for the form
-- (the "Allow anonymous email submissions" policy should still exist)