/**
 * ============================================================================
 * File: src/assets/images/index.js
 * Description: Base64/SVG inline assets for C-BOX luxury gold chest, VIP Card
 *              metallic backgrounds, and 9:16 vertical clinic placeholders.
 * Usage / Imported By: GiftBoxModal, CustomerQRCard, OfferCMSForm.
 * ============================================================================
 */

export const IMAGES = {
  GOLD_CHEST_CLOSED: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffc800"/><stop offset="50%" stop-color="%23e5a500"/><stop offset="100%" stop-color="%238a6300"/></linearGradient></defs><rect x="40" y="90" width="220" height="150" rx="16" fill="%230f1d2d" stroke="url(%23gold)" stroke-width="6"/><path d="M40 130 h220" stroke="url(%23gold)" stroke-width="4"/><circle cx="150" cy="130" r="20" fill="url(%23gold)"/><rect x="145" y="130" width="10" height="24" rx="2" fill="%23060b13"/></svg>`,
  GOLD_CHEST_OPEN: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffc800"/><stop offset="100%" stop-color="%2300e5c9"/></linearGradient></defs><rect x="40" y="140" width="220" height="110" rx="16" fill="%230f1d2d" stroke="url(%23gold)" stroke-width="6"/><polygon points="30,120 150,40 270,120 250,140 50,140" fill="url(%23gold)" opacity="0.9"/><circle cx="150" cy="90" r="30" fill="%23ffc800" filter="drop-shadow(0 0 15px %23ffc800)"/></svg>`,
  OFFER_PLACEHOLDER_916: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"><rect width="360" height="640" fill="%230b1522"/><text x="180" y="320" fill="%2300e5c9" font-family="sans-serif" font-size="22" text-anchor="middle">9:16 VIP OFFER</text></svg>`,
};
