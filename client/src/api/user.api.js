// User profile + admin customer-management endpoints.

import api from "./axios.js";

export const userApi = {
  /* ── Customer (self) ── */
  getMyProfile: () => api.get("/users/me"),
  updateMyProfile: (formData) =>
    api.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (data) => api.put("/users/me/password", data),

  /* ── Admin ── */
  listCustomers: (params) => api.get("/users", { params }),
  getCustomerById: (id) => api.get(`/users/${id}`),
  toggleBlockCustomer: (id) => api.put(`/users/${id}/block`),
};
