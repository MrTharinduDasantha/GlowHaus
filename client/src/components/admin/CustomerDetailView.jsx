// Customer profile + booking history + lifetime stats.
// Pass `customer`, `bookings`, `stats` from parent.

import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoCashOutline,
  IoTrendingUpOutline,
  IoMailOutline,
  IoCallOutline,
} from "react-icons/io5";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatRelative, formatTimeAgo } from "../../utils/formatDate.js";
import StatsCard from "./StatsCard.jsx";

const CustomerDetailView = ({ customer, bookings = [], stats }) => {
  if (!customer) return null;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-bg-surface border border-line-soft rounded-2xl flex items-center gap-5"
      >
        {customer.profilePhoto?.url ? (
          <img
            src={customer.profilePhoto.url}
            alt={customer.name}
            className="w-20 h-20 rounded-full object-cover border border-rose-gold/30"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl"
            style={{
              background: "var(--gradient-rose)",
              color: "var(--color-bg-base)",
            }}
          >
            {customer.name?.[0]}
          </div>
        )}
        <div>
          <h2 className="font-display text-3xl">{customer.name}</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-secondary mt-1">
            <span className="flex items-center gap-1.5">
              <IoMailOutline className="text-rose-gold" /> {customer.email}
            </span>
            {customer.phone && (
              <span className="flex items-center gap-1.5">
                <IoCallOutline className="text-rose-gold" /> {customer.phone}
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-1">
            Joined {formatTimeAgo(customer.createdAt)}
          </p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={IoCashOutline}
          label="Lifetime Spend"
          value={formatCurrency(stats?.totalSpend || 0)}
          accent="rose-gold"
        />
        <StatsCard
          icon={IoCalendarOutline}
          label="Total Visits"
          value={stats?.totalVisits || 0}
          accent="info"
          index={1}
        />
        <StatsCard
          icon={IoTrendingUpOutline}
          label="Last Visit"
          value={stats?.lastVisit ? formatTimeAgo(stats.lastVisit) : "Never"}
          accent="success"
          index={2}
        />
      </div>

      {/* Booking history */}
      <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
        <p className="eyebrow text-rose-gold mb-4">Booking History</p>
        {bookings.length === 0 ? (
          <p className="text-text-muted text-sm">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {bookings.map((b) => (
              <li key={b._id} className="py-3 flex items-center gap-3">
                <span className="font-mono text-xs text-rose-gold">
                  {b.bookingId}
                </span>
                <span className="text-sm text-text-secondary truncate flex-1">
                  {b.services?.map((s) => s.name).join(", ")}
                </span>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {formatRelative(b.startTime)}
                </span>
                <span className="text-rose-gold font-medium">
                  {formatCurrency(b.totalAmount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailView;
