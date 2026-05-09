// Service-category card — image + name. Clicking links to /services?category=<slug>.
// Used on the home page category-grid section.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryCard = ({ category, fallbackImage, index = 0 }) => {
  const img = category.image?.url || fallbackImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link
        to={`/services?category=${category.slug}`}
        className="group relative block aspect-4/5 rounded-2xl overflow-hidden border border-line-soft hover:border-rose-gold transition-colors"
      >
        {/* Background image */}
        <img
          src={img}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(10,10,13,0.95) 100%)",
          }}
        />
        {/* Label */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
            {category.name}
          </h3>
          <span className="text-xs tracking-widest uppercase text-rose-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            View Services →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
