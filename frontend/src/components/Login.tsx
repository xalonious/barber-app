// src/pages/Login.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Auth.context';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Access 'from' from location.state
  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('E-mail en wachtwoord zijn verplicht.');
      return;
    }

    const loginSuccessful = await login(email, password);
    if (loginSuccessful) {
      navigate(from, { replace: true });
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
      <div className="alert alert-success mt-3" data-cy="auth-success-alert">
        U bent al geauthenticeerd. U wordt binnen 5 seconden doorgestuurd naar
        de homepagina.
      </div>
    );
  }

  return (
    <form className="container mt-4" onSubmit={handleLogin} data-cy="login-form">
      <div className="mb-3">
        <label htmlFor="email" className="form-label" data-cy="email-label">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vul uw e-mail in"
          className="form-control"
          required
          data-cy="email-input"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label" data-cy="password-label">
          Wachtwoord
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vul uw wachtwoord in"
          className="form-control"
          required
          data-cy="password-input"
        />
      </div>
      <button className="btn btn-primary w-100" type="submit" data-cy="submit_login">
        Inloggen
      </button>
      <p className="text-center mt-3" data-cy="register-prompt">
        Heb je nog geen account?{' '}
        <span
          onClick={() => navigate('/register')}
          className="text-primary"
          style={{ cursor: 'pointer' }}
          data-cy="register-link"
        >
          Registreer hier
        </span>
      </p>
    </form>
  );
};

export default Login;
