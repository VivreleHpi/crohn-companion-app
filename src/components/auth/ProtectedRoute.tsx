
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Vérifier si Supabase est configuré
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Configuration Supabase manquante</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">Pour utiliser l'application, vous devez configurer les variables d'environnement Supabase :</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
            <p className="mb-4">Créez un fichier .env.local à la racine du projet avec ces variables.</p>
            <Button onClick={() => window.location.href = '/auth'} className="w-full">
              Retour à la page d'authentification
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Afficher un chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crohn-500"></div>
      </div>
    );
  }

  // Rediriger vers la connexion si non authentifié
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Rendre les routes enfants si authentifié
  return <Outlet />;
};

export default ProtectedRoute;
