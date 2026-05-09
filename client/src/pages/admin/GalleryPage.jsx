// Gallery admin — albums list → drill into album for image management.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  IoAddCircleOutline,
  IoArrowBack,
  IoCloudUploadOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Modal from "../../components/common/Modal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import AlbumForm from "../../components/admin/AlbumForm.jsx";
import GalleryUploader from "../../components/admin/GalleryUploader.jsx";
import Loader from "../../components/common/Loader.jsx";
import { galleryApi } from "../../api/gallery.api.js";

const GalleryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteAlbumTarget, setDeleteAlbumTarget] = useState(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState(null);
  const [working, setWorking] = useState(false);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.listAlbums();
      setAlbums(res.data.data);
      // If we're inside an album, refresh its data too
      if (active) {
        const fresh = res.data.data.find((a) => a._id === active._id);
        if (fresh) setActive(fresh);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(); /* eslint-disable-next-line */
  }, []);

  const deleteAlbum = async () => {
    setWorking(true);
    try {
      await galleryApi.deleteAlbum(deleteAlbumTarget._id);
      toast.success("Album deleted");
      setDeleteAlbumTarget(null);
      setActive(null);
      fetchAlbums();
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setWorking(false);
    }
  };

  const deleteImage = async () => {
    setWorking(true);
    try {
      await galleryApi.deleteImage(active._id, deleteImageTarget._id);
      toast.success("Image deleted");
      setDeleteImageTarget(null);
      fetchAlbums();
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setWorking(false);
    }
  };

  /* ─── Album list view ─── */
  if (!active) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="eyebrow text-rose-gold">Visuals</p>
            <h1 className="font-display text-3xl md:text-4xl">Gallery</h1>
          </div>
          <button
            onClick={() => setCreatingAlbum(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <IoAddCircleOutline size={18} /> New Album
          </button>
        </div>

        {loading ? (
          <Loader fullScreen={false} label="Loading reviews" />
        ) : albums.length === 0 ? (
          <p className="text-text-muted py-12 text-center">
            No albums yet — create the first.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((a, i) => (
              <motion.button
                type="button"
                key={a._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActive(a)}
                className="text-left group bg-bg-surface border border-line-soft rounded-2xl overflow-hidden hover:border-rose-gold/40"
              >
                <div className="aspect-4/3 bg-bg-elevated">
                  {a.coverImage?.url ? (
                    <img
                      src={a.coverImage.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                      No images
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-text-primary group-hover:text-rose-gold">
                    {a.albumName}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    {a.images?.length || 0} photos
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        <Modal
          isOpen={creatingAlbum}
          onClose={() => setCreatingAlbum(false)}
          title="New Album"
        >
          <AlbumForm
            onSuccess={() => {
              setCreatingAlbum(false);
              fetchAlbums();
            }}
            onCancel={() => setCreatingAlbum(false)}
          />
        </Modal>
      </div>
    );
  }

  /* ─── Album detail view ─── */
  return (
    <div className="space-y-6">
      <button
        onClick={() => setActive(null)}
        className="inline-flex items-center gap-2 text-sm text-rose-gold hover:underline"
      >
        <IoArrowBack /> All albums
      </button>

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow text-rose-gold">Album</p>
          <h1 className="font-display text-3xl md:text-4xl">
            {active.albumName}
          </h1>
          {active.description && (
            <p className="text-text-secondary mt-2 max-w-xl">
              {active.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setUploadOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <IoCloudUploadOutline /> Upload images
          </button>
          <button
            onClick={() => setEditingAlbum(active)}
            className="px-4 py-2 rounded-full border border-line-soft text-text-secondary hover:border-rose-gold/40"
          >
            <IoCreateOutline />
          </button>
          <button
            onClick={() => setDeleteAlbumTarget(active)}
            className="px-4 py-2 rounded-full border border-line-soft text-danger hover:border-danger/40"
          >
            <IoTrashOutline />
          </button>
        </div>
      </div>

      {/* Image grid */}
      {(active.images || []).length === 0 ? (
        <p className="text-text-muted py-12 text-center">
          No images yet — click "Upload images".
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {active.images.map((img) => (
            <div
              key={img._id}
              className="relative aspect-square rounded-xl overflow-hidden border border-line-soft group"
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDeleteImageTarget(img)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-bg-base/80 flex items-center justify-center text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete image"
              >
                <IoTrashOutline size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload to Album"
        size="lg"
      >
        <GalleryUploader
          albumId={active._id}
          onSuccess={() => {
            setUploadOpen(false);
            fetchAlbums();
          }}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={Boolean(editingAlbum)}
        onClose={() => setEditingAlbum(null)}
        title="Edit Album"
      >
        <AlbumForm
          album={editingAlbum}
          onSuccess={() => {
            setEditingAlbum(null);
            fetchAlbums();
          }}
          onCancel={() => setEditingAlbum(null)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteAlbumTarget)}
        onClose={() => setDeleteAlbumTarget(null)}
        onConfirm={deleteAlbum}
        title="Delete this album?"
        message={`The album "${deleteAlbumTarget?.albumName}" and all its images will be permanently removed.`}
        variant="danger"
        confirmLabel="Delete"
        loading={working}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteImageTarget)}
        onClose={() => setDeleteImageTarget(null)}
        onConfirm={deleteImage}
        title="Delete this image?"
        message="This image will be removed from the album and from Cloudinary."
        variant="danger"
        confirmLabel="Delete"
        loading={working}
      />
    </div>
  );
};

export default GalleryPage;
