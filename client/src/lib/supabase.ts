import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing Supabase URL');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase Anon Key');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {

// SQL query utility function
export async function executeSql(query: string, values?: any[]) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      query_text: query,
      query_params: values
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('SQL Query Error:', error);
    return { data: null, error };
  }
}

    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);