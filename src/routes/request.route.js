/** @format */

/**
 * @swagger
 * /api/v1/requests:
 *   post:
 *     summary: Create request to vendor
 *     tags: [Requests]
 *     description: User membuat request ke vendor dengan lokasi realtime
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendor_id
 *               - lat
 *               - lng
 *             properties:
 *               vendor_id:
 *                 type: string
 *                 example: "uuid-vendor-id"
 *               lat:
 *                 type: number
 *                 example: -6.200000
 *               lng:
 *                 type: number
 *                 example: 106.816666
 *     responses:
 *       200:
 *         description: Request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or vendor unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Missing fields
 *       500:
 *         description: Server error
 */

import express from 'express';

import { createRequestController } from '../controllers/request.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post(
	"/",
	authMiddleware,
	roleMiddleware("consumer"),
	createRequestController,
);

export default router;
