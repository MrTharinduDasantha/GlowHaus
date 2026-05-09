// Settings — tabbed: General · Logo · Business Hours · Booking Rules · Notifications.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { settingsApi } from "../../api/settings.api.js";

const tabs = [
  { id: "general", label: "General" },
  { id: "logo", label: "Logo" },
  { id: "hours", label: "Business Hours" },
  { id: "rules", label: "Booking Rules" },
  { id: "notify", label: "Notifications" },
];

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabels = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const SettingsForm = () => {
  const [active, setActive] = useState("general");
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state mirrors settings document
  const [general, setGeneral] = useState({});
  const [hours, setHours] = useState({});
  const [rules, setRules] = useState({});
  const [notify, setNotify] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    settingsApi.get().then((r) => {
      const s = r.data.data;
      setSettings(s);
      setGeneral({
        salonName: s.salonName,
        address: s.address,
        phone: s.phone,
        email: s.email,
        socialLinks: s.socialLinks || {},
      });
      setHours(s.businessHours);
      setRules(s.bookingRules);
      setNotify(s.notifications);
      setLogoPreview(s.logo?.url || "");
    });
  }, []);

  const handleLogoFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setLogoFile(f);
      setLogoPreview(URL.createObjectURL(f));
    }
  };

  const saveGeneral = async () => {
    setSaving(true);
    try {
      await settingsApi.updateGeneral(general);
      toast.success("General settings saved");
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveLogo = async () => {
    if (!logoFile) return toast.error("Choose a logo file first");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      await settingsApi.updateLogo(fd);
      toast.success("Logo updated");
      setLogoFile(null);
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveHours = async () => {
    setSaving(true);
    try {
      await settingsApi.updateBusinessHours(hours);
      toast.success("Business hours saved");
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveRules = async () => {
    setSaving(true);
    try {
      await settingsApi.updateBookingRules(rules);
      toast.success("Booking rules saved");
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveNotify = async () => {
    setSaving(true);
    try {
      await settingsApi.updateNotifications(notify);
      toast.success("Notification settings saved");
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
      {/* Tab strip */}
      <div className="flex overflow-x-auto border-b border-line-soft">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`relative px-5 py-3 text-sm whitespace-nowrap transition-colors ${
              active === t.id
                ? "text-rose-gold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId="settings-tab"
                className="absolute inset-x-3 bottom-0 h-px"
                style={{ background: "var(--gradient-rose)" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* GENERAL */}
            {active === "general" && (
              <div className="space-y-4 max-w-2xl">
                <Field
                  label="Salon Name"
                  value={general.salonName}
                  onChange={(v) => setGeneral({ ...general, salonName: v })}
                />
                <Field
                  label="Address"
                  value={general.address}
                  onChange={(v) => setGeneral({ ...general, address: v })}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Phone"
                    value={general.phone}
                    onChange={(v) => setGeneral({ ...general, phone: v })}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={general.email}
                    onChange={(v) => setGeneral({ ...general, email: v })}
                  />
                </div>

                <p className="eyebrow text-rose-gold mt-2">Social Links</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["instagram", "facebook", "tiktok", "youtube"].map((k) => (
                    <Field
                      key={k}
                      label={k.charAt(0).toUpperCase() + k.slice(1)}
                      value={general.socialLinks?.[k] || ""}
                      onChange={(v) =>
                        setGeneral({
                          ...general,
                          socialLinks: { ...general.socialLinks, [k]: v },
                        })
                      }
                    />
                  ))}
                </div>

                <button
                  onClick={saveGeneral}
                  disabled={saving}
                  className="btn-primary mt-2 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save General Settings"}
                </button>
              </div>
            )}

            {/* LOGO */}
            {active === "logo" && (
              <div className="flex items-center gap-5">
                <div className="w-32 h-32 rounded-xl bg-bg-elevated border border-line-soft overflow-hidden flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-text-muted text-xs">No logo</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFile}
                    className="text-sm text-text-secondary file:btn-outline file:mr-3 mb-3"
                  />
                  <button
                    onClick={saveLogo}
                    disabled={saving || !logoFile}
                    className="btn-primary disabled:opacity-60"
                  >
                    {saving ? "Uploading…" : "Update Logo"}
                  </button>
                </div>
              </div>
            )}

            {/* BUSINESS HOURS */}
            {active === "hours" && (
              <div className="space-y-2 max-w-3xl">
                {days.map((d) => (
                  <div
                    key={d}
                    className="grid grid-cols-12 items-center gap-2 p-3 bg-bg-elevated border border-line-soft rounded-lg"
                  >
                    <div className="col-span-12 sm:col-span-3 font-medium">
                      {dayLabels[d]}
                    </div>
                    <label className="col-span-6 sm:col-span-2 flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={hours[d]?.closed || false}
                        onChange={(e) =>
                          setHours({
                            ...hours,
                            [d]: { ...hours[d], closed: e.target.checked },
                          })
                        }
                        className="accent-rose-gold"
                      />
                      Closed
                    </label>
                    <input
                      type="time"
                      value={hours[d]?.open || ""}
                      disabled={hours[d]?.closed}
                      onChange={(e) =>
                        setHours({
                          ...hours,
                          [d]: { ...hours[d], open: e.target.value },
                        })
                      }
                      className="col-span-6 sm:col-span-3 input-luxe py-2"
                    />
                    <input
                      type="time"
                      value={hours[d]?.close || ""}
                      disabled={hours[d]?.closed}
                      onChange={(e) =>
                        setHours({
                          ...hours,
                          [d]: { ...hours[d], close: e.target.value },
                        })
                      }
                      className="col-span-6 sm:col-span-3 input-luxe py-2"
                    />
                  </div>
                ))}
                <button
                  onClick={saveHours}
                  disabled={saving}
                  className="btn-primary mt-2 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Business Hours"}
                </button>
              </div>
            )}

            {/* BOOKING RULES */}
            {active === "rules" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Field
                  label="Advance booking limit (days)"
                  type="number"
                  value={rules.advanceBookingDays}
                  onChange={(v) =>
                    setRules({ ...rules, advanceBookingDays: Number(v) })
                  }
                />
                <Field
                  label="Cancellation notice (hours)"
                  type="number"
                  value={rules.cancellationNoticeHours}
                  onChange={(v) =>
                    setRules({ ...rules, cancellationNoticeHours: Number(v) })
                  }
                />
                <Field
                  label="Slot interval (minutes)"
                  type="number"
                  value={rules.slotInterval}
                  onChange={(v) =>
                    setRules({ ...rules, slotInterval: Number(v) })
                  }
                />
                <Field
                  label="Cleaning gap between bookings (minutes)"
                  type="number"
                  value={rules.cleaningGap}
                  onChange={(v) =>
                    setRules({ ...rules, cleaningGap: Number(v) })
                  }
                />
                <button
                  onClick={saveRules}
                  disabled={saving}
                  className="btn-primary md:col-span-2 mt-2 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Booking Rules"}
                </button>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {active === "notify" && (
              <div className="space-y-3 max-w-xl">
                {[
                  [
                    "sendBookingConfirmation",
                    "Send booking confirmation email",
                  ],
                  ["send24HourReminder", "Send 24-hour reminder email"],
                  ["sendStatusChangeEmail", "Send status-change emails"],
                ].map(([k, label]) => (
                  <label
                    key={k}
                    className="flex items-center gap-3 p-3 bg-bg-elevated border border-line-soft rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={notify[k] || false}
                      onChange={(e) =>
                        setNotify({ ...notify, [k]: e.target.checked })
                      }
                      className="accent-rose-gold w-4 h-4"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
                <button
                  onClick={saveNotify}
                  disabled={saving}
                  className="btn-primary mt-2 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Notification Settings"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Tiny labelled input helper
const Field = ({ label, value = "", onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-text-secondary mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-luxe"
    />
  </div>
);

export default SettingsForm;
