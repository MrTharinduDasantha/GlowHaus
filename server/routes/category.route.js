// Category routes.
// Public:    GET /, GET /slug/:slug
// Admin:     POST /, PUT /:id, DELETE /:id

import express from "express";
import {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public reads
router.get("/", listCategories);
router.get("/slug/:slug", getCategoryBySlug);

// Admin writes
router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingle("image"),
  createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingle("image"),
  updateCategory,
);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteCategory);

export default router;
