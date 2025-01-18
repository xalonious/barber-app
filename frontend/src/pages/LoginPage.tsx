import React from 'react';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <h1 className="text-dark mb-3">Welkom terug</h1>
      <p className="text-muted mb-4">Gelieve in te loggen</p>
      <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
