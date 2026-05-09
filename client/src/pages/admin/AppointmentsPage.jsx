// Appointments admin — toggle between calendar / table view, filters, modals, walk-in creation.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  IoAddCircleOutline,
  IoCalendarOutline,
  IoListOutline,
} from "react-icons/io5";
import Modal from "../../components/common/Modal.jsx";
import AppointmentTable from "../../components/admin/AppointmentTable.jsx";
import AppointmentCalendar from "../../components/admin/AppointmentCalendar.jsx";
import AppointmentDetailModal from "../../components/admin/AppointmentDetailModal.jsx";
import RescheduleModal from "../../components/admin/RescheduleModal.jsx";
import Loader from "../../components/common/Loader.jsx";
import AppointmentForm from "../../components/admin/AppointmentForm.jsx";
import { bookingApi } from "../../api/booking.api.js";

const AppointmentsPage = () => {
  const [view, setView] = useState("table"); // table | calendar
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [reschedule, setReschedule] = useState(null);
  const [walkInOpen, setWalkInOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = filter === "all" ? {} : { status: filter };
      const res = await bookingApi.listAdmin({ ...params, limit: 200 });
      setBookings(res.data.data.bookings);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(); /* eslint-disable-next-line */
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow text-rose-gold">Operations</p>
          <h1 className="font-display text-3xl md:text-4xl">Appointments</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-bg-surface border border-line-soft rounded-full p-1">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                view === "table" ? "text-bg-base" : "text-text-secondary"
              }`}
              style={
                view === "table" ? { background: "var(--gradient-rose)" } : {}
              }
            >
              <IoListOutline /> List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                view === "calendar" ? "text-bg-base" : "text-text-secondary"
              }`}
              style={
                view === "calendar"
                  ? { background: "var(--gradient-rose)" }
                  : {}
              }
            >
              <IoCalendarOutline /> Calendar
            </button>
          </div>
          <button
            onClick={() => setWalkInOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <IoAddCircleOutline size={18} /> Walk-in
          </button>
        </div>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading appointments" />
      ) : view === "table" ? (
        <AppointmentTable
          bookings={bookings}
          filter={filter}
          onFilterChange={setFilter}
          onRowClick={setSelected}
        />
      ) : (
        <AppointmentCalendar
          appointments={bookings}
          onSelectAppointment={setSelected}
        />
      )}

      <AppointmentDetailModal
        booking={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onUpdated={fetchAll}
        onReschedule={(b) => {
          setSelected(null);
          setReschedule(b);
        }}
      />

      {reschedule && (
        <RescheduleModal
          booking={reschedule}
          isOpen
          onClose={() => setReschedule(null)}
          onSuccess={fetchAll}
        />
      )}

      <Modal
        isOpen={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        title="Create Walk-in Booking"
        size="xl"
      >
        <AppointmentForm
          onSuccess={() => {
            setWalkInOpen(false);
            fetchAll();
          }}
          onCancel={() => setWalkInOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
