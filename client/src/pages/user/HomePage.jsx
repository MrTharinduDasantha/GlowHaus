// Landing page — hero slider, categories grid, featured services, CTA banner, testimonials, and a closing brand statement.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";

import HeroSlider from "../../components/user/HeroSlider.jsx";
import CategoryCard from "../../components/user/CategoryCard.jsx";
import ServiceCard from "../../components/user/ServiceCard.jsx";
import TestimonialsCarousel from "../../components/user/TestimonialsCarousel.jsx";
import OfferBanner from "../../components/user/OfferBanner.jsx";

import { categoryApi } from "../../api/category.api.js";
import { serviceApi } from "../../api/service.api.js";

// Local fallback images (used when an admin hasn't uploaded a category image yet)
import hairImg from "../../assets/categories/hair.png";
import makeupImg from "../../assets/categories/makeup.png";
import skincareImg from "../../assets/categories/skincare.png";
import nailsImg from "../../assets/categories/nails.png";
import waxingImg from "../../assets/categories/waxing-threading.png";
import spaImg from "../../assets/categories/spa-massage.png";
import bridalImg from "../../assets/categories/bridal.png";
import salonInterior from "../../assets/about/salon-interior.png";

// Map category slugs → fallback image
const fallbackImages = {
  hair: hairImg,
  makeup: makeupImg,
  skincare: skincareImg,
  nails: nailsImg,
  "waxing-and-threading": waxingImg,
  "spa-and-massage": spaImg,
  "bridal-packages": bridalImg,
  bridal: bridalImg,
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    categoryApi
      .list({ activeOnly: "true" })
      .then((r) => setCategories(r.data.data))
      .catch(() => {});
    serviceApi
      .getFeatured()
      .then((r) => setFeatured(r.data.data))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* HERO */}
      <HeroSlider />

      {/* INTRO STATEMENT */}
      <section className="container-luxe py-20 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow text-rose-gold mb-4"
        >
          Refined · Personal · Women-Only
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl max-w-3xl mx-auto leading-[1.1] mb-6"
        >
          A sanctuary built around the way{" "}
          <span className="gradient-text">you</span> want to feel.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto text-text-secondary leading-relaxed"
        >
          Every chair, every product, every detail at GlowHaus has been chosen
          with intention — because beauty deserves to be a quiet, indulgent
          ritual, not a transaction.
        </motion.p>
      </section>

      <div className="divider-luxe container-luxe" />

      {/* CATEGORIES */}
      <section className="container-luxe py-20 md:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="eyebrow text-rose-gold mb-2">Explore</p>
            <h2 className="font-display text-3xl md:text-4xl">Our Services</h2>
          </div>
          <Link
            to="/services"
            className="text-sm text-rose-gold hover:underline inline-flex items-center gap-1"
          >
            View all <IoArrowForward />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.slice(0, 8).map((c, i) => (
            <CategoryCard
              key={c._id}
              category={c}
              fallbackImage={fallbackImages[c.slug] || hairImg}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      {featured.length > 0 && (
        <section className="container-luxe py-20 md:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="eyebrow text-rose-gold mb-2">Featured</p>
              <h2 className="font-display text-3xl md:text-4xl">
                Signature treatments
              </h2>
            </div>
            <Link
              to="/services"
              className="text-sm text-rose-gold hover:underline inline-flex items-center gap-1"
            >
              Browse all services <IoArrowForward />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.slice(0, 8).map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* OFFER BANNER */}
      <section className="container-luxe py-12">
        <OfferBanner />
      </section>

      {/* ABOUT SNIPPET */}
      <section className="container-luxe py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow text-rose-gold mb-3">The GlowHaus Story</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-[1.1]">
              Crafted with care. Guided by intention.
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Founded by women, for women. Every stylist on our team brings
              years of experience in their craft — and a quiet philosophy: that
              beauty services should be a moment of self-care, not a rush.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              Whether you're stepping in for a precise cut or a full bridal
              transformation, you'll find the same unhurried, attentive service
              every visit.
            </p>
            <Link to="/about" className="btn-outline">
              Read more
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-4/5 rounded-2xl overflow-hidden border border-line-soft"
          >
            <img
              src={salonInterior}
              alt="Salon interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-luxe py-20 md:py-28">
        <p className="eyebrow text-rose-gold mb-3 text-center">
          Words from clients
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-center mb-14">
          What women say about GlowHaus
        </h2>
        <TestimonialsCarousel />
      </section>
    </>
  );
};

export default HomePage;
