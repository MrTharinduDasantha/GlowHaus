// Booking-flow progress indicator — connected dots with rose-gold accents.
// Pass `steps` (array of labels) and `current` (1-indexed).

import { motion } from "framer-motion";

const StepIndicator = ({ steps = [], current = 1 }) => {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex items-center justify-between gap-2 min-w-max md:min-w-0">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isComplete = stepNum < current;
          const isCurrent = stepNum === current;

          return (
            <div key={label} className="flex items-center flex-1">
              {/* Dot */}
              <div className="flex flex-col items-center gap-2 relative">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor:
                      isComplete || isCurrent
                        ? "var(--color-rose-gold)"
                        : "var(--color-bg-elevated)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold border"
                  style={{
                    borderColor:
                      isComplete || isCurrent
                        ? "var(--color-rose-gold)"
                        : "var(--color-line-soft)",
                    color:
                      isComplete || isCurrent
                        ? "var(--color-bg-base)"
                        : "var(--color-text-secondary)",
                    boxShadow: isCurrent
                      ? "0 0 16px rgba(232, 180, 160, 0.4)"
                      : "none",
                  }}
                >
                  {isComplete ? "✓" : stepNum}
                </motion.div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isCurrent ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector line (skip after last) */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 -mt-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{ background: "var(--color-line-soft)" }}
                  />
                  <motion.div
                    className="absolute inset-0 origin-left"
                    initial={false}
                    animate={{ scaleX: isComplete ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ background: "var(--gradient-rose)" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
