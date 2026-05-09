// Admin layout — sidebar + main content area, mobile drawer toggle.
// AdminSidebar is built in Stage 7 (admin components stage).

import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoMenu } from "react-icons/io5";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-bg-base">
      {/* Sidebar — permanent on desktop, drawer on mobile */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile top bar with menu trigger */}
        <header className="lg:hidden sticky top-0 z-30 glass-panel px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-primary p-2"
            aria-label="Open sidebar"
          >
            <IoMenu size={26} />
          </button>
          <span className="font-display text-lg gradient-text">
            Admin Panel
          </span>
        </header>

        {/* Routed page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
