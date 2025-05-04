
import { supabase } from '@/lib/supabase';
import { ValidTableName } from './useSupabaseData';
import { setupRealtimeSubscription } from './realtimeSubscription';
import { useToast } from '@/hooks/use-toast';

/**
 * Function to fetch data with realtime updates
 */
export const fetchDataWithRealtime = async <T>(
  tableName: ValidTableName,
  userId: string,
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  options?: {
    column?: string;
    value?: any;
    select?: string;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
    toast?: ReturnType<typeof useToast>['toast'];
  }
): Promise<{ error: any; cleanup: () => void }> => {
  try {
    // Build the query
    let query = supabase
      .from(tableName)
      .select(options?.select || '*') as any;
    
    // Filter by user ID differently depending on table
    if (tableName === 'profiles') {
      // For profiles, filter by id
      if (userId) {
        query = query.eq('id', userId);
      }
    } else {
      // For all other tables, filter by user_id
      if (userId) {
        query = query.eq('user_id', userId);
      }
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
    console.log(`[Supabase] Executing query for ${tableName}:`, query);
    const { data: result, error } = await query;
    
    if (error) {
      console.error(`[Supabase] Error retrieving data from ${tableName}:`, error);
      if (options?.toast) {
        options.toast({
          title: "Erreur de chargement",
          description: `Impossible de récupérer les données de ${tableName}`,
          variant: "destructive",
        });
      }
      return { error, cleanup: () => {} };
    }
    
    console.log(`[Supabase] Retrieved data for ${tableName}:`, result);
    
    // Set the initial data
    setData(result as T[]);
    
    // Set up realtime subscription
    const cleanupSubscription = setupRealtimeSubscription<T>(
      tableName,
      userId,
      setData,
      options
    );
    
    return { error: null, cleanup: cleanupSubscription };
  } catch (error) {
    console.error(`[Supabase] Error setting up realtime for ${tableName}:`, error);
    return { error, cleanup: () => {} };
  }
};
