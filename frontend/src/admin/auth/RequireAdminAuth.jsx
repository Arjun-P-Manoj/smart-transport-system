// src/admin/auth/RequireAdminAuth.jsx
import { Navigate } from "react-router-dom";

export default function RequireAdminAuth({ children }) {
  const isAuthenticated = localStorage.getItem("admin_auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
