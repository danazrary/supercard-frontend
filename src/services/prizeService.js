/**
 * ============================================================================
 * File: src/services/prizeService.js
 * Description: Zero-trust atomic prize lottery engine for "C-BOX Luxury Black & Gold",
 *              executing guaranteed instant prize claims on card activation.
 * Usage / Imported By: useGiftLottery hook, GiftBoxModal, AdminDashboard.
 * ============================================================================
 */

import api from "./api";
import { API_ROUTES } from "../utils/constants";

/**
 * @function openGiftBox
 * @description Atomically claims the guaranteed instant lottery box tied to a valid card.
 * @route POST /api/v1/prizes/cbox/claim
 * @headers Authorization: Bearer <customerToken>
 * @param {string} cardId - Unique customer Super Card identifier.
 * @payloadSentToBackend {
 *    "cardId": "sc_card_39210"
 * }
 * @responseFromBackend {
 *    "success": true,
 *    "prize": {
 *      "claimId": "clm_7829104",
 *      "tier": "TIER_3",
 *      "nameKu": "کاتژمێری زیرەکی Smart Watch",
 *      "nameAr": "ساعة يد ذكية Smart Watch",
 *      "nameEn": "Luxury Smart Watch",
 *      "valueIqd": 65000,
 *      "redeemCode": "CBOX-WATCH-9921",
 *      "claimedAt": "2026-10-13T16:20:00Z"
 *    }
 * }
 * @throws {ApiError} 400 (Box already opened), 403 (Card inactive or expired), 500.
 */
export async function openGiftBox(cardId) {
  return await api.post(API_ROUTES.PRIZES.CLAIM_BOX, { cardId });
}

/**
 * @function getActivePrizePool
 * @description Fetches all available prizes and odds weights for display.
 * @route GET /api/v1/prizes/pool
 * @headers None
 * @payloadSentToBackend None
 * @responseFromBackend {
 *    "pool": [
 *      { "tier": "TIER_1", "nameEn": "5,000 IQD Instant Cash Balance", "stock": 1400 },
 *      { "tier": "TIER_2", "nameEn": "10,000 IQD Instant Cash Balance", "stock": 800 },
 *      { "tier": "TIER_3", "nameEn": "Smartwatch", "stock": 120 },
 *      { "tier": "TIER_4", "nameEn": "Luxury Headphones", "stock": 85 },
 *      { "tier": "TIER_5", "nameEn": "iPhone 18 Pro Max", "stock": 3 }
 *    ]
 * }
 * @throws {ApiError} 500.
 */
export async function getActivePrizePool() {
  return await api.get(API_ROUTES.PRIZES.POOL);
}

/**
 * @function adminUpdatePrizeConfig
 * @description Administrative control over live weights, stock count, and active states.
 * @route PUT /api/v1/admin/prizes/config
 * @headers Authorization: Bearer <adminToken>
 * @param {Array<Object>} prizeConfigs - Updated prize probability and inventory limits.
 * @payloadSentToBackend {
 *    "prizes": [
 *      { "tier": "TIER_5", "stock": 2, "probabilityWeight": 0.001, "isActive": true }
 *    ]
 * }
 * @responseFromBackend { "success": true, "updatedCount": 1 }
 * @throws {ApiError} 401, 403, 500.
 */
export async function adminUpdatePrizeConfig(prizeConfigs) {
  return await api.put(API_ROUTES.PRIZES.ADMIN_CONFIG, {
    prizes: prizeConfigs,
  });
}
