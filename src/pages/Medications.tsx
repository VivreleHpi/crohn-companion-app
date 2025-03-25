
import React from 'react';
import Header from '@/components/Header';
import MedicationReminder from '@/components/MedicationReminder';

const Medications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-crohn-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4">
        <Header />
        <MedicationReminder />
      </div>
    </div>
  );
};

export default Medications;
