// Gallery for service detail pages — supports both:
//   - simple multi-image carousel (cycling through service.images)
//   - paired before/after when images come in even pairs labeled accordingly
// Lightbox preview on click.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const BeforeAfterGallery = ({ images = [] }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const openAt = (i) => {
    setActive(i);
    setOpen(true);
  };
  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.button
            key={img.publicId || i}
            type="button"
            whileHover={{ scale: 1.02 }}
            onClick={() => openAt(i)}
            className="relative aspect-square rounded-xl overflow-hidden border border-line-soft hover:border-rose-gold/40 transition-colors"
          >
            <img
              src={img.url}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/40 transition-opacity flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest text-rose-gold">
                View
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-text-primary p-2"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <IoClose size={28} />
            </button>

            <button
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 rounded-full glass-panel text-text-primary hover:text-rose-gold transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
            >
              <IoChevronBack size={24} />
            </button>

            <motion.img
              key={active}
              src={images[active].url}
              alt=""
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 rounded-full glass-panel text-text-primary hover:text-rose-gold transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
            >
              <IoChevronForward size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BeforeAfterGallery;
