import api from "./axios.js";

export const favoriteApi = {
  list: () => api.get("/favorites"),
  add: (serviceId) => api.post("/favorites", { serviceId }),
  remove: (serviceId) => api.delete(`/favorites/${serviceId}`),
};
