import { prisma } from '../data';
import ServiceError from '../core/ServiceError';
import { getLogger } from '../core/logging';

export const getAllReviews = async () => {
  try {
    return await prisma.review.findMany({
      include: {
        customer: {
          select: { name: true, customerId: true },
        },
      },
    });
  } catch (error) {
    getLogger().error('Error retrieving reviews:', error);
    throw ServiceError.internalServerError('Error retrieving reviews');
  }
};

export const createReview = async ({
  customerId,
  rating,
  comment,
}: {
  customerId: number;
  rating: number;
  comment: string;
}) => {
  const customer = await prisma.customer.findUnique({
    where: { customerId },
  });

  if (!customer) {
    throw ServiceError.validationFailed('Customer does not exist.');
  }

  try {
    return await prisma.review.create({
      data: {
        customerId,
        rating,
        comment,
      },
      include: {
        customer: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    getLogger().error('Error creating review:', error);
    throw ServiceError.validationFailed('Failed to create review');
  }
};

export const deleteReviewById = async (reviewId: number, customerId: number) => {
  const review = await prisma.review.findUnique({
    where: { reviewId },
  });

  if (!review) {
    throw ServiceError.notFound(`No review found with ID ${reviewId}`);
  }

  if (review.customerId !== customerId) {
    throw ServiceError.forbidden('You are not authorized to delete this review');
  }

  try {
    return await prisma.review.delete({
      where: { reviewId },
    });
  } catch (error: any) {
    getLogger().error('Error deleting review:', error);
    throw ServiceError.internalServerError('Error deleting review');
  }
};

export const getReviewById = async (reviewId: number) => {
  try {
    const review = await prisma.review.findUnique({
      where: { reviewId },
    });
    if (!review) {
      throw ServiceError.notFound(`No review found with ID ${reviewId}`);
    }
    return review;
  } catch (error) {
    getLogger().error(`Error retrieving review with ID ${reviewId}:`, error);
    throw ServiceError.internalServerError(`Error retrieving review with ID ${reviewId}`);
  }
};
