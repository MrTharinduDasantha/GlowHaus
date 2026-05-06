// Schedule controller — admin views & quick edits to a stylist's calendar.
// Endpoints:
//   GET  /api/schedules/:stylistId/working-hours     — get current hours + days off
//   PUT  /api/schedules/:stylistId/working-hours     — update working hours
//   PUT  /api/schedules/:stylistId/days-off          — update days off
//   GET  /api/schedules/:stylistId/appointments      — bookings in a date range

import Stylist from "../models/stylist.model.js";
import Booking from "../models/booking.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { startOfDay, endOfDay } from "date-fns";

/* ───────────────────── GET WORKING HOURS ───────────────────── */

export const getWorkingHours = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.stylistId).select(
      "name workingHours daysOff",
    );
    if (!stylist) return sendError(res, 404, "Stylist not found");
    return sendSuccess(res, 200, "Working hours fetched", stylist);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── UPDATE WORKING HOURS ───────────────────── */

export const updateWorkingHours = async (req, res, next) => {
  try {
    const { workingHours } = req.body;
    if (!Array.isArray(workingHours)) {
      return sendError(res, 400, "workingHours must be an array");
    }

    const stylist = await Stylist.findById(req.params.stylistId);
    if (!stylist) return sendError(res, 404, "Stylist not found");

    stylist.workingHours = workingHours;
    await stylist.save();

    return sendSuccess(res, 200, "Working hours updated", stylist);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── UPDATE DAYS OFF ───────────────────── */

export const updateDaysOff = async (req, res, next) => {
  try {
    const { daysOff } = req.body;
    if (!Array.isArray(daysOff)) {
      return sendError(res, 400, "daysOff must be an array of dates");
    }

    const stylist = await Stylist.findById(req.params.stylistId);
    if (!stylist) return sendError(res, 404, "Stylist not found");

    stylist.daysOff = daysOff.map((d) => new Date(d));
    await stylist.save();

    return sendSuccess(res, 200, "Days off updated", stylist);
  } catch (error) {
    next(error);
  }
};

/* ────────── GET STYLIST'S APPOINTMENTS IN A DATE RANGE ────────── */

export const getStylistAppointments = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return sendError(res, 400, "from and to query params are required");
    }

    const start = startOfDay(new Date(from));
    const end = endOfDay(new Date(to));

    const bookings = await Booking.find({
      stylist: req.params.stylistId,
      startTime: { $gte: start, $lte: end },
      status: { $in: ["pending", "confirmed", "completed"] },
    })
      .sort({ startTime: 1 })
      .populate("customer", "name email profilePhoto");

    return sendSuccess(res, 200, "Appointments fetched", bookings);
  } catch (error) {
    next(error);
  }
};
