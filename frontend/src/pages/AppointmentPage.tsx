import React from 'react';
import AppointmentForm from '../components/AppointmentForm';
import { useNavigate } from 'react-router-dom';

const AppointmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/myappointments');
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2
          className="display-4 fw-bold text-white"
          style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.7)' }}
        >
          Maak uw afspraak
        </h2>
        <p
          className="lead text-light"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
        >
          Selecteer een dienst, medewerker, datum en tijd om uw afspraak te boeken.
        </p>
      </div>

      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <AppointmentForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default AppointmentPage;
