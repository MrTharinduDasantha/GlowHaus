import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectMongoDB from "./configs/connectMongoDB.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

// Routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import categoryRoute from "./routes/category.route.js";
import serviceRoute from "./routes/service.route.js";
import stylistRoute from "./routes/stylist.route.js";
import scheduleRoute from "./routes/schedule.route.js";
import bookingRoute from "./routes/booking.route.js";
import timeSlotRoute from "./routes/timeSlot.route.js";
import reviewRoute from "./routes/review.route.js";
import favoriteRoute from "./routes/favorite.route.js";
import paymentRoute from "./routes/payment.route.js";
import stripeWebhookRoute from "./routes/stripeWebhook.route.js";
import promoRoute from "./routes/promo.route.js";
import galleryRoute from "./routes/gallery.route.js";
import settingsRoute from "./routes/settings.route.js";
import adminRoute from "./routes/admin.route.js";
import reportRoute from "./routes/report.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ─────────────────── Security & logging middleware ─────────────────── */
app.use(helmet());
app.use(morgan("dev"));

/* ─────────────────── CORS ─────────────────── */
// credentials:true is mandatory for the HTTP-only cookie auth to work.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

/* ─────────────────── Stripe webhook (RAW body — mount BEFORE json) ──── */
// Must come before express.json() — see header comment.
app.use("/api/stripe-webhook", stripeWebhookRoute);

/* ─────────────────── Body parsers (for every other route) ─────────────── */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

/* ─────────────────── Health check ─────────────────── */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "💅 GlowHaus Salon API is running",
    timestamp: new Date(),
  });
});

/* ─────────────────── API Routes ─────────────────── */
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/services", serviceRoute);
app.use("/api/stylists", stylistRoute);
app.use("/api/schedules", scheduleRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/time-slots", timeSlotRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/favorites", favoriteRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/promos", promoRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/reports", reportRoute);

/* ─────────────────── 404 handler (unknown route) ─────────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ─────────────────── Global error handler (LAST) ─────────────────── */
app.use(errorHandler);

/* ─────────────────── Start server after DB connection ─────────────────── */
const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`🚀 GlowHaus server running on port ${PORT}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
  });
};

startServer();
