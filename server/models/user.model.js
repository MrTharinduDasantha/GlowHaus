// User model — covers BOTH customers and admins via a `role` field.
// Profile photo lives on Cloudinary, so we store both the secure URL
// (for <img src=...>) and the publicId (so we can delete it later).

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned by default — explicit .select("+password") needed
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    profilePhoto: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
