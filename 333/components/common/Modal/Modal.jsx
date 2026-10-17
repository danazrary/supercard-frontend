/**
 * ============================================================================
 * File: src/components/common/Modal/Modal.jsx
 * Description: Reusable modal shell handling the glassmorphic backdrop,
 *              entrance animation, Escape-key dismissal, click-outside-to-
 *              close, body scroll-lock while open, and an optional footer
 *              slot for action buttons. Composes header/body/footer so
 *              feature modals (AuthBuyModal, FibPaymentModal,
 *              OfferDetailModal, GiftBoxModal) only need to supply content.
 * Usage / Imported By: components/customer/AuthBuyModal.jsx,
 *                       components/customer/FibPaymentModal.jsx,
 *                       components/customer/OfferDetailModal.jsx,
 *                       components/customer/GiftBoxModal.jsx
 * ============================================================================
 */

import React, { useEffect, useCallback } from 'react';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} [props.title] - Header title; header is omitted if absent
 * @param {React.ReactNode} [props.footer] - Optional footer content (buttons)
 * @param {boolean} [props.bare=false] - Strips chrome (background/border) for
 *        fully custom content like GiftBoxModal
 * @param {boolean} [props.sheet=false] - Bottom-sheet behavior on mobile
 * @param {boolean} [props.closeOnBackdrop=true]
 * @param {React.ReactNode} props.children
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  footer,
  bare = false,
  sheet = false,
  closeOnBackdrop = true,
  children,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const backdropClass = ['modal-backdrop', sheet ? 'modal-backdrop--sheet' : ''].filter(Boolean).join(' ');
  const modalClass = ['modal', bare ? 'modal--bare' : '', sheet ? 'modal--sheet' : ''].filter(Boolean).join(' ');

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  }

  return (
    <div className={backdropClass} onMouseDown={handleBackdropClick}>
      <div className={modalClass} role="dialog" aria-modal="true" aria-label={title || 'modal'}>
        {!bare && title && (
          <div className="modal__header">
            <h2 className="modal__title">{title}</h2>
            <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        )}
        {bare && (
          <button type="button" className="modal__close" style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }} onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
        <div className={bare ? '' : 'modal__body'}>{children}</div>
        {footer && !bare && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
