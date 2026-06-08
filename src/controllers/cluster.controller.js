/** @format */

import {
	acceptCluster,
	rejectCluster,
	runClustering,
} from "../services/cluster.service.js";

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

export const acceptClusterController = async (req, res) => {
	try {
		const { cluster_id } = req.params;

		const vendor_id = req.user.id;

		const result = await acceptCluster({
			cluster_id,
			vendor_id,
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

export const rejectClusterController = async (req, res) => {
	try {
		const { cluster_id } = req.params;

		const vendor_id = req.user.id;

		const result = await rejectCluster({
			cluster_id,
			vendor_id,
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
