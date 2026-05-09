// Auth endpoints — consumed by authSlice and auth pages.

import api from "./axios.js";

export const authApi = {
  // Register — multipart for the profile photo
  register: (formData) =>
    api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};
