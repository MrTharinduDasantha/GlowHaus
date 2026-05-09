import api from "./axios.js";

export const reportApi = {
  getRevenue: (params) => api.get("/reports/revenue", { params }),
  // PDF download — responseType:'blob' so axios doesn't try to JSON-parse it
  downloadRevenuePdf: (params) =>
    api.get("/reports/revenue/pdf", { params, responseType: "blob" }),
  getTopServices: (params) => api.get("/reports/top-services", { params }),
  getCustomerStats: (id) => api.get(`/reports/customer-stats/${id}`),
};
