
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

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
          .single();

        if (error) {
          console.error('[useProfile] Erreur lors de la récupération du profil:', error);
          
          // Si le profil n'existe pas, on le crée automatiquement
          if (error.code === 'PGRST116') {
            console.log('[useProfile] Profil non trouvé, création automatique...');
            const newProfile = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              phone_number: '',
              medical_info: '',
              user_id: user.id, // Ajout du user_id pour assurer la cohérence avec les RLS policies
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error('[useProfile] Erreur lors de la création du profil:', createError);
              toast({
                title: "Erreur de profil",
                description: "Impossible de créer votre profil automatiquement",
                variant: "destructive",
              });
            } else if (createdProfile) {
              console.log('[useProfile] Profil créé avec succès:', createdProfile);
              setProfile(createdProfile);
            }
          } else {
            toast({
              title: "Erreur de profil",
              description: "Impossible de récupérer vos informations de profil",
              variant: "destructive",
            });
          }
        } else if (data) {
          console.log('[useProfile] Profil récupéré avec succès:', data);
          setProfile(data);
        }
      } catch (error: any) {
        console.error('[useProfile] Erreur générale:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Configuration de l'écoute en temps réel pour les modifications de profil
    console.log('[useProfile] Configuration de l\'écoute en temps réel pour les profils');
    const channel = supabase
      .channel(`public:profiles:id=eq.${user?.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user?.id}`
      }, (payload) => {
        console.log('[useProfile] Changement détecté sur le profil:', payload);
        if (payload.eventType === 'UPDATE' && payload.new) {
          console.log('[useProfile] Mise à jour du state avec les nouvelles données:', payload.new);
          setProfile(payload.new as Profile);
        }
      })
      .subscribe((status) => {
        console.log('[useProfile] État de l\'abonnement temps réel pour les profils:', status);
      });

    return () => {
      console.log('[useProfile] Nettoyage de l\'abonnement temps réel pour les profils');
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
      console.log('[useProfile] Mise à jour du profil pour l\'utilisateur:', user.id);
      console.log('[useProfile] Données à mettre à jour:', profileData);
      
      // Assurons-nous que user_id est correctement défini si nécessaire
      const dataToUpdate = {
        ...profileData,
        user_id: user.id // Ajout du user_id pour assurer la cohérence avec les RLS policies
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Récupérer les données mises à jour
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchError) {
        console.error('[useProfile] Erreur lors de la récupération du profil mis à jour:', fetchError);
      } else if (updatedProfile) {
        console.log('[useProfile] Profil mis à jour récupéré:', updatedProfile);
        setProfile(updatedProfile);
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
      
      return true;
    } catch (error: any) {
      console.error('[useProfile] Erreur lors de la mise à jour du profil:', error);
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
