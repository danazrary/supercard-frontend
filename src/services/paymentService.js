/**
 * ============================================================================
 * File: src/services/paymentService.js
 * Description: Integration with First Iraqi Bank (FIB) payment gateway for
 *              digital card subscription invoicing, QR payload, and status checks.
 * Usage / Imported By: useFibPayment hook, FibPaymentModal, PaymentCallback.
 * ============================================================================
 */

import api from "./api";
import { API_ROUTES, APP_CONFIG } from "../utils/constants";

/**
 * @function initiateFibPayment
 * @description Generates an official FIB payment invoice for the 25,000 IQD card purchase.
 * @route POST /api/v1/payments/fib/create
 * @headers Authorization: Bearer <token> (optional if guest purchasing)
 * @param {string} customerPhone - Phone number of customer acquiring the card.
 * @payloadSentToBackend {
 *    "amount": 25000,
 *    "currency": "IQD",
 *    "customerPhone": "+9647503776072",
 *    "description": "Super Card VIP 1-Year Membership + C-BOX Lottery"
 * }
 * @responseFromBackend {
 *    "invoiceId": "fib_inv_984712049",
 *    "qrCode": "https://fib.iq/pay/qr/984712049",
 *    "deepLink": "fib://payment?invoiceId=fib_inv_984712049",
 *    "amount": 25000,
 *    "currency": "IQD",
 *    "expiresAt": "2026-10-13T16:30:00Z"
 * }
 * @throws {ApiError} 400 (Bad request), 502 (FIB Gateway communication failure).
 */
export async function initiateFibPayment(customerPhone) {
  return await api.post(API_ROUTES.PAYMENTS.CREATE_FIB, {
    amount: APP_CONFIG.CARD_PRICE_IQD,
    currency: APP_CONFIG.CURRENCY,
    customerPhone,
    description: `${APP_CONFIG.NAME} VIP Membership & Guaranteed C-BOX Instant Lottery`,
  });
}

/**
 * @function checkPaymentStatus
 * @description Polling endpoint querying real-time transaction state of an FIB invoice.
 * @route GET /api/v1/payments/fib/status?invoiceId=:invoiceId
 * @headers None
 * @param {string} invoiceId - Unique FIB transaction invoice identifier.
 * @payloadSentToBackend Query: ?invoiceId=fib_inv_984712049
 * @responseFromBackend {
 *    "invoiceId": "fib_inv_984712049",
 *    "status": "PAID",
 *    "paidAt": "2026-10-13T16:15:32Z",
 *    "cardId": "sc_card_39210",
 *    "token": "eyJhbGciOiJIUzI1Ni..."
 * }
 * @throws {ApiError} 404 (Invoice not found), 500.
 */
export async function checkPaymentStatus(invoiceId) {
  return await api.get(API_ROUTES.PAYMENTS.CHECK_STATUS, {
    params: { invoiceId },
  });
}

/**
 * @function verifyCallbackToken
 * @description Validates server-side redirect token returned when returning from FIB.
 * @route POST /api/v1/payments/fib/verify-callback
 * @param {string} callbackToken - Token passed in URL search parameters.
 * @payloadSentToBackend {
 *    "callbackToken": "fib_cb_tok_847192"
 * }
 * @responseFromBackend {
 *    "valid": true,
 *    "invoiceId": "fib_inv_984712049",
 *    "status": "PAID",
 *    "cardId": "sc_card_39210"
 * }
 * @throws {ApiError} 400 (Tampered or expired token), 500.
 */
export async function verifyCallbackToken(callbackToken) {
  return await api.post(API_ROUTES.PAYMENTS.VERIFY_CALLBACK, { callbackToken });
}
