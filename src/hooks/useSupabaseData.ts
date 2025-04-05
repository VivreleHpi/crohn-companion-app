
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Create a union type of all allowed table names as string literals for strict type checking
type ValidTableName = 'medication_schedule' | 'medications' | 'profiles' | 'stools' | 'symptoms';

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
    const channel = supabase
      .channel(`public:${tableName}:user_id=eq.${user.id}`)
      .on('postgres_changes', {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: tableName,
        filter: user.id ? `user_id=eq.${user.id}` : undefined
      }, (payload) => {
        console.log('Change received:', payload);
        
        try {
          // Handle the different event types
          if (payload.eventType === 'INSERT') {
            // Check if we need to apply additional filters
            let shouldAdd = true;
            if (options?.column && options?.value !== undefined && 
                payload.new && payload.new[options.column] !== options.value) {
              shouldAdd = false;
            }
            
            if (shouldAdd) {
              setData((currentData) => [...currentData, payload.new as T]);
            }
          } else if (payload.eventType === 'UPDATE') {
            setData((currentData) => 
              currentData.map((item: any) => 
                item.id === payload.new.id ? payload.new as T : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((currentData) => 
              currentData.filter((item: any) => item.id !== payload.old.id)
            );
          }
        } catch (err) {
          console.error('Error handling realtime data:', err);
        }
      })
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${tableName}:`, status);
      });

    // Cleanup subscription when component unmounts
    return () => {
      console.log(`Cleaning up realtime subscription for ${tableName}`);
      supabase.removeChannel(channel);
    };
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};

// Function to add data with proper typing
export const addData = async <T extends object>(
  tableName: ValidTableName, 
  data: Omit<T, 'user_id'> & { user_id?: string }
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
