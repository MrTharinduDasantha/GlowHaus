// Favorite controller — saved services per customer.

import Favorite from "../models/favorite.model.js";
import Service from "../models/service.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

/* ────────── LIST MY FAVORITES (with populated service info) ────────── */

export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "service",
        populate: { path: "category", select: "name slug" },
      });
    return sendSuccess(res, 200, "Favorites fetched", favorites);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADD FAVORITE ────────── */

export const addFavorite = async (req, res, next) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) return sendError(res, 400, "serviceId is required");

    const service = await Service.findById(serviceId);
    if (!service) return sendError(res, 404, "Service not found");

    // Idempotent: if it already exists, just return success
    const existing = await Favorite.findOne({
      customer: req.user._id,
      service: serviceId,
    });
    if (existing) {
      return sendSuccess(res, 200, "Already in favorites", existing);
    }

    const favorite = await Favorite.create({
      customer: req.user._id,
      service: serviceId,
    });
    return sendSuccess(res, 201, "Added to favorites", favorite);
  } catch (error) {
    next(error);
  }
};

/* ────────── REMOVE FAVORITE ────────── */

export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      customer: req.user._id,
      service: req.params.serviceId,
    });
    if (!favorite) return sendError(res, 404, "Favorite not found");
    return sendSuccess(res, 200, "Removed from favorites");
  } catch (error) {
    next(error);
  }
};
