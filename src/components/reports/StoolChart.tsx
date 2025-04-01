
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Type definitions
interface StoolDataItem {
  day: string;
  type: number;
  count: number;
}

interface StoolChartProps {
  data: StoolDataItem[];
}

const StoolChart: React.FC<StoolChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
      <h2 className="font-display font-medium mb-4">Selles</h2>
      
      <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis domain={[1, 7]} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`Type ${value}`, 'Échelle de Bristol']}
              labelFormatter={(label) => `${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="type" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#0284c7", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-2xl font-medium">13</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-medium">1.9</p>
          <p className="text-xs text-muted-foreground">Par jour</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-medium">4.5</p>
          <p className="text-xs text-muted-foreground">Type moyen</p>
        </div>
      </div>
    </div>
  );
};

export default StoolChart;
