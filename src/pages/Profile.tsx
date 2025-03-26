
import React from 'react';
import Header from '@/components/Header';
import ProfileForm from '@/components/profile/ProfileForm';
import AppointmentReminders from '@/components/profile/AppointmentReminders';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4">
        <Header />
        <div className="space-y-6 pb-20">
          <div className="glass-card rounded-xl p-5 animate-on-load">
            <h1 className="text-2xl font-display font-medium mb-2">Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles et vos rendez-vous</p>
          </div>
          
          <ProfileForm />
          <AppointmentReminders />
        </div>
      </div>
    </div>
  );
};

export default Profile;
