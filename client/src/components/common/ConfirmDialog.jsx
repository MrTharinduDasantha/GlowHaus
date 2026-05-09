// Specialised modal for confirm/cancel decisions (delete, cancel booking, etc).
// Variants tint the confirm button — "danger" = red, "primary" = rose-gold.

import Modal from "./Modal.jsx";

const variantStyles = {
  primary: {
    background: "var(--gradient-rose)",
    color: "var(--color-bg-base)",
  },
  danger: { background: "var(--color-danger)", color: "var(--color-bg-base)" },
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-text-secondary mb-6 leading-relaxed">{message}</p>
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 rounded-full border border-line-soft text-text-secondary hover:bg-bg-surface transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-5 py-2.5 rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-60"
          style={variantStyles[variant]}
        >
          {loading ? "Processing…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
