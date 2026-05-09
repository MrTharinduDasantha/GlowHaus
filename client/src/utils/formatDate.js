// Date formatting helpers — wrap date-fns for consistent display strings.

import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";

// "Mon, Jan 15 2025"
export const formatDateShort = (date) =>
  date ? format(new Date(date), "EEE, MMM d yyyy") : "";

// "Monday, January 15, 2025"
export const formatDateLong = (date) =>
  date ? format(new Date(date), "EEEE, MMMM d, yyyy") : "";

// "3:45 PM"
export const formatTime = (date) =>
  date ? format(new Date(date), "h:mm a") : "";

// "Jan 15, 3:45 PM"
export const formatDateTime = (date) =>
  date ? format(new Date(date), "MMM d, h:mm a") : "";

// "Today at 3:45 PM" / "Tomorrow at 10:00 AM" / "Mon, Jan 15 at 3:45 PM"
export const formatRelative = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return `Today at ${formatTime(d)}`;
  if (isTomorrow(d)) return `Tomorrow at ${formatTime(d)}`;
  if (isYesterday(d)) return `Yesterday at ${formatTime(d)}`;
  return `${formatDateShort(d)} at ${formatTime(d)}`;
};

// "5 minutes ago" / "in 2 hours"
export const formatTimeAgo = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "";

// ISO date for inputs / API calls — "2025-01-15"
export const toIsoDate = (date) =>
  date ? format(new Date(date), "yyyy-MM-dd") : "";
