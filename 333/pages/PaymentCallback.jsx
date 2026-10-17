/**
 * ============================================================================
 * File: src/pages/PaymentCallback.jsx
 * Description: Landing page the browser is redirected to after completing
 *              (or abandoning) the FIB payment flow in the FIB app/web UI.
 *              Reads the `invoiceId` query param, calls PaymentContext's
 *              confirmCallback for server-side-authoritative verification
 *              (never trusts redirect query params for the actual outcome),
 *              and renders the appropriate success/failure UI with a path
 *              back into the app (to the gift box reveal on success, or
 *              home with a retry option on failure).
 * Usage / Imported By: App.jsx route "/payment/callback" (public — this is
 *                       the external redirect target for FIB)
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import useFibPayment from '../hooks/useFibPayment';
import Button from '../components/common/Button/Button';
import { CheckIcon, CloseAlertIcon } from '../assets/icons';

export default function PaymentCallback() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmCallback } = useFibPayment();

  const [result, setResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifyError, setVerifyError] = useState(null);

  useEffect(() => {
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      setVerifyError(t('errors.genericError'));
      setIsVerifying(false);
      return;
    }

    confirmCallback(invoiceId)
      .then((data) => setResult(data))
      .catch((err) => setVerifyError(err.message))
      .finally(() => setIsVerifying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <div className="content-card" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        {isVerifying && (
          <div style={{ padding: '24px 0' }}>
            <div className="spinner" />
            <p className="text-muted" style={{ marginTop: 16 }}>
              {t('common.loading')}
            </p>
          </div>
        )}

        {!isVerifying && (verifyError || result?.status !== 'paid') && (
          <div style={{ padding: '12px 0' }}>
            <CloseAlertIcon size={56} color="#ef4444" />
            <h2 className="text-h3" style={{ marginTop: 16, color: '#ef4444' }}>
              {t('payment.paymentFailed')}
            </h2>
            {verifyError && (
              <p className="text-sm text-muted" style={{ marginTop: 8 }}>
                {verifyError}
              </p>
            )}
            <Button fullWidth style={{ marginTop: 20 }} onClick={() => navigate('/')}>
              {t('payment.backToHome')}
            </Button>
          </div>
        )}

        {!isVerifying && result?.status === 'paid' && (
          <div style={{ padding: '12px 0' }}>
            <CheckIcon size={56} color="#10b981" />
            <h2 className="text-h3" style={{ marginTop: 16, color: '#10b981' }}>
              {t('payment.paymentSuccess')}
            </h2>
            <Button fullWidth style={{ marginTop: 20 }} onClick={() => navigate('/profile')}>
              {t('profile.title')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
