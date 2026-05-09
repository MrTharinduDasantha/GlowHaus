// Stylists CRUD — grid view + StylistForm modal.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  IoAddCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Modal from "../../components/common/Modal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import Loader from "../../components/common/Loader.jsx";
import StylistForm from "../../components/admin/StylistForm.jsx";
import { stylistApi } from "../../api/stylist.api.js";

const StylistsPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await stylistApi.list({ activeOnly: "false" });
      setList(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await stylistApi.remove(deleteTarget._id);
      toast.success("Stylist removed");
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      toast.error(err.userMessage || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow text-rose-gold">Team</p>
          <h1 className="font-display text-3xl md:text-4xl">Stylists</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddCircleOutline size={18} /> Add Stylist
        </button>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading stylists" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden group"
            >
              <Link
                to={`/admin/stylists/${s._id}`}
                className="block aspect-3/4 relative"
              >
                {s.profilePhoto?.url ? (
                  <img
                    src={s.profilePhoto.url}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-elevated flex items-center justify-center font-display text-5xl text-rose-gold/40">
                    {s.name?.[0]}
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 60%, rgba(10,10,13,0.85) 100%)",
                  }}
                />
                <span
                  className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{
                    background: s.isActive
                      ? "color-mix(in srgb, var(--color-success) 25%, transparent)"
                      : "color-mix(in srgb, var(--color-text-muted) 25%, transparent)",
                    color: s.isActive
                      ? "var(--color-success)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </span>
              </Link>
              <div className="p-4">
                <h3 className="font-display text-lg">{s.name}</h3>
                <p className="text-xs text-text-muted truncate">
                  {s.expertise}
                </p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="p-1.5 text-text-secondary hover:text-rose-gold"
                  >
                    <IoCreateOutline size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 text-text-secondary hover:text-danger"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={creating || Boolean(editing)}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        title={editing ? "Edit Stylist" : "Add Stylist"}
        size="xl"
      >
        <StylistForm
          stylist={editing}
          onSuccess={() => {
            setEditing(null);
            setCreating(false);
            fetchList();
          }}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove this stylist?"
        message={`"${deleteTarget?.name}" will be removed. Upcoming bookings prevent this action.`}
        variant="danger"
        confirmLabel="Remove"
        loading={deleting}
      />
    </div>
  );
};

export default StylistsPage;
