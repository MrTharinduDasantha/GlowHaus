// Review model — created by customers after a booking is marked "completed".
// Reviews are pending until an admin approves them.

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String, required: true }, // snapshot for display
    customerPhoto: { type: String, default: "" }, // snapshot URL

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    // A review primarily belongs to a service, but we also track which stylist served it so stylist average ratings work too.
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    stylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stylist",
      required: true,
    },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },

    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// One review per (customer, booking, service) — prevents duplicates
reviewSchema.index({ customer: 1, booking: 1, service: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
