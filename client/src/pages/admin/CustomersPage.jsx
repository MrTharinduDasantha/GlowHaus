// Customers list + search + block/unblock.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomerTable from "../../components/admin/CustomerTable.jsx";
import { userApi } from "../../api/user.api.js";

const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchList = async (q = "") => {
    setLoading(true);
    try {
      const res = await userApi.listCustomers({ search: q, limit: 100 });
      setCustomers(res.data.data.customers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(search);
  }, [search]);

  const onToggleBlock = async (c) => {
    try {
      await userApi.toggleBlockCustomer(c._id);
      toast.success(`Customer ${c.isBlocked ? "unblocked" : "blocked"}`);
      fetchList(search);
    } catch (err) {
      toast.error(err.userMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose-gold">Clients</p>
        <h1 className="font-display text-3xl md:text-4xl">Customers</h1>
      </div>

      <CustomerTable
        customers={customers}
        onSearchChange={setSearch}
        onRowClick={(c) => navigate(`/admin/customers/${c._id}`)}
        onToggleBlock={onToggleBlock}
        isLoading={loading}
      />
    </div>
  );
};

export default CustomersPage;
