// Category model — top-level groupings of services
// (Hair, Makeup, Skincare, Nails, Waxing & Threading, Spa & Massage, Bridal Packages).

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: "" },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Auto-generate slug from name on save (e.g. "Spa & Massage" -> "spa-massage")
categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-") // This covers all non-alphanumeric chars
      .replace(/-+/g, "-") // This collapses multiple hyphens (---) into one (-)
      .replace(/^-|-$/g, ""); // This trims hyphens from the start and end
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
