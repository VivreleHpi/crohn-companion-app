
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Redirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté
    if (user) {
      console.log("Utilisateur connecté, redirection vers le dashboard");
      
      // On pourrait ajouter ici une vérification si c'est la première connexion
      // et faire une action particulière (comme montrer un tour d'introduction)
      
      // Pour l'instant, redirige simplement vers le dashboard
      navigate('/dashboard');
    } else {
      console.log("Utilisateur non connecté, redirection vers l'authentification");
      navigate('/auth');
    }
  }, [user, navigate]);

  // Cette page est invisible, donc retourne juste un loader
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crohn-500"></div>
    </div>
  );
};

export default Redirect;
