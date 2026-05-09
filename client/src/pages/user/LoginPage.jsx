// Customer login. Returns user to wherever they came from after success.

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { loginUser, clearError } from "../../app/features/authSlice.js";
import { IoArrowForward } from "react-icons/io5";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import authBg from "../../assets/auth-bg.png";
import logoLight from "../../assets/logo-light.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);
  const redirectTo = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Welcome back");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
      {/* Side image — desktop only */}
      <div className="hidden lg:block relative">
        <img
          src={authBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-bg-base/70 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <img src={logoLight} alt="GlowHaus" className="h-10 mb-4" />
          <p className="font-display text-3xl text-text-primary leading-tight max-w-sm">
            "Where every detail is a quiet indulgence."
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-md">
          <p className="eyebrow text-rose-gold mb-2">Welcome back</p>
          <h1 className="font-display text-4xl md:text-5xl mb-2">Sign In</h1>
          <p className="text-text-secondary mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-rose-gold hover:underline">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Email
              </label>
              <div>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="you@example.com"
                  className="input-luxe pl-11"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Password
              </label>
              <PasswordInput
                register={register}
                name="password"
                registerOptions={{
                  required: "Password is required",
                }}
                placeholder="••••••••"
                className="pl-11"
                error={errors.password}
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-rose-gold hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <div className="mt-2 text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-rose-gold transition-colors"
              >
                Staff access <IoArrowForward size={12} />
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
