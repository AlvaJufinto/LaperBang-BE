/** @format */

import jwt from 'jsonwebtoken';

import { supabase } from '../config/supabase.js';

export const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				error: "Missing or invalid authorization header",
			});
		}

		const token = authHeader.split(" ")[1];

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({
				success: false,
				error: "Token expired or invalid",
			});
		}

		// ambil user fresh dari DB (penting)
		const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", decoded.user_id)
			.single();

		if (error || !user) {
			return res.status(401).json({
				success: false,
				error: "User not found",
			});
		}

		req.user = {
			id: user.id,
			email: user.email,
			role: user.role,
			vendor_status: user.vendor_status,
		};

		next();
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: "Auth middleware error",
		});
	}
};
