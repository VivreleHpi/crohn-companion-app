
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const HealthTrends: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-5">
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
  );
};

export default HealthTrends;
