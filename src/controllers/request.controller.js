/** @format */

import { createRequest } from "../services/request.service.js";

export const createRequestController = async (req, res) => {
	try {
		const { vendor_id, lat, lng } = req.body;

		const user_id = req.user.user_id;

		if (!vendor_id || !lat || !lng) {
			return res.status(400).json({
				success: false,
				error: "Missing fields",
			});
		}

		const { data: vendor } = await supabase
			.from("users")
			.select("*")
			.eq("id", vendor_id)
			.single();

		if (vendor.vendor_status !== "active") {
			return res.status(400).json({
				success: false,
				error: "Vendor unavailable",
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
			data: result[0],
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
