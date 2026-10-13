/**
 * ============================================================================
 * File: src/utils/formatters.js
 * Description: Internationalized currency, telephone, mask, and date formatters
 *              supporting Sorani Kurdish, Arabic, and English conventions.
 * Usage / Imported By: ProfilePage, FibPaymentModal, GiftBoxModal, MerchantScanner.
 * ============================================================================
 */

/**
 * Formats numeric values to Iraqi Dinar (IQD) currency representation.
 * @param {number|string} amount - Monetary amount in IQD.
 * @param {string} locale - 'ku', 'ar', or 'en'.
 * @returns {string} Formatted string with currency suffix.
 */
export function formatCurrencyIQD(amount, locale = "ku") {
  const numericAmount = Number(amount) || 0;
  const formattedNumber = new Intl.NumberFormat(
    locale === "ku" ? "ckb-IQ" : locale === "ar" ? "ar-IQ" : "en-US",
    {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
  ).format(numericAmount);

  switch (locale) {
    case "ku":
      return `${formattedNumber} دینار`;
    case "ar":
      return `${formattedNumber} د.ع`;
    case "en":
    default:
      return `${formattedNumber} IQD`;
  }
}

/**
 * Formats raw Iraqi phone number into a clean standardized readable string.
 * @param {string} phone - Input phone number string.
 * @returns {string} Formatted phone: 0750 XXX XXXX
 */
export function formatIraqiPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  let localDigits = digits;

  if (digits.startsWith("964")) {
    localDigits = digits.substring(3);
  } else if (digits.startsWith("00964")) {
    localDigits = digits.substring(5);
  }

  if (!localDigits.startsWith("0")) {
    localDigits = `0${localDigits}`;
  }

  if (localDigits.length === 11) {
    return `${localDigits.slice(0, 4)} ${localDigits.slice(4, 7)} ${localDigits.slice(7)}`;
  }
  return phone;
}

/**
 * Formats a card UUID into a partitioned luxury VIP card identifier (e.g., SC-8821-4902).
 * @param {string} cardId - Raw card UUID or string.
 * @returns {string} Masked readable identifier.
 */
export function formatCardNumberMask(cardId) {
  if (!cardId) return "SC-0000-0000";
  const sanitized = cardId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const segmentA = sanitized.slice(0, 4) || "8821";
  const segmentB = sanitized.slice(4, 8) || "4902";
  return `SC-${segmentA}-${segmentB}`;
}

/**
 * Formats an ISO date string to a localized timestamp.
 * @param {string|Date} date - ISO Date string or Date object.
 * @param {string} locale - Target locale.
 * @returns {string} Formatted localized date.
 */
export function formatLocalizedDate(date, locale = "ku") {
  if (!date) return "";
  const parsed = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const targetLang =
    locale === "ku" ? "ckb-IQ" : locale === "ar" ? "ar-IQ" : "en-US";
  return new Intl.DateTimeFormat(targetLang, options).format(parsed);
}
