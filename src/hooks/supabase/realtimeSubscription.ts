
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';
import { useToast } from '@/hooks/use-toast';

/**
 * Sets up a realtime subscription to a Supabase table
 */
export const setupRealtimeSubscription = <T>(
  tableName: ValidTableName,
  userId: string,
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  options?: {
    column?: string;
    value?: any;
    toast?: ReturnType<typeof useToast>['toast'];
  }
): (() => void) => {
  console.log(`[Realtime] Setting up subscription for ${tableName} (user ${userId})`);
  
  // Determine the correct filter field based on table
  const filterField = tableName === 'profiles' ? 'id' : 'user_id';
  const filterString = `${filterField}=eq.${userId}`;
  
  // Create unique channel name
  const channelName = `realtime:${tableName}:user_${userId}`;
  
  try {
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*', // Listen to all events
        schema: 'public',
        table: tableName,
        filter: filterString
      }, (payload) => {
        console.log(`[Realtime] Change received for ${tableName}:`, payload);
        
        try {
          switch (payload.eventType) {
            case 'INSERT': {
              // Apply additional filtering if needed
              if (shouldIncludeItem(payload.new, options)) {
                setData((currentData) => [...currentData, payload.new as T]);
                console.log(`[Realtime] Added new ${tableName} item to state`);
              }
              break;
            }
            
            case 'UPDATE': {
              setData((currentData) => {
                return currentData.map((item: any) => 
                  item.id === payload.new.id ? payload.new as T : item
                );
              });
              console.log(`[Realtime] Updated ${tableName} item in state`);
              break;
            }
            
            case 'DELETE': {
              setData((currentData) => {
                return currentData.filter((item: any) => item.id !== payload.old.id);
              });
              console.log(`[Realtime] Removed ${tableName} item from state`);
              break;
            }
          }
        } catch (err) {
          console.error(`[Realtime] Error handling ${tableName} realtime data:`, err);
          if (options?.toast) {
            options.toast({
              title: "Erreur de synchronisation",
              description: `Problème lors de la mise à jour en temps réel des données de ${tableName}`,
              variant: "destructive",
            });
          }
        }
      })
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status for ${tableName}:`, status);
        if (status !== 'SUBSCRIBED' && options?.toast) {
          options.toast({
            title: "Problème de connexion",
            description: "La synchronisation en temps réel pourrait ne pas fonctionner correctement",
            variant: "destructive",
          });
        }
      });

    // Return cleanup function
    return () => {
      console.log(`[Realtime] Cleaning up subscription for ${tableName}`);
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error(`[Realtime] Error setting up subscription for ${tableName}:`, error);
    if (options?.toast) {
      options.toast({
        title: "Erreur de connexion",
        description: "Impossible d'établir la synchronisation en temps réel",
        variant: "destructive",
      });
    }
    return () => {}; // Return empty cleanup function
  }
};

/**
 * Helper function to determine if an item should be included based on filter options
 */
function shouldIncludeItem(item: any, options?: { column?: string; value?: any }): boolean {
  if (!options || !options.column || options.value === undefined) {
    return true;
  }
  
  return item[options.column] === options.value;
}
