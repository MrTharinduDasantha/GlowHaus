// Full booking detail — used inside the BookingDetailsPage.
// Self-contained block: services list, stylist, times, total, payment status.

import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCardOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { formatRelative } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDuration } from "../../utils/formatDuration.js";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-rose-gold mt-0.5 shrink-0" size={18} />
    <div className="flex-1">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm text-text-primary mt-0.5">{value}</p>
    </div>
  </div>
);

const BookingDetailView = ({ booking }) => {
  if (!booking) return null;
  const payment = booking.payment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="p-6 bg-bg-surface border border-line-soft rounded-2xl">
        <p className="eyebrow text-rose-gold mb-2">Booking</p>
        <h2 className="font-display text-3xl mb-1">{booking.bookingId}</h2>
        <p className="text-text-secondary text-sm">
          {formatRelative(booking.startTime)}
        </p>
      </div>

      {/* Quick facts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-bg-surface border border-line-soft rounded-2xl">
        <Row
          icon={IoCalendarOutline}
          label="Date & Time"
          value={formatRelative(booking.startTime)}
        />
        <Row
          icon={IoTimeOutline}
          label="Duration"
          value={formatDuration(booking.totalDuration)}
        />
        <Row
          icon={IoPersonOutline}
          label="Stylist"
          value={booking.stylistName}
        />
        <Row
          icon={IoCardOutline}
          label="Payment"
          value={
            payment?.status
              ? `${payment.method?.toUpperCase()} · ${payment.status}`
              : "—"
          }
        />
        {booking.promoCode && (
          <Row
            icon={IoTicketOutline}
            label="Promo Code"
            value={`${booking.promoCode} (−${formatCurrency(booking.discountAmount)})`}
          />
        )}
      </div>

      {/* Services */}
      <div className="p-6 bg-bg-surface border border-line-soft rounded-2xl">
        <p className="eyebrow text-rose-gold mb-4">Services</p>
        <ul className="divide-y divide-line-soft">
          {booking.services.map((s, i) => (
            <li
              key={i}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-text-primary">{s.name}</p>
                <p className="text-xs text-text-muted">
                  {formatDuration(s.duration)}
                </p>
              </div>
              <span className="text-rose-gold font-medium">
                {formatCurrency(s.price)}
              </span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-line-soft">
          <span className="font-display text-lg">Total</span>
          <span className="font-display text-2xl text-rose-gold">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>
      </div>

      {booking.notes && (
        <div className="p-6 bg-bg-surface border border-line-soft rounded-2xl">
          <p className="eyebrow text-rose-gold mb-2">Notes</p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BookingDetailView;
