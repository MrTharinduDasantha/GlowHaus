// Service controller.
// Public:    listServices (search/filter), getServiceById, getFeaturedServices
// Admin:     createService, updateService, deleteService, assignStylists, toggleServiceStatus, toggleFeatured

import Service from "../models/service.model.js";
import Category from "../models/category.model.js";
import Stylist from "../models/stylist.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";

/* ───────────────────── PUBLIC: LIST WITH FILTERS ──────────────────── */

export const listServices = async (req, res, next) => {
  try {
    const {
      search = "",
      category, // id OR slug
      minPrice,
      maxPrice,
      sort = "newest", // newest | priceAsc | priceDesc | rating
      page = 1,
      limit = 12,
      activeOnly = "true",
    } = req.query;

    /* ── Build filter ──────────────────────────────────────────── */
    const filter = {};
    if (activeOnly === "true") filter.isActive = true;

    // Category — accept either id or slug for convenience
    if (category) {
      const categoryDoc = category.match(/^[0-9a-fA-F]{24}$/)
        ? await Category.findById(category)
        : await Category.findOne({ slug: category });
      if (categoryDoc) filter.category = categoryDoc._id;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search by name (case-insensitive) — keep simple, avoid $text quirks
    if (search) filter.name = { $regex: search, $options: "i" };

    /* ── Sort map ─────────────────────────────────────────────── */
    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      rating: { avgRating: -1 },
    };

    /* ── Query + pagination ───────────────────────────────────── */
    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate("category", "name slug")
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Services fetched", {
      services,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── PUBLIC: FEATURED ──────────────────── */

export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .limit(8)
      .sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Featured services fetched", services);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── PUBLIC: GET BY ID ──────────────────── */

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name slug")
      .populate(
        "assignedStylists",
        "name expertise profilePhoto avgRating totalReviews isActive",
      );

    if (!service) return sendError(res, 404, "Service not found");
    return sendSuccess(res, 200, "Service fetched", service);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: CREATE ──────────────────── */

export const createService = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      shortDescription,
      benefits,
      price,
      duration,
      isFeatured,
    } = req.body;

    if (!name || !category || !description || !price || !duration) {
      return sendError(res, 400, "Required fields missing");
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) return sendError(res, 400, "Invalid category");

    // Multiple images via uploadMultiple("images", N) — req.files is an array
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "glowhaus/services")),
      );
    }

    // benefits arrives as JSON string from FormData — parse safely
    let parsedBenefits = [];
    if (benefits) {
      try {
        parsedBenefits =
          typeof benefits === "string" ? JSON.parse(benefits) : benefits;
      } catch {
        parsedBenefits = [];
      }
    }

    const service = await Service.create({
      name,
      category,
      description,
      shortDescription: shortDescription || "",
      benefits: parsedBenefits,
      price: Number(price),
      duration: Number(duration),
      images,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    return sendSuccess(res, 201, "Service created", service);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: UPDATE ──────────────────── */

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return sendError(res, 404, "Service not found");

    const {
      name,
      category,
      description,
      shortDescription,
      benefits,
      price,
      duration,
      isActive,
      isFeatured,
      removeImageIds, // JSON string array of publicIds to remove
    } = req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (shortDescription !== undefined)
      service.shortDescription = shortDescription;
    if (price) service.price = Number(price);
    if (duration) service.duration = Number(duration);
    if (isActive !== undefined)
      service.isActive = isActive === "true" || isActive === true;
    if (isFeatured !== undefined)
      service.isFeatured = isFeatured === "true" || isFeatured === true;

    // Category change must point to a real category
    if (category && category !== String(service.category)) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) return sendError(res, 400, "Invalid category");
      service.category = category;
    }

    if (benefits) {
      try {
        service.benefits =
          typeof benefits === "string" ? JSON.parse(benefits) : benefits;
      } catch {
        /* keep old benefits */
      }
    }

    // Remove flagged images (delete from Cloudinary + filter out of array)
    if (removeImageIds) {
      let toRemove = [];
      try {
        toRemove =
          typeof removeImageIds === "string"
            ? JSON.parse(removeImageIds)
            : removeImageIds;
      } catch {
        toRemove = [];
      }
      for (const pid of toRemove) await deleteFromCloudinary(pid);
      service.images = service.images.filter(
        (img) => !toRemove.includes(img.publicId),
      );
    }

    // Append any newly uploaded images
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "glowhaus/services")),
      );
      service.images.push(...uploaded);
    }

    await service.save();
    return sendSuccess(res, 200, "Service updated", service);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: DELETE ──────────────────── */

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return sendError(res, 404, "Service not found");

    // Clean up Cloudinary images
    for (const img of service.images || []) {
      await deleteFromCloudinary(img.publicId);
    }
    await service.deleteOne();

    return sendSuccess(res, 200, "Service deleted");
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: ASSIGN STYLISTS ──────────────────── */

export const assignStylists = async (req, res, next) => {
  try {
    const { stylistIds } = req.body; // array of stylist _ids
    if (!Array.isArray(stylistIds)) {
      return sendError(res, 400, "stylistIds must be an array");
    }

    const service = await Service.findById(req.params.id);
    if (!service) return sendError(res, 404, "Service not found");

    // Verify every id refers to an active stylist (silently drop bad ids)
    const validStylists = await Stylist.find({
      _id: { $in: stylistIds },
      isActive: true,
    }).select("_id");
    service.assignedStylists = validStylists.map((s) => s._id);

    await service.save();
    return sendSuccess(res, 200, "Stylists assigned", service);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: TOGGLES ──────────────────── */

export const toggleServiceStatus = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return sendError(res, 404, "Service not found");
    service.isActive = !service.isActive;
    await service.save();
    return sendSuccess(
      res,
      200,
      `Service ${service.isActive ? "activated" : "deactivated"}`,
      service,
    );
  } catch (error) {
    next(error);
  }
};

export const toggleFeatured = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return sendError(res, 404, "Service not found");
    service.isFeatured = !service.isFeatured;
    await service.save();
    return sendSuccess(
      res,
      200,
      `Service ${service.isFeatured ? "featured" : "unfeatured"}`,
      service,
    );
  } catch (error) {
    next(error);
  }
};
