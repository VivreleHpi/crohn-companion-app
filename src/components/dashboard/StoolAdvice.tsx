
import React from 'react';

interface StoolAdviceProps {
  stoolType: number;
}

// Fonction pour donner des conseils en fonction du type de selles
const getStoolAdvice = (stoolType: number) => {
  if (stoolType <= 2) {
    return "Constipation: Évitez le riz blanc et les aliments pauvres en fibres. Hydratez-vous davantage.";
  } else if (stoolType >= 6) {
    return "Diarrhée: Privilégiez les aliments riches en amidons. Évitez les aliments gras et les produits laitiers.";
  } else {
    return "Selles normales: Continuez à bien vous hydrater et à maintenir une alimentation équilibrée.";
  }
};

const StoolAdvice: React.FC<StoolAdviceProps> = ({ stoolType }) => {
  return (
    <div className="glass-card rounded-xl p-5 animate-on-load stagger-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-medium">Conseils personnalisés</h2>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg">
        <p className="text-sm">
          {getStoolAdvice(stoolType)}
        </p>
        <div className="mt-2 border-t border-blue-200 dark:border-blue-800/50 pt-2">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Conseils basés sur vos derniers enregistrements. Consultez votre médecin pour des recommandations spécifiques à votre cas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoolAdvice;
