// Service card — image, name, duration, price, short description.
// Includes inline FavoriteButton (top-right).

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoTimeOutline, IoStar } from "react-icons/io5";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDuration } from "../../utils/formatDuration.js";
import FavoriteButton from "./FavoriteButton.jsx";

const ServiceCard = ({ service, index = 0 }) => {
  const cover = service.images?.[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative bg-bg-surface border border-line-soft hover:border-rose-gold/40 rounded-2xl overflow-hidden transition-colors flex flex-col"
    >
      {/* Image */}
      <Link
        to={`/services/${service._id}`}
        className="relative block aspect-4/3 overflow-hidden"
      >
        {cover ? (
          <img
            src={cover}
            alt={service.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-bg-elevated flex items-center justify-center text-text-muted text-sm">
            No image
          </div>
        )}
        {/* Top-right favorite */}
        <div
          className="absolute top-3 right-3"
          onClick={(e) => e.preventDefault()}
        >
          <FavoriteButton serviceId={service._id} />
        </div>

        {/* Rating badge */}
        {service.totalReviews > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full glass-panel text-xs">
            <IoStar className="text-rose-gold" size={12} />
            <span className="font-medium">{service.avgRating.toFixed(1)}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="eyebrow text-rose-gold mb-2">
          {service.category?.name || "Service"}
        </p>
        <Link to={`/services/${service._id}`}>
          <h3 className="font-display text-xl text-text-primary mb-2 group-hover:text-rose-gold transition-colors line-clamp-2">
            {service.name}
          </h3>
        </Link>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">
          {service.shortDescription || service.description}
        </p>

        {/* Footer row: duration + price */}
        <div className="flex items-center justify-between pt-4 border-t border-line-soft">
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <IoTimeOutline size={16} />
            {formatDuration(service.duration)}
          </span>
          <span className="font-display text-2xl text-rose-gold">
            {formatCurrency(service.price)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
