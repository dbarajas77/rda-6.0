import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing Supabase URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase anon key');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
