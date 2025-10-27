import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client-side Supabase client (for frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes - bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database functions
export async function addEmailToWaitlist(email) {
  try {
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .insert([
        {
          email: email,
          created_at: new Date().toISOString(),
          source: 'landing_page'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      
      // Check if it's a duplicate email error
      if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
        return { success: false, error: 'This email is already on our waitlist!' }
      }
      
      return { success: false, error: 'Database error' }
    }

    return { success: true, data: data[0] }
  } catch (err) {
    console.error('Database error:', err)
    return { success: false, error: 'Database connection failed' }
  }
}

export async function getWaitlistEmails() {
  try {
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: 'Failed to fetch emails' }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Database error:', err)
    return { success: false, error: 'Database connection failed' }
  }
}