import supertest, { SuperTest, Test } from 'supertest';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import type { Express } from 'express';

describe('Staff API', () => {
  let app: Express;
  let request: SuperTest<Test>;
  let staffId: number;
  let customerId: number;
  let knipbeurtServiceId: number;
  let baardtrimmenServiceId: number;

  beforeAll(async () => {
    const server = await createServer();
    app = server.getApp();
    request = supertest(app) as unknown as SuperTest<Test>;

    const staff = await prisma.staff.create({
      data: {
        name: 'Test Staff',
        role: 'Stylist',
        headshot: 'testheadshot.jpg',
        description: 'Experienced stylist specializing in modern cuts.',
      },
    });
    staffId = staff.staffId;

    const customer = await prisma.customer.create({
      data: {
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        passwordHash: 'hashedPassword123',
      },
    });
    customerId = customer.customerId;

    await prisma.service.createMany({
      data: [
        { name: 'Knipbeurt', price: 20, duration: 30 }, // 30 minutes
        { name: 'Baardtrimmen', price: 15, duration: 20 }, // 20 minutes
      ],
      skipDuplicates: true,
    });

    const services = await prisma.service.findMany();
    const knipbeurtService = services.find((s) => s.name === 'Knipbeurt');
    const baardtrimmenService = services.find((s) => s.name === 'Baardtrimmen');

    if (!knipbeurtService || !baardtrimmenService) {
      throw new Error('Required services not found. Ensure the services are correctly seeded.');
    }

    knipbeurtServiceId = knipbeurtService.serviceId;
    baardtrimmenServiceId = baardtrimmenService.serviceId;

    await prisma.appointment.createMany({
      data: [
        {
          staffId,
          customerId,
          date: '2025-03-01T10:00:00.000Z', // 11:00 AM Belgian time
          serviceId: knipbeurtServiceId,
        },
        {
          staffId,
          customerId,
          date: '2025-03-01T11:00:00.000Z', // 12:00 PM Belgian time
          serviceId: baardtrimmenServiceId,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.service.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/staff', () => {
    it('should return 200 and all staff members', async () => {
      const response = await request.get('/api/staff');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('name', 'Test Staff');
      expect(response.body[0]).toHaveProperty('role', 'Stylist');
      expect(response.body[0]).toHaveProperty('headshot', 'testheadshot.jpg');
      expect(response.body[0]).toHaveProperty(
        'description',
        'Experienced stylist specializing in modern cuts.'
      );
    });
  });

  describe('GET /api/staff/:staffId/availability', () => {
    it('should return 200 and available times for a given staff member, date, and service', async () => {
      const response = await request
        .get(`/api/staff/${staffId}/availability`)
        .query({ date: '2025-03-01', serviceId: knipbeurtServiceId });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const availableTimes = response.body;

      // Available times
      expect(availableTimes).toContain('09:00');
      expect(availableTimes).toContain('11:30'); // After 30-min Knipbeurt at 11:00

      // Unavailable times due to existing appointments
      expect(availableTimes).not.toContain('11:00'); // Knipbeurt appointment
      expect(availableTimes).not.toContain('11:15'); // Overlaps with Knipbeurt
      expect(availableTimes).not.toContain('11:45'); // Overlaps with Knipbeurt
      expect(availableTimes).not.toContain('12:00'); // Baardtrimmen appointment

      // Available after 12:20 due to Baardtrimmen duration
      expect(availableTimes).toContain('12:30');
    });

    it('should return 400 if the date is invalid', async () => {
      const response = await request
        .get(`/api/staff/${staffId}/availability`)
        .query({ date: 'invalid-date', serviceId: knipbeurtServiceId });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: {
          query: {
            date: 'Date must be a valid ISO 8601 date (e.g., 2025-03-15).',
          },
        },
      });
    });

    it('should return 400 if the store is closed on the requested date (Sunday)', async () => {
      const response = await request
        .get(`/api/staff/${staffId}/availability`)
        .query({ date: '2025-03-02', serviceId: knipbeurtServiceId }); // Sunday

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        error: 'The store is closed on Sundays.',
      });
    });

    it('should return 404 if the staff member does not exist', async () => {
      const response = await request
        .get('/api/staff/9999/availability')
        .query({ date: '2025-03-01', serviceId: knipbeurtServiceId });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: 'Staff member with ID 9999 not found.',
      });
    });

    it('should return 404 if the service does not exist', async () => {
      const response = await request
        .get(`/api/staff/${staffId}/availability`)
        .query({ date: '2025-03-01', serviceId: 9999 });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: 'Service with ID 9999 not found.',
      });
    });
  });
});
