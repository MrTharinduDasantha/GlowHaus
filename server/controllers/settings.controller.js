// Settings controller (singleton pattern).
// Public:  getSettings  — used by navbar/footer (salon name, hours, social links)
// Admin:   updateGeneral, updateBusinessHours, updateBookingRules, updateNotifications, updateLogo

import Settings from "../models/settings.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";

/* ────────── PUBLIC: GET SETTINGS ────────── */

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    return sendSuccess(res, 200, "Settings fetched", settings);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE GENERAL ────────── */

export const updateGeneralSettings = async (req, res, next) => {
  try {
    const { salonName, address, phone, email, socialLinks } = req.body;
    const settings = await Settings.getSingleton();

    if (salonName !== undefined) settings.salonName = salonName;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (socialLinks) {
      settings.socialLinks = {
        ...settings.socialLinks.toObject(),
        ...socialLinks,
      };
    }
    await settings.save();
    return sendSuccess(res, 200, "General settings updated", settings);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE LOGO ────────── */

export const updateLogo = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, "Logo file is required");

    const settings = await Settings.getSingleton();
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "glowhaus/settings",
    );

    if (settings.logo?.publicId) {
      await deleteFromCloudinary(settings.logo.publicId);
    }
    settings.logo = uploaded;
    await settings.save();

    return sendSuccess(res, 200, "Logo updated", settings);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE BUSINESS HOURS ────────── */

export const updateBusinessHours = async (req, res, next) => {
  try {
    const { businessHours } = req.body;
    if (!businessHours || typeof businessHours !== "object") {
      return sendError(res, 400, "businessHours object is required");
    }

    const settings = await Settings.getSingleton();
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    days.forEach((day) => {
      if (businessHours[day]) {
        settings.businessHours[day] = {
          ...settings.businessHours[day].toObject(),
          ...businessHours[day],
        };
      }
    });
    await settings.save();
    return sendSuccess(res, 200, "Business hours updated", settings);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE BOOKING RULES ────────── */

export const updateBookingRules = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    const fields = [
      "advanceBookingDays",
      "cancellationNoticeHours",
      "slotInterval",
      "cleaningGap",
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        settings.bookingRules[f] = Number(req.body[f]);
      }
    }
    await settings.save();
    return sendSuccess(res, 200, "Booking rules updated", settings);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE NOTIFICATIONS ────────── */

export const updateNotificationSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    const fields = [
      "sendBookingConfirmation",
      "send24HourReminder",
      "sendStatusChangeEmail",
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        settings.notifications[f] = Boolean(req.body[f]);
      }
    }
    await settings.save();
    return sendSuccess(res, 200, "Notification settings updated", settings);
  } catch (error) {
    next(error);
  }
};
