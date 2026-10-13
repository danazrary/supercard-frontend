/**
 * ============================================================================
 * File: src/components/common/Button/Button.jsx
 * Description: Reusable theme button with Gold, Cyan, and Danger variants.
 * Usage / Imported By: All views, auth modal, scanner, forms.
 * ============================================================================
 */

import React from "react";

export default function Button({
  children,
  variant = "gold", // 'gold' | 'cyan' | 'danger'
  fullWidth = false,
  onClick,
  disabled = false,
  type = "button",
  icon = null,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`super-btn super-btn--${variant} ${fullWidth ? "super-btn--full-width" : ""} ${className}`}
    >
      {icon && <span className="super-btn__icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
