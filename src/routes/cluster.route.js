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

import { runClusterController } from "../controllers/cluster.controller.js";

const router = express.Router();

router.post("/run", runClusterController);

export default router;
