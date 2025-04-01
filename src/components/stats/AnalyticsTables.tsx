
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  CalendarDays, 
  CalendarIcon, 
  Table as TableIcon,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types pour les données
interface SymptomData {
  date: string;
  name: string;
  count: number;
  severity: number;
}

interface StoolData {
  date: string;
  type: number;
  count: number;
}

interface MedicationData {
  date: string;
  name: string;
  adherence: number;
}

// Données de démonstration
const weeklySymptoms: SymptomData[] = [
  { date: '2023-06-01', name: 'Douleur abdominale', count: 3, severity: 2 },
  { date: '2023-06-02', name: 'Fatigue', count: 2, severity: 1 },
  { date: '2023-06-03', name: 'Douleur abdominale', count: 1, severity: 3 },
  { date: '2023-06-04', name: 'Nausée', count: 1, severity: 2 },
  { date: '2023-06-05', name: 'Douleur abdominale', count: 2, severity: 2 },
  { date: '2023-06-06', name: 'Nausée', count: 0, severity: 0 },
  { date: '2023-06-07', name: 'Fatigue', count: 1, severity: 1 }
];

const monthlySymptoms: SymptomData[] = [
  { date: 'Semaine 1', name: 'Douleur abdominale', count: 8, severity: 2 },
  { date: 'Semaine 2', name: 'Fatigue', count: 5, severity: 2 },
  { date: 'Semaine 3', name: 'Douleur abdominale', count: 3, severity: 1 },
  { date: 'Semaine 4', name: 'Nausée', count: 4, severity: 2 },
];

const yearlySymptoms: SymptomData[] = [
  { date: 'Janvier', name: 'Douleur abdominale', count: 25, severity: 2 },
  { date: 'Février', name: 'Fatigue', count: 18, severity: 2 },
  { date: 'Mars', name: 'Douleur abdominale', count: 12, severity: 1 },
  { date: 'Avril', name: 'Nausée', count: 15, severity: 2 },
  { date: 'Mai', name: 'Fatigue', count: 20, severity: 3 },
  { date: 'Juin', name: 'Douleur abdominale', count: 10, severity: 2 },
];

const weeklyStool: StoolData[] = [
  { date: '2023-06-01', type: 5, count: 2 },
  { date: '2023-06-02', type: 6, count: 3 },
  { date: '2023-06-03', type: 4, count: 2 },
  { date: '2023-06-04', type: 5, count: 1 },
  { date: '2023-06-05', type: 3, count: 2 },
  { date: '2023-06-06', type: 4, count: 1 },
  { date: '2023-06-07', type: 4, count: 2 }
];

const monthlyStool: StoolData[] = [
  { date: 'Semaine 1', type: 5, count: 9 },
  { date: 'Semaine 2', type: 4, count: 10 },
  { date: 'Semaine 3', type: 3, count: 7 },
  { date: 'Semaine 4', type: 4, count: 8 },
];

const yearlyStool: StoolData[] = [
  { date: 'Janvier', type: 5, count: 42 },
  { date: 'Février', type: 4, count: 38 },
  { date: 'Mars', type: 3, count: 35 },
  { date: 'Avril', type: 4, count: 40 },
  { date: 'Mai', type: 5, count: 45 },
  { date: 'Juin', type: 4, count: 30 },
];

const weeklyMedication: MedicationData[] = [
  { date: '2023-06-01', name: 'Azathioprine', adherence: 100 },
  { date: '2023-06-02', name: 'Azathioprine', adherence: 100 },
  { date: '2023-06-03', name: 'Azathioprine', adherence: 75 },
  { date: '2023-06-04', name: 'Azathioprine', adherence: 100 },
  { date: '2023-06-05', name: 'Azathioprine', adherence: 100 },
  { date: '2023-06-06', name: 'Azathioprine', adherence: 50 },
  { date: '2023-06-07', name: 'Azathioprine', adherence: 100 }
];

const monthlyMedication: MedicationData[] = [
  { date: 'Semaine 1', name: 'Azathioprine', adherence: 95 },
  { date: 'Semaine 2', name: 'Azathioprine', adherence: 85 },
  { date: 'Semaine 3', name: 'Azathioprine', adherence: 90 },
  { date: 'Semaine 4', name: 'Azathioprine', adherence: 80 },
];

const yearlyMedication: MedicationData[] = [
  { date: 'Janvier', name: 'Azathioprine', adherence: 92 },
  { date: 'Février', name: 'Azathioprine', adherence: 88 },
  { date: 'Mars', name: 'Azathioprine', adherence: 95 },
  { date: 'Avril', name: 'Azathioprine', adherence: 90 },
  { date: 'Mai', name: 'Azathioprine', adherence: 87 },
  { date: 'Juin', name: 'Azathioprine', adherence: 89 },
];

