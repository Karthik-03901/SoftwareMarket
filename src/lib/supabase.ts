import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'softmarket',
    },
  },
})

// Helper function to test connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1)

    if (error && error.code === '42P01') {
      // Table doesn't exist - this is expected if no tables are created yet
      console.log('✅ Supabase connected successfully (no tables yet)')
      return { connected: true, message: 'Connected - Database is empty' }
    }

    if (error) {
      console.error('❌ Supabase connection error:', error)
      return { connected: false, error: error.message }
    }

    console.log('✅ Supabase connected successfully')
    return { connected: true, message: 'Connected successfully', data }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err)
    return { connected: false, error: String(err) }
  }
}

// Export types for TypeScript
export type { User, Session } from '@supabase/supabase-js'
