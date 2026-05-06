// Authentication routes.
// Public:    POST /register, /login, /forgot-password, /verify-otp, /reset-password
// Protected: POST /logout, GET /me

import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Multipart/form-data is needed because register accepts an optional profile photo
router.post("/register", uploadSingle("profilePhoto"), register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

// Forgot-password OTP flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
