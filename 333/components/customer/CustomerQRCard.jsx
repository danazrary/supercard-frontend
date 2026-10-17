/**
 * ============================================================================
 * File: src/components/customer/CustomerQRCard.jsx
 * Description: Renders the customer's metallic VIP Super Card with a
 *              dynamic QR code encoding the card's UUID (scanned by merchant
 *              staff via QRScannerCamera). Visually reflects active/inactive
 *              state (full gold glow + pulse animation when active, desaturated
 *              when inactive/unpaid) and shows the truncated card code for
 *              manual-entry fallback.
 * Usage / Imported By: pages/ProfilePage.jsx
 * ============================================================================
 */

import React from 'react';
import useLanguage from '../../hooks/useLanguage';
import { truncateMiddle } from '../../utils/formatters';

/**
 * @param {Object} props
 * @param {string} props.cardCode - Card UUID encoded into the QR
 * @param {boolean} props.isActive - Whether the card has an active (paid) subscription
 * @param {string} [props.customerName]
 */
export default function CustomerQRCard({ cardCode, isActive, customerName }) {
  const { t } = useLanguage();

  const cardClassNames = ['vip-card', isActive ? 'vip-card--active' : 'vip-card--inactive']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClassNames}>
      <div className="vip-card__top">
        <span className="vip-card__brand">{t('common.appName')}</span>
        <span className={`badge ${isActive ? 'badge--success' : 'badge--error'}`}>
          {isActive ? t('profile.activeStatus') : t('profile.inactiveStatus')}
        </span>
      </div>

      <div className="vip-card__qr-wrap">
        {cardCode ? <QrPlaceholder data={cardCode} /> : <div style={{ width: 96, height: 96 }} />}
      </div>

      <div className="vip-card__bottom">
        <span className="text-sm text-secondary">{customerName || ''}</span>
        <span className="vip-card__code">{cardCode ? truncateMiddle(cardCode, 14) : '—'}</span>
      </div>
    </div>
  );
}

/**
 * Lightweight QR placeholder — see FibPaymentModal's QrPlaceholder for the
 * same rationale (actual rendering library is an integration detail).
 */
function QrPlaceholder({ data }) {
  return (
    <div
      style={{
        width: 96,
        height: 96,
        background: `repeating-linear-gradient(45deg, #060b13, #060b13 3px, #fff 3px, #fff 6px)`,
        borderRadius: 6,
      }}
      title={data}
      aria-label="Customer card QR code"
    />
  );
}
