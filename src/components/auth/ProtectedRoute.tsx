
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

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
