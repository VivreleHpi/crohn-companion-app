
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCircle } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }).optional(),
  phoneNumber: z.string().optional(),
  medicalInfo: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      phoneNumber: '',
      medicalInfo: '',
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Dans un cas réel, vous auriez une table profiles dans Supabase
        // Pour l'instant, on utilise juste l'email de l'utilisateur
        form.setValue('email', user.email || '');
        
        // Ici, vous feriez une requête à votre table profiles
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('id', user.id)
        //   .single();
        
        // if (data) {
        //   form.setValue('fullName', data.full_name);
        //   form.setValue('phoneNumber', data.phone_number);
        //   form.setValue('medicalInfo', data.medical_info);
        // }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Dans un cas réel, vous mettriez à jour la table profiles
      // const { error } = await supabase
      //   .from('profiles')
      //   .upsert({
      //     id: user.id,
      //     full_name: data.fullName,
      //     phone_number: data.phoneNumber,
      //     medical_info: data.medicalInfo,
      //     updated_at: new Date(),
      //   });
      
      // if (error) throw error;
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.formState.isSubmitting) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-crohn-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input readOnly disabled placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medicalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informations médicales importantes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Allergies, traitements en cours, etc." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
