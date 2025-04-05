import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/supabase';
import { addData, deleteData } from '@/hooks/supabase';

// Bristol Stool Scale
const bristolScaleTypes = [
  { 
    value: 1, 
    label: "Type 1", 
    description: "Morceaux durs et séparés, comme des noix, difficiles à évacuer",
    color: "bg-amber-800"
  },
  { 
    value: 2, 
    label: "Type 2", 
    description: "En forme de saucisse mais grumeleuse",
    color: "bg-amber-600"
  },
  { 
    value: 3, 
    label: "Type 3", 
    description: "Comme une saucisse mais avec des craquelures",
    color: "bg-amber-500"
  },
  { 
    value: 4, 
    label: "Type 4", 
    description: "Comme une saucisse ou un serpent, lisse et molle",
    color: "bg-amber-400"
  },
  { 
    value: 5, 
    label: "Type 5", 
    description: "Morceaux mous avec des bords nets, faciles à évacuer",
    color: "bg-amber-300"
  },
  { 
    value: 6, 
    label: "Type 6", 
    description: "Morceaux duveteux aux bords déchiquetés, pâteuse",
    color: "bg-amber-200"
  },
  { 
    value: 7, 
    label: "Type 7", 
    description: "Aqueuse, sans morceaux solides, entièrement liquide",
    color: "bg-amber-100"
  }
];

// Interface pour les données de selles
interface StoolLog {
  id?: string;
  bristol_type: number;
  time: string;
  date?: string;
  has_blood: boolean;
  has_mucus: boolean;
  notes: string | null;
  user_id?: string;
  created_at?: string;
}

const StoolTracker = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [hasBlood, setHasBlood] = useState(false);
  const [hasMucus, setHasMucus] = useState(false);
  const [notes, setNotes] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Utiliser le hook pour récupérer les données de Supabase
  const { data: logs, loading, error } = useSupabaseData<StoolLog>('stools', {
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos données de selles",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !user) return;
    
    try {
      const now = new Date();
      
      // Ajouter à Supabase
      const { data, error } = await addData<StoolLog>('stools', {
        bristol_type: selectedType,
        has_blood: hasBlood,
        has_mucus: hasMucus,
        notes: notes || null,
        time: now.toISOString()
      });
      
      if (error) throw error;
      
      toast({
        title: "Selle enregistrée",
        description: "Votre selle a été enregistrée avec succès",
      });
      
      resetForm();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la selle:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setShowForm(false);
    setSelectedType(null);
    setHasBlood(false);
    setHasMucus(false);
    setNotes("");
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteData('stools', id);
      
      if (error) throw error;
      
      toast({
        title: "Selle supprimée",
        description: "L'enregistrement a été supprimé avec succès",
      });
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    });
  };
  
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="space-y-6 pb-20">
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-display font-medium">Suivi des selles</h1>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="bg-crohn-100 dark:bg-crohn-900/30 text-crohn-600 dark:text-crohn-300 rounded-full p-1.5 hover:bg-crohn-200 dark:hover:bg-crohn-800/30 transition-all duration-300"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted-foreground">Utilisez l'échelle de Bristol pour suivre vos selles</p>
        
        {showInfo && (
          <div className="mt-4 bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 animate-fade-in">
            <h3 className="font-medium mb-2">Échelle de Bristol</h3>
            <p className="text-sm text-muted-foreground mb-3">
              L'échelle de Bristol est une échelle médicale conçue pour classer la forme des selles humaines en 7 catégories.
            </p>
            <div className="space-y-2 text-sm">
              {bristolScaleTypes.map(type => (
                <div key={type.value} className="flex items-start space-x-2">
                  <div className={`${type.color} w-4 h-4 rounded-full mt-1 flex-shrink-0`}></div>
                  <div>
                    <span className="font-medium">{type.label}:</span> {type.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full bg-crohn-500 hover:bg-crohn-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Enregistrer une selle</span>
        </button>
      </div>
      
      {showForm && (
        <div className="glass-card rounded-xl p-5 animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-medium">Nouvelle entrée</h2>
            <button 
              onClick={resetForm} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Type de selle (Échelle de Bristol)</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {bristolScaleTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={cn(
                      "border rounded-lg p-3 flex flex-col items-start transition-all duration-300",
                      selectedType === type.value
                        ? "border-crohn-500 bg-crohn-50 dark:bg-crohn-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={cn("w-4 h-4 rounded-full", type.color)}></div>
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasBlood}
                    onChange={() => setHasBlood(!hasBlood)}
                    className="w-4 h-4 text-crohn-600 rounded"
                  />
                  <span>Présence de sang</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasMucus}
                    onChange={() => setHasMucus(!hasMucus)}
                    className="w-4 h-4 text-crohn-600 rounded"
                  />
                  <span>Présence de mucus</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 min-h-[80px]"
                placeholder="Ajoutez des détails supplémentaires"
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
                disabled={selectedType === null}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="glass-card rounded-xl p-5 animate-on-load stagger-1">
        <h2 className="font-display font-medium mb-4">Historique récent</h2>
        
        {loading ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        ) : logs && logs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucune selle enregistrée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs && logs.map(log => (
              <div key={log.id} className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      log.bristol_type === 1 ? "bg-amber-800" : "",
                      log.bristol_type === 2 ? "bg-amber-600" : "",
                      log.bristol_type === 3 ? "bg-amber-500" : "",
                      log.bristol_type === 4 ? "bg-amber-400" : "",
                      log.bristol_type === 5 ? "bg-amber-300" : "",
                      log.bristol_type === 6 ? "bg-amber-200" : "",
                      log.bristol_type === 7 ? "bg-amber-100" : "",
                    )}></div>
                    <div>
                      <h3 className="font-medium">
                        Type {log.bristol_type} 
                        {(log.has_blood || log.has_mucus) && (
                          <span className="text-sm font-normal ml-2">
                            {log.has_blood && "• Sang"}
                            {log.has_blood && log.has_mucus && " "}
                            {log.has_mucus && "• Mucus"}
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">
                      {formatTime(log.time || log.created_at || '')} • {formatDate(log.time || log.created_at || '')}
                    </span>
                    <button 
                      onClick={() => handleDelete(log.id!)}
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

export default StoolTracker;
