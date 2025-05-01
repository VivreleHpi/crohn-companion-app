
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchDataWithRealtime } from './dataOperations';

// Create a union type of all allowed table names as string literals for strict type checking
export type ValidTableName = 'medication_schedule' | 'medications' | 'profiles' | 'stools' | 'symptoms';

// Generic hook for fetching data from Supabase
export const useSupabaseData = <T>(
  tableName: ValidTableName,
  options?: {
    column?: string;
    value?: any;
    select?: string;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
  }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Don't try to fetch data if user isn't logged in
    if (!user) {
      setLoading(false);
      return;
    }

    let cleanupFunction = () => {};

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`[useSupabaseData] Fetching data from ${tableName} for user ${user.id}`);
        
        // Utilisation de notre fonction pour récupérer les données avec temps réel
        const { error: fetchError, cleanup } = await fetchDataWithRealtime<T>(
          tableName,
          user.id,
          setData,
          {
            ...options,
            toast
          }
        );
        
        if (fetchError) throw fetchError;
        
        // Stocker la fonction de nettoyage pour l'utiliser lors du démontage du composant
        cleanupFunction = cleanup;
        
      } catch (err: any) {
        console.error(`[useSupabaseData] Error retrieving data from ${tableName}:`, err);
        setError(err);
        toast({
          title: "Loading error",
          description: `Unable to retrieve data from ${tableName}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Nettoyage lors du démontage du composant
    return () => {
      console.log(`[useSupabaseData] Cleaning up subscriptions for ${tableName}`);
      cleanupFunction();
    };
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};
