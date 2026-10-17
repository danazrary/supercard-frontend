/**
 * ============================================================================
 * File: src/hooks/useAuth.js
 * Description: Thin convenience hook exposing AuthContext. Throws a clear
 *              error if consumed outside of an AuthProvider tree, which
 *              catches a common integration mistake early (vs. a silent
 *              undefined context bug surfacing deep in a component).
 * Usage / Imported By: components/common/ProtectedRoute.jsx,
 *                       components/customer/AuthBuyModal.jsx,
 *                       pages/SettingsPage.jsx, pages/MerchantLogin.jsx,
 *                       components/layout/BottomNav.jsx
 * ============================================================================
 */

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }
  return ctx;
}
