// Floating "back to top" button — appears once user scrolls past 400px.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowUp } from "react-icons/io5";

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          aria-label="Back to top"
          onClick={scrollUp}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center text-bg-base"
          style={{
            background: "var(--gradient-rose)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <IoArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
