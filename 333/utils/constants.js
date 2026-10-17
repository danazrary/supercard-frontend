/**
 * ============================================================================
 * File: src/utils/constants.js
 * Description: Centralized application-wide constants including pricing,
 *              contact information, social media handles, API endpoint paths,
 *              storage keys, and polling intervals. Having a single source of
 *              truth here prevents magic numbers/strings scattered across the
 *              codebase and makes business-rule changes (e.g. card price)
 *              a one-line edit.
 * Usage / Imported By: services/*, components/customer/*, pages/*,
 *                       utils/formatters.js, utils/validations.js
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// Business / Pricing
// ----------------------------------------------------------------------------
export const SUPER_CARD_PRICE_IQD = 25000;
export const SUPER_CARD_CURRENCY = 'IQD';
export const SUPER_CARD_CURRENCY_LABEL_KU = 'دینار';

// ----------------------------------------------------------------------------
// Official Contact / Social
// ----------------------------------------------------------------------------
export const OFFICIAL_PHONE_NUMBER = '+9647503776072';
export const OFFICIAL_WHATSAPP_LINK = `https://wa.me/9647503776072`;
export const SOCIAL_LINKS = {
  whatsapp: OFFICIAL_WHATSAPP_LINK,
  instagram: 'https://instagram.com/supercard.erbil',
  snapchat: 'https://snapchat.com/add/supercard.erbil',
};

// ----------------------------------------------------------------------------
// API Base Configuration
// ----------------------------------------------------------------------------
export const API_BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL ||
  "https://api.supercard.iq/api/v1";
export const API_TIMEOUT_MS = 20000;

// ----------------------------------------------------------------------------
// API Endpoint Paths (grouped by domain)
// ----------------------------------------------------------------------------
export const ENDPOINTS = {
  AUTH: {
    REQUEST_OTP: '/auth/customer/request-otp',
    VERIFY_OTP: '/auth/customer/verify-otp',
    MERCHANT_LOGIN: '/auth/merchant/login',
    ADMIN_LOGIN: '/auth/admin/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  OFFERS: {
    LIST: '/offers',
    DETAIL: (id) => `/offers/${id}`,
    ADMIN_CREATE: '/admin/offers',
    ADMIN_UPDATE: (id) => `/admin/offers/${id}`,
    ADMIN_DELETE: (id) => `/admin/offers/${id}`,
    ADMIN_TOGGLE: (id) => `/admin/offers/${id}/toggle`,
  },
  PAYMENTS: {
    CREATE_FIB: '/payments/fib/create',
    CHECK_STATUS: (invoiceId) => `/payments/fib/status/${invoiceId}`,
    VERIFY_CALLBACK: '/payments/fib/verify-callback',
  },
  PRIZES: {
    OPEN_BOX: '/prizes/open',
    ACTIVE_POOL: '/prizes/active-pool',
    ADMIN_LIST: '/admin/prizes',
    ADMIN_UPDATE_STOCK: (id) => `/admin/prizes/${id}/stock`,
    ADMIN_TOGGLE: (id) => `/admin/prizes/${id}/toggle`,
  },
  MERCHANT: {
    SCAN_CARD: '/merchant/scan',
    VERIFY_PERK: '/merchant/verify-perk',
    CONFIRM_REDEMPTION: '/merchant/confirm-redemption',
  },
  ADMIN: {
    CENTERS_LIST: '/admin/centers',
    CENTERS_CREATE: '/admin/centers',
    CENTERS_UPDATE: (id) => `/admin/centers/${id}`,
    CENTERS_TOGGLE: (id) => `/admin/centers/${id}/toggle`,
  },
};

// ----------------------------------------------------------------------------
// LocalStorage Keys
// ----------------------------------------------------------------------------
export const STORAGE_KEYS = {
  CUSTOMER_TOKEN: 'sc_customer_token',
  MERCHANT_TOKEN: 'sc_merchant_token',
  ADMIN_TOKEN: 'sc_admin_token',
  REFRESH_TOKEN: 'sc_refresh_token',
  LANGUAGE: 'sc_language',
  USER_PROFILE: 'sc_user_profile',
};

// ----------------------------------------------------------------------------
// Polling Intervals (ms)
// ----------------------------------------------------------------------------
export const FIB_POLL_INTERVAL_MS = 3000;
export const FIB_PAYMENT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// ----------------------------------------------------------------------------
// Supported Languages
// ----------------------------------------------------------------------------
export const SUPPORTED_LANGUAGES = [
  { code: 'ku', label: 'کوردی', dir: 'rtl' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
];
export const DEFAULT_LANGUAGE = 'ku';

// ----------------------------------------------------------------------------
// Prize Tiers (display metadata; authoritative stock/weights live server-side)
// ----------------------------------------------------------------------------
export const PRIZE_TIER_COLORS = {
  cash: '#ffc800',
  gadget: '#00e5c9',
  grand: '#ef4444',
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  ADMIN: 'admin',
};
