import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="py-12 text-center text-black/60">Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.is_staff) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">Access denied. Admin access is required to view this page.</p>;
  }

  return children;
}
