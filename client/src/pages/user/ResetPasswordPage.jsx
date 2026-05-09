// Step 3 — set new password with the verified OTP in flight.

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { authApi } from "../../api/auth.api.js";
import PasswordInput from "../../components/common/PasswordInput.jsx";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!email || !otp) navigate("/forgot-password", { replace: true });
  }, [email, otp, navigate]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await authApi.resetPassword({ email, otp, ...values });
      toast.success("Password updated. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.userMessage || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-luxe min-h-[calc(100vh-5rem)] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-bg-surface border border-line-soft rounded-2xl"
      >
        <p className="eyebrow text-rose-gold mb-2">Set a new password</p>
        <h1 className="font-display text-3xl md:text-4xl mb-2">Almost done</h1>
        <p className="text-text-secondary text-sm mb-6">
          Choose a strong password for{" "}
          <span className="text-text-primary">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            register={register}
            name="newPassword"
            registerOptions={{
              required: "Required",
              minLength: { value: 6, message: "Min 6 characters" },
            }}
            placeholder="New password"
            error={errors.newPassword}
          />

          <PasswordInput
            register={register}
            name="confirmPassword"
            registerOptions={{
              required: "Please confirm",
              validate: (v) => v === newPassword || "Passwords don't match",
            }}
            placeholder="Confirm password"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
