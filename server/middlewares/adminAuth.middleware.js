// Must run AFTER authMiddleware (so req.user is populated).
// Allows the request through only if the user has the "admin" role.

import { sendError } from "../utils/response.util.js";

export const adminAuthMiddleware = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, "Not authenticated.");
  }
  if (req.user.role !== "admin") {
    return sendError(res, 403, "Admin access only.");
  }
  next();
};
