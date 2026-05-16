/** @format */

/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Google login
 *     tags: [Auth]
 *     description: Login atau register user menggunakan Google ID Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID token dari frontend
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *       400:
 *         description: Bad request (missing credential / invalid token)
 *       500:
 *         description: Server error
 */

import express from "express";

import { googleLoginController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/google", googleLoginController);

export default router;
