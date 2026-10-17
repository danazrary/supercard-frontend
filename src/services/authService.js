/**
 * ============================================================================
 * File: src/services/authService.js
 * Description: Client-side authentication service managing customer OTPs,
 *              merchant credentials, and super admin security tokens.
 * Usage / Imported By: AuthContext, AuthBuyModal, MerchantLogin, AdminDashboard.
 * ============================================================================
 */

import api from "./api";
import { API_ROUTES } from "../utils/constants";

/**
 * @function requestOtp
 * @description Triggers a one-time 6-digit SMS verification code to an Iraqi mobile number.
 * @route POST /api/v1/auth/customer/otp-request
 * @headers Content-Type: application/json
 * @param {string} phone - Normalized E.164 phone string (e.g., '+9647503776072').
 * @payloadSentToBackend {
 *    "phone": "+9647503776072"
 * }
 * @responseFromBackend {
 *    "success": true,
 *    "message": "OTP sent successfully via SMS",
 *    "cooldownSeconds": 60
 * }
 * @throws {ApiError} 400 (Invalid phone prefix), 429 (Rate limited SMS requests), 500.
 */
export async function requestOtp(phone) {
  return await api.post(API_ROUTES.AUTH.REQUEST_OTP, { phone });
}

/**
 * @function verifyOtp
 * @description Validates user OTP and generates a customer JWT session token.
 * @route POST /api/v1/auth/customer/otp-verify
 * @headers Content-Type: application/json
 * @param {string} phone - Normalized phone number.
 * @param {string} otp - 6-digit numerical string.
 * @payloadSentToBackend {
 *    "phone": "+9647503776072",
 *    "otp": "492018"
 * }
 * @responseFromBackend {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *    "user": {
 *      "id": "usr_9981",
 *      "phone": "+9647503776072",
 *      "role": "customer",
 *      "hasActiveCard": true,
 *      "activeCardId": "sc_card_39210"
 *    }
 * }
 * @throws {ApiError} 400 (Invalid/Expired OTP), 404 (User not found), 500.
 */
export async function verifyOtp(phone, otp) {
  return await api.post(API_ROUTES.AUTH.VERIFY_OTP, { phone, otp });
}

/**
 * @function loginMerchant
 * @description Authenticates partner clinics & beauty centers in Erbil.
 * @route POST /api/v1/auth/merchant/login
 * @headers Content-Type: application/json
 * @param {string} email - Merchant email address.
 * @param {string} password - Secure merchant secret.
 * @payloadSentToBackend {
 *    "email": "kurdsmile@supercard.iq",
 *    "password": "SecurePassword123!"
 * }
 * @responseFromBackend {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *    "merchant": {
 *      "id": "mch_001",
 *      "centerName": "Kurd Smile Dental",
 *      "centerNameKu": "ددانپزیشکی کورد سمایل",
 *      "role": "merchant",
 *      "perkCategory": "DENTAL"
 *    }
 * }
 * @throws {ApiError} 401 (Invalid merchant credentials), 403 (Account suspended), 500.
 */
export async function loginMerchant(email, password) {
  return await api.post(API_ROUTES.AUTH.MERCHANT_LOGIN, { email, password });
}

/**
 * @function loginAdmin
 * @description Authenticates platform administrators.
 * @route POST /api/v1/auth/admin/login
 * @headers Content-Type: application/json
 * @param {string} username - Admin username.
 * @param {string} password - Admin password.
 * @payloadSentToBackend {
 *    "username": "superadmin",
 *    "password": "MasterSuperCardPass2026"
 * }
 * @responseFromBackend {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *    "admin": {
 *      "id": "adm_master_01",
 *      "role": "admin",
 *      "name": "Super Card HQ Admin"
 *    }
 * }
 * @throws {ApiError} 401 (Unauthorized), 500.
 */
export async function loginAdmin(email, password) {
  return await api.post(API_ROUTES.AUTH.ADMIN_LOGIN, { email, password });
}

/**
 * @function logout
 * @description Invalidates current session server-side.
 * @route POST /api/v1/auth/logout
 * @headers Authorization: Bearer <token>
 * @payloadSentToBackend {}
 * @responseFromBackend {
 *    "success": true
 * }
 */
export async function logout() {
  return await api.post(API_ROUTES.AUTH.LOGOUT);
}
