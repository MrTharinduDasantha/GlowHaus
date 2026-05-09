// Available-slots endpoint for the date/time picker.
// `serviceIds` should be an array — we join it client-side.

import api from "./axios.js";

export const timeSlotApi = {
  getAvailable: ({ stylistId, date, serviceIds }) =>
    api.get("/time-slots", {
      params: {
        stylistId,
        date,
        serviceIds: Array.isArray(serviceIds)
          ? serviceIds.join(",")
          : serviceIds,
      },
    }),
};
