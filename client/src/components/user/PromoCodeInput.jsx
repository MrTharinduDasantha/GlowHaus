// "Got a promo code?" input + Apply button.
// Calls /api/promos/validate; on success, dispatches setPromo into Redux.

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { IoCloseCircle } from "react-icons/io5";
import { promoApi } from "../../api/promo.api.js";
import { selectBagTotal } from "../../app/features/bagSlice.js";
import { setPromo, clearPromo } from "../../app/features/bookingSlice.js";

const PromoCodeInput = () => {
  const dispatch = useDispatch();
  const subtotal = useSelector(selectBagTotal);
  const promo = useSelector((s) => s.booking.promo);

  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await promoApi.validate(code.trim().toUpperCase(), subtotal);
      dispatch(setPromo(res.data.data));
      toast.success("Promo applied!");
      setCode("");
      setOpen(false);
    } catch (err) {
      toast.error(err.userMessage || "Invalid promo code");
    } finally {
      setLoading(false);
    }
  };

  // Already-applied state
  if (promo) {
    return (
      <div className="flex items-center justify-between p-4 bg-bg-surface border border-rose-gold/40 rounded-xl">
        <div>
          <p className="text-xs text-text-muted">Promo Applied</p>
          <p className="font-medium text-rose-gold">{promo.code}</p>
        </div>
        <button
          onClick={() => dispatch(clearPromo())}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-danger transition-colors"
        >
          <IoCloseCircle size={18} /> Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-rose-gold hover:underline"
        >
          + Add a promo code
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="input-luxe sm:flex-1 uppercase tracking-wider"
              maxLength={20}
            />
            <button
              onClick={apply}
              disabled={loading || !code}
              className="btn-primary disabled:opacity-60"
            >
              {loading ? "Applying…" : "Apply"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setCode("");
              }}
              className="text-sm text-text-muted hover:text-text-primary px-3"
            >
              Cancel
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default PromoCodeInput;
