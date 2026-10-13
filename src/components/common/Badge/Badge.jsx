/**
 * ============================================================================
 * File: src/components/common/Badge/Badge.jsx
 * Description: Category pill badge with customizable status color variants.
 * Usage / Imported By: Offer detail modal, CustomerQRCard, MerchantScanner.
 * ============================================================================
 */

import React from "react";

export default function Badge({ children, variant = "gold", icon = null }) {
  return (
    <span className={`super-badge super-badge--${variant}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
