import api from "./axios.js";

export const galleryApi = {
  /* ── Public ── */
  listAlbums: () => api.get("/gallery"),
  getAlbumById: (id) => api.get(`/gallery/${id}`),

  /* ── Admin ── */
  createAlbum: (formData) =>
    api.post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateAlbum: (id, data) => api.put(`/gallery/${id}`, data),
  deleteAlbum: (id) => api.delete(`/gallery/${id}`),
  addImages: (id, formData) =>
    api.post(`/gallery/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateImageMeta: (id, imageId, data) =>
    api.put(`/gallery/${id}/images/${imageId}`, data),
  deleteImage: (id, imageId) => api.delete(`/gallery/${id}/images/${imageId}`),
};
