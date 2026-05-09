// Stylist profile card — photo, name, expertise, rating.
// Used on the Stylists page grid.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";

const StylistCard = ({ stylist, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link
        to={`/stylists/${stylist._id}`}
        className="group block bg-bg-surface border border-line-soft hover:border-rose-gold/40 rounded-2xl overflow-hidden transition-all"
      >
        {/* Portrait */}
        <div className="relative aspect-3/4 overflow-hidden">
          {stylist.profilePhoto?.url ? (
            <img
              src={stylist.profilePhoto.url}
              alt={stylist.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-bg-elevated flex items-center justify-center font-display text-5xl text-rose-gold/40">
              {stylist.name?.[0]}
            </div>
          )}
          {/* Bottom fade */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, rgba(10,10,13,0.85) 100%)",
            }}
          />

          {/* Rating pill */}
          {stylist.totalReviews > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full glass-panel text-xs">
              <IoStar className="text-rose-gold" size={12} />
              <span className="font-medium">
                {stylist.avgRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Name + expertise */}
        <div className="p-5">
          <h3 className="font-display text-2xl text-text-primary group-hover:text-rose-gold transition-colors">
            {stylist.name}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {stylist.expertise}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default StylistCard;
