/** @format */

import express from "express";

import { createRequestController } from "../controllers/request.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
	"/",
	authMiddleware,
	roleMiddleware("consumer"),
	createRequestController,
);

export default router;
