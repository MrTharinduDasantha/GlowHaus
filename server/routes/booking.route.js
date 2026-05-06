// Booking routes.
// Customer:  POST /, GET /my, GET /:id, PUT /:id/cancel, PUT /:id/reschedule
// Admin:     GET /, PUT /:id/status, POST /walk-in, POST /:id/send-reminder

import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelMyBooking,
  rescheduleMyBooking,
  listBookingsAdmin,
  updateBookingStatus,
  createWalkInBooking,
  sendManualReminder,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Every booking endpoint requires login
router.use(authMiddleware);

/* ───── Customer ───── */
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.put("/:id/cancel", cancelMyBooking);
router.put("/:id/reschedule", rescheduleMyBooking);

/* ───── Admin ───── */
// Admin-only endpoints. Note `/walk-in` must come BEFORE `/:id`
// so the literal "walk-in" path doesn't get treated as an id.
router.post("/walk-in", adminAuthMiddleware, createWalkInBooking);
router.get("/", adminAuthMiddleware, listBookingsAdmin);
router.put("/:id/status", adminAuthMiddleware, updateBookingStatus);
router.post("/:id/send-reminder", adminAuthMiddleware, sendManualReminder);

/* ───── Shared (customer sees own, admin sees any) ───── */
// Authorization is enforced inside the controller (compares req.user._id).
router.get("/:id", getBookingById);

export default router;
