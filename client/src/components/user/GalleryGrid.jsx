// Album / image grid for the public Gallery page.
// Two display modes:
//   - albums (no album selected): shows album cards w/ cover image
//   - images (album selected): shows that album's images in a masonry-ish grid

import { motion } from "framer-motion";
import { IoImagesOutline } from "react-icons/io5";

export const AlbumGrid = ({ albums = [], onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {albums.map((album, i) => (
        <motion.button
          key={album._id}
          type="button"
          onClick={() => onSelect(album)}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          whileHover={{ y: -6 }}
          className="group relative aspect-4/5 rounded-2xl overflow-hidden border border-line-soft hover:border-rose-gold/40 transition-colors text-left"
        >
          {album.coverImage?.url ? (
            <img
              src={album.coverImage.url}
              alt={album.albumName}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-bg-elevated flex items-center justify-center">
              <IoImagesOutline size={48} className="text-text-muted" />
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(10,10,13,0.95) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="eyebrow text-rose-gold mb-2">
              {album.images?.length || 0} photos
            </p>
            <h3 className="font-display text-2xl text-text-primary">
              {album.albumName}
            </h3>
            {album.description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {album.description}
              </p>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export const ImageGrid = ({ images = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {images.map((img, i) => (
        <motion.figure
          key={img._id || i}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 12) * 0.04 }}
          className="relative aspect-square rounded-xl overflow-hidden border border-line-soft group"
        >
          <img
            src={img.url}
            alt={img.title || ""}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {(img.title || img.description) && (
            <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-bg-base to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {img.title && (
                <p className="text-xs font-medium text-text-primary">
                  {img.title}
                </p>
              )}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
};

export default AlbumGrid;
