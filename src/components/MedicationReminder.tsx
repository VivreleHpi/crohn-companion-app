import React, { useState, useEffect } from 'react';
import { Plus, Clock, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/supabase';
import { addData, updateData, deleteData } from '@/hooks/supabase';

// Interface pour les médicaments
interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

// Interface pour les prises de médicaments
interface MedicationSchedule {
  id?: string;
  medication_id: string;
  time: string;
  taken: boolean;
  taken_at?: string;
  user_id?: string;
  scheduled_date?: string;
  created_at?: string;
}

const MedicationReminder = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("1");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Utiliser les hooks pour récupérer les données de Supabase
  const { data: medications, loading: loadingMeds, error: medsError } = useSupabaseData<Medication>('medications', {
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const { data: schedule, loading: loadingSchedule, error: scheduleError } = useSupabaseData<MedicationSchedule>('medication_schedule', {
    select: '*',
    orderBy: { column: 'time', ascending: true }
  });
  
  useEffect(() => {
    if (medsError) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos médicaments",
        variant: "destructive",
      });
    }
    
    if (scheduleError) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger votre calendrier de médicaments",
        variant: "destructive",
      });
    }
  }, [medsError, scheduleError, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !dosage || !user) return;
    
    try {
      // Ajouter le médicament à Supabase
      const { data: medicationData, error: medError } = await addData<Medication>('medications', {
        name,
        dosage,
        frequency: `${frequency} fois par jour`,
        time: times.join(", "),
        status: "active"
      });
      
      if (medError) throw medError;
      
      if (medicationData && medicationData[0]) {
        const medId = medicationData[0].id;
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        // Créer les entrées de calendrier pour le médicament
        const schedulePromises = times.map(async (time) => {
          return addData<MedicationSchedule>('medication_schedule', {
            medication_id: medId!,
            time,
            taken: false,
            scheduled_date: today
          });
        });
        
        await Promise.all(schedulePromises);
        
        toast({
          title: "Médicament ajouté",
          description: "Votre médicament a été ajouté avec succès",
        });
        
        resetForm();
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du médicament:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setShowForm(false);
    setName("");
    setDosage("");
    setFrequency("1");
    setTimes(["08:00"]);
  };
  
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFrequency(value);
    
    // Reset times array based on frequency
    const count = parseInt(value);
    if (count === 1) {
      setTimes(["08:00"]);
    } else if (count === 2) {
      setTimes(["08:00", "20:00"]);
    } else if (count === 3) {
      setTimes(["08:00", "14:00", "20:00"]);
    } else if (count === 4) {
      setTimes(["08:00", "12:00", "16:00", "20:00"]);
    }
  };
  
  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };
  
  const handleTaken = async (scheduleId: string) => {
    try {
      const now = new Date();
      
      const { error } = await updateData<MedicationSchedule>('medication_schedule', scheduleId, {
        taken: true,
        taken_at: now.toISOString()
      });
      
      if (error) throw error;
      
      toast({
        title: "Médicament pris",
        description: "Prise de médicament enregistrée avec succès",
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la prise:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };
  
  const getMedicationById = (id: string) => {
    return medications?.find(med => med.id === id);
  };
  
  const getUpcomingMedications = () => {
    if (!schedule) return [];
    return schedule.filter(item => !item.taken).sort((a, b) => {
      // Sort by time
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      }
      return timeA[1] - timeB[1];
    });
  };
  
  const getTakenMedications = () => {
    if (!schedule) return [];
    return schedule.filter(item => item.taken);
  };
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <h1 className="text-2xl font-display font-medium mb-2">Médicaments</h1>
        <p className="text-muted-foreground">Gérez vos médicaments et suivez vos prises</p>
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full bg-crohn-500 hover:bg-crohn-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un médicament</span>
        </button>
      </div>
      
      {/* Add medication form */}
      {showForm && (
        <div className="glass-card rounded-xl p-5 animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-medium">Nouveau médicament</h2>
            <button 
              onClick={resetForm} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du médicament</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4"
                placeholder="Ex: Azathioprine"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4"
                placeholder="Ex: 50mg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fréquence quotidienne</label>
              <select
                value={frequency}
                onChange={handleFrequencyChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4"
              >
                <option value="1">1 fois par jour</option>
                <option value="2">2 fois par jour</option>
                <option value="3">3 fois par jour</option>
                <option value="4">4 fois par jour</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Horaires</label>
              <div className="space-y-3">
                {times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4"
                    />
                    <span className="text-sm text-gray-500">Prise {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-all duration-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-crohn-500 hover:bg-crohn-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300"
                disabled={!name || !dosage}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Today's schedule */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-1">
        <h2 className="font-display font-medium mb-4">Aujourd'hui</h2>
        
        {loadingSchedule ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Upcoming medications */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">À prendre</h3>
              
              {getUpcomingMedications().length === 0 ? (
                <div className="text-center py-4 text-muted-foreground bg-white/50 dark:bg-gray-800/20 rounded-lg">
                  <p>Tout est pris pour aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getUpcomingMedications().map(item => {
                    const medication = getMedicationById(item.medication_id);
                    if (!medication) return null;
                    
                    return (
                      <div key={item.id} className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-3">
                            <div className="bg-crohn-100 dark:bg-crohn-900/30 text-crohn-500 dark:text-crohn-300 rounded-full p-1.5">
                              <Clock className="w-4 h-4" />
                            </div>
                            <h3 className="font-medium">{medication.name}</h3>
                          </div>
                          <div className="ml-9 mt-1 text-sm text-muted-foreground">
                            {medication.dosage} • {item.time}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleTaken(item.id!)}
                          className="bg-crohn-500 hover:bg-crohn-600 text-white rounded-full p-2 transition-all duration-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Medications taken today */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Déjà pris</h3>
              
              {getTakenMedications().length === 0 ? (
                <div className="text-center py-4 text-muted-foreground bg-white/50 dark:bg-gray-800/20 rounded-lg">
                  <p>Aucun médicament pris aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTakenMedications().map(item => {
                    const medication = getMedicationById(item.medication_id);
                    if (!medication) return null;
                    
                    return (
                      <div key={item.id} className="bg-gray-100/80 dark:bg-gray-800/10 rounded-lg p-4 flex justify-between items-center text-muted-foreground">
                        <div>
                          <div className="flex items-center space-x-3">
                            <div className="bg-crohn-50 dark:bg-crohn-900/10 text-crohn-400 dark:text-crohn-500 rounded-full p-1.5">
                              <Check className="w-4 h-4" />
                            </div>
                            <h3 className="font-medium">{medication.name}</h3>
                          </div>
                          <div className="ml-9 mt-1 text-sm">
                            {medication.dosage} • {item.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Medication list */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
        <h2 className="font-display font-medium mb-4">Mes médicaments</h2>
        
        {loadingMeds ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        ) : medications && medications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun médicament enregistré</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications && medications.map(medication => (
              <div key={medication.id} className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{medication.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {medication.dosage} • {medication.frequency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Horaires: {medication.time}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-crohn-100 dark:bg-crohn-900/30 text-crohn-500 dark:text-crohn-300 rounded-full p-1.5">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationReminder;
