// Step 1 of password reset — enter email, server sends OTP.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { authApi } from "../../api/auth.api.js";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success("OTP sent — check your inbox");
      // Navigate to verify with email pre-loaded
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.userMessage || "Could not send OTP");
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
        <p className="eyebrow text-rose-gold mb-2">Reset password</p>
        <h1 className="font-display text-3xl md:text-4xl mb-2">
          Forgot your password?
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          Enter your email and we'll send you a 6-digit OTP to reset it.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
              className="input-luxe"
            />
            {errors.email && (
              <p className="text-xs text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send OTP"}
          </button>

          <p className="text-center text-sm text-text-muted">
            Remember it?{" "}
            <Link to="/login" className="text-rose-gold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
