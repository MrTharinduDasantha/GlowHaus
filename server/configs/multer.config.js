// Multer configuration for handling multipart/form-data image uploads.
// We use memory storage so we can stream the buffer straight to Cloudinary without writing to disk first.

import multer from "multer";

// Buffers stay in memory (req.file.buffer) — perfect for Cloudinary upload_stream
const storage = multer.memoryStorage();

// Only accept image mime-types (jpeg, png, webp, gif, etc.)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
  },
});

export default upload;
