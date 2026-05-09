import api from "./axios.js";

export const settingsApi = {
  /* ── Public ── */
  get: () => api.get("/settings"),

  /* ── Admin ── */
  updateGeneral: (data) => api.put("/settings/general", data),
  updateLogo: (formData) =>
    api.put("/settings/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBusinessHours: (businessHours) =>
    api.put("/settings/business-hours", { businessHours }),
  updateBookingRules: (data) => api.put("/settings/booking-rules", data),
  updateNotifications: (data) => api.put("/settings/notifications", data),
};
