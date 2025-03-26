
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Types pour les rendez-vous
type Appointment = {
  id: string;
  title: string;
  date: Date;
  type: string;
  notes?: string;
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Consultation gastro-entérologue',
    date: new Date(2023, 5, 15, 10, 30),
    type: 'Consultation',
    notes: 'Apporter les résultats de la prise de sang'
  },
  {
    id: '2',
    title: 'Coloscopie',
    date: new Date(2023, 6, 20, 8, 0),
    type: 'Examen',
    notes: 'À jeun depuis la veille'
  }
];

const AppointmentReminders = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    type: '',
    notes: ''
  });

  const handleAddAppointment = () => {
    if (!date || !newAppointment.title || !newAppointment.type) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      date: date,
      type: newAppointment.type,
      notes: newAppointment.notes || undefined
    };

    setAppointments([...appointments, appointment]);
    setIsDialogOpen(false);
    setNewAppointment({ title: '', type: '', notes: '' });
    setDate(undefined);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Rendez-vous médicaux</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
              <DialogDescription>
                Ajoutez les détails de votre prochain rendez-vous médical.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Consultation gastro-entérologue"
                  value={newAppointment.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  placeholder="Ex: Consultation, Examen, Prélèvement..."
                  value={newAppointment.type}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Date et heure</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP à HH:mm", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                    {date && (
                      <div className="p-3 border-t border-border">
                        <Label htmlFor="appointmentTime">Heure</Label>
                        <Input
                          id="appointmentTime"
                          type="time"
                          className="mt-1"
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(date);
                            newDate.setHours(hours, minutes);
                            setDate(newDate);
                          }}
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Instructions spéciales, rappels..."
                  value={newAppointment.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddAppointment}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucun rendez-vous planifié
            </div>
          ) : (
            appointments.map(appointment => (
              <div 
                key={appointment.id}
                className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{appointment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.date, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {appointment.type}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm mt-2 text-muted-foreground">{appointment.notes}</p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentReminders;
