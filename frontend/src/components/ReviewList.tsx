// src/components/ReviewList.tsx

import React, { useState, useEffect } from 'react';
import { fetchReviews, deleteReview } from '../api/reviews';
import { useAuth } from '../contexts/Auth.context';
import { toast } from 'react-toastify';

export interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  customer?: {
    name: string;
    customerId: number;
  };
}

interface ReviewListProps {
  newReview?: Review | null;
}

const ReviewList: React.FC<ReviewListProps> = ({ newReview }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setError(true); 
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    if (newReview) {
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    }
  }, [newReview]);

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      toast.success('Review succesvol verwijderd.', {
        toastId: 'delete-success',
        onOpen: () => {
          const toastElement = document.querySelector(`[data-toast-id="delete-success"]`);
          if (toastElement) {
            toastElement.setAttribute('data-cy', 'toast-delete-success');
          }
        },
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Er was een probleem bij het verwijderen van de review.', {
        toastId: 'delete-error',
        onOpen: () => {
          const toastElement = document.querySelector(`[data-toast-id="delete-error"]`);
          if (toastElement) {
            toastElement.setAttribute('data-cy', 'toast-delete-error');
          }
        },
      });
    }
  };

  if (error) {
    return (
      <p className="error-message" data-cy="error-message">
        Er was een probleem bij het laden van de reviews.
      </p>
    );
  }

  return (
    <div className="reviews" data-cy="review-list">
      <h2 className="reviews-title" data-cy="review-list-title">Reviews van Klanten</h2>
      {reviews.length === 0 ? (
        <p className="reviews-empty" data-cy="no-reviews-message">
          Er zijn nog geen reviews beschikbaar.
        </p>
      ) : (
        <ul className="review-list" data-cy="reviews-ul">
          {reviews.map((review) => (
            <li key={review.reviewId} className="review" data-cy="review-item">
              <div className="review-content" data-cy="review-content">
                <p className="review-customer" data-cy="review-customer-name">
                  <strong>{review.customer?.name || 'Gast'}</strong>
                </p>
                <p className="review-rating" data-cy="review-rating">
                  {review.rating} {review.rating === 1 ? 'Ster' : 'Sterren'}
                </p>
                <p className="review-comment" data-cy="review-comment">
                  {review.comment}
                </p>
              </div>
              {user?.id === review.customer?.customerId && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(review.reviewId)}
                  title="Verwijder review"
                  data-cy={`delete-review-button-${review.reviewId}`}
                >
                  🗑️
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
