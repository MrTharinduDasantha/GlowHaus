import api from "./axios.js";

export const stylistApi = {
  list: (params) => api.get("/stylists", { params }),
  getById: (id) => api.get(`/stylists/${id}`),
  create: (formData) =>
    api.post("/stylists", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/stylists/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/stylists/${id}`),
  toggleStatus: (id) => api.put(`/stylists/${id}/toggle-status`),
};
