/**
 * ============================================================================
 * File: src/services/paymentService.js
 * Description: Handles the First Iraqi Bank (FIB) payment lifecycle for
 *              Super Card purchases: creating a FIB invoice (returns QR code
 *              data + mobile deep link), polling invoice status until the
 *              customer completes payment in the FIB app, and verifying the
 *              server-side webhook callback result once the browser is
 *              redirected back to /payment/callback.
 * Usage / Imported By: hooks/useFibPayment.js, components/customer/
 *                       FibPaymentModal.jsx, pages/PaymentCallback.jsx,
 *                       context/PaymentContext.jsx
 * ============================================================================
 */

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/**
 * @function createFibPayment
 * @description Initiates a new FIB payment invoice for the Super Card
 *              purchase price. The backend creates the invoice with FIB's
 *              API and returns both a QR code payload (for desktop/in-app
 *              scanning) and a mobile deep link (for same-device FIB app
 *              handoff).
 * @route POST /api/v1/payments/fib/create
 * @headers Authorization: Bearer <customerToken>
 * @param {Object} [metadata] - Optional metadata (e.g. referral code)
 * @payloadSentToBackend {
 *    "amount": 25000,
 *    "currency": "IQD",
 *    "purpose": "super_card_purchase",
 *    "referralCode": "string|null"
 * }
 * @responseFromBackend {
 *    "invoiceId": "uuid",
 *    "qrCodeData": "string (raw payload to render as QR)",
 *    "deepLink": "fib://pay?invoice=uuid",
 *    "expiresAt": "ISO8601",
 *    "status": "pending"
 * }
 * @throws {Error} 401 - unauthorized
 * @throws {Error} 409 - customer already has an active card
 * @throws {Error} 502 - FIB gateway unreachable
 */
export async function createFibPayment(metadata = {}) {
  const { data } = await api.post(ENDPOINTS.PAYMENTS.CREATE_FIB, {
    amount: 25000,
    currency: 'IQD',
    purpose: 'super_card_purchase',
    ...metadata,
  });
  return data;
}

/**
 * @function checkFibPaymentStatus
 * @description Polls the current status of a previously created FIB
 *              invoice. Intended to be called on a fixed interval
 *              (see FIB_POLL_INTERVAL_MS) while the FibPaymentModal is open,
 *              until status resolves to "paid", "failed", or "expired".
 * @route GET /api/v1/payments/fib/status/:invoiceId
 * @headers Authorization: Bearer <customerToken>
 * @param {string} invoiceId - FIB invoice UUID returned by createFibPayment
 * @responseFromBackend {
 *    "invoiceId": "uuid",
 *    "status": "pending | paid | failed | expired",
 *    "paidAt": "ISO8601|null",
 *    "cardActivated": true
 * }
 * @throws {Error} 404 - invoice not found
 * @throws {Error} 401 - unauthorized
 */
export async function checkFibPaymentStatus(invoiceId) {
  const { data } = await api.get(ENDPOINTS.PAYMENTS.CHECK_STATUS(invoiceId));
  return data;
}

/**
 * @function verifyFibCallback
 * @description Called when the browser is redirected back to
 *              /payment/callback from the FIB app/web flow. Re-verifies
 *              the final payment outcome server-side (do not trust URL
 *              query params alone, as they are client-controllable) and
 *              returns the authoritative result along with updated card
 *              status.
 * @route POST /api/v1/payments/fib/verify-callback
 * @headers Authorization: Bearer <customerToken>
 * @param {string} invoiceId - FIB invoice UUID from the redirect query params
 * @payloadSentToBackend {
 *    "invoiceId": "uuid"
 * }
 * @responseFromBackend {
 *    "status": "paid | failed | expired",
 *    "cardActivated": true,
 *    "cardCode": "uuid|null",
 *    "giftBoxEligible": true
 * }
 * @throws {Error} 404 - invoice not found
 * @throws {Error} 409 - invoice already processed
 */
export async function verifyFibCallback(invoiceId) {
  const { data } = await api.post(ENDPOINTS.PAYMENTS.VERIFY_CALLBACK, { invoiceId });
  return data;
}
