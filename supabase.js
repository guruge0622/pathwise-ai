import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project values.
const SUPABASE_URL = 'https://eqaaglsxxlzywafkoabh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ypdYiGzpcqDmKQU4jOvt1Q_Ve8cPrf7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
