import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) {
    const map = {
      tenant: "/tenant/dashboard",
      landlord: "/landlord/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={map[role] || "/login"} replace />;
  }
  return children;
}