// Stylist model — staff who perform services.
// Working hours are embedded so we can read them in one query when
// computing time slots. daysOff is an array of specific dates
// (vacation, sick days, public holidays).

import mongoose from "mongoose";

// Per-day working hours sub-document
const workingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      required: true,
    },
    closed: { type: Boolean, default: false }, // stylist not working that day
    startTime: { type: String, default: "09:00" }, // "HH:mm"
    endTime: { type: String, default: "18:00" },
    breakStart: { type: String, default: "" }, // optional lunch break
    breakEnd: { type: String, default: "" },
  },
  { _id: false },
);

const stylistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    expertise: { type: String, required: true, trim: true }, // e.g. "Senior Hair Stylist"
    bio: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    profilePhoto: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    workingHours: {
      type: [workingHourSchema],
      // Default: Mon–Sat 09:00–18:00 with a 13:00–13:30 break, Sun closed
      default: () => [
        {
          day: "mon",
          startTime: "09:00",
          endTime: "18:00",
          breakStart: "13:00",
          breakEnd: "13:30",
        },
        {
          day: "tue",
          startTime: "09:00",
          endTime: "18:00",
          breakStart: "13:00",
          breakEnd: "13:30",
        },
        {
          day: "wed",
          startTime: "09:00",
          endTime: "18:00",
          breakStart: "13:00",
          breakEnd: "13:30",
        },
        {
          day: "thu",
          startTime: "09:00",
          endTime: "18:00",
          breakStart: "13:00",
          breakEnd: "13:30",
        },
        {
          day: "fri",
          startTime: "09:00",
          endTime: "18:00",
          breakStart: "13:00",
          breakEnd: "13:30",
        },
        { day: "sat", startTime: "10:00", endTime: "16:00" },
        { day: "sun", closed: true, startTime: "00:00", endTime: "00:00" },
      ],
    },
    daysOff: [{ type: Date }], // specific unavailability dates
    isActive: { type: Boolean, default: true },

    // Aggregated review stats — recomputed when reviews are approved
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Stylist = mongoose.model("Stylist", stylistSchema);
export default Stylist;
