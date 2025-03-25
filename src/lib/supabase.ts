
import { createClient } from '@supabase/supabase-js';

// Supabase URL est généralement disponible via les paramètres de votre projet Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement SUPABASE ne sont pas définies');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
