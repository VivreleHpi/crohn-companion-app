
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

/**
 * Generic type for Supabase operations that ensures proper typing
 * across all database tables
 */
export type SupabaseItem = {
  id?: string;
  user_id?: string;
  [key: string]: any;
};

/**
 * Type helper that maps table names to their row types
 */
type TableRowTypes = {
  'medication_schedule': Database['public']['Tables']['medication_schedule']['Insert'];
  'medications': Database['public']['Tables']['medications']['Insert'];
  'profiles': Database['public']['Tables']['profiles']['Insert'];
  'stools': Database['public']['Tables']['stools']['Insert'];
  'symptoms': Database['public']['Tables']['symptoms']['Insert'];
};

/**
 * Add data to a Supabase table with proper typing and user_id handling
 */
export const addData = async <T extends object>(
  tableName: ValidTableName, 
  data: T & { user_id?: string; id?: string }
): Promise<{ data: any; error: any }> => {
  try {
    // Clone the data to avoid modifying the original
    let dataToInsert = { ...data };
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // For profiles table, use the user.id as the id field
      if (tableName === 'profiles') {
        dataToInsert.id = dataToInsert.id || user.id;
      }
      
      // Always set user_id for RLS policies
      dataToInsert.user_id = dataToInsert.user_id || user.id;
    }
    
    // Verify we have the necessary id fields
    if ((tableName === 'profiles' && !dataToInsert.id) || !dataToInsert.user_id) {
      console.error('[Supabase] No user ID available for operation');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    console.log(`[Supabase] Adding data to ${tableName}:`, dataToInsert);
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(dataToInsert as any)
      .select();
    
    if (error) {
      console.error(`[Supabase] Error adding data to ${tableName}:`, error);
      return { data: null, error };
    }
    
    console.log(`[Supabase] Successfully added data to ${tableName}:`, result);
    return { data: result, error: null };
  } catch (error) {
    console.error(`[Supabase] Error adding data to ${tableName}:`, error);
    return { data: null, error };
  }
};

/**
 * Update data in a Supabase table with proper typing
 */
export const updateData = async <T extends object>(
  tableName: ValidTableName,
  id: string,
  data: Partial<T> & { user_id?: string }
): Promise<{ data: any; error: any }> => {
  try {
    // Clone the data to avoid modifying the original
    let dataToUpdate = { ...data };
    
    // For profiles, ensure user_id is set if needed
    if (tableName === 'profiles' && !dataToUpdate.hasOwnProperty('user_id')) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dataToUpdate.user_id = user.id;
      }
    }
    
    console.log(`[Supabase] Updating data in ${tableName} with id ${id}:`, dataToUpdate);
    
    const { data: result, error } = await supabase
      .from(tableName)
      .update(dataToUpdate as any)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`[Supabase] Error updating data in ${tableName}:`, error);
      return { data: null, error };
    }
    
    console.log(`[Supabase] Successfully updated data in ${tableName}:`, result);
    return { data: result, error: null };
  } catch (error) {
    console.error(`[Supabase] Error updating data in ${tableName}:`, error);
    return { data: null, error };
  }
};

/**
 * Delete data from a Supabase table
 */
export const deleteData = async (
  tableName: ValidTableName,
  id: string
): Promise<{ error: any }> => {
  try {
    console.log(`[Supabase] Deleting data from ${tableName} with id ${id}`);
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[Supabase] Error deleting data from ${tableName}:`, error);
      return { error };
    }
    
    console.log(`[Supabase] Successfully deleted data from ${tableName} with id ${id}`);
    return { error: null };
  } catch (error) {
    console.error(`[Supabase] Error deleting data from ${tableName}:`, error);
    return { error };
  }
};

/**
 * Helper function to get the current user ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};
