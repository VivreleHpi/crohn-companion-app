
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';
import { addData, updateData } from './supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('[useProfile] Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          console.log('[useProfile] Profile found:', data);
          setProfile(data);
        } else {
          console.log('[useProfile] Profile not found, creating new profile');
          const newProfile = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            phone_number: '',
            medical_info: '',
            user_id: user.id, // For RLS policy consistency
          };
          
          const { data: createdProfile, error: createError } = await addData('profiles', newProfile);
              
          if (createError) {
            throw createError;
          } else if (createdProfile?.[0]) {
            console.log('[useProfile] Profile created successfully:', createdProfile[0]);
            setProfile(createdProfile[0]);
          }
        }
      } catch (error: any) {
        console.error('[useProfile] Error:', error);
        toast({
          title: "Erreur de profil",
          description: "Impossible de récupérer vos informations de profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Setup realtime subscription for profile changes
    const channel = supabase
      .channel(`public:profiles:id=eq.${user?.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user?.id}`
      }, (payload) => {
        console.log('[useProfile] Profile change detected:', payload);
        if (payload.eventType === 'UPDATE' && payload.new) {
          setProfile(payload.new as Profile);
        }
      })
      .subscribe((status) => {
        console.log('[useProfile] Realtime subscription status:', status);
      });

    return () => {
      console.log('[useProfile] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour mettre à jour votre profil",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      console.log('[useProfile] Updating profile for user:', user.id);
      
      // Ensure user_id is set for RLS
      const dataToUpdate = {
        ...profileData,
        user_id: user.id
      };
      
      const { data, error } = await updateData('profiles', user.id, dataToUpdate);

      if (error) {
        throw error;
      }
      
      if (data?.[0]) {
        console.log('[useProfile] Profile updated:', data[0]);
        setProfile(data[0]);
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
      
      return true;
    } catch (error: any) {
      console.error('[useProfile] Profile update error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour du profil",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, updateProfile };
};
