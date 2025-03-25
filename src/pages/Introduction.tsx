
import React from 'react';
import Header from '@/components/Header';
import { AlertTriangle, ThumbsUp, BookOpen, Newspaper, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Introduction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4">
        <Header />
        
        <div className="glass-card rounded-xl p-5 animate-on-load mb-6">
          <h1 className="text-2xl font-display font-medium mb-2">Bienvenue sur CrohnAssist</h1>
          <p className="text-muted-foreground">
            Une application dédiée au suivi quotidien des personnes vivant avec la maladie de Crohn
          </p>
          
          <div className="mt-6 bg-white/50 dark:bg-gray-800/20 rounded-lg p-5">
            <h2 className="text-xl font-display font-medium mb-3">Notre objectif</h2>
            <p className="mb-4">
              CrohnAssist a été conçu pour vous aider à suivre vos symptômes, vos selles selon l'échelle de Bristol, 
              et votre observance médicamenteuse afin de mieux gérer votre maladie au quotidien et 
              de faciliter la communication avec votre équipe médicale.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-crohn-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Suivi complet</h3>
                  <p className="text-sm text-muted-foreground">
                    Enregistrez vos symptômes, selles et médicaments facilement au quotidien
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Newspaper className="w-5 h-5 text-crohn-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Rapports détaillés</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualisez l'évolution de votre état de santé avec des graphiques clairs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ThumbsUp className="w-5 h-5 text-crohn-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Conseils pratiques</h3>
                  <p className="text-sm text-muted-foreground">
                    Trouvez des recommandations adaptées pour gérer certains symptômes courants
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Send className="w-5 h-5 text-crohn-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Partage médical</h3>
                  <p className="text-sm text-muted-foreground">
                    Envoyez facilement vos données à votre équipe médicale pour un meilleur suivi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-on-load stagger-1 mb-6 border-2 border-red-200 dark:border-red-900/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 rounded-full">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-display font-medium text-red-600 dark:text-red-300">
              Avertissement médical important
            </h2>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4 text-sm">
            <p className="mb-3">
              Cette application est un outil de suivi et ne remplace en aucun cas un avis médical professionnel.
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">En cas d'urgence</span>: Contactez immédiatement le 15, le 112 (numéro d'urgence européen) 
                ou rendez-vous aux urgences les plus proches.
              </li>
              <li>
                <span className="font-medium">Symptômes préoccupants</span>: Si vous constatez du sang dans vos selles, une douleur intense, 
                de la fièvre ou tout autre symptôme inhabituel, consultez votre médecin rapidement.
              </li>
              <li>
                <span className="font-medium">Traitement</span>: Ne modifiez jamais votre traitement sans l'avis de votre médecin, 
                même si vos symptômes s'améliorent.
              </li>
              <li>
                <span className="font-medium">Données personnelles</span>: Les données collectées par cette application sont stockées 
                localement sur votre appareil. Partagez-les uniquement avec des professionnels de santé que vous connaissez.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-on-load stagger-2 mb-10">
          <h2 className="text-xl font-display font-medium mb-4">Conseils pratiques</h2>
          
          <div className="space-y-4">
            <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-amber-600 dark:text-amber-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> En cas de diarrhée
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Hydratez-vous régulièrement avec de l'eau, des bouillons ou des solutions de réhydratation</li>
                <li>Privilégiez une alimentation pauvre en fibres (riz blanc, pâtes, pain blanc, poisson/viande maigre)</li>
                <li>Évitez les aliments gras, épicés, les fruits crus et les légumes</li>
                <li>Les aliments riches en pectine (compote de pommes, bananes mûres) peuvent aider</li>
                <li>Si les symptômes persistent plus de 48h, consultez votre médecin</li>
              </ul>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-amber-600 dark:text-amber-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> En cas de douleurs abdominales
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Appliquez une bouillotte chaude sur l'abdomen (mais pas en cas de fièvre)</li>
                <li>Privilégiez de petits repas fréquents plutôt que des repas copieux</li>
                <li>Évitez les aliments connus pour aggraver vos symptômes</li>
                <li>Pratiquez des techniques de relaxation (respiration profonde, méditation)</li>
                <li>Si la douleur est intense ou inhabituelle, consultez rapidement un médecin</li>
              </ul>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-amber-600 dark:text-amber-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> En cas de fatigue intense
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Planifiez des périodes de repos dans votre journée</li>
                <li>Veillez à maintenir une alimentation équilibrée riche en protéines</li>
                <li>Restez hydraté tout au long de la journée</li>
                <li>Pratiquez une activité physique légère et régulière (après avis médical)</li>
                <li>Faites vérifier vos niveaux de fer, vitamine B12 et D par votre médecin</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/dashboard" 
              className="bg-crohn-500 hover:bg-crohn-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Commencer à utiliser l'application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
