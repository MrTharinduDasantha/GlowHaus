// Time-slot generation logic.
//
// Given a date, a stylist, the services they want, and salon settings, return the list of "HH:mm" slot start-times the customer can book.
//
// A slot is available if ALL of the following are true:
//   1. The salon is open that day
//   2. The stylist is working that day (and not on a special day-off)
//   3. The candidate window [slotStart, slotStart + totalDuration]
//      fits inside the intersection of salon hours AND stylist hours
//   4. The window does not overlap the stylist's break
//   5. The window does not overlap any existing booking
//      (we pad existing bookings by `cleaningGap` minutes for cleanup)
//   6. If the date is today, the slot is in the future

import { addMinutes, format, isAfter, isBefore } from "date-fns";

/* ───────────────────────── Helpers ───────────────────────── */

// Build a Date on `baseDate` set to "HH:mm"
const buildDateTime = (baseDate, timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const dt = new Date(baseDate);
  dt.setHours(hours, minutes, 0, 0);
  return dt;
};

// True if [aStart, aEnd) overlaps [bStart, bEnd)
const overlaps = (aStart, aEnd, bStart, bEnd) =>
  isBefore(aStart, bEnd) && isAfter(aEnd, bStart);

/* ───────────────────────── Public API ───────────────────────── */

/**
 * @param {Object}   params
 * @param {Date}     params.date              The day for which slots are requested
 * @param {Object}   params.stylist           Stylist doc (workingHours[], daysOff[])
 * @param {Array}    params.existingBookings  Bookings of that stylist on that date
 *                                            -> [{ startTime: Date, endTime: Date }]
 * @param {Number}   params.totalDuration     Sum of service durations in minutes
 * @param {Object}   params.businessHours     { mon:{open,close,closed}, tue:{...}, ... }
 * @param {Number}   [params.slotInterval=15] Granularity in minutes
 * @param {Number}   [params.cleaningGap=0]   Padding minutes between bookings
 * @returns {String[]} Array of "HH:mm" slot start-times
 */
export const generateAvailableSlots = ({
  date,
  stylist,
  existingBookings = [],
  totalDuration,
  businessHours,
  slotInterval = 15,
  cleaningGap = 0,
}) => {
  // 1. Day-of-week key: "mon", "tue", "wed", ...
  const dayKey = format(date, "EEE").toLowerCase().slice(0, 3);

  // 2. Stylist on a special day off?
  const dayStr = format(date, "yyyy-MM-dd");
  const isOnDayOff = (stylist.daysOff || []).some(
    (d) => format(new Date(d), "yyyy-MM-dd") === dayStr,
  );
  if (isOnDayOff) return [];

  // 3. Salon must be open
  const salonHours = businessHours?.[dayKey];
  if (!salonHours || salonHours.closed) return [];

  // 4. Stylist must be working
  const stylistDay = (stylist.workingHours || []).find(
    (wh) => wh.day === dayKey,
  );
  if (!stylistDay || stylistDay.closed) return [];

  // 5. Effective working window = INTERSECTION of salon hours & stylist hours
  const salonOpen = buildDateTime(date, salonHours.open);
  const salonClose = buildDateTime(date, salonHours.close);
  const stylistStart = buildDateTime(date, stylistDay.startTime);
  const stylistEnd = buildDateTime(date, stylistDay.endTime);

  const effectiveStart = isAfter(stylistStart, salonOpen)
    ? stylistStart
    : salonOpen;
  const effectiveEnd = isBefore(stylistEnd, salonClose)
    ? stylistEnd
    : salonClose;

  if (!isBefore(effectiveStart, effectiveEnd)) return [];

  // 6. Optional break window
  let breakStart = null;
  let breakEnd = null;
  if (stylistDay.breakStart && stylistDay.breakEnd) {
    breakStart = buildDateTime(date, stylistDay.breakStart);
    breakEnd = buildDateTime(date, stylistDay.breakEnd);
  }

  // 7. Walk the working window in `slotInterval` steps
  const slots = [];
  let cursor = new Date(effectiveStart);
  const now = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

  while (true) {
    const slotStart = new Date(cursor);
    const slotEnd = addMinutes(slotStart, totalDuration);

    // Stop if the candidate window would extend past the working window
    if (isAfter(slotEnd, effectiveEnd)) break;

    // Skip past slots when booking for today
    if (isToday && isBefore(slotStart, now)) {
      cursor = addMinutes(cursor, slotInterval);
      continue;
    }

    // Skip if it would overlap the stylist's break
    if (
      breakStart &&
      breakEnd &&
      overlaps(slotStart, slotEnd, breakStart, breakEnd)
    ) {
      cursor = addMinutes(cursor, slotInterval);
      continue;
    }

    // Skip if it overlaps any existing booking (pad both sides by cleaningGap)
    const conflict = existingBookings.some((b) => {
      const bStart = new Date(b.startTime);
      const bEnd = addMinutes(new Date(b.endTime), cleaningGap);
      const candEnd = addMinutes(slotEnd, cleaningGap);
      return overlaps(slotStart, candEnd, bStart, bEnd);
    });

    if (!conflict) {
      slots.push(format(slotStart, "HH:mm"));
    }

    cursor = addMinutes(cursor, slotInterval);
  }

  return slots;
};

/**
 * Compute booking end time given a start time and total duration in minutes.
 * Used when persisting a booking so we don't recompute it everywhere.
 */
export const computeEndTime = (startTime, durationMinutes) =>
  addMinutes(new Date(startTime), durationMinutes);
