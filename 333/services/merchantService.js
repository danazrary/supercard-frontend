/**
 * ============================================================================
 * File: src/services/merchantService.js
 * Description: Powers the in-clinic merchant scanning workflow: resolving a
 *              scanned customer card UUID into card/customer details,
 *              verifying whether the specific perk tied to the logged-in
 *              merchant's center is still available (zero-trust check against
 *              server-authoritative redemption records), and confirming a
 *              redemption which atomically marks the perk as used.
 * Usage / Imported By: hooks/useQRScanner.js, components/merchant/
 *                       QRScannerCamera.jsx, components/merchant/
 *                       OfferStatusAlert.jsx, components/merchant/
 *                       RedemptionActions.jsx, pages/MerchantScanner.jsx
 * ============================================================================
 */

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/**
 * @function scanCard
 * @description Resolves a scanned/manually-entered card UUID into basic
 *              customer + card status information. This is a read-only
 *              lookup and does NOT itself consume any perk.
 * @route POST /api/v1/merchant/scan
 * @headers Authorization: Bearer <merchantToken>
 * @param {string} cardCode - UUID encoded in the customer's QR code
 * @payloadSentToBackend {
 *    "cardCode": "uuid"
 * }
 * @responseFromBackend {
 *    "valid": true,
 *    "card": {
 *      "id": "uuid",
 *      "customerName": "string",
 *      "isActive": true,
 *      "activatedAt": "ISO8601"
 *    }
 * }
 * @throws {Error} 404 - card code not found
 * @throws {Error} 400 - malformed card code
 */
export async function scanCard(cardCode) {
  const { data } = await api.post(ENDPOINTS.MERCHANT.SCAN_CARD, { cardCode });
  return data;
}

/**
 * @function verifyPerkEligibility
 * @description Performs the zero-trust check of whether the perk belonging
 *              to the currently logged-in merchant's center has already been
 *              redeemed on this specific card. This is the authoritative
 *              source of truth the UI uses to render the green ("available")
 *              or red ("already redeemed") status banner — client state is
 *              never trusted for this decision.
 * @route POST /api/v1/merchant/verify-perk
 * @headers Authorization: Bearer <merchantToken>
 * @param {string} cardCode - UUID encoded in the customer's QR code
 * @payloadSentToBackend {
 *    "cardCode": "uuid"
 * }
 * @responseFromBackend {
 *    "eligible": true,
 *    "perk": {
 *      "centerId": "uuid",
 *      "centerName": "string",
 *      "discountPercent": 20,
 *      "isFree": false
 *    },
 *    "alreadyRedeemedAt": "ISO8601|null"
 * }
 * @throws {Error} 404 - card not found
 * @throws {Error} 403 - card inactive / payment incomplete
 */
export async function verifyPerkEligibility(cardCode) {
  const { data } = await api.post(ENDPOINTS.MERCHANT.VERIFY_PERK, { cardCode });
  return data;
}

/**
 * @function confirmRedemption
 * @description Atomically marks the merchant's perk as redeemed for the
 *              given card. This is a one-way, idempotent-guarded operation:
 *              a second confirmation attempt for the same card+center pair
 *              will be rejected with 409, which the UI surfaces as the
 *              "already redeemed" state (corresponds to the "کارتەکەمان
 *              بەکارهێنا" confirmation action).
 * @route POST /api/v1/merchant/confirm-redemption
 * @headers Authorization: Bearer <merchantToken>
 * @param {string} cardCode - UUID encoded in the customer's QR code
 * @param {boolean} wasUsed - True if staff confirms the perk was used
 * @payloadSentToBackend {
 *    "cardCode": "uuid",
 *    "wasUsed": true
 * }
 * @responseFromBackend {
 *    "success": true,
 *    "redemption": {
 *      "id": "uuid",
 *      "redeemedAt": "ISO8601",
 *      "merchantId": "uuid"
 *    }
 * }
 * @throws {Error} 409 - perk already redeemed
 * @throws {Error} 403 - card inactive
 * @throws {Error} 404 - card not found
 */
export async function confirmRedemption(cardCode, wasUsed) {
  const { data } = await api.post(ENDPOINTS.MERCHANT.CONFIRM_REDEMPTION, { cardCode, wasUsed });
  return data;
}
