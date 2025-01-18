import request from 'supertest';
import { prisma } from '../../src/data';
import { createTestCustomerAndToken } from '../helpers/auth';
import { setupTestServer } from '../helpers/setupTestServer';
import { createTestStaff } from '../helpers/staff';
import { expectValidResponse } from '../helpers/assertions';

describe('Appointments API', () => {
  let app: any;
  let token: string;
  let customerId: number;
  let staffId: number;
  let otherToken: string;

  beforeAll(async () => {
    app = await setupTestServer();

    const staff = await createTestStaff();
    staffId = staff.staffId;

    const { testCustomer, token: generatedToken } = await createTestCustomerAndToken();
    token = generatedToken;
    customerId = testCustomer.customerId;

    // Create another customer and token for testing
    const { token: otherGeneratedToken } = await createTestCustomerAndToken();
    otherToken = otherGeneratedToken;

    await prisma.service.createMany({
      data: [
        { name: 'Knipbeurt', price: 20, duration: 30 }, // 30 minutes
        { name: 'Baardtrimmen', price: 15, duration: 20 }, // 20 minutes
      ],
      skipDuplicates: true,
    });
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.service.deleteMany();
  });

  describe('POST /api/appointments', () => {
    it('should create an appointment and return 201', async () => {
      const newAppointment = {
        customerId,
        service: 'Knipbeurt',
        date: '2025-03-01T10:00:00.000Z',
        staffId,
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(newAppointment);

      expectValidResponse(response, 201);
      expect(response.body).toHaveProperty('appointmentId');
      expect(response.body.service).toBe(newAppointment.service);
    });

    it('should return 400 if appointment is not on a 15-minute interval', async () => {
      const invalidDate = '2025-03-01T10:07:00.000Z';

      const newAppointment = {
        customerId,
        service: 'Knipbeurt',
        date: invalidDate,
        staffId,
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(newAppointment);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'VALIDATION_FAILED',
        details: {
          body: { date: 'Appointments must be scheduled in 15-minute intervals.' },
        },
      });
    });

    it('should return 409 if staff member is not available', async () => {
      const conflictingDate = '2025-03-01T10:00:00Z';

      await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: conflictingDate,
        },
      });

      const newAppointment = {
        customerId,
        service: 'Knipbeurt',
        date: conflictingDate,
        staffId,
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(newAppointment);

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: 'This staff member is not available during the selected time.',
      });
    });

    it('should return 401 if not authenticated', async () => {
      const newAppointment = {
        customerId,
        service: 'Knipbeurt',
        date: '2025-03-01T10:00:00.000Z',
        staffId,
      };

      const response = await request(app).post('/api/appointments').send(newAppointment);

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/appointments/:appointmentid', () => {
    it('should update the appointment and return 200', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T09:30:00.000Z',
        },
      });

      const updatedData = { service: 'Baardtrimmen' };

      const response = await request(app)
        .patch(`/api/appointments/${appointment.appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expectValidResponse(response, 200);
      expect(response.body).toMatchObject({
        appointmentId: appointment.appointmentId,
        service: 'Baardtrimmen',
      });
    });

    it('should return 409 if updated date conflicts with another appointment', async () => {
      const conflictingDate = '2025-03-01T10:00:00.000Z';

      await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: conflictingDate,
        },
      });

      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T09:00:00.000Z',
        },
      });

      const updatedData = { date: conflictingDate };

      const response = await request(app)
        .patch(`/api/appointments/${appointment.appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: 'This staff member is not available during the selected time.',
      });
    });

    it('should return 400 if updated date is not on a 15-minute interval', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T10:15:00.000Z',
        },
      });

      const invalidUpdate = { date: '2025-03-01T10:07:00.000Z' };

      const response = await request(app)
        .patch(`/api/appointments/${appointment.appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'VALIDATION_FAILED',
        details: { body: { date: 'Appointments must be scheduled in 15-minute intervals.' } },
      });
    });

    it('should return 401 if not authenticated', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T10:30:00.000Z',
        },
      });

      const updatedData = { service: 'Baardtrimmen' };

      const response = await request(app)
        .patch(`/api/appointments/${appointment.appointmentId}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/appointments/:appointmentid', () => {
    it('should delete the appointment and return 204', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T10:00:00.000Z',
        },
      });

      const response = await request(app)
        .delete(`/api/appointments/${appointment.appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expectValidResponse(response, 204);
    });

    it('should return 401 if not authenticated', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T10:00:00.000Z',
        },
      });

      const response = await request(app).delete(`/api/appointments/${appointment.appointmentId}`);

      expect(response.status).toBe(401);
    });

    it('should return 403 if a user tries to delete an appointment that does not belong to them', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { customerId } },
          staff: { connect: { staffId } },
          service: { connect: { name: 'Knipbeurt' } },
          date: '2025-03-01T11:00:00.000Z',
        },
      });

      const response = await request(app)
        .delete(`/api/appointments/${appointment.appointmentId}`)
        .set('Authorization', `Bearer ${otherToken}`); 

      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        error: 'You do not have permission to delete this appointment.',
      });
    });
  });
});
