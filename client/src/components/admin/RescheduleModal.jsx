// Pick new date + time for a booking. Server re-checks availability before saving.

import { useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Modal from "../common/Modal.jsx";
import DatePicker from "../user/DatePicker.jsx";
import { useTimeSlots } from "../../hooks/useTimeSlots.js";
import { bookingApi } from "../../api/booking.api.js";

const RescheduleModal = ({ booking, isOpen, onClose, onSuccess }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { slots, loading } = useTimeSlots({
    stylistId: booking?.stylist?._id || booking?.stylist,
    date,
    serviceIds:
      booking?.services?.map((s) => s.service?._id || s.service) || [],
  });

  const submit = async () => {
    if (!date || !time) return toast.error("Pick a new date and time");
    setSubmitting(true);
    try {
      // Customer's reschedule endpoint also requires ownership; admin uses
      // the same path because the controller checks role internally.
      await bookingApi.reschedule(booking._id, {
        date: format(date, "yyyy-MM-dd"),
        startTime: time,
      });
      toast.success("Booking rescheduled");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to reschedule");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Appointment">
      <div className="space-y-5">
        <p className="text-sm text-text-secondary">
          Booking{" "}
          <span className="text-rose-gold font-mono">{booking?.bookingId}</span>{" "}
          for <span className="text-text-primary">{booking?.customerName}</span>
        </p>

        <div>
          <p className="eyebrow text-rose-gold mb-2">New Date</p>
          <DatePicker value={date} onChange={setDate} />
        </div>

        <div>
          <p className="eyebrow text-rose-gold mb-2">New Time</p>
          {loading ? (
            <p className="text-text-muted text-sm">Loading slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-text-muted text-sm">Pick a date first.</p>
          ) : (
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-luxe"
            >
              <option value="">Select time</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary hover:bg-bg-surface"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="btn-primary disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Reschedule"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleModal;
