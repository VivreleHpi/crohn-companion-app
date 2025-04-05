
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { setupRealtimeSubscription } from './realtimeSubscription';

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

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build the query using the valid table name and type assertion to avoid deep type instantiation
        let query = supabase
          .from(tableName)
          .select(options?.select || '*') as any;
        
        // Filter by user by default
        if (user.id) {
          query = query.eq('user_id', user.id);
        }
        
        // Add other filters if needed
        if (options?.column && options?.value !== undefined) {
          query = query.eq(options.column, options.value);
        }
        
        // Add ordering if specified
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending 
          });
        }
        
        // Add limit if specified
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        // Execute the query
        const { data: result, error } = await query;
        
        if (error) throw error;
        
        setData(result as T[]);
      } catch (err: any) {
        console.error(`Error retrieving data from ${tableName}:`, err);
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

    // Set up realtime subscription
    const cleanupSubscription = setupRealtimeSubscription<T>(
      tableName,
      user.id, 
      setData,
      options
    );

    return cleanupSubscription;
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};
