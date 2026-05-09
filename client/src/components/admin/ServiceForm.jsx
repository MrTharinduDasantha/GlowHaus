// Create / edit a service. Multi-image upload with thumbnails + delete.

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoCloseCircle } from "react-icons/io5";
import { serviceApi } from "../../api/service.api.js";
import { categoryApi } from "../../api/category.api.js";

const ServiceForm = ({ service, onSuccess, onCancel }) => {
  const isEdit = Boolean(service);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState(service?.images || []);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // File[]
  const [benefits, setBenefits] = useState(service?.benefits || []);
  const [benefitInput, setBenefitInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: service?.name || "",
      category: service?.category?._id || service?.category || "",
      shortDescription: service?.shortDescription || "",
      description: service?.description || "",
      price: service?.price || "",
      duration: service?.duration || "",
      isActive: service?.isActive ?? true,
      isFeatured: service?.isFeatured ?? false,
    },
  });

  useEffect(() => {
    categoryApi
      .list()
      .then((r) => setCategories(r.data.data))
      .catch(() => {});
  }, []);

  const addBenefit = () => {
    if (!benefitInput.trim()) return;
    setBenefits((b) => [...b, benefitInput.trim()]);
    setBenefitInput("");
  };
  const removeBenefit = (i) =>
    setBenefits((b) => b.filter((_, idx) => idx !== i));

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files].slice(0, 8));
  };
  const removeNewFile = (i) =>
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));

  const queueImageRemoval = (publicId) => {
    setRemoveImageIds((prev) => [...prev, publicId]);
    setExistingImages((imgs) =>
      imgs.filter((img) => img.publicId !== publicId),
    );
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("benefits", JSON.stringify(benefits));
      if (removeImageIds.length)
        fd.append("removeImageIds", JSON.stringify(removeImageIds));
      newFiles.forEach((f) => fd.append("images", f));

      if (isEdit) await serviceApi.update(service._id, fd);
      else await serviceApi.create(fd);

      toast.success(`Service ${isEdit ? "updated" : "created"}`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Name *
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Keratin Smoothing Treatment"
            className="input-luxe"
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="input-luxe"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-danger mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Price + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Price (USD) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("price", { required: "Price is required", min: 0 })}
            placeholder="220"
            className="input-luxe"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Duration (min) *
          </label>
          <input
            type="number"
            min="5"
            step="5"
            {...register("duration", {
              required: "Duration is required",
              min: 5,
            })}
            placeholder="150"
            className="input-luxe"
          />
        </div>
      </div>

      {/* Short Desc */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Short description
        </label>
        <input
          {...register("shortDescription")}
          maxLength={140}
          placeholder="Briefly describe the service"
          className="input-luxe"
        />
      </div>

      {/* Long Desc */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Full description *
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={4}
          placeholder="Describe the service in detail"
          className="input-luxe resize-none"
        />
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Benefits
        </label>
        <div className="flex gap-2 mb-2">
          <input
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addBenefit())
            }
            className="input-luxe"
            placeholder="Add a benefit and press Enter"
          />
          <button
            type="button"
            onClick={addBenefit}
            className="btn-outline shrink-0"
          >
            Add
          </button>
        </div>
        {benefits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {benefits.map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-elevated border border-line-soft text-xs"
              >
                {b}
                <button
                  type="button"
                  onClick={() => removeBenefit(i)}
                  aria-label="Remove"
                >
                  <IoCloseCircle className="text-text-muted hover:text-danger" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Images (up to 8)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFiles}
          className="text-sm text-text-secondary file:btn-outline file:mr-3 mb-3"
        />
        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {existingImages.map((img) => (
              <div
                key={img.publicId}
                className="relative aspect-square rounded-lg overflow-hidden border border-line-soft"
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => queueImageRemoval(img.publicId)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bg-base/80 flex items-center justify-center text-danger"
                  aria-label="Remove"
                >
                  <IoCloseCircle size={18} />
                </button>
              </div>
            ))}
            {newFiles.map((f, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden border border-rose-gold/40"
              >
                <img
                  src={URL.createObjectURL(f)}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bg-base/80 flex items-center justify-center text-danger"
                  aria-label="Remove"
                >
                  <IoCloseCircle size={18} />
                </button>
                <span className="absolute bottom-1 left-1 text-[10px] uppercase tracking-wide text-rose-gold bg-bg-base/80 px-1.5 rounded">
                  new
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            {...register("isActive")}
            className="accent-rose-gold w-4 h-4"
          />
          <span className="text-sm text-text-secondary">Active</span>
        </label>
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="accent-rose-gold w-4 h-4"
          />
          <span className="text-sm text-text-secondary">
            Featured on homepage
          </span>
        </label>
      </div>

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
              ? "Update Service"
              : "Create Service"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
