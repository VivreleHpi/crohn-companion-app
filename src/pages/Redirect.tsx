
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Redirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processingAuth, setProcessingAuth] = useState(true);
  const [authStatus, setAuthStatus] = useState<string>('Initialisation...');

  useEffect(() => {
    console.log("Page de redirection: vérification de l'authentification...");
    
    // Fonction pour extraire le token d'accès de l'URL si présent
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      console.log("Hash détecté dans l'URL:", hash ? "Oui" : "Non");
      setAuthStatus(hash ? "Traitement du token..." : "Vérification de l'authentification...");
      
      if (hash && hash.includes('access_token')) {
        console.log("Token d'accès détecté dans l'URL, traitement en cours...");
        try {
          // Vérifier si la session est valide
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Erreur lors du traitement de l'URL d'authentification:", error);
            setAuthStatus("Erreur d'authentification: " + error.message);
          } else if (data.session) {
            console.log("Session récupérée avec succès:", data.session.user.email);
            setAuthStatus("Authentification réussie! Redirection...");
            setTimeout(() => {
              navigate('/dashboard');
              setProcessingAuth(false);
            }, 1000);
            return; // Sortir de la fonction pour éviter la redirection par défaut
          }
        } catch (err) {
          console.error("Erreur lors du traitement de la redirection:", err);
          setAuthStatus("Erreur lors du traitement: " + (err instanceof Error ? err.message : String(err)));
        }
      } else {
        console.log("Pas de hash dans l'URL, vérification de l'authentification...");
      }

      // Si pas de hash ou erreur de traitement, attendre un peu et vérifier l'authentification
      setTimeout(() => {
        if (user) {
          console.log("Utilisateur connecté, redirection vers le dashboard");
          setAuthStatus("Utilisateur déjà connecté. Redirection...");
          navigate('/dashboard');
        } else {
          console.log("Utilisateur non connecté, redirection vers l'authentification");
          setAuthStatus("Authentification nécessaire. Redirection...");
          navigate('/auth');
        }
        setProcessingAuth(false);
      }, 2000); // Délai plus long pour s'assurer que l'authentification a le temps de se terminer
    };

    handleAuthRedirect();

  }, [user, navigate]);

  // Cette page est invisible, donc retourne juste un loader
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crohn-500 mb-4"></div>
      <p className="text-lg text-crohn-600">Authentification en cours...</p>
      <p className="text-sm text-gray-500 mt-2">{authStatus}</p>
      {processingAuth && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
          <p className="text-sm text-gray-700">
            Si cette page reste affichée trop longtemps, vérifiez que les redirections sont correctement configurées
            dans Google Cloud Console et Supabase.
          </p>
        </div>
      )}
    </div>
  );
};

export default Redirect;
