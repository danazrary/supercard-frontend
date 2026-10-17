/**
 * ============================================================================
 * File: src/utils/formatters.js
 * Description: Pure formatting helper functions for currency (IQD), Iraqi
 *              phone numbers, and dates (supports both Gregorian and Hijri
 *              display for the Kurdish/Arabic locales). All functions are
 *              side-effect free and locale-aware where relevant.
 * Usage / Imported By: components/customer/*, components/merchant/*,
 *                       components/admin/*, pages/*
 * ============================================================================
 */

import { SUPER_CARD_CURRENCY_LABEL_KU } from './constants';

/**
 * Formats a numeric amount as Iraqi Dinar currency string.
 * @param {number} amount - Raw numeric amount (e.g. 25000)
 * @param {string} [locale='ku'] - Target locale code ('ku' | 'ar' | 'en')
 * @returns {string} Formatted currency string, e.g. "25,000 دینار"
 */
export function formatCurrencyIQD(amount, locale = 'ku') {
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  const numberFormatted = new Intl.NumberFormat('en-US').format(Math.round(amount));

  switch (locale) {
    case 'en':
      return `${numberFormatted} IQD`;
    case 'ar':
      return `${numberFormatted} د.ع`;
    case 'ku':
    default:
      return `${numberFormatted} ${SUPER_CARD_CURRENCY_LABEL_KU}`;
  }
}

/**
 * Formats a raw Iraqi mobile number into a readable grouped format.
 * Accepts formats like "07501234567" or "+9647501234567".
 * @param {string} rawPhone - Raw phone digits
 * @returns {string} Formatted phone, e.g. "0750 123 4567"
 */
export function formatIraqiPhone(rawPhone) {
  if (!rawPhone) return '';
  let digits = String(rawPhone).replace(/\D/g, '');

  // Normalize +964 / 964 prefix back to local 0-leading format for display
  if (digits.startsWith('964')) {
    digits = '0' + digits.slice(3);
  }
  if (!digits.startsWith('0')) {
    digits = '0' + digits;
  }

  if (digits.length !== 11) return rawPhone; // fallback: return as-is if unexpected length

  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
}

/**
 * Converts a local Iraqi phone number (07XXXXXXXXX) to full international
 * E.164 format for backend submission.
 * @param {string} rawPhone - Local format phone number
 * @returns {string} E.164 formatted phone, e.g. "+9647501234567"
 */
export function toE164IraqiPhone(rawPhone) {
  if (!rawPhone) return '';
  let digits = String(rawPhone).replace(/\D/g, '');
  if (digits.startsWith('964')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return `+964${digits}`;
}

/**
 * Formats a date into a locale-aware Gregorian display string.
 * @param {string|Date} date - ISO date string or Date object
 * @param {string} [locale='ku'] - Target locale code
 * @param {boolean} [includeTime=false] - Whether to include time
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'ku', includeTime = false) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const localeMap = { ku: 'en-GB', ar: 'ar-IQ', en: 'en-US' };
  const options = includeTime
    ? { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };

  return new Intl.DateTimeFormat(localeMap[locale] || 'en-GB', options).format(d);
}

/**
 * Formats a date using the Islamic (Hijri) calendar — used for Arabic locale
 * contexts where Hijri dates are culturally preferred alongside Gregorian.
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted Hijri date string
 */
export function formatHijriDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch (e) {
    return formatDate(d, 'ar');
  }
}

/**
 * Formats remaining countdown time (seconds) as mm:ss, used for FIB
 * payment timers and OTP resend countdowns.
 * @param {number} totalSeconds - Seconds remaining
 * @returns {string} Formatted mm:ss string
 */
export function formatCountdown(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Truncates a long string (e.g. UUID codes) with ellipsis for compact UI display.
 * @param {string} str - Source string
 * @param {number} [maxLength=12] - Maximum visible length before truncation
 * @returns {string} Truncated string
 */
export function truncateMiddle(str, maxLength = 12) {
  if (!str || str.length <= maxLength) return str;
  const half = Math.floor(maxLength / 2);
  return `${str.slice(0, half)}…${str.slice(-half)}`;
}
