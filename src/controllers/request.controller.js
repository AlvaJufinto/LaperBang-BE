/** @format */

import { supabase } from '../config/supabase.js';
import { createRequest } from '../services/request.service.js';

// ikuti vendor
export const createRequestController = async (req, res) => {
	try {
		const { vendor_id, lat, lng } = req.body;

		const user_id = req.user.id || req.user.user_id;

		if (!vendor_id || lat == null || lng == null) {
			return res.status(400).json({
				success: false,
				error: "Missing fields",
			});
		}

		// validate lat/lng numeric
		if (typeof lat !== "number" || typeof lng !== "number") {
			return res.status(400).json({
				success: false,
				error: "Invalid coordinates",
			});
		}

		// get vendor
		const { data: vendor, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", vendor_id)
			.single();

		if (error || !vendor) {
			return res.status(404).json({
				success: false,
				error: "Vendor not found",
			});
		}

		if (vendor.role !== "vendor") {
			return res.status(400).json({
				success: false,
				error: "Target is not a vendor",
			});
		}

		if (vendor.vendor_status !== "active") {
			return res.status(400).json({
				success: false,
				error: "Vendor unavailable",
			});
		}

		if (vendor_id === user_id) {
			return res.status(400).json({
				success: false,
				error: "Invalid operation",
			});
		}

		const result = await createRequest({
			user_id,
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
