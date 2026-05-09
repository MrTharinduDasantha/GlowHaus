// Branded full-screen loader — animated rose-gold gradient ring.
// Used during initial app load (auth probe) and lazy-loaded routes.

import { motion } from "framer-motion";

const Loader = ({ fullScreen = true, label = "" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "fixed inset-0 bg-bg-base z-50" : "py-20"
      }`}
    >
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer rose-gold ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "var(--color-rose-gold)",
            borderRightColor: "var(--color-rose-gold-deep)",
          }}
        />
        {/* Inner glowing dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            background: "var(--color-rose-gold)",
            boxShadow: "0 0 12px var(--color-rose-gold)",
          }}
        />
      </motion.div>
      {label && <p className="eyebrow text-text-secondary">{label}</p>}
    </div>
  );
};

export default Loader;
