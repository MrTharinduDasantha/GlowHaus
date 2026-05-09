// Stylist create/edit form — basic info + working hours + days off + photo.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { stylistApi } from "../../api/stylist.api.js";
import WorkingHoursEditor from "./WorkingHoursEditor.jsx";
import DaysOffEditor from "./DaysOffEditor.jsx";

const defaultHours = [
  {
    day: "mon",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "13:30",
    closed: false,
  },
  {
    day: "tue",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "13:30",
    closed: false,
  },
  {
    day: "wed",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "13:30",
    closed: false,
  },
  {
    day: "thu",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "13:30",
    closed: false,
  },
  {
    day: "fri",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "13:30",
    closed: false,
  },
  {
    day: "sat",
    startTime: "10:00",
    endTime: "16:00",
    breakStart: "",
    breakEnd: "",
    closed: false,
  },
  {
    day: "sun",
    startTime: "00:00",
    endTime: "00:00",
    breakStart: "",
    breakEnd: "",
    closed: true,
  },
];

const StylistForm = ({ stylist, onSuccess, onCancel }) => {
  const isEdit = Boolean(stylist);
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(stylist?.profilePhoto?.url || "");
  const [workingHours, setWorkingHours] = useState(
    stylist?.workingHours || defaultHours,
  );
  const [daysOff, setDaysOff] = useState(
    (stylist?.daysOff || []).map((d) => new Date(d)),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: stylist?.name || "",
      expertise: stylist?.expertise || "",
      bio: stylist?.bio || "",
      email: stylist?.email || "",
      phone: stylist?.phone || "",
      isActive: stylist?.isActive ?? true,
    },
  });

  const onPhotoChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhoto(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v));
      fd.append("workingHours", JSON.stringify(workingHours));
      fd.append("daysOff", JSON.stringify(daysOff));
      if (photo) fd.append("profilePhoto", photo);

      if (isEdit) await stylistApi.update(stylist._id, fd);
      else await stylistApi.create(fd);

      toast.success(`Stylist ${isEdit ? "updated" : "created"}`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to save stylist");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photo */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-line-soft bg-bg-elevated shrink-0">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
              Photo
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className="text-sm text-text-secondary file:btn-outline file:mr-3"
        />
      </div>

      {/* Basics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Name *
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Isabella Rossi"
            className="input-luxe"
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Expertise *
          </label>
          <input
            {...register("expertise", { required: "Expertise is required" })}
            placeholder="Senior Hair Stylist & Color Specialist"
            className="input-luxe"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Email *
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="isabella@glowhaus.com"
            className="input-luxe"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">
            Phone
          </label>
          <input
            {...register("phone")}
            placeholder="+1 (212) 555-0140"
            className="input-luxe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1.5">Bio</label>
        <textarea
          {...register("bio")}
          rows={3}
          placeholder="With over 12 years behind the chair and training in Milan and London, Isabella specialises in custom balayage, precision cuts, and smoothing treatments."
          className="input-luxe resize-none"
        />
      </div>

      {/* Working hours */}
      <div>
        <p className="eyebrow text-rose-gold mb-3">Working Hours</p>
        <WorkingHoursEditor value={workingHours} onChange={setWorkingHours} />
      </div>

      {/* Days off */}
      <div>
        <p className="eyebrow text-rose-gold mb-3">
          Days Off (vacation, holidays)
        </p>
        <DaysOffEditor value={daysOff} onChange={setDaysOff} />
      </div>

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          {...register("isActive")}
          className="accent-rose-gold w-4 h-4"
        />
        <span className="text-sm text-text-secondary">Active</span>
      </label>

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
              ? "Update Stylist"
              : "Create Stylist"}
        </button>
      </div>
    </form>
  );
};

export default StylistForm;
