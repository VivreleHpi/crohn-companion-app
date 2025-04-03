
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MedicationDataItem } from '@/hooks/useReportsData'; 

interface MedicationChartProps {
  data: MedicationDataItem[];
}

const MedicationChart: React.FC<MedicationChartProps> = ({ data }) => {
  // Calculer les statistiques
  const totalScheduled = data.reduce((sum, item) => sum + item.scheduled, 0);
  const totalTaken = data.reduce((sum, item) => sum + item.taken, 0);
  const adherenceRate = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;
  
  // Déterminer la classe de couleur selon le taux d'adhérence
  const getAdherenceColorClass = (rate: number) => {
    if (rate >= 90) return "text-health-green";
    if (rate >= 75) return "text-health-yellow";
    if (rate >= 50) return "text-health-orange";
    return "text-health-red";
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-3">
      <h2 className="font-display font-medium mb-4">Médicaments</h2>
      
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
              formatter={(value: number, name: string) => [
                `${value}`, 
                name === 'scheduled' ? 'Prévus' : 'Pris'
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar dataKey="scheduled" name="Prévus" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="taken" name="Pris" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-2xl font-medium">{totalScheduled}</p>
          <p className="text-xs text-muted-foreground">Doses prévues</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-medium">{totalTaken}</p>
          <p className="text-xs text-muted-foreground">Doses prises</p>
        </div>
        
        <div className="text-center">
          <p className={`text-2xl font-medium ${getAdherenceColorClass(adherenceRate)}`}>
            {adherenceRate}%
          </p>
          <p className="text-xs text-muted-foreground">Taux d'adhérence</p>
        </div>
      </div>
    </div>
  );
};

export default MedicationChart;
