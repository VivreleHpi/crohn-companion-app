
import React, { useState } from 'react';
import Header from '@/components/Header';
import EnhancedStats from '@/components/stats/EnhancedStats';
import AnalyticsTables from '@/components/stats/AnalyticsTables';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableIcon, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const [viewType, setViewType] = useState<'graphs' | 'tables'>('graphs');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl px-4">
        <Header />
        
        <div className="mb-6 flex justify-center">
          <Tabs 
            value={viewType} 
            onValueChange={(v) => setViewType(v as 'graphs' | 'tables')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="graphs" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>Graphiques</span>
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex items-center gap-1">
                <TableIcon className="h-4 w-4" />
                <span>Tableaux</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {viewType === 'graphs' ? <EnhancedStats /> : <AnalyticsTables />}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Analytics;
