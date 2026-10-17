/**
 * ============================================================================
 * File: src/components/merchant/RedemptionActions.jsx
 * Description: Confirmation action buttons shown after a successful
 *              eligibility check: "کارتەکەمان بەکارهێنا" (confirm used,
 *              success/green) and "بەکارمان نەهێنا" (not used, ghost/neutral
 *              — staff can dismiss without consuming the perk, e.g. the
 *              customer changed their mind). Only the "confirm used" action
 *              calls confirmRedemption and atomically consumes the perk.
 * Usage / Imported By: pages/MerchantScanner.jsx
 * ============================================================================
 */

import React, { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import Button from '../common/Button/Button';
import { confirmRedemption } from '../../services/merchantService';

/**
 * @param {Object} props
 * @param {string} props.cardCode - The currently scanned card's UUID
 * @param {Function} props.onConfirmed - Called with the redemption result on success
 * @param {Function} props.onDismiss - Called when staff dismisses without redeeming
 */
export default function RedemptionActions({ cardCode, onConfirmed, onDismiss }) {
  const { t } = useLanguage();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirmUsed() {
    setIsConfirming(true);
    setError('');
    try {
      const result = await confirmRedemption(cardCode, true);
      onConfirmed(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="field__error text-center" style={{ marginBottom: 10 }}>
          {error}
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <Button variant="ghost" fullWidth onClick={onDismiss} disabled={isConfirming}>
          {t('merchant.confirmNotUsed')}
        </Button>
        <Button variant="success" fullWidth onClick={handleConfirmUsed} loading={isConfirming}>
          {t('merchant.confirmUsed')}
        </Button>
      </div>
    </div>
  );
}
