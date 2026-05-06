// Booking controller — the heart of the app.
//
// Customer endpoints:
//   POST /api/bookings                  — create (returns Stripe checkout URL)
//   GET  /api/bookings/my               — my bookings (filter: upcoming/completed/cancelled)
//   GET  /api/bookings/:id              — single booking detail
//   PUT  /api/bookings/:id/cancel       — cancel (within allowed window)
//   PUT  /api/bookings/:id/reschedule   — pick new date/time
//
// Admin endpoints:
//   GET  /api/bookings                  — list with filters
//   PUT  /api/bookings/:id/status       — confirm / complete / cancel
//   POST /api/bookings/walk-in          — manual walk-in / phone booking
//   POST /api/bookings/:id/send-reminder— manual reminder email

import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import Stylist from "../models/stylist.model.js";
import User from "../models/user.model.js";
import Promo from "../models/promo.model.js";
import Payment from "../models/payment.model.js";
import Settings from "../models/settings.model.js";

import stripe from "../configs/stripe.config.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { generateBookingId } from "../utils/bookingId.util.js";
import {
  generateAvailableSlots,
  computeEndTime,
} from "../utils/timeSlot.util.js";
import {
  sendBookingConfirmationEmail,
  sendBookingReminderEmail,
  sendBookingStatusChangeEmail,
} from "../utils/email.util.js";
import {
  startOfDay,
  endOfDay,
  addDays,
  differenceInHours,
  format,
} from "date-fns";

/* ─────────────────────────────────────────────────────────────────
 *  Internal helper — applies a promo code and returns the final total
 *  Throws an Error with a friendly message on any validation failure
 * ───────────────────────────────────────────────────────────────── */
const applyPromoCode = async (code, subtotal) => {
  if (!code) return { total: subtotal, discount: 0, promo: null };

  const promo = await Promo.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  if (!promo) throw new Error("Invalid promo code");
  if (promo.expiryDate < new Date()) throw new Error("Promo code has expired");
  if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
    throw new Error("Promo code usage limit reached");
  }
  if (subtotal < promo.minBookingValue) {
    throw new Error(
      `Minimum booking value of $${promo.minBookingValue} required for this code`,
    );
  }

  let discount =
    promo.discountType === "percentage"
      ? (subtotal * promo.discountValue) / 100
      : promo.discountValue;

  // Cap percentage discounts if a max is set
  if (
    promo.discountType === "percentage" &&
    promo.maxDiscountAmount > 0 &&
    discount > promo.maxDiscountAmount
  ) {
    discount = promo.maxDiscountAmount;
  }
  // Never let discount exceed subtotal (would result in negative total)
  if (discount > subtotal) discount = subtotal;

  return {
    total: Math.max(0, subtotal - discount),
    discount,
    promo,
  };
};

/* ─────────────────────────────────────────────────────────────────
 *  CUSTOMER: CREATE BOOKING (returns Stripe checkout URL)
 * ───────────────────────────────────────────────────────────────── */
