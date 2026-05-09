import api from "./axios.js";

export const adminApi = {
  getDashboardStats: () => api.get("/admin/dashboard"),
};
