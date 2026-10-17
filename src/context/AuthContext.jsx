/**
 * ============================================================================
 * File: src/context/AuthContext.jsx
 * Description: Global authentication context saving tokens in BOTH Cookies & localStorage.
 * ============================================================================
 */

import React, { createContext, useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

const setBrowserCookie = (name, value, days = 14) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeBrowserCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

const getBrowserCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () =>
      getBrowserCookie("admin_token") ||
      getBrowserCookie("sc_auth_token") ||
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
      null,
  );
  const [role, setRole] = useState(
    () =>
      getBrowserCookie("sc_user_role") ||
      localStorage.getItem(STORAGE_KEYS.USER_ROLE) ||
      null,
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
    setBrowserCookie("sc_auth_token", authToken, 30);
    setBrowserCookie("sc_user_role", "customer", 30);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "customer");
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(userProfile),
    );
  }, []);

  const loginMerchantSession = useCallback((authToken, merchantProfile) => {
    setToken(authToken);
    setUser(merchantProfile);
    setRole("merchant");
    setBrowserCookie("sc_auth_token", authToken, 30);
    setBrowserCookie("sc_user_role", "merchant", 30);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "merchant");
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(merchantProfile),
    );
  }, []);

  // خاڵی ١: پاشەکەوتکردنی تۆکنی ئادمین لە Cookies و LocalStorage بەیەکەوە
  const loginAdminSession = useCallback((authToken, adminProfile) => {
    setToken(authToken);
    setUser(adminProfile);
    setRole("admin");
    setBrowserCookie("admin_token", authToken, 14);
    setBrowserCookie("sc_auth_token", authToken, 14);
    setBrowserCookie("sc_user_role", "admin", 14);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "admin");
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(adminProfile),
    );
  }, []);

  const logoutSession = useCallback(async () => {
    try {
      if (token) await authService.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
      setRole(null);
      removeBrowserCookie("admin_token");
      removeBrowserCookie("sc_auth_token");
      removeBrowserCookie("sc_user_role");
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
