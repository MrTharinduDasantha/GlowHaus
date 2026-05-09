// Cart — selected services, totals, promo code, "Continue" button.

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";

import StepIndicator from "../../components/common/StepIndicator.jsx";
import ServiceBagItem from "../../components/user/ServiceBagItem.jsx";
import FareSummary from "../../components/user/FareSummary.jsx";
import PromoCodeInput from "../../components/user/PromoCodeInput.jsx";
import {
  selectBagItems,
  selectBagTotal,
  selectBagDuration,
} from "../../app/features/bagSlice.js";
import { formatDuration } from "../../utils/formatDuration.js";
import emptyBag from "../../assets/empty-bag.png";

const steps = ["Service Bag", "Date & Stylist", "Confirm & Pay"];

const ServiceBagPage = () => {
  const navigate = useNavigate();
  const items = useSelector(selectBagItems);
  const subtotal = useSelector(selectBagTotal);
  const duration = useSelector(selectBagDuration);
  const promo = useSelector((s) => s.booking.promo);

  if (items.length === 0) {
    return (
      <div className="container-luxe py-16 text-center">
        <img src={emptyBag} alt="" className="w-40 mx-auto opacity-80 mb-5" />
        <p className="font-display text-2xl mb-2">Your bag is empty</p>
        <p className="text-text-muted mb-6">
          Pick a treatment and we'll handle the rest.
        </p>
        <Link to="/services" className="btn-primary">
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-16">
      <StepIndicator steps={steps} current={1} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <p className="eyebrow text-rose-gold mb-2">
            {items.length} service{items.length > 1 ? "s" : ""} ·{" "}
            {formatDuration(duration)}
          </p>
          <AnimatePresence>
            {items.map((item) => (
              <ServiceBagItem key={item._id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <PromoCodeInput />
          <FareSummary subtotal={subtotal} promo={promo} />
          <button
            onClick={() => navigate("/booking/datetime")}
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            Continue <IoArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceBagPage;
