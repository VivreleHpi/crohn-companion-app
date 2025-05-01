import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';
import { setupRealtimeSubscription } from './realtimeSubscription';
import { useToast } from '@/hooks/use-toast';

// Function to add data with proper typing
export const addData = async <T extends object>(
  tableName: ValidTableName, 
  data: Partial<T> & { user_id?: string; id?: string }
): Promise<{ data: any; error: any }> => {
  try {
    let dataWithUserId = { ...data };
    
    // Traiter différemment les profiles
    if (tableName === 'profiles') {
      // Pour la table profiles, user_id n'est pas nécessaire car le champ de clé primaire est id
      if (!dataWithUserId.id) {
        const currentUser = (await supabase.auth.getUser()).data.user;
        if (currentUser) {
          dataWithUserId.id = currentUser.id;
          // Mais on ajoute quand même user_id pour la cohérence avec les RLS
          dataWithUserId.user_id = currentUser.id;
        }
      }
    } else {
      // Pour toutes les autres tables, s'assurer que user_id est défini
      if (!dataWithUserId.user_id) {
        const currentUser = (await supabase.auth.getUser()).data.user;
        if (currentUser) {
          dataWithUserId.user_id = currentUser.id;
        }
      }
    }
    
    if ((tableName === 'profiles' && !dataWithUserId.id) || 
        (tableName !== 'profiles' && !dataWithUserId.user_id)) {
      console.error('[Supabase] No user ID available for this operation');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    console.log(`[Supabase] Adding data to ${tableName}:`, dataWithUserId);
    
    // Using type assertion to overcome type compatibility issues
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(dataWithUserId as any)
      .select();
    
    if (error) {
      console.error(`[Supabase] Error adding data to ${tableName}:`, error);
    } else {
      console.log(`[Supabase] Successfully added data to ${tableName}:`, result);
    }
    
    return { data: result, error };
  } catch (error) {
    console.error(`[Supabase] Error adding data to ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to update data with proper typing
export const updateData = async <T extends object>(
  tableName: ValidTableName,
  id: string,
  data: Partial<T> & { user_id?: string }
): Promise<{ data: any; error: any }> => {
  try {
    console.log(`[Supabase] Updating data in ${tableName} with id ${id}:`, data);
    
    // Pour les profils, vérifier si nous avons besoin d'ajouter user_id
    if (tableName === 'profiles') {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (currentUser && !data.hasOwnProperty('user_id')) {
        (data as any).user_id = currentUser.id;
      }
    }
    
    // Utiliser le bon champ pour la clause WHERE (id pour profiles, id pour les autres tables)
    const whereField = 'id';
    
    // Using type assertion to overcome type compatibility issues
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data as any)
      .eq(whereField, id)
      .select();
    
    if (error) {
      console.error(`[Supabase] Error updating data in ${tableName}:`, error);
    } else {
      console.log(`[Supabase] Successfully updated data in ${tableName}:`, result);
    }
    
    return { data: result, error };
  } catch (error) {
    console.error(`[Supabase] Error updating data in ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to delete data with proper typing
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
    } else {
      console.log(`[Supabase] Successfully deleted data from ${tableName} with id ${id}`);
    }
    
    return { error };
  } catch (error) {
    console.error(`[Supabase] Error deleting data from ${tableName}:`, error);
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
    
    // Filtrer par utilisateur différemment selon la table
    if (tableName === 'profiles') {
      // Pour les profils, filtrer par id
      if (userId) {
        query = query.eq('id', userId);
      }
    } else {
      // Pour toutes les autres tables, filtrer par user_id
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
