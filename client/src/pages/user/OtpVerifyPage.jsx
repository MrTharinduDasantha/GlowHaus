// Step 2 — 6-digit OTP entry with auto-advance and paste support.

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { authApi } from "../../api/auth.api.js";

const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [digits, setDigits] = useState(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  // Bounce back if we don't know the email
  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  const handleChange = (i, value) => {
    const v = value.replace(/\D/g, "").slice(-1); // last digit only
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  // Backspace jumps back when current cell is empty
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  // Paste a 6-digit code and fan it out
  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length) {
      const arr = pasted.split("");
      while (arr.length < 6) arr.push("");
      setDigits(arr);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  };

  const submit = async () => {
    const otp = digits.join("");
    if (otp.length !== 6) return toast.error("Enter the full 6-digit code");

    setSubmitting(true);
    try {
      await authApi.verifyOtp({ email, otp });
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      toast.error(err.userMessage || "Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success("OTP resent");
    } catch (err) {
      toast.error(err.userMessage || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container-luxe min-h-[calc(100vh-5rem)] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-bg-surface border border-line-soft rounded-2xl text-center"
      >
        <p className="eyebrow text-rose-gold mb-2">Verify</p>
        <h1 className="font-display text-3xl md:text-4xl mb-2">
          Enter your code
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          We sent a 6-digit code to{" "}
          <span className="text-text-primary">{email}</span>
        </p>

        {/* OTP inputs */}
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="w-11 h-14 text-center font-display text-2xl bg-bg-elevated border border-line-soft rounded-lg focus:border-rose-gold focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="btn-primary w-full disabled:opacity-60"
        >
          {submitting ? "Verifying…" : "Verify Code"}
        </button>

        <div className="mt-5 text-sm text-text-muted">
          Didn't receive it?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="text-rose-gold hover:underline disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend"}
          </button>
          <span className="mx-2">·</span>
          <Link
            to="/forgot-password"
            className="text-rose-gold hover:underline"
          >
            Use different email
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerifyPage;
