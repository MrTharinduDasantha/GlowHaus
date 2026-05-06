// Single shared Stripe client instance.
// Imported by payment.controller.js and stripeWebhook.controller.js.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // pin API version for predictable behaviour
});

export default stripe;
