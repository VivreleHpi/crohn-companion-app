
import React from 'react';
import TrendSlider from './TrendSlider';
import MoodTracker from './dashboard/MoodTracker';
import QuickActions from './dashboard/QuickActions';
import RecentSymptoms from './dashboard/RecentSymptoms';
import StoolAdvice from './dashboard/StoolAdvice';
import MedicationReminders from './dashboard/MedicationReminders';
import HealthTrends from './dashboard/HealthTrends';
import { useDashboardData } from './dashboard/DashboardData';

const Dashboard = () => {
  // Récupération des données
  const { userName, stoolType, recentSymptoms, medicationSchedule } = useDashboardData();
  
  return (
    <div className="space-y-6 pb-20">
      {/* En-tête et suivi de l'humeur */}
      <MoodTracker userName={userName} />
      
      {/* Trend Slider - Tendances récentes */}
      <TrendSlider />
      
      {/* Actions rapides */}
      <QuickActions />
      
      {/* Symptômes récents */}
      <RecentSymptoms symptoms={recentSymptoms} />
      
      {/* Conseils pour les selles */}
      <StoolAdvice stoolType={stoolType} />
      
      {/* Rappels de médicaments */}
      <MedicationReminders medications={medicationSchedule} />
      
      {/* Tendances santé */}
      <HealthTrends />
    </div>
  );
};

export default Dashboard;
