// Payment routes.
// Customer:  GET /my
// Admin:     GET /, GET /:id

import express from "express";
import {
  getMyPayments,
  listAllPayments,
  getPaymentById,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/my", getMyPayments);
router.get("/", adminAuthMiddleware, listAllPayments);
router.get("/:id", adminAuthMiddleware, getPaymentById);

export default router;
