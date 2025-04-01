
import React, { useState } from 'react';
import DateNavigation from './reports/DateNavigation';
import SymptomsChart from './reports/SymptomsChart';
import StoolChart from './reports/StoolChart';
import MedicationChart from './reports/MedicationChart';
import { symptomsData, stoolData, medicationData } from './reports/data/mockData';
import { cn } from '@/lib/utils';

const Reports = () => {
  const [currentWeek, setCurrentWeek] = useState('7 - 13 Juin 2023');
  const [currentStatus, setCurrentStatus] = useState('remission'); // 'remission' ou 'crisis'
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <h1 className="text-2xl font-display font-medium mb-2">Analyses</h1>
        <p className="text-muted-foreground">Visualisez l'évolution de votre état de santé</p>
        
        <DateNavigation currentWeek={currentWeek} />
        
        <div className="mt-4 flex items-center justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
          <div className={cn(
            "flex-1 text-center py-2 rounded-lg font-medium",
            currentStatus === 'remission' 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
              : "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400"
          )}>
            Rémission
          </div>
          <div className={cn(
            "flex-1 text-center py-2 rounded-lg font-medium ml-2",
            currentStatus === 'crisis' 
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
              : "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400"
          )}>
            Crise
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <SymptomsChart data={symptomsData} />
      <StoolChart data={stoolData} />
      <MedicationChart data={medicationData} />
    </div>
  );
};

export default Reports;
