/**
 * ============================================================================
 * File: src/components/customer/AuthBuyModal.jsx
 * Description: Step 1 modal collecting Iraqi phone number, verifying OTP, and
 *              transitioning directly to the First Iraqi Bank (FIB) payment flow.
 * Usage / Imported By: HomePage, BottomNav, ProfilePage.
 * ============================================================================
 */

import React, { useState } from "react";
import Modal from "../common/Modal/Modal";
import Button from "../common/Button/Button";
import useLanguage from "../../hooks/useLanguage";
import useAuth from "../../hooks/useAuth";
import {
  isValidIraqiPhone,
  normalizeIraqiPhone,
  isValidOtp,
} from "../../utils/validations";
import * as authService from "../../services/authService";

export default function AuthBuyModal({ isOpen, onClose, onAuthSuccess }) {
  const { t } = useLanguage();
  const { loginCustomerSession } = useAuth();

  const [step, setStep] = useState("PHONE"); // 'PHONE' | 'OTP'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidIraqiPhone(phone)) {
      setError(t("auth.invalid_phone"));
      return;
    }

    setIsLoading(true);
    try {
      const normalized = normalizeIraqiPhone(phone);
      await authService.requestOtp(normalized);
      setStep("OTP");
    } catch (err) {
      setError(err.message || "Failed to send SMS.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidOtp(otp)) {
      setError(t("auth.invalid_otp"));
      return;
    }

    setIsLoading(true);
    try {
      const normalized = normalizeIraqiPhone(phone);
      const res = await authService.verifyOtp(normalized, otp);
      loginCustomerSession(res.token, res.user);
      onAuthSuccess(normalized);
      onClose();
    } catch (err) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === "PHONE" ? t("auth.login_title") : t("auth.otp_title")}
    >
      {error && (
        <div
          style={{ color: "#ef4444", marginBottom: "12px", fontSize: "0.9rem" }}
        >
          {error}
        </div>
      )}

      {step === "PHONE" ? (
        <form
          onSubmit={handleSendOtp}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "0.9rem",
                color: "#cbd5e1",
              }}
            >
              {t("auth.phone_label")}
            </label>
            <input
              type="tel"
              placeholder={t("auth.phone_placeholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#060b13",
                color: "#fff",
                fontSize: "1rem",
                direction: "ltr",
              }}
            />
            <small
              style={{
                color: "#94a3b8",
                fontSize: "0.75rem",
                marginTop: "4px",
                display: "block",
              }}
            >
              {t("auth.phone_helper")}
            </small>
          </div>
          <Button type="submit" variant="gold" fullWidth disabled={isLoading}>
            {isLoading ? "..." : t("auth.send_otp")}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleVerifyOtp}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
            {t("auth.otp_sent_to")} <strong>{phone}</strong>
          </p>
          <input
            type="text"
            maxLength={6}
            placeholder="XXXXXX"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "#060b13",
              color: "#ffc800",
              fontSize: "1.5rem",
              letterSpacing: "8px",
              textAlign: "center",
            }}
          />
          <Button type="submit" variant="gold" fullWidth disabled={isLoading}>
            {isLoading ? "..." : t("auth.verify_btn")}
          </Button>
        </form>
      )}
    </Modal>
  );
}
