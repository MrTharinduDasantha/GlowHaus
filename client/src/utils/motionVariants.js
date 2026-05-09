// Reusable Framer-Motion variants — keeps animation logic out of components.
// Components import { fadeUp, staggerContainer, scaleIn, ... } and pass to motion.div.

/* ───────── Fade + slide-up ───────── */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ───────── Fade + slide-down ───────── */
export const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ───────── Pure fade ───────── */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/* ───────── Slide from left ───────── */
export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

/* ───────── Slide from right ───────── */
export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

/* ───────── Scale-in (modals / cards) ───────── */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ───────── Stagger container — children fan in one-by-one ───────── */
export const staggerContainer = (stagger = 0.08, delayChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/* ───────── Hover lift — for cards ───────── */
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/* ───────── Soft pulse (for "live" indicators) ───────── */
export const softPulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};