// Fonction pour déterminer la couleur selon la sévérité
const getSeverityColor = (severity: number) => {
  if (severity <= 1) return "text-health-green";
  if (severity === 2) return "text-health-yellow";
  if (severity === 3) return "text-health-orange";
  return "text-health-red";
};

// Fonction pour déterminer la couleur selon l'adhérence
const getAdherenceColor = (adherence: number) => {
  if (adherence < 60) return "text-health-red";
  if (adherence < 80) return "text-health-orange";
  return "text-health-green";
};

// Fonction pour déterminer la description selon le type de selles
const getStoolTypeDescription = (type: number) => {
  switch (type) {
    case 1: return "Morceaux durs";
    case 2: return "En forme de saucisse, bosselée";
    case 3: return "En forme de saucisse, fissurée";
    case 4: return "En forme de saucisse, lisse";
    case 5: return "Morceaux mous";
    case 6: return "Morceaux floconneux";
    case 7: return "Entièrement liquide";
    default: return "Type inconnu";
  }
};

const AnalyticsTables = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [dataType, setDataType] = useState<'symptoms' | 'stool' | 'medication'>('symptoms');

  // Sélection des données selon le type et la période
  const getSymptomData = () => {
    switch (timeframe) {
      case 'week': return weeklySymptoms;
      case 'month': return monthlySymptoms;
      case 'year': return yearlySymptoms;
    }
  };

  const getStoolData = () => {
    switch (timeframe) {
      case 'week': return weeklyStool;
      case 'month': return monthlyStool;
      case 'year': return yearlyStool;
    }
  };

  const getMedicationData = () => {
    switch (timeframe) {
      case 'week': return weeklyMedication;
      case 'month': return monthlyMedication;
      case 'year': return yearlyMedication;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-medium">Tableaux d'analyses</h2>
        
        <div className="flex space-x-2">
          <Tabs 
            value={timeframe} 
            onValueChange={(v) => setTimeframe(v as 'week' | 'month' | 'year')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="week" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Semaine</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Mois</span>
              </TabsTrigger>
              <TabsTrigger value="year" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Année</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs 
        value={dataType} 
        onValueChange={(v) => setDataType(v as 'symptoms' | 'stool' | 'medication')}
      >
        <TabsList className="w-full">
          <TabsTrigger value="symptoms" className="flex-1">Symptômes</TabsTrigger>
          <TabsTrigger value="stool" className="flex-1">Selles</TabsTrigger>
          <TabsTrigger value="medication" className="flex-1">Médicaments</TabsTrigger>
        </TabsList>

        <TabsContent value="symptoms" className="mt-4">
          <div className="glass-card rounded-xl p-5">
            <Table>
              <TableCaption>
                Synthèse des symptômes - {
                  timeframe === 'week' ? 'Semaine' : 
                  timeframe === 'month' ? 'Mois' : 'Année'
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symptôme</TableHead>
                  <TableHead>Occurrences</TableHead>
                  <TableHead>Sévérité moyenne</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSymptomData().map((symptom, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{symptom.date}</TableCell>
                    <TableCell>{symptom.name}</TableCell>
                    <TableCell>{symptom.count}</TableCell>
                    <TableCell className={cn(getSeverityColor(symptom.severity))}>
                      {symptom.severity} - {
                        symptom.severity <= 1 ? "Légère" :
                        symptom.severity === 2 ? "Modérée" :
                        symptom.severity === 3 ? "Sévère" : "Très sévère"
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="stool" className="mt-4">
          <div className="glass-card rounded-xl p-5">
            <Table>
              <TableCaption>
                Synthèse des selles - {
                  timeframe === 'week' ? 'Semaine' : 
                  timeframe === 'month' ? 'Mois' : 'Année'
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type moyen (Bristol)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Nombre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getStoolData().map((stool, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{stool.date}</TableCell>
                    <TableCell>{stool.type}</TableCell>
                    <TableCell>{getStoolTypeDescription(stool.type)}</TableCell>
                    <TableCell>{stool.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="medication" className="mt-4">
          <div className="glass-card rounded-xl p-5">
            <Table>
              <TableCaption>
                Observance médicamenteuse - {
                  timeframe === 'week' ? 'Semaine' : 
                  timeframe === 'month' ? 'Mois' : 'Année'
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Médicament</TableHead>
                  <TableHead>Observance</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getMedicationData().map((med, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{med.date}</TableCell>
                    <TableCell>{med.name}</TableCell>
                    <TableCell className={cn(getAdherenceColor(med.adherence))}>
                      {med.adherence}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          getAdherenceColor(med.adherence)
                        )}></div>
                        <span>
                          {med.adherence >= 80 ? "Excellente" : 
                           med.adherence >= 60 ? "À améliorer" : "Insuffisante"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTables;
