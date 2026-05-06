// Schedule routes — admin only.
// View / edit a stylist's working hours, days off, and assigned appointments.

import express from "express";
import {
  getWorkingHours,
  updateWorkingHours,
  updateDaysOff,
  getStylistAppointments,
} from "../controllers/schedule.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminAuthMiddleware); // every endpoint here is admin

router.get("/:stylistId/working-hours", getWorkingHours);
router.put("/:stylistId/working-hours", updateWorkingHours);
router.put("/:stylistId/days-off", updateDaysOff);
router.get("/:stylistId/appointments", getStylistAppointments);

export default router;
