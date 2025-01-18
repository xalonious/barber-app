import React, { useState } from 'react';
import '../styles/Home.css';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { Review } from '../components/ReviewList';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [newReview, setNewReview] = useState<Review | null>(null);
  const navigate = useNavigate();

  const handleReviewAdded = (review: Review) => {
    setNewReview(review);
  };

  const handleAppointmentClick = () => {
    navigate('/createappointment');
  };

  return (
    <div className="home" data-cy="home-page">
      <section className="hero" data-cy="hero-section">
        <div className="hero-overlay" data-cy="hero-overlay">
          <h1 data-cy="hero-heading">Welkom in ons kapsalon</h1>
          <p data-cy="hero-description">
            Bij ons ben je in goede handen voor de beste kapsels, stijlen en baardverzorging.
            Onze ervaren kappers en stylisten staan klaar om je een verzorgde, frisse look te geven.
          </p>
          <button
            className="book-button"
            onClick={handleAppointmentClick}
            data-cy="book-appointment-button"
          >
            Maak een Afspraak
          </button>
        </div>
      </section>

      <section className="services" data-cy="services-section">
        <h2 data-cy="services-heading">Onze Diensten</h2>
        <ul data-cy="services-list">
          <li data-cy="service-item-knipbeurt">
            <strong>Knipbeurt</strong> - €20
          </li>
          <li data-cy="service-item-baardtrimmen">
            <strong>Baardtrimmen</strong> - €15
          </li>
          <li data-cy="service-item-scheren">
            <strong>Scheren</strong> - €20
          </li>
          <li data-cy="service-item-kapsel-baard-combinatie">
            <strong>Kapsel & Baard Combinatie</strong> - €35
          </li>
        </ul>
      </section>

      <section className="mission" data-cy="mission-section">
        <h2 data-cy="mission-heading">Onze Missie</h2>
        <p data-cy="mission-description">
          Onze missie is om hoogwaardige verzorgingsdiensten te bieden in een gastvrije en comfortabele omgeving.
        </p>
        <h2 data-cy="goal-heading">Ons Doel</h2>
        <p data-cy="goal-description">
          Ons doel is om jouw vertrouwde partner in stijl te zijn, en je elke dag op je best te laten voelen.
        </p>
      </section>

      <section className="reviews" data-cy="reviews-section">
        <ReviewList newReview={newReview} data-cy="review-list" />
        <ReviewForm onReviewAdded={handleReviewAdded} data-cy="review-form" />
      </section>
    </div>
  );
};

export default Home;
