
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Redirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Page de redirection: vérification de l'authentification...");
    
    // Fonction pour extraire le token d'accès de l'URL si présent
    const handleAuthRedirect = async () => {
      // Gérer les redirections avec hash (comme votre URL)
      const hash = window.location.hash;
      console.log("Hash détecté dans l'URL:", hash ? "Oui" : "Non");
      
      if (hash && hash.includes('access_token')) {
        console.log("Token d'accès détecté dans l'URL, traitement en cours...");
        try {
          // Supabase va automatiquement traiter le hash pour extraire les informations d'authentification
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Erreur lors du traitement de l'URL d'authentification:", error);
          } else if (data.session) {
            console.log("Session récupérée avec succès après redirection OAuth:", data.session.user.email);
            // Redirection immédiate vers le dashboard si la session est récupérée
            navigate('/dashboard');
            return; // Sortir de la fonction pour éviter la redirection par défaut
          }
        } catch (err) {
          console.error("Erreur lors du traitement de la redirection:", err);
        }
      }

      // Si pas de hash ou erreur de traitement, attendre un peu et vérifier l'authentification
      setTimeout(() => {
        if (user) {
          console.log("Utilisateur connecté, redirection vers le dashboard");
          navigate('/dashboard');
        } else {
          console.log("Utilisateur non connecté, redirection vers l'authentification");
          navigate('/auth');
        }
      }, 1000); // Délai plus long pour s'assurer que l'authentification a le temps de se terminer
    };

    handleAuthRedirect();

    // Nettoyage
    return () => {
      // Aucun nettoyage nécessaire
    };
  }, [user, navigate]);

  // Cette page est invisible, donc retourne juste un loader
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crohn-500 mb-4"></div>
      <p className="text-lg text-crohn-600">Authentification en cours...</p>
      <p className="text-sm text-gray-500 mt-2">Veuillez patienter pendant le traitement de la connexion</p>
    </div>
  );
};

export default Redirect;
