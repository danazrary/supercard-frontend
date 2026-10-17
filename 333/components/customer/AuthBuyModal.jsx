/**
 * ============================================================================
 * File: src/components/customer/AuthBuyModal.jsx
 * Description: Entry-point modal for the card purchase funnel. Two-step
 *              flow: (1) collect & validate the customer's Kurdish/Iraqi
 *              phone number and request an OTP, (2) collect & verify the
 *              OTP code, establishing the customer session via AuthContext.
 *              On successful verification, closes itself and signals the
 *              parent (HomePage) to open FibPaymentModal to continue the
 *              purchase with payment.
 * Usage / Imported By: pages/HomePage.jsx, components/layout/BottomNav.jsx
 *                       (via the parent's onBuyCardClick handler)
 * ============================================================================
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import useLanguage from '../../hooks/useLanguage';
import useAuth from '../../hooks/useAuth';
import { requestOtp } from '../../services/authService';
import { isValidIraqiPhone, isValidOTP } from '../../utils/validations';
import { formatCountdown } from '../../utils/formatters';

const STEPS = { PHONE: 'phone', OTP: 'otp' };
const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onVerified - Called with the authenticated user
 *        once OTP verification succeeds, so the parent can proceed to payment.
 */
export default function AuthBuyModal({ isOpen, onClose, onVerified }) {
  const { t } = useLanguage();
  const { loginCustomer } = useAuth();

  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state whenever the modal is closed, so reopening starts fresh.
      setStep(STEPS.PHONE);
      setPhone('');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = useCallback(
    async (e) => {
      e.preventDefault();
      setErrorMsg('');

      if (!isValidIraqiPhone(phone)) {
        setErrorMsg(t('auth.invalidPhone'));
        return;
      }

      setIsSubmitting(true);
      try {
        const data = await requestOtp(phone);
        setRequestId(data.requestId);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        setStep(STEPS.OTP);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phone, t]
  );

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    setErrorMsg('');
    try {
      const data = await requestOtp(phone);
      setRequestId(data.requestId);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }, [phone, resendCooldown]);

  function handleOtpChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  const handleVerifyOtp = useCallback(
    async (e) => {
      e.preventDefault();
      setErrorMsg('');
      const otp = otpDigits.join('');

      if (!isValidOTP(otp)) {
        setErrorMsg(t('auth.invalidOtp'));
        return;
      }

      setIsSubmitting(true);
      try {
        const user = await loginCustomer(phone, otp, requestId);
        onVerified && onVerified(user);
      } catch (err) {
        setErrorMsg(err.message || t('auth.invalidOtp'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [otpDigits, phone, requestId, loginCustomer, onVerified, t]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('nav.buyCard')} sheet>
      {step === STEPS.PHONE && (
        <form onSubmit={handleSendOtp}>
          <div className="field">
            <label className="field__label" htmlFor="phone-input">
              {t('auth.phoneLabel')}
            </label>
            <div className="field__prefix-group">
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                className={`field__input${errorMsg ? ' field__input--error' : ''}`}
                placeholder={t('auth.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                autoFocus
              />
            </div>
            {errorMsg && <span className="field__error">{errorMsg}</span>}
          </div>
          <Button type="submit" fullWidth loading={isSubmitting} disabled={!phone}>
            {t('auth.sendOtp')}
          </Button>
        </form>
      )}

      {step === STEPS.OTP && (
        <form onSubmit={handleVerifyOtp}>
          <p className="text-body text-center" style={{ marginBottom: 16 }}>
            {t('auth.otpSentTo')} <span className="ltr-inline text-bold">{phone}</span>
          </p>

          <div className="otp-input" style={{ marginBottom: 16 }}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-input__digit"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
              />
            ))}
          </div>

          {errorMsg && (
            <p className="field__error text-center" style={{ marginBottom: 12 }}>
              {errorMsg}
            </p>
          )}

          <Button type="submit" fullWidth loading={isSubmitting} disabled={otpDigits.some((d) => !d)}>
            {t('auth.verifyOtp')}
          </Button>

          <button
            type="button"
            className="btn btn--ghost btn--full btn--sm"
            style={{ marginTop: 12 }}
            onClick={handleResend}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0
              ? `${t('auth.resendIn')} ${formatCountdown(resendCooldown)}`
              : t('auth.resendOtp')}
          </button>
        </form>
      )}
    </Modal>
  );
}
