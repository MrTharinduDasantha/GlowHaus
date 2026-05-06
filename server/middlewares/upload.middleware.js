// Thin wrappers around the configured multer instance so routes stay clean.
// Use uploadSingle("image") for one-file fields, uploadMultiple("images", 12) for galleries / before-and-after sets.

import upload from "../configs/multer.config.js";

// Single file: profile photo, service image, category image, stylist photo
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files: gallery albums, before/after sets
export const uploadMultiple = (fieldName, maxCount = 10) =>
  upload.array(fieldName, maxCount);
