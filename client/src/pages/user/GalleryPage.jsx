// Gallery — list of albums; clicking an album drills down into its images.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { galleryApi } from "../../api/gallery.api.js";
import { AlbumGrid, ImageGrid } from "../../components/user/GalleryGrid.jsx";
import Loader from "../../components/common/Loader.jsx";

const GalleryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryApi
      .listAlbums()
      .then((r) => setAlbums(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-luxe py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="eyebrow text-rose-gold mb-2">Captured</p>
        <h1 className="font-display text-4xl md:text-5xl">
          {active ? active.albumName : "Gallery"}
        </h1>
        <p className="text-text-secondary mt-3 max-w-xl mx-auto">
          {active
            ? active.description ||
              "Moments and transformations from our studio."
            : "Albums from our salon — ambience, transformations, bridal looks, and signature work."}
        </p>
      </div>

      {/* Back link when in album view */}
      {active && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setActive(null)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-rose-gold hover:underline"
        >
          <IoArrowBack /> All albums
        </motion.button>
      )}

      {loading ? (
        <Loader fullScreen={false} />
      ) : !active ? (
        <AlbumGrid albums={albums} onSelect={setActive} />
      ) : (
        <ImageGrid images={active.images || []} />
      )}
    </div>
  );
};

export default GalleryPage;
