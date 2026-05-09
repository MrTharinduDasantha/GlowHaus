// Reusable modal with Framer-Motion entrance and glassmorphism panel.
// Supports "sm" | "md" | "lg" sizes and optional close-on-backdrop.

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdrop = true,
}) => {
  // ESC key closes the modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => closeOnBackdrop && onClose?.()}
          />

          {/* Panel */}
          <motion.div
            className={`relative w-full ${sizeMap[size]} glass-panel rounded-2xl overflow-hidden`}
            style={{ boxShadow: "var(--shadow-elevated), var(--shadow-glow)" }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-line-soft">
                <h3 className="text-2xl font-display text-text-primary">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-rose-gold transition-colors"
                  aria-label="Close"
                >
                  <IoClose size={24} />
                </button>
              </div>
            )}
            {/* Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
