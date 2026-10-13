/**
 * ============================================================================
 * File: src/components/common/ProtectedRoute/ProtectedRoute.jsx
 * Description: Client-side role-based router guard for customer, merchant, & admin.
 * Usage / Imported By: App.jsx.
 * ============================================================================
 */

import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ color: "#fff", textAlign: "center", padding: "50px" }}>
        چاوەڕوانبە...
      </div>
    );
  }

  if (!isAuthenticated) {
    if (allowedRoles.includes("merchant"))
      return <Navigate to="/merchant/login" replace />;
    if (allowedRoles.includes("admin"))
      return <Navigate to="/admin/login" replace />;
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
