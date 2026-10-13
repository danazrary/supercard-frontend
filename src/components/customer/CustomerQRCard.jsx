/**
 * ============================================================================
 * File: src/components/customer/CustomerQRCard.jsx
 * Description: Metallic VIP Card view with dynamic QR Code for merchant scanning.
 * Usage / Imported By: ProfilePage.
 * ============================================================================
 */

import React from "react";
import Badge from "../common/Badge/Badge";
import { formatCardNumberMask } from "../../utils/formatters";
import useLanguage from "../../hooks/useLanguage";

export default function CustomerQRCard({
  cardId = "SC-8821-4902",
  customerName = "Ahmad Farhad",
}) {
  const { t } = useLanguage();

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0b1522 0%, #1a2f4c 50%, #060b13 100%)",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid rgba(255, 200, 0, 0.4)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#ffc800", fontSize: "1.2rem" }}>
            {t("app.title")}
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            VIP MEMBERSHIP
          </span>
        </div>
        <Badge variant="gold">{t("app.vip_status")}</Badge>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}
      >
        <div
          style={{ background: "#fff", padding: "12px", borderRadius: "16px" }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(cardId)}`}
            alt="Customer VIP QR"
            style={{ width: "140px", height: "140px" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "16px",
        }}
      >
        <div>
          <span
            style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}
          >
            MEMBER
          </span>
          <strong style={{ fontSize: "1rem", color: "#fff" }}>
            {customerName}
          </strong>
        </div>
        <div style={{ textAlign: "right", direction: "ltr" }}>
          <span
            style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}
          >
            CARD ID
          </span>
          <code style={{ fontSize: "0.9rem", color: "#00e5c9" }}>
            {formatCardNumberMask(cardId)}
          </code>
        </div>
      </div>
    </div>
  );
}
