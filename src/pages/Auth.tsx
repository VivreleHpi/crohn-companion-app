
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center">
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
              <p className="text-center mt-4 text-sm">
                Pas encore de compte?{' '}
                <button 
                  className="text-crohn-600 dark:text-crohn-400 font-medium hover:underline" 
                  onClick={() => setActiveTab('register')}
                >
                  S'inscrire
                </button>
              </p>
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
              <p className="text-center mt-4 text-sm">
                Déjà un compte?{' '}
                <button 
                  className="text-crohn-600 dark:text-crohn-400 font-medium hover:underline" 
                  onClick={() => setActiveTab('login')}
                >
                  Se connecter
                </button>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
