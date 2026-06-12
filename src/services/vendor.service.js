/** @format */

import { supabase } from "../config/supabase.js";

export const updateVendorLocation = async ({ vendor_id, lat, lng }) => {
	// cek apakah location vendor sudah ada
	const { data: existing } = await supabase
		.from("live_locations")
		.select("*")
		.eq("user_id", vendor_id)
		.single();

	// update
	if (existing) {
		const { data, error } = await supabase
			.from("live_locations")
			.update({
				location: {
					type: "Point",
					coordinates: [lng, lat],
				},
				updated_at: new Date(),
			})
			.eq("user_id", vendor_id)
			.select();

		if (error) throw error;

		return data;
	}

	// create
	const { data, error } = await supabase
		.from("live_locations")
		.insert([
			{
				user_id: vendor_id,
				location: {
					type: "Point",
					coordinates: [lng, lat],
				},
			},
		])
		.select();

	if (error) throw error;

	return data;
};

export const getNearbyVendors = async ({ lat, lng, radius = 2000 }) => {
	const { data, error } = await supabase.rpc("get_nearby_vendors", {
		user_lat: lat,
		user_lng: lng,
		radius_meters: radius,
	});

	if (error) throw error;

	return data;
};

export const updateVendorStatus = async ({ vendor_id, status }) => {
	const allowedStatuses = ["active", "moving", "idle", "close"];

	if (!allowedStatuses.includes(status)) {
		throw new Error("Invalid vendor status");
	}

	const { data, error } = await supabase
		.from("users")
		.update({
			vendor_status: status,
		})
		.eq("id", vendor_id)
		.select()
		.single();

	if (error) throw error;

	return data;
};
