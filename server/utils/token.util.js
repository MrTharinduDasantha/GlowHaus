// JWT + HTTP-only cookie helpers.
// Three operations: generate, set, clear.

import jwt from "jsonwebtoken";

const TOKEN_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Sign a JWT — payload is typically { id, role }
export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// Set the token as an HTTP-only cookie on the response
export const setTokenCookie = (res, token) => {
  res.cookie(TOKEN_NAME, token, {
    httpOnly: true, // not accessible via JS — protects against XSS
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE,
  });
};

// Clear the token cookie (used on logout)
export const clearTokenCookie = (res) => {
  res.clearCookie(TOKEN_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};
