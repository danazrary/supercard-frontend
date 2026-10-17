/**
 * ============================================================================
 * File: src/components/common/ProtectedRoute/ProtectedRoute.jsx
 * Description: Route guard component wrapping role-restricted pages
 *              (customer ProfilePage/SettingsPage, Merchant dashboard, Admin
 *              dashboard). Reads auth state via useAuth; while the initial
 *              session bootstrap is in flight it renders a loading spinner
 *              rather than prematurely redirecting, then redirects to the
 *              appropriate login route if unauthenticated or the wrong role.
 * Usage / Imported By: App.jsx (wraps <Route element={...}> for /profile,
 *                       /settings, /merchant/scanner, /admin/*)
 * ============================================================================
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

/**
 * @param {Object} props
 * @param {'customer'|'merchant'|'admin'} props.allowedRole - Required role
 * @param {string} [props.redirectTo] - Override redirect path; defaults
 *        based on allowedRole (customer -> '/', merchant -> '/merchant/login',
 *        admin -> '/admin/login')
 * @param {React.ReactNode} props.children
 */
export default function ProtectedRoute({ allowedRole, redirectTo, children }) {
  const { isAuthed, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const defaultRedirects = {
    customer: '/',
    merchant: '/merchant/login',
    admin: '/admin/login',
  };

  if (!isAuthed || role !== allowedRole) {
    const target = redirectTo || defaultRedirects[allowedRole] || '/';
    return <Navigate to={target} replace state={{ from: location }} />;
  }

  return children;
}
