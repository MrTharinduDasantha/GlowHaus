// Payment history table with status / method filters.

import { useEffect, useState } from "react";
import PaymentTable from "../../components/admin/PaymentTable.jsx";
import { paymentApi } from "../../api/payment.api.js";

const statusFilters = ["all", "pending", "succeeded", "failed", "refunded"];
const methodFilters = ["all", "stripe", "cash"];

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {};
        if (status !== "all") params.status = status;
        if (method !== "all") params.method = method;
        const res = await paymentApi.listAll({ ...params, limit: 100 });
        setPayments(res.data.data.payments);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [status, method]);

  const Pill = ({ value, options, onChange, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">{label}:</span>
      <div className="flex gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-3 py-1 rounded-full text-xs capitalize border transition-colors ${
              value === o
                ? "border-rose-gold text-rose-gold bg-rose-gold/5"
                : "border-line-soft text-text-secondary hover:border-rose-gold/40"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose-gold">Finance</p>
        <h1 className="font-display text-3xl md:text-4xl">Payments</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-bg-surface border border-line-soft rounded-2xl">
        <Pill
          value={status}
          options={statusFilters}
          onChange={setStatus}
          label="Status"
        />
        <Pill
          value={method}
          options={methodFilters}
          onChange={setMethod}
          label="Method"
        />
      </div>

      {loading ? (
        <p className="text-text-muted">Loading…</p>
      ) : (
        <PaymentTable payments={payments} />
      )}
    </div>
  );
};

export default PaymentsPage;
