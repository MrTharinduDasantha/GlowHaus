// Dashboard summary card — icon, label, value, optional trend %.

import { motion } from "framer-motion";

const StatsCard = ({
  icon: Icon,
  label,
  value,
  hint,
  accent = "rose-gold",
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="relative p-5 bg-bg-surface border border-line-soft rounded-2xl overflow-hidden group"
    >
      {/* Decorative glow on hover */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-2xl"
        style={{ background: `var(--color-${accent})` }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <p className="eyebrow text-text-muted">{label}</p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `color-mix(in srgb, var(--color-${accent}) 15%, transparent)`,
            color: `var(--color-${accent})`,
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <p className="font-display text-3xl text-text-primary leading-none">
        {value}
      </p>
      {hint && <p className="text-xs text-text-muted mt-2">{hint}</p>}
    </motion.div>
  );
};

export default StatsCard;
