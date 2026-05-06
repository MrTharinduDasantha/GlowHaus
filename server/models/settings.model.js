// Settings model — singleton (only ever ONE document in this collection).
// Holds the salon's global config: contact info, business hours, booking rules.

import mongoose from "mongoose";

// Reused per-day business-hours sub-document
const businessHourSchema = new mongoose.Schema(
  {
    closed: { type: Boolean, default: false },
    open: { type: String, default: "09:00" }, // "HH:mm"
    close: { type: String, default: "18:00" },
  },
  { _id: false },
);

const settingsSchema = new mongoose.Schema(
  {
    // ─── General ─────────────────────────────────────────
    salonName: { type: String, default: "GlowHaus" },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },

    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // ─── Business Hours (per day of the week) ────────────
    businessHours: {
      mon: { type: businessHourSchema, default: () => ({}) },
      tue: { type: businessHourSchema, default: () => ({}) },
      wed: { type: businessHourSchema, default: () => ({}) },
      thu: { type: businessHourSchema, default: () => ({}) },
      fri: { type: businessHourSchema, default: () => ({}) },
      sat: {
        type: businessHourSchema,
        default: () => ({ open: "10:00", close: "16:00" }),
      },
      sun: { type: businessHourSchema, default: () => ({ closed: true }) },
    },

    // ─── Booking Rules ───────────────────────────────────
    bookingRules: {
      advanceBookingDays: { type: Number, default: 30 }, // max days ahead
      cancellationNoticeHours: { type: Number, default: 24 }, // min notice for cancel
      slotInterval: { type: Number, default: 15 }, // slot granularity (minutes)
      cleaningGap: { type: Number, default: 10 }, // gap between bookings
    },

    // ─── Notification Settings ───────────────────────────
    notifications: {
      sendBookingConfirmation: { type: Boolean, default: true },
      send24HourReminder: { type: Boolean, default: true },
      sendStatusChangeEmail: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

/**
 * Singleton helper — always returns the one settings document,
 * creating it with defaults if it doesn't exist yet.
 */
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
