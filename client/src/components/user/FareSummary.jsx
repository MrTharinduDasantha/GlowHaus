// Subtotal + promo discount + total breakdown.
// Reused on bag, summary, and confirmation pages.

import { formatCurrency } from "../../utils/formatCurrency.js";

const Row = ({ label, value, accent = false, big = false }) => (
  <div
    className={`flex items-center justify-between ${
      big ? "pt-3 mt-3 border-t border-line-soft" : "py-1"
    }`}
  >
    <span
      className={
        big
          ? "font-display text-lg"
          : accent
            ? "text-rose-gold text-sm"
            : "text-text-secondary text-sm"
      }
    >
      {label}
    </span>
    <span
      className={
        big
          ? "font-display text-2xl text-rose-gold"
          : accent
            ? "text-rose-gold font-medium text-sm"
            : "text-text-primary text-sm"
      }
    >
      {value}
    </span>
  </div>
);

const FareSummary = ({ subtotal = 0, promo = null }) => {
  const discount = promo?.discount || 0;
  const total = promo?.newTotal !== undefined ? promo.newTotal : subtotal;

  return (
    <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
      <p className="eyebrow text-rose-gold mb-3">Fare Summary</p>
      <Row label="Subtotal" value={formatCurrency(subtotal)} />
      {promo && (
        <Row
          label={`Promo — ${promo.code}`}
          value={`− ${formatCurrency(discount)}`}
          accent
        />
      )}
      <Row label="Total" value={formatCurrency(total)} big />
    </div>
  );
};

export default FareSummary;
