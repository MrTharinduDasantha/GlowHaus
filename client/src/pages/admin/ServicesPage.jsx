// Services CRUD — table view + ServiceForm modal + assign-stylists modal.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  IoAddCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoPersonAddOutline,
  IoStarOutline,
  IoStar,
} from "react-icons/io5";
import Modal from "../../components/common/Modal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import Loader from "../../components/common/Loader.jsx";
import ServiceForm from "../../components/admin/ServiceForm.jsx";
import { serviceApi } from "../../api/service.api.js";
import { stylistApi } from "../../api/stylist.api.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDuration } from "../../utils/formatDuration.js";

const ServicesPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Stylist-assignment modal state
  const [assignTarget, setAssignTarget] = useState(null);
  const [allStylists, setAllStylists] = useState([]);
  const [chosenStylists, setChosenStylists] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.list({ limit: 100, activeOnly: "false" });
      setList(res.data.data.services);
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
      await serviceApi.remove(deleteTarget._id);
      toast.success("Service deleted");
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      toast.error(err.userMessage || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const openAssign = async (service) => {
    setAssignTarget(service);
    setChosenStylists((service.assignedStylists || []).map((s) => s._id || s));
    if (allStylists.length === 0) {
      const res = await stylistApi.list({ activeOnly: "true" });
      setAllStylists(res.data.data);
    }
  };

  const saveAssignments = async () => {
    setAssigning(true);
    try {
      await serviceApi.assignStylists(assignTarget._id, chosenStylists);
      toast.success("Stylists assigned");
      setAssignTarget(null);
      fetchList();
    } catch (err) {
      toast.error(err.userMessage || "Failed to assign");
    } finally {
      setAssigning(false);
    }
  };

  const toggleFeatured = async (service) => {
    try {
      await serviceApi.toggleFeatured(service._id);
      fetchList();
    } catch (err) {
      toast.error(err.userMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow text-rose-gold">Catalog</p>
          <h1 className="font-display text-3xl md:text-4xl">Services</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddCircleOutline size={18} /> New Service
        </button>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading services" />
      ) : (
        <div className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-elevated text-text-muted text-left">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stylists</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-text-muted"
                    >
                      No services yet.
                    </td>
                  </tr>
                ) : (
                  list.map((s, i) => (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-t border-line-soft hover:bg-bg-elevated transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {s.images?.[0]?.url ? (
                            <img
                              src={s.images[0].url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-bg-elevated" />
                          )}
                          <div>
                            <p className="text-text-primary">{s.name}</p>
                            <p className="text-xs text-text-muted truncate max-w-50">
                              {s.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {s.category?.name}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatDuration(s.duration)}
                      </td>
                      <td className="px-4 py-3 text-rose-gold font-medium">
                        {formatCurrency(s.price)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {s.assignedStylists?.length || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: s.isActive
                              ? "color-mix(in srgb, var(--color-success) 15%, transparent)"
                              : "color-mix(in srgb, var(--color-text-muted) 15%, transparent)",
                            color: s.isActive
                              ? "var(--color-success)"
                              : "var(--color-text-muted)",
                          }}
                        >
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => toggleFeatured(s)}
                            className="p-1.5 text-text-secondary hover:text-rose-gold"
                            title="Toggle featured"
                          >
                            {s.isFeatured ? (
                              <IoStar className="text-rose-gold" size={18} />
                            ) : (
                              <IoStarOutline size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => openAssign(s)}
                            className="p-1.5 text-text-secondary hover:text-rose-gold"
                            title="Assign stylists"
                          >
                            <IoPersonAddOutline size={18} />
                          </button>
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
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        isOpen={creating || Boolean(editing)}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        title={editing ? "Edit Service" : "New Service"}
        size="xl"
      >
        <ServiceForm
          service={editing}
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

      {/* Assign stylists modal */}
      <Modal
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        title={`Assign stylists to ${assignTarget?.name || ""}`}
      >
        <p className="text-sm text-text-secondary mb-4">
          Pick which stylists are qualified to perform this service.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {allStylists.map((st) => (
            <label
              key={st._id}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                chosenStylists.includes(st._id)
                  ? "border-rose-gold bg-rose-gold/5"
                  : "border-line-soft hover:border-rose-gold/40"
              }`}
            >
              <input
                type="checkbox"
                checked={chosenStylists.includes(st._id)}
                onChange={(e) =>
                  setChosenStylists((prev) =>
                    e.target.checked
                      ? [...prev, st._id]
                      : prev.filter((id) => id !== st._id),
                  )
                }
                className="accent-rose-gold"
              />
              <div className="flex items-center gap-3 flex-1">
                {st.profilePhoto?.url ? (
                  <img
                    src={st.profilePhoto.url}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-rose-gold">
                    {st.name?.[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium">{st.name}</p>
                  <p className="text-xs text-text-muted">{st.expertise}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setAssignTarget(null)}
            className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary"
          >
            Cancel
          </button>
          <button
            onClick={saveAssignments}
            disabled={assigning}
            className="btn-primary disabled:opacity-60"
          >
            {assigning ? "Saving…" : "Save Assignments"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this service?"
        message={`"${deleteTarget?.name}" and its images will be permanently removed.`}
        variant="danger"
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default ServicesPage;
