// Reports routes — admin only.
// GET /revenue              — JSON revenue report (filterable)
// GET /revenue/pdf          — same data downloaded as a PDF
// GET /top-services         — top services in date range
// GET /customer-stats/:id   — total spend / visits / last visit (per customer)

import express from "express";
import {
  getRevenueReport,
  downloadRevenueReportPdf,
  getTopServicesReport,
  getCustomerStats,
} from "../controllers/report.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminAuthMiddleware);

// Note: /revenue/pdf must be declared BEFORE /revenue if we wanted /:id-style
// matching, but here both are static literals so order doesn't matter for
// correctness. We declare PDF first for readability.
router.get("/revenue/pdf", downloadRevenueReportPdf);
router.get("/revenue", getRevenueReport);
router.get("/top-services", getTopServicesReport);
router.get("/customer-stats/:id", getCustomerStats);

export default router;
