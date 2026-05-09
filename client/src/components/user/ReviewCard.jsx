// Displays a single approved review on a service detail page.

import { motion } from "framer-motion";
import { IoPersonCircle } from "react-icons/io5";
import RatingStars from "../common/RatingStars.jsx";
import { formatTimeAgo } from "../../utils/formatDate.js";

const ReviewCard = ({ review, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-5 bg-bg-surface border border-line-soft rounded-xl"
    >
      <div className="flex items-start gap-3 mb-3">
        {review.customerPhoto ? (
          <img
            src={review.customerPhoto}
            alt={review.customerName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <IoPersonCircle size={40} className="text-text-muted" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary truncate">
            {review.customerName}
          </p>
          <p className="text-xs text-text-muted">
            {formatTimeAgo(review.createdAt)}
          </p>
        </div>
        <RatingStars value={review.rating} size={14} />
      </div>
      {review.comment && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {review.comment}
        </p>
      )}
    </motion.div>
  );
};

export default ReviewCard;
