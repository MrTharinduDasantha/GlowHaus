// Fetches available time slots for the booking flow.
// Returns { slots, loading, error, refetch } — caller controls when to fire.

import { useCallback, useEffect, useState } from "react";
import { timeSlotApi } from "../api/timeSlot.api.js";

export const useTimeSlots = ({ stylistId, date, serviceIds }) => {
  const [slots, setSlots] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(async () => {
    if (!stylistId || !date || !serviceIds?.length) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await timeSlotApi.getAvailable({
        stylistId,
        date: typeof date === "string" ? date : date.toISOString().slice(0, 10),
        serviceIds,
      });
      setSlots(res.data.data.slots);
      setTotalDuration(res.data.data.totalDuration);
    } catch (err) {
      setError(err.userMessage || "Failed to load time slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [stylistId, date, JSON.stringify(serviceIds)]);

  // Auto-fetch whenever inputs change
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slots, totalDuration, loading, error, refetch: fetchSlots };
};
