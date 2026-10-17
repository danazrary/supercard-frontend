/**
 * ============================================================================
 * File: src/assets/images/placeholders.js
 * Description: Base64-encoded inline SVG placeholder images for prize tiers,
 *              partner centers (9:16 offer cards), and brand marks. These
 *              act as safe local fallbacks (no network dependency, no 404s)
 *              until real photography/artwork is uploaded through the Admin
 *              CMS image dropzone and the backend returns CDN URLs.
 * Usage / Imported By: components/admin/OfferCMSForm.jsx (empty-state
 *                       preview), pages/HomePage.jsx (offer image fallback),
 *                       components/customer/GiftBoxModal.jsx (prize fallback)
 * ============================================================================
 */

function svgToDataUri(svg) {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const OFFER_PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640" viewBox="0 0 360 640">
  <rect width="360" height="640" fill="#0e1e2e"/>
  <rect x="1" y="1" width="358" height="638" fill="none" stroke="#ffc800" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="180" cy="280" r="60" fill="none" stroke="#00e5c9" stroke-width="3" opacity="0.6"/>
  <text x="180" y="400" font-family="sans-serif" font-size="20" fill="#cbd5e1" text-anchor="middle">Super Card</text>
</svg>
`.trim();

const PRIZE_PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#060b13"/>
  <polygon points="100,30 170,100 100,170 30,100" fill="none" stroke="#ffc800" stroke-width="3"/>
  <circle cx="100" cy="100" r="28" fill="#ffc800" opacity="0.15"/>
</svg>
`.trim();

const BRAND_MARK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="20" fill="#060b13"/>
  <text x="60" y="68" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffc800" text-anchor="middle">SC</text>
</svg>
`.trim();

export const OFFER_IMAGE_PLACEHOLDER = svgToDataUri(OFFER_PLACEHOLDER_SVG);
export const PRIZE_IMAGE_PLACEHOLDER = svgToDataUri(PRIZE_PLACEHOLDER_SVG);
export const BRAND_MARK_PLACEHOLDER = svgToDataUri(BRAND_MARK_SVG);
