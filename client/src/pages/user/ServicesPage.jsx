// Browse all services with filters, search, sort, pagination.

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import ServiceFilterBar from "../../components/user/ServiceFilterBar.jsx";
import ServiceCard from "../../components/user/ServiceCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import {
  fetchServices,
  setFilter,
  setPage,
} from "../../app/features/serviceSlice.js";

const ServicesPage = () => {
  const dispatch = useDispatch();
  const { list, total, pages, filters, loading } = useSelector(
    (s) => s.services,
  );
  const [searchParams] = useSearchParams();

  // Initial filter from ?category=
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && filters.category !== category) {
      dispatch(setFilter({ category }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when filters / page change
  useEffect(() => {
    dispatch(fetchServices({ ...filters, limit: 12 }));
  }, [filters, dispatch]);

  return (
    <div className="container-luxe py-12 md:py-16">
      {/* Page header */}
      <div className="text-center mb-10">
        <p className="eyebrow text-rose-gold mb-2">Our Menu</p>
        <h1 className="font-display text-4xl md:text-5xl">Services</h1>
        <p className="text-text-secondary mt-3 max-w-xl mx-auto">
          From hair and skin to nails and bridal — discover treatments designed
          around how you want to feel.
        </p>
      </div>

      {/* Filter bar */}
      <ServiceFilterBar />

      {/* Results meta */}
      <div className="flex items-center justify-between mt-6 mb-5 text-sm text-text-muted">
        <span>
          {loading ? "Loading…" : `${total} service${total !== 1 ? "s" : ""}`}
        </span>
        <span>
          Page {filters.page} of {pages || 1}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <Loader fullScreen={false} />
      ) : list.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          No services match your filters.
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {list.map((s, i) => (
            <ServiceCard key={s._id} service={s} index={i} />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === filters.page;
            return (
              <button
                key={pageNum}
                onClick={() => dispatch(setPage(pageNum))}
                className={`w-9 h-9 rounded-full text-sm transition-colors ${
                  isActive
                    ? "text-bg-base"
                    : "text-text-secondary hover:text-rose-gold border border-line-soft"
                }`}
                style={isActive ? { background: "var(--gradient-rose)" } : {}}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
