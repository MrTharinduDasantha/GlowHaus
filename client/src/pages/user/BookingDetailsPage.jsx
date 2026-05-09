// Single booking detail + post-completion review form.

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import BookingDetailView from "../../components/user/BookingDetailView.jsx";
import ReviewForm from "../../components/user/ReviewForm.jsx";
import Loader from "../../components/common/Loader.jsx";
import { bookingApi } from "../../api/booking.api.js";
import { reviewApi } from "../../api/review.api.js";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myReviews, setMyReviews] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([
        bookingApi.getById(id),
        reviewApi.getMy(),
      ]);
      setBooking(b.data.data);
      setMyReviews(r.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(); /* eslint-disable-next-line */
  }, [id]);

  if (loading || !booking) return;

  // Has the customer already reviewed this service for this booking?
  const hasReviewed = (serviceId) =>
    myReviews.some(
      (r) =>
        String(r.booking?._id || r.booking) === String(booking._id) &&
        String(r.service?._id || r.service) === String(serviceId),
    );

  const reviewable = booking.status === "completed";

  return (
    <div className="container-luxe py-12 md:py-16 max-w-3xl">
      <Link
        to="/my-bookings"
        className="inline-flex items-center gap-2 text-sm text-rose-gold hover:underline mb-6"
      >
        <IoArrowBack /> Back to my bookings
      </Link>

      <BookingDetailView booking={booking} />

      {/* Review forms — one per service in the booking */}
      {reviewable && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 space-y-4"
        >
          <p className="eyebrow text-rose-gold">Share your experience</p>
          {booking.services.map((s) => {
            const sid = s.service?._id || s.service;
            if (hasReviewed(sid)) {
              return (
                <div
                  key={sid}
                  className="p-4 bg-bg-surface border border-line-soft rounded-xl text-sm text-text-secondary"
                >
                  ✓ You've reviewed{" "}
                  <span className="text-rose-gold">{s.name}</span>
                </div>
              );
            }
            return (
              <ReviewForm
                key={sid}
                bookingId={booking._id}
                serviceId={sid}
                serviceName={s.name}
                onSubmitted={fetchAll}
              />
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default BookingDetailsPage;
