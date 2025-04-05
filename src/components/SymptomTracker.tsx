import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/supabase';
import { addData, deleteData } from '@/hooks/supabase';

// Common symptoms for Crohn's disease
const commonSymptoms = [
  "Douleur abdominale",
  "Diarrhée",
  "Fatigue",
  "Perte d'appétit",
  "Nausée",
  "Fièvre",
  "Douleur articulaire",
  "Perte de poids",
  "Saignement rectal",
  "Crampes",
  "Ballonnements"
];

const severityLevels = [
  { value: 1, label: "Légère", color: "bg-health-green" },
  { value: 2, label: "Modérée", color: "bg-health-yellow" },
  { value: 3, label: "Sévère", color: "bg-health-orange" },
  { value: 4, label: "Très sévère", color: "bg-health-red" }
];

// Interface pour les données de symptômes
interface SymptomLog {
  id?: string;
  symptom: string;
  severity: number;
  time: string;
  notes: string | null;
  user_id?: string;
  created_at?: string;
}

const SymptomTracker = () => {
  const [showForm, setShowForm] = useState(false);
  const [symptom, setSymptom] = useState("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState(1);
  const [notes, setNotes] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Utiliser le hook pour récupérer les données de Supabase
  const { data: logs, loading, error } = useSupabaseData<SymptomLog>('symptoms', {
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos symptômes",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer un symptôme",
        variant: "destructive",
      });
      return;
    }
    
    const now = new Date();
    const time = now.toISOString();
    
    const symptomToAdd = symptom === "Autre" ? customSymptom : symptom;
    
    if (!symptomToAdd) return;
    
    try {
      // Ajouter à Supabase
      const { data, error } = await addData<SymptomLog>('symptoms', {
        symptom: symptomToAdd,
        severity,
        notes: notes || null,
        time,
        user_id: user.id
      });
      
      if (error) throw error;
      
      toast({
        title: "Symptôme enregistré",
        description: "Votre symptôme a été enregistré avec succès",
      });
      
      resetForm();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du symptôme:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setShowForm(false);
    setSymptom("");
    setCustomSymptom("");
    setSeverity(1);
    setNotes("");
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteData('symptoms', id);
      
      if (error) throw error;
      
      toast({
        title: "Symptôme supprimé",
        description: "Le symptôme a été supprimé avec succès",
      });
    } catch (err) {
      console.error("Erreur lors de la suppression du symptôme:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour formater la date/heure pour l'affichage
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <h1 className="text-2xl font-display font-medium mb-2">Suivi des symptômes</h1>
        <p className="text-muted-foreground">Enregistrez vos symptômes pour suivre l'évolution de votre maladie</p>
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full bg-crohn-500 hover:bg-crohn-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un symptôme</span>
        </button>
      </div>
      
      {/* Add symptom form */}
      {showForm && (
        <div className="glass-card rounded-xl p-5 animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-medium">Nouveau symptôme</h2>
            <button 
              onClick={resetForm} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Symptôme</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 flex items-center justify-between"
                >
                  <span>{symptom || "Sélectionnez un symptôme"}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1 shadow-lg animate-fade-in">
                    {[...commonSymptoms, "Autre"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setSymptom(item);
                          setDropdownOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {symptom === "Autre" && (
              <div>
                <label className="block text-sm font-medium mb-1">Précisez le symptôme</label>
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4"
                  placeholder="Entrez votre symptôme"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Intensité</label>
              <div className="grid grid-cols-4 gap-2">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={cn(
                      "border rounded-lg py-2 px-3 flex flex-col items-center justify-center transition-all duration-300",
                      severity === level.value
                        ? "border-crohn-500 bg-crohn-50 dark:bg-crohn-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setSeverity(level.value)}
                  >
                    <div className={cn("w-3 h-3 rounded-full mb-1", level.color)}></div>
                    <span className="text-xs">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 min-h-[80px]"
                placeholder="Ajoutez des détails sur ce symptôme"
              ></textarea>
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
                disabled={!symptom || (symptom === "Autre" && !customSymptom)}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Symptom logs */}
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-1">
        <h2 className="font-display font-medium mb-4">Historique récent</h2>
        
        {loading ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        ) : logs && logs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun symptôme enregistré</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs && logs.map(log => (
              <div key={log.id} className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      log.severity === 1 ? "bg-health-green" : "",
                      log.severity === 2 ? "bg-health-yellow" : "",
                      log.severity === 3 ? "bg-health-orange" : "",
                      log.severity === 4 ? "bg-health-red" : "",
                    )}></div>
                    <h3 className="font-medium">{log.symptom}</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">{formatDateTime(log.time || log.created_at || '')}</span>
                    <button 
                      onClick={() => handleDelete(log.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {log.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;
