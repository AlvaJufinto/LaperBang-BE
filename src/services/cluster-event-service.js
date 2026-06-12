/** @format */

import { pusher } from "../config/pusher.js";

export const emitClusterUpdated = async ({ cluster }) => {
	await pusher.trigger(
		`vendor-${cluster.vendor_id}`,

		"cluster.updated",

		{
			type: "cluster.updated",

			timestamp: Date.now(),

			data: cluster,
		},
	);
};
