
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Medication {
  id: number;
  name: string;
  time: string;
  taken: boolean;
}

interface MedicationRemindersProps {
  medications: Medication[];
}

const MedicationReminders: React.FC<MedicationRemindersProps> = ({ medications }) => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-medium">Médicaments d'aujourd'hui</h2>
        <Link 
          to="/medications" 
          className="text-sm text-crohn-600 dark:text-crohn-300 hover:underline"
        >
          Voir tout
        </Link>
      </div>
      
      <div className="space-y-3">
        {medications.map(med => (
          <div 
            key={med.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              med.taken 
                ? "bg-gray-100/80 dark:bg-gray-800/20 text-muted-foreground" 
                : "bg-white/50 dark:bg-gray-800/30"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center",
                med.taken 
                  ? "bg-crohn-100 text-crohn-500 dark:bg-crohn-900/30 dark:text-crohn-300" 
                  : "bg-crohn-500 text-white"
              )}>
                {med.taken ? <Check className="w-4 h-4" /> : <Pill className="w-4 h-4" />}
              </div>
              <span>{med.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{med.time}</span>
              {!med.taken && (
                <button className="bg-crohn-100 text-crohn-600 dark:bg-crohn-900/30 dark:text-crohn-300 rounded-full p-1 hover:bg-crohn-200 dark:hover:bg-crohn-800/30 transition-all duration-300">
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationReminders;
