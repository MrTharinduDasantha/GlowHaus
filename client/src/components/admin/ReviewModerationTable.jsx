// Pending / approved / all review list with approve / reject / delete actions.

import { motion } from "framer-motion";
import {
  IoCheckmarkOutline,
  IoCloseOutline,
  IoTrashOutline,
} from "react-icons/io5";
import RatingStars from "../common/RatingStars.jsx";
import { formatTimeAgo } from "../../utils/formatDate.js";

const ReviewModerationTable = ({
  reviews = [],
  filter,
  onFilterChange,
  onModerate,
  onDelete,
}) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
  ];

  return (
    <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
      <div className="flex gap-2 p-4 border-b border-line-soft">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange?.(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              filter === f.id
                ? "border-rose-gold text-rose-gold bg-rose-gold/5"
                : "border-line-soft text-text-secondary hover:border-rose-gold/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-line-soft">
        {reviews.length === 0 ? (
          <p className="text-center text-text-muted py-12">
            No reviews to moderate.
          </p>
        ) : (
          reviews.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-medium text-text-primary">
                    {r.customer?.name || r.customerName}
                  </p>
                  <p className="text-xs text-text-muted">
                    on{" "}
                    <span className="text-rose-gold">
                      {r.service?.name || "—"}
                    </span>
                    {" · "}
                    {formatTimeAgo(r.createdAt)}
                  </p>
                </div>
                <RatingStars value={r.rating} size={14} />
              </div>

              {r.comment && (
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {r.comment}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: r.isApproved
                      ? "color-mix(in srgb, var(--color-success) 15%, transparent)"
                      : "color-mix(in srgb, var(--color-warning) 15%, transparent)",
                    color: r.isApproved
                      ? "var(--color-success)"
                      : "var(--color-warning)",
                  }}
                >
                  {r.isApproved ? "Approved" : "Pending"}
                </span>
                <div className="ml-auto flex gap-1.5">
                  {!r.isApproved && (
                    <button
                      onClick={() => onModerate?.(r, "approve")}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/30 text-xs hover:bg-success/20"
                    >
                      <IoCheckmarkOutline /> Approve
                    </button>
                  )}
                  {r.isApproved && (
                    <button
                      onClick={() => onModerate?.(r, "reject")}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/30 text-xs hover:bg-warning/20"
                    >
                      <IoCloseOutline /> Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => onDelete?.(r)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-danger/10 text-danger border border-danger/30 text-xs hover:bg-danger/20"
                  >
                    <IoTrashOutline /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewModerationTable;
