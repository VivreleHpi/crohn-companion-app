
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder data for reports
const symptomsData = [
  { day: 'Lun', count: 3, severity: 2 },
  { day: 'Mar', count: 2, severity: 1 },
  { day: 'Mer', count: 4, severity: 3 },
  { day: 'Jeu', count: 1, severity: 2 },
  { day: 'Ven', count: 2, severity: 2 },
  { day: 'Sam', count: 0, severity: 0 },
  { day: 'Dim', count: 1, severity: 1 }
];

const stoolData = [
  { day: 'Lun', type: 5, count: 2 },
  { day: 'Mar', type: 6, count: 3 },
  { day: 'Mer', type: 4, count: 2 },
  { day: 'Jeu', type: 5, count: 1 },
  { day: 'Ven', type: 3, count: 2 },
  { day: 'Sam', type: 4, count: 1 },
  { day: 'Dim', type: 4, count: 2 }
];

const medicationData = [
  { day: 'Lun', adherence: 100 },
  { day: 'Mar', adherence: 100 },
  { day: 'Mer', adherence: 75 },
  { day: 'Jeu', adherence: 100 },
  { day: 'Ven', adherence: 100 },
  { day: 'Sam', adherence: 50 },
  { day: 'Dim', adherence: 100 }
];

// Fonction pour déterminer la couleur en fonction de la valeur d'adhérence
const getAdherenceColor = (adherence) => {
  if (adherence < 60) return "#ef4444";
  if (adherence < 80) return "#f59e0b";
  return "#34d399";
};

const Reports = () => {
  const [currentWeek, setCurrentWeek] = useState('7 - 13 Juin 2023');
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <h1 className="text-2xl font-display font-medium mb-2">Analyses</h1>
        <p className="text-muted-foreground">Visualisez l'évolution de votre état de santé</p>
        
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
      </div>
      
      {/* Symptoms chart */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-1">
        <h2 className="font-display font-medium mb-4">Symptômes</h2>
        
        <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={symptomsData}
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
      
      {/* Stool chart */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
        <h2 className="font-display font-medium mb-4">Selles</h2>
        
        <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stoolData}
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
      
      {/* Medication adherence */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-3">
        <h2 className="font-display font-medium mb-4">Observance médicamenteuse</h2>
        
        <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={medicationData}
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
              <Bar 
                dataKey="adherence" 
                radius={[4, 4, 0, 0]}
                fill={(data) => getAdherenceColor(data.adherence)}
              />
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
              medicationData.every(d => d.adherence >= 80) ? "bg-health-green" : "bg-health-orange"
            )}></div>
            <p className="text-sm font-medium">
              {medicationData.every(d => d.adherence >= 80) 
                ? "Excellente observance" 
                : "Observance à améliorer"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
