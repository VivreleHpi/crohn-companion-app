
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Hook générique pour récupérer des données de Supabase
export const useSupabaseData = <T>(
  tableName: string,
  options?: {
    column?: string;
    value?: any;
    select?: string;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
  }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Ne pas essayer de récupérer des données si l'utilisateur n'est pas connecté
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Construction de la requête
        let query = supabase
          .from(tableName)
          .select(options?.select || '*');
        
        // Filtrer par utilisateur par défaut
        query = query.eq('user_id', user.id);
        
        // Ajouter d'autres filtres si nécessaire
        if (options?.column && options?.value !== undefined) {
          query = query.eq(options.column, options.value);
        }
        
        // Ajouter l'ordre si spécifié
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending 
          });
        }
        
        // Ajouter une limite si spécifiée
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        // Exécuter la requête
        const { data: result, error } = await query;
        
        if (error) throw error;
        
        setData(result as T[]);
      } catch (err: any) {
        console.error(`Erreur lors de la récupération des données de ${tableName}:`, err);
        setError(err);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de récupérer les données de ${tableName}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, options, user, toast]);

  return { data, loading, error };
};

// Fonction pour ajouter des données
export const addData = async <T extends object>(
  tableName: string, 
  data: T
): Promise<{ data: any; error: any }> => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    return { data: result, error };
  } catch (error) {
    console.error(`Erreur lors de l'ajout de données à ${tableName}:`, error);
    return { data: null, error };
  }
};

// Fonction pour mettre à jour des données
export const updateData = async <T extends object>(
  tableName: string,
  id: string,
  data: Partial<T>
): Promise<{ data: any; error: any }> => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    return { data: result, error };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de données dans ${tableName}:`, error);
    return { data: null, error };
  }
};

// Fonction pour supprimer des données
export const deleteData = async (
  tableName: string,
  id: string
): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    return { error };
  } catch (error) {
    console.error(`Erreur lors de la suppression de données de ${tableName}:`, error);
    return { error };
  }
};
