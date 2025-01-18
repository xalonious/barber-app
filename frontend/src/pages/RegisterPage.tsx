import React from 'react';
import Register from '../components/Register';

const RegisterPage: React.FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <h1 className="text-dark mb-3">Account aanmaken</h1>
      <p className="text-muted mb-4">Vul uw gegevens in om te registreren</p>
      <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
