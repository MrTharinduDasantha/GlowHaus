// Contact info + simple "send us a note" form (mailto fallback if no backend endpoint).

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { settingsApi } from "../../api/settings.api.js";

const ContactPage = () => {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    settingsApi
      .get()
      .then((r) => setSettings(r.data.data))
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mailto fallback — no backend contact endpoint built
    const to = settings?.email || "hello@glowhaus.com";
    const subject = encodeURIComponent(form.subject || "Hello GlowHaus");
    const body = encodeURIComponent(
      `From: ${form.name} <${form.email}>\n\n${form.message}`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const days = [
    ["Mon–Fri", settings?.businessHours?.mon],
    ["Saturday", settings?.businessHours?.sat],
    ["Sunday", settings?.businessHours?.sun],
  ];

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="text-center mb-12">
        <p className="eyebrow text-rose-gold mb-2">Say hello</p>
        <h1 className="font-display text-4xl md:text-5xl">Get in touch</h1>
        <p className="text-text-secondary mt-3 max-w-xl mx-auto">
          We'd love to hear from you — whether it's about a booking, a special
          occasion, or just a question.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          {settings?.address && (
            <InfoRow
              icon={IoLocationOutline}
              label="Visit us"
              value={settings.address}
            />
          )}
          {settings?.phone && (
            <InfoRow
              icon={IoCallOutline}
              label="Call us"
              value={
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-rose-gold"
                >
                  {settings.phone}
                </a>
              }
            />
          )}
          {settings?.email && (
            <InfoRow
              icon={IoMailOutline}
              label="Email"
              value={
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-rose-gold"
                >
                  {settings.email}
                </a>
              }
            />
          )}
          <InfoRow
            icon={IoTimeOutline}
            label="Hours"
            value={
              <ul className="space-y-1">
                {days.map(([label, h], i) => (
                  <li key={i}>
                    {label}:{" "}
                    {h?.closed ? "Closed" : h ? `${h.open} – ${h.close}` : "—"}
                  </li>
                ))}
              </ul>
            }
          />
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="p-6 bg-bg-surface border border-line-soft rounded-2xl space-y-4"
        >
          <p className="eyebrow text-rose-gold">Send us a note</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="input-luxe"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="input-luxe"
            />
          </div>

          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            className="input-luxe"
          />
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us how we can help…"
            className="input-luxe resize-none"
          />

          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4 p-5 bg-bg-surface border border-line-soft rounded-2xl">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{
        background:
          "color-mix(in srgb, var(--color-rose-gold) 15%, transparent)",
        color: "var(--color-rose-gold)",
      }}
    >
      <Icon size={20} />
    </div>
    <div className="text-sm text-text-secondary">
      <p className="eyebrow text-rose-gold mb-1">{label}</p>
      <div className="text-text-primary">{value}</div>
    </div>
  </div>
);

export default ContactPage;
