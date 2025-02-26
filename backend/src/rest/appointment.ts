import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import * as appointmentService from '../service/appointment';
import { getLogger } from '../core/logging';
import { validateRequest } from '../core/validation';
import { createAppointmentSchema, updateAppointmentSchema, appointmentIdParamSchema } from '../validation/appointment';
import { requireAuthentication } from '../core/auth';
import ServiceError from '../core/ServiceError';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Manage customer appointments
 */

/**
 * @swagger
 * /api/appointments/{customerid}:
 *   get:
 *     summary: Get appointments for a specific customer
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: List of appointments for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   appointmentId:
 *                     type: integer
 *                   customerId:
 *                     type: integer
 *                   service:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   staffId:
 *                     type: integer
 *       403:
 *         description: Forbidden if trying to access appointments of another customer
 *       401:
 *         description: Unauthorized if not authenticated
 */
router.get(
  '/:customerid',
  requireAuthentication,
  asyncHandler(async (req, res) => {
    const customerId = parseInt(req.params.customerid);
    const authenticatedCustomerId = req.body.customerId; // customerId injected by the middleware

    try {
      const appointments = await appointmentService.getAppointmentsByCustomerId(customerId, authenticatedCustomerId);
      res.json(appointments);
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.isForbidden) {
          return res.status(403).json({ error: error.message });
        }
        if (error.isInternalServerError) {
          return res.status(500).json({ error: error.message });
        }
      }
      getLogger().error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
  })
);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Appointment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               service:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               staffId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointmentId:
 *                   type: integer
 *                 customerId:
 *                   type: integer
 *                 service:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 staffId:
 *                   type: integer
 *       400:
 *         description: Validation error (e.g., invalid data or time outside store hours)
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Appointment conflicts with an existing appointment
 */
router.post(
  '/',
  requireAuthentication,
  validateRequest(createAppointmentSchema),
  asyncHandler(async (req, res) => {
    try {
      const newAppointment = await appointmentService.createAppointment(req.body);
      res.status(201).json(newAppointment);
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.isConflict) {
          return res.status(409).json({ error: error.message });
        }
        if (error.isValidationFailed) {
          return res.status(400).json({
            error: 'VALIDATION_FAILED',
            details: { body: { date: error.message } },
          });
        }
        if (error.isForbidden) {
          return res.status(403).json({ error: error.message });
        }

        if(error.isUnprocessableEntity) {
          return res.status(422).json({ error: error.message });
        }
      }
      getLogger().error('Error creating appointment:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  })
);

/**
 * @swagger
 * /api/appointments/{appointmentid}:
 *   patch:
 *     summary: Update an appointment by ID
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the appointment to update
 *     requestBody:
 *       description: Updated appointment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               staffId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointmentId:
 *                   type: integer
 *                 customerId:
 *                   type: integer
 *                 service:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 staffId:
 *                   type: integer
 *       400:
 *         description: Validation error (e.g., invalid data or time outside store hours)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       409:
 *         description: Appointment conflicts with an existing appointment
 */
router.patch(
  '/:appointmentid',
  requireAuthentication,
  validateRequest(updateAppointmentSchema),
  asyncHandler(async (req, res) => {
    const appointmentId = parseInt(req.params.appointmentid);
    const customerId = req.body.customerId;

    try {
      const updatedAppointment = await appointmentService.updateAppointmentById(appointmentId, {
        ...req.body,
        customerId,
      });
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.isConflict) {
          return res.status(409).json({ error: error.message });
        }
        if (error.isNotFound) {
          return res.status(404).json({ error: error.message });
        }
        if (error.isForbidden) {
          return res.status(403).json({ error: error.message });
        }
        if (error.isValidationFailed) {
          return res.status(400).json({
            error: 'VALIDATION_FAILED',
            details: { body: { date: error.message } },
          });
        }
        if(error.isUnprocessableEntity) {
          return res.status(422).json({ error: error.message });
        }
      }
      getLogger().error('Error updating appointment:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  })
);

/**
 * @swagger
 * /api/appointments/{appointmentid}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the appointment to delete
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Forbidden, user not authorized to delete this appointment
 */
router.delete(
  '/:appointmentid',
  requireAuthentication,
  validateRequest(appointmentIdParamSchema),
  asyncHandler(async (req, res) => {
    const appointmentId = parseInt(req.params.appointmentid);
    const customerId = req.body.customerId;

    try {
      await appointmentService.deleteAppointmentById(appointmentId, customerId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          return res.status(404).json({ error: error.message });
        }
        if (error.isForbidden) {
          return res.status(403).json({ error: error.message });
        }
      }
      getLogger().error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Failed to delete appointment' });
    }
  })
);

export default router;
