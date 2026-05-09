import api from "./axios.js";

export const scheduleApi = {
  getWorkingHours: (stylistId) =>
    api.get(`/schedules/${stylistId}/working-hours`),
  updateWorkingHours: (stylistId, workingHours) =>
    api.put(`/schedules/${stylistId}/working-hours`, { workingHours }),
  updateDaysOff: (stylistId, daysOff) =>
    api.put(`/schedules/${stylistId}/days-off`, { daysOff }),
  getAppointments: (stylistId, params) =>
    api.get(`/schedules/${stylistId}/appointments`, { params }),
};
