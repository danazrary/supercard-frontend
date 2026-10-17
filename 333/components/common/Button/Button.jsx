/**
 * ============================================================================
 * File: src/components/common/Button/Button.jsx
 * Description: Reusable button component supporting the design system's
 *              variant palette (primary gold, secondary cyan outline, ghost,
 *              danger, success, and brand variants for WhatsApp/FIB), size
 *              scale, a loading spinner state, and an optional leading icon.
 *              Renders a native <button> by default or an anchor-like <a>
 *              when `href` is provided (e.g. WhatsApp deep links).
 * Usage / Imported By: Nearly every page/ and components/customer|merchant|
 *                       admin module requiring an actionable button.
 * ============================================================================
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'|'success'|'whatsapp'|'fib'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth=false]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} [props.icon] - Optional leading icon element
 * @param {string} [props.href] - If provided, renders as an anchor tag
 * @param {string} [props.type='button']
 * @param {Function} [props.onClick]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  href,
  type = 'button',
  onClick,
  children,
  ...rest
}) {
  const classNames = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    fullWidth ? 'btn--full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn__icon">{icon}</span>
      )}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
        aria-disabled={disabled}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
}
