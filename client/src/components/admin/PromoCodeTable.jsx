// Promo list with usage progress + edit/delete actions.

import { motion } from "framer-motion";
import { format } from "date-fns";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";

const PromoCodeTable = ({ promos = [], onEdit, onDelete }) => {
  return (
    <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-elevated text-text-muted text-left">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Usage</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-text-muted">
                  No promo codes yet.
                </td>
              </tr>
            ) : (
              promos.map((p, i) => {
                const expired = new Date(p.expiryDate) < new Date();
                const limited = p.usageLimit > 0;
                const usagePct = limited
                  ? (p.usedCount / p.usageLimit) * 100
                  : 0;

                return (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-line-soft hover:bg-bg-elevated transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-rose-gold">
                      {p.code}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {p.discountType === "percentage"
                        ? `${p.discountValue}% off`
                        : `$${p.discountValue} off`}
                    </td>
                    <td className="px-4 py-3 min-w-35">
                      {limited ? (
                        <>
                          <p className="text-xs text-text-secondary mb-1">
                            {p.usedCount} / {p.usageLimit}
                          </p>
                          <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${Math.min(100, usagePct)}%`,
                                background: "var(--gradient-rose)",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-text-muted">
                          Unlimited · {p.usedCount} used
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {format(new Date(p.expiryDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      {expired ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-text-muted/10 text-text-muted border border-text-muted/30">
                          Expired
                        </span>
                      ) : p.isActive ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/30">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-warning/10 text-warning border border-warning/30">
                          Paused
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => onEdit?.(p)}
                          className="p-1.5 text-text-secondary hover:text-rose-gold"
                          aria-label="Edit"
                        >
                          <IoCreateOutline size={18} />
                        </button>
                        <button
                          onClick={() => onDelete?.(p)}
                          className="p-1.5 text-text-secondary hover:text-danger"
                          aria-label="Delete"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoCodeTable;
