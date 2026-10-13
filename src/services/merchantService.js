/**
 * ============================================================================
 * File: src/services/merchantService.js
 * Description: Zero-trust clinic scanner API for checking customer perk eligibility
 *              and confirming permanent redemption (preventing double-dipping).
 * Usage / Imported By: MerchantScanner, ManualCodeInput, RedemptionActions.
 * ============================================================================
 */

import api from "./api";
import { API_ROUTES } from "../utils/constants";

/**
 * @function verifyCardPerk
 * @description Checks whether a scanned customer Super Card has unredeemed free perks at this center.
 * @route POST /api/v1/merchant/verify-card
 * @headers Authorization: Bearer <merchantToken>
 * @param {string} cardPayload - Scanned QR code raw string or manual UUID.
 * @payloadSentToBackend {
 *    "cardPayload": "sc_card_39210"
 * }
 * @responseFromBackend {
 *    "valid": true,
 *    "cardId": "sc_card_39210",
 *    "customerName": "Ahmad Farhad",
 *    "customerPhone": "0750 *** *072",
 *    "perkStatus": "AVAILABLE",
 *    "perkDescriptionKu": "خاوێنکردنەوە و پشکنینی گشتی ددان (١٠٠٪ بێبەرامبەر)",
 *    "perkDescriptionAr": "فحص وتنظيف أسنان مجاني 100%",
 *    "perkDescriptionEn": "100% Free Dental Examination & Cleaning",
 *    "discountRate": 20,
 *    "expiresAt": "2027-10-13T00:00:00Z"
 * }
 * @throws {ApiError} 400 (Card payload format invalid), 404 (Card not found/expired), 500.
 */
export async function verifyCardPerk(cardPayload) {
  return await api.post(API_ROUTES.MERCHANT.VERIFY_CARD, { cardPayload });
}

/**
 * @function confirmRedemption
 * @description Confirms that the clinic has provided the 100% free perk, permanently locking it.
 * @route POST /api/v1/merchant/redeem-perk
 * @headers Authorization: Bearer <merchantToken>
 * @param {string} cardId - Super Card identifier.
 * @param {string} notes - Optional administrative memo from clinic receptionist.
 * @payloadSentToBackend {
 *    "cardId": "sc_card_39210",
 *    "notes": "Redeemed by Dr. Zana at Kurd Smile Dental"
 * }
 * @responseFromBackend {
 *    "success": true,
 *    "redemptionId": "rdm_849102",
 *    "perkStatus": "REDEEMED",
 *    "redeemedAt": "2026-10-13T16:22:10Z"
 * }
 * @throws {ApiError} 400 (Already redeemed), 401 (Unauthorized), 500.
 */
export async function confirmRedemption(cardId, notes = "") {
  return await api.post(API_ROUTES.MERCHANT.REDEEM, { cardId, notes });
}

/**
 * @function getMerchantHistory
 * @description Retrieves recent redemptions completed by the logged-in clinic.
 * @route GET /api/v1/merchant/redemption-history
 * @headers Authorization: Bearer <merchantToken>
 * @payloadSentToBackend None
 * @responseFromBackend {
 *    "redemptions": [
 *      {
 *        "redemptionId": "rdm_849102",
 *        "cardId": "sc_card_39210",
 *        "customerPhoneMasked": "0750 *** *072",
 *        "redeemedAt": "2026-10-13T16:22:10Z"
 *      }
 *    ]
 * }
 * @throws {ApiError} 401, 500.
 */
export async function getMerchantHistory() {
  return await api.get(API_ROUTES.MERCHANT.HISTORY);
}
