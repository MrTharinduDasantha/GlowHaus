// Promo code model — admin-created discount codes that customers apply at checkout.

import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String, default: "" },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    // For percentage: 10 means 10% off. For fixed: 10 means $10 off.
    discountValue: { type: Number, required: true, min: 0 },

    minBookingValue: { type: Number, default: 0 }, // cart total must reach this
    maxDiscountAmount: { type: Number, default: 0 }, // cap for percentage codes (0 = no cap)

    expiryDate: { type: Date, required: true },

    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Promo = mongoose.model("Promo", promoSchema);
export default Promo;
