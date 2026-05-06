// Payment model — one row per Stripe Checkout session (or manual cash payment).
// Linked one-to-one with a booking.

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true }, // dollars (or whatever currency)
    currency: { type: String, default: "usd" },

    method: {
      type: String,
      enum: ["stripe", "cash"], // cash = walk-in handled at counter
      default: "stripe",
    },

    // Stripe identifiers (null for cash payments)
    stripeSessionId: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    failureReason: { type: String, default: "" },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
