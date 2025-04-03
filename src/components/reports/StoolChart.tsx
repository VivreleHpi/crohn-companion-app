
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StoolDataItem } from '@/hooks/useReportsData';

interface StoolChartProps {
  data: StoolDataItem[];
}

const getStoolColor = (type: number) => {
  switch (type) {
    case 1: return "#92400E"; // amber-800
    case 2: return "#B45309"; // amber-700
    case 3: return "#D97706"; // amber-600
    case 4: return "#F59E0B"; // amber-500
    case 5: return "#FBBF24"; // amber-400
    case 6: return "#FCD34D"; // amber-300
    case 7: return "#FDE68A"; // amber-200
    default: return "#F59E0B"; // amber-500
  }
};

const StoolChart: React.FC<StoolChartProps> = ({ data }) => {
  // Calculer les statistiques
  const totalStools = data.reduce((sum, item) => sum + item.count, 0);
  const daysWithData = data.filter(item => item.count > 0).length;
  const avgPerDay = daysWithData > 0 ? (totalStools / daysWithData).toFixed(1) : "0";
  
  // Calculer le type Bristol moyen
  const totalBristolType = data.reduce((sum, item) => sum + (item.bristolType * item.count), 0);
  const avgBristolType = totalStools > 0 ? (totalBristolType / totalStools).toFixed(1) : "0";
  
  // Déterminer si le type moyen est normal (3-5 est généralement considéré comme normal)
  const isNormalType = totalStools > 0 && totalBristolType / totalStools >= 3 && totalBristolType / totalStools <= 5;

  // Données transformées pour le graphique avec couleurs
  const chartData = data.map(item => ({
    ...item,
    color: getStoolColor(item.bristolType || 4)
  }));

  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
      <h2 className="font-display font-medium mb-4">Selles</h2>
      
      <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
                name === 'count' ? 'Nombre' : 'Type Bristol'
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar 
              dataKey="count" 
              fill="#F59E0B" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-2xl font-medium">{totalStools}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-medium">{avgPerDay}</p>
          <p className="text-xs text-muted-foreground">Par jour</p>
        </div>
        
        <div className="text-center">
          <p className={`text-2xl font-medium ${isNormalType ? 'text-health-green' : 'text-health-orange'}`}>
            {avgBristolType}
          </p>
          <p className="text-xs text-muted-foreground">Type Bristol moyen</p>
        </div>
      </div>
    </div>
  );
};

export default StoolChart;
