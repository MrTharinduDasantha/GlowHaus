// Tabular booking list with status filter pills + click-to-open.

import { motion } from "framer-motion";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/formatCurrency.js";

const statuses = ["all", "pending", "confirmed", "completed", "cancelled"];
const statusColor = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
};

const AppointmentTable = ({
  bookings = [],
  filter = "all",
  onFilterChange,
  onRowClick,
}) => {
  return (
    <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
      {/* Filter pills */}
      <div className="flex items-center gap-2 p-4 border-b border-line-soft overflow-x-auto">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => onFilterChange?.(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs capitalize border transition-colors ${
              filter === s
                ? "border-rose-gold text-rose-gold bg-rose-gold/5"
                : "border-line-soft text-text-secondary hover:border-rose-gold/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-elevated text-text-muted text-left">
              <th className="px-4 py-3 font-medium">Booking ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Stylist</th>
              <th className="px-4 py-3 font-medium">Date / Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-text-muted">
                  No bookings to show.
                </td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => onRowClick?.(b)}
                  className="border-t border-line-soft cursor-pointer hover:bg-bg-elevated transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-rose-gold">
                    {b.bookingId}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-text-primary">{b.customerName}</p>
                    <p className="text-xs text-text-muted">{b.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {b.stylistName}
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {format(new Date(b.startTime), "MMM d, h:mm a")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                      style={{
                        background: `color-mix(in srgb, var(--color-${statusColor[b.status]}) 15%, transparent)`,
                        color: `var(--color-${statusColor[b.status]})`,
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-rose-gold font-medium">
                    {formatCurrency(b.totalAmount)}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
