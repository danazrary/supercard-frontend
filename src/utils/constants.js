/**
 * ============================================================================
 * File: src/utils/constants.js
 * Description: Central business constants, application configurations, social
 *              links, and endpoints for Super Card platform in Erbil, Kurdistan.
 * Usage / Imported By: All services, payment hooks, auth context, UI components.
 * ============================================================================
 */

export const APP_CONFIG = {
  NAME: "Super Card",
  NAME_KU: "سوپەر کارت",
  NAME_AR: "سوبر كارد",
  VERSION: "2.4.0",
  CARD_PRICE_IQD: 25000,
  CITY: "Erbil",
  REGION: "Kurdistan Region of Iraq",
  CURRENCY: "IQD",
  DEFAULT_LOCALE: "ku",
  SUPPORTED_LOCALES: ["ku", "ar", "en"],
};

export const CONTACT_INFO = {
  PHONE: "+9647503776072",
  PHONE_DISPLAY: "0750 377 6072",
  WHATSAPP_LINK: "https://wa.me/9647503776072",
  INSTAGRAM_HANDLE: "@supercard.erbil",
  INSTAGRAM_URL: "https://instagram.com/supercard.erbil",
  SNAPCHAT_URL: "https://snapchat.com/add/supercard.erbil",
  SUPPORT_EMAIL: "support@supercard.krd",
  OFFICE_LOCATION: "Empire World, Erbil, Kurdistan Region, Iraq",
};

export const API_ROUTES = {
  BASE_URL:
    import.meta.env.REACT_APP_API_URL || "https://api.supercard.krd/api/v1",
  AUTH: {
    REQUEST_OTP: "/auth/customer/otp-request",
    VERIFY_OTP: "/auth/customer/otp-verify",
    MERCHANT_LOGIN: "/auth/merchant/login",
    ADMIN_LOGIN: "/auth/admin/login",
    REFRESH: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  PAYMENTS: {
    CREATE_FIB: "/payments/fib/create",
    CHECK_STATUS: "/payments/fib/status",
    VERIFY_CALLBACK: "/payments/fib/verify-callback",
  },
  OFFERS: {
    BASE: "/offers",
    DETAIL: (id) => `/offers/${id}`,
    TOGGLE: (id) => `/offers/${id}/toggle`,
  },
  PRIZES: {
    POOL: "/prizes/pool",
    CLAIM_BOX: "/prizes/cbox/claim",
    HISTORY: "/prizes/history",
    ADMIN_CONFIG: "/admin/prizes/config",
  },
  MERCHANT: {
    VERIFY_CARD: "/merchant/verify-card",
    REDEEM: "/merchant/redeem-perk",
    HISTORY: "/merchant/redemption-history",
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "supercard_jwt_token",
  REFRESH_TOKEN: "supercard_refresh_token",
  USER_ROLE: "supercard_role",
  USER_PROFILE: "supercard_user_profile",
  APP_LOCALE: "supercard_locale",
  ACTIVE_CARD_ID: "supercard_active_card_id",
};

export const FIB_PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  DECLINED: "DECLINED",
  EXPIRED: "EXPIRED",
  REFUNDED: "REFUNDED",
};

export const PRIZE_TIERS = {
  TIER_1: "CASH_5000",
  TIER_2: "CASH_10000",
  TIER_3: "SMART_WATCH",
  TIER_4: "LUXURY_HEADPHONES",
  TIER_5: "IPHONE_18_PRO_MAX",
};
