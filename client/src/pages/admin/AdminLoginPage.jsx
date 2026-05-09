// Admin login — same flow as customer login, but rejects non-admin users and bounces them to /admin/dashboard on success.

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import {
  loginUser,
  clearError,
  logoutUser,
} from "../../app/features/authSlice.js";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import logoLight from "../../assets/logo-light.png";
import authBg from "../../assets/auth-bg.png";

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, error } = useSelector((s) => s.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  // If a non-admin is already authenticated, kick them out of admin login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else {
        dispatch(logoutUser());
      }
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const onSubmit = async (values) => {
    const res = await dispatch(loginUser(values));
    if (
      res.meta.requestStatus === "fulfilled" &&
      res.payload?.role !== "admin"
    ) {
      toast.error("Admin access only");
      dispatch(logoutUser());
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="hidden lg:block relative">
        <img
          src={authBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-bg-base/80 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <img src={logoLight} alt="GlowHaus" className="h-10 mb-4" />
          <p className="font-display text-3xl text-text-primary leading-tight max-w-sm">
            Admin Console
          </p>
          <p className="text-text-secondary mt-2 text-sm">
            Manage appointments, services, and the salon.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-md">
          <div
            className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-5"
            style={{
              background: "var(--gradient-rose)",
              color: "var(--color-bg-base)",
            }}
          >
            <IoShieldCheckmarkOutline size={24} />
          </div>
          <p className="eyebrow text-rose-gold mb-2">Restricted</p>
          <h1 className="font-display text-4xl mb-2">Admin Sign In</h1>
          <p className="text-text-secondary mb-8 text-sm">
            This area is for salon staff only.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="admin@glowhaus.com"
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
              <PasswordInput
                register={register}
                name="password"
                registerOptions={{ required: "Password is required" }}
                placeholder="••••••••"
                className="pl-11"
                error={errors.password}
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In to Admin"}
            </button>

            <div className="mt-2 text-center">
              <Link
                to="/login"
                className="text-xs text-text-muted hover:text-rose-gold transition-colors"
              >
                Not a Staff Member? Sign In
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
