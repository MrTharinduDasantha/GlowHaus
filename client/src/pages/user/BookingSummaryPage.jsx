// Step 3 — final review + Stripe checkout redirect.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoArrowBack, IoLockClosedOutline } from "react-icons/io5";

import StepIndicator from "../../components/common/StepIndicator.jsx";
import BookingSummary from "../../components/user/BookingSummary.jsx";
import { bookingApi } from "../../api/booking.api.js";
import {
  selectBagItems,
  selectBagDuration,
  clearBag,
} from "../../app/features/bagSlice.js";
import { resetBooking } from "../../app/features/bookingSlice.js";

const steps = ["Service Bag", "Date & Stylist", "Confirm & Pay"];

const BookingSummaryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectBagItems);
  const totalDuration = useSelector(selectBagDuration);
  const { selectedStylist, selectedDate, selectedTime, promo } = useSelector(
    (s) => s.booking,
  );

  const [submitting, setSubmitting] = useState(false);

  // Guard — if state is incomplete, kick back
  if (!items.length || !selectedStylist || !selectedDate || !selectedTime) {
    return (
      <div className="container-luxe py-16 text-center">
        <p className="text-text-muted mb-4">Booking details missing.</p>
        <Link to="/bag" className="btn-primary">
          Start Again
        </Link>
      </div>
    );
  }

  const handlePay = async () => {
    setSubmitting(true);
    try {
      const res = await bookingApi.create({
        serviceIds: items.map((i) => i._id),
        stylistId: selectedStylist._id,
        date: selectedDate,
        startTime: selectedTime,
        promoCode: promo?.code,
      });
      // Persist what we need on the success page even if Stripe redirect is slow
      const checkoutUrl = res.data.data.checkoutUrl;
      // Server will mark the booking confirmed via webhook; we wipe local state now
      dispatch(clearBag());
      dispatch(resetBooking());
      // Redirect to Stripe
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(err.userMessage || "Failed to create booking");
      setSubmitting(false);
    }
  };

  return (
    <div className="container-luxe py-12 md:py-16">
      <StepIndicator steps={steps} current={3} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <BookingSummary
            bagItems={items}
            stylist={selectedStylist}
            date={selectedDate}
            time={selectedTime}
            promo={promo}
            totalDuration={totalDuration}
          />
        </div>

        {/* Pay panel */}
        <div className="space-y-4">
          <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
            <p className="eyebrow text-rose-gold mb-3">Payment</p>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              You'll be redirected to Stripe to complete payment securely. Your
              booking is held while you check out.
            </p>
            <button
              disabled={submitting}
              onClick={handlePay}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <IoLockClosedOutline />
              {submitting ? "Redirecting…" : "Pay & Confirm Booking"}
            </button>
            <p className="text-xs text-text-muted text-center mt-3">
              Powered by Stripe · 256-bit encryption
            </p>
          </div>

          <Link
            to="/booking/datetime"
            className="text-sm text-text-secondary hover:text-rose-gold inline-flex items-center gap-1.5"
          >
            <IoArrowBack /> Change date or stylist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryPage;
