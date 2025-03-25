
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Obtenez les variables d'environnement ou utilisez des valeurs par défaut temporaires
// IMPORTANT: Remplacez ces valeurs par vos propres valeurs de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Les variables d\'environnement SUPABASE ne sont pas définies. Utilisation de valeurs par défaut pour le développement uniquement.');
  
  // Afficher un toast d'avertissement uniquement en mode développement
  if (import.meta.env.DEV) {
    // Ajout d'un délai pour s'assurer que l'UI est chargée avant d'afficher le toast
    setTimeout(() => {
      toast({
        title: "Configuration Supabase incomplète",
        description: "Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans vos variables d'environnement.",
        variant: "destructive",
      });
    }, 1000);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction utilitaire pour vérifier si la configuration Supabase est valide
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};
