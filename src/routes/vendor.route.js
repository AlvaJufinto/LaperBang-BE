/** @format */

/**
 * @swagger
 * /api/v1/vendors/location:
 *   patch:
 *     summary: Update vendor live location
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *             properties:
 *               lat:
 *                 type: number
 *                 example: -6.200000
 *               lng:
 *                 type: number
 *                 example: 106.816666
 *     responses:
 *       200:
 *         description: Location updated
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/vendors/nearby:
 *   get:
 *     summary: Get nearby vendors
 *     tags: [Vendors]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         example: -6.2
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         example: 106.8
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *         example: 5000
 *     responses:
 *       200:
 *         description: List of nearby vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/vendors/status:
 *   patch:
 *     summary: Update vendor status
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Missing status
 *       500:
 *         description: Server error
 */

import express from "express";

import {
	getNearbyVendorsController,
	updateVendorLocationController,
	updateVendorStatusController,
} from "../controllers/vendor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.patch(
	"/location",
	authMiddleware,
	roleMiddleware("vendor"),
	updateVendorLocationController,
);

router.get("/nearby", authMiddleware, getNearbyVendorsController);

router.patch(
	"/status",
	authMiddleware,
	roleMiddleware("vendor"),
	updateVendorStatusController,
);
export default router;