export const createBooking = async (req, res, next) => {
  try {
    const { serviceIds, stylistId, date, startTime, promoCode } = req.body;

    if (!serviceIds?.length || !stylistId || !date || !startTime) {
      return sendError(res, 400, "Missing required booking fields");
    }

    // Fetch in parallel
    const [services, stylist, settings, customer] = await Promise.all([
      Service.find({ _id: { $in: serviceIds }, isActive: true }),
      Stylist.findById(stylistId),
      Settings.getSingleton(),
      User.findById(req.user._id),
    ]);

    if (services.length !== serviceIds.length) {
      return sendError(res, 400, "One or more services are invalid");
    }
    if (!stylist || !stylist.isActive) {
      return sendError(res, 400, "Stylist not available");
    }

    // Stylist must be qualified for every service
    for (const s of services) {
      if (!s.assignedStylists.map(String).includes(String(stylist._id))) {
        return sendError(res, 400, `Stylist cannot perform: ${s.name}`);
      }
    }

    /* ── Compute totals & timing ──────────────────────────────── */
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const subtotal = services.reduce((sum, s) => sum + s.price, 0);

    const targetDate = new Date(date);
    const [hh, mm] = startTime.split(":").map(Number);
    const startDateTime = new Date(targetDate);
    startDateTime.setHours(hh, mm, 0, 0);
    const endDateTime = computeEndTime(startDateTime, totalDuration);

    /* ── Reject past times ────────────────────────────────────── */
    if (startDateTime <= new Date()) {
      return sendError(res, 400, "Cannot book a slot in the past");
    }

    /* ── Reject beyond advance-booking window ─────────────────── */
    const maxDate = addDays(
      new Date(),
      settings.bookingRules.advanceBookingDays,
    );
    if (startDateTime > maxDate) {
      return sendError(
        res,
        400,
        `Bookings allowed up to ${settings.bookingRules.advanceBookingDays} days ahead only`,
      );
    }

    /* ── Re-verify the slot is actually still free ────────────── */
    const existingBookings = await Booking.find({
      stylist: stylist._id,
      startTime: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: { $in: ["pending", "confirmed"] },
    }).select("startTime endTime");

    const validSlots = generateAvailableSlots({
      date: targetDate,
      stylist,
      existingBookings,
      totalDuration,
      businessHours: settings.businessHours,
      slotInterval: settings.bookingRules.slotInterval,
      cleaningGap: settings.bookingRules.cleaningGap,
    });
    if (!validSlots.includes(startTime)) {
      return sendError(res, 400, "Selected slot is no longer available");
    }

    /* ── Promo code (optional) ────────────────────────────────── */
    let total = subtotal;
    let discount = 0;
    let promo = null;
    if (promoCode) {
      try {
        ({ total, discount, promo } = await applyPromoCode(
          promoCode,
          subtotal,
        ));
      } catch (e) {
        return sendError(res, 400, e.message);
      }
    }

    /* ── Create booking (status: pending until Stripe confirms) ─ */
    const booking = await Booking.create({
      bookingId: generateBookingId(),
      customer: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      services: services.map((s) => ({
        service: s._id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      })),
      stylist: stylist._id,
      stylistName: stylist.name,
      date: startOfDay(targetDate),
      startTime: startDateTime,
      endTime: endDateTime,
      totalDuration,
      totalAmount: total,
      promoCode: promo?.code || "",
      discountAmount: discount,
      status: "pending",
    });

    /* ── Create matching pending payment row ──────────────────── */
    const payment = await Payment.create({
      booking: booking._id,
      customer: customer._id,
      amount: total,
      method: "stripe",
      status: "pending",
    });
    booking.payment = payment._id;
    await booking.save();

    /* ── Stripe Checkout session ──────────────────────────────── */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `GlowHaus Booking ${booking.bookingId}`,
              description: services.map((s) => s.name).join(", "),
            },
            unit_amount: Math.round(total * 100), // Stripe wants cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${booking.bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failure?bookingId=${booking.bookingId}`,
      // Webhook uses these to find the right booking & payment
      metadata: {
        bookingId: booking._id.toString(),
        paymentId: payment._id.toString(),
        promoId: promo?._id?.toString() || "",
      },
    });

    payment.stripeSessionId = session.id;
    await payment.save();

    return sendSuccess(res, 201, "Booking created — proceed to payment", {
      booking,
      checkoutUrl: session.url,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  CUSTOMER: MY BOOKINGS (upcoming / completed / cancelled tabs)
 * ───────────────────────────────────────────────────────────────── */
export const getMyBookings = async (req, res, next) => {
  try {
    const { tab = "upcoming" } = req.query;
    const now = new Date();
    const filter = { customer: req.user._id };

    if (tab === "upcoming") {
      filter.status = { $in: ["pending", "confirmed"] };
      filter.startTime = { $gte: now };
    } else if (tab === "completed") {
      filter.status = "completed";
    } else if (tab === "cancelled") {
      filter.status = "cancelled";
    }

    const bookings = await Booking.find(filter)
      .sort({ startTime: tab === "upcoming" ? 1 : -1 })
      .populate("payment", "status method amount");

    return sendSuccess(res, 200, "Bookings fetched", bookings);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  CUSTOMER / ADMIN: GET BOOKING BY ID
 * ───────────────────────────────────────────────────────────────── */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone profilePhoto")
      .populate("stylist", "name expertise profilePhoto")
      .populate("payment");
    if (!booking) return sendError(res, 404, "Booking not found");

    // Customers can only fetch their own
    if (
      req.user.role === "customer" &&
      String(booking.customer._id) !== String(req.user._id)
    ) {
      return sendError(res, 403, "Forbidden");
    }

    return sendSuccess(res, 200, "Booking fetched", booking);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  CUSTOMER: CANCEL BOOKING (within allowed window)
 * ───────────────────────────────────────────────────────────────── */
export const cancelMyBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return sendError(res, 404, "Booking not found");

    if (String(booking.customer) !== String(req.user._id)) {
      return sendError(res, 403, "Forbidden");
    }
    if (!["pending", "confirmed"].includes(booking.status)) {
      return sendError(res, 400, "This booking cannot be cancelled");
    }

    const settings = await Settings.getSingleton();
    const hoursLeft = differenceInHours(
      new Date(booking.startTime),
      new Date(),
    );
    if (hoursLeft < settings.bookingRules.cancellationNoticeHours) {
      return sendError(
        res,
        400,
        `Cancellations require at least ${settings.bookingRules.cancellationNoticeHours} hours notice`,
      );
    }

    booking.status = "cancelled";
    booking.cancellationReason = reason || "Cancelled by customer";
    await booking.save();

    if (settings.notifications.sendStatusChangeEmail) {
      await sendBookingStatusChangeEmail(
        booking.customerEmail,
        formatBookingForEmail(booking, settings),
        "cancelled",
      );
    }

    return sendSuccess(res, 200, "Booking cancelled", booking);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  CUSTOMER: RESCHEDULE BOOKING
 * ───────────────────────────────────────────────────────────────── */
export const rescheduleMyBooking = async (req, res, next) => {
  try {
    const { date, startTime } = req.body;
    if (!date || !startTime) {
      return sendError(res, 400, "date and startTime are required");
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return sendError(res, 404, "Booking not found");
    if (String(booking.customer) !== String(req.user._id)) {
      return sendError(res, 403, "Forbidden");
    }
    if (!["pending", "confirmed"].includes(booking.status)) {
      return sendError(res, 400, "This booking cannot be rescheduled");
    }

    const [stylist, settings] = await Promise.all([
      Stylist.findById(booking.stylist),
      Settings.getSingleton(),
    ]);
    if (!stylist || !stylist.isActive) {
      return sendError(res, 400, "Stylist no longer available");
    }

    const targetDate = new Date(date);
    const [hh, mm] = startTime.split(":").map(Number);
    const newStart = new Date(targetDate);
    newStart.setHours(hh, mm, 0, 0);
    const newEnd = computeEndTime(newStart, booking.totalDuration);

    if (newStart <= new Date()) {
      return sendError(res, 400, "Cannot reschedule into the past");
    }

    // Re-check availability — exclude THIS booking from the conflict pool
    const existingBookings = await Booking.find({
      _id: { $ne: booking._id },
      stylist: stylist._id,
      startTime: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: { $in: ["pending", "confirmed"] },
    }).select("startTime endTime");

    const validSlots = generateAvailableSlots({
      date: targetDate,
      stylist,
      existingBookings,
      totalDuration: booking.totalDuration,
      businessHours: settings.businessHours,
      slotInterval: settings.bookingRules.slotInterval,
      cleaningGap: settings.bookingRules.cleaningGap,
    });
    if (!validSlots.includes(startTime)) {
      return sendError(res, 400, "Selected slot is unavailable");
    }

    booking.date = startOfDay(targetDate);
    booking.startTime = newStart;
    booking.endTime = newEnd;
    booking.reminderSent = false; // reset — we'll re-send 24h before new time
    await booking.save();

    if (settings.notifications.sendStatusChangeEmail) {
      await sendBookingStatusChangeEmail(
        booking.customerEmail,
        formatBookingForEmail(booking, settings),
        "rescheduled",
      );
    }

    return sendSuccess(res, 200, "Booking rescheduled", booking);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  ADMIN: LIST BOOKINGS WITH FILTERS
 * ───────────────────────────────────────────────────────────────── */
export const listBookingsAdmin = async (req, res, next) => {
  try {
    const {
      status,
      stylist,
      from,
      to,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (stylist) filter.stylist = stylist;
    if (from || to) {
      filter.startTime = {};
      if (from) filter.startTime.$gte = startOfDay(new Date(from));
      if (to) filter.startTime.$lte = endOfDay(new Date(to));
    }
    if (search) {
      filter.$or = [
        { bookingId: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("customer", "name email")
        .populate("stylist", "name")
        .populate("payment", "status method"),
      Booking.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Bookings fetched", {
      bookings,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  ADMIN: UPDATE BOOKING STATUS
 *  (confirm / complete / cancel)
 * ───────────────────────────────────────────────────────────────── */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, reason, notes } = req.body;
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return sendError(res, 400, "Invalid status");
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return sendError(res, 404, "Booking not found");

    booking.status = status;
    if (status === "cancelled" && reason) booking.cancellationReason = reason;
    if (notes !== undefined) booking.notes = notes;
    await booking.save();

    const settings = await Settings.getSingleton();
    if (settings.notifications.sendStatusChangeEmail) {
      await sendBookingStatusChangeEmail(
        booking.customerEmail,
        formatBookingForEmail(booking, settings, reason),
        status,
      );
    }

    return sendSuccess(res, 200, `Booking ${status}`, booking);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  ADMIN: WALK-IN / PHONE BOOKING (manual)
 *  Customer is selected by id OR created from name/email/phone.
 *  Payment is recorded as cash, status goes straight to confirmed.
 * ───────────────────────────────────────────────────────────────── */
export const createWalkInBooking = async (req, res, next) => {
  try {
    const {
      customerId,
      newCustomer, // { name, email, phone } if customerId not given
      serviceIds,
      stylistId,
      date,
      startTime,
      notes,
    } = req.body;

    /* ── Resolve / create customer ─────────────────────────── */
    let customer;
    if (customerId) {
      customer = await User.findById(customerId);
    } else if (newCustomer?.email) {
      customer = await User.findOne({ email: newCustomer.email.toLowerCase() });
      if (!customer) {
        // Random throwaway password — customer can do "forgot password" later
        const tempPass = Math.random().toString(36).slice(2, 12);
        const { hashPassword } = await import("../utils/password.util.js");
        customer = await User.create({
          name: newCustomer.name,
          email: newCustomer.email.toLowerCase(),
          phone: newCustomer.phone || "",
          password: await hashPassword(tempPass),
          role: "customer",
        });
      }
    }
    if (!customer) {
      return sendError(res, 400, "Customer info is required");
    }

    /* ── Validate services + stylist ─────────────────────── */
    const [services, stylist, settings] = await Promise.all([
      Service.find({ _id: { $in: serviceIds }, isActive: true }),
      Stylist.findById(stylistId),
      Settings.getSingleton(),
    ]);
    if (services.length !== serviceIds.length) {
      return sendError(res, 400, "Invalid services");
    }
    if (!stylist || !stylist.isActive) {
      return sendError(res, 400, "Stylist unavailable");
    }

    /* ── Compute totals & timings ────────────────────────── */
    const totalDuration = services.reduce((s, sv) => s + sv.duration, 0);
    const total = services.reduce((s, sv) => s + sv.price, 0);

    const targetDate = new Date(date);
    const [hh, mm] = startTime.split(":").map(Number);
    const startDT = new Date(targetDate);
    startDT.setHours(hh, mm, 0, 0);
    const endDT = computeEndTime(startDT, totalDuration);

    /* ── Create booking + cash payment ───────────────────── */
    const booking = await Booking.create({
      bookingId: generateBookingId(),
      customer: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      services: services.map((s) => ({
        service: s._id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      })),
      stylist: stylist._id,
      stylistName: stylist.name,
      date: startOfDay(targetDate),
      startTime: startDT,
      endTime: endDT,
      totalDuration,
      totalAmount: total,
      status: "confirmed", // walk-ins go straight to confirmed
      isWalkIn: true,
      notes: notes || "",
    });

    const payment = await Payment.create({
      booking: booking._id,
      customer: customer._id,
      amount: total,
      method: "cash",
      status: "succeeded",
      paidAt: new Date(),
    });
    booking.payment = payment._id;
    await booking.save();

    if (settings.notifications.sendBookingConfirmation) {
      await sendBookingConfirmationEmail(
        customer.email,
        formatBookingForEmail(booking, settings),
      );
    }

    return sendSuccess(res, 201, "Walk-in booking created", booking);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  ADMIN: SEND REMINDER EMAIL MANUALLY
 * ───────────────────────────────────────────────────────────────── */
export const sendManualReminder = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return sendError(res, 404, "Booking not found");

    const settings = await Settings.getSingleton();
    await sendBookingReminderEmail(
      booking.customerEmail,
      formatBookingForEmail(booking, settings),
    );
    booking.reminderSent = true;
    await booking.save();

    return sendSuccess(res, 200, "Reminder sent");
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────────────────────
 *  Internal helper — shape a booking for the email helpers
 * ───────────────────────────────────────────────────────────────── */
function formatBookingForEmail(booking, settings, reason) {
  return {
    bookingId: booking.bookingId,
    customerName: booking.customerName,
    stylistName: booking.stylistName,
    services: booking.services,
    date: format(new Date(booking.startTime), "EEE, MMM d yyyy"),
    startTime: format(new Date(booking.startTime), "h:mm a"),
    totalAmount: booking.totalAmount.toFixed(2),
    cancellationNoticeHours: settings.bookingRules.cancellationNoticeHours,
    reason,
  };
}
