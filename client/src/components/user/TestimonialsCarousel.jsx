// Auto-rotating testimonials carousel for the home page.
// Hardcoded testimonials use the 4 avatar images from /assets/testimonials.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar } from "react-icons/io5";
import a1 from "../../assets/testimonials/avatar-1.png";
import a2 from "../../assets/testimonials/avatar-2.png";
import a3 from "../../assets/testimonials/avatar-3.png";
import a4 from "../../assets/testimonials/avatar-4.png";

const testimonials = [
  {
    name: "Priya R.",
    role: "Bridal Glow Package",
    avatar: a1,
    quote:
      "The team at GlowHaus made me feel like the only woman in the room. Every detail was thought through — I haven't felt this beautiful in years.",
  },
  {
    name: "Mei L.",
    role: "Skincare Regular",
    avatar: a2,
    quote:
      "Calm, refined, and never rushed. I leave my facials genuinely brighter — and the rose-gold candles are a nice touch.",
  },
  {
    name: "Amara D.",
    role: "Hair & Color Client",
    avatar: a3,
    quote:
      "I trusted them with a dramatic chop and color and they nailed it. They actually listened — and styled it in a way that suits my curls.",
  },
  {
    name: "Sophia W.",
    role: "Spa Day Regular",
    avatar: a4,
    quote:
      "It's where I go when I need to disappear from the world for two hours. Bliss. Genuine bliss.",
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  const t = testimonials[index];

  return (
    <div className="relative max-w-3xl mx-auto text-center px-4">
      {/* Decorative quote mark */}
      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-[120px] leading-none opacity-10"
        style={{ color: "var(--color-rose-gold)" }}
        aria-hidden
      >
        “
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} className="text-rose-gold" size={16} />
            ))}
          </div>
          <p className="font-display italic text-xl md:text-2xl text-text-primary leading-relaxed mb-8">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-12 h-12 rounded-full object-cover border border-rose-gold/30"
            />
            <div className="text-left">
              <p className="font-medium text-text-primary">{t.name}</p>
              <p className="text-xs text-text-muted">{t.role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Testimonial ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === index ? 24 : 8,
              background:
                i === index ? "var(--gradient-rose)" : "var(--color-line-soft)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
