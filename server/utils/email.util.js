// Nodemailer wrapper — sends transactional emails through SMTP.
// Four helpers cover every email the app sends:
//   1. sendOtpEmail                    -> forgot-password OTP
//   2. sendBookingConfirmationEmail    -> after successful Stripe payment
//   3. sendBookingReminderEmail        -> 24-hour reminder
//   4. sendBookingStatusChangeEmail    -> confirmed / cancelled / rescheduled / completed

import nodemailer from "nodemailer";

/* ───────────────────────── Transporter ───────────────────────── */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"GlowHaus Salon" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`;

// Internal: send an email and log failures (don't throw — emails are best-effort)
const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
  } catch (error) {
    console.error("✉️ Email send failed:", error.message);
  }
};

/* ───────────────────────── HTML Layout ───────────────────────── */

// Branded dark-theme wrapper for every email body
const wrapHtml = (innerHtml) => `
  <div style="background:#0f0f12;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#e8e8ec;">
    <div style="max-width:560px;margin:0 auto;background:#17171c;border:1px solid #2a2a32;border-radius:12px;overflow:hidden;">
      <div style="padding:24px;text-align:center;background:linear-gradient(135deg,#3a1f2a,#1c1218);">
        <h1 style="margin:0;color:#e8b4a0;font-family:Georgia,serif;letter-spacing:2px;">GlowHaus</h1>
        <p style="margin:6px 0 0;color:#8d8d96;font-size:12px;letter-spacing:3px;">L U X U R Y · S A L O N</p>
      </div>
      <div style="padding:28px;line-height:1.6;">${innerHtml}</div>
      <div style="padding:16px;text-align:center;font-size:12px;color:#6a6a72;border-top:1px solid #2a2a32;">
        © ${new Date().getFullYear()} GlowHaus. All rights reserved.
      </div>
    </div>
  </div>
`;

/* ───────────────────────── 1. OTP Email ───────────────────────── */

export const sendOtpEmail = async (to, otp) => {
  const html = wrapHtml(`
    <h2 style="color:#e8b4a0;margin-top:0;">Reset your password</h2>
    <p>Use the OTP below to reset your password. It is valid for <b>10 minutes</b>.</p>
    <div style="font-size:32px;letter-spacing:8px;text-align:center;margin:24px 0;color:#fff;font-weight:bold;">
      ${otp}
    </div>
    <p style="color:#8d8d96;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
  `);
  await sendMail({ to, subject: "Your GlowHaus password reset OTP", html });
};

/* ───────────────────── 2. Booking Confirmation ──────────────────── */

export const sendBookingConfirmationEmail = async (to, booking) => {
  const servicesHtml = booking.services
    .map((s) => `<li>${s.name} — ${s.duration} min</li>`)
    .join("");
  const html = wrapHtml(`
    <h2 style="color:#e8b4a0;margin-top:0;">Booking Confirmed ✨</h2>
    <p>Hi ${booking.customerName}, your appointment is confirmed.</p>
    <p><b>Booking ID:</b> ${booking.bookingId}</p>
    <p><b>Date:</b> ${booking.date} &nbsp;&nbsp; <b>Time:</b> ${booking.startTime}</p>
    <p><b>Stylist:</b> ${booking.stylistName}</p>
    <p><b>Services:</b></p>
    <ul>${servicesHtml}</ul>
    <p><b>Total:</b> $${booking.totalAmount}</p>
    <p style="color:#8d8d96;font-size:12px;margin-top:24px;">
      <b>Cancellation Policy:</b> Please cancel at least
      ${booking.cancellationNoticeHours || 24} hours before your appointment.
    </p>
  `);
  await sendMail({
    to,
    subject: `Booking ${booking.bookingId} confirmed`,
    html,
  });
};

/* ────────────────────── 3. 24-Hour Reminder ─────────────────────── */

export const sendBookingReminderEmail = async (to, booking) => {
  const html = wrapHtml(`
    <h2 style="color:#e8b4a0;margin-top:0;">See you tomorrow! 💆‍♀️</h2>
    <p>Just a friendly reminder of your appointment at GlowHaus.</p>
    <p><b>Booking ID:</b> ${booking.bookingId}</p>
    <p><b>Date:</b> ${booking.date} &nbsp;&nbsp; <b>Time:</b> ${booking.startTime}</p>
    <p><b>Stylist:</b> ${booking.stylistName}</p>
  `);
  await sendMail({
    to,
    subject: "Reminder: your GlowHaus appointment tomorrow",
    html,
  });
};

/* ───────────────────── 4. Status-Change Email ──────────────────── */

export const sendBookingStatusChangeEmail = async (to, booking, newStatus) => {
  const titleMap = {
    confirmed: "Your booking is confirmed",
    cancelled: "Your booking has been cancelled",
    rescheduled: "Your booking has been rescheduled",
    completed: "Thanks for visiting GlowHaus",
  };
  const subject = titleMap[newStatus] || "Booking update";

  const html = wrapHtml(`
    <h2 style="color:#e8b4a0;margin-top:0;">${subject}</h2>
    <p>Booking <b>${booking.bookingId}</b> status: <b>${newStatus.toUpperCase()}</b></p>
    <p><b>Date:</b> ${booking.date} &nbsp;&nbsp; <b>Time:</b> ${booking.startTime}</p>
    ${booking.reason ? `<p><b>Reason:</b> ${booking.reason}</p>` : ""}
    ${
      newStatus === "completed"
        ? `<p>We'd love to hear about your experience — please leave us a review!</p>`
        : ""
    }
  `);
  await sendMail({ to, subject, html });
};
