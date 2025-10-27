import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database functions
export async function addEmailToWaitlist(email) {
  try {
    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return { success: false, error: 'Email already registered' }
    }

    // Add new email
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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