
import React from 'react';

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

// Données de démonstration
export const dashboardData = {
  userName: "Jean",
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
  // Dans une implémentation réelle, nous récupérerions les données depuis une API
  return dashboardData;
};
