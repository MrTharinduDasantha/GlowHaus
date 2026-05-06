// Stylist routes.
// Public:    GET /, GET /:id
// Admin:     POST /, PUT /:id, DELETE /:id, PUT /:id/toggle-status

import express from "express";
import {
  listStylists,
  getStylistById,
  createStylist,
  updateStylist,
  deleteStylist,
  toggleStylistStatus,
} from "../controllers/stylist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ───── Public ───── */
router.get("/", listStylists);
router.get("/:id", getStylistById);

/* ───── Admin ───── */
router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingle("profilePhoto"),
  createStylist,
);
router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingle("profilePhoto"),
  updateStylist,
);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteStylist);
router.put(
  "/:id/toggle-status",
  authMiddleware,
  adminAuthMiddleware,
  toggleStylistStatus,
);

export default router;
