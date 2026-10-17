/**
 * ============================================================================
 * File: src/services/api.js
 * Description: Hardened Axios HTTP client configured with JWT interceptors,
 *              locale headers, unified error propagation, and 401 handling.
 * Usage / Imported By: authService, offerService, paymentService, prizeService,
 *                      merchantService.
 * ============================================================================
 */

import axios from "axios";
import { API_ROUTES, STORAGE_KEYS } from "../utils/constants";

// خوێندنەوەی کۆکی لە وێبگەڕدا
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const api = axios.create({
  baseURL: API_ROUTES.BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // هەمیشە Cookies لەگەڵ هەموو داواکارییەک دەنێرێت بۆ باکئێند
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      getCookie("admin_token") ||
      getCookie("sc_auth_token") ||
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // چارەسەرکردنی هەڵەی locale is not defined
    const locale =
      localStorage.getItem(STORAGE_KEYS.LOCALE) ||
      localStorage.getItem("sc_language") ||
      "ku";

    config.headers["Accept-Language"] = locale;
    return config;
  },
  (error) => Promise.reject(new ApiError(error.message, 400)),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      }
      const message =
        data?.message ||
        data?.error ||
        "A network communication error occurred.";
      return Promise.reject(new ApiError(message, status, data));
    } else if (error.request) {
      return Promise.reject(
        new ApiError("Unable to reach Super Card backend server.", 0),
      );
    }
    return Promise.reject(new ApiError(error.message, 500));
  },
);

export default api;
