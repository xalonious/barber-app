import React, { useState, useEffect } from 'react';
import { fetchAppointments, Appointment, deleteAppointment } from '../api/appointments';
import { useAuth } from '../contexts/Auth.context';
import AppointmentForm from '../components/AppointmentForm';
import { toast } from 'react-toastify';
import { FaPen, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const MyAppointmentsPage: React.FC = () => {
  const { user, isAuthed } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadAppointments = async () => {
    if (!user) return;
    setLoading(true);
    setError(null); 
    try {
      const data = await fetchAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Er was een probleem bij het laden van uw afspraken. Controleer uw verbinding en probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const handleDelete = async (appointmentId: number) => {
    if (!window.confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) return;

    try {
      await deleteAppointment(appointmentId);
      toast.success('Afspraak succesvol verwijderd.');
      setAppointments(appointments.filter((appt) => appt.appointmentId !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Kan afspraak niet verwijderen. Controlleer uw verbinding en probeer opnieuw.');
    }
  };

  const handleEdit = (appointmentId: number) => {
    setEditingAppointmentId(appointmentId);
  };

  const handleFormSuccess = () => {
    setEditingAppointmentId(null);
    loadAppointments();
  };

  const handleFormCancel = () => {
    setEditingAppointmentId(null);
  };

  const formatAppointment = (date: string) => {
    const parsedDate = new Date(date);
    const formattedDate = format(parsedDate, 'EEEE d MMMM', { locale: nl });
    const formattedTime = format(parsedDate, 'HH:mm', { locale: nl });
    return `${formattedDate} ${formattedTime}`;
  };


  if (!isAuthed) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2
          className="display-4 fw-bold text-white"
          style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.7)' }}
        >
          Mijn Afspraken
        </h2>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : appointments.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center">
          <p
            className="fs-2 mb-4 text-white"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
          >
            U heeft nog geen afspraken.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/createappointment')}
          >
            Klik hier om een afspraak te maken
          </button>
        </div>
      ) : (
        <div className="accordion" id="appointmentsAccordion">
          {appointments.map((appt) => (
            <div className="card mb-3" key={appt.appointmentId}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5
                    className="card-title text-dark"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    {formatAppointment(appt.date)} - {appt.service.name}
                  </h5>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleEdit(appt.appointmentId)}
                      title="Bewerken"
                    >
                      <FaPen />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(appt.appointmentId)}
                      title="Verwijderen"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {editingAppointmentId === appt.appointmentId && (
                  <div className="mt-4">
                    <h5
                      className="text-dark"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                    >
                      Afspraak Wijzigen
                    </h5>
                    <AppointmentForm
                      initialData={{
                        appointmentId: appt.appointmentId,
                        service: appt.service.name,
                        staffId: appt.staffId,
                        date: format(new Date(appt.date), 'yyyy-MM-dd'),
                        time: format(new Date(appt.date), 'HH:mm'),
                      }}
                      onSuccess={handleFormSuccess} 
                      onCancel={handleFormCancel}
                    />
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

export default MyAppointmentsPage;
