
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Send, 
  Printer, 
  Calendar,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const fakeStoolData = [
  { date: "10/06/2023", time: "07:45", type: 3, blood: false, mucus: false, notes: "" },
  { date: "09/06/2023", time: "14:30", type: 6, blood: true, mucus: true, notes: "Douleurs abdominales avant" },
  { date: "08/06/2023", time: "08:15", type: 5, blood: false, mucus: false, notes: "" },
  { date: "07/06/2023", time: "19:20", type: 4, blood: false, mucus: false, notes: "Après repas copieux" },
  { date: "06/06/2023", time: "09:10", type: 6, blood: true, mucus: false, notes: "Douleurs légères" }
];

const fakeSymptomData = [
  { date: "10/06/2023", time: "08:30", symptom: "Douleur abdominale", severity: 2, notes: "Côté droit" },
  { date: "09/06/2023", time: "15:00", symptom: "Fatigue", severity: 3, notes: "Toute la journée" },
  { date: "08/06/2023", time: "12:45", symptom: "Nausée", severity: 1, notes: "Après le déjeuner" },
  { date: "07/06/2023", time: "20:30", symptom: "Douleur articulaire", severity: 2, notes: "Genou droit" },
  { date: "06/06/2023", time: "18:15", symptom: "Douleur abdominale", severity: 3, notes: "Crampes intenses" }
];

const MedicalReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7 derniers jours");
  const [includeStool, setIncludeStool] = useState(true);
  const [includeSymptoms, setIncludeSymptoms] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const { toast } = useToast();

  const handleSend = () => {
    toast({
      title: "Rapport prêt à être partagé",
      description: "Votre rapport médical a été préparé et peut être envoyé à votre médecin.",
    });
  };
  
  const handlePrint = () => {
    toast({
      title: "Impression...",
      description: "Votre rapport est envoyé à l'imprimante.",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Téléchargement commencé",
      description: "Votre rapport est en cours de téléchargement au format PDF.",
    });
  };
  
  return (
    <div className="space-y-6 pb-20">
      <div className="glass-card rounded-xl p-5 animate-on-load">
        <h1 className="text-2xl font-display font-medium mb-2">Rapport médical</h1>
        <p className="text-muted-foreground">Générez un rapport détaillé pour votre médecin</p>
        
        <div className="mt-6 bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Période du rapport</h2>
            
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
              <button className="text-crohn-600 dark:text-crohn-300 hover:bg-crohn-50 dark:hover:bg-crohn-900/10 rounded p-1.5">
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="bg-crohn-100 dark:bg-crohn-900/30 text-crohn-600 dark:text-crohn-300 rounded-full p-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium">{selectedPeriod}</span>
              </div>
              
              <button className="text-crohn-600 dark:text-crohn-300 hover:bg-crohn-50 dark:hover:bg-crohn-900/10 rounded p-1.5">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeStool}
                onChange={() => setIncludeStool(!includeStool)}
                className="w-4 h-4 text-crohn-600 rounded"
              />
              <span>Inclure données de selles</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeSymptoms}
                onChange={() => setIncludeSymptoms(!includeSymptoms)}
                className="w-4 h-4 text-crohn-600 rounded"
              />
              <span>Inclure symptômes</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeMedications}
                onChange={() => setIncludeMedications(!includeMedications)}
                className="w-4 h-4 text-crohn-600 rounded"
              />
              <span>Inclure observance médicamenteuse</span>
            </label>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 bg-crohn-500 hover:bg-crohn-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF</span>
            </button>
            
            <button 
              onClick={handleSend}
              className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer</span>
            </button>
            
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>
      </div>
      
      {includeStool && (
        <div className="glass-card rounded-xl p-5 animate-on-load stagger-1">
          <h2 className="font-display font-medium mb-4">Suivi des selles (Échelle de Bristol)</h2>
          
          <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg overflow-hidden">
            <Table>
              <TableCaption>Données des selles pour la période: {selectedPeriod}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sang</TableHead>
                  <TableHead>Mucus</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fakeStoolData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>Type {entry.type}</TableCell>
                    <TableCell>{entry.blood ? "Oui" : "Non"}</TableCell>
                    <TableCell>{entry.mucus ? "Oui" : "Non"}</TableCell>
                    <TableCell>{entry.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between px-2 text-sm text-muted-foreground">
            <p>Nombre moyen de selles par jour: <span className="font-medium">1.9</span></p>
            <p>Type moyen (Échelle de Bristol): <span className="font-medium">4.8</span></p>
            <p>Présence de sang: <span className="font-medium text-red-500">40%</span> des cas</p>
          </div>
        </div>
      )}
      
      {includeSymptoms && (
        <div className="glass-card rounded-xl p-5 animate-on-load stagger-2">
          <h2 className="font-display font-medium mb-4">Suivi des symptômes</h2>
          
          <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg overflow-hidden">
            <Table>
              <TableCaption>Données des symptômes pour la période: {selectedPeriod}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Symptôme</TableHead>
                  <TableHead>Intensité</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fakeSymptomData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>{entry.symptom}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: entry.severity }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-health-orange rounded-full" />
                        ))}
                        {Array.from({ length: 3 - entry.severity }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{entry.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between px-2 text-sm text-muted-foreground">
            <p>Symptômes les plus fréquents: <span className="font-medium">Douleur abdominale (40%)</span></p>
            <p>Intensité moyenne: <span className="font-medium text-health-orange">2.2/3</span></p>
          </div>
        </div>
      )}
      
      {includeMedications && (
        <div className="glass-card rounded-xl p-5 animate-on-load stagger-3">
          <h2 className="font-display font-medium mb-4">Observance médicamenteuse</h2>
          
          <div className="bg-white/50 dark:bg-gray-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Observance globale:</p>
              <p className="font-medium text-health-green">89%</p>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-health-green h-2.5 rounded-full" style={{ width: "89%" }}></div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p>Médicament A (matin)</p>
                  <p className="text-health-green">100%</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-health-green h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p>Médicament B (midi)</p>
                  <p className="text-health-orange">76%</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-health-orange h-2 rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p>Médicament C (soir)</p>
                  <p className="text-health-green">92%</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-health-green h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              Note: Les doses oubliées sont principalement le médicament B à midi (3 oublis dans la période).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReport;
