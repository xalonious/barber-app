import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="not-found" data-cy="not-found-page">
      <div className="not-found-content">
        <h1 data-cy="not-found-heading">404 - Pagina Niet Gevonden</h1>
        <p data-cy="not-found-message">Sorry, de pagina die je zoekt bestaat niet.</p>
        <Link to="/" className="back-home" data-cy="go-home-button">
          Ga terug naar Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
