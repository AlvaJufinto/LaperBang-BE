/** @format */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { supabase } from '../config/supabase.js';

export const registerController = async (req, res) => {
	try {
		const { email, password, role } = req.body;

		if (!email || !password || !role) {
			return res.status(400).json({
				success: false,
				error: "Missing fields",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const { data: user, error } = await supabase
			.from("users")
			.insert({
				email,
				password: hashedPassword,
				role,
				vendor_status: role === "vendor" ? "idle" : null,
				additional_info: {},
			})
			.select()
			.single();

		if (error) throw error;

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

export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.single();

		if (error || !user) {
			return res.status(401).json({
				success: false,
				error: "Invalid credentials",
			});
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return res.status(401).json({
				success: false,
				error: "Invalid credentials",
			});
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

export const updateProfileController = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const { name, additional_info, vendor_status } = req.body;

		const { data, error } = await supabase
			.from("users")
			.update({
				name,
				additional_info,
				vendor_status,
			})
			.eq("id", userId)
			.select()
			.single();

		if (error) throw error;

		return res.json({
			success: true,
			data,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};

export const meController = async (req, res) => {
	try {
		const userId = req.user.user_id;

		const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", userId)
			.single();

		if (error || !user) {
			return res.status(404).json({
				success: false,
				error: "User not found",
			});
		}

		return res.json({
			success: true,
			data: user,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};
