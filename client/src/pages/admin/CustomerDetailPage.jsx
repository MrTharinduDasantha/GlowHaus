// Customer detail — profile + lifetime stats + booking history.

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import CustomerDetailView from "../../components/admin/CustomerDetailView.jsx";
import Loader from "../../components/common/Loader.jsx";
import { userApi } from "../../api/user.api.js";
import { bookingApi } from "../../api/booking.api.js";
import { reportApi } from "../../api/report.api.js";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [c, b, s] = await Promise.all([
          userApi.getCustomerById(id),
          // Bookings list filtered by customer (admin search supports email/name)
          bookingApi.listAdmin({ search: "", limit: 100 }), // we'll filter client-side
          reportApi.getCustomerStats(id),
        ]);
        setCustomer(c.data.data);
        // Filter for this customer only
        const cu = c.data.data;
        setBookings(
          b.data.data.bookings.filter(
            (bk) => String(bk.customer?._id || bk.customer) === String(cu._id),
          ),
        );
        setStats(s.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading || !customer)
    return <Loader fullScreen={false} label="Loading customer" />;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-2 text-sm text-rose-gold hover:underline"
      >
        <IoArrowBack /> Back to customers
      </Link>
      <CustomerDetailView
        customer={customer}
        bookings={bookings}
        stats={stats}
      />
    </div>
  );
};

export default CustomerDetailPage;
