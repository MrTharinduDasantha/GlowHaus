// Single stylist profile — bio + the services they perform.

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";

import { fetchStylistById } from "../../app/features/stylistSlice.js";
import ServiceCard from "../../components/user/ServiceCard.jsx";
import RatingStars from "../../components/common/RatingStars.jsx";
import Loader from "../../components/common/Loader.jsx";

const StylistDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector((s) => s.stylists);

  useEffect(() => {
    dispatch(fetchStylistById(id));
  }, [id, dispatch]);

  if (loading || !current) return;

  const { stylist, services } = current;

  return (
    <div className="container-luxe py-10 md:py-14">
      {/* Hero strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-3/4 rounded-2xl overflow-hidden border border-line-soft"
        >
          {stylist.profilePhoto?.url ? (
            <img
              src={stylist.profilePhoto.url}
              alt={stylist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-bg-elevated flex items-center justify-center font-display text-7xl text-rose-gold/40">
              {stylist.name?.[0]}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="md:col-span-2 flex flex-col justify-center"
        >
          <p className="eyebrow text-rose-gold mb-2">{stylist.expertise}</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            {stylist.name}
          </h1>

          {stylist.totalReviews > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <RatingStars value={stylist.avgRating} size={18} />
              <span className="text-sm text-text-secondary">
                {stylist.avgRating.toFixed(1)} ({stylist.totalReviews} reviews)
              </span>
            </div>
          )}

          {stylist.bio && (
            <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
              {stylist.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <IoMailOutline className="text-rose-gold" size={18} />
              {stylist.email}
            </span>
            {stylist.phone && (
              <span className="flex items-center gap-2">
                <IoCallOutline className="text-rose-gold" size={18} />
                {stylist.phone}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Services they perform */}
      <div>
        <p className="eyebrow text-rose-gold mb-3">Services</p>
        <h2 className="font-display text-3xl md:text-4xl mb-8">
          What {stylist.name.split(" ")[0]} can do for you
        </h2>

        {services.length === 0 ? (
          <p className="text-text-muted">
            This stylist isn't yet assigned to any services.{" "}
            <Link to="/services" className="text-rose-gold hover:underline">
              Browse all services
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StylistDetailPage;
