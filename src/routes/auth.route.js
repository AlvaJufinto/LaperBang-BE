/** @format */

import express from "express";

import { googleLoginController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/google", googleLoginController);

export default router;
