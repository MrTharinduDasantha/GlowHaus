// Single row in the service bag.
// Shows thumbnail + name + duration + price, with a remove button.

import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { IoTrashOutline, IoTimeOutline } from "react-icons/io5";
import { removeFromBag } from "../../app/features/bagSlice.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDuration } from "../../utils/formatDuration.js";

const ServiceBagItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 p-4 bg-bg-surface border border-line-soft rounded-xl"
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-bg-elevated">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-text-primary truncate">{item.name}</h4>
        <p className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
          <IoTimeOutline size={14} />
          {formatDuration(item.duration)}
        </p>
        <p className="font-display text-lg text-rose-gold mt-1">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => dispatch(removeFromBag(item._id))}
        className="p-2 text-text-muted hover:text-danger transition-colors"
        aria-label={`Remove ${item.name}`}
      >
        <IoTrashOutline size={20} />
      </button>
    </motion.div>
  );
};

export default ServiceBagItem;
