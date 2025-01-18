import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addUser } from '../api/auth';
import { useAuth } from '../contexts/Auth.context';

const Register: React.FC = () => {
  const { isAuthed } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Voer een geldig e-mailadres in.');
      return;
    }

    if (password.length < 6) {
      toast.error('Het wachtwoord moet minimaal 6 tekens lang zijn.');
      return;
    }

    try {
      await addUser({ name, email, password });
      toast.success('Registratie geslaagd! U kunt nu inloggen.');
      navigate('/login');
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error('E-mailadres is al in gebruik. Probeer een ander e-mailadres.');
      } else {
        toast.error('Er is een netwerkfout opgetreden. Controleer uw verbinding en probeer het opnieuw.');
      }
    }
  };

  useEffect(() => {
    if (isAuthed) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAuthed, navigate]);

  if (isAuthed) {
    return (
      <div className="alert alert-success mt-3">
        U bent al geauthenticeerd. U wordt binnen 5 seconden doorgestuurd naar de homepagina.
      </div>
    );
  }

  return (
    <form className="container mt-4" onSubmit={handleRegister}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Naam
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          placeholder="Voer uw naam in"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          placeholder="Voer uw e-mailadres in"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Wachtwoord
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Voer uw wachtwoord in"
          required
        />
      </div>
      <button className="btn btn-primary w-100" type="submit">
        Registreren
      </button>
      <p className="text-center mt-3">
        Heb je al een account?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-primary"
          style={{ cursor: 'pointer' }}
        >
          Inloggen
        </span>
      </p>
    </form>
  );
};

export default Register;
