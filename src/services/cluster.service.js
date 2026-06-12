/** @format */

import clustering from "density-clustering";

import { supabase } from "../config/supabase.js";
import { pusher } from "../lib/pusher.js";
import { emitClusterUpdated } from "../services/cluster-event-service.js";

const DBSCAN = clustering.DBSCAN;

const CLUSTER_WINDOW_MINUTES = 15;

// ~300m-ish
const DBSCAN_EPS = 0.003;

// minimal titik
const DBSCAN_MIN_POINTS = 2;

export const runClustering = async (vendor_id) => {
	console.log(`[CLUSTERING] Running for vendor ${vendor_id}`);

	// recent window
	const since = new Date(
		Date.now() - CLUSTER_WINDOW_MINUTES * 60 * 1000,
	).toISOString();

	// ambil request recent aktif
	const { data: requests, error } = await supabase
		.from("requests")
		.select("*")
		.eq("vendor_id", vendor_id)
		.eq("status", "active")
		.gte("created_at", since);

	if (error) {
		throw error;
	}

	// no requests
	if (!requests?.length) {
		console.log("[CLUSTERING] No active requests");

		return;
	}

	// dataset dbscan
	const dataset = requests.map((r) => [
		r.location.coordinates[1],
		r.location.coordinates[0],
	]);

	const dbscan = new DBSCAN();

	const clusterIndexes = dbscan.run(dataset, DBSCAN_EPS, DBSCAN_MIN_POINTS);

	console.log({
		total_requests: requests.length,
		clusters_found: clusterIndexes.length,
	});

	// expire previous active clusters
	await expirePreviousClusters(vendor_id);

	// create new clusters
	for (const indexes of clusterIndexes) {
		const clusterRequests = indexes.map((index) => requests[index]);

		const centroid = calculateCentroid(clusterRequests);

		const cluster = await createCluster({
			vendor_id,
			centroid,
			total_requests: clusterRequests.length,
		});

		// mapping
		await attachRequestsToCluster(cluster.id, clusterRequests);

		// assignment
		await createClusterAssignment(cluster.id);

		// realtime emit
		await emitClusterUpdated({
			cluster,
		});

		console.log({
			cluster_id: cluster.id,
			total_requests: cluster.total_requests,
		});
	}
};

const expirePreviousClusters = async (vendor_id) => {
	const { error } = await supabase
		.from("clusters")
		.update({
			status: "expired",
			expired_at: new Date().toISOString(),
		})
		.eq("vendor_id", vendor_id)
		.in("status", ["forming", "active"]);

	if (error) {
		throw error;
	}
};
const calculateCentroid = (requests) => {
	const avgLat =
		requests.reduce((sum, r) => sum + r.location.coordinates[1], 0) /
		requests.length;

	const avgLng =
		requests.reduce((sum, r) => sum + r.location.coordinates[0], 0) /
		requests.length;

	return {
		type: "Point",
		coordinates: [avgLng, avgLat],
	};
};

const createCluster = async ({ vendor_id, centroid, total_requests }) => {
	const { data, error } = await supabase
		.from("clusters")
		.insert([
			{
				vendor_id,

				centroid,

				total_requests,

				status: "active",
			},
		])
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
};

const attachRequestsToCluster = async (cluster_id, requests) => {
	const mappings = requests.map((r) => ({
		cluster_id,
		request_id: r.id,
	}));

	const { error } = await supabase.from("cluster_requests").insert(mappings);

	if (error) {
		throw error;
	}
};

const createClusterAssignment = async (cluster_id) => {
	const { error } = await supabase.from("cluster_assignments").insert([
		{
			cluster_id,

			status: "assigned",
		},
	]);

	if (error) {
		throw error;
	}
};

export const acceptCluster = async ({ cluster_id, vendor_id }) => {
	// get cluster
	const { data: cluster, error } = await supabase
		.from("clusters")
		.select("*")
		.eq("id", cluster_id)
		.single();

	if (error || !cluster) {
		throw new Error("Cluster not found");
	}

	// validate ownership
	if (cluster.vendor_id !== vendor_id) {
		throw new Error("Unauthorized");
	}

	// get assignment
	const { data: assignment, error: assignmentError } = await supabase
		.from("cluster_assignments")
		.select("*")
		.eq("cluster_id", cluster_id)
		.eq("status", "assigned")
		.single();

	if (assignmentError || !assignment) {
		throw new Error("No pending assignment");
	}

	// update assignment
	const { data: updatedAssignment, error: updateError } = await supabase
		.from("cluster_assignments")
		.update({
			status: "accepted",

			responded_at: new Date().toISOString(),
		})
		.eq("id", assignment.id)
		.select()
		.single();

	if (updateError) {
		throw updateError;
	}

	// update cluster
	await supabase
		.from("clusters")
		.update({
			status: "active",

			updated_at: new Date().toISOString(),
		})
		.eq("id", cluster_id);

	// realtime emit
	await pusher.trigger(
		`vendor-${vendor_id}`,

		"assignment.accepted",

		{
			type: "assignment.accepted",

			timestamp: Date.now(),

			data: {
				cluster_id,

				assignment_id: updatedAssignment.id,

				status: "accepted",
			},
		},
	);

	return updatedAssignment;
};

export const rejectCluster = async ({ cluster_id, vendor_id }) => {
	// get cluster
	const { data: cluster, error } = await supabase
		.from("clusters")
		.select("*")
		.eq("id", cluster_id)
		.single();

	if (error || !cluster) {
		throw new Error("Cluster not found");
	}

	// validate ownership
	if (cluster.vendor_id !== vendor_id) {
		throw new Error("Unauthorized");
	}

	// get pending assignment
	const { data: assignment, error: assignmentError } = await supabase
		.from("cluster_assignments")
		.select("*")
		.eq("cluster_id", cluster_id)
		.eq("status", "assigned")
		.single();

	if (assignmentError || !assignment) {
		throw new Error("No pending assignment");
	}

	// reject assignment
	const { data: updatedAssignment, error: updateError } = await supabase
		.from("cluster_assignments")
		.update({
			status: "rejected",

			responded_at: new Date().toISOString(),
		})
		.eq("id", assignment.id)
		.select()
		.single();

	if (updateError) {
		throw updateError;
	}

	// optional:
	// expire cluster immediately
	await supabase
		.from("clusters")
		.update({
			status: "expired",

			expired_at: new Date().toISOString(),
		})
		.eq("id", cluster_id);

	// realtime emit
	await pusher.trigger(
		`vendor-${vendor_id}`,

		"assignment.rejected",

		{
			type: "assignment.rejected",

			timestamp: Date.now(),

			data: {
				cluster_id,

				assignment_id: updatedAssignment.id,

				status: "rejected",
			},
		},
	);

	return updatedAssignment;
};
