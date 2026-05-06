// User profile controller.
// Endpoints:
//   GET    /api/users/me              — current profile (alias of /auth/me)
//   PUT    /api/users/me              — update name, email, phone, profile photo
//   PUT    /api/users/me/password     — change password (requires current password)
//   GET    /api/users                 — list customers (admin)
//   GET    /api/users/:id             — get customer by id (admin)
//   PUT    /api/users/:id/block       — block / unblock a customer (admin)

import User from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";

/* ───────────────────────── GET MY PROFILE ───────────────────────── */

export const getMyProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "Profile fetched", req.user);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────────── UPDATE MY PROFILE ───────────────────────── */

export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    // Email change — must not collide with another user
    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase() });
      if (taken) return sendError(res, 400, "Email already in use");
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // New profile photo? Replace and delete the old one from Cloudinary.
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "glowhaus/users",
      );
      if (user.profilePhoto?.publicId) {
        await deleteFromCloudinary(user.profilePhoto.publicId);
      }
      user.profilePhoto = uploaded;
    }

    await user.save();
    return sendSuccess(res, 200, "Profile updated", user);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────────── CHANGE PASSWORD ───────────────────────── */

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return sendError(res, 400, "All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return sendError(res, 400, "Passwords do not match");
    }
    if (newPassword.length < 6) {
      return sendError(res, 400, "New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return sendError(res, 404, "User not found");

    const ok = await comparePassword(currentPassword, user.password);
    if (!ok) return sendError(res, 400, "Current password is incorrect");

    user.password = await hashPassword(newPassword);
    await user.save();

    return sendSuccess(res, 200, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

/* ──────────────────── ADMIN: LIST CUSTOMERS ──────────────────── */

export const listCustomers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;

    // Build a simple text filter on name OR email
    const filter = { role: "customer" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Customers fetched", {
      customers,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/* ──────────────────── ADMIN: GET CUSTOMER BY ID ──────────────────── */

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });
    if (!customer) return sendError(res, 404, "Customer not found");
    return sendSuccess(res, 200, "Customer fetched", customer);
  } catch (error) {
    next(error);
  }
};

/* ──────────────────── ADMIN: BLOCK / UNBLOCK ──────────────────── */

export const toggleBlockCustomer = async (req, res, next) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });
    if (!customer) return sendError(res, 404, "Customer not found");

    customer.isBlocked = !customer.isBlocked;
    await customer.save();

    return sendSuccess(
      res,
      200,
      `Customer ${customer.isBlocked ? "blocked" : "unblocked"}`,
      customer,
    );
  } catch (error) {
    next(error);
  }
};
