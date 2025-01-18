// src/components/AppointmentForm.tsx

import React, { useState, useEffect } from 'react';
import { fetchStaffMembers, getStaffAvailability } from '../api/staff';
import { createAppointment, updateAppointment, CreateAppointmentData, UpdateAppointmentData } from '../api/appointments';
import { format, isToday, addDays } from 'date-fns';
import { nl } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

interface StaffMember {
  staffId: number;
  name: string;
}

const serviceMap: { [key: string]: number } = {
  "Knipbeurt": 1,
  "Baardtrimmen": 2,
  "Scheren": 3,
  "Kapsel & Baard Combinatie": 4,
};

interface AppointmentFormProps {
  initialData?: {
    appointmentId: number;
    service: string;
    staffId: number;
    date: string; 
    time: string; 
  };
  onSuccess: () => void;
  onCancel?: () => void;
  onLoading?: (isLoading: boolean) => void; // Nieuwe prop
  onError?: (message: string) => void;       // Nieuwe prop
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onSuccess, onCancel, onLoading, onError }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(initialData?.service || null);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(initialData?.staffId || null);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialData?.date || null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialData?.time || null);
  const [loadingTimes, setLoadingTimes] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loadStaffMembers = async () => {
      if (onLoading) onLoading(true);
      try {
        const staff = await fetchStaffMembers();
        setStaffMembers(staff);
        if (onLoading) onLoading(false);
      } catch (error) {
        console.error('Error fetching staff members:', error);
        toast.error('Kan medewerkers niet laden. Controleer uw verbinding en probeer opnieuw.');
        if (onError) onError('Kan medewerkers niet laden. Controleer uw verbinding en probeer opnieuw.');
        if (onLoading) onLoading(false);
      }
    };

    loadStaffMembers();
  }, [onLoading, onError]);

  const loadAvailableTimes = async () => {
    if (selectedStaff && selectedDate && selectedService) {
      if (onLoading) onLoading(true);
      setLoadingTimes(true);
      try {
        const serviceId = serviceMap[selectedService];
        const times = await getStaffAvailability(selectedStaff, selectedDate, serviceId);

        if (isToday(new Date(selectedDate))) {
          const now = new Date();
          const filteredTimes = times.filter((time) => {
            const [hour, minute] = time.split(':').map(Number);
            const timeInMinutes = hour * 60 + minute;
            const nowInMinutes = now.getHours() * 60 + now.getMinutes();
            return timeInMinutes > nowInMinutes;
          });
          setAvailableTimes(filteredTimes);
        } else {
          setAvailableTimes(times);
        }
      } catch (error) {
        console.error('Error fetching available times:', error);
        toast.error('Kan beschikbare tijden niet laden. Controleer uw verbinding en probeer opnieuw.');
        if (onError) onError('Kan beschikbare tijden niet laden. Controleer uw verbinding en probeer opnieuw.');
        setAvailableTimes([]);
      } finally {
        setLoadingTimes(false);
        if (onLoading) onLoading(false);
      }
    } else {
      setAvailableTimes([]);
    }
  };

  useEffect(() => {
    loadAvailableTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStaff, selectedDate, selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) {
      toast.error('Vul alle velden in.');
      return;
    }

    setIsSubmitting(true);
    if (onLoading) onLoading(true);

    try {
      const formattedDateTime = `${selectedDate}T${selectedTime}`;
      const appointmentData: CreateAppointmentData | UpdateAppointmentData = {
        service: selectedService,
        staffId: selectedStaff,
        date: formattedDateTime,
      };

      if (initialData) {
        await updateAppointment(initialData.appointmentId, appointmentData as UpdateAppointmentData);
        toast.success('Afspraak succesvol bijgewerkt!');
      } else {
        await createAppointment(appointmentData as CreateAppointmentData);
        toast.success('Afspraak succesvol gemaakt!');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error creating/updating appointment:', error);
      toast.error('Kan afspraak niet aanmaken. Controleer uw verbinding en probeer opnieuw.');
      if (onError) onError('Kan afspraak niet aanmaken. Controleer uw verbinding en probeer opnieuw.');
    } finally {
      setIsSubmitting(false);
      if (onLoading) onLoading(false);
    }
  };

  const generateDateOptions = () => {
    const today = new Date();
    const options = [];
    for (let i = 0; i < 31; i++) {
      const date = addDays(today, i);
      if (date.getDay() !== 0) { // Exclude Sundays
        options.push(format(date, 'yyyy-MM-dd'));
      }
    }
    return options;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="serviceSelect" className="form-label">Kies een dienst</label>
        <select
          id="serviceSelect"
          className="form-select"
          value={selectedService || ''}
          onChange={(e) => {
            setSelectedService(e.target.value || null);
            setSelectedTime(null);
            setAvailableTimes([]);
          }}
          required
        >
          <option value="">-- Selecteer een dienst --</option>
          {Object.keys(serviceMap).map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="staffSelect" className="form-label">Kies een medewerker</label>
        <select
          id="staffSelect"
          className="form-select"
          value={selectedStaff || ''}
          onChange={(e) => setSelectedStaff(Number(e.target.value))}
          required
        >
          <option value="">-- Selecteer een medewerker --</option>
          {staffMembers.map((staff) => (
            <option key={staff.staffId} value={staff.staffId}>
              {staff.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="dateSelect" className="form-label">Kies een datum</label>
        <select
          id="dateSelect"
          className="form-select"
          value={selectedDate || ''}
          onChange={(e) => setSelectedDate(e.target.value || null)}
          required
        >
          <option value="">-- Selecteer een datum --</option>
          {generateDateOptions().map((date) => (
            <option key={date} value={date}>
              {format(new Date(date), 'dd MMMM yyyy', { locale: nl })}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="timeSelect" className="form-label">Kies een tijd</label>
        <select
          id="timeSelect"
          className="form-select"
          value={selectedTime || ''}
          onChange={(e) => setSelectedTime(e.target.value || null)}
          disabled={loadingTimes || availableTimes.length === 0}
          required
        >
          <option value="">
            {loadingTimes
              ? 'Laden...'
              : availableTimes.length > 0
              ? '-- Selecteer een tijd --'
              : 'Geen beschikbare tijden'}
          </option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!selectedService || !selectedStaff || !selectedDate || !selectedTime || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="spin me-2" />
            {initialData ? 'Opslaan...' : 'Bevestigen...'}
          </>
        ) : initialData ? 'Wijziging Opslaan' : 'Bevestig afspraak'}
      </button>

      {onCancel && (
        <button
          type="button"
          className="btn btn-secondary w-100 mt-2"
          onClick={onCancel}
        >
          Annuleren
        </button>
      )}
    </form>
  );
};

export default AppointmentForm;
