
import React from 'react';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

interface DateNavigationProps {
  currentWeek: string;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ currentWeek }) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button className="text-crohn-600 dark:text-crohn-300 hover:bg-crohn-50 dark:hover:bg-crohn-900/10 rounded-lg p-2 transition-all duration-300">
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center space-x-2">
        <div className="bg-crohn-100 dark:bg-crohn-900/30 text-crohn-600 dark:text-crohn-300 rounded-full p-2">
          <Calendar className="w-4 h-4" />
        </div>
        <span className="font-medium">{currentWeek}</span>
      </div>
      
      <button className="text-crohn-600 dark:text-crohn-300 hover:bg-crohn-50 dark:hover:bg-crohn-900/10 rounded-lg p-2 transition-all duration-300">
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DateNavigation;
