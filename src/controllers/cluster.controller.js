/** @format */

import { runClustering } from '../services/cluster.service.js';

export const runClusterController = async (req, res) => {
	try {
		await runClustering();

		return res.json({
			success: true,
			message: "Clustering completed",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
