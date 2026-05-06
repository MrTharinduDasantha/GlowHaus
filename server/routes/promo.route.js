// Promo code routes.
// Customer:  POST /validate         — preview a code's discount before checkout
// Admin:     GET /, POST /, PUT /:id, DELETE /:id

import express from "express";
import {
  validatePromo,
  listPromos,
  createPromo,
  updatePromo,
  deletePromo,
} from "../controllers/promo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

/* ───── Customer ───── */
router.post("/validate", authMiddleware, validatePromo);

/* ───── Admin ───── */
router.get("/", authMiddleware, adminAuthMiddleware, listPromos);
router.post("/", authMiddleware, adminAuthMiddleware, createPromo);
router.put("/:id", authMiddleware, adminAuthMiddleware, updatePromo);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deletePromo);

export default router;
