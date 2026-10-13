/**
 * ============================================================================
 * File: src/components/merchant/OfferStatusAlert.jsx
 * Description: Dynamic Green (Available) or Red (Already Redeemed) status alert banner.
 * Usage / Imported By: MerchantScanner.
 * ============================================================================
 */

import React from "react";
import { CheckCircleIcon, AlertTriangleIcon } from "../../assets/icons";

export default function OfferStatusAlert({ status, perkDescription }) {
  const isAvailable = status === "AVAILABLE";

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "16px",
        margin: "16px 0",
        background: isAvailable
          ? "rgba(16, 185, 129, 0.12)"
          : "rgba(239, 68, 68, 0.12)",
        border: `1px solid ${isAvailable ? "#10b981" : "#ef4444"}`,
        color: isAvailable ? "#10b981" : "#ef4444",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {isAvailable ? (
        <CheckCircleIcon size={28} />
      ) : (
        <AlertTriangleIcon size={28} />
      )}
      <div>
        <strong style={{ fontSize: "1rem", display: "block" }}>
          {isAvailable
            ? "ئۆفەری بێبەرامبەر بەردەستە (بەکارنەهێنراوە)"
            : "ئەم ئۆفەرە پێشتر بەکارهێنراوە!"}
        </strong>
        {perkDescription && (
          <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
            {perkDescription}
          </span>
        )}
      </div>
    </div>
  );
}
