// Customer-facing navbar — glassmorphism, fixed top, motion.
// Auto-shrinks on scroll, mobile drawer, bag count badge, profile dropdown.

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMenu,
  IoClose,
  IoBagHandle,
  IoHeart,
  IoPersonCircle,
} from "react-icons/io5";
import { logoutUser } from "../../app/features/authSlice.js";
import { selectBagCount } from "../../app/features/bagSlice.js";
import logo from "../../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/stylists", label: "Stylists" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const bagCount = useSelector(selectBagCount);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Shrink-on-scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 glass-panel"
            : "py-5 bg-transparent border border-transparent"
        }`}
      >
        <div className="container-luxe flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="GlowHaus" className="h-9 w-auto" />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative text-sm tracking-wide transition-colors ${
                    isActive
                      ? "text-rose-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-px"
                        style={{ background: "var(--color-rose-gold)" }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Bag */}
            <Link
              to="/bag"
              className="relative p-2 text-text-secondary hover:text-rose-gold transition-colors"
              aria-label="Service bag"
            >
              <IoBagHandle size={22} />
              {bagCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--gradient-rose)",
                    color: "var(--color-bg-base)",
                  }}
                >
                  {bagCount}
                </span>
              )}
            </Link>

            {/* Favorites — auth only */}
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="hidden sm:block p-2 text-text-secondary hover:text-rose-gold transition-colors"
                aria-label="Favorites"
              >
                <IoHeart size={22} />
              </Link>
            )}

            {/* Auth area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 p-1 rounded-full border border-line-soft hover:border-rose-gold transition-colors"
                  aria-label="Account menu"
                >
                  {user?.profilePhoto?.url ? (
                    <img
                      src={user.profilePhoto.url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <IoPersonCircle size={32} className="text-text-secondary" />
                  )}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl glass-panel overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-line-soft">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface hover:text-rose-gold transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface hover:text-rose-gold transition-colors"
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface hover:text-rose-gold transition-colors"
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-bg-surface transition-colors border-t border-line-soft"
                      >
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex btn-primary text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              className="lg:hidden p-2 text-text-primary"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <IoMenu size={26} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-bg-elevated border-l border-line-soft p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <img src={logo} alt="GlowHaus" className="h-8" />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-text-secondary"
                  aria-label="Close menu"
                >
                  <IoClose size={26} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `py-3 px-4 rounded-lg text-base transition-colors ${
                        isActive
                          ? "bg-bg-surface text-rose-gold"
                          : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="btn-primary mt-4 text-center"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
