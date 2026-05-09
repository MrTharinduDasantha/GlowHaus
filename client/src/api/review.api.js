import api from "./axios.js";

export const reviewApi = {
  /* ── Public ── */
  listForService: (serviceId) => api.get(`/reviews/service/${serviceId}`),

  /* ── Customer ── */
  create: (data) => api.post("/reviews", data),
  getMy: () => api.get("/reviews/my"),

  /* ── Admin ── */
  listAll: (params) => api.get("/reviews", { params }),
  moderate: (id, action) => api.put(`/reviews/${id}/moderate`, { action }),
  remove: (id) => api.delete(`/reviews/${id}`),
};
