// Simple "fade-up on scroll into view" helper — uses IntersectionObserver.
// Returns a ref + a boolean. Apply ref to the element and use the boolean to drive Framer-Motion `animate` / Tailwind classes.

import { useEffect, useRef, useState } from "react";

export const useScrollAnimation = ({
  threshold = 0.15,
  triggerOnce = true,
} = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.unobserve(node);
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return [ref, inView];
};
