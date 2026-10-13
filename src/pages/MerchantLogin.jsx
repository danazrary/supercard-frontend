/**
 * ============================================================================
 * File: src/pages/MerchantLogin.jsx
 * Description: Portal login page for Erbil clinics & partner specialty centers.
 * Usage / Imported By: App.jsx (Route: /merchant/login).
 * ============================================================================
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button/Button";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import * as authService from "../services/authService";

export default function MerchantLogin() {
  const { t } = useLanguage();
  const { loginMerchantSession } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authService.loginMerchant(username, password);
      loginMerchantSession(res.token, res.merchant);
      navigate("/merchant/scanner");
    } catch (err) {
      setError(err.message || "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(14, 30, 46, 0.7)",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid rgba(0, 229, 201, 0.3)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: "#00e5c9",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {t("merchant.login_title")}
        </h2>
        {error && (
          <div
            style={{
              color: "#ef4444",
              marginBottom: "16px",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
              {t("merchant.username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "#060b13",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                marginTop: "6px",
              }}
            />
          </div>
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
              {t("merchant.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "#060b13",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                marginTop: "6px",
              }}
            />
          </div>
          <Button type="submit" variant="gold" fullWidth disabled={isLoading}>
            {isLoading ? "..." : t("merchant.login_btn")}
          </Button>
        </form>
      </div>
    </div>
  );
}
