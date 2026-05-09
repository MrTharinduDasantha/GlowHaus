// Customer's booking history with tabs + cancel/reschedule modals.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import BookingCard from "../../components/user/BookingCard.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import Modal from "../../components/common/Modal.jsx";
import DatePicker from "../../components/user/DatePicker.jsx";
import { useTimeSlots } from "../../hooks/useTimeSlots.js";
import { bookingApi } from "../../api/booking.api.js";
import Loader from "../../components/common/Loader.jsx";
import emptyImg from "../../assets/empty-bookings.png";
import { format } from "date-fns";

const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const MyBookingsPage = () => {
  const [tab, setTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getMy({ tab });
      setBookings(res.data.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(); /* eslint-disable-next-line */
  }, [tab]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setActionLoading(true);
    try {
      await bookingApi.cancelMine(cancelTarget._id, {
        reason: "Cancelled by customer",
      });
      toast.success("Booking cancelled");
      setCancelTarget(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.userMessage || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="text-center mb-8">
        <p className="eyebrow text-rose-gold mb-2">Your appointments</p>
        <h1 className="font-display text-4xl md:text-5xl">My Bookings</h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-line-soft mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-5 py-3 text-sm transition-colors ${
              tab === t.id
                ? "text-rose-gold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="bookings-tab"
                className="absolute inset-x-3 bottom-0 h-px"
                style={{ background: "var(--gradient-rose)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {loading ? (
            <Loader fullScreen={false} />
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <img
                src={emptyImg}
                alt=""
                className="w-40 mx-auto opacity-80 mb-4"
              />
              <p className="text-text-muted mb-4">No {tab} bookings yet.</p>
              {tab === "upcoming" && (
                <Link to="/services" className="btn-primary">
                  Book a Service
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {bookings.map((b, i) => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  index={i}
                  onCancel={() => setCancelTarget(b)}
                  onReschedule={() => setRescheduleTarget(b)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cancel dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel this booking?"
        message="This action cannot be undone. You'll need to book again if you change your mind."
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep it"
        variant="danger"
        loading={actionLoading}
      />

      {/* Reschedule modal */}
      {rescheduleTarget && (
        <CustomerRescheduleModal
          booking={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
};

/* ── Inline reschedule modal (uses same useTimeSlots hook) ── */
const CustomerRescheduleModal = ({ booking, onClose, onSuccess }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { slots, loading } = useTimeSlots({
    stylistId: booking.stylist?._id || booking.stylist,
    date,
    serviceIds: booking.services.map((s) => s.service?._id || s.service),
  });

  const submit = async () => {
    if (!date || !time) return toast.error("Pick a new date and time");
    setSubmitting(true);
    try {
      await bookingApi.reschedule(booking._id, {
        date: format(date, "yyyy-MM-dd"),
        startTime: time,
      });
      toast.success("Booking rescheduled");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.userMessage || "Failed to reschedule");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Reschedule Booking">
      <div className="space-y-5">
        <div>
          <p className="eyebrow text-rose-gold mb-2">New date</p>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <p className="eyebrow text-rose-gold mb-2">New time</p>
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
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary"
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

export default MyBookingsPage;
