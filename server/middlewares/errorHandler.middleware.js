// Global error handler — must be the LAST middleware mounted in server.js.
// Translates known errors (multer, mongoose, etc.) into clean JSON responses.

import { sendError } from "../utils/response.util.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Multer: file too large
  if (err.code === "LIMIT_FILE_SIZE") {
    return sendError(res, 400, "File too large. Maximum size is 5MB.");
  }

  // Multer: file filter rejected non-image
  if (err.message === "Only image files are allowed") {
    return sendError(res, 400, err.message);
  }

  // Mongoose: validation errors (required fields, enum, min/max, etc.)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, messages.join(", "));
  }

  // Mongoose: invalid ObjectId / type cast failed
  if (err.name === "CastError") {
    return sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose: duplicate unique field (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 400, `${field} already exists.`);
  }

  // Fallback
  return sendError(
    res,
    err.statusCode || 500,
    err.message || "Internal server error.",
  );
};
