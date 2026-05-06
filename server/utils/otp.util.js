// 6-digit OTP generator for the forgot-password flow.
// Uses node:crypto for cryptographic randomness (NOT Math.random()).

import crypto from "crypto";

/**
 * Returns a zero-padded 6-digit OTP, e.g. "048217".
 * Range: 000000 - 999999 (1,000,000 possibilities).
 */
export const generateOtp = () => {
  const otp = crypto.randomInt(0, 1_000_000);
  return otp.toString().padStart(6, "0");
};
