
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MoodTrackerProps {
  userName: string;
}

// Fonction pour enregistrer l'humeur et ajouter aux analyses
const recordMood = (moodLevel: number) => {
  // Dans une implémentation réelle, cette fonction enregistrerait l'humeur dans la base de données
  console.log(`Humeur enregistrée: ${moodLevel}`);
};

const MoodTracker: React.FC<MoodTrackerProps> = ({ userName }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  
  const handleMoodSelection = (index: number) => {
    setSelectedMood(index);
    recordMood(index + 1);
  };

  // Obtenir la date formatée
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load">
      <div className="space-y-2">
        <div className="text-sm font-medium text-crohn-500">{formattedDate}</div>
        <h1 className="text-2xl font-display font-medium">Bonjour {userName}</h1>
        <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
      </div>
      
      <div className="mt-4 grid grid-cols-5 gap-3">
        {['Très mal', 'Mal', 'Moyen', 'Bien', 'Très bien'].map((feeling, index) => (
          <button 
            key={feeling} 
            className={cn(
              "flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-300",
              "border border-transparent",
              selectedMood === index 
                ? "border-crohn-500 dark:border-crohn-300" 
                : "hover:border-gray-200 dark:hover:border-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-crohn-500 focus:ring-opacity-50"
            )}
            onClick={() => handleMoodSelection(index)}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-2",
              index === 0 ? "bg-health-red text-white" : "",
              index === 1 ? "bg-health-orange text-white" : "",
              index === 2 ? "bg-health-yellow text-gray-800" : "",
              index === 3 ? "bg-crohn-300 text-white" : "",
              index === 4 ? "bg-health-green text-white" : "",
            )}>
              {index + 1}
            </div>
            <span className="text-xs">{feeling}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
