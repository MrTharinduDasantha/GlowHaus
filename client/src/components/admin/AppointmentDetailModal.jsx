// Click an appointment row → see full detail + status actions.
// Wraps the BookingDetailView (built in Stage 7) and adds admin-only buttons.

import { useState } from "react";
import { toast } from "react-toastify";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoMailOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import Modal from "../common/Modal.jsx";
import BookingDetailView from "../user/BookingDetailView.jsx";
import { bookingApi } from "../../api/booking.api.js";

const AppointmentDetailModal = ({
  booking,
  isOpen,
  onClose,
  onUpdated,
  onReschedule,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  if (!booking) return null;
  const isUpcoming = ["pending", "confirmed"].includes(booking.status);

  const updateStatus = async (status) => {
    if (status === "cancelled" && !reason) {
      return toast.warn("Please add a cancellation reason below first.");
    }
    setLoading(true);
    try {
      await bookingApi.updateStatus(booking._id, { status, reason });
      toast.success(`Marked as ${status}`);
      onUpdated?.();
      onClose?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async () => {
    setLoading(true);
    try {
      await bookingApi.sendReminder(booking._id);
      toast.success("Reminder email sent");
    } catch (err) {
      toast.error(err.userMessage || "Failed to send reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      size="lg"
    >
      <BookingDetailView booking={booking} />

      {/* Actions */}
      {isUpcoming && (
        <div className="mt-6 pt-6 border-t border-line-soft space-y-3">
          <p className="eyebrow text-rose-gold">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {booking.status === "pending" && (
              <button
                disabled={loading}
                onClick={() => updateStatus("confirmed")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-info/10 text-info border border-info/30 text-sm hover:bg-info/20"
              >
                <IoCheckmarkCircleOutline /> Confirm
              </button>
            )}
            <button
              disabled={loading}
              onClick={() => updateStatus("completed")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success border border-success/30 text-sm hover:bg-success/20"
            >
              <IoCheckmarkCircleOutline /> Mark Completed
            </button>
            <button
              disabled={loading}
              onClick={() => onReschedule?.(booking)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated border border-line-soft text-sm hover:border-rose-gold/40"
            >
              <IoCalendarOutline /> Reschedule
            </button>
            <button
              disabled={loading}
              onClick={sendReminder}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated border border-line-soft text-sm hover:border-rose-gold/40"
            >
              <IoMailOutline /> Send Reminder
            </button>
          </div>

          {/* Cancellation flow */}
          <div className="pt-3">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Cancellation reason (required to cancel)"
              className="input-luxe mb-2"
            />
            <button
              disabled={loading}
              onClick={() => updateStatus("cancelled")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 text-danger border border-danger/30 text-sm hover:bg-danger/20"
            >
              <IoCloseCircleOutline /> Cancel Booking
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;
