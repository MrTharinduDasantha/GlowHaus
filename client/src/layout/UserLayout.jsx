// Customer-facing layout — fixed Navbar, Outlet for routed page, Footer.
// Page transitions handled by AnimatePresence + motion.div on Outlet's wrapper.

import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import BackToTop from "../components/common/BackToTop.jsx";

const UserLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page content — Navbar is fixed so add top padding equal to its height */}
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default UserLayout;
