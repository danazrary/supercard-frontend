/**
 * ============================================================================
 * File: src/context/AuthContext.jsx
 * Description: Global authentication state provider covering all three user
 *              roles (customer, merchant, admin). Bootstraps session state
 *              from localStorage + /auth/me on mount, exposes login/logout
 *              actions per role, and provides role-aware helpers (isAuthed,
 *              role, user) consumed throughout the component tree, including
 *              by ProtectedRoute for route guarding.
 * Usage / Imported By: App.jsx (provider wrapper), hooks/useAuth.js,
 *                       components/common/ProtectedRoute.jsx,
 *                       components/customer/AuthBuyModal.jsx,
 *                       pages/MerchantLogin.jsx, pages/SettingsPage.jsx
 * ============================================================================
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  verifyOtp as verifyOtpApi,
  merchantLogin as merchantLoginApi,
  adminLogin as adminLoginApi,
  getCurrentUser,
  logout as logoutApi,
  getCachedProfile,
  clearSession,
} from '../services/authService';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

function resolveStoredRole() {
  if (localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)) return USER_ROLES.ADMIN;
  if (localStorage.getItem(STORAGE_KEYS.MERCHANT_TOKEN)) return USER_ROLES.MERCHANT;
  if (localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN)) return USER_ROLES.CUSTOMER;
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCachedProfile());
  const [role, setRole] = useState(() => resolveStoredRole());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Bootstrap: verify cached session against the backend on first mount.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedRole = resolveStoredRole();
      if (!storedRole) {
        setIsLoading(false);
        return;
      }
      try {
        const freshUser = await getCurrentUser();
        if (!cancelled) {
          setUser(freshUser);
          setRole(freshUser.role || storedRole);
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(freshUser));
        }
      } catch (err) {
        if (!cancelled) {
          clearSession();
          setUser(null);
          setRole(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const loginCustomer = useCallback(async (phone, otp, requestId) => {
    setAuthError(null);
    try {
      const data = await verifyOtpApi(phone, otp, requestId);
      setUser(data.user);
      setRole(USER_ROLES.CUSTOMER);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const loginMerchant = useCallback(async (username, password) => {
    setAuthError(null);
    try {
      const data = await merchantLoginApi(username, password);
      setUser(data.merchant);
      setRole(USER_ROLES.MERCHANT);
      return data.merchant;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const loginAdmin = useCallback(async (username, password) => {
    setAuthError(null);
    try {
      const data = await adminLoginApi(username, password);
      setUser(data.admin);
      setRole(USER_ROLES.ADMIN);
      return data.admin;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setRole(null);
    }
  }, []);

  const updateUserProfile = useCallback((partialUser) => {
    setUser((prev) => {
      const next = { ...prev, ...partialUser };
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      isLoading,
      authError,
      isAuthed: !!user,
      isCustomer: role === USER_ROLES.CUSTOMER,
      isMerchant: role === USER_ROLES.MERCHANT,
      isAdmin: role === USER_ROLES.ADMIN,
      loginCustomer,
      loginMerchant,
      loginAdmin,
      logout,
      updateUserProfile,
    }),
    [user, role, isLoading, authError, loginCustomer, loginMerchant, loginAdmin, logout, updateUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
