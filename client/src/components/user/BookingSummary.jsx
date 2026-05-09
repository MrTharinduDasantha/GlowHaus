// Pre-checkout summary — services, stylist, date/time, fare breakdown.
// Pure presentational; pass everything as props.

import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { format, parse } from "date-fns";
import { formatDuration } from "../../utils/formatDuration.js";
import { formatRelative } from "../../utils/formatDate.js";
import FareSummary from "./FareSummary.jsx";

const BookingSummary = ({
  bagItems = [],
  stylist,
  date,
  time,
  promo,
  totalDuration,
}) => {
  const subtotal = bagItems.reduce((sum, i) => sum + i.price, 0);
  const startDateTime = date && time ? new Date(`${date}T${time}:00`) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Services */}
      <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
        <p className="eyebrow text-rose-gold mb-3">Your Services</p>
        <ul className="divide-y divide-line-soft">
          {bagItems.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-text-primary">{item.name}</p>
                <p className="text-xs text-text-muted">
                  {formatDuration(item.duration)}
                </p>
              </div>
              <span className="text-rose-gold font-medium">
                ${item.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Appointment details */}
      <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
        <p className="eyebrow text-rose-gold mb-3">Appointment</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <IoPersonOutline className="text-rose-gold mt-0.5" size={18} />
            <div>
              <p className="text-xs text-text-muted">Stylist</p>
              <p className="text-sm text-text-primary">
                {stylist?.name || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IoCalendarOutline className="text-rose-gold mt-0.5" size={18} />
            <div>
              <p className="text-xs text-text-muted">Date & Time</p>
              <p className="text-sm text-text-primary">
                {startDateTime ? formatRelative(startDateTime) : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IoTimeOutline className="text-rose-gold mt-0.5" size={18} />
            <div>
              <p className="text-xs text-text-muted">Total Duration</p>
              <p className="text-sm text-text-primary">
                {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fare breakdown */}
      <FareSummary subtotal={subtotal} promo={promo} />
    </motion.div>
  );
};

export default BookingSummary;
