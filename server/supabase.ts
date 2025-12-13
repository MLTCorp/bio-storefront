import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/supabase.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check SUPABASE_URL and SUPABASE_ANON_KEY.');
}

// Server-side client with anon key (respects RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export URL for client-side usage
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
});
