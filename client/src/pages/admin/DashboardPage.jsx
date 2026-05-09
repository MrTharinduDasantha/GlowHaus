// Admin dashboard — pulls /api/admin/dashboard once, renders stats + charts + recent.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoCalendarOutline,
  IoCashOutline,
  IoPersonAddOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { format } from "date-fns";
import { adminApi } from "../../api/admin.api.js";
import StatsCard from "../../components/admin/StatsCard.jsx";
import RevenueChart from "../../components/admin/RevenueChart.jsx";
import BookingsStatusChart from "../../components/admin/BookingsStatusChart.jsx";
import TopServicesChart from "../../components/admin/TopServicesChart.jsx";
import Loader from "../../components/common/Loader.jsx";
import { toLocalDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data)
    return <Loader fullScreen={false} label="Loading dashboard" />;

  const { summary, recentBookings, charts } = data;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose-gold">Overview</p>
        <h1 className="font-display text-3xl md:text-4xl">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={IoCalendarOutline}
          label="Today's Appointments"
          value={summary.todaysAppointments}
          accent="rose-gold"
          index={0}
        />
        <StatsCard
          icon={IoCashOutline}
          label="Revenue Today"
          value={formatCurrency(summary.revenueToday)}
          hint={`This week: ${formatCurrency(summary.revenueWeek)}`}
          accent="success"
          index={1}
        />
        <StatsCard
          icon={IoPersonAddOutline}
          label="New Customers (Month)"
          value={summary.newCustomersThisMonth}
          accent="info"
          index={2}
        />
        <StatsCard
          icon={IoPeopleOutline}
          label="Active Stylists"
          value={summary.activeStylists}
          accent="soft-pink"
          index={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={charts.revenueLast7Days} />
        </div>
        <BookingsStatusChart data={charts.statusBreakdown} />
      </div>

      <TopServicesChart data={charts.topServices} />

      {/* Recent bookings */}
      <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-line-soft">
          <div>
            <p className="eyebrow text-rose-gold">Latest activity</p>
            <h3 className="font-display text-xl">Recent bookings</h3>
          </div>
          <Link
            to="/admin/appointments"
            className="text-sm text-rose-gold hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-elevated text-text-muted text-left">
                <th className="px-4 py-2.5 font-medium">Booking</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Stylist</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-muted">
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="border-t border-line-soft">
                    <td className="px-4 py-3 font-mono text-rose-gold">
                      {b.bookingId}
                    </td>
                    <td className="px-4 py-3">{b.customer?.name}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {b.stylist?.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {format(toLocalDate(b.startTime), "MMM d, h:mm a")}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-gold font-medium">
                      {formatCurrency(b.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
