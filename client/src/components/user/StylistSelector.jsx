// Compact stylist picker for the booking flow.
// Pass eligible stylists and the currently-selected one;
// fires onSelect when the user taps a card.

import { motion } from "framer-motion";
import { IoStar, IoCheckmarkCircle } from "react-icons/io5";

const StylistSelector = ({ stylists = [], selectedId, onSelect }) => {
  if (!stylists.length) {
    return (
      <p className="text-text-muted text-sm">
        No stylists currently qualified for these services.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {stylists.map((stylist) => {
        const isSelected = String(selectedId) === String(stylist._id);
        return (
          <motion.button
            key={stylist._id}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(stylist)}
            className={`relative text-left p-3 rounded-xl border transition-all ${
              isSelected
                ? "border-rose-gold bg-rose-gold/5"
                : "border-line-soft bg-bg-surface hover:border-rose-gold/40"
            }`}
          >
            {/* Selected check */}
            {isSelected && (
              <IoCheckmarkCircle
                className="absolute top-2 right-2 text-rose-gold"
                size={20}
              />
            )}

            <div className="aspect-square rounded-lg overflow-hidden bg-bg-elevated mb-3">
              {stylist.profilePhoto?.url ? (
                <img
                  src={stylist.profilePhoto.url}
                  alt={stylist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-3xl text-rose-gold/40">
                  {stylist.name?.[0]}
                </div>
              )}
            </div>
            <p className="font-medium text-sm text-text-primary truncate">
              {stylist.name}
            </p>
            <p className="text-xs text-text-muted truncate">
              {stylist.expertise}
            </p>
            {stylist.totalReviews > 0 && (
              <div className="flex items-center gap-1 mt-1.5 text-xs">
                <IoStar className="text-rose-gold" size={12} />
                <span>{stylist.avgRating.toFixed(1)}</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default StylistSelector;
