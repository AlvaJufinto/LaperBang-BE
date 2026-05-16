/** @format */

import { supabase } from "../config/supabase.js";

export const createRequest = async ({ user_id, vendor_id, lat, lng }) => {
	const { data, error } = await supabase
		.from("requests")
		.insert([
			{
				user_id,
				vendor_id,
				location: {
					type: "Point",
					coordinates: [lng, lat],
				},
				status: "active",
			},
		])
		.select();

	if (error) throw error;

	return data;
};
