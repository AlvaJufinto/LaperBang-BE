/** @format */

import { supabase } from "../config/supabase.js";
import { followVendorControllerService } from "../services/vendor-follow.service.js";
import {
	getNearbyVendors,
	updateVendorLocation,
	updateVendorStatus,
} from "../services/vendor.service.js";

export const updateVendorLocationController = async (req, res) => {
	try {
		const vendor_id = req.user.id || req.user.user_id;
		const { lat, lng } = req.body;

		if (typeof lat !== "number" || typeof lng !== "number") {
			return res.status(400).json({
				success: false,
				error: "Invalid coordinates",
			});
		}

		// range validation (IMPORTANT)
		if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
			return res.status(400).json({
				success: false,
				error: "Coordinates out of range",
			});
		}

		const result = await updateVendorLocation({
			vendor_id,
			lat,
			lng,
		});

		return res.json({
			success: true,
			data: result?.[0],
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
export const getNearbyVendorsController = async (req, res) => {
	try {
		const { lat, lng, radius } = req.query;

		if (!lat || !lng) {
			return res.status(400).json({
				success: false,
				error: "Missing coordinates",
			});
		}

		const latNum = Number(lat);
		const lngNum = Number(lng);

		if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
			return res.status(400).json({
				success: false,
				error: "Invalid coordinates",
			});
		}

		const { data, error } = await supabase
			.from("live_locations")
			.select("*")
			.limit(1);

		const vendors = await getNearbyVendors({
			lat: latNum,
			lng: lngNum,
			radius: Number(radius) || 5000,
		});

		const activeVendors = vendors.filter(
			(v) =>
				v.user.role === "vendor" &&
				(v.user.vendor_status !== "close" || v.user.vendor_status !== "moving"),
		);

		return res.json({
			success: true,
			data: activeVendors,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};

export const updateVendorStatusController = async (req, res) => {
	try {
		if (req.user.role !== "vendor") {
			return res.status(403).json({
				success: false,
				error: "Only vendors allowed",
			});
		}

		const vendor_id = req.user.id || req.user.user_id;
		const { status } = req.body;

		const allowedStatus = ["active", "moving", "idle", "close"];

		if (!allowedStatus.includes(status)) {
			return res.status(400).json({
				success: false,
				error: "Invalid status",
			});
		}

		const result = await updateVendorStatus({
			vendor_id,
			status,
		});

		return res.json({
			success: true,
			data: result?.[0],
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};

export const getVendorDetailController = async (req, res) => {
	try {
		const { vendor_id } = req.params;

		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", vendor_id)
			.single();

		if (error) throw error;

		return res.json({
			success: true,
			data,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};

export const followVendorController = async (req, res) => {
	try {
		if (req.user.role !== "customer") {
			return res.status(403).json({
				success: false,
				error: "Only customer allowed",
			});
		}

		const customer_id = req.user.id || req.user.user_id;
		const { vendor_id } = req.params;

		const result = await followVendorControllerService({
			customer_id,
			vendor_id,
		});

		return res.json({
			success: true,
			data: result,
		});
	} catch (err) {
		return res.status(400).json({
			success: false,
			error: err.message,
		});
	}
};

export const updateVendorLocationController = async (req, res) => {
	try {
		if (req.user.role !== "vendor") {
			return res.status(403).json({
				success: false,
				error: "Only vendor allowed",
			});
		}

		const vendor_id = req.user.id;
		const { lat, lng } = req.body;

		await supabase.from("users").update({ lat, lng }).eq("id", vendor_id);

		pusher.trigger(`vendor.${vendor_id}`, "location.updated", {
			vendor_id,
			lat,
			lng,
		});

		return res.json({ success: true });
	} catch (err) {
		return res.status(400).json({
			success: false,
			error: err.message,
		});
	}
};
