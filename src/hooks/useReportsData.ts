
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface SymptomDataItem {
  day: string;
  count: number;
  severity: number;
}

export interface StoolDataItem {
  day: string;
  count: number;
  bristolType: number;
}

export interface MedicationDataItem {
  day: string;
  scheduled: number;
  taken: number;
}

// Helper to format dates consistently
const formatDate = (date: Date): string => {
  return format(date, 'EEE', { locale: fr });
};

// Transforme une date ISO en jour de la semaine abrégé en français
const getDayFromISODate = (isoDate: string): string => {
  const date = parseISO(isoDate);
  return formatDate(date);
};

export const useReportsData = (currentWeekStart: Date) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [symptomData, setSymptomData] = useState<SymptomDataItem[]>([]);
  const [stoolData, setStoolData] = useState<StoolDataItem[]>([]);
  const [medicationData, setMedicationData] = useState<MedicationDataItem[]>([]);
  const [status, setStatus] = useState<'remission' | 'crisis'>('remission');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);

      try {
        // Calculer dates de début et fin de semaine
        const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 }); // Commence le lundi
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 }); // Finit le dimanche

        // Récupérer les symptômes
        const { data: symptomsRaw, error: symptomsError } = await supabase
          .from('symptoms')
          .select('*')
          .eq('user_id', user.id)
          .gte('time', weekStart.toISOString())
          .lte('time', weekEnd.toISOString())
          .order('time', { ascending: true });

        if (symptomsError) throw symptomsError;

        // Récupérer les selles
        const { data: stoolsRaw, error: stoolsError } = await supabase
          .from('stools')
          .select('*')
          .eq('user_id', user.id)
          .gte('time', weekStart.toISOString())
          .lte('time', weekEnd.toISOString())
          .order('time', { ascending: true });

        if (stoolsError) throw stoolsError;

        // Récupérer les médicaments pris
        const { data: medicationsRaw, error: medicationsError } = await supabase
          .from('medication_schedule')
          .select('*, medication:medication_id(name)')
          .eq('user_id', user.id)
          .gte('scheduled_date', weekStart.toISOString().split('T')[0])
          .lte('scheduled_date', weekEnd.toISOString().split('T')[0]);

        if (medicationsError) throw medicationsError;

        // Créer les données formatées pour les graphiques
        const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        
        // Créer un tableau avec les jours de la semaine et des valeurs par défaut
        const initialDayData = daysOfWeek.map(day => ({
          day,
          count: 0,
          severity: 0, // pour symptômes
          bristolType: 0, // pour selles
          scheduled: 0, // pour médicaments
          taken: 0 // pour médicaments
        }));

        // Transformer les données de symptômes
        const symptomsByDay = [...initialDayData];
        let totalSeverity = 0;
        
        symptomsRaw?.forEach(symptom => {
          const dayOfWeek = getDayFromISODate(symptom.time);
          const dayIndex = daysOfWeek.findIndex(d => d === dayOfWeek);
          
          if (dayIndex >= 0) {
            symptomsByDay[dayIndex].count += 1;
            symptomsByDay[dayIndex].severity += symptom.severity;
            totalSeverity += symptom.severity;
          }
        });

        // Calculer la sévérité moyenne par jour
        symptomsByDay.forEach(day => {
          if (day.count > 0) {
            day.severity = Math.round(day.severity / day.count);
          }
        });

        // Transformer les données de selles
        const stoolsByDay = [...initialDayData];
        let bloodCount = 0;
        let totalBristolType = 0;

        stoolsRaw?.forEach(stool => {
          const dayOfWeek = getDayFromISODate(stool.time);
          const dayIndex = daysOfWeek.findIndex(d => d === dayOfWeek);
          
          if (dayIndex >= 0) {
            stoolsByDay[dayIndex].count += 1;
            stoolsByDay[dayIndex].bristolType += stool.bristol_type;
            totalBristolType += stool.bristol_type;
            if (stool.has_blood) bloodCount++;
          }
        });

        // Calculer le type Bristol moyen par jour
        stoolsByDay.forEach(day => {
          if (day.count > 0) {
            day.bristolType = Math.round(day.bristolType / day.count);
          }
        });

        // Transformer les données de médicaments
        const medicationsByDay = [...initialDayData];
        
        medicationsRaw?.forEach(med => {
          const scheduledDate = new Date(med.scheduled_date);
          const dayOfWeek = formatDate(scheduledDate);
          const dayIndex = daysOfWeek.findIndex(d => d === dayOfWeek);
          
          if (dayIndex >= 0) {
            medicationsByDay[dayIndex].scheduled += 1;
            if (med.taken) {
              medicationsByDay[dayIndex].taken += 1;
            }
          }
        });

        // Déterminer le statut (rémission ou crise)
        // Règles simplifiées: si sévérité moyenne > 2 OU type bristol moyen < 3 ou > 5 OU présence de sang
        const avgSeverity = symptomsRaw?.length ? totalSeverity / symptomsRaw.length : 0;
        const avgBristolType = stoolsRaw?.length ? totalBristolType / stoolsRaw.length : 4;
        const hasBlood = bloodCount > 0;
        
        const newStatus = (avgSeverity > 2 || avgBristolType < 3 || avgBristolType > 5 || hasBlood) 
          ? 'crisis' 
          : 'remission';
        
        setStatus(newStatus);
        setSymptomData(symptomsByDay);
        setStoolData(stoolsByDay);
        setMedicationData(medicationsByDay);
      } catch (error: any) {
        console.error('Erreur lors de la récupération des données:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de récupérer vos données d'analyses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, currentWeekStart, toast]);

  return {
    loading,
    symptomData,
    stoolData,
    medicationData,
    status
  };
};
