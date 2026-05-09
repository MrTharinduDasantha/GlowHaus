// Create / edit a service category. Embedded in a Modal from the Categories page.

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { categoryApi } from "../../api/category.api.js";

const CategoryForm = ({ category, onSuccess, onCancel }) => {
  const isEdit = Boolean(category);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(category?.image?.url || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      isActive: category?.isActive ?? true,
    },
  });

  // Cleanup preview blob URL on unmount
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("description", values.description || "");
      if (isEdit) fd.append("isActive", values.isActive);
      const file = document.getElementById("cat-image-input")?.files?.[0];
      if (file) fd.append("image", file);

      if (isEdit) await categoryApi.update(category._id, fd);
      else await categoryApi.create(fd);

      toast.success(`Category ${isEdit ? "updated" : "created"}`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">
          Category Image
        </label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl border border-line-soft overflow-hidden bg-bg-elevated shrink-0">
            {preview ? (
              <img
                src={preview}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                No image
              </div>
            )}
          </div>
          <input
            id="cat-image-input"
            type="file"
            accept="image/*"
            onChange={onFile}
            className="text-sm text-text-secondary file:btn-outline file:mr-3"
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Name *
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Hair"
          className="input-luxe"
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1">{errors.name.message}</p>
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
          placeholder="Cuts, color, smoothing, and styling — crafted for healthy, glossy hair that moves the way you want it to."
          className="input-luxe resize-none"
        />
      </div>

      {/* Active toggle (edit only) */}
      {isEdit && (
        <label className="flex items-center gap-3">
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
          {submitting
            ? "Saving…"
            : isEdit
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
