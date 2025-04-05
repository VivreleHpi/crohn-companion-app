
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';

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
