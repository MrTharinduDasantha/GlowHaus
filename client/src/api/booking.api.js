import api from "./axios.js";

export const bookingApi = {
  /* ── Customer ── */
  create: (data) => api.post("/bookings", data),
  getMy: (params) => api.get("/bookings/my", { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancelMine: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  reschedule: (id, data) => api.put(`/bookings/${id}/reschedule`, data),

  /* ── Admin ── */
  listAdmin: (params) => api.get("/bookings", { params }),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  createWalkIn: (data) => api.post("/bookings/walk-in", data),
  sendReminder: (id) => api.post(`/bookings/${id}/send-reminder`),
};
