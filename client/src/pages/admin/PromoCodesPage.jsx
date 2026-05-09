// Promo codes CRUD.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoAddCircleOutline } from "react-icons/io5";
import Modal from "../../components/common/Modal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import Loader from "../../components/common/Loader.jsx";
import PromoCodeForm from "../../components/admin/PromoCodeForm.jsx";
import PromoCodeTable from "../../components/admin/PromoCodeTable.jsx";
import { promoApi } from "../../api/promo.api.js";

const PromoCodesPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await promoApi.list();
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
      await promoApi.remove(deleteTarget._id);
      toast.success("Promo deleted");
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
          <p className="eyebrow text-rose-gold">Marketing</p>
          <h1 className="font-display text-3xl md:text-4xl">Promo Codes</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddCircleOutline size={18} /> New Promo
        </button>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading promo codes" />
      ) : (
        <PromoCodeTable
          promos={list}
          onEdit={setEditing}
          onDelete={setDeleteTarget}
        />
      )}

      <Modal
        isOpen={creating || Boolean(editing)}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        title={editing ? "Edit Promo" : "New Promo"}
        size="lg"
      >
        <PromoCodeForm
          promo={editing}
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
        title="Delete this promo?"
        message={`Code "${deleteTarget?.code}" will stop working immediately.`}
        variant="danger"
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default PromoCodesPage;
