/** @format */

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { supabase } from "../config/supabase.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
	try {
		const { credential } = req.body;
		// credential = Google ID token dari frontend

		if (!credential) {
			return res.status(400).json({
				success: false,
				error: "Missing Google credential",
			});
		}

		// verify token dari Google
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		const { sub, email, name, picture } = payload;

		// cek / insert user
		let { data: user } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.single();

		if (!user) {
			const { data: newUser } = await supabase
				.from("users")
				.insert([
					{
						name,
						role: "consumer", // default role
						email,
					},
				])
				.select()
				.single();

			user = newUser;
		}

		// buat JWT
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
			data: {
				user,
				token,
			},
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
