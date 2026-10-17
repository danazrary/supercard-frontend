/**
 * ============================================================================
 * File: src/components/merchant/OfferStatusAlert.jsx
 * Description: Displays the server-authoritative result of a perk
 *              eligibility check as a prominent colored banner: green with
 *              a checkmark when the perk is available for redemption, red
 *              with an alert icon when already redeemed, amber for an
 *              invalid/inactive card. This banner is the primary visual
 *              decision point for clinic staff — it must never be based on
 *              client-side assumptions, only on verifyPerkEligibility's
 *              response.
 * Usage / Imported By: pages/MerchantScanner.jsx
 * ============================================================================
 */

import React from 'react';
import useLanguage from '../../hooks/useLanguage';
import { CheckIcon, CloseAlertIcon, AlertIcon } from '../../assets/icons';

/**
 * @param {Object} props
 * @param {'available'|'redeemed'|'invalid'} props.status
 * @param {Object} [props.perk] - { centerName, discountPercent, isFree }
 * @param {string} [props.alreadyRedeemedAt] - ISO8601 timestamp, shown for "redeemed"
 */
export default function OfferStatusAlert({ status, perk, alreadyRedeemedAt }) {
  const { t } = useLanguage();

  const config = {
    available: { icon: CheckIcon, color: '#10b981', title: t('merchant.cardValid') },
    redeemed: { icon: CloseAlertIcon, color: '#ef4444', title: t('merchant.cardUsed') },
    invalid: { icon: AlertIcon, color: '#f59e0b', title: t('merchant.cardInvalid') },
  };

  const { icon: Icon, color, title } = config[status] || config.invalid;

  return (
    <div className={`status-alert status-alert--${status}`}>
      <Icon size={32} color={color} className="status-alert__icon" />
      <div className="status-alert__text">
        <span className="status-alert__title">{title}</span>
        {status === 'available' && perk && (
          <span className="status-alert__subtitle">
            {perk.centerName} — {perk.isFree ? t('offer.freeService') : `${perk.discountPercent}%`}
          </span>
        )}
        {status === 'redeemed' && alreadyRedeemedAt && (
          <span className="status-alert__subtitle ltr-inline">{new Date(alreadyRedeemedAt).toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}
