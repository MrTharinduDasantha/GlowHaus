// OTP model — used for forgot-password verification.
// MongoDB TTL index auto-deletes expired documents (no cron needed).

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: { type: String, required: true }, // 6-digit code
    purpose: {
      type: String,
      enum: ["password-reset"],
      default: "password-reset",
    },
    // Document is deleted by MongoDB ~60 sec after this time
    expiresAt: {
      type: Date,
      required: true,
      // expireAfterSeconds: 0 means "delete when current time >= expiresAt"
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
