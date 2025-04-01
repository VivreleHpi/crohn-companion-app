
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          toast({
            title: "Erreur de profil",
            description: "Impossible de récupérer vos informations de profil",
            variant: "destructive",
          });
        } else if (data) {
          setProfile(data);
        }
      } catch (error: any) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Mettre à jour le state local
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
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
