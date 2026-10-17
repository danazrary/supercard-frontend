/**
 * ============================================================================
 * File: src/services/api.js
 * Description: Centralized Axios instance configured with the API base URL,
 *              request timeout, JWT bearer-token injection (resolved from the
 *              appropriate role-specific token depending on the active
 *              session), automatic refresh-token retry on 401 responses, and
 *              unified error normalization so every service module throws
 *              consistent, UI-friendly Error objects.
 * Usage / Imported By: services/authService.js, services/offerService.js,
 *                       services/paymentService.js, services/prizeService.js,
 *                       services/merchantService.js
 * ============================================================================
 */

import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS, STORAGE_KEYS, ENDPOINTS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Resolves the correct bearer token for the current request context.
 * Priority: admin > merchant > customer. In practice each portal is a
 * distinct route tree so only one token will realistically be present
 * at a time, but the priority order guards against edge cases where an
 * admin is also logged in as a customer in the same browser.
 * @returns {string|null} JWT token or null if no session exists
 */
function resolveActiveToken() {
  return (
    localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.MERCHANT_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN) ||
    null
  );
}

/**
 * Determines which storage key to clear/refresh based on which token
 * is currently active, so a 401 only logs out the relevant session.
 * @returns {string} One of STORAGE_KEYS token constants
 */
function resolveActiveTokenKey() {
  if (localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)) return STORAGE_KEYS.ADMIN_TOKEN;
  if (localStorage.getItem(STORAGE_KEYS.MERCHANT_TOKEN)) return STORAGE_KEYS.MERCHANT_TOKEN;
  return STORAGE_KEYS.CUSTOMER_TOKEN;
}

// ----------------------------------------------------------------------------
// Request Interceptor — attach bearer token
// ----------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = resolveActiveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------------------
// Response Interceptor — refresh-token retry + unified error shape
// ----------------------------------------------------------------------------
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt a single silent refresh on 401, then retry the original request.
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH_TOKEN)) {
        // Refresh endpoint itself failed — hard logout.
        clearAllSessions();
        return Promise.reject(normalizeError(error));
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          const { data } = await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
            refreshToken,
          });
          const tokenKey = resolveActiveTokenKey();
          localStorage.setItem(tokenKey, data.accessToken);
          isRefreshing = false;
          onRefreshed(data.accessToken);
        } catch (refreshError) {
          isRefreshing = false;
          clearAllSessions();
          return Promise.reject(normalizeError(error));
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(normalizeError(error));
  }
);

/**
 * Clears all role-based sessions from localStorage. Called when a token
 * refresh ultimately fails (session fully expired).
 */
function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.MERCHANT_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

/**
 * Normalizes any Axios error into a consistent Error object carrying
 * a `status` code and a backend-provided `message` (falling back to a
 * generic message) so calling components never need to inspect Axios
 * internals directly.
 * @param {Object} error - Raw Axios error
 * @returns {Error} Normalized error with .status and .code attached
 */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || 'Something went wrong. Please try again.';
    const normalized = new Error(message);
    normalized.status = status;
    normalized.code = data?.code || null;
    normalized.details = data?.details || null;
    return normalized;
  }
  if (error.request) {
    const normalized = new Error('Unable to reach the server. Please check your connection.');
    normalized.status = 0;
    normalized.code = 'NETWORK_ERROR';
    return normalized;
  }
  return error;
}

export { clearAllSessions };
export default api;
