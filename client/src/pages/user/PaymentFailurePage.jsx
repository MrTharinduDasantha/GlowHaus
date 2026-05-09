// Stripe redirects here on cancel.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";

const PaymentFailurePage = () => {
  return (
    <div className="container-luxe py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center p-8 bg-bg-surface border border-line-soft rounded-2xl"
      >
        <div
          className="inline-flex w-20 h-20 rounded-full items-center justify-center mb-5"
          style={{
            background:
              "color-mix(in srgb, var(--color-danger) 15%, transparent)",
          }}
        >
          <IoCloseCircle size={48} className="text-danger" />
        </div>
        <p className="eyebrow text-rose-gold mb-2">Payment cancelled</p>
        <h1 className="font-display text-3xl mb-3">No worries</h1>
        <p className="text-text-secondary mb-6 leading-relaxed">
          Your booking was not completed. Your time slot is held for a few more
          minutes if you'd like to try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/bag" className="btn-primary">
            Try Again
          </Link>
          <Link to="/services" className="btn-outline">
            Browse Services
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailurePage;
