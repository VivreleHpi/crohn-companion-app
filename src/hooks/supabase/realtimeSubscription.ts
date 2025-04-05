
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from './useSupabaseData';

// Function for setting up real-time subscription
export const setupRealtimeSubscription = <T>(
  tableName: ValidTableName,
  userId: string,
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  options?: {
    column?: string;
    value?: any;
  }
): (() => void) => {
  console.log(`Setting up real-time subscription for ${tableName} (user ${userId})`);
  
  const channelName = `public:${tableName}:user_id=eq.${userId}`;
  
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', {
      event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
      schema: 'public',
      table: tableName,
      filter: userId ? `user_id=eq.${userId}` : undefined
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
      }
    })
    .subscribe((status) => {
      console.log(`[Realtime] Subscription status for ${tableName}:`, status);
    });

  // Return cleanup function
  return () => {
    console.log(`[Realtime] Cleaning up subscription for ${tableName}`);
    supabase.removeChannel(channel);
  };
};
