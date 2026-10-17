/**
 * ============================================================================
 * File: src/services/offerService.js
 * Description: Manages fetching of public-facing partner-center offers for
 *              the customer landing page / offer detail modal, as well as
 *              full admin CRUD operations over offers (create, update,
 *              delete, toggle active/inactive) consumed by the Admin CMS
 *              panel (OfferCMSForm).
 * Usage / Imported By: pages/HomePage, components/customer/OfferDetailModal,
 *                       components/admin/OfferCMSForm, pages/AdminDashboard
 * ============================================================================
 */

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/**
 * @function getOffers
 * @description Fetches the list of currently active offers to display on
 *              the customer landing page, optionally filtered by category.
 * @route GET /api/v1/offers
 * @param {Object} [params] - Optional query params
 * @param {string} [params.category] - Filter by category slug
 * @payloadSentToBackend {
 *    // Query string: ?category=dental
 * }
 * @responseFromBackend {
 *    "offers": [
 *      {
 *        "id": "uuid",
 *        "title": "string",
 *        "category": "dental | beauty | laser | other",
 *        "imageUrl": "string (9:16 asset)",
 *        "discountPercent": 20,
 *        "isFree": false,
 *        "centerId": "uuid",
 *        "centerName": "string",
 *        "isActive": true
 *      }
 *    ]
 * }
 * @throws {Error} 500 - server error
 */
export async function getOffers(params = {}) {
  const { data } = await api.get(ENDPOINTS.OFFERS.LIST, { params });
  return data.offers;
}

/**
 * @function getOfferById
 * @description Fetches full detail for a single offer, including terms,
 *              location, and contact info — used by OfferDetailModal.
 * @route GET /api/v1/offers/:id
 * @param {string} id - Offer UUID
 * @responseFromBackend {
 *    "id": "uuid",
 *    "title": "string",
 *    "description": "string",
 *    "category": "string",
 *    "imageUrl": "string",
 *    "discountPercent": 20,
 *    "isFree": false,
 *    "terms": "string",
 *    "center": {
 *      "id": "uuid",
 *      "name": "string",
 *      "address": "string",
 *      "lat": 36.19,
 *      "lng": 44.01,
 *      "whatsapp": "+9647501234567"
 *    }
 * }
 * @throws {Error} 404 - offer not found
 */
export async function getOfferById(id) {
  const { data } = await api.get(ENDPOINTS.OFFERS.DETAIL(id));
  return data;
}

/**
 * @function createOffer
 * @description [ADMIN] Creates a new offer tied to a partner center.
 *              Expects a pre-uploaded 9:16 image URL (image upload handled
 *              separately via a media endpoint, out of scope here).
 * @route POST /api/v1/admin/offers
 * @headers Authorization: Bearer <adminToken>
 * @param {Object} offerPayload - New offer fields
 * @payloadSentToBackend {
 *    "title": "string",
 *    "description": "string",
 *    "category": "string",
 *    "imageUrl": "string",
 *    "discountPercent": 20,
 *    "isFree": false,
 *    "terms": "string",
 *    "centerId": "uuid"
 * }
 * @responseFromBackend {
 *    "id": "uuid",
 *    "createdAt": "ISO8601"
 * }
 * @throws {Error} 400 - validation error
 * @throws {Error} 401 - unauthorized
 */
export async function createOffer(offerPayload) {
  const { data } = await api.post(ENDPOINTS.OFFERS.ADMIN_CREATE, offerPayload);
  return data;
}

/**
 * @function updateOffer
 * @description [ADMIN] Updates an existing offer's fields.
 * @route PUT /api/v1/admin/offers/:id
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Offer UUID
 * @param {Object} updates - Partial offer fields to update
 * @payloadSentToBackend {
 *    "title": "string",
 *    "discountPercent": 25
 * }
 * @responseFromBackend {
 *    "id": "uuid",
 *    "updatedAt": "ISO8601"
 * }
 * @throws {Error} 404 - offer not found
 * @throws {Error} 401 - unauthorized
 */
export async function updateOffer(id, updates) {
  const { data } = await api.put(ENDPOINTS.OFFERS.ADMIN_UPDATE(id), updates);
  return data;
}

/**
 * @function deleteOffer
 * @description [ADMIN] Permanently deletes an offer.
 * @route DELETE /api/v1/admin/offers/:id
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Offer UUID
 * @responseFromBackend {
 *    "success": true
 * }
 * @throws {Error} 404 - offer not found
 */
export async function deleteOffer(id) {
  const { data } = await api.delete(ENDPOINTS.OFFERS.ADMIN_DELETE(id));
  return data;
}

/**
 * @function toggleOfferActive
 * @description [ADMIN] Toggles an offer's visibility on the public
 *              landing page without deleting its underlying data.
 * @route PATCH /api/v1/admin/offers/:id/toggle
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Offer UUID
 * @responseFromBackend {
 *    "id": "uuid",
 *    "isActive": true
 * }
 * @throws {Error} 404 - offer not found
 */
export async function toggleOfferActive(id) {
  const { data } = await api.patch(ENDPOINTS.OFFERS.ADMIN_TOGGLE(id));
  return data;
}
