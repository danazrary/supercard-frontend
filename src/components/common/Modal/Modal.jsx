/**
 * ============================================================================
 * File: src/components/common/Modal/Modal.jsx
 * Description: Reusable accessible modal dialog with backdrop blur & escape listener.
 * Usage / Imported By: AuthBuyModal, FibPaymentModal, GiftBoxModal.
 * ============================================================================
 */

import React, { useEffect } from "react";
import { CloseIcon } from "../../../assets/icons";

export default function Modal({ isOpen, onClose, children, title = "" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="super-modal-backdrop" onClick={onClose}>
      <div className="super-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="super-modal-content__close"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon size={22} />
        </button>
        {title && (
          <h3 style={{ marginBottom: "16px", color: "#ffc800" }}>{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
}
