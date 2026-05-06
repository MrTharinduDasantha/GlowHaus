// Gallery model — admin-curated albums of images.
// Albums: Salon ambience, Before/After transformations, Bridal looks, Nail art, etc.
// Images are embedded so one album = one document.

import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

const gallerySchema = new mongoose.Schema(
  {
    albumName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    images: [galleryImageSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
