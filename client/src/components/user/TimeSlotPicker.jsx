// Visual grid of available "HH:mm" time slots.
// Reads from useTimeSlots hook which calls /api/time-slots.

import { motion } from "framer-motion";
import { format, parse } from "date-fns";
import { useTimeSlots } from "../../hooks/useTimeSlots.js";
import Loader from "../common/Loader.jsx";

const TimeSlotPicker = ({
  stylistId,
  date,
  serviceIds,
  selectedTime,
  onSelect,
}) => {
  const { slots, loading, error } = useTimeSlots({
    stylistId,
    date,
    serviceIds,
  });

  if (!stylistId || !date) {
    return (
      <p className="text-text-muted text-sm">
        Select a stylist and date to see available times.
      </p>
    );
  }

  if (loading) return <Loader fullScreen={false} label="Loading slots" />;
  if (error)
    return (
      <p className="text-danger text-sm">
        Could not load time slots. Please try again.
      </p>
    );
  if (!slots.length)
    return (
      <p className="text-text-muted text-sm">
        No available times for this stylist on this day. Try a different date.
      </p>
    );

  // Group slots into rough buckets (Morning / Afternoon / Evening)
  const buckets = { Morning: [], Afternoon: [], Evening: [] };
  slots.forEach((s) => {
    const [hh] = s.split(":").map(Number);
    if (hh < 12) buckets.Morning.push(s);
    else if (hh < 17) buckets.Afternoon.push(s);
    else buckets.Evening.push(s);
  });

  return (
    <div className="space-y-5">
      {Object.entries(buckets).map(
        ([label, items]) =>
          items.length > 0 && (
            <div key={label}>
              <p className="eyebrow text-rose-gold mb-3">{label}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {items.map((slot) => {
                  const isSelected = slot === selectedTime;
                  return (
                    <motion.button
                      key={slot}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onSelect(slot)}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        isSelected
                          ? "border-rose-gold text-bg-base"
                          : "border-line-soft text-text-secondary hover:border-rose-gold/50 hover:text-text-primary"
                      }`}
                      style={
                        isSelected ? { background: "var(--gradient-rose)" } : {}
                      }
                    >
                      {format(parse(slot, "HH:mm", new Date()), "h:mm a")}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ),
      )}
    </div>
  );
};

export default TimeSlotPicker;
