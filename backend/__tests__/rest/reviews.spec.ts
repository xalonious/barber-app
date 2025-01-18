import request from 'supertest';
import { prisma } from '../../src/data';
import { createTestCustomerAndToken } from '../helpers/auth';
import { setupTestServer } from '../helpers/setupTestServer';
import { expectValidResponse } from '../helpers/assertions';

describe('Reviews API', () => {
  let app: any;
  let token: string;
  let customerId: number;

  beforeAll(async () => {
    app = await setupTestServer();

    const { testCustomer, token: generatedToken } = await createTestCustomerAndToken();
    token = generatedToken;
    customerId = testCustomer.customerId;
  });

  afterAll(async () => {
    await prisma.review.deleteMany();
    await prisma.customer.deleteMany();
  });

  describe('POST /api/reviews', () => {
    it('should create a review and return 201', async () => {
      const newReview = {
        rating: 5,
        comment: 'Excellent service!',
        customerId,
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send(newReview);

      expectValidResponse(response, 201);
      expect(response.body).toHaveProperty('reviewId');
      expect(response.body).toMatchObject({
        rating: newReview.rating,
        comment: newReview.comment,
      });
    });

    it('should return 401 if not authenticated', async () => {
      const newReview = {
        rating: 4,
        comment: 'Unauthorized Review',
        customerId,
      };

      const response = await request(app).post('/api/reviews').send(newReview);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/reviews', () => {
    it('should return 200 and all reviews', async () => {
      const response = await request(app).get('/api/reviews');
      expectValidResponse(response, 200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('DELETE /api/reviews/:reviewId', () => {
    it('should delete a review and return 204', async () => {
      const review = await prisma.review.create({
        data: {
          customerId,
          rating: 4,
          comment: 'Good service!',
        },
      });

      const response = await request(app)
        .delete(`/api/reviews/${review.reviewId}`)
        .set('Authorization', `Bearer ${token}`);

      expectValidResponse(response, 204);
    });

    it('should return 401 if not authenticated', async () => {
      const review = await prisma.review.create({
        data: {
          customerId,
          rating: 3,
          comment: 'Unauthorized Delete',
        },
      });

      const response = await request(app).delete(`/api/reviews/${review.reviewId}`);
      expect(response.status).toBe(401);
    });
  });
});
