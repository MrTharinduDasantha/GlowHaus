// Admin sidebar — fixed on desktop, drawer on mobile (drawer state lives in AdminLayout).
// Top: logo + admin info. Middle: scrollable nav. Bottom: logout.

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSpeedometerOutline,
  IoCalendarOutline,
  IoCutOutline,
  IoPricetagsOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoCardOutline,
  IoTicketOutline,
  IoImagesOutline,
  IoStarOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoLogOutOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { logoutUser } from "../../app/features/authSlice.js";
import logo from "../../assets/logo.png";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: IoSpeedometerOutline },
  { to: "/admin/appointments", label: "Appointments", icon: IoCalendarOutline },
  { to: "/admin/services", label: "Services", icon: IoCutOutline },
  { to: "/admin/categories", label: "Categories", icon: IoPricetagsOutline },
  { to: "/admin/stylists", label: "Stylists", icon: IoPeopleOutline },
  { to: "/admin/customers", label: "Customers", icon: IoPersonOutline },
  { to: "/admin/payments", label: "Payments", icon: IoCardOutline },
  { to: "/admin/promos", label: "Promo Codes", icon: IoTicketOutline },
  { to: "/admin/gallery", label: "Gallery", icon: IoImagesOutline },
  { to: "/admin/reviews", label: "Reviews", icon: IoStarOutline },
  { to: "/admin/reports", label: "Reports", icon: IoStatsChartOutline },
  { to: "/admin/settings", label: "Settings", icon: IoSettingsOutline },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/admin/login");
  };

  // Sidebar content shared between desktop fixed + mobile drawer
  const SidebarBody = ({ inDrawer = false }) => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-line-soft">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="GlowHaus" className="h-8" />
          <div>
            <p className="font-display text-lg leading-tight">Admin</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-text-muted">
              Console
            </p>
          </div>
        </div>
        {inDrawer && (
          <button
            onClick={onClose}
            className="text-text-secondary p-1"
            aria-label="Close sidebar"
          >
            <IoCloseOutline size={24} />
          </button>
        )}
      </div>

      {/* User strip */}
      {user && (
        <div className="px-6 py-4 border-b border-line-soft flex items-center gap-3">
          {user.profilePhoto?.url ? (
            <img
              src={user.profilePhoto.url}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-rose-gold/30"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg"
              style={{
                background: "var(--gradient-rose)",
                color: "var(--color-bg-base)",
              }}
            >
              {user.name?.[0] || "A"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={inDrawer ? onClose : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-2.5 my-0.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "text-rose-gold bg-rose-gold/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active accent bar */}
                {isActive && (
                  <motion.span
                    layoutId="admin-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r"
                    style={{ background: "var(--gradient-rose)" }}
                  />
                )}
                <Icon size={18} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-line-soft p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-danger hover:bg-bg-elevated transition-colors"
        >
          <IoLogOutOutline size={18} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-bg-surface border-r border-line-soft flex-col z-30">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-72 z-50 bg-bg-surface border-r border-line-soft flex flex-col lg:hidden"
            >
              <SidebarBody inDrawer />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
