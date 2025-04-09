
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';
import { useToast } from '@/hooks/use-toast';

// Function for setting up real-time subscription
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
  console.log(`Setting up real-time subscription for ${tableName} (user ${userId})`);
  
  // Créer une chaîne de filtrage pour RLS
  const filterString = userId ? `user_id=eq.${userId}` : undefined;
  
  // Créer un nom de canal unique pour chaque utilisateur et table
  const channelName = `realtime:${tableName}:user_${userId}`;
  
  try {
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: tableName,
        filter: filterString
      }, (payload) => {
        console.log(`[Realtime] Change received for ${tableName}:`, payload);
        
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
              console.log(`[Realtime] Added new ${tableName} item to state`);
            }
          } else if (payload.eventType === 'UPDATE') {
            setData((currentData) => 
              currentData.map((item: any) => 
                item.id === payload.new.id ? payload.new as T : item
              )
            );
            console.log(`[Realtime] Updated ${tableName} item in state`);
          } else if (payload.eventType === 'DELETE') {
            setData((currentData) => 
              currentData.filter((item: any) => item.id !== payload.old.id)
            );
            console.log(`[Realtime] Removed ${tableName} item from state`);
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
