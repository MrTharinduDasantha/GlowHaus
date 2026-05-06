// Authentication controller.
// Endpoints:
//   POST /api/auth/register         — create customer (with profile photo)
//   POST /api/auth/login            — email + password
//   POST /api/auth/logout           — clear cookie
//   GET  /api/auth/me               — current user (requires auth)
//   POST /api/auth/forgot-password  — send 6-digit OTP via email
//   POST /api/auth/verify-otp       — check OTP validity
//   POST /api/auth/reset-password   — set new password using OTP

import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/token.util.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import { generateOtp } from "../utils/otp.util.js";
import { sendOtpEmail } from "../utils/email.util.js";

/* ───────────────────────── REGISTER ───────────────────────── */

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Field-level validation
    if (!name || !email || !password || !confirmPassword) {
      return sendError(
        res,
        400,
        "Name, email, password and confirm password are required",
      );
    }
    if (password !== confirmPassword) {
      return sendError(res, 400, "Passwords do not match");
    }
    if (password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters");
    }

    // Reject duplicate emails
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 400, "Email already registered");

    // Optional profile photo (multer puts it on req.file)
    let profilePhoto = { url: "", publicId: "" };
    if (req.file) {
      profilePhoto = await uploadToCloudinary(
        req.file.buffer,
        "glowhaus/users",
      );
    }

    // Hash + save
    const hashed = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone: phone || "",
      profilePhoto,
      role: "customer", // explicit — admins are seeded directly in DB
    });

    // Auto-login: issue JWT cookie immediately
    const token = generateToken({ id: user._id, role: user.role });
    setTokenCookie(res, token);

    // Strip password before responding (already select:false but be safe)
    const safe = user.toObject();
    delete safe.password;

    return sendSuccess(res, 201, "Registration successful", safe);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────────── LOGIN ───────────────────────── */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // password is select:false — must be explicit
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user) return sendError(res, 401, "Invalid credentials");

    if (user.isBlocked) {
      return sendError(res, 403, "Your account has been blocked");
    }

    const ok = await comparePassword(password, user.password);
    if (!ok) return sendError(res, 401, "Invalid credentials");

    const token = generateToken({ id: user._id, role: user.role });
    setTokenCookie(res, token);

    const safe = user.toObject();
    delete safe.password;

    return sendSuccess(res, 200, "Login successful", safe);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────────── LOGOUT ───────────────────────── */

export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    return sendSuccess(res, 200, "Logged out");
  } catch (error) {
    next(error);
  }
};

/* ───────────────────────── GET CURRENT USER ───────────────────────── */

export const getMe = async (req, res, next) => {
  try {
    // authMiddleware already attached the user
    return sendSuccess(res, 200, "User fetched", req.user);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── FORGOT PASSWORD (send OTP) ──────────────────── */

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 400, "Email is required");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 404, "No account found with that email");

    // Wipe any previous OTPs for this email so only the latest is valid
    await Otp.deleteMany({ email: email.toLowerCase() });

    // Generate, save (10 min TTL), email
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.create({ email: email.toLowerCase(), otp, expiresAt });
    await sendOtpEmail(email, otp);

    return sendSuccess(res, 200, "OTP sent to your email");
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────── VERIFY OTP ────────────────────────── */

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return sendError(res, 400, "Email and OTP are required");

    const record = await Otp.findOne({ email: email.toLowerCase(), otp });
    if (!record) return sendError(res, 400, "Invalid OTP");
    if (record.expiresAt < new Date()) {
      return sendError(res, 400, "OTP has expired");
    }

    // We do NOT delete the OTP here — resetPassword will use it once more
    return sendSuccess(res, 200, "OTP verified");
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────── RESET PASSWORD ────────────────────────── */

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return sendError(res, 400, "All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return sendError(res, 400, "Passwords do not match");
    }
    if (newPassword.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters");
    }

    // Re-verify OTP at reset time (defence in depth)
    const record = await Otp.findOne({ email: email.toLowerCase(), otp });
    if (!record || record.expiresAt < new Date()) {
      return sendError(res, 400, "Invalid or expired OTP");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 404, "User not found");

    user.password = await hashPassword(newPassword);
    await user.save();

    // Burn the OTP so it can't be reused
    await Otp.deleteMany({ email: email.toLowerCase() });

    return sendSuccess(res, 200, "Password reset successful. Please log in.");
  } catch (error) {
    next(error);
  }
};
