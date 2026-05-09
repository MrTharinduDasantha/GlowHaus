// Booking summary card for the My Bookings list.
// Shows status badge + date/time + services + actions (Cancel / Reschedule).

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { formatRelative } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const statusStyles = {
  pending: { label: "Pending", color: "warning" },
  confirmed: { label: "Confirmed", color: "info" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "danger" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusStyles[status] || { label: status, color: "info" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: `color-mix(in srgb, var(--color-${cfg.color}) 15%, transparent)`,
        color: `var(--color-${cfg.color})`,
        border: `1px solid color-mix(in srgb, var(--color-${cfg.color}) 30%, transparent)`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: `var(--color-${cfg.color})` }}
      />
      {cfg.label}
    </span>
  );
};

const BookingCard = ({
  booking,
  index = 0,
  onCancel,
  onReschedule,
  onReview,
}) => {
  const isUpcoming = ["pending", "confirmed"].includes(booking.status);
  const isCompleted = booking.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-5 bg-bg-surface border border-line-soft rounded-2xl hover:border-rose-gold/30 transition-colors"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-text-muted">Booking ID</p>
          <p className="font-mono text-sm text-rose-gold">
            {booking.bookingId}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Date / stylist row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary mb-4">
        <span className="flex items-center gap-1.5">
          <IoCalendarOutline className="text-rose-gold" size={16} />
          {formatRelative(booking.startTime)}
        </span>
        <span className="flex items-center gap-1.5">
          <IoTimeOutline className="text-rose-gold" size={16} />
          {booking.totalDuration} min
        </span>
        <span className="flex items-center gap-1.5">
          <IoPersonOutline className="text-rose-gold" size={16} />
          {booking.stylistName}
        </span>
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-2 mb-4">
        {booking.services.map((s, i) => (
          <span
            key={i}
            className="px-2.5 py-1 text-xs rounded-full bg-bg-elevated border border-line-soft"
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-4 border-t border-line-soft">
        <div>
          <p className="text-xs text-text-muted">Total</p>
          <p className="font-display text-xl text-rose-gold">
            {formatCurrency(booking.totalAmount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/my-bookings/${booking._id}`}
            className="text-sm text-text-secondary hover:text-rose-gold transition-colors px-3 py-1.5"
          >
            View
          </Link>
          {isUpcoming && (
            <>
              <button
                onClick={() => onReschedule?.(booking)}
                className="text-sm text-rose-gold hover:underline px-3 py-1.5"
              >
                Reschedule
              </button>
              <button
                onClick={() => onCancel?.(booking)}
                className="text-sm text-danger hover:underline px-3 py-1.5"
              >
                Cancel
              </button>
            </>
          )}
          {isCompleted && (
            <button
              onClick={() => onReview?.(booking)}
              className="text-sm text-rose-gold hover:underline px-3 py-1.5"
            >
              Write Review
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
