import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_KEY ?? import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or key. Set SUPABASE_URL and SUPABASE_KEY in your environment.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
