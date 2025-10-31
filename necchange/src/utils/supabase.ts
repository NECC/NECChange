// @/utils/supabase.ts
// Create this file at: utils/supabase.ts in your project root

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: Add type safety for your database
// You can generate types from your Supabase project with:
// npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
// 
// Then import and use them like this:
// import { Database } from '@/types/supabase'
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
        