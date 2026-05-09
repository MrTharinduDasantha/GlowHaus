// Customer list with search.

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useDebounce } from "../../hooks/useDebounce.js";
import { formatTimeAgo } from "../../utils/formatDate.js";
import Loader from "../common/Loader.jsx";

const CustomerTable = ({
  customers = [],
  onSearchChange,
  onRowClick,
  onToggleBlock,
  isLoading,
}) => {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 350);

  useEffect(() => {
    onSearchChange?.(debounced);
  }, [debounced]);

  return (
    <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-line-soft">
        <div className="relative max-w-md">
          <IoSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-luxe pl-11!"
          />

          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-rose-gold/30 border-t-rose-gold rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-elevated text-text-muted text-left">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-text-muted">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <motion.tr
                  key={c._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-line-soft hover:bg-bg-elevated transition-colors"
                >
                  <td
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => onRowClick?.(c)}
                  >
                    <div className="flex items-center gap-3">
                      {c.profilePhoto?.url ? (
                        <img
                          src={c.profilePhoto.url}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-rose-gold font-display">
                          {c.name?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-text-primary">{c.name}</p>
                        <p className="text-xs text-text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {c.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {formatTimeAgo(c.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {c.isBlocked ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-danger/10 text-danger border border-danger/30">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/30">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBlock?.(c);
                      }}
                      className="text-text-secondary hover:text-rose-gold"
                      aria-label={c.isBlocked ? "Unblock" : "Block"}
                    >
                      {c.isBlocked ? (
                        <FaToggleOff size={18} />
                      ) : (
                        <FaToggleOn size={18} />
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
