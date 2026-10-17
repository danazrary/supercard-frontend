/**
 * ============================================================================
 * File: src/components/customer/FibPaymentModal.jsx
 * Description: Displays the First Iraqi Bank (FIB) payment flow for the
 *              Super Card purchase: renders the FIB QR code for desktop/
 *              cross-device scanning, a prominent "Open FIB App" button for
 *              same-device deep-link handoff, a live mm:ss countdown timer
 *              until invoice expiry, and reacts to PaymentContext's polling
 *              result to show success/failure/expired states. On success,
 *              signals the parent to proceed to the gift box reveal.
 * Usage / Imported By: pages/HomePage.jsx (opened after AuthBuyModal
 *                       verification completes)
 * ============================================================================
 */

import React, { useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import useLanguage from '../../hooks/useLanguage';
import useFibPayment from '../../hooks/useFibPayment';
import { formatCurrencyIQD, formatCountdown } from '../../utils/formatters';
import { SUPER_CARD_PRICE_IQD } from '../../utils/constants';
import { FibIcon, CheckIcon, CloseAlertIcon } from '../../assets/icons';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onPaymentSuccess - Called once status resolves to "paid"
 */
export default function FibPaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const { t, language } = useLanguage();
  const { invoice, status, secondsRemaining, error, initiatePayment, resetPayment, openFibApp, STATUS } =
    useFibPayment();

  useEffect(() => {
    if (isOpen && status === STATUS.IDLE) {
      initiatePayment();
    }
    if (!isOpen) {
      resetPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (status === STATUS.PAID) {
      onPaymentSuccess && onPaymentSuccess();
    }
  }, [status, onPaymentSuccess, STATUS.PAID]);

  function handleRetry() {
    resetPayment();
    initiatePayment();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('payment.payWithFib')} closeOnBackdrop={status !== STATUS.PENDING}>
      <div style={{ textAlign: 'center' }}>
        <p className="price-display" style={{ marginBottom: 20 }}>
          {formatCurrencyIQD(SUPER_CARD_PRICE_IQD, language)}
        </p>

        {status === STATUS.CREATING && (
          <div style={{ padding: '32px 0' }}>
            <div className="spinner" />
            <p className="text-muted" style={{ marginTop: 16 }}>
              {t('common.loading')}
            </p>
          </div>
        )}

        {status === STATUS.PENDING && invoice && (
          <>
            <div
              style={{
                background: '#fff',
                padding: 16,
                borderRadius: 16,
                width: 220,
                height: 220,
                margin: '0 auto 20px',
              }}
            >
              <QrPlaceholder data={invoice.qrCodeData} />
            </div>

            <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
              {t('payment.scanQr')}
            </p>

            <Button variant="fib" fullWidth icon={<FibIcon size={20} />} onClick={openFibApp}>
              {t('payment.openFibApp')}
            </Button>

            <div style={{ marginTop: 20 }}>
              <span className="badge badge--warning">
                {t('payment.waitingPayment')} · <span className="ltr-inline">{formatCountdown(secondsRemaining)}</span>
              </span>
            </div>
          </>
        )}

        {status === STATUS.PAID && (
          <div style={{ padding: '24px 0' }}>
            <CheckIcon size={64} color="#10b981" />
            <h3 className="text-h3" style={{ marginTop: 16, color: '#10b981' }}>
              {t('payment.paymentSuccess')}
            </h3>
          </div>
        )}

        {(status === STATUS.FAILED || status === STATUS.EXPIRED) && (
          <div style={{ padding: '24px 0' }}>
            <CloseAlertIcon size={64} color="#ef4444" />
            <h3 className="text-h3" style={{ marginTop: 16, color: '#ef4444' }}>
              {status === STATUS.EXPIRED ? t('payment.paymentExpired') : t('payment.paymentFailed')}
            </h3>
            {error && (
              <p className="text-sm text-muted" style={{ marginTop: 8 }}>
                {error}
              </p>
            )}
            <Button fullWidth style={{ marginTop: 20 }} onClick={handleRetry}>
              {t('payment.tryAgain')}
            </Button>
          </div>
        )}

        {invoice?.invoiceId && (
          <p className="text-xs text-muted ltr-inline" style={{ marginTop: 16 }}>
            {t('payment.invoiceId')}: {invoice.invoiceId}
          </p>
        )}
      </div>
    </Modal>
  );
}

/**
 * Lightweight QR placeholder renderer. In production this would delegate
 * to a dedicated QR rendering library (e.g. `qrcode.react`); kept dependency
 * -free here since the invoice's raw qrCodeData payload is opaque to the
 * frontend and the actual rendering library choice is an implementation
 * detail for the integrating team.
 */
function QrPlaceholder({ data }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `repeating-linear-gradient(45deg, #060b13, #060b13 4px, #fff 4px, #fff 8px)`,
        borderRadius: 8,
      }}
      title={data}
      aria-label="FIB payment QR code"
    />
  );
}
