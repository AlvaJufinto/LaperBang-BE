/** @format */

export const roleMiddleware = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				error: "Unauthorized",
			});
		}

		const userRole = req.user.role;

		if (!userRole) {
			return res.status(403).json({
				success: false,
				error: "Role not found",
			});
		}

		if (!allowedRoles.includes(userRole)) {
			return res.status(403).json({
				success: false,
				error: "Forbidden",
			});
		}

		next();
	};
};
