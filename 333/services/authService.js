/**
 * ============================================================================
 * File: src/services/authService.js
 * Description: Handles all authentication flows for the three user roles:
 *              Customer (phone + OTP passwordless login), Merchant (username
 *              + password portal login), and Admin (username + password with
 *              elevated privileges). Also exposes session bootstrap (/auth/me)
 *              and logout. Tokens are persisted to localStorage under
 *              role-specific keys so multiple roles could theoretically be
 *              active in separate tabs without colliding.
 * Usage / Imported By: context/AuthContext.jsx, components/customer/
 *                       AuthBuyModal.jsx, pages/MerchantLogin.jsx,
 *                       pages/AdminLogin (admin shell)
 * ============================================================================
 */

import api from './api';
import { ENDPOINTS, STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { toE164IraqiPhone } from '../utils/formatters';

/**
 * @function requestOtp
 * @description Requests a one-time password to be sent via SMS to the
 *              customer's phone number, initiating the passwordless login
 *              / signup flow.
 * @route POST /api/v1/auth/customer/request-otp
 * @param {string} phone - Local Iraqi phone number (07XXXXXXXXX)
 * @payloadSentToBackend {
 *    "phone": "+9647501234567"
 * }
 * @responseFromBackend {
 *    "success": true,
 *    "otpExpiresInSeconds": 120,
 *    "requestId": "a1b2c3d4-..."
 * }
 * @throws {Error} 400 - invalid phone format
 * @throws {Error} 429 - too many OTP requests, rate limited
 * @throws {Error} 500 - SMS gateway failure
 */
export async function requestOtp(phone) {
  const e164Phone = toE164IraqiPhone(phone);
  const { data } = await api.post(ENDPOINTS.AUTH.REQUEST_OTP, { phone: e164Phone });
  return data;
}

/**
 * @function verifyOtp
 * @description Verifies the OTP code submitted by the customer. On success,
 *              the backend returns a JWT access token (and refresh token)
 *              which is persisted locally, establishing the customer session.
 *              If the phone number is new, the backend implicitly creates
 *              the customer account (signup-via-login pattern).
 * @route POST /api/v1/auth/customer/verify-otp
 * @param {string} phone - Local Iraqi phone number (07XXXXXXXXX)
 * @param {string} otp - The OTP code entered by the user
 * @payloadSentToBackend {
 *    "phone": "+9647501234567",
 *    "otp": "123456",
 *    "requestId": "a1b2c3d4-..."
 * }
 * @responseFromBackend {
 *    "accessToken": "eyJhbGciOi...",
 *    "refreshToken": "eyJhbGciOi...",
 *    "user": {
 *      "id": "uuid",
 *      "phone": "+9647501234567",
 *      "name": "string|null",
 *      "cardActive": false,
 *      "role": "customer"
 *    }
 * }
 * @throws {Error} 400 - invalid or expired OTP
 * @throws {Error} 404 - OTP request not found
 */
export async function verifyOtp(phone, otp, requestId) {
  const e164Phone = toE164IraqiPhone(phone);
  const { data } = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
    phone: e164Phone,
    otp,
    requestId,
  });

  persistSession(USER_ROLES.CUSTOMER, data);
  return data;
}

/**
 * @function merchantLogin
 * @description Authenticates a merchant/clinic staff account using
 *              username and password credentials issued by the super-admin.
 * @route POST /api/v1/auth/merchant/login
 * @param {string} username - Merchant portal username
 * @param {string} password - Merchant portal password
 * @payloadSentToBackend {
 *    "username": "kurdsmile_dental",
 *    "password": "string"
 * }
 * @responseFromBackend {
 *    "accessToken": "eyJhbGciOi...",
 *    "refreshToken": "eyJhbGciOi...",
 *    "merchant": {
 *      "id": "uuid",
 *      "centerName": "Kurd Smile Dental",
 *      "username": "kurdsmile_dental",
 *      "role": "merchant"
 *    }
 * }
 * @throws {Error} 401 - invalid credentials
 * @throws {Error} 403 - account deactivated by admin
 */
export async function merchantLogin(username, password) {
  const { data } = await api.post(ENDPOINTS.AUTH.MERCHANT_LOGIN, { username, password });
  persistSession(USER_ROLES.MERCHANT, data);
  return data;
}

/**
 * @function adminLogin
 * @description Authenticates a super-admin account with full CMS access
 *              over offers, centers, and the prize engine.
 * @route POST /api/v1/auth/admin/login
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @payloadSentToBackend {
 *    "username": "superadmin",
 *    "password": "string"
 * }
 * @responseFromBackend {
 *    "accessToken": "eyJhbGciOi...",
 *    "refreshToken": "eyJhbGciOi...",
 *    "admin": {
 *      "id": "uuid",
 *      "username": "superadmin",
 *      "role": "admin"
 *    }
 * }
 * @throws {Error} 401 - invalid credentials
 */
export async function adminLogin(username, password) {
  const { data } = await api.post(ENDPOINTS.AUTH.ADMIN_LOGIN, { username, password });
  persistSession(USER_ROLES.ADMIN, data);
  return data;
}

/**
 * @function getCurrentUser
 * @description Fetches the currently authenticated user/merchant/admin
 *              profile based on the bearer token attached by the API
 *              interceptor. Used on app bootstrap to restore session state.
 * @route GET /api/v1/auth/me
 * @headers Authorization: Bearer <token>
 * @responseFromBackend {
 *    "id": "uuid",
 *    "role": "customer | merchant | admin",
 *    "...roleSpecificFields": "..."
 * }
 * @throws {Error} 401 - token invalid or expired
 */
export async function getCurrentUser() {
  const { data } = await api.get(ENDPOINTS.AUTH.ME);
  return data;
}

/**
 * @function logout
 * @description Invalidates the current session server-side (revokes the
 *              refresh token) and clears all locally persisted session data.
 * @route POST /api/v1/auth/logout
 * @headers Authorization: Bearer <token>
 * @payloadSentToBackend {
 *    "refreshToken": "eyJhbGciOi..."
 * }
 * @responseFromBackend {
 *    "success": true
 * }
 * @throws {Error} 401 - already logged out / invalid token
 */
export async function logout() {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    await api.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  } finally {
    clearSession();
  }
}

// ----------------------------------------------------------------------------
// Local Session Helpers
// ----------------------------------------------------------------------------

/**
 * Persists tokens and profile data to localStorage under the correct
 * role-specific key after a successful login/verify call.
 * @param {string} role - One of USER_ROLES
 * @param {Object} data - Response payload containing accessToken/refreshToken
 */
function persistSession(role, data) {
  const tokenKeyMap = {
    [USER_ROLES.CUSTOMER]: STORAGE_KEYS.CUSTOMER_TOKEN,
    [USER_ROLES.MERCHANT]: STORAGE_KEYS.MERCHANT_TOKEN,
    [USER_ROLES.ADMIN]: STORAGE_KEYS.ADMIN_TOKEN,
  };
  localStorage.setItem(tokenKeyMap[role], data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
  }
  const profile = data.user || data.merchant || data.admin;
  if (profile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }
}

/**
 * Clears all locally persisted session data (all roles).
 */
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.MERCHANT_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

/**
 * Reads the cached user profile from localStorage without hitting the
 * network — used for instant UI hydration before /auth/me resolves.
 * @returns {Object|null} Cached profile or null
 */
export function getCachedProfile() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
