
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Pill, BarChart2, TrendingUp, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder data
const today = new Date();
const formattedDate = today.toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  day: 'numeric', 
  month: 'long' 
});

const recentSymptoms = [
  { id: 1, name: 'Douleur abdominale', severity: 2, time: '09:30' },
  { id: 2, name: 'Fatigue', severity: 3, time: '14:15' },
];

const medicationSchedule = [
  { id: 1, name: 'Azathioprine', time: '08:00', taken: true },
  { id: 2, name: 'Médicament B', time: '20:00', taken: false },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header card */}
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <div className="space-y-2">
          <div className="text-sm font-medium text-crohn-500">{formattedDate}</div>
          <h1 className="text-2xl font-display font-medium">Bonjour</h1>
          <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
        </div>
        
        <div className="mt-4 grid grid-cols-5 gap-3">
          {['Très mal', 'Mal', 'Moyen', 'Bien', 'Très bien'].map((feeling, index) => (
            <button 
              key={feeling} 
              className={cn(
                "flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-300",
                "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-crohn-500 focus:ring-opacity-50"
              )}
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
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 animate-on-load stagger-1">
        <Link 
          to="/symptoms" 
          className="glass-card rounded-xl p-5 flex items-center space-x-4 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300"
        >
          <div className="bg-crohn-100 dark:bg-crohn-900/30 rounded-full p-3 text-crohn-600 dark:text-crohn-300">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium">Symptômes</h3>
            <p className="text-sm text-muted-foreground">Suivi quotidien</p>
          </div>
        </Link>
        
        <Link 
          to="/stool-log" 
          className="glass-card rounded-xl p-5 flex items-center space-x-4 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300"
        >
          <div className="bg-crohn-100 dark:bg-crohn-900/30 rounded-full p-3 text-crohn-600 dark:text-crohn-300">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium">Selles</h3>
            <p className="text-sm text-muted-foreground">Enregistrer</p>
          </div>
        </Link>
      </div>
      
      {/* Recent symptoms */}
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
        
        {recentSymptoms.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun symptôme enregistré aujourd'hui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSymptoms.map(symptom => (
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
      
      {/* Medication reminders */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-3">
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
          {medicationSchedule.map(med => (
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
      
      {/* Health trends */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-medium">Tendances récentes</h2>
          <Link 
            to="/analytics" 
            className="text-sm text-crohn-600 dark:text-crohn-300 hover:underline flex items-center"
          >
            <TrendingUp className="w-4 h-4 mr-1" /> Voir les analyses
          </Link>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-3 flex items-center space-x-3">
          <div className="bg-crohn-100 dark:bg-crohn-900/30 text-crohn-500 dark:text-crohn-300 rounded-full p-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm">7 jours d'analyse disponibles</p>
            <p className="text-xs text-muted-foreground">Continuez à enregistrer vos données pour des analyses plus précises</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
