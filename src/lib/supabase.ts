
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// URL et clé anon de Supabase (déjà définies dans le projet)
const supabaseUrl = 'https://lwxhputpykxnyiiwlvhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eGhwdXRweWt4bnlpaXdsdmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzI0MzYsImV4cCI6MjA1ODUwODQzNn0.nY30RqG11_5F7wPYnUHcte4XAtkjEK8QutaXiKjM4LA';

// Configuration du client Supabase avec les options d'authentification
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Important pour les callbacks OAuth
  }
});

// Fonction utilitaire pour vérifier si la configuration Supabase est valide
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-supabase-url.supabase.co' as string;
};
