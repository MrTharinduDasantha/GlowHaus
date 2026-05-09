// Promotional CTA banner for the home page.
// Uses cta-banner.jpg as background with strong negative space on the left.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import ctaBanner from "../../assets/cta-banner.png";

const OfferBanner = ({
  eyebrow = "Limited Offer",
  title = "Your first visit, our gift.",
  body = "Enjoy 15% off your first booking with code WELCOME15. Discover the GlowHaus difference.",
  ctaLabel = "Claim Offer",
  ctaTo = "/services",
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="relative rounded-3xl overflow-hidden border border-line-soft min-h-90 md:min-h-105 flex items-center"
    >
      {/* Background image */}
      <img
        src={ctaBanner}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark gradient — strong on the left to leave room for text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,13,0.95) 0%, rgba(10,10,13,0.8) 40%, rgba(10,10,13,0.3) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-xl px-8 md:px-14 py-12">
        <p className="eyebrow text-rose-gold mb-4">{eyebrow}</p>
        <h2 className="font-display text-4xl md:text-5xl text-text-primary leading-[1.1] mb-5">
          {title}
        </h2>
        <p className="text-text-secondary leading-relaxed mb-7 max-w-md">
          {body}
        </p>
        <Link to={ctaTo} className="btn-primary inline-flex items-center gap-2">
          {ctaLabel} <IoArrowForward />
        </Link>
      </div>
    </motion.section>
  );
};

export default OfferBanner;
