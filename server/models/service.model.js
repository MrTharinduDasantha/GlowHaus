// Service model — an individual offering (e.g. "Keratin Smoothing Treatment").
// Has 1..N images, belongs to a category, and references the stylists
// who are qualified to perform it.

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" }, // shown on service cards
    benefits: [{ type: String }], // bullet points on detail page

    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 5 }, // minutes

    // Multiple images: first one is the cover; the rest fill out the gallery
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    // Stylists qualified to perform this service
    assignedStylists: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Stylist" },
    ],

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }, // shown on landing page

    // Aggregated review stats
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Quick text search across name + descriptions
serviceSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
