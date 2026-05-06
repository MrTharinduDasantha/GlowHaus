// Admin dashboard route.
// GET /api/admin/dashboard — summary cards + chart data

import express from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminAuthMiddleware); // every endpoint here is admin

router.get("/dashboard", getDashboardStats);

export default router;
