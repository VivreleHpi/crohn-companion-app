
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

// Type definitions
interface MedicationDataItem {
  day: string;
  adherence: number;
}

interface MedicationChartProps {
  data: MedicationDataItem[];
}

// Fonction pour déterminer la couleur en fonction de la valeur d'adhérence
const getAdherenceColor = (adherence: number) => {
  if (adherence < 60) return "#ef4444";
  if (adherence < 80) return "#f59e0b";
  return "#34d399";
};

const MedicationChart: React.FC<MedicationChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-3">
      <h2 className="font-display font-medium mb-4">Observance médicamenteuse</h2>
      
      <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`${value}%`, 'Observance']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="adherence" radius={[4, 4, 0, 0]} fill="#34d399">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getAdherenceColor(entry.adherence)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-2xl font-medium text-health-green">89%</p>
          <p className="text-xs text-muted-foreground">Observance moyenne</p>
        </div>
        
        <div className="text-center flex items-center space-x-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            data.every(d => d.adherence >= 80) ? "bg-health-green" : "bg-health-orange"
          )}></div>
          <p className="text-sm font-medium">
            {data.every(d => d.adherence >= 80) 
              ? "Excellente observance" 
              : "Observance à améliorer"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationChart;
