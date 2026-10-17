/**
 * ============================================================================
 * File: src/pages/MerchantScanner.jsx
 * Description: Full merchant scanning dashboard shell. Orchestrates:
 *              QRScannerCamera (live scan) + ManualCodeInput (fallback) ->
 *              on a decoded/submitted card code, calls verifyPerkEligibility
 *              -> renders OfferStatusAlert with the authoritative result ->
 *              if available, shows RedemptionActions to confirm/dismiss.
 *              Resets back to scanning state after each completed
 *              interaction so staff can process the next customer.
 * Usage / Imported By: App.jsx route "/merchant/scanner" (wrapped in
 *                       ProtectedRoute with allowedRole="merchant")
 * ============================================================================
 */

import React, { useState, useCallback } from 'react';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import QRScannerCamera from '../components/merchant/QRScannerCamera';
import ManualCodeInput from '../components/merchant/ManualCodeInput';
import OfferStatusAlert from '../components/merchant/OfferStatusAlert';
import RedemptionActions from '../components/merchant/RedemptionActions';
import Button from '../components/common/Button/Button';
import { verifyPerkEligibility } from '../services/merchantService';
import { LogoutIcon } from '../assets/icons';

const VIEW = { SCANNING: 'scanning', CHECKING: 'checking', RESULT: 'result', CONFIRMED: 'confirmed' };

export default function MerchantScanner() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const [view, setView] = useState(VIEW.SCANNING);
  const [cardCode, setCardCode] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [checkError, setCheckError] = useState(null);

  const handleCodeResolved = useCallback(async (code) => {
    setCardCode(code);
    setView(VIEW.CHECKING);
    setCheckError(null);

    try {
      const result = await verifyPerkEligibility(code);
      setEligibility(result);
      setView(VIEW.RESULT);
    } catch (err) {
      setCheckError(err.message);
      setEligibility({ eligible: false, status: 'invalid' });
      setView(VIEW.RESULT);
    }
  }, []);

  function handleReset() {
    setCardCode(null);
    setEligibility(null);
    setCheckError(null);
    setView(VIEW.SCANNING);
  }

  function handleConfirmed() {
    setView(VIEW.CONFIRMED);
  }

  const resolvedStatus = eligibility
    ? eligibility.eligible
      ? 'available'
      : eligibility.alreadyRedeemedAt
      ? 'redeemed'
      : 'invalid'
    : 'invalid';

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="text-h3">{t('merchant.scannerTitle')}</h1>
          <p className="text-sm text-muted">{user?.centerName}</p>
        </div>
        <button type="button" className="icon-btn" onClick={logout} aria-label={t('nav.logout')}>
          <LogoutIcon size={18} />
        </button>
      </div>

      {view === VIEW.SCANNING && (
        <>
          <p className="text-sm text-muted text-center" style={{ marginBottom: 16 }}>
            {t('merchant.scanInstructions')}
          </p>
          <QRScannerCamera onScanSuccess={handleCodeResolved} active={view === VIEW.SCANNING} />
          <ManualCodeInput onSubmit={handleCodeResolved} />
        </>
      )}

      {view === VIEW.CHECKING && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div className="spinner" />
        </div>
      )}

      {view === VIEW.RESULT && eligibility && (
        <>
          <OfferStatusAlert
            status={resolvedStatus}
            perk={eligibility.perk}
            alreadyRedeemedAt={eligibility.alreadyRedeemedAt}
          />
          {checkError && (
            <p className="field__error text-center" style={{ marginTop: 10 }}>
              {checkError}
            </p>
          )}

          {resolvedStatus === 'available' ? (
            <RedemptionActions cardCode={cardCode} onConfirmed={handleConfirmed} onDismiss={handleReset} />
          ) : (
            <Button fullWidth style={{ marginTop: 16 }} onClick={handleReset}>
              {t('common.back')}
            </Button>
          )}
        </>
      )}

      {view === VIEW.CONFIRMED && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p className="badge badge--success badge--lg" style={{ margin: '0 auto 16px' }}>
            {t('merchant.redemptionSuccess')}
          </p>
          <Button fullWidth onClick={handleReset}>
            {t('common.confirm')}
          </Button>
        </div>
      )}
    </div>
  );
}
