/**
 * ============================================================================
 * File: src/context/PaymentContext.jsx
 * Description: Manages the lifecycle of an in-progress FIB payment: holds
 *              the current invoice (QR data, deep link, expiry), drives the
 *              status-polling loop against paymentService, and exposes
 *              derived state (status, secondsRemaining) to FibPaymentModal
 *              and PaymentCallback. Centralizing this in context (rather
 *              than local component state) lets the invoice survive a
 *              modal close/reopen and lets PaymentCallback pick up the
 *              invoiceId after the FIB app redirect.
 * Usage / Imported By: App.jsx (provider wrapper), hooks/useFibPayment.js,
 *                       components/customer/FibPaymentModal.jsx,
 *                       pages/PaymentCallback.jsx
 * ============================================================================
 */

import React, { createContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createFibPayment, checkFibPaymentStatus, verifyFibCallback } from '../services/paymentService';
import { FIB_POLL_INTERVAL_MS, FIB_PAYMENT_TIMEOUT_MS } from '../utils/constants';

export const PaymentContext = createContext(null);

const STATUS = {
  IDLE: 'idle',
  CREATING: 'creating',
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  EXPIRED: 'expired',
};

export function PaymentProvider({ children }) {
  const [invoice, setInvoice] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [error, setError] = useState(null);

  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    pollRef.current = null;
    countdownRef.current = null;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startPolling = useCallback(
    (invoiceId) => {
      clearTimers();
      pollRef.current = setInterval(async () => {
        try {
          const result = await checkFibPaymentStatus(invoiceId);
          if (result.status === 'paid') {
            setStatus(STATUS.PAID);
            clearTimers();
          } else if (result.status === 'failed') {
            setStatus(STATUS.FAILED);
            clearTimers();
          } else if (result.status === 'expired') {
            setStatus(STATUS.EXPIRED);
            clearTimers();
          }
        } catch (err) {
          // Swallow transient poll errors; the countdown timer will
          // eventually force an expired state if polling never recovers.
        }
      }, FIB_POLL_INTERVAL_MS);
    },
    [clearTimers]
  );

  const startCountdown = useCallback(
    (expiresAt) => {
      const expiryTime = new Date(expiresAt).getTime();
      countdownRef.current = setInterval(() => {
        const remainingMs = expiryTime - Date.now();
        if (remainingMs <= 0) {
          setSecondsRemaining(0);
          setStatus((prev) => (prev === STATUS.PENDING ? STATUS.EXPIRED : prev));
          clearTimers();
        } else {
          setSecondsRemaining(Math.floor(remainingMs / 1000));
        }
      }, 1000);
    },
    [clearTimers]
  );

  /**
   * Initiates a brand-new FIB payment invoice and begins polling +
   * countdown immediately.
   */
  const initiatePayment = useCallback(
    async (metadata) => {
      setError(null);
      setStatus(STATUS.CREATING);
      try {
        const data = await createFibPayment(metadata);
        const expiresAt = data.expiresAt || new Date(Date.now() + FIB_PAYMENT_TIMEOUT_MS).toISOString();
        setInvoice({ ...data, expiresAt });
        setStatus(STATUS.PENDING);
        startPolling(data.invoiceId);
        startCountdown(expiresAt);
        return data;
      } catch (err) {
        setError(err.message);
        setStatus(STATUS.FAILED);
        throw err;
      }
    },
    [startPolling, startCountdown]
  );

  /**
   * Re-verifies the final outcome with the backend after a redirect-based
   * callback (used by PaymentCallback page). Does not rely on polling.
   */
  const confirmCallback = useCallback(async (invoiceId) => {
    setError(null);
    try {
      const result = await verifyFibCallback(invoiceId);
      setStatus(result.status === 'paid' ? STATUS.PAID : result.status === 'expired' ? STATUS.EXPIRED : STATUS.FAILED);
      return result;
    } catch (err) {
      setError(err.message);
      setStatus(STATUS.FAILED);
      throw err;
    }
  }, []);

  const resetPayment = useCallback(() => {
    clearTimers();
    setInvoice(null);
    setStatus(STATUS.IDLE);
    setSecondsRemaining(0);
    setError(null);
  }, [clearTimers]);

  const value = useMemo(
    () => ({
      invoice,
      status,
      secondsRemaining,
      error,
      isPending: status === STATUS.PENDING,
      isPaid: status === STATUS.PAID,
      initiatePayment,
      confirmCallback,
      resetPayment,
      STATUS,
    }),
    [invoice, status, secondsRemaining, error, initiatePayment, confirmCallback, resetPayment]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export default PaymentContext;
