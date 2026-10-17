/**
 * ============================================================================
 * File: src/services/prizeService.js
 * Description: Handles the "C-BOX" instant-lottery gift reveal flow. The
 *              actual prize selection (weighted random draw against live
 *              stock) happens entirely server-side as an atomic, zero-trust
 *              operation to prevent any possibility of client-side
 *              manipulation or duplicate claims. Also exposes the public
 *              active prize pool (for marketing display) and admin controls
 *              for stock/weight management.
 * Usage / Imported By: hooks/useGiftLottery.js, components/customer/
 *                       GiftBoxModal.jsx, components/admin/PrizeEnginePanel.jsx
 * ============================================================================
 */

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/**
 * @function openGiftBox
 * @description Triggers the one-time, atomic server-side prize claim for
 *              the authenticated customer's card. The backend guarantees
 *              idempotency — calling this twice for a card that has already
 *              claimed a prize returns the previously won prize rather than
 *              drawing again, preventing double-dipping via network retries.
 * @route POST /api/v1/prizes/open
 * @headers Authorization: Bearer <customerToken>
 * @payloadSentToBackend {
 *    // No body required; the customer identity + card is resolved from the JWT
 * }
 * @responseFromBackend {
 *    "alreadyClaimed": false,
 *    "prize": {
 *      "id": "uuid",
 *      "name": "string",
 *      "tier": "cash | gadget | grand",
 *      "imageUrl": "string",
 *      "valueLabel": "string (e.g. '5,000 IQD' or 'iPhone 18 Pro Max')"
 *    },
 *    "claimedAt": "ISO8601"
 * }
 * @throws {Error} 403 - card not active / payment not completed
 * @throws {Error} 409 - lottery pool exhausted (should not happen; grand-prize fallback tier applies server-side)
 */
export async function openGiftBox() {
  const { data } = await api.post(ENDPOINTS.PRIZES.OPEN_BOX);
  return data;
}

/**
 * @function getActivePrizePool
 * @description Fetches the public-facing list of prize tiers currently in
 *              rotation, used purely for marketing/teaser display on the
 *              landing page (does not expose real-time stock counts or
 *              probability weights to the client).
 * @route GET /api/v1/prizes/active-pool
 * @responseFromBackend {
 *    "prizes": [
 *      {
 *        "id": "uuid",
 *        "name": "string",
 *        "tier": "cash | gadget | grand",
 *        "imageUrl": "string"
 *      }
 *    ]
 * }
 * @throws {Error} 500 - server error
 */
export async function getActivePrizePool() {
  const { data } = await api.get(ENDPOINTS.PRIZES.ACTIVE_POOL);
  return data.prizes;
}

/**
 * @function getAdminPrizeList
 * @description [ADMIN] Fetches the full prize inventory including live
 *              stock counts and probability weights for the PrizeEnginePanel.
 * @route GET /api/v1/admin/prizes
 * @headers Authorization: Bearer <adminToken>
 * @responseFromBackend {
 *    "prizes": [
 *      {
 *        "id": "uuid",
 *        "name": "string",
 *        "tier": "cash | gadget | grand",
 *        "stockRemaining": 42,
 *        "weight": 10,
 *        "isActive": true
 *      }
 *    ]
 * }
 * @throws {Error} 401 - unauthorized
 */
export async function getAdminPrizeList() {
  const { data } = await api.get(ENDPOINTS.PRIZES.ADMIN_LIST);
  return data.prizes;
}

/**
 * @function updatePrizeStock
 * @description [ADMIN] Updates the remaining stock count and/or probability
 *              weight for a given prize tier.
 * @route PATCH /api/v1/admin/prizes/:id/stock
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Prize UUID
 * @param {Object} fields - Fields to update
 * @param {number} [fields.stockRemaining] - New stock count
 * @param {number} [fields.weight] - New probability weight
 * @payloadSentToBackend {
 *    "stockRemaining": 50,
 *    "weight": 15
 * }
 * @responseFromBackend {
 *    "id": "uuid",
 *    "stockRemaining": 50,
 *    "weight": 15
 * }
 * @throws {Error} 404 - prize not found
 * @throws {Error} 400 - invalid stock/weight values
 */
export async function updatePrizeStock(id, fields) {
  const { data } = await api.patch(ENDPOINTS.PRIZES.ADMIN_UPDATE_STOCK(id), fields);
  return data;
}

/**
 * @function togglePrizeActive
 * @description [ADMIN] Activates or deactivates a prize tier from the
 *              live lottery rotation (e.g. to pause a sold-out grand prize).
 * @route PATCH /api/v1/admin/prizes/:id/toggle
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Prize UUID
 * @responseFromBackend {
 *    "id": "uuid",
 *    "isActive": false
 * }
 * @throws {Error} 404 - prize not found
 */
export async function togglePrizeActive(id) {
  const { data } = await api.patch(ENDPOINTS.PRIZES.ADMIN_TOGGLE(id));
  return data;
}
