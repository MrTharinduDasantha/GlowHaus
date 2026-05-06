// Admin dashboard controller.
// Endpoint: GET /api/admin/dashboard  → all stats + chart data in one call

import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Stylist from "../models/stylist.model.js";
import Payment from "../models/payment.model.js";
import { sendSuccess } from "../utils/response.util.js";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  format,
} from "date-fns";

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const monthStart = startOfMonth(now);
    const last7DaysStart = startOfDay(subDays(now, 6)); // 7-day window incl. today

    /* ── Run all stats in parallel for speed ── */
    const [
      todaysAppointments,
      revenueDay,
      revenueWeek,
      revenueMonth,
      newCustomersThisMonth,
      activeStylists,
      recentBookings,
      statusBreakdown,
      topServices,
      revenueLast7Days,
    ] = await Promise.all([
      // 1) Today's appointments (excludes cancelled)
      Booking.countDocuments({
        startTime: { $gte: todayStart, $lte: todayEnd },
        status: { $in: ["pending", "confirmed", "completed"] },
      }),

      // 2) Revenue today (only succeeded payments)
      Payment.aggregate([
        {
          $match: {
            status: "succeeded",
            paidAt: { $gte: todayStart, $lte: todayEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // 3) Revenue this week
      Payment.aggregate([
        { $match: { status: "succeeded", paidAt: { $gte: weekStart } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // 4) Revenue this month
      Payment.aggregate([
        { $match: { status: "succeeded", paidAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // 5) New customers this month
      User.countDocuments({
        role: "customer",
        createdAt: { $gte: monthStart },
      }),

      // 6) Active stylists
      Stylist.countDocuments({ isActive: true }),

      // 7) Recent bookings (last 5) — for the dashboard table
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customer", "name email")
        .populate("stylist", "name"),

      // 8) Status breakdown (pie chart)
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      // 9) Top 5 booked services (bar chart) — unwind the services array
      Booking.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$services" },
        {
          $group: {
            _id: "$services.service",
            name: { $first: "$services.name" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // 10) Revenue per day for last 7 days (line/bar chart)
      Payment.aggregate([
        {
          $match: {
            status: "succeeded",
            paidAt: { $gte: last7DaysStart, $lte: todayEnd },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    /* ── Fill in missing days in last-7-days chart with 0 ── */
    const last7Series = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(now, i);
      const key = format(day, "yyyy-MM-dd");
      const found = revenueLast7Days.find((r) => r._id === key);
      last7Series.push({
        date: key,
        label: format(day, "EEE"),
        revenue: found ? found.total : 0,
      });
    }

    return sendSuccess(res, 200, "Dashboard stats fetched", {
      summary: {
        todaysAppointments,
        revenueToday: revenueDay[0]?.total || 0,
        revenueWeek: revenueWeek[0]?.total || 0,
        revenueMonth: revenueMonth[0]?.total || 0,
        newCustomersThisMonth,
        activeStylists,
      },
      recentBookings,
      charts: {
        statusBreakdown, // [{ _id: "confirmed", count: 12 }, ...]
        topServices, // [{ _id, name, count }, ...]
        revenueLast7Days: last7Series,
      },
    });
  } catch (error) {
    next(error);
  }
};
