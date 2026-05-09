import api from "./axios.js";

export const serviceApi = {
  list: (params) => api.get("/services", { params }),
  getFeatured: () => api.get("/services/featured"),
  getById: (id) => api.get(`/services/${id}`),
  create: (formData) =>
    api.post("/services", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/services/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/services/${id}`),
  assignStylists: (id, stylistIds) =>
    api.put(`/services/${id}/stylists`, { stylistIds }),
  toggleStatus: (id) => api.put(`/services/${id}/toggle-status`),
  toggleFeatured: (id) => api.put(`/services/${id}/toggle-featured`),
};
