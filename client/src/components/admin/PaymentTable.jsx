// Stripe / cash payment table.

import { motion } from "framer-motion";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/formatCurrency.js";

const statusColor = {
  pending: "warning",
  succeeded: "success",
  failed: "danger",
  refunded: "info",
};

const PaymentTable = ({ payments = [], onRowClick }) => {
  return (
    <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-elevated text-text-muted text-left">
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-text-muted">
                  No payments to show.
                </td>
              </tr>
            ) : (
              payments.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => onRowClick?.(p)}
                  className="border-t border-line-soft cursor-pointer hover:bg-bg-elevated transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-rose-gold">
                    {p.booking?.bookingId || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-text-primary">{p.customer?.name}</p>
                    <p className="text-xs text-text-muted">
                      {p.customer?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize text-text-secondary">
                    {p.method}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                      style={{
                        background: `color-mix(in srgb, var(--color-${statusColor[p.status]}) 15%, transparent)`,
                        color: `var(--color-${statusColor[p.status]})`,
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {p.paidAt
                      ? format(new Date(p.paidAt), "MMM d, h:mm a")
                      : format(new Date(p.createdAt), "MMM d")}
                  </td>
                  <td className="px-4 py-3 text-right text-rose-gold font-medium">
                    {formatCurrency(p.amount)}
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

export default PaymentTable;
