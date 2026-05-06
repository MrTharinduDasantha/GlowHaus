// Gallery controller — albums (Salon ambience, Before/After, Bridal, Nail Art).
// Public:    listAlbums, getAlbumById
// Admin:     CRUD albums + add/remove individual images inside an album

import Gallery from "../models/gallery.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";

/* ────────── PUBLIC: LIST ALBUMS ────────── */

export const listAlbums = async (req, res, next) => {
  try {
    const albums = await Gallery.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return sendSuccess(res, 200, "Albums fetched", albums);
  } catch (error) {
    next(error);
  }
};

/* ────────── PUBLIC / ADMIN: GET ALBUM BY ID ────────── */

export const getAlbumById = async (req, res, next) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) return sendError(res, 404, "Album not found");
    return sendSuccess(res, 200, "Album fetched", album);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: CREATE ALBUM (with optional initial images) ────────── */

export const createAlbum = async (req, res, next) => {
  try {
    const { albumName, description } = req.body;
    if (!albumName) return sendError(res, 400, "albumName is required");

    // Upload all attached images
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "glowhaus/gallery")),
      );
      images = uploaded.map((u) => ({ ...u, title: "", description: "" }));
    }

    const album = await Gallery.create({
      albumName,
      description: description || "",
      coverImage: images[0]
        ? { url: images[0].url, publicId: images[0].publicId }
        : { url: "", publicId: "" },
      images,
    });

    return sendSuccess(res, 201, "Album created", album);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE ALBUM META ────────── */

export const updateAlbum = async (req, res, next) => {
  try {
    const { albumName, description, isActive } = req.body;
    const album = await Gallery.findById(req.params.id);
    if (!album) return sendError(res, 404, "Album not found");

    if (albumName) album.albumName = albumName;
    if (description !== undefined) album.description = description;
    if (isActive !== undefined) {
      album.isActive = isActive === "true" || isActive === true;
    }
    await album.save();
    return sendSuccess(res, 200, "Album updated", album);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: DELETE ALBUM (and all its images) ────────── */

export const deleteAlbum = async (req, res, next) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) return sendError(res, 404, "Album not found");
    for (const img of album.images || []) {
      await deleteFromCloudinary(img.publicId);
    }
    await album.deleteOne();
    return sendSuccess(res, 200, "Album deleted");
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: ADD IMAGES TO ALBUM ────────── */

export const addImagesToAlbum = async (req, res, next) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) return sendError(res, 404, "Album not found");
    if (!req.files || req.files.length === 0) {
      return sendError(res, 400, "No images uploaded");
    }

    const uploaded = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer, "glowhaus/gallery")),
    );
    const newImages = uploaded.map((u) => ({
      ...u,
      title: "",
      description: "",
    }));
    album.images.push(...newImages);

    // Set cover image if album previously had none
    if (!album.coverImage?.url && newImages[0]) {
      album.coverImage = {
        url: newImages[0].url,
        publicId: newImages[0].publicId,
      };
    }

    await album.save();
    return sendSuccess(res, 201, "Images added", album);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: UPDATE TITLE/DESCRIPTION OF ONE IMAGE ────────── */

export const updateImageMeta = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const album = await Gallery.findById(req.params.id);
    if (!album) return sendError(res, 404, "Album not found");

    const image = album.images.id(req.params.imageId);
    if (!image) return sendError(res, 404, "Image not found");

    if (title !== undefined) image.title = title;
    if (description !== undefined) image.description = description;

    await album.save();
    return sendSuccess(res, 200, "Image updated", image);
  } catch (error) {
    next(error);
  }
};

/* ────────── ADMIN: DELETE A SINGLE IMAGE ────────── */

export const deleteImageFromAlbum = async (req, res, next) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) return sendError(res, 404, "Album not found");

    const image = album.images.id(req.params.imageId);
    if (!image) return sendError(res, 404, "Image not found");

    await deleteFromCloudinary(image.publicId);
    image.deleteOne(); // remove from sub-doc array

    // If this was the cover, pick a new cover from remaining images
    if (album.coverImage?.publicId === image.publicId) {
      album.coverImage = album.images[0]
        ? { url: album.images[0].url, publicId: album.images[0].publicId }
        : { url: "", publicId: "" };
    }

    await album.save();
    return sendSuccess(res, 200, "Image deleted");
  } catch (error) {
    next(error);
  }
};
