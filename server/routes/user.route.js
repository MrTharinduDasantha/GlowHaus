// User / profile / customer-management routes.
// Customer:  GET/PUT /me, PUT /me/password
// Admin:     GET /, GET /:id, PUT /:id/block

import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  listCustomers,
  getCustomerById,
  toggleBlockCustomer,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ───── Customer (self) ───── */
router.get("/me", authMiddleware, getMyProfile);
router.put(
  "/me",
  authMiddleware,
  uploadSingle("profilePhoto"),
  updateMyProfile,
);
router.put("/me/password", authMiddleware, changePassword);

/* ───── Admin (customer management) ───── */
router.get("/", authMiddleware, adminAuthMiddleware, listCustomers);
router.get("/:id", authMiddleware, adminAuthMiddleware, getCustomerById);
router.put(
  "/:id/block",
  authMiddleware,
  adminAuthMiddleware,
  toggleBlockCustomer,
);

export default router;
