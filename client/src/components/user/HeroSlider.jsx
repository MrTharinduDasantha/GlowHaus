// Hero slider — full-bleed, auto-advancing carousel with the 3 brand hero images.
// Framer Motion drives slide transitions and the parallax text reveal.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import hero1 from "../../assets/hero/hero-1.png";
import hero2 from "../../assets/hero/hero-2.png";
import hero3 from "../../assets/hero/hero-3.png";

const slides = [
  {
    img: hero1,
    eyebrow: "Welcome to GlowHaus",
    title: "Where every detail is a quiet indulgence.",
    subtitle: "An exclusive women-only sanctuary for hair, skin, and self.",
  },
  {
    img: hero2,
    eyebrow: "Signature Glam",
    title: "Editorial-quality looks, crafted around you.",
    subtitle: "Hair, makeup, and skincare by stylists who know their craft.",
  },
  {
    img: hero3,
    eyebrow: "Bridal Suite",
    title: "Your moment. Your vision. Realised.",
    subtitle: "Bridal packages designed in collaboration, perfected together.",
  },
];

const SLIDE_DURATION = 6500;

const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  return (
    <section className="relative h-[88vh] min-h-140 w-full overflow-hidden">
      {/* Slide images — crossfade with subtle Ken-Burns zoom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img src={current.img} alt="" className="w-full h-full object-fill" />
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,10,13,0.85) 0%, rgba(10,10,13,0.55) 50%, rgba(10,10,13,0.4) 100%)",
        }}
      />

      {/* Decorative rose-gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(232,180,160,0.15) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center container-luxe">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="eyebrow text-rose-gold mb-4">{current.eyebrow}</p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-text-primary leading-[1.05] mb-6">
                {current.title}
              </h1>
              <p className="text-text-secondary text-base md:text-lg max-w-xl mb-8 leading-relaxed">
                {current.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/services"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Book Now <IoArrowForward />
                </Link>
                <Link to="/services" className="btn-outline">
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 32 : 12,
              background:
                i === index ? "var(--gradient-rose)" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
