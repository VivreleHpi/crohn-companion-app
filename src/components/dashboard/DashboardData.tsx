
import React from 'react';
import { useProfile } from '@/hooks/useProfile';

// Type définitions
export interface Symptom {
  id: number;
  name: string;
  severity: number;
  time: string;
}

export interface Medication {
  id: number;
  name: string;
  time: string;
  taken: boolean;
}

// Données de démonstration pour les symptômes et médicaments
const demoData = {
  stoolType: 4,
  recentSymptoms: [
    { id: 1, name: 'Douleur abdominale', severity: 2, time: '09:30' },
    { id: 2, name: 'Fatigue', severity: 3, time: '14:15' },
  ] as Symptom[],
  medicationSchedule: [
    { id: 1, name: 'Azathioprine', time: '08:00', taken: true },
    { id: 2, name: 'Médicament B', time: '20:00', taken: false },
  ] as Medication[]
};

// Hook customisé pour obtenir les données du dashboard
export const useDashboardData = () => {
  const { profile, loading } = useProfile();
  
  // Dans une implémentation réelle, nous récupérerions les symptômes et médicaments depuis une API
  return {
    userName: profile?.full_name || 'Utilisateur',
    userProfileLoading: loading,
    ...demoData
  };
};
