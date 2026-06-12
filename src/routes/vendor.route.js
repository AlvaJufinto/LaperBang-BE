/** @format */
import express from "express";

import {
	followVendor,
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

router.get("/:vendor_id//detail", authMiddleware);

router.post("/vendors/:vendor_id/follow", authMiddleware, followVendor);

export default router;
