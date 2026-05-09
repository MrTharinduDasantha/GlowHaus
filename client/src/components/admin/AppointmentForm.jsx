// Walk-in / phone booking form — admin picks customer, services, stylist, date, time.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { bookingApi } from "../../api/booking.api.js";
import { serviceApi } from "../../api/service.api.js";
import { stylistApi } from "../../api/stylist.api.js";
import { userApi } from "../../api/user.api.js";
import { useTimeSlots } from "../../hooks/useTimeSlots.js";
import DatePicker from "../user/DatePicker.jsx";

const AppointmentForm = ({ onSuccess, onCancel }) => {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [customerMode, setCustomerMode] = useState("existing"); // existing | new
  const [customerId, setCustomerId] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [stylistId, setStylistId] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch options once
  useEffect(() => {
    serviceApi
      .list({ limit: 100 })
      .then((r) => setServices(r.data.data.services));
    stylistApi.list().then((r) => setStylists(r.data.data));
    userApi
      .listCustomers({ limit: 200 })
      .then((r) => setCustomers(r.data.data.customers));
  }, []);

  // Available slots
  const { slots, loading: slotsLoading } = useTimeSlots({
    stylistId,
    date,
    serviceIds: selectedServices,
  });

  const toggleService = (id) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServices.length || !stylistId || !date || !startTime) {
      return toast.error("Please complete every section");
    }
    if (customerMode === "existing" && !customerId) {
      return toast.error("Please select a customer");
    }
    if (customerMode === "new" && (!newCustomer.name || !newCustomer.email)) {
      return toast.error("Customer name and email are required");
    }

    setSubmitting(true);
    try {
      await bookingApi.createWalkIn({
        customerId: customerMode === "existing" ? customerId : undefined,
        newCustomer: customerMode === "new" ? newCustomer : undefined,
        serviceIds: selectedServices,
        stylistId,
        date: format(date, "yyyy-MM-dd"),
        startTime,
        notes,
      });
      toast.success("Walk-in booking created");
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Customer */}
      <div>
        <p className="eyebrow text-rose-gold mb-2">Customer</p>
        <div className="flex items-center gap-4 mb-3">
          {["existing", "new"].map((m) => (
            <label
              key={m}
              className="flex items-center gap-2 text-sm capitalize"
            >
              <input
                type="radio"
                checked={customerMode === m}
                onChange={() => setCustomerMode(m)}
                className="accent-rose-gold"
              />
              {m === "existing" ? "Existing customer" : "New customer"}
            </label>
          ))}
        </div>
        {customerMode === "existing" ? (
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="input-luxe"
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} — {c.email}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              placeholder="Full name *"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="input-luxe"
            />
            <input
              type="email"
              placeholder="Email *"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              className="input-luxe"
            />
            <input
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="input-luxe"
            />
          </div>
        )}
      </div>

      {/* Services */}
      <div>
        <p className="eyebrow text-rose-gold mb-2">Services</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-bg-elevated rounded-lg">
          {services.map((s) => (
            <label
              key={s._id}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-colors ${
                selectedServices.includes(s._id)
                  ? "bg-rose-gold/10 text-rose-gold"
                  : "hover:bg-bg-surface"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(s._id)}
                onChange={() => toggleService(s._id)}
                className="accent-rose-gold"
              />
              <span className="flex-1 truncate">{s.name}</span>
              <span className="text-xs text-text-muted">
                ${s.price} · {s.duration}m
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stylist */}
      <div>
        <p className="eyebrow text-rose-gold mb-2">Stylist</p>
        <select
          value={stylistId}
          onChange={(e) => setStylistId(e.target.value)}
          className="input-luxe"
        >
          <option value="">Select stylist</option>
          {stylists.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} — {s.expertise}
            </option>
          ))}
        </select>
      </div>

      {/* Date / time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="eyebrow text-rose-gold mb-2">Date</p>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <p className="eyebrow text-rose-gold mb-2">Time</p>
          {slotsLoading ? (
            <p className="text-text-muted text-sm">Loading slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-text-muted text-sm">
              Pick stylist + date + services first.
            </p>
          ) : (
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input-luxe"
            >
              <option value="">Select time</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="eyebrow text-rose-gold mb-2">Notes</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="input-luxe resize-none"
          placeholder="Internal notes (optional)"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary hover:bg-bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Walk-in"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
