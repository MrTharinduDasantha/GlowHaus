// Service routes.
// Public:    GET /, GET /featured, GET /:id
// Admin:     POST /, PUT /:id, DELETE /:id, PUT /:id/stylists,
//            PUT /:id/toggle-status, PUT /:id/toggle-featured

import express from "express";
import {
  listServices,
  getFeaturedServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  assignStylists,
  toggleServiceStatus,
  toggleFeatured,
} from "../controllers/service.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { uploadMultiple } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ───── Public ───── */
// Note: /featured must be declared BEFORE /:id, otherwise Express
// would treat the literal string "featured" as an :id parameter.
router.get("/featured", getFeaturedServices);
router.get("/", listServices);
router.get("/:id", getServiceById);

/* ───── Admin ───── */
// Up to 8 service images per request (cover + gallery + before/after)
router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadMultiple("images", 8),
  createService,
);
router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadMultiple("images", 8),
  updateService,
);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteService);
router.put(
  "/:id/stylists",
  authMiddleware,
  adminAuthMiddleware,
  assignStylists,
);
router.put(
  "/:id/toggle-status",
  authMiddleware,
  adminAuthMiddleware,
  toggleServiceStatus,
);
router.put(
  "/:id/toggle-featured",
  authMiddleware,
  adminAuthMiddleware,
  toggleFeatured,
);

export default router;
