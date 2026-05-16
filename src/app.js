/** @format */

import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.route.js";
import clusterRoutes from "./routes/cluster.routes.js";
import requestRoutes from "./routes/request.route.js";
import vendorRoutes from "./routes/vendor.routes.js";

const app = express();

app.use(cors("*"));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/clusters", clusterRoutes);

export default app;
