import api from "./axios.js";

export const categoryApi = {
  list: (params) => api.get("/categories", { params }),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  create: (formData) =>
    api.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/categories/${id}`),
};
