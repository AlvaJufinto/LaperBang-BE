/** @format */

import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				success: false,
				error: "No authorization header",
			});
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				success: false,
				error: "No token provided",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded;

		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			error: "Invalid token",
		});
	}
};
