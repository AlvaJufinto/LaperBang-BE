/** @format */

import express from "express";

import { runClusterController } from "../controllers/cluster.controller.js";

const router = express.Router();

router.post("/run", runClusterController);

export default router;
