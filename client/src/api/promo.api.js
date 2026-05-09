import api from "./axios.js";

export const promoApi = {
  /* ── Customer ── */
  validate: (code, subtotal) =>
    api.post("/promos/validate", { code, subtotal }),

  /* ── Admin ── */
  list: () => api.get("/promos"),
  create: (data) => api.post("/promos", data),
  update: (id, data) => api.put(`/promos/${id}`, data),
  remove: (id) => api.delete(`/promos/${id}`),
};
