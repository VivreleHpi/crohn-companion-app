
import React from 'react';
import Header from '@/components/Header';
import EnhancedStats from '@/components/stats/EnhancedStats';
import { ScrollArea } from '@/components/ui/scroll-area';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4">
        <Header />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <EnhancedStats />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Analytics;
