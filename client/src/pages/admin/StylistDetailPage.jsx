// Single stylist detail — schedule view (next 14 days).

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, addDays } from "date-fns";
import { IoArrowBack, IoStar } from "react-icons/io5";
import { stylistApi } from "../../api/stylist.api.js";
import { scheduleApi } from "../../api/schedule.api.js";
import StylistScheduleView from "../../components/admin/StylistScheduleView.jsx";
import AppointmentDetailModal from "../../components/admin/AppointmentDetailModal.jsx";
import Loader from "../../components/common/Loader.jsx";

const StylistDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const today = new Date();
    const inTwoWeeks = addDays(today, 14);
    try {
      const [stylistRes, apptRes] = await Promise.all([
        stylistApi.getById(id),
        scheduleApi.getAppointments(id, {
          from: format(today, "yyyy-MM-dd"),
          to: format(inTwoWeeks, "yyyy-MM-dd"),
        }),
      ]);
      setData(stylistRes.data.data);
      setAppts(apptRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(); /* eslint-disable-next-line */
  }, [id]);

  if (loading || !data)
    return <Loader fullScreen={false} label="Loading stylist" />;

  const { stylist } = data;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/stylists"
        className="inline-flex items-center gap-2 text-sm text-rose-gold hover:underline"
      >
        <IoArrowBack /> Back to stylists
      </Link>

      {/* Header */}
      <div className="flex items-center gap-5 p-6 bg-bg-surface border border-line-soft rounded-2xl">
        {stylist.profilePhoto?.url ? (
          <img
            src={stylist.profilePhoto.url}
            alt={stylist.name}
            className="w-20 h-20 rounded-full object-cover border border-rose-gold/30"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl"
            style={{
              background: "var(--gradient-rose)",
              color: "var(--color-bg-base)",
            }}
          >
            {stylist.name?.[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-display text-3xl">{stylist.name}</h1>
          <p className="text-text-secondary text-sm">{stylist.expertise}</p>
          {stylist.totalReviews > 0 && (
            <p className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
              <IoStar className="text-rose-gold" size={12} />
              {stylist.avgRating.toFixed(1)} · {stylist.totalReviews} reviews
            </p>
          )}
        </div>
      </div>

      {/* Schedule */}
      <div>
        <p className="eyebrow text-rose-gold mb-3">Next 14 days</p>
        <h2 className="font-display text-2xl mb-5">Upcoming schedule</h2>
        <StylistScheduleView appointments={appts} onSelect={setSelected} />
      </div>

      <AppointmentDetailModal
        booking={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onUpdated={fetchAll}
      />
    </div>
  );
};

export default StylistDetailPage;
