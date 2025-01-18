import request from 'supertest';
import { prisma } from '../../src/data';
import { setupTestServer } from '../helpers/setupTestServer';
import { hashPassword } from '../../src/core/password';

describe('Auth API', () => {
  let app: any;

  beforeAll(async () => {
    app = await setupTestServer();
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer and return a success message', async () => {
      const newCustomer = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newCustomer);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message: 'Registration successful. Please log in.',
      });
    });

    it('should return 409 if email is already registered', async () => {
      const existingCustomer = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      };

      await prisma.customer.deleteMany({ where: { email: existingCustomer.email } });

      await prisma.customer.create({
        data: {
          name: existingCustomer.name,
          email: existingCustomer.email,
          passwordHash: await hashPassword(existingCustomer.password),
        },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingCustomer);

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        code: 'CONFLICT',
        message: 'A customer with this email already exists',
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing customer and return a token', async () => {
      const existingCustomer = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      await prisma.customer.deleteMany({ where: { email: existingCustomer.email } });

      await prisma.customer.create({
        data: {
          name: existingCustomer.name,
          email: existingCustomer.email,
          passwordHash: await hashPassword(existingCustomer.password),
        },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: existingCustomer.email,
          password: existingCustomer.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid email or password', async () => {
      const invalidLogin = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLogin);

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    });
  });
});
