import type { Request, Response } from 'express';
import { Router } from 'express';
import { version } from '../../package.json'; 

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API health check and version information
 */

/**
 * @swagger
 * /api/health/ping:
 *   get:
 *     summary: Check if the API is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pong:
 *                   type: boolean
 *                   example: true
 */
router.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ pong: true });
});

/**
 * @swagger
 * /api/health/version:
 *   get:
 *     summary: Get the API version and status
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API version and status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 status:
 *                   type: string
 *                   example: "up"
 */
router.get('/version', (req: Request, res: Response) => {
  res.status(200).json({
    version,
    status: 'up',
  });
});

export default router;
