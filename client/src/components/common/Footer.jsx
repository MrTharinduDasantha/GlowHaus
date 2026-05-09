// Customer-facing footer — three-column layout collapsing to single column on mobile.
// Pulls live salon settings (address, phone, social links) from the API.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTiktok,
  IoLogoYoutube,
} from "react-icons/io5";
import { settingsApi } from "../../api/settings.api.js";
import logoLight from "../../assets/logo-light.png";

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  const social = settings?.socialLinks || {};

  return (
    <footer className="relative mt-24 border-t border-line-soft">
      {/* Top decorative gradient line */}
      <div className="divider-luxe" />

      <div className="container-luxe py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <img src={logoLight} alt="GlowHaus" className="h-10 mb-4" />
          <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
            A women-only luxury salon dedicated to making every visit a moment
            of beauty, calm, and quiet indulgence.
          </p>
          <div className="flex items-center gap-4">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-rose-gold transition-colors"
              >
                <IoLogoInstagram size={20} />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-rose-gold transition-colors"
              >
                <IoLogoFacebook size={20} />
              </a>
            )}
            {social.tiktok && (
              <a
                href={social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-rose-gold transition-colors"
              >
                <IoLogoTiktok size={20} />
              </a>
            )}
            {social.youtube && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-rose-gold transition-colors"
              >
                <IoLogoYoutube size={20} />
              </a>
            )}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p className="eyebrow mb-5">Explore</p>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              ["Services", "/services"],
              ["Stylists", "/stylists"],
              ["Gallery", "/gallery"],
              ["About Us", "/about"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  to={href}
                  className="text-text-secondary hover:text-rose-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="eyebrow mb-5">Visit Us</p>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            {settings?.address && (
              <li className="flex gap-3">
                <IoLocationOutline
                  className="shrink-0 mt-0.5 text-rose-gold"
                  size={18}
                />
                <span>{settings.address}</span>
              </li>
            )}
            {settings?.phone && (
              <li className="flex gap-3">
                <IoCallOutline
                  className="shrink-0 mt-0.5 text-rose-gold"
                  size={18}
                />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-rose-gold"
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex gap-3">
                <IoMailOutline
                  className="shrink-0 mt-0.5 text-rose-gold"
                  size={18}
                />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-rose-gold"
                >
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </motion.div>
      </div>

      <div className="border-t border-line-soft py-5 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} {settings?.salonName || "GlowHaus"}. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
