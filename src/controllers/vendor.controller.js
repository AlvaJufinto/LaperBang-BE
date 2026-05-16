/** @format */

import {
	getNearbyVendors,
	updateVendorLocation,
	updateVendorStatus,
} from "../services/vendor.service.js";

export const updateVendorLocationController = async (req, res) => {
	try {
		const vendor_id = req.user.user_id;

		const { lat, lng } = req.body;

		if (typeof lat !== "number" || typeof lng !== "number") {
			return res.status(400).json({
				success: false,
				error: "Invalid coordinates",
			});
		}

		const result = await updateVendorLocation({
			vendor_id,
			lat,
			lng,
		});

		return res.json({
			success: true,
			data: result[0],
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
		const vendors = await getNearbyVendors({
			lat: latNum,
			lng: lngNum,
			radius: Number(radius) || 5000,
		});

		return res.json({
			success: true,
			data: vendors,
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
		const vendor_id = req.user.user_id;

		const { status } = req.body;

		if (!status) {
			return res.status(400).json({
				success: false,
				error: "Status is required",
			});
		}

		const result = await updateVendorStatus({
			vendor_id,
			status,
		});

		return res.json({
			success: true,
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
