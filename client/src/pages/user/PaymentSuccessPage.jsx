// Stripe redirects here on success with ?bookingId=GH-XXXXXX
// We give the webhook ~1.5s to confirm, then fetch the booking.

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoCalendarOutline } from "react-icons/io5";
import { bookingApi } from "../../api/booking.api.js";
import Loader from "../../components/common/Loader.jsx";
import BookingDetailView from "../../components/user/BookingDetailView.jsx";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const find = async () => {
      try {
        // Pull all my bookings and find the one with this bookingId.
        const res = await bookingApi.getMy({ tab: "upcoming" });
        const found = res.data.data.find((b) => b.bookingId === bookingId);
        if (!cancelled && found) {
          // Hydrate the populated fields
          const detail = await bookingApi.getById(found._id);
          if (!cancelled) setBooking(detail.data.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    // Small delay lets the Stripe webhook finish first
    const id = setTimeout(find, 1500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [bookingId]);

  // Build a Google Calendar "add event" link
  const calendarLink = booking
    ? buildGCalLink({
        title: `GlowHaus — ${booking.services.map((s) => s.name).join(", ")}`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        details: `Booking ${booking.bookingId} with ${booking.stylistName}`,
      })
    : null;

  return (
    <div className="container-luxe py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-10"
      >
        <div
          className="inline-flex w-20 h-20 rounded-full items-center justify-center mb-5"
          style={{
            background:
              "color-mix(in srgb, var(--color-success) 15%, transparent)",
          }}
        >
          <IoCheckmarkCircle size={48} className="text-success" />
        </div>
        <p className="eyebrow text-rose-gold mb-2">Confirmed</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Thank you ✨</h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Your booking is confirmed. We've sent the details to your email.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <Loader fullScreen={false} label="Fetching your booking" />
        ) : !booking ? (
          <p className="text-center text-text-muted">
            Booking{" "}
            <span className="text-rose-gold font-mono">{bookingId}</span> is
            being processed. Please refresh in a moment.
          </p>
        ) : (
          <>
            <BookingDetailView booking={booking} />
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              {calendarLink && (
                <a
                  href={calendarLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <IoCalendarOutline /> Add to Google Calendar
                </a>
              )}
              <Link to="/my-bookings" className="btn-primary">
                View My Bookings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper — Google Calendar event URL
function buildGCalLink({ title, start, end, details }) {
  const fmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default PaymentSuccessPage;
