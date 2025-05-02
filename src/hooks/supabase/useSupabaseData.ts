
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchDataWithRealtime } from './fetchDataWithRealtime';

// Create a union type of all allowed table names
export type ValidTableName = 'medication_schedule' | 'medications' | 'profiles' | 'stools' | 'symptoms';

/**
 * Generic hook for fetching data from Supabase with realtime updates
 */
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
        
        cleanupFunction = cleanup;
      } catch (err: any) {
        console.error(`[useSupabaseData] Error retrieving data from ${tableName}:`, err);
        setError(err);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de récupérer les données de ${tableName}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup on component unmount
    return () => {
      console.log(`[useSupabaseData] Cleaning up subscriptions for ${tableName}`);
      cleanupFunction();
    };
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};
