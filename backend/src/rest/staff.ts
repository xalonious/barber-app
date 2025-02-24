import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import * as staffService from '../service/staff';
import { getLogger } from '../core/logging';
import ServiceError from '../core/ServiceError';
import { validateRequest } from '../core/validation';
import { staffAvailabilitySchema } from '../validation/staff';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Manage staff members
 */

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all staff members
 *     tags:
 *       - Staff
 *     responses:
 *       200:
 *         description: List of all staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   staffId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   headshot:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const staff = await staffService.getAllStaff();
    res.json(staff);
  })
);

/**
 * @swagger
 * /api/staff/{staffId}/availability:
 *   get:
 *     summary: Get available times for a staff member on a specific date
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the staff member
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-03-15"
 *         description: Date to check availability
 *       - in: query
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the service
 *     responses:
 *       200:
 *         description: List of available time slots for the staff member
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: date-time
 *       400:
 *         description: Validation error (e.g., invalid date or missing serviceId)
 *       404:
 *         description: Staff member or service not found
 */
router.get(
  '/:staffId/availability',
  validateRequest(staffAvailabilitySchema), // Joi validation for staffId, date, and serviceId
  asyncHandler(async (req, res) => {
    const { staffId } = req.params;
    const { date, serviceId } = req.query;

    try {
      const availability = await staffService.getStaffAvailability(
        parseInt(staffId, 10),
        date as string,
        parseInt(serviceId as string, 10)
      );
      res.json(availability);
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          return res.status(404).json({ error: error.message });
        }
        if (error.isValidationFailed) {
          return res.status(400).json({ error: error.message });
        }

        if (error.isUnprocessableEntity) {
          return res.status(422).json({ error: error.message });
        }
      }

      getLogger().error('Error retrieving staff availability:', error);
      res.status(500).json({ error: 'Error retrieving staff availability' });
    }
  })
);

export default router;
