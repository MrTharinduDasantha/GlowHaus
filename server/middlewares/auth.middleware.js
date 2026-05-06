// Verifies the JWT stored in an HTTP-only cookie.
// On success, attaches the full user document (minus password) to req.user.

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendError } from "../utils/response.util.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Token comes from the HTTP-only cookie we set on login
    const token = req.cookies?.token;
    if (!token) {
      return sendError(res, 401, "Not authenticated. Please log in.");
    }

    // Throws if invalid / expired — caught below
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user (in case role changed, password reset, etc.)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendError(res, 401, "User no longer exists.");
    }

    // Optional safety net — block flag on the user model
    if (user.isBlocked) {
      return sendError(res, 403, "Your account has been blocked.");
    }

    req.user = user; // available to every downstream controller
    next();
  } catch (error) {
    return sendError(res, 401, "Invalid or expired token.");
  }
};
