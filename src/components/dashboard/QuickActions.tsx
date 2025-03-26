
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BarChart2 } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
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
  );
};

export default QuickActions;
