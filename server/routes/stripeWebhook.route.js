// Stripe webhook route.

// CRITICAL: This route uses express.raw() for the body parser. The raw Buffer is required by stripe.webhooks.constructEvent() to verify the signature.
// In server.js, this route is mounted BEFORE the global express.json()
// — so this raw parser only applies here.

import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhook.controller.js";

const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

export default router;
