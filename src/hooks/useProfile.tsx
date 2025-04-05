
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
        console.log('Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          
          // Si le profil n'existe pas, on le crée automatiquement
          if (error.code === 'PGRST116') {
            console.log('Profil non trouvé, création automatique...');
            const newProfile = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              phone_number: '',
              medical_info: '',
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error('Erreur lors de la création du profil:', createError);
              toast({
                title: "Erreur de profil",
                description: "Impossible de créer votre profil automatiquement",
                variant: "destructive",
              });
            } else if (createdProfile) {
              console.log('Profil créé avec succès:', createdProfile);
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
          console.log('Profil récupéré avec succès:', data);
          setProfile(data);
        }
      } catch (error: any) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Configuration de l'écoute en temps réel pour les modifications de profil
    const channel = supabase
      .channel(`public:profiles:id=eq.${user?.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user?.id}`
      }, (payload) => {
        console.log('Changement détecté sur le profil:', payload);
        if (payload.eventType === 'UPDATE' && payload.new) {
          setProfile(payload.new as Profile);
        }
      })
      .subscribe();

    return () => {
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
      console.log('Mise à jour du profil pour l\'utilisateur:', user.id);
      console.log('Données à mettre à jour:', profileData);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
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
        console.error('Erreur lors de la récupération du profil mis à jour:', fetchError);
      } else if (updatedProfile) {
        console.log('Profil mis à jour récupéré:', updatedProfile);
        setProfile(updatedProfile);
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
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
