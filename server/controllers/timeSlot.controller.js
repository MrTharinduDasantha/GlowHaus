// Time-slot endpoint — given a stylist + date + selected services, returns every "HH:mm" slot the customer can pick.

import Stylist from "../models/stylist.model.js";
import Service from "../models/service.model.js";
import Booking from "../models/booking.model.js";
import Settings from "../models/settings.model.js";
import { generateAvailableSlots } from "../utils/timeSlot.util.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { startOfDay, endOfDay } from "date-fns";

/**
 * GET /api/time-slots?stylistId=...&date=YYYY-MM-DD&serviceIds=id1,id2
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { stylistId, date, serviceIds } = req.query;

    if (!stylistId || !date || !serviceIds) {
      return sendError(res, 400, "stylistId, date and serviceIds are required");
    }

    // Parse comma-separated ids ("id1,id2,id3" -> array)
    const idsArray = serviceIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (idsArray.length === 0) {
      return sendError(res, 400, "At least one service is required");
    }

    // Fetch in parallel
    const [stylist, services, settings] = await Promise.all([
      Stylist.findById(stylistId),
      Service.find({ _id: { $in: idsArray }, isActive: true }),
      Settings.getSingleton(),
    ]);

    if (!stylist || !stylist.isActive) {
      return sendError(res, 404, "Stylist not found or inactive");
    }
    if (services.length !== idsArray.length) {
      return sendError(
        res,
        400,
        "One or more services are invalid or inactive",
      );
    }

    // Stylist must be qualified for EVERY selected service
    const unqualified = services.find(
      (s) => !s.assignedStylists.map(String).includes(String(stylist._id)),
    );
    if (unqualified) {
      return sendError(
        res,
        400,
        `Stylist cannot perform service: ${unqualified.name}`,
      );
    }

    // Sum up total duration
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

    // Pull existing bookings for this stylist on the chosen date
    const targetDate = new Date(date);
    const existingBookings = await Booking.find({
      stylist: stylist._id,
      startTime: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: { $in: ["pending", "confirmed"] },
    }).select("startTime endTime");

    // Generate slots using the util we built in Stage 2
    const slots = generateAvailableSlots({
      date: targetDate,
      stylist,
      existingBookings,
      totalDuration,
      businessHours: settings.businessHours,
      slotInterval: settings.bookingRules.slotInterval,
      cleaningGap: settings.bookingRules.cleaningGap,
    });

    return sendSuccess(res, 200, "Available slots fetched", {
      slots,
      totalDuration,
    });
  } catch (error) {
    next(error);
  }
};
