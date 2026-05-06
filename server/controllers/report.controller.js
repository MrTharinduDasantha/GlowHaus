// Reports controller — admin-only.
// Endpoints:
//   GET /api/reports/revenue            — JSON revenue report (filterable)
//   GET /api/reports/revenue/pdf        — same data as a PDF download
//   GET /api/reports/top-services       — top services in a date range
//   GET /api/reports/customer-stats/:id — total spend / visits / last visit (per customer)

import Booking from "../models/booking.model.js";
import Payment from "../models/payment.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { generateRevenueReport } from "../utils/pdf.util.js";
import { startOfDay, endOfDay, format } from "date-fns";

/* ────────── Internal: build revenue rows from bookings ────────── */
async function buildRevenueRows({ from, to }) {
  const filter = {
    status: { $in: ["confirmed", "completed"] },
  };
  if (from || to) {
    filter.startTime = {};
    if (from) filter.startTime.$gte = startOfDay(new Date(from));
    if (to) filter.startTime.$lte = endOfDay(new Date(to));
  }

  const bookings = await Booking.find(filter)
    .sort({ startTime: 1 })
    .populate("payment", "status method amount paidAt");

  const rows = bookings.map((b) => ({
    date: format(new Date(b.startTime), "yyyy-MM-dd"),
    bookingId: b.bookingId,
    customer: b.customerName,
    services: b.services.map((s) => s.name).join(", "),
    status: b.status,
    amount: b.totalAmount,
    paid: b.payment?.status === "succeeded",
  }));

  // Total revenue counts only succeeded payments
  const totalRevenue = rows
    .filter((r) => r.paid)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return { rows, totalRevenue, totalBookings: rows.length };
}

/* ────────── REVENUE — JSON ────────── */

export const getRevenueReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const { rows, totalRevenue, totalBookings } = await buildRevenueRows({
      from,
      to,
    });
    return sendSuccess(res, 200, "Revenue report generated", {
      rows,
      totalRevenue,
      totalBookings,
      from: from || null,
      to: to || null,
    });
  } catch (error) {
    next(error);
  }
};

/* ────────── REVENUE — PDF DOWNLOAD ────────── */

export const downloadRevenueReportPdf = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const { rows, totalRevenue, totalBookings } = await buildRevenueRows({
      from,
      to,
    });

    const dateRange =
      from && to
        ? `${format(new Date(from), "MMM d yyyy")} - ${format(new Date(to), "MMM d yyyy")}`
        : "All time";

    // generateRevenueReport pipes the PDF into the response itself —
    // so we don't call sendSuccess here.
    generateRevenueReport({
      res,
      title: "Revenue Report",
      dateRange,
      totalRevenue,
      totalBookings,
      rows,
    });
  } catch (error) {
    next(error);
  }
};

/* ────────── TOP SERVICES IN RANGE ────────── */

export const getTopServicesReport = async (req, res, next) => {
  try {
    const { from, to, limit = 10 } = req.query;
    const match = { status: { $ne: "cancelled" } };
    if (from || to) {
      match.startTime = {};
      if (from) match.startTime.$gte = startOfDay(new Date(from));
      if (to) match.startTime.$lte = endOfDay(new Date(to));
    }

    const top = await Booking.aggregate([
      { $match: match },
      { $unwind: "$services" },
      {
        $group: {
          _id: "$services.service",
          name: { $first: "$services.name" },
          bookings: { $sum: 1 },
          revenue: { $sum: "$services.price" },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: Number(limit) },
    ]);

    return sendSuccess(res, 200, "Top services fetched", top);
  } catch (error) {
    next(error);
  }
};

/* ────────── CUSTOMER STATS (total spend / visits / last visit) ────────── */

export const getCustomerStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Run all three counts in one aggregation pipeline
    const [stats] = await Booking.aggregate([
      {
        $match: {
          customer: new (await import("mongoose")).default.Types.ObjectId(id),
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: "$customer",
          totalSpend: { $sum: "$totalAmount" },
          totalVisits: { $sum: 1 },
          lastVisit: { $max: "$startTime" },
        },
      },
    ]);

    if (!stats) {
      return sendSuccess(res, 200, "No bookings yet", {
        totalSpend: 0,
        totalVisits: 0,
        lastVisit: null,
      });
    }

    return sendSuccess(res, 200, "Customer stats fetched", {
      totalSpend: stats.totalSpend,
      totalVisits: stats.totalVisits,
      lastVisit: stats.lastVisit,
    });
  } catch (error) {
    next(error);
  }
};
