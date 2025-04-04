
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Type for valid table names
type TableName = keyof Database['public']['Tables'];

// Generic type for any table row
type AnyTableRow = Database['public']['Tables'][TableName]['Row'];

// Generic hook for fetching data from Supabase
export const useSupabaseData = <T>(
  tableName: TableName,
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
        
        // Build the query with type safety
        let query = supabase
          .from(tableName)
          .select(options?.select || '*');
        
        // Filter by user by default
        query = query.eq('user_id', user.id);
        
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
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};

// Function to add data with proper typing
export const addData = async <T extends Record<string, any>>(
  tableName: TableName, 
  data: T & { user_id: string }
): Promise<{ data: any; error: any }> => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      // Using any here because TypeScript can't correctly infer the types
      // based on the dynamic tableName parameter
      .insert(data as any)
      .select();
    
    return { data: result, error };
  } catch (error) {
    console.error(`Error adding data to ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to update data with proper typing
export const updateData = async <T extends Record<string, any>>(
  tableName: TableName,
  id: string,
  data: Partial<T>
): Promise<{ data: any; error: any }> => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      // Using any here because TypeScript can't correctly infer the types
      // based on the dynamic tableName parameter
      .update(data as any)
      .eq('id', id)
      .select();
    
    return { data: result, error };
  } catch (error) {
    console.error(`Error updating data in ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to delete data with proper typing
export const deleteData = async (
  tableName: TableName,
  id: string
): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    return { error };
  } catch (error) {
    console.error(`Error deleting data from ${tableName}:`, error);
    return { error };
  }
};
