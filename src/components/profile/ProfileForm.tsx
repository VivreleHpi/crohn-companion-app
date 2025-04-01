
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
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
  full_name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }).optional(),
  phone_number: z.string().optional(),
  medical_info: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: user?.email || '',
      phone_number: '',
      medical_info: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValue('full_name', profile.full_name || '');
      form.setValue('email', profile.email || user?.email || '');
      form.setValue('phone_number', profile.phone_number || '');
      form.setValue('medical_info', profile.medical_info || '');
    }
  }, [profile, user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    const success = await updateProfile({
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      medical_info: data.medical_info,
    });

    if (success) {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
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
                name="full_name"
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
                name="phone_number"
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
                name="medical_info"
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
