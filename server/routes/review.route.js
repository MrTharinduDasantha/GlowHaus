// Review routes.
// Public:    GET /service/:serviceId       — approved reviews of a service
// Customer:  POST /, GET /my
// Admin:     GET /, PUT /:id/moderate, DELETE /:id

import express from "express";
import {
  createReview,
  getMyReviews,
  listServiceReviews,
  listAllReviews,
  moderateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

/* ───── Public ───── */
router.get("/service/:serviceId", listServiceReviews);

/* ───── Customer ───── */
router.post("/", authMiddleware, createReview);
router.get("/my", authMiddleware, getMyReviews);

/* ───── Admin ───── */
router.get("/", authMiddleware, adminAuthMiddleware, listAllReviews);
router.put(
  "/:id/moderate",
  authMiddleware,
  adminAuthMiddleware,
  moderateReview,
);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteReview);

export default router;
