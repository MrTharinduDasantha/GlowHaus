// Category controller — CRUD for service categories.
// Public:    listCategories, getCategoryBySlug
// Admin:     createCategory, updateCategory, deleteCategory

import Category from "../models/category.model.js";
import Service from "../models/service.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";

/* ───────────────────────── PUBLIC: LIST ───────────────────────── */

export const listCategories = async (req, res, next) => {
  try {
    // ?activeOnly=true returns only active ones (used on the public site)
    const filter = req.query.activeOnly === "true" ? { isActive: true } : {};
    const categories = await Category.find(filter).sort({ name: 1 });
    return sendSuccess(res, 200, "Categories fetched", categories);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────────── PUBLIC: BY SLUG ───────────────────────── */

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return sendError(res, 404, "Category not found");
    return sendSuccess(res, 200, "Category fetched", category);
  } catch (error) {
    next(error);
  }
};

/* ──────────────────────── ADMIN: CREATE ──────────────────────── */

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return sendError(res, 400, "Category name is required");

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return sendError(res, 400, "Category already exists");

    let image = { url: "", publicId: "" };
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, "glowhaus/categories");
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
      image,
    });

    return sendSuccess(res, 201, "Category created", category);
  } catch (error) {
    next(error);
  }
};

/* ──────────────────────── ADMIN: UPDATE ──────────────────────── */

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 404, "Category not found");

    // Renaming — ensure uniqueness
    if (name && name.trim() !== category.name) {
      const taken = await Category.findOne({ name: name.trim() });
      if (taken)
        return sendError(res, 400, "Another category with that name exists");
      category.name = name.trim(); // pre-save hook will regenerate slug
    }

    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    // Image swap — upload new, delete old
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "glowhaus/categories",
      );
      if (category.image?.publicId) {
        await deleteFromCloudinary(category.image.publicId);
      }
      category.image = uploaded;
    }

    await category.save();
    return sendSuccess(res, 200, "Category updated", category);
  } catch (error) {
    next(error);
  }
};

/* ──────────────────────── ADMIN: DELETE ──────────────────────── */

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 404, "Category not found");

    // Block deletion if any service still belongs to this category
    const inUse = await Service.countDocuments({ category: category._id });
    if (inUse > 0) {
      return sendError(
        res,
        400,
        `Cannot delete — ${inUse} service(s) still belong to this category`,
      );
    }

    if (category.image?.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }
    await category.deleteOne();

    return sendSuccess(res, 200, "Category deleted");
  } catch (error) {
    next(error);
  }
};
