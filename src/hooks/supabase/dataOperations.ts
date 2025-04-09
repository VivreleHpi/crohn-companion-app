
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';
import { setupRealtimeSubscription } from './realtimeSubscription';
import { useToast } from '@/hooks/use-toast';

// Function to add data with proper typing
export const addData = async <T extends object>(
  tableName: ValidTableName, 
  data: Partial<T> & { user_id?: string }
): Promise<{ data: any; error: any }> => {
  try {
    const dataWithUserId = { 
      ...data, 
      user_id: data.user_id || (supabase.auth.getUser ? (await supabase.auth.getUser()).data.user?.id : null)
    };
    
    if (!dataWithUserId.user_id) {
      console.error('No user ID available for this operation');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    console.log(`Adding data to ${tableName}:`, dataWithUserId);
    
    // Using type assertion to overcome type compatibility issues
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(dataWithUserId as any)
      .select();
    
    if (error) {
      console.error(`Error adding data to ${tableName}:`, error);
    } else {
      console.log(`Successfully added data to ${tableName}:`, result);
    }
    
    return { data: result, error };
  } catch (error) {
    console.error(`Error adding data to ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to update data with proper typing
export const updateData = async <T extends object>(
  tableName: ValidTableName,
  id: string,
  data: Partial<T>
): Promise<{ data: any; error: any }> => {
  try {
    console.log(`Updating data in ${tableName} with id ${id}:`, data);
    
    // Using type assertion to overcome type compatibility issues
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data as any)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating data in ${tableName}:`, error);
    } else {
      console.log(`Successfully updated data in ${tableName}:`, result);
    }
    
    return { data: result, error };
  } catch (error) {
    console.error(`Error updating data in ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to delete data with proper typing
export const deleteData = async (
  tableName: ValidTableName,
  id: string
): Promise<{ error: any }> => {
  try {
    console.log(`Deleting data from ${tableName} with id ${id}`);
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting data from ${tableName}:`, error);
    } else {
      console.log(`Successfully deleted data from ${tableName} with id ${id}`);
    }
    
    return { error };
  } catch (error) {
    console.error(`Error deleting data from ${tableName}:`, error);
    return { error };
  }
};

// Fonction pour récupérer les données avec mise à jour en temps réel
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
    
    // Filter by user by default
    if (userId) {
      query = query.eq('user_id', userId);
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
    
    if (error) {
      console.error(`Error retrieving data from ${tableName}:`, error);
      if (options?.toast) {
        options.toast({
          title: "Erreur de chargement",
          description: `Impossible de récupérer les données de ${tableName}`,
          variant: "destructive",
        });
      }
      return { error, cleanup: () => {} };
    }
    
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
    console.error(`Error setting up realtime for ${tableName}:`, error);
    return { error, cleanup: () => {} };
  }
};
