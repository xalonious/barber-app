import apiClient from './axiosInstance';

export interface Review {
  reviewId: number; 
  rating: number;
  comment: string;
  customer?: {
    name: string;
    customerId: number;
  }; 
}

export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await apiClient.get<Review[]>('/reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const addReview = async (review: { rating: number; comment: string }): Promise<Review> => {
  try {
    const response = await apiClient.post<Review>('/reviews', review);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await apiClient.delete(`/reviews/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
