/** @format */

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { supabase } from "../config/supabase.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
	try {
		const { credential } = req.body;

		if (!credential) {
			return res.status(400).json({
				success: false,
				error: "Missing Google credential",
			});
		}

		if (!process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID) {
			return res.status(500).json({
				success: false,
				error: "Server misconfigured",
			});
		}

		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload?.email) {
			return res.status(400).json({
				success: false,
				error: "Invalid Google token",
			});
		}

		const { email, name } = payload;

		let { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.maybeSingle();

		if (error) throw error;

		if (!user) {
			const { data: newUser, error: insertError } = await supabase
				.from("users")
				.upsert(
					{
						email,
						name,
						role: "consumer",
					},
					{ onConflict: "email" },
				)
				.select()
				.single();

			if (insertError) throw insertError;

			user = newUser;
		}

		const token = jwt.sign(
			{
				user_id: user.id,
				email: user.email,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		);

		return res.json({
			success: true,
			data: { user, token },
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
