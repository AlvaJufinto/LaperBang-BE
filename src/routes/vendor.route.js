/** @format */

import express from "express";

import { updateVendorLocationController } from "../controllers/vendor.controller.js";
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
