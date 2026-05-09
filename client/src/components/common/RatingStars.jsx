// Star rating display + interactive picker.
// - Display mode: pass `value` only (read-only)
// - Interactive: pass `onChange` to enable click + hover preview

import { useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

const RatingStars = ({
  value = 0,
  onChange,
  size = 18,
  showNumber = false,
}) => {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const display = hover || value;

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-transform ${
            interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
          }`}
          style={{ color: "var(--color-rose-gold)" }}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          {star <= display ? (
            <IoStar size={size} />
          ) : (
            <IoStarOutline size={size} />
          )}
        </button>
      ))}
      {showNumber && value > 0 && (
        <span className="ml-1.5 text-sm text-text-secondary font-medium">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
