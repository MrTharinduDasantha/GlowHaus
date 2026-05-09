// Top filter bar on the Services page — search input + category pills + sort.
// Pushes changes into the serviceSlice via setFilter.

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoSearch, IoClose } from "react-icons/io5";
import { setFilter, clearFilters } from "../../app/features/serviceSlice.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { categoryApi } from "../../api/category.api.js";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const ServiceFilterBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.services.filters);
  const [search, setSearch] = useState(filters.search || "");
  const [categories, setCategories] = useState([]);
  const debounced = useDebounce(search, 350);

  // Push debounced search into Redux
  useEffect(() => {
    if (debounced !== filters.search) {
      dispatch(setFilter({ search: debounced }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Load categories once for the pill row
  useEffect(() => {
    categoryApi
      .list({ activeOnly: "true" })
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  const hasActiveFilter =
    filters.search || filters.category || filters.sort !== "newest";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface border border-line-soft rounded-2xl p-4 md:p-5"
    >
      {/* Search row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <IoSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            size={18}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="input-luxe pl-11"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-rose-gold"
              aria-label="Clear search"
            >
              <IoClose size={18} />
            </button>
          )}
        </div>

        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
          className="input-luxe md:w-56"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => dispatch(setFilter({ category: "" }))}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${
            !filters.category
              ? "border-rose-gold text-rose-gold bg-rose-gold/5"
              : "border-line-soft text-text-secondary hover:border-rose-gold/50"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => dispatch(setFilter({ category: c.slug }))}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${
              filters.category === c.slug
                ? "border-rose-gold text-rose-gold bg-rose-gold/5"
                : "border-line-soft text-text-secondary hover:border-rose-gold/50"
            }`}
          >
            {c.name}
          </button>
        ))}

        {hasActiveFilter && (
          <button
            onClick={() => {
              setSearch("");
              dispatch(clearFilters());
            }}
            className="ml-auto shrink-0 text-xs text-rose-gold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceFilterBar;
