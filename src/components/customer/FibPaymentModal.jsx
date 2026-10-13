/**
 * ============================================================================
 * File: src/components/customer/FibPaymentModal.jsx
 * Description: First Iraqi Bank (FIB) QR code showcase, dynamic deep link trigger,
 *              and automatic status polling dialog.
 * Usage / Imported By: HomePage, ProfilePage.
 * ============================================================================
 */

import React, { useState } from "react";
import Modal from "../common/Modal/Modal";
import Button from "..//common/Button/Button";
import useFibPayment from "../../hooks/useFibPayment";
import useLanguage from "../../hooks/useLanguage";

export default function FibPaymentModal() {
  const { t } = useLanguage();
  const {
    invoice,
    paymentStatus,
    isModalOpen,
    closeModal,
    triggerMobileDeepLink,
  } = useFibPayment();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (invoice?.qrCode) {
      navigator.clipboard.writeText(invoice.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={t("fib.modal_title")}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
          {t("fib.scan_instructions")}
        </p>

        {invoice?.qrCode && (
          <div
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "16px",
              display: "inline-block",
              margin: "0 auto",
            }}
          >
            {/* Displaying QR payload via standard encoded QR generator */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invoice.qrCode)}`}
              alt="FIB Payment QR"
              style={{ width: "180px", height: "180px" }}
            />
          </div>
        )}

        <div
          style={{ color: "#ffc800", fontWeight: "bold", fontSize: "1.25rem" }}
        >
          {t("fib.price_iqd")}
        </div>

        <Button variant="gold" fullWidth onClick={triggerMobileDeepLink}>
          ⚡ {t("fib.open_app_btn")}
        </Button>

        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            color: "#00e5c9",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          {copied ? t("fib.link_copied") : t("fib.copy_link")}
        </button>

        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          {paymentStatus === "PAID" ? (
            <span style={{ color: "#10b981" }}>✓ {t("fib.status_paid")}</span>
          ) : (
            <span>⏳ {t("fib.waiting_payment")}</span>
          )}
        </div>
      </div>
    </Modal>
  );
}
