/** @format */

/**
 * @swagger
 * /api/v1/clusters/run:
 *   post:
 *     summary: Run clustering process
 *     tags: [Clusters]
 *     description: Menjalankan proses clustering demand dan membentuk hotspot
 *     responses:
 *       200:
 *         description: Clustering completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Clustering completed
 *       500:
 *         description: Server error
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
 */

import express from "express";

import {
	acceptClusterController,
	rejectClusterController,
	runClusterController,
} from "../controllers/cluster.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/run", runClusterController);

router.post(
	"/:cluster_id/accept",
	authMiddleware,
	roleMiddleware("vendor"),
	acceptClusterController,
);

router.post("/:cluster_id/reject", authMiddleware, rejectClusterController);

export default router;
