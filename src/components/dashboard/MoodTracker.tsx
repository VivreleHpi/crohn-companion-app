import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Frown, Angry, Meh, Smile, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodTrackerProps {
  userName: string;
  userProfileLoading?: boolean;
}

// Fonction pour enregistrer l'humeur et ajouter aux analyses
const recordMood = (moodLevel: number) => {
  // Dans une implémentation réelle, cette fonction enregistrerait l'humeur dans la base de données
  console.log(`Humeur enregistrée: ${moodLevel}`);
};

// Définition des conseils selon l'humeur
const getMoodAdvice = (moodLevel: number): { advice: string; color: string; icon: React.ReactNode } => {
  switch (moodLevel) {
    case 1:
      return { 
        advice: "Contactez votre médecin ou les services d'urgence si les symptômes sont graves", 
        color: "text-health-red",
        icon: <Angry className="w-14 h-14 text-health-red" />
      };
    case 2:
      return { 
        advice: "Prenez du repos et surveillez vos symptômes attentivement", 
        color: "text-health-orange",
        icon: <Frown className="w-14 h-14 text-health-orange" />
      };
    case 3:
      return { 
        advice: "Contrôlez votre alimentation et vos habitudes pour éviter l'aggravation", 
        color: "text-health-yellow",
        icon: <Meh className="w-14 h-14 text-health-yellow" />
      };
    case 4:
      return { 
        advice: "Continuez vos bonnes habitudes, vous êtes sur la bonne voie", 
        color: "text-crohn-300",
        icon: <Smile className="w-14 h-14 text-crohn-300" />
      };
    case 5:
      return { 
        advice: "Excellente journée ! Maintenez ce cap avec votre alimentation et vos médicaments", 
        color: "text-health-green",
        icon: <Heart className="w-14 h-14 text-health-green" />
      };
    default:
      return { 
        advice: "", 
        color: "",
        icon: null
      };
  }
};

const MoodTracker: React.FC<MoodTrackerProps> = ({ userName, userProfileLoading }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleMoodSelection = (index: number) => {
    const moodLevel = index + 1;
    setSelectedMood(index);
    recordMood(moodLevel);
    
    // Afficher une notification toast
    toast({
      title: "Humeur enregistrée",
      description: `Votre état d'humeur (${moodLevel}/5) a été enregistré.`,
    });
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
        <h1 className="text-2xl font-display font-medium">
          {userProfileLoading ? (
            <div className="flex items-center">
              Bonjour <Loader2 className="w-5 h-5 ml-2 animate-spin text-crohn-500" />
            </div>
          ) : (
            <>Bonjour {userName}</>
          )}
        </h1>
        
        {selectedMood === null ? (
          <>
            <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
            
            <div className="mt-4 grid grid-cols-5 gap-3">
              {['Très mal', 'Mal', 'Moyen', 'Bien', 'Très bien'].map((feeling, index) => (
                <button 
                  key={feeling} 
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-300",
                    "border border-transparent",
                    "hover:border-gray-200 dark:hover:border-gray-700",
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
          </>
        ) : (
          <div className="mt-4">
            <div className="flex flex-col items-center space-y-4 py-2">
              {getMoodAdvice(selectedMood + 1).icon}
              <div className={cn(
                "text-center font-medium",
                getMoodAdvice(selectedMood + 1).color
              )}>
                Aujourd'hui vous vous sentez {['très mal', 'mal', 'moyen', 'bien', 'très bien'][selectedMood]}
              </div>
              <p className="text-center text-muted-foreground">
                {getMoodAdvice(selectedMood + 1).advice}
              </p>
              <button 
                onClick={() => setSelectedMood(null)}
                className="mt-4 text-xs text-crohn-500 hover:text-crohn-700 dark:hover:text-crohn-300 underline"
              >
                Modifier mon humeur
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default MoodTracker;
