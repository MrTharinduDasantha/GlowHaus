// Gallery routes — albums + per-image management.
// Public:    GET /, GET /:id
// Admin:     POST /, PUT /:id, DELETE /:id,
//            POST /:id/images, PUT /:id/images/:imageId, DELETE /:id/images/:imageId

import express from "express";
import {
  listAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImagesToAlbum,
  updateImageMeta,
  deleteImageFromAlbum,
} from "../controllers/gallery.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { uploadMultiple } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ───── Public ───── */
router.get("/", listAlbums);
router.get("/:id", getAlbumById);

/* ───── Admin ───── */
// Up to 20 images per upload (initial album creation or bulk add)
router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadMultiple("images", 20),
  createAlbum,
);
router.put("/:id", authMiddleware, adminAuthMiddleware, updateAlbum);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteAlbum);

// Per-image actions inside an album
router.post(
  "/:id/images",
  authMiddleware,
  adminAuthMiddleware,
  uploadMultiple("images", 20),
  addImagesToAlbum,
);
router.put(
  "/:id/images/:imageId",
  authMiddleware,
  adminAuthMiddleware,
  updateImageMeta,
);
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  adminAuthMiddleware,
  deleteImageFromAlbum,
);

export default router;
