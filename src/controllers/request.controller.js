/** @format */

import { enqueueClusterJob } from "../services/cluster-queue.service.js";
import { createRequest } from "../services/request.service.js";

export const createRequestController = async (req, res) => {
	try {
		const { vendor_id, lat, lng } = req.body;

		const user_id = req.user.id || req.user.user_id;

		const request = await createRequest({
			user_id,
			vendor_id,
			lat,
			lng,
		});

		// trigger debounce clustering
		await enqueueClusterJob(vendor_id);

		return res.json({
			success: true,
			data: request,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
