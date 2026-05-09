// Create / edit a promo code.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { promoApi } from "../../api/promo.api.js";

const PromoCodeForm = ({ promo, onSuccess, onCancel }) => {
  const isEdit = Boolean(promo);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: promo?.code || "",
      description: promo?.description || "",
      discountType: promo?.discountType || "percentage",
      discountValue: promo?.discountValue || "",
      minBookingValue: promo?.minBookingValue || 0,
      maxDiscountAmount: promo?.maxDiscountAmount || 0,
      expiryDate: promo?.expiryDate
        ? format(new Date(promo.expiryDate), "yyyy-MM-dd")
        : "",
      usageLimit: promo?.usageLimit || 0,
      isActive: promo?.isActive ?? true,
    },
  });

  const discountType = watch("discountType");

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) await promoApi.update(promo._id, values);
      else await promoApi.create(values);
      toast.success(`Promo ${isEdit ? "updated" : "created"}`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to save promo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Code *
          </label>
          <input
            {...register("code", { required: "Code is required" })}
            disabled={isEdit}
            placeholder="WELCOME15"
            className="input-luxe uppercase tracking-wider disabled:opacity-60"
          />
          {errors.code && (
            <p className="text-xs text-danger mt-1">{errors.code.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Description
          </label>
          <input
            {...register("description")}
            placeholder="15% off your first GlowHaus visit"
            className="input-luxe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Discount Type *
          </label>
          <select {...register("discountType")} className="input-luxe">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed amount ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Discount Value * {discountType === "percentage" ? "(0-100)" : "($)"}
          </label>
          <input
            type="number"
            min="0"
            max={discountType === "percentage" ? "100" : undefined}
            step="0.01"
            {...register("discountValue", { required: "Required", min: 0 })}
            placeholder="15"
            className="input-luxe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Min booking value ($)
          </label>
          <input
            type="number"
            min="0"
            {...register("minBookingValue")}
            className="input-luxe"
          />
        </div>
        {discountType === "percentage" && (
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Max discount cap ($, 0 = no cap)
            </label>
            <input
              type="number"
              min="0"
              {...register("maxDiscountAmount")}
              className="input-luxe"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Expiry Date *
          </label>
          <input
            type="date"
            {...register("expiryDate", { required: "Required" })}
            className="input-luxe"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Usage limit (0 = unlimited)
          </label>
          <input
            type="number"
            min="0"
            {...register("usageLimit")}
            className="input-luxe"
          />
        </div>
      </div>

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          {...register("isActive")}
          className="accent-rose-gold w-4 h-4"
        />
        <span className="text-sm text-text-secondary">Active</span>
      </label>

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
          {submitting ? "Saving…" : isEdit ? "Update Promo" : "Create Promo"}
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;
