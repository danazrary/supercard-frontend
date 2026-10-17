/**
 * ============================================================================
 * File: src/pages/MerchantLogin.jsx
 * Description: Unified login page for Erbil clinics (/merchant/login)
 *              and Super Admin (/admin/login) with automatic role routing.
 * Usage / Imported By: App.jsx (Routes: /merchant/login & /admin/login).
 * ============================================================================
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/common/Button/Button";
import useAuth from "../hooks/useAuth";
import * as authService from "../services/authService";

export default function MerchantLogin() {
  const { loginMerchantSession, loginAdminSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // پشکنینی ئەوەی ئایا لە پەڕەی /admin/login یان /merchant/login ین
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let response;
      if (isAdminRoute) {
        // ئەگەر لە پەڕەی /admin/login بوو، ڕاستەوخۆ دەچێت بۆ ئەی‌پی‌ئای ئادمین
        response = await authService.loginAdmin(email, password);
      } else {
        // ئەگەر لە /merchant/login بوو
        response = await authService.loginMerchant(email, password);
      }

      // دڵنیابوونەوە لە وەرگرتنی داتا چ لە ناو response.data بێت چ ڕاستەوخۆ
      const data = response?.data || response;

      if (data.role === "admin" || data.admin || isAdminRoute) {
        // تۆمارکردنی دانیشتنی ئادمین لە AuthContext و ڕۆشتن بۆ داشبۆردی ئادمین
        loginAdminSession(data.token, data.admin || data.merchant);
        navigate("/admin/offers", { replace: true });
      } else {
        // تۆمارکردنی دانیشتنی سەنتەر و ڕۆشتن بۆ سکانەری کامێرا
        loginMerchantSession(data.token, data.merchant);
        navigate("/merchant/scanner", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "ئیمەیڵ یان وشەی نهێنی هەڵەیە.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        background: "#060b13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        direction: "rtl",
      }}
    >
      <div
        style={{
          background: "rgba(14, 30, 46, 0.7)",
          padding: "32px",
          borderRadius: "24px",
          border: isAdminRoute
            ? "1px solid rgba(255, 200, 0, 0.4)"
            : "1px solid rgba(0, 229, 201, 0.3)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: isAdminRoute ? "#ffc800" : "#00e5c9",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {isAdminRoute
            ? "👑 چوونەژوورەوەی ئادمین (Super Admin)"
            : "🏥 چوونەژوورەوەی سەنتەرەکان"}
        </h2>

        {error && (
          <div
            style={{
              color: "#ef4444",
              background: "rgba(239, 68, 68, 0.12)",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "16px",
              fontSize: "0.85rem",
              textAlign: "center",
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
              {isAdminRoute
                ? "ئیمەیڵی ئادمین (Email)"
                : "ئیمەیڵی سەنتەر (Email)"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                isAdminRoute ? "admin@supercard.iq" : "kurdsmile@supercard.iq"
              }
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "#060b13",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                marginTop: "6px",
                direction: "ltr",
              }}
            />
          </div>
          <div>
            <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
              وشەی تێپەڕ (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "#060b13",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                marginTop: "6px",
                direction: "ltr",
              }}
            />
          </div>
          <Button type="submit" variant="gold" fullWidth disabled={isLoading}>
            {isLoading ? "چاوەڕوان بە..." : "چوونەژوورەوە"}
          </Button>
        </form>
      </div>
    </div>
  );
}
