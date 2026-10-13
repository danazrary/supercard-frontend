/**
 * ============================================================================
 * File: src/pages/PaymentCallback.jsx
 * Description: First Iraqi Bank (FIB) return verification landing page.
 * Usage / Imported By: App.jsx (Route: /payment/callback).
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as paymentService from "../services/paymentService";
import Button from "../components/common/Button/Button";
import useLanguage from "../hooks/useLanguage";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [status, setStatus] = useState("VERIFYING"); // 'VERIFYING' | 'SUCCESS' | 'FAILED'

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("payment_id");
    if (token) {
      paymentService
        .verifyCallbackToken(token)
        .then(() => setStatus("SUCCESS"))
        .catch(() => setStatus("FAILED"));
    } else {
      setStatus("SUCCESS"); // Fallback dev preview
    }
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(14, 30, 46, 0.7)",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid rgba(255,200,0,0.3)",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        {status === "VERIFYING" && (
          <p style={{ color: "#00e5c9" }}>پشتڕاستکردنەوەی پسوولەی FIB...</p>
        )}

        {status === "SUCCESS" && (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
            <h2 style={{ color: "#ffc800", marginBottom: "8px" }}>
              {t("fib.status_paid")}
            </h2>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "0.9rem",
                marginBottom: "24px",
              }}
            >
              کارتی سوپەر کارتی تۆ بە سەرکەوتوویی چالاک کرا. پیرۆزە!
            </p>
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <Button variant="gold" fullWidth>
                بینینی کارت و خەڵاتەکان
              </Button>
            </Link>
          </div>
        )}

        {status === "FAILED" && (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
            <h2 style={{ color: "#ef4444", marginBottom: "8px" }}>
              {t("fib.status_failed")}
            </h2>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="cyan" fullWidth>
                گەڕانەوە بۆ سەرەکی
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
