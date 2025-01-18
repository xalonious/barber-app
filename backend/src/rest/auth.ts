import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import * as customerService from '../service/customer';
import { validateRequest } from '../core/validation';
import { registerSchema, loginSchema } from '../validation/auth';
import ServiceError from '../core/ServiceError';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Customer registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful. Please log in."
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already registered
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler(async (req, res) => {
    try {
      const { name, email, password } = req.body;
      await customerService.registerCustomer(name, email, password);
      res.status(201).json({ message: 'Registration successful. Please log in.' });
    } catch (error) {
      if (error instanceof ServiceError) {
        const statusMap: Record<string, number> = {
          CONFLICT: 409,
          VALIDATION_FAILED: 400,
          UNAUTHORIZED: 401,
        };
        res.status(statusMap[error.code] || 500).json({
          code: error.code,
          message: error.message,
        });
      } else {
        throw error;
      }
    }
  })
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a customer
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Customer login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 id:
 *                   type: integer
 *                   description: Customer ID
 *                 email:
 *                   type: string
 *                   description: Customer email
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const { token, id, email: userEmail, name } = await customerService.loginCustomer(email, password);

      res.status(200).json({ token, id, email: userEmail, name }); 
    } catch (error) {
      if (error instanceof ServiceError) {
        const statusMap: Record<string, number> = {
          CONFLICT: 409,
          VALIDATION_FAILED: 400,
          UNAUTHORIZED: 401,
        };
        res.status(statusMap[error.code] || 500).json({
          code: error.code,
          message: error.message,
        });
      } else {
        throw error;
      }
    }
  })
);


export default router;
