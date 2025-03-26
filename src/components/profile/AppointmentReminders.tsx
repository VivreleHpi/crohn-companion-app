
import React, { useState } from 'react';
import { Calendar, Plus, Check, Trash2, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

// Données de démonstration pour les rendez-vous
const demoAppointments = [
  { 
    id: 1, 
    title: 'Gastro-entérologue', 
    date: new Date(2023, 5, 20), 
    location: 'Hôpital Saint Antoine',
    notes: 'Apporter résultats analyses',
    weight: 72.5
  },
  { 
    id: 2, 
    title: 'Coloscopie', 
    date: new Date(2023, 6, 15), 
    location: 'Clinique du Parc',
    notes: 'À jeun depuis la veille',
    weight: null
  }
];

const AppointmentReminders = () => {
  const [appointments, setAppointments] = useState(demoAppointments);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: new Date(),
    location: '',
    notes: '',
    weight: null
  });
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddAppointment = () => {
    if (newAppointment.title && newAppointment.date) {
      setAppointments([
        ...appointments, 
        { ...newAppointment, id: Date.now() }
      ]);
      setNewAppointment({
        title: '',
        date: new Date(),
        location: '',
        notes: '',
        weight: null
      });
      setShowAddForm(false);
    }
  };
  
  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };
  
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-medium">Rappel de rendez-vous</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-crohn-600 dark:text-crohn-300"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>
      
      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Nouveau rendez-vous</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Titre</label>
              <Input 
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                placeholder="Type de rendez-vous"
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newAppointment.date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newAppointment.date ? (
                      format(newAppointment.date, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={newAppointment.date}
                    onSelect={(date) => setNewAppointment({...newAppointment, date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Lieu</label>
              <Input 
                value={newAppointment.location}
                onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                placeholder="Lieu du rendez-vous"
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Notes</label>
              <Input 
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                placeholder="Instructions, rappels..."
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center">
                <Weight className="h-4 w-4 mr-1" /> Poids (kg)
              </label>
              <div className="flex items-center space-x-2">
                <Slider
                  defaultValue={[newAppointment.weight || 70]}
                  min={30}
                  max={150}
                  step={0.5}
                  onValueChange={(value) => setNewAppointment({...newAppointment, weight: value[0]})}
                  className="w-full"
                />
                <span className="w-12 text-center text-sm font-medium">
                  {newAppointment.weight || 70} kg
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                className="mr-2"
                onClick={() => setShowAddForm(false)}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleAddAppointment}
              >
                <Check className="w-4 h-4 mr-1" /> Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {appointments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p>Aucun rendez-vous programmé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">{appointment.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-sm">
                <div className="flex items-center text-crohn-600 dark:text-crohn-300">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(appointment.date, "EEEE d MMMM yyyy", { locale: fr })}</span>
                </div>
                
                {appointment.location && (
                  <p className="mt-1 text-muted-foreground">
                    {appointment.location}
                  </p>
                )}
                
                {appointment.notes && (
                  <p className="mt-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded text-muted-foreground">
                    {appointment.notes}
                  </p>
                )}
                
                {appointment.weight && (
                  <div className="mt-2 flex items-center">
                    <Weight className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{appointment.weight} kg</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentReminders;
