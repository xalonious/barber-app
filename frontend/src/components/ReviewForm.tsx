import React, { useState } from 'react';
import { addReview } from '../api/reviews';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/Auth.context';
import { Review } from './ReviewList';

interface ReviewFormProps {
  onReviewAdded: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onReviewAdded }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const { isAuthed, user } = useAuth(); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthed || !user) { 
      toast.error('U moet ingelogd zijn om een review te plaatsen.');
      return;
    }

    if (!comment.trim()) {
      toast.error('Opmerking mag niet leeg zijn.');
      return;
    }

    try {
      const newReview = await addReview({ rating, comment });

      onReviewAdded({
        ...newReview,
        customer: {
          name: user.name, 
          customerId: user.id,
        },
      });

      toast.success('Bedankt! Uw review is succesvol ingediend.');
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Er was een probleem bij het indienen van uw review. Controleer uw verbinding en probeer het opnieuw.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <label>
        Beoordeling:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star} {star === 1 ? 'Ster' : 'Sterren'}
            </option>
          ))}
        </select>
      </label>
      <label>
        Opmerking:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Schrijf uw review..."
        ></textarea>
      </label>
      <button type="submit">Review Verzenden</button>
    </form>
  );
};

export default ReviewForm;
