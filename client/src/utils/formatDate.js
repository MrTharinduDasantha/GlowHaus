// Date formatting helpers — wrap date-fns for consistent display strings.

import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";

/**
 * Creates a Date object that interprets the input as LOCAL time.
 * - If a string is passed, the timezone info is stripped so the date/time is treated exactly as written (salon local time).
 * - If a Date object is passed, it's returned unchanged (already local).
 */
export const toLocalDate = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;
  if (typeof dateInput !== "string") return null;

  const clean = dateInput
    .replace("Z", "")
    .replace(/[+-]\d{2}:\d{2}$/, "")
    .split(".")[0];
  return new Date(clean);
};

// "Mon, Jan 15 2025"
export const formatDateShort = (date) => {
  const d = toLocalDate(date);
  return d ? format(d, "EEE, MMM d yyyy") : "";
};

// "Monday, January 15, 2025"
export const formatDateLong = (date) => {
  const d = toLocalDate(date);
  return d ? format(d, "EEEE, MMMM d, yyyy") : "";
};

// "3:45 PM"
export const formatTime = (date) => {
  const d = toLocalDate(date);
  return d ? format(d, "h:mm a") : "";
};

// "Jan 15, 3:45 PM"
export const formatDateTime = (date) => {
  const d = toLocalDate(date);
  return d ? format(d, "MMM d, h:mm a") : "";
};

// "Today at 3:45 PM" / "Tomorrow at 10:00 AM" / "Mon, Jan 15 at 3:45 PM"
export const formatRelative = (date) => {
  const d = toLocalDate(date);
  if (!d) return "";
  if (isToday(d)) return `Today at ${formatTime(date)}`;
  if (isTomorrow(d)) return `Tomorrow at ${formatTime(date)}`;
  if (isYesterday(d)) return `Yesterday at ${formatTime(date)}`;
  return `${formatDateShort(date)} at ${formatTime(date)}`;
};

// "5 minutes ago" / "in 2 hours"
export const formatTimeAgo = (date) => {
  const d = toLocalDate(date);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : "";
};

// ISO date for inputs / API calls — "2025-01-15"
export const toIsoDate = (date) => {
  const d = toLocalDate(date);
  return d ? format(d, "yyyy-MM-dd") : "";
};
