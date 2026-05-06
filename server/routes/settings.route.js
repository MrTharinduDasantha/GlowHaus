// Settings routes.
// Public:    GET /                       — used by navbar/footer
// Admin:     PUT /general, PUT /logo, PUT /business-hours,
//            PUT /booking-rules, PUT /notifications

import express from "express";
import {
  getSettings,
  updateGeneralSettings,
  updateLogo,
  updateBusinessHours,
  updateBookingRules,
  updateNotificationSettings,
} from "../controllers/settings.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ───── Public ───── */
router.get("/", getSettings);

/* ───── Admin ───── */
router.put(
  "/general",
  authMiddleware,
  adminAuthMiddleware,
  updateGeneralSettings,
);
router.put(
  "/logo",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingle("logo"),
  updateLogo,
);
router.put(
  "/business-hours",
  authMiddleware,
  adminAuthMiddleware,
  updateBusinessHours,
);
router.put(
  "/booking-rules",
  authMiddleware,
  adminAuthMiddleware,
  updateBookingRules,
);
router.put(
  "/notifications",
  authMiddleware,
  adminAuthMiddleware,
  updateNotificationSettings,
);

export default router;
