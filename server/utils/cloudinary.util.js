// Cloudinary helpers — upload an in-memory buffer (from multer) and delete by public_id.

import { v2 as cloudinary } from "cloudinary";

/**
 * Upload a Buffer (from multer memory storage) to Cloudinary.
 * Resolves with { url, publicId } so we can store both in MongoDB:
 *   - url: render in <img src=...>
 *   - publicId: needed later if we want to delete the image
 *
 * @param {Buffer} buffer - file buffer (req.file.buffer)
 * @param {String} folder - Cloudinary folder, e.g. "glowhaus/services"
 */
export const uploadToCloudinary = (buffer, folder = "glowhaus") =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    // Pipe the buffer into the upload stream
    uploadStream.end(buffer);
  });

/**
 * Delete a Cloudinary image by its public_id.
 * Silently logs failures (delete is best-effort and shouldn't break the request).
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

export default cloudinary;
