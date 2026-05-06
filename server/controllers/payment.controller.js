// Payment controller — listing payments for both customer and admin.
// Stripe checkout session is created inside booking.controller.js
// s(so booking + payment + Stripe session stay in sync).

import Payment from "../models/payment.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

/* ────────── CUSTOMER: MY PAYMENTS ────────── */

export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate(
        "booking",
        "bookingId startTime stylistName status totalAmount",
      );
    return sendSuccess(res, 200, "Payments fetched", payments);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: LIST ALL ────────── */

export const listAllPayments = async (req, res, next) => {
  try {
    const { status, method, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;

    const skip = (Number(page) - 1) * Number(limit);
    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("customer", "name email")
        .populate("booking", "bookingId startTime stylistName status"),
      Payment.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Payments fetched", {
      payments,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: GET PAYMENT BY ID ────────── */

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("booking");
    if (!payment) return sendError(res, 404, "Payment not found");
    return sendSuccess(res, 200, "Payment fetched", payment);
  } catch (error) {
    next(error);
  }
};
