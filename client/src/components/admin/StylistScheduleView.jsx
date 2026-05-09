// Daily list view of a single stylist's appointments.
// Pass `appointments` from /api/schedules/:id/appointments.

import { motion } from "framer-motion";
import { format } from "date-fns";
import { toLocalDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const statusColor = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
};

const StylistScheduleView = ({ appointments = [], onSelect }) => {
  if (!appointments.length) {
    return (
      <div className="p-8 bg-bg-surface border border-line-soft rounded-2xl text-center">
        <p className="text-text-muted">No appointments in this date range.</p>
      </div>
    );
  }

  // Group by date for visual separation
  const grouped = appointments.reduce((acc, a) => {
    const key = format(new Date(a.startTime), "yyyy-MM-dd");
    (acc[key] = acc[key] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="eyebrow text-rose-gold mb-3">
            {format(toLocalDate(date), "EEEE, MMM d yyyy")}
          </p>
          <div className="space-y-2">
            {items.map((a, i) => (
              <motion.button
                key={a._id}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelect?.(a)}
                className="w-full text-left flex items-center gap-4 p-4 bg-bg-surface border border-line-soft hover:border-rose-gold/40 rounded-xl transition-colors"
              >
                {/* Time block */}
                <div className="text-center px-3 py-2 rounded-lg bg-bg-elevated">
                  <p className="font-display text-lg leading-tight">
                    {format(toLocalDate(a.startTime), "h:mm")}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">
                    {format(toLocalDate(a.startTime), "a")}
                  </p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {a.customer?.name || a.customerName}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {a.services?.map((s) => s.name).join(" · ")}
                  </p>
                </div>

                {/* Status pill */}
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                  style={{
                    background: `color-mix(in srgb, var(--color-${statusColor[a.status] || "info"}) 15%, transparent)`,
                    color: `var(--color-${statusColor[a.status] || "info"})`,
                  }}
                >
                  {a.status}
                </span>

                {/* Total */}
                <span className="hidden sm:block text-rose-gold font-medium">
                  {formatCurrency(a.totalAmount)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StylistScheduleView;
