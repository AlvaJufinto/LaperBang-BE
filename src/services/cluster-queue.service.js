/** @format */

import { runVendorClustering } from "../services/cluster.service.js";

const pendingVendors = new Map();

const CLUSTER_DEBOUNCE_MS = 10000;

export const enqueueClusterJob = async (vendor_id) => {
	// already scheduled
	if (pendingVendors.has(vendor_id)) {
		return;
	}

	const timeout = setTimeout(async () => {
		try {
			await runVendorClustering(vendor_id);
		} catch (err) {
			console.error(err);
		} finally {
			pendingVendors.delete(vendor_id);
		}
	}, CLUSTER_DEBOUNCE_MS);

	pendingVendors.set(vendor_id, timeout);
};
