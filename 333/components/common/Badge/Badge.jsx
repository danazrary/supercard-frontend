/**
 * ============================================================================
 * File: src/components/common/Badge/Badge.jsx
 * Description: Small pill-shaped label component used for offer category
 *              tags, FREE/discount badges, and status indicators (active,
 *              redeemed, pending, low-stock) across customer, merchant, and
 *              admin surfaces.
 * Usage / Imported By: components/customer/OfferDetailModal.jsx,
 *                       components/merchant/OfferStatusAlert.jsx,
 *                       components/admin/CenterManagerTable.jsx,
 *                       components/admin/PrizeEnginePanel.jsx
 * ============================================================================
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {'free'|'discount'|'category'|'success'|'error'|'warning'|'info'} [props.variant='category']
 * @param {boolean} [props.dot=false] - Show a small status dot before the label
 * @param {boolean} [props.large=false]
 * @param {React.ReactNode} props.children
 */
export default function Badge({ variant = 'category', dot = false, large = false, children, ...rest }) {
  const classNames = ['badge', `badge--${variant}`, large ? 'badge--lg' : ''].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...rest}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
