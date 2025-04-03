
import React, { useState } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DateNavigation from './reports/DateNavigation';
import SymptomsChart from './reports/SymptomsChart';
import StoolChart from './reports/StoolChart';
import MedicationChart from './reports/MedicationChart';
import { useReportsData } from '@/hooks/useReportsData';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Reports = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Formater l'affichage de la semaine (ex: "7 - 13 Juin 2023")
  const formatWeekDisplay = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, 'd', { locale: fr })} - ${format(end, 'd MMM yyyy', { locale: fr })}`;
  };
  
  const navigateToPreviousWeek = () => {
    setCurrentWeekStart(prevDate => subWeeks(prevDate, 1));
  };
  
  const navigateToNextWeek = () => {
    setCurrentWeekStart(prevDate => addWeeks(prevDate, 1));
  };
  
  const { loading, symptomData, stoolData, medicationData, status } = useReportsData(currentWeekStart);
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <h1 className="text-2xl font-display font-medium mb-2">Analyses</h1>
        <p className="text-muted-foreground">Visualisez l'évolution de votre état de santé</p>
        
        <DateNavigation 
          currentWeek={formatWeekDisplay(currentWeekStart)} 
          onPrevious={navigateToPreviousWeek}
          onNext={navigateToNextWeek}
        />
        
        <div className="mt-4 flex items-center justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
          <div className={cn(
            "flex-1 text-center py-2 rounded-lg font-medium",
            status === 'remission' 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
              : "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400"
          )}>
            Rémission
          </div>
          <div className={cn(
            "flex-1 text-center py-2 rounded-lg font-medium ml-2",
            status === 'crisis' 
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
              : "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400"
          )}>
            Crise
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-crohn-500 animate-spin mb-2" />
          <p className="text-muted-foreground">Chargement de vos données...</p>
        </div>
      ) : (
        <>
          {/* Charts */}
          <SymptomsChart data={symptomData} />
          <StoolChart data={stoolData} />
          <MedicationChart data={medicationData} />
        </>
      )}
    </div>
  );
};

export default Reports;
