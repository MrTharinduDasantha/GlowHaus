// Wraps any customer-only route. Redirects to /login if not authenticated.

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  // Wait for the initial /me probe before deciding
  if (loading) return <Loader label="Loading your account…" />;

  if (!isAuthenticated) {
    // Send them to login but remember where they wanted to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
