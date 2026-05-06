// Server-side PDF generation for admin revenue reports.
// Uses pdfkit and pipes the document straight to the Express response, so the browser receives a download stream — no temp files on disk.

import PDFDocument from "pdfkit";

/**
 * Generate a revenue report PDF and stream it to res.
 *
 * @param {Object} options
 * @param {Object} options.res            Express response (we pipe to it)
 * @param {String} [options.title]        Report title
 * @param {String} options.dateRange      e.g. "Jan 01 2025 - Jan 31 2025"
 * @param {Number} options.totalRevenue   Grand total amount
 * @param {Number} options.totalBookings  Count of bookings in range
 * @param {Array}  options.rows           [{ date, bookingId, customer, services, status, amount }]
 */
export const generateRevenueReport = ({
  res,
  title = "Revenue Report",
  dateRange,
  totalRevenue,
  totalBookings,
  rows = [],
}) => {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  // Tell the browser this is an attachment so it triggers a download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="glowhaus-revenue-${Date.now()}.pdf"`,
  );

  doc.pipe(res);

  /* ───── Brand Header ───── */
  doc
    .fillColor("#b87a5e")
    .fontSize(28)
    .font("Helvetica-Bold")
    .text("GlowHaus", { align: "center" });
  doc
    .fontSize(9)
    .fillColor("#888")
    .font("Helvetica")
    .text("L U X U R Y · S A L O N", { align: "center", characterSpacing: 4 });
  doc.moveDown(1.5);

  /* ───── Report Title ───── */
  doc
    .fillColor("#000")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(title, { align: "center" });
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#555")
    .text(dateRange, { align: "center" });
  doc.moveDown(1);

  /* ───── Summary ───── */
  doc.fontSize(11).fillColor("#000");
  doc.text(`Total Bookings: ${totalBookings}`);
  doc.text(`Total Revenue: $${Number(totalRevenue).toFixed(2)}`);
  doc.moveDown(1);

  /* ───── Table Header ───── */
  const tableTop = doc.y;
  const colX = [40, 120, 200, 290, 420, 500];

  doc.rect(40, tableTop, 515, 20).fill("#b87a5e");
  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(10);
  doc.text("Date", colX[0] + 4, tableTop + 6);
  doc.text("Booking ID", colX[1] + 4, tableTop + 6);
  doc.text("Customer", colX[2] + 4, tableTop + 6);
  doc.text("Services", colX[3] + 4, tableTop + 6);
  doc.text("Status", colX[4] + 4, tableTop + 6);
  doc.text("Amount", colX[5] + 4, tableTop + 6);

  /* ───── Table Rows ───── */
  let y = tableTop + 24;
  doc.font("Helvetica").fontSize(9).fillColor("#000");

  rows.forEach((row, i) => {
    // New page if we're getting close to the bottom
    if (y > 760) {
      doc.addPage();
      y = 50;
    }

    // Zebra-striping
    if (i % 2 === 0) {
      doc.rect(40, y - 4, 515, 18).fill("#f5f0ec");
      doc.fillColor("#000");
    }

    doc.text(row.date, colX[0] + 4, y, { width: 76 });
    doc.text(row.bookingId, colX[1] + 4, y, { width: 76 });
    doc.text(row.customer, colX[2] + 4, y, { width: 86 });
    doc.text(row.services, colX[3] + 4, y, { width: 126 });
    doc.text(row.status, colX[4] + 4, y, { width: 76 });
    doc.text(`$${Number(row.amount).toFixed(2)}`, colX[5] + 4, y, {
      width: 50,
    });

    y += 18;
  });

  /* ───── Footer ───── */
  doc
    .fontSize(8)
    .fillColor("#888")
    .text(
      `Generated on ${new Date().toLocaleString()} • © ${new Date().getFullYear()} GlowHaus`,
      40,
      780,
      { align: "center", width: 515 },
    );

  doc.end();
};
