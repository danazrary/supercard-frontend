/**
 * ============================================================================
 * File: src/services/offerService.js
 * Description: Offer management services providing 9:16 vertical visual perks,
 *              free service details, and ongoing discounts across Erbil centers.
 * Usage / Imported By: HomePage, OfferDetailModal, AdminOffersPage, AdminDashboard.
 * ============================================================================
 */

import api from "./api";
import { API_ROUTES } from "../utils/constants";

/**
 * @function getOffers
 * @description Retrieves all curated 9:16 vertical partner center offers in Erbil.
 * @route GET /api/v1/offers
 * @headers None
 * @param {Object} [filters={}] - Optional query filters (category, activeOnly).
 * @payloadSentToBackend Query: ?category=DENTAL&activeOnly=true
 * @responseFromBackend {
 *    "offers": [
 *      {
 *        "id": "off_01",
 *        "centerId": "mch_001",
 *        "centerName": "Kurd Smile Dental",
 *        "centerNameKu": "ددانپزیشکی کورد سمایل",
 *        "titleKu": "پشکنینی گشتی و خاوێنکردنەوەی ددان ١٠٠٪ بەخۆڕایی",
 *        "titleAr": "فحص شامل وتنظيف أسنان مجاني 100%",
 *        "titleEn": "100% FREE Full Dental Exam & Scaling",
 *        "discountRate": 20,
 *        "aspectRatio": "9:16",
 *        "imageUrl": "https://cdn.supercard.krd/offers/kurd-smile-916.webp",
 *        "location": "Erbil, Gulan St.",
 *        "phone": "+9647501112233",
 *        "isActive": true
 *      }
 *    ]
 * }
 * @throws {ApiError} 500.
 */
export async function getOffers(filters = {}) {
  return await api.get(API_ROUTES.OFFERS.BASE, { params: filters });
}

/**
 * @function getOfferById
 * @description Retrieves a single offer's granular terms and location.
 * @route GET /api/v1/offers/:id
 * @param {string} id - Offer ID.
 * @payloadSentToBackend None
 * @responseFromBackend {
 *    "offer": { ... }
 * }
 * @throws {ApiError} 404, 500.
 */
export async function getOfferById(id) {
  return await api.get(API_ROUTES.OFFERS.DETAIL(id));
}

/**
 * @function createOffer
 * @description Admin CMS route to publish a new 9:16 center showcase.
 * @route POST /api/v1/offers
 * @headers Authorization: Bearer <adminToken>
 * @param {Object} offerData - Complete offer details.
 * @payloadSentToBackend {
 *    "centerId": "mch_001",
 *    "titleKu": "لێزەری هەموو جەستە بە داشکاندنی ٢٠٪",
 *    "titleAr": "ليزر كامل الجسم بخصم 20%",
 *    "titleEn": "Full Body Laser with 20% Discount",
 *    "discountRate": 20,
 *    "imageUrl": "https://cdn.supercard.krd/offers/laser-916.webp",
 *    "terms": "Valid once per month"
 * }
 * @responseFromBackend {
 *    "success": true,
 *    "offer": { "id": "off_99", ... }
 * }
 * @throws {ApiError} 400, 401, 403, 500.
 */
export async function createOffer(offerData) {
  return await api.post(API_ROUTES.OFFERS.BASE, offerData);
}

/**
 * @function updateOffer
 * @description Admin CMS route to update existing offer metadata.
 * @route PUT /api/v1/offers/:id
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Offer identifier.
 * @param {Object} offerData - Updated fields.
 * @payloadSentToBackend { "discountRate": 25, "isActive": true }
 * @responseFromBackend { "success": true, "offer": { ... } }
 * @throws {ApiError} 400, 401, 404, 500.
 */
export async function updateOffer(id, offerData) {
  return await api.put(API_ROUTES.OFFERS.DETAIL(id), offerData);
}

/**
 * @function deleteOffer
 * @description Deletes an offer permanently.
 * @route DELETE /api/v1/offers/:id
 * @headers Authorization: Bearer <adminToken>
 * @param {string} id - Offer ID.
 * @payloadSentToBackend None
 * @responseFromBackend { "success": true }
 * @throws {ApiError} 401, 404, 500.
 */
export async function deleteOffer(id) {
  return await api.delete(API_ROUTES.OFFERS.DETAIL(id));
}
