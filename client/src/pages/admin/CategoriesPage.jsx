// Categories CRUD — grid view + create/edit modal + confirm-delete dialog.

import { useEffect, useState } from "react";
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
import CategoryForm from "../../components/admin/CategoryForm.jsx";
import { categoryApi } from "../../api/category.api.js";

const CategoriesPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.list();
      setList(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryApi.remove(deleteTarget._id);
      toast.success("Category deleted");
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
          <p className="eyebrow text-rose-gold">Catalog</p>
          <h1 className="font-display text-3xl md:text-4xl">Categories</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddCircleOutline size={18} /> New Category
        </button>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading categories" />
      ) : list.length === 0 ? (
        <p className="text-text-muted py-12 text-center">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-bg-surface border border-line-soft rounded-2xl overflow-hidden group"
            >
              <div className="aspect-square bg-bg-elevated">
                {c.image?.url ? (
                  <img
                    src={c.image.url}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-3xl text-rose-gold/40">
                    {c.name?.[0]}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg text-text-primary mb-1">
                  {c.name}
                </h3>
                <p className="text-xs text-text-muted mb-3">{c.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{
                      background: c.isActive
                        ? "color-mix(in srgb, var(--color-success) 15%, transparent)"
                        : "color-mix(in srgb, var(--color-text-muted) 15%, transparent)",
                      color: c.isActive
                        ? "var(--color-success)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(c)}
                      className="p-1.5 text-text-secondary hover:text-rose-gold"
                    >
                      <IoCreateOutline size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
                      className="p-1.5 text-text-secondary hover:text-danger"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
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
        title={editing ? "Edit Category" : "New Category"}
      >
        <CategoryForm
          category={editing}
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
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be permanently removed. Services using it will block this action.`}
        variant="danger"
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default CategoriesPage;
