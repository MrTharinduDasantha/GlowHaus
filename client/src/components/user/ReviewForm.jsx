// Inline form for writing a review on a completed booking.
// Receives bookingId + serviceId + serviceName as props.

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import RatingStars from "../common/RatingStars.jsx";
import { reviewApi } from "../../api/review.api.js";

const ReviewForm = ({ bookingId, serviceId, serviceName, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please choose a rating");
    setSubmitting(true);
    try {
      await reviewApi.create({ bookingId, serviceId, rating, comment });
      toast.success("Review submitted — pending approval");
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-bg-surface border border-line-soft rounded-xl"
    >
      <p className="eyebrow text-rose-gold mb-2">Review</p>
      <h4 className="font-display text-xl text-text-primary mb-4">
        How was your <span className="text-rose-gold">{serviceName}</span>?
      </h4>

      <label className="block text-sm text-text-secondary mb-1.5">Rating</label>
      <RatingStars value={rating} onChange={setRating} size={26} />

      <label className="block text-sm text-text-secondary mt-4 mb-1.5">
        Comments (optional)
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Share what made the experience special…"
        className="input-luxe resize-none"
      />
      <p className="text-xs text-text-muted text-right mt-1">
        {comment.length}/500
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-3 w-full sm:w-auto"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </motion.form>
  );
};

export default ReviewForm;
