// Wraps any admin-only route. Requires authenticated AND role === 'admin'.

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader.jsx";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);

  if (loading) return <Loader label="Verifying access…" />;

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminProtectedRoute;
