// Promo code controller.
// Customer:  validatePromo (preview discount before checkout)
// Admin:     CRUD promo codes

import Promo from "../models/promo.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

/* ────────── CUSTOMER: VALIDATE PROMO ────────── */

export const validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined) {
      return sendError(res, 400, "code and subtotal are required");
    }

    const promo = await Promo.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
    if (!promo) return sendError(res, 404, "Invalid promo code");
    if (promo.expiryDate < new Date()) {
      return sendError(res, 400, "Promo code has expired");
    }
    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
      return sendError(res, 400, "Promo code usage limit reached");
    }
    if (Number(subtotal) < promo.minBookingValue) {
      return sendError(
        res,
        400,
        `Minimum booking value of $${promo.minBookingValue} required`,
      );
    }

    // Compute the would-be discount (preview only — not persisted)
    let discount =
      promo.discountType === "percentage"
        ? (Number(subtotal) * promo.discountValue) / 100
        : promo.discountValue;
    if (
      promo.discountType === "percentage" &&
      promo.maxDiscountAmount > 0 &&
      discount > promo.maxDiscountAmount
    ) {
      discount = promo.maxDiscountAmount;
    }
    if (discount > Number(subtotal)) discount = Number(subtotal);

    return sendSuccess(res, 200, "Promo applied", {
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discount,
      newTotal: Math.max(0, Number(subtotal) - discount),
    });
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: LIST ────────── */

export const listPromos = async (req, res, next) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Promos fetched", promos);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: CREATE ────────── */

export const createPromo = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minBookingValue,
      maxDiscountAmount,
      expiryDate,
      usageLimit,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return sendError(res, 400, "Missing required fields");
    }
    if (!["percentage", "fixed"].includes(discountType)) {
      return sendError(res, 400, "discountType must be percentage or fixed");
    }
    if (
      discountType === "percentage" &&
      (discountValue < 0 || discountValue > 100)
    ) {
      return sendError(res, 400, "Percentage must be 0-100");
    }

    const exists = await Promo.findOne({ code: code.toUpperCase() });
    if (exists) return sendError(res, 400, "Promo code already exists");

    const promo = await Promo.create({
      code: code.toUpperCase(),
      description: description || "",
      discountType,
      discountValue: Number(discountValue),
      minBookingValue: Number(minBookingValue) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 0,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit) || 0,
    });

    return sendSuccess(res, 201, "Promo created", promo);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE ────────── */

export const updatePromo = async (req, res, next) => {
  try {
    const promo = await Promo.findById(req.params.id);
    if (!promo) return sendError(res, 404, "Promo not found");

    const fields = [
      "description",
      "discountType",
      "discountValue",
      "minBookingValue",
      "maxDiscountAmount",
      "expiryDate",
      "usageLimit",
      "isActive",
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        promo[f] = f === "expiryDate" ? new Date(req.body[f]) : req.body[f];
      }
    }
    await promo.save();
    return sendSuccess(res, 200, "Promo updated", promo);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: DELETE ────────── */

export const deletePromo = async (req, res, next) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) return sendError(res, 404, "Promo not found");
    return sendSuccess(res, 200, "Promo deleted");
  } catch (error) {
    next(error);
  }
};
