import api from "./axios.js";

export const paymentApi = {
  getMy: () => api.get("/payments/my"),
  listAll: (params) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
};
