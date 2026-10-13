/**
 * ============================================================================
 * File: src/utils/validations.js
 * Description: Input validation and normalization logic for Kurdish/Iraqi telecom
 *              providers (Asiacell, Korek, Zain), OTP tokens, and VIP card codes.
 * Usage / Imported By: AuthBuyModal, MerchantScanner, ManualCodeInput, CMS forms.
 * ============================================================================
 */

/**
 * Validates Iraqi mobile telephone prefixes (0750, 0751, 0770, 0780, etc.).
 * @param {string} phone - Input mobile number string.
 * @returns {boolean} True if valid Iraqi mobile format.
 */
export function isValidIraqiPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  const iraqiRegex = /^(?:\+?964|00964|0)?7[5789]\d{8}$/;
  return iraqiRegex.test(cleaned);
}

/**
 * Normalizes any Iraqi mobile number representation to E.164 (+9647XXXXXXXXX).
 * @param {string} phone - Input mobile string.
 * @returns {string} Normalized international phone number.
 */
export function normalizeIraqiPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("964")) {
    return `+${digits}`;
  }
  if (digits.startsWith("00964")) {
    return `+${digits.substring(2)}`;
  }
  if (digits.startsWith("07")) {
    return `+964${digits.substring(1)}`;
  }
  if (digits.startsWith("7") && digits.length === 10) {
    return `+964${digits}`;
  }
  return phone;
}

/**
 * Validates a 6-digit numerical SMS verification OTP code.
 * @param {string} otp - Candidate OTP.
 * @returns {boolean}
 */
export function isValidOtp(otp) {
  return /^\d{6}$/.test(String(otp).trim());
}

/**
 * Validates standard email address format.
 * @param {string} email - Email address.
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

/**
 * Validates Super Card QR payload or manual redemption code.
 * Matches UUIDv4 or custom 'SC-XXXX-XXXX' formats.
 * @param {string} code - Scanned payload string.
 * @returns {boolean}
 */
export function isValidCardPayload(code) {
  if (!code) return false;
  const cleanCode = code.trim();
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const maskedRegex = /^SC-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
  return uuidRegex.test(cleanCode) || maskedRegex.test(cleanCode);
}
