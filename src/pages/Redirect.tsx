
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
    
    // Fonction pour gérer la redirection après authentification
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      const query = window.location.search;
      
      console.log("Hash détecté dans l'URL:", hash ? "Oui" : "Non");
      console.log("Query params détectés:", query ? "Oui" : "Non");
      setAuthStatus(hash || query ? "Traitement du token..." : "Vérification de l'authentification...");
      
      // Délai court pour permettre à Supabase de traiter le hash d'authentification
      setTimeout(async () => {
        try {
          // Vérifier la session actuelle
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Erreur lors de la récupération de la session:", error);
            setAuthStatus("Erreur d'authentification: " + error.message);
            navigate('/auth');
          } else if (data.session) {
            console.log("Session récupérée avec succès:", data.session.user.email);
            setAuthStatus("Authentification réussie! Redirection...");
            
            // Rediriger vers le dashboard après une connexion réussie
            setTimeout(() => {
              navigate('/dashboard');
              setProcessingAuth(false);
            }, 1000);
          } else {
            console.log("Pas de session active, redirection vers la page d'authentification");
            setAuthStatus("Authentification nécessaire");
            navigate('/auth');
          }
        } catch (err) {
          console.error("Erreur lors du traitement de la redirection:", err);
          setAuthStatus("Erreur lors du traitement: " + (err instanceof Error ? err.message : String(err)));
          navigate('/auth');
        }
      }, 500);
    };

    handleAuthRedirect();
  }, [navigate, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crohn-500 mb-4"></div>
      <p className="text-lg text-crohn-600">Authentification en cours...</p>
      <p className="text-sm text-gray-500 mt-2">{authStatus}</p>
      {processingAuth && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
          <p className="text-sm text-gray-700">
            Si cette page reste affichée trop longtemps, vérifiez que les redirections sont correctement configurées
            dans Supabase.
          </p>
        </div>
      )}
    </div>
  );
};

export default Redirect;
