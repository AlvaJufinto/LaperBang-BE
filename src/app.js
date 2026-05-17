/** @format */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.route.js';
import clusterRoutes from './routes/cluster.route.js';
import requestRoutes from './routes/request.route.js';
import vendorRoutes from './routes/vendor.route.js';
import swaggerSpec from './swagger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Server is running",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/clusters", clusterRoutes);
app.use(
	"/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		swaggerOptions: {
			url: "/swagger.json",
		},
	}),
);

export default app;
