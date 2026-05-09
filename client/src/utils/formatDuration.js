// Human-friendly duration string — service durations are stored in MINUTES.

export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return "0 min";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

// Compact variant for tight spaces — "1h 30m"
export const formatDurationCompact = (minutes) => {
  if (!minutes || minutes < 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
