
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
    console.log('Initialisation de l\'authentification Supabase...');

    // Set up the auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Événement d\'authentification:', event);
        console.log('Utilisateur:', currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Notification à l'utilisateur selon l'événement
        if (event === 'SIGNED_IN') {
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Déconnexion réussie",
            description: "Vous avez été déconnecté",
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Profil mis à jour",
            description: "Vos informations ont été mises à jour",
          });
        }
      }
    );

    // THEN check for existing session
    const getSession = async () => {
      try {
        console.log('Récupération de la session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          toast({
            title: "Erreur d'authentification",
            description: "Impossible de récupérer votre session",
            variant: "destructive",
          });
        } else {
          console.log('Session récupérée:', data.session ? 'Session active' : 'Pas de session');
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("Erreur lors de la connexion à Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    return () => {
      console.log('Nettoyage des écouteurs d\'authentification');
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion avec email:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log('Connexion réussie avec email');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Tentative de connexion avec Google...');
      
      // Déterminer l'URL de redirection basée sur l'environnement actuel
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/redirect`;
      console.log('URL de redirection configurée:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      console.log('Redirection vers Google initiée');
    } catch (error: any) {
      console.error('Erreur de connexion avec Google:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion avec Google",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Tentative d\'inscription avec email:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      console.log('Inscription réussie');
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      console.log('Tentative de déconnexion...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('Déconnexion réussie');
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
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
