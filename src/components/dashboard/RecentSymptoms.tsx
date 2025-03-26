
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type définition
interface Symptom {
  id: number;
  name: string;
  severity: number;
  time: string;
}

interface RecentSymptomsProps {
  symptoms: Symptom[];
}

const RecentSymptoms: React.FC<RecentSymptomsProps> = ({ symptoms }) => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-medium">Symptômes récents</h2>
        <Link 
          to="/symptoms" 
          className="text-sm text-crohn-600 dark:text-crohn-300 hover:underline flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Link>
      </div>
      
      {symptoms.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p>Aucun symptôme enregistré aujourd'hui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {symptoms.map(symptom => (
            <div key={symptom.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  symptom.severity <= 1 ? "bg-health-green" : "",
                  symptom.severity === 2 ? "bg-health-yellow" : "",
                  symptom.severity === 3 ? "bg-health-orange" : "",
                  symptom.severity >= 4 ? "bg-health-red" : "",
                )}></div>
                <span>{symptom.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{symptom.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSymptoms;
