
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Récupérer la session lors du chargement
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de récupérer votre session",
          variant: "destructive",
        });
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion avec Google",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur s'est produite lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
