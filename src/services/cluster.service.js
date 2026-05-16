/** @format */

import clustering from "density-clustering";

import { supabase } from "../config/supabase.js";

const DBSCAN = clustering.DBSCAN;

export const runClustering = async () => {
	// ambil semua request aktif
	const { data: requests, error } = await supabase
		.from("requests")
		.select("*")
		.eq("status", "active")
		.eq("clustered", false);

	if (error) throw error;

	// group by vendor
	const grouped = {};

	for (const req of requests) {
		if (!grouped[req.vendor_id]) {
			grouped[req.vendor_id] = [];
		}

		grouped[req.vendor_id].push(req);
	}

	// clustering per vendor
	for (const vendor_id in grouped) {
		const vendorRequests = grouped[vendor_id];

		// convert jadi coordinate array
		const dataset = vendorRequests.map((r) => {
			const coordinates = r.location.coordinates;

			return [
				coordinates[1], // lat
				coordinates[0], // lng
			];
		});

		const dbscan = new DBSCAN();

		// eps = radius
		// minPts = minimal request
		const clusters = dbscan.run(dataset, 0.003, 2);

		console.log({
			vendor_id,
			total_requests: vendorRequests.length,
			clusters_found: clusters.length,
		});

		// save cluster
		for (const clusterIndexes of clusters) {
			const clusterRequests = clusterIndexes.map(
				(index) => vendorRequests[index],
			);

			// centroid sederhana
			const avgLat =
				clusterRequests.reduce((sum, r) => sum + r.location.coordinates[1], 0) /
				clusterRequests.length;

			const avgLng =
				clusterRequests.reduce((sum, r) => sum + r.location.coordinates[0], 0) /
				clusterRequests.length;

			// create cluster
			const { data: clusterData } = await supabase
				.from("clusters")
				.insert([
					{
						vendor_id,
						centroid: {
							type: "Point",
							coordinates: [avgLng, avgLat],
						},
						total_requests: clusterRequests.length,
						status: "active",
					},
				])
				.select()
				.single();

			// mapping requests
			const mappings = clusterRequests.map((r) => ({
				cluster_id: clusterData.id,
				request_id: r.id,
			}));

			await supabase.from("cluster_requests").insert(mappings);

			// assignment
			await supabase.from("cluster_assignments").insert([
				{
					cluster_id: clusterData.id,
					vendor_id,
					status: "assigned",
				},
			]);

			await supabase
				.from("requests")
				.update({
					clustered: true,
				})
				.in(
					"id",
					clusterRequests.map((r) => r.id),
				);
		}
	}
};
