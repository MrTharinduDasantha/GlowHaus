// Convenience hook — pulls auth state without typing `useSelector(s => s.auth)` everywhere.

import { useSelector } from "react-redux";

export const useAuth = () => {
  const auth = useSelector((s) => s.auth);
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.user?.role === "admin",
    loading: auth.loading,
    error: auth.error,
  };
};
