/**
 * ============================================================================
 * File: src/context/AuthContext.jsx
 * Description: Global authentication context managing customer, clinic merchant,
 *              and HQ admin roles, JWT persistence, and session lifecycle.
 * Usage / Imported By: App.jsx, useAuth hook, ProtectedRoute, Login Pages.
 * ============================================================================
 */

import React, { createContext, useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
  );
  const [role, setRole] = useState(
    () => localStorage.getItem(STORAGE_KEYS.USER_ROLE) || null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedProfile && token) {
        setUser(JSON.parse(storedProfile));
      }
    } catch (e) {
      console.error("Failed to parse cached session profile", e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const loginCustomerSession = useCallback((authToken, userProfile) => {
    setToken(authToken);
    setUser(userProfile);
    setRole("customer");
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "customer");
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(userProfile),
    );
    if (userProfile?.activeCardId) {
      localStorage.setItem(
        STORAGE_KEYS.ACTIVE_CARD_ID,
        userProfile.activeCardId,
      );
    }
  }, []);

  const loginMerchantSession = useCallback((authToken, merchantProfile) => {
    setToken(authToken);
    setUser(merchantProfile);
    setRole("merchant");
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "merchant");
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(merchantProfile),
    );
  }, []);

  const loginAdminSession = useCallback((authToken, adminProfile) => {
    setToken(authToken);
    setUser(adminProfile);
    setRole("admin");
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "admin");
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(adminProfile),
    );
  }, []);

  const logoutSession = useCallback(async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (err) {
      // Ignore network errors on logout teardown
    } finally {
      setToken(null);
      setUser(null);
      setRole(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CARD_ID);
    }
  }, [token]);

  const value = {
    user,
    token,
    role,
    isAuthenticated: Boolean(token),
    isCustomer: role === "customer",
    isMerchant: role === "merchant",
    isAdmin: role === "admin",
    isLoading,
    loginCustomerSession,
    loginMerchantSession,
    loginAdminSession,
    logoutSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
