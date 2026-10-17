/**
 * ============================================================================
 * File: src/hooks/useFibPayment.js
 * Description: Thin convenience hook exposing PaymentContext, plus a helper
 *              for same-device "Open FIB App" deep-link handoff (attempts the
 *              native app scheme and silently no-ops on desktop browsers
 *              where the scheme isn't registered — the QR code remains the
 *              fallback path for desktop users).
 * Usage / Imported By: components/customer/FibPaymentModal.jsx,
 *                       pages/PaymentCallback.jsx
 * ============================================================================
 */

import { useContext, useCallback } from 'react';
import PaymentContext from '../context/PaymentContext';

export default function useFibPayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) {
    throw new Error('useFibPayment must be used within a <PaymentProvider>.');
  }

  /**
   * Attempts to open the FIB mobile app via its deep link scheme. Safe to
   * call on desktop — if the browser has no handler registered for the
   * custom scheme, nothing visible happens and the user simply continues
   * with the on-screen QR code instead.
   */
  const openFibApp = useCallback(() => {
    if (!ctx.invoice?.deepLink) return;
    window.location.href = ctx.invoice.deepLink;
  }, [ctx.invoice]);

  return { ...ctx, openFibApp };
}
