// Create / edit a gallery album. Uses galleryApi.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoCloseCircle } from "react-icons/io5";
import { galleryApi } from "../../api/gallery.api.js";

const AlbumForm = ({ album, onSuccess, onCancel }) => {
  const isEdit = Boolean(album);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      albumName: album?.albumName || "",
      description: album?.description || "",
      isActive: album?.isActive ?? true,
    },
  });

  // Handle file selection
  const onFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    // Limit to 20 total images
    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 20));
  };

  // Remove a specific file from the selection
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await galleryApi.updateAlbum(album._id, values);
      } else {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => fd.append(k, v));
        files.forEach((f) => fd.append("images", f));
        await galleryApi.createAlbum(fd);
      }
      toast.success(`Album ${isEdit ? "updated" : "created"}`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to save album");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Album Name */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Album Name *
        </label>
        <input
          {...register("albumName", { required: "Required" })}
          placeholder="Bridal Transformations"
          className="input-luxe"
        />
        {errors.albumName && (
          <p className="text-xs text-danger mt-1">{errors.albumName.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Brides we've had the privilege of preparing..."
          className="input-luxe resize-none"
        />
      </div>

      {/* Image Upload + Previews */}
      {!isEdit && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Initial images (optional, up to 20)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onFilesChange}
              className="text-sm text-text-secondary file:btn-outline file:mr-3 cursor-pointer"
            />
          </div>

          {/* Thumbnail Preview Grid */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-bg-elevated/30 rounded-xl border border-line-soft">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden border border-rose-gold/30 group"
                >
                  <img
                    src={URL.createObjectURL(f)}
                    className="w-full h-full object-cover"
                    alt={`Preview ${i}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bg-base/80 flex items-center justify-center text-danger opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    aria-label="Remove"
                  >
                    <IoCloseCircle size={18} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent p-1">
                    <p className="text-[9px] text-white truncate px-1">
                      {f.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isEdit && (
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            {...register("isActive")}
            className="accent-rose-gold w-4 h-4"
          />
          <span className="text-sm text-text-secondary">Active</span>
        </label>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary hover:bg-bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Update Album" : "Create Album"}
        </button>
      </div>
    </form>
  );
};

export default AlbumForm;
