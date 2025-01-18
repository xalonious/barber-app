import supertest, { SuperTest, Test } from 'supertest';
import createServer from '../../src/createServer';
import type { Express } from 'express';

describe('Health API', () => {
  let app: Express;
  let request: SuperTest<Test>;

  beforeAll(async () => {
    const server = await createServer();
    app = server.getApp();
    request = supertest(app) as unknown as SuperTest<Test>;
  });

  describe('GET /api/health/ping', () => {
    it('should return pong', async () => {
      const response = await request.get('/api/health/ping');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pong', true);
    });
  });

  describe('GET /api/health/version', () => {
    it('should return version and status', async () => {
      const response = await request.get('/api/health/version');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status', 'up');
    });
  });
});
