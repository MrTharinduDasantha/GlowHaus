// My Account — edit profile + change password tabs.

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { IoCameraOutline } from "react-icons/io5";
import { userApi } from "../../api/user.api.js";
import { updateUserLocal } from "../../app/features/authSlice.js";
import PasswordInput from "../../components/common/PasswordInput.jsx";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [active, setActive] = useState("profile");

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="text-center mb-10">
        <p className="eyebrow text-rose-gold mb-2">My account</p>
        <h1 className="font-display text-4xl md:text-5xl">Profile</h1>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto">
        <div className="flex border-b border-line-soft mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative px-5 py-3 text-sm transition-colors ${
                active === t.id
                  ? "text-rose-gold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.label}
              {active === t.id && (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-x-3 bottom-0 h-px"
                  style={{ background: "var(--gradient-rose)" }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {active === "profile" ? (
              <ProfileForm user={user} dispatch={dispatch} />
            ) : (
              <PasswordForm />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProfileForm = ({ user, dispatch }) => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilePhoto?.url || "");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onPhoto = (e) => {
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
      if (photo) fd.append("profilePhoto", photo);
      const res = await userApi.updateMyProfile(fd);
      dispatch(updateUserLocal(res.data.data));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.userMessage || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-6 bg-bg-surface border border-line-soft rounded-2xl"
    >
      {/* Photo */}
      <div className="flex items-center gap-5">
        <label className="w-24 h-24 rounded-full overflow-hidden border border-line-soft bg-bg-elevated cursor-pointer flex items-center justify-center hover:border-rose-gold/50 transition-colors">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <IoCameraOutline className="text-text-muted" size={28} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onPhoto}
            className="hidden"
          />
        </label>
        <div>
          <p className="font-medium">Profile photo</p>
          <p className="text-xs text-text-muted">Click the circle to change</p>
        </div>
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1.5">Name</label>
        <input
          {...register("name", { required: "Required" })}
          className="input-luxe"
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Email
        </label>
        <input
          type="email"
          {...register("email", { required: "Required" })}
          className="input-luxe"
        />
        {errors.email && (
          <p className="text-xs text-danger mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1.5">
          Phone
        </label>
        <input {...register("phone")} className="input-luxe" />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
};

const PasswordForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const newPassword = watch("newPassword");

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await userApi.changePassword(values);
      toast.success("Password changed");
      reset();
    } catch (err) {
      toast.error(err.userMessage || "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-6 bg-bg-surface border border-line-soft rounded-2xl"
    >
      <PasswordInput
        register={register}
        name="currentPassword"
        registerOptions={{ required: "Required" }}
        placeholder="Current password"
        error={errors.currentPassword}
      />

      <PasswordInput
        register={register}
        name="newPassword"
        registerOptions={{
          required: "Required",
          minLength: { value: 6, message: "Min 6" },
        }}
        placeholder="New password"
        error={errors.newPassword}
      />

      <PasswordInput
        register={register}
        name="confirmPassword"
        registerOptions={{
          required: "Required",
          validate: (v) => v === newPassword || "Passwords don't match",
        }}
        placeholder="Confirm new password"
        error={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary disabled:opacity-60"
      >
        {submitting ? "Updating…" : "Change Password"}
      </button>
    </form>
  );
};

export default ProfilePage;
