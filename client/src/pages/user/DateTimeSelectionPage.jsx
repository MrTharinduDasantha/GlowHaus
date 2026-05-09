// Step 2 — pick stylist (if not already), date, and time slot.

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import StepIndicator from "../../components/common/StepIndicator.jsx";
import DatePicker from "../../components/user/DatePicker.jsx";
import TimeSlotPicker from "../../components/user/TimeSlotPicker.jsx";
import StylistSelector from "../../components/user/StylistSelector.jsx";

import {
  setStylist,
  setDate,
  setTime,
} from "../../app/features/bookingSlice.js";
import { selectBagItems } from "../../app/features/bagSlice.js";
import { stylistApi } from "../../api/stylist.api.js";
import { settingsApi } from "../../api/settings.api.js";
import { serviceApi } from "../../api/service.api.js";

const steps = ["Service Bag", "Date & Stylist", "Confirm & Pay"];

const DateTimeSelectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectBagItems);
  const { selectedStylist, selectedDate, selectedTime } = useSelector(
    (s) => s.booking,
  );

  const [eligibleStylists, setEligibleStylists] = useState([]);
  const [advanceDays, setAdvanceDays] = useState(30);
  const [loadingStylists, setLoadingStylists] = useState(true);

  // Bounce back if bag is empty
  useEffect(() => {
    if (items.length === 0) navigate("/bag", { replace: true });
  }, [items.length, navigate]);

  // Compute stylists who can do EVERY service in the bag
  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        // Pull each service's assignedStylists then intersect
        const fullServices = await Promise.all(
          items.map((i) => serviceApi.getById(i._id).then((r) => r.data.data)),
        );
        const sets = fullServices.map(
          (s) => new Set((s.assignedStylists || []).map((x) => x._id)),
        );
        // Intersection
        const intersection = sets.length
          ? [...sets[0]].filter((id) => sets.every((s) => s.has(id)))
          : [];

        const all = await stylistApi.list({ activeOnly: "true" });
        const filtered = all.data.data.filter((st) =>
          intersection.includes(st._id),
        );
        setEligibleStylists(filtered);
      } catch (e) {
        // empty list on failure
      } finally {
        setLoadingStylists(false);
      }
    };
    fetchEligibility();
  }, [items]);

  // Pull settings for advance booking limit
  useEffect(() => {
    settingsApi
      .get()
      .then((r) =>
        setAdvanceDays(r.data.data.bookingRules?.advanceBookingDays || 30),
      );
  }, []);

  const serviceIds = useMemo(() => items.map((i) => i._id), [items]);

  const canContinue = selectedStylist && selectedDate && selectedTime;

  return (
    <div className="container-luxe py-12 md:py-16">
      <StepIndicator steps={steps} current={2} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* LEFT — stylist + date */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-bg-surface border border-line-soft rounded-2xl"
          >
            <p className="eyebrow text-rose-gold mb-3">Stylist</p>
            {loadingStylists ? (
              <p className="text-text-muted text-sm">Loading…</p>
            ) : (
              <StylistSelector
                stylists={eligibleStylists}
                selectedId={selectedStylist?._id}
                onSelect={(s) => dispatch(setStylist(s))}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-5 bg-bg-surface border border-line-soft rounded-2xl"
          >
            <p className="eyebrow text-rose-gold mb-3">Date</p>
            <DatePicker
              inline
              value={selectedDate ? new Date(selectedDate) : null}
              advanceBookingDays={advanceDays}
              onChange={(d) =>
                dispatch(setDate(d ? d.toISOString().slice(0, 10) : null))
              }
            />
          </motion.div>
        </div>

        {/* RIGHT — slots */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-bg-surface border border-line-soft rounded-2xl"
        >
          <p className="eyebrow text-rose-gold mb-3">Time</p>
          <TimeSlotPicker
            stylistId={selectedStylist?._id}
            date={selectedDate}
            serviceIds={serviceIds}
            selectedTime={selectedTime}
            onSelect={(t) => dispatch(setTime(t))}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link to="/bag" className="btn-outline inline-flex items-center gap-2">
          <IoArrowBack /> Back
        </Link>
        <button
          disabled={!canContinue}
          onClick={() => navigate("/booking/summary")}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          Continue <IoArrowForward />
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelectionPage;
