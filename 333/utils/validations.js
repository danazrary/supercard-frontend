/**
 * ============================================================================
 * File: src/utils/validations.js
 * Description: Pure validation helper functions for Kurdish/Iraqi phone
 *              numbers, email addresses, OTP codes, and generic required-field
 *              checks. Used both in form-level validation (customer/merchant/
 *              admin forms) and defensively before API submission.
 * Usage / Imported By: components/customer/AuthBuyModal, components/admin/*,
 *                       pages/SettingsPage, pages/MerchantLogin
 * ============================================================================
 */

// Iraqi mobile numbers: 07 followed by 5, 7, or 8 (network prefix), then 8 digits
const IRAQI_PHONE_REGEX = /^07[578][0-9]{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^[0-9]{4,6}$/;

/**
 * Validates an Iraqi mobile phone number in local format (07XXXXXXXXX).
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidIraqiPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\s/g, '');
  return IRAQI_PHONE_REGEX.test(cleaned);
}

/**
 * Validates an email address format.
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  if (!email) return false;
  return EMAIL_REGEX.test(String(email).trim());
}

/**
 * Validates an OTP code (4 to 6 numeric digits).
 * @param {string} otp - OTP code to validate
 * @returns {boolean} True if valid
 */
export function isValidOTP(otp) {
  if (!otp) return false;
  return OTP_REGEX.test(String(otp).trim());
}

/**
 * Validates that a required text field is non-empty after trimming.
 * @param {string} value - Field value
 * @returns {boolean} True if non-empty
 */
export function isRequired(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

/**
 * Validates a password meets minimum security requirements
 * (min 8 chars, at least one letter and one number) — used for
 * merchant/admin login credential setup.
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export function isValidPassword(password) {
  if (!password || password.length < 8) return false;
  return /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Validates a monetary amount is a positive finite number.
 * @param {number} amount - Amount to validate
 * @returns {boolean} True if valid
 */
export function isValidAmount(amount) {
  return typeof amount === 'number' && isFinite(amount) && amount > 0;
}

/**
 * Validates a UUID v4 string — used for card codes / scan payloads.
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} True if valid UUID v4 format
 */
export function isValidUUID(uuid) {
  if (!uuid) return false;
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return UUID_REGEX.test(uuid);
}

/**
 * Runs a map of {field: validatorFn} against a values object and returns
 * a map of {field: errorMessageKey | null}. Used by form components to
 * build their error state in one pass.
 * @param {Object} values - Form values keyed by field name
 * @param {Object} rules - { fieldName: (value) => boolean } validator map
 * @returns {Object} { fieldName: boolean } validity map
 */
export function validateFields(values, rules) {
  const result = {};
  Object.keys(rules).forEach((field) => {
    result[field] = rules[field](values[field]);
  });
  return result;
}
