// Customer registration with optional profile photo.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoCameraOutline } from "react-icons/io5";
import { registerUser, clearError } from "../../app/features/authSlice.js";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import authBg from "../../assets/auth-bg.png";
import logoLight from "../../assets/logo-light.png";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  useEffect(() => () => dispatch(clearError()), [dispatch]);
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhoto(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onSubmit = async (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("profilePhoto", photo);

    const result = await dispatch(registerUser(fd));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Welcome to GlowHaus");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
      <div className="hidden lg:block relative">
        <img
          src={authBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-bg-base/70 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <img src={logoLight} alt="GlowHaus" className="h-10 mb-4" />
          <p className="font-display text-3xl text-text-primary leading-tight max-w-sm">
            "Beauty, kept quiet and considered."
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-md">
          <p className="eyebrow text-rose-gold mb-2">Create account</p>
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            Join GlowHaus
          </h1>
          <p className="text-text-secondary mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-rose-gold hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Photo */}
            <div className="flex items-center gap-4">
              <label className="w-20 h-20 rounded-full border border-line-soft bg-bg-elevated overflow-hidden cursor-pointer flex items-center justify-center hover:border-rose-gold/50 transition-colors">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IoCameraOutline className="text-text-muted" size={26} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhoto}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-text-muted">
                Add a profile photo
                <br />
                <span className="text-text-secondary">(optional)</span>
              </p>
            </div>

            <div>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full name"
                className="input-luxe"
              />
              {errors.name && (
                <p className="text-xs text-danger mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="input-luxe"
              />
              {errors.email && (
                <p className="text-xs text-danger mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                placeholder="Phone (optional)"
                className="input-luxe"
              />
            </div>

            <PasswordInput
              register={register}
              name="password"
              registerOptions={{
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              }}
              placeholder="Password"
              error={errors.password}
            />

            <PasswordInput
              register={register}
              name="confirmPassword"
              registerOptions={{
                required: "Please confirm",
                validate: (v) => v === password || "Passwords don't match",
              }}
              placeholder="Confirm password"
              error={errors.confirmPassword}
            />

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
