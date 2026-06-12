/** @format */

import { supabase } from "../config/supabase.js";

export const followVendorService = async ({ customer_id, vendor_id }) => {
	const { data: vendor, error: vendorError } = await supabase
		.from("users")
		.select("role, vendor_status")
		.eq("id", vendor_id)
		.single();

	if (vendorError) throw vendorError;

	if (vendor.role !== "vendor") {
		throw new Error("Target is not vendor");
	}

	const allowedStatus = ["active", "moving", "idle"];

	if (!allowedStatus.includes(vendor.vendor_status)) {
		throw new Error("Vendor is not available for follow");
	}

	const { data, error } = await supabase
		.from("vendor_follows")
		.insert({
			customer_id,
			vendor_id,
		})
		.select()
		.single();

	if (error) throw error;

	return data;
};
