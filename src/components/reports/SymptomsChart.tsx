
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Type definitions
interface SymptomDataItem {
  day: string;
  count: number;
  severity: number;
}

interface SymptomsChartProps {
  data: SymptomDataItem[];
}

const SymptomsChart: React.FC<SymptomsChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-1">
      <h2 className="font-display font-medium mb-4">Symptômes</h2>
      
      <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`${value}`, 'Nombre']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-2xl font-medium">15</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-medium">2.1</p>
          <p className="text-xs text-muted-foreground">Par jour</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-medium text-health-orange">Modéré</p>
          <p className="text-xs text-muted-foreground">Intensité moyenne</p>
        </div>
      </div>
    </div>
  );
};

export default SymptomsChart;
