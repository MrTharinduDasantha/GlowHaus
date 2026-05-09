// Review moderation — approve / reject / delete.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewModerationTable from "../../components/admin/ReviewModerationTable.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import Loader from "../../components/common/Loader.jsx";
import { reviewApi } from "../../api/review.api.js";

const ReviewsPage = () => {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [working, setWorking] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.listAll({ status: filter });
      setList(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(); /* eslint-disable-next-line */
  }, [filter]);

  const moderate = async (review, action) => {
    try {
      await reviewApi.moderate(review._id, action);
      toast.success(`Review ${action}d`);
      fetchList();
    } catch (err) {
      toast.error(err.userMessage);
    }
  };

  const remove = async () => {
    setWorking(true);
    try {
      await reviewApi.remove(deleteTarget._id);
      toast.success("Review deleted");
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose-gold">Moderation</p>
        <h1 className="font-display text-3xl md:text-4xl">Reviews</h1>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading reviews" />
      ) : (
        <ReviewModerationTable
          reviews={list}
          filter={filter}
          onFilterChange={setFilter}
          onModerate={moderate}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
        title="Delete this review?"
        message="The review will be permanently removed and ratings will be recomputed."
        variant="danger"
        confirmLabel="Delete"
        loading={working}
      />
    </div>
  );
};

export default ReviewsPage;
