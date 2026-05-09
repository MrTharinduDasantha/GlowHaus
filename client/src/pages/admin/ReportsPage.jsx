// Revenue report + top services + PDF export.

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import ReportExportBtn from "../../components/admin/ReportExportBtn.jsx";
import TopServicesChart from "../../components/admin/TopServicesChart.jsx";
import { reportApi } from "../../api/report.api.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const ReportsPage = () => {
  const [from, setFrom] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd"),
  );
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [revenue, setRevenue] = useState(null);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rev, top] = await Promise.all([
        reportApi.getRevenue({ from, to }),
        reportApi.getTopServices({ from, to, limit: 5 }),
      ]);
      setRevenue(rev.data.data);
      setTopServices(top.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose-gold">Insights</p>
        <h1 className="font-display text-3xl md:text-4xl">Reports</h1>
      </div>

      {/* Filter row */}
      <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-text-muted mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-luxe py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input-luxe py-2"
          />
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? "Loading…" : "Apply"}
        </button>
        <div className="ml-auto">
          <ReportExportBtn />
        </div>
      </div>

      {/* Summary */}
      {revenue && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
            <p className="eyebrow text-rose-gold mb-1">Total Revenue</p>
            <p className="font-display text-4xl text-rose-gold">
              {formatCurrency(revenue.totalRevenue)}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {revenue.totalBookings} bookings · {from} → {to}
            </p>
          </div>
          <TopServicesChart data={topServices} />
        </div>
      )}

      {/* Detail table */}
      {revenue && revenue.rows.length > 0 && (
        <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-line-soft">
            <p className="eyebrow text-rose-gold">Detail</p>
            <h3 className="font-display text-xl">Booking-level revenue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-elevated text-text-muted text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Booking ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Services</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {revenue.rows.map((r, i) => (
                  <tr key={i} className="border-t border-line-soft">
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="px-4 py-3 font-mono text-rose-gold">
                      {r.bookingId}
                    </td>
                    <td className="px-4 py-3">{r.customer}</td>
                    <td className="px-4 py-3 text-text-secondary truncate max-w-xs">
                      {r.services}
                    </td>
                    <td className="px-4 py-3 capitalize text-text-secondary">
                      {r.status}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-gold font-medium">
                      {formatCurrency(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
