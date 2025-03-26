
import React from 'react';
import Header from '@/components/Header';
import EnhancedStats from '@/components/stats/EnhancedStats';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4">
        <Header />
        <EnhancedStats />
      </div>
    </div>
  );
};

export default Analytics;
