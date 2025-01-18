import e, { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { createReview, getAllReviews, deleteReviewById } from '../service/review';
import { validateRequest } from '../core/validation';
import { createReviewSchema, reviewIdParamSchema } from '../validation/review';
import { requireAuthentication } from '../core/auth';
import ServiceError from '../core/ServiceError';

const router = Router();

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: List of all reviews
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const reviews = await getAllReviews();
      res.status(200).json(reviews);
    } catch (error) {
      if(error instanceof ServiceError && error.isInternalServerError) {
      res.status(500).json({ error: error.message });
      }
    }
  })
);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Review data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */
router.post(
  '/',
  requireAuthentication,
  validateRequest(createReviewSchema),
  asyncHandler(async (req, res) => {
    const { customerId, rating, comment } = req.body;

    try {
      const newReview = await createReview({
      customerId,
      rating,
      comment,
      });
      res.status(201).json(newReview);
    } catch (error: any) {
      if (error instanceof ServiceError && error.isValidationFailed) {
        res.status(400).json({ error: 'Validation failed', details: error.message });
      } else {
      res.status(500).json({ error: error.message });
      }
    }
  })
);

/**
 * @swagger
 * /api/reviews/{reviewid}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       403:
 *         description: Unauthorized to delete
 *       404:
 *         description: Review not found
 */
router.delete(
  '/:reviewid',
  requireAuthentication,
  validateRequest(reviewIdParamSchema),
  asyncHandler(async (req, res) => {
    const reviewId = parseInt(req.params.reviewid, 10);
    const customerId = req.body.customerId;

    try {
      await deleteReviewById(reviewId, customerId);
      res.status(204).send(); // Successfully deleted
    } catch (error: any) {
      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          return res.status(404).json({ error: error.message });
        }

        if (error.isForbidden) {
          return res.status(403).json({ error: error.message });
        }
        
        return res.status(500).json({ error: error.message });
      }

      res.status(500).json({ error: 'Failed to delete review' });
    }
  })
);


export default router;
