
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Type for valid table names
type TableName = keyof Database['public']['Tables'];

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
        // @ts-ignore - We're using a valid table name but TypeScript can't infer it perfectly
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
        console.error(`Erreur lors de la récupération des données de ${tableName}:`, err);
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
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};

// Function to add data with proper typing
export const addData = async <T extends Record<string, any>>(
  tableName: TableName, 
  data: T & { user_id: string }
): Promise<{ data: any; error: any }> => {
  try {
    // @ts-ignore - We're using a valid table name but TypeScript can't infer it perfectly
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    return { data: result, error };
  } catch (error) {
    console.error(`Erreur lors de l'ajout de données à ${tableName}:`, error);
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
    // @ts-ignore - We're using a valid table name but TypeScript can't infer it perfectly
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    return { data: result, error };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de données dans ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to delete data with proper typing
export const deleteData = async (
  tableName: TableName,
  id: string
): Promise<{ error: any }> => {
  try {
    // @ts-ignore - We're using a valid table name but TypeScript can't infer it perfectly
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    return { error };
  } catch (error) {
    console.error(`Erreur lors de la suppression de données de ${tableName}:`, error);
    return { error };
  }
};
