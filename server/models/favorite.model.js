// Favorite model — saved services per customer.
// One row per (customer, service) pair.

import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true },
);

// Compound unique index — a customer can't favorite the same service twice
favoriteSchema.index({ customer: 1, service: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
