// Stripe webhook handler — fired by Stripe when a payment event occurs.
//
// IMPORTANT: this route MUST be mounted with express.raw({ type: "application/json" })
// — see server.js — because Stripe's signature verification needs the raw body.
//
// Events handled:
//   checkout.session.completed   -> mark payment succeeded + booking confirmed
//   checkout.session.expired     -> mark payment failed + booking cancelled
//   payment_intent.payment_failed -> mark payment failed

import stripe from "../configs/stripe.config.js";
import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import Promo from "../models/promo.model.js";
import Settings from "../models/settings.model.js";
import { sendBookingConfirmationEmail } from "../utils/email.util.js";
import { format } from "date-fns";

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  // 1) Verify signature against the raw body
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw Buffer — DO NOT parse before this!
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      /* ──────── Successful payment ──────── */
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId, paymentId, promoId } = session.metadata || {};

        const [payment, booking] = await Promise.all([
          Payment.findById(paymentId),
          Booking.findById(bookingId),
        ]);
        if (!payment || !booking) break;

        // Idempotency — skip if we've already processed this session
        if (payment.status === "succeeded") break;

        payment.status = "succeeded";
        payment.stripePaymentIntentId = session.payment_intent || "";
        payment.paidAt = new Date();
        await payment.save();

        booking.status = "confirmed";
        await booking.save();

        // Increment promo usage if one was applied
        if (promoId) {
          await Promo.findByIdAndUpdate(promoId, { $inc: { usedCount: 1 } });
        }

        // Send confirmation email
        const settings = await Settings.getSingleton();
        if (settings.notifications.sendBookingConfirmation) {
          await sendBookingConfirmationEmail(booking.customerEmail, {
            bookingId: booking.bookingId,
            customerName: booking.customerName,
            stylistName: booking.stylistName,
            services: booking.services,
            date: format(new Date(booking.startTime), "EEE, MMM d yyyy"),
            startTime: format(new Date(booking.startTime), "h:mm a"),
            totalAmount: booking.totalAmount.toFixed(2),
            cancellationNoticeHours:
              settings.bookingRules.cancellationNoticeHours,
          });
        }
        break;
      }

      /* ──────── Customer abandoned the checkout ──────── */
      case "checkout.session.expired": {
        const session = event.data.object;
        const { bookingId, paymentId } = session.metadata || {};
        await Payment.findByIdAndUpdate(paymentId, {
          status: "failed",
          failureReason: "Checkout session expired",
        });
        await Booking.findByIdAndUpdate(bookingId, {
          status: "cancelled",
          cancellationReason: "Payment not completed",
        });
        break;
      }

      /* ──────── Payment intent failed ──────── */
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          {
            status: "failed",
            failureReason:
              intent.last_payment_error?.message || "Payment failed",
          },
        );
        break;
      }

      default:
        // Other events ignored
        break;
    }

    // Always 200 so Stripe doesn't retry
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return res.status(500).json({ received: false });
  }
};
