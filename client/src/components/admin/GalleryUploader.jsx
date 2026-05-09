// Drag-and-drop multi-image uploader. Calls galleryApi.addImages on submit.

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5";
import { galleryApi } from "../../api/gallery.api.js";

const GalleryUploader = ({ albumId, onSuccess, onCancel }) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...arr].slice(0, 20));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!files.length) return toast.error("Choose at least one image");
    setSubmitting(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("images", f));
      await galleryApi.addImages(albumId, fd);
      toast.success("Images uploaded");
      onSuccess?.();
    } catch (err) {
      toast.error(err.userMessage || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-rose-gold bg-rose-gold/5"
            : "border-line-soft hover:border-rose-gold/50"
        }`}
      >
        <IoCloudUploadOutline
          size={40}
          className="mx-auto mb-3 text-rose-gold"
        />
        <p className="text-sm text-text-primary">
          Drop images here or{" "}
          <span className="text-rose-gold underline">browse</span>
        </p>
        <p className="text-xs text-text-muted mt-1">
          Up to 20 images, max 5MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-lg overflow-hidden border border-line-soft"
            >
              <img
                src={URL.createObjectURL(f)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bg-base/80 flex items-center justify-center text-danger"
              >
                <IoCloseCircle size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary hover:bg-bg-surface"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={submitting || !files.length}
          className="btn-primary disabled:opacity-60"
        >
          {submitting
            ? "Uploading…"
            : `Upload ${files.length} image${files.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
};

export default GalleryUploader;
