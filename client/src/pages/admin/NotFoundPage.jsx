// Shared 404 page — used by both customer and admin routes.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import notFound from "../../assets/not-found.png";

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container-luxe py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <img src={notFound} alt="" className="w-48 mx-auto mb-6 opacity-90" />
        <p className="eyebrow text-rose-gold mb-2">404</p>
        <h1 className="font-display text-5xl md:text-6xl mb-3">
          Lost in the salon
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist, or has moved. Let's get you
          back somewhere familiar.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
          <Link to="/services" className="btn-outline">
            Browse Services
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
