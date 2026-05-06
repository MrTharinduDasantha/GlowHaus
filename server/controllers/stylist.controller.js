// Stylist controller.
// Public:    listStylists, getStylistById (with services they perform)
// Admin:     createStylist, updateStylist, deleteStylist, toggleStylistStatus

import Stylist from "../models/stylist.model.js";
import Service from "../models/service.model.js";
import Booking from "../models/booking.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";

/* ───────────────────── PUBLIC: LIST ───────────────────── */

export const listStylists = async (req, res, next) => {
  try {
    const { activeOnly = "true" } = req.query;
    const filter = activeOnly === "true" ? { isActive: true } : {};
    const stylists = await Stylist.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Stylists fetched", stylists);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── PUBLIC: GET BY ID + SERVICES ───────────────────── */

export const getStylistById = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return sendError(res, 404, "Stylist not found");

    // Services this stylist is qualified to perform
    const services = await Service.find({
      assignedStylists: stylist._id,
      isActive: true,
    }).populate("category", "name slug");

    return sendSuccess(res, 200, "Stylist fetched", { stylist, services });
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: CREATE ───────────────────── */

export const createStylist = async (req, res, next) => {
  try {
    const { name, expertise, bio, email, phone, workingHours, daysOff } =
      req.body;

    if (!name || !expertise || !email) {
      return sendError(res, 400, "Name, expertise and email are required");
    }

    let profilePhoto = { url: "", publicId: "" };
    if (req.file) {
      profilePhoto = await uploadToCloudinary(
        req.file.buffer,
        "glowhaus/stylists",
      );
    }

    // workingHours / daysOff arrive as JSON strings from FormData
    const parsedHours = parseJson(workingHours);
    const parsedDaysOff = parseJson(daysOff);

    const stylist = await Stylist.create({
      name,
      expertise,
      bio: bio || "",
      email: email.toLowerCase(),
      phone: phone || "",
      profilePhoto,
      ...(parsedHours ? { workingHours: parsedHours } : {}),
      ...(parsedDaysOff ? { daysOff: parsedDaysOff } : {}),
    });

    return sendSuccess(res, 201, "Stylist created", stylist);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: UPDATE ───────────────────── */

export const updateStylist = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return sendError(res, 404, "Stylist not found");

    const {
      name,
      expertise,
      bio,
      email,
      phone,
      workingHours,
      daysOff,
      isActive,
    } = req.body;

    if (name) stylist.name = name;
    if (expertise) stylist.expertise = expertise;
    if (bio !== undefined) stylist.bio = bio;
    if (email) stylist.email = email.toLowerCase();
    if (phone !== undefined) stylist.phone = phone;
    if (isActive !== undefined)
      stylist.isActive = isActive === "true" || isActive === true;

    const parsedHours = parseJson(workingHours);
    if (parsedHours) stylist.workingHours = parsedHours;
    const parsedDaysOff = parseJson(daysOff);
    if (parsedDaysOff) stylist.daysOff = parsedDaysOff;

    // Profile photo swap
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "glowhaus/stylists",
      );
      if (stylist.profilePhoto?.publicId) {
        await deleteFromCloudinary(stylist.profilePhoto.publicId);
      }
      stylist.profilePhoto = uploaded;
    }

    await stylist.save();
    return sendSuccess(res, 200, "Stylist updated", stylist);
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: DELETE ───────────────────── */

export const deleteStylist = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return sendError(res, 404, "Stylist not found");

    // Block delete if there are upcoming bookings — protect customer experience
    const upcoming = await Booking.countDocuments({
      stylist: stylist._id,
      status: { $in: ["pending", "confirmed"] },
      startTime: { $gte: new Date() },
    });
    if (upcoming > 0) {
      return sendError(
        res,
        400,
        `Cannot delete — ${upcoming} upcoming booking(s) assigned to this stylist`,
      );
    }

    // Pull this stylist out of every service that referenced them
    await Service.updateMany(
      { assignedStylists: stylist._id },
      { $pull: { assignedStylists: stylist._id } },
    );

    if (stylist.profilePhoto?.publicId) {
      await deleteFromCloudinary(stylist.profilePhoto.publicId);
    }
    await stylist.deleteOne();

    return sendSuccess(res, 200, "Stylist deleted");
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── ADMIN: TOGGLE ACTIVE ───────────────────── */

export const toggleStylistStatus = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return sendError(res, 404, "Stylist not found");
    stylist.isActive = !stylist.isActive;
    await stylist.save();
    return sendSuccess(
      res,
      200,
      `Stylist ${stylist.isActive ? "activated" : "deactivated"}`,
      stylist,
    );
  } catch (error) {
    next(error);
  }
};

/* ───────────────────── helper ───────────────────── */
function parseJson(value) {
  if (!value) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
