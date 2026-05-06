// Review controller.
// Customer:  createReview (only for completed bookings), getMyReviews
// Public:    listServiceReviews (approved only)
// Admin:     listAllReviews, moderateReview (approve/reject), deleteReview

import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import Stylist from "../models/stylist.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

/* ──────────────── Internal: recompute average rating ──────────────── */

// Whenever a review is approved/unapproved/deleted, we recompute the
// service's avgRating & totalReviews from the SOURCE OF TRUTH (approved reviews).
async function recomputeServiceRating(serviceId) {
  const stats = await Review.aggregate([
    { $match: { service: serviceId, isApproved: true } },
    {
      $group: {
        _id: "$service",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const avgRating = stats[0]?.avg || 0;
  const totalReviews = stats[0]?.count || 0;
  await Service.findByIdAndUpdate(serviceId, { avgRating, totalReviews });
}

async function recomputeStylistRating(stylistId) {
  const stats = await Review.aggregate([
    { $match: { stylist: stylistId, isApproved: true } },
    {
      $group: {
        _id: "$stylist",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const avgRating = stats[0]?.avg || 0;
  const totalReviews = stats[0]?.count || 0;
  await Stylist.findByIdAndUpdate(stylistId, { avgRating, totalReviews });
}

/* ────────────────────── CUSTOMER: CREATE REVIEW ────────────────────── */

export const createReview = async (req, res, next) => {
  try {
    const { bookingId, serviceId, rating, comment } = req.body;

    if (!bookingId || !serviceId || !rating) {
      return sendError(
        res,
        400,
        "bookingId, serviceId and rating are required",
      );
    }
    if (rating < 1 || rating > 5) {
      return sendError(res, 400, "Rating must be between 1 and 5");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return sendError(res, 404, "Booking not found");

    // Ownership + completion check
    if (String(booking.customer) !== String(req.user._id)) {
      return sendError(res, 403, "You can only review your own bookings");
    }
    if (booking.status !== "completed") {
      return sendError(res, 400, "You can only review completed appointments");
    }
    // The service must actually be part of this booking
    const wasInBooking = booking.services.some(
      (s) => String(s.service) === String(serviceId),
    );
    if (!wasInBooking) {
      return sendError(res, 400, "That service was not part of this booking");
    }

    // Prevent duplicates
    const existing = await Review.findOne({
      customer: req.user._id,
      booking: bookingId,
      service: serviceId,
    });
    if (existing)
      return sendError(res, 400, "You've already reviewed this service");

    const review = await Review.create({
      customer: req.user._id,
      customerName: req.user.name,
      customerPhoto: req.user.profilePhoto?.url || "",
      booking: bookingId,
      service: serviceId,
      stylist: booking.stylist,
      rating,
      comment: comment || "",
      isApproved: false, // admin moderates
    });

    return sendSuccess(res, 201, "Review submitted — pending approval", review);
  } catch (error) {
    next(error);
  }
};

/* ────────────────────── CUSTOMER: MY REVIEWS ────────────────────── */

export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("service", "name images")
      .populate("stylist", "name");
    return sendSuccess(res, 200, "Reviews fetched", reviews);
  } catch (error) {
    next(error);
  }
};

/* ────────────────────── PUBLIC: REVIEWS FOR A SERVICE ────────────────── */

export const listServiceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      service: req.params.serviceId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Reviews fetched", reviews);
  } catch (error) {
    next(error);
  }
};

/* ────────────────────── ADMIN: LIST ALL REVIEWS ────────────────────── */

export const listAllReviews = async (req, res, next) => {
  try {
    const { status = "all" } = req.query; // all | pending | approved
    const filter = {};
    if (status === "pending") filter.isApproved = false;
    if (status === "approved") filter.isApproved = true;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate("service", "name")
      .populate("stylist", "name")
      .populate("customer", "name email");

    return sendSuccess(res, 200, "Reviews fetched", reviews);
  } catch (error) {
    next(error);
  }
};

/* ────────────────────── ADMIN: APPROVE / REJECT ────────────────────── */

export const moderateReview = async (req, res, next) => {
  try {
    const { action } = req.body; // "approve" | "reject"
    if (!["approve", "reject"].includes(action)) {
      return sendError(res, 400, "action must be approve or reject");
    }

    const review = await Review.findById(req.params.id);
    if (!review) return sendError(res, 404, "Review not found");

    review.isApproved = action === "approve";
    await review.save();

    // Recompute averages on both the service and the stylist
    await Promise.all([
      recomputeServiceRating(review.service),
      recomputeStylistRating(review.stylist),
    ]);

    return sendSuccess(res, 200, `Review ${action}d`, review);
  } catch (error) {
    next(error);
  }
};

/* ────────────────────── ADMIN: DELETE ────────────────────── */

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return sendError(res, 404, "Review not found");

    const wasApproved = review.isApproved;
    const serviceId = review.service;
    const stylistId = review.stylist;
    await review.deleteOne();

    // Only need to recompute if the deleted review was actually contributing
    if (wasApproved) {
      await Promise.all([
        recomputeServiceRating(serviceId),
        recomputeStylistRating(stylistId),
      ]);
    }

    return sendSuccess(res, 200, "Review deleted");
  } catch (error) {
    next(error);
  }
};
