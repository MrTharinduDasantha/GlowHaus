// Service detail — large image gallery, description, benefits, stylist selector, reviews list, "Add to Bag" CTA.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoBagAddOutline,
} from "react-icons/io5";

import { fetchServiceById } from "../../app/features/serviceSlice.js";
import { addToBag } from "../../app/features/bagSlice.js";
import { setStylist } from "../../app/features/bookingSlice.js";
import { reviewApi } from "../../api/review.api.js";

import BeforeAfterGallery from "../../components/user/BeforeAfterGallery.jsx";
import StylistSelector from "../../components/user/StylistSelector.jsx";
import ReviewCard from "../../components/user/ReviewCard.jsx";
import RatingStars from "../../components/common/RatingStars.jsx";
import FavoriteButton from "../../components/user/FavoriteButton.jsx";
import Loader from "../../components/common/Loader.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDuration } from "../../utils/formatDuration.js";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: service, loading } = useSelector((s) => s.services);
  const bagItems = useSelector((s) => s.bag.items);

  const [reviews, setReviews] = useState([]);
  const [pickedStylist, setPickedStylist] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchServiceById(id));
    reviewApi
      .listForService(id)
      .then((r) => setReviews(r.data.data))
      .catch(() => {});
    setActiveImage(0);
  }, [id, dispatch]);

  if (loading || !service) return;

  const inBag = bagItems.some((i) => i._id === service._id);
  const cover = service.images?.[activeImage]?.url;

  const handleAddToBag = () => {
    dispatch(
      addToBag({
        _id: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        image: cover,
      }),
    );
    if (pickedStylist) dispatch(setStylist(pickedStylist));
    toast.success("Added to bag");
  };

  const handleBookNow = () => {
    handleAddToBag();
    navigate("/bag");
  };

  return (
    <div className="container-luxe py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* LEFT — image gallery */}
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-4/5 rounded-2xl overflow-hidden border border-line-soft mb-3"
          >
            {cover ? (
              <img
                src={cover}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-bg-elevated flex items-center justify-center text-text-muted">
                No image
              </div>
            )}
            <div className="absolute top-4 right-4">
              <FavoriteButton serviceId={service._id} size={20} />
            </div>
          </motion.div>

          {/* Thumbnails */}
          {service.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {service.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage
                      ? "border-rose-gold"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — info */}
        <div>
          <p className="eyebrow text-rose-gold mb-3">
            {service.category?.name}
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-3 leading-tight">
            {service.name}
          </h1>

          <div className="flex items-center gap-4 mb-6 text-sm text-text-secondary">
            {service.totalReviews > 0 && (
              <span className="flex items-center gap-2">
                <RatingStars value={service.avgRating} size={16} />
                <span>
                  {service.avgRating.toFixed(1)} ({service.totalReviews}{" "}
                  reviews)
                </span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <IoTimeOutline className="text-rose-gold" />
              {formatDuration(service.duration)}
            </span>
          </div>

          <p className="text-text-secondary leading-relaxed mb-6">
            {service.description}
          </p>

          {/* Benefits */}
          {service.benefits?.length > 0 && (
            <div className="mb-6">
              <p className="eyebrow text-rose-gold mb-3">Benefits</p>
              <ul className="space-y-2">
                {service.benefits.map((b, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-text-secondary"
                  >
                    <IoCheckmarkCircleOutline
                      className="shrink-0 mt-0.5 text-rose-gold"
                      size={18}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stylist picker */}
          {service.assignedStylists?.length > 0 && (
            <div className="mb-6">
              <p className="eyebrow text-rose-gold mb-3">
                Choose your stylist (optional)
              </p>
              <StylistSelector
                stylists={service.assignedStylists.filter((s) => s.isActive)}
                selectedId={pickedStylist?._id}
                onSelect={setPickedStylist}
              />
            </div>
          )}

          {/* Price + CTA */}
          <div className="sticky bottom-4 z-10 mt-8 p-5 glass-panel rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-text-muted">Price</p>
              <p className="font-display text-3xl text-rose-gold">
                {formatCurrency(service.price)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddToBag}
                disabled={inBag}
                className="btn-outline inline-flex items-center gap-2 disabled:opacity-60"
              >
                <IoBagAddOutline size={18} />
                {inBag ? "In Bag" : "Add to Bag"}
              </button>
              <button onClick={handleBookNow} className="btn-primary">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY (additional images) */}
      {service.images?.length > 0 && (
        <div className="mt-16">
          <p className="eyebrow text-rose-gold mb-3">Gallery</p>
          <h2 className="font-display text-2xl md:text-3xl mb-6">
            Recent transformations
          </h2>
          <BeforeAfterGallery images={service.images} />
        </div>
      )}

      {/* REVIEWS */}
      <div className="mt-16">
        <p className="eyebrow text-rose-gold mb-3">Reviews</p>
        <h2 className="font-display text-2xl md:text-3xl mb-6">
          What our clients say
        </h2>
        {reviews.length === 0 ? (
          <p className="text-text-muted">No reviews yet — be the first.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <ReviewCard key={r._id} review={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailPage;
