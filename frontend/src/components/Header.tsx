import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth.context';

const Header: React.FC = () => {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Max Kapsalon</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/createappointment" className="nav-link">Afspraak maken</Link>
              </li>
              <li className="nav-item">
                <Link to="/myappointments" className="nav-link">Mijn afspraken</Link>
              </li>
              <li className="nav-item">
                <Link to="/staff" className="nav-link">Ons team</Link>
              </li>
              {isAuthed ? (
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="btn btn-outline-light ms-3">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
