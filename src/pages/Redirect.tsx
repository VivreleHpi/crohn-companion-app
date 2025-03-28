
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Redirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Page de redirection: vérification de l'authentification...");
    
    // Vérifie si l'URL contient un hash (utilisé par l'authentification OAuth)
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log("Hash d'authentification détecté, traitement en cours...");
        try {
          // Supabase traitera automatiquement le hash lors de la récupération de la session
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error("Erreur lors du traitement de la redirection d'authentification:", error);
          } else if (data.session) {
            console.log("Session récupérée avec succès après redirection OAuth");
          }
        } catch (err) {
          console.error("Erreur lors du traitement de la redirection:", err);
        }
      }
    };

    handleAuthRedirect();

    // Vérifie si l'utilisateur est connecté
    const redirectBasedOnAuth = () => {
      if (user) {
        console.log("Utilisateur connecté, redirection vers le dashboard");
        navigate('/dashboard');
      } else {
        console.log("Utilisateur non connecté, redirection vers l'authentification");
        navigate('/auth');
      }
    };

    // Attendre un court délai pour permettre à l'authentification de se terminer
    const timeoutId = setTimeout(() => {
      redirectBasedOnAuth();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [user, navigate]);

  // Cette page est invisible, donc retourne juste un loader
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crohn-500"></div>
      <p className="ml-3 text-lg text-crohn-600">Redirection en cours...</p>
    </div>
  );
};

export default Redirect;
