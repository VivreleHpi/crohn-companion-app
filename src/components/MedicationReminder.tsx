
import React, { useState } from 'react';
import { Plus, Clock, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder medications
const initialMedications = [
  { 
    id: 1, 
    name: "Azathioprine", 
    dosage: "50mg", 
    frequency: "1 fois par jour",
    time: "08:00",
    lastTaken: "2023-06-10",
    status: "active"
  },
  { 
    id: 2, 
    name: "Prednisone", 
    dosage: "20mg", 
    frequency: "1 fois par jour",
    time: "08:00",
    lastTaken: "2023-06-09",
    status: "active"
  },
  { 
    id: 3, 
    name: "Mésalazine", 
    dosage: "1000mg", 
    frequency: "3 fois par jour",
    time: "08:00, 14:00, 20:00",
    lastTaken: "2023-06-10",
    status: "active"
  }
];

// Today's scheduled medications
const todaySchedule = [
  { id: 1, medicationId: 1, time: "08:00", taken: true },
  { id: 2, medicationId: 2, time: "08:00", taken: false },
  { id: 3, medicationId: 3, time: "08:00", taken: true },
  { id: 4, medicationId: 3, time: "14:00", taken: false },
  { id: 5, medicationId: 3, time: "20:00", taken: false }
];

const MedicationReminder = () => {
  const [medications, setMedications] = useState(initialMedications);
  const [schedule, setSchedule] = useState(todaySchedule);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("1");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !dosage) return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const newMedication = {
      id: Date.now(),
      name,
      dosage,
      frequency: `${frequency} fois par jour`,
      time: times.join(", "),
      lastTaken: today,
      status: "active"
    };
    
    setMedications([...medications, newMedication]);
    
    // Create schedule entries for the new medication
    const newScheduleEntries = times.map((time, index) => ({
      id: Date.now() + index,
      medicationId: newMedication.id,
      time,
      taken: false
    }));
    
    setSchedule([...schedule, ...newScheduleEntries]);
    resetForm();
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
  
  const handleTaken = (scheduleId: number) => {
    setSchedule(schedule.map(item => 
      item.id === scheduleId ? { ...item, taken: true } : item
    ));
  };
  
  const getMedicationById = (id: number) => {
    return medications.find(med => med.id === id);
  };
  
  const getUpcomingMedications = () => {
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
                  const medication = getMedicationById(item.medicationId);
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
                        onClick={() => handleTaken(item.id)}
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
                  const medication = getMedicationById(item.medicationId);
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
      </div>
      
      {/* Medication list */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
        <h2 className="font-display font-medium mb-4">Mes médicaments</h2>
        
        {medications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun médicament enregistré</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map(medication => (
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
