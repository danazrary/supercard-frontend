/**
 * ============================================================================
 * File: src/pages/SettingsPage.jsx
 * Description: Profile settings, language switcher, official contacts, and signout.
 * Usage / Imported By: App.jsx (Route: /settings).
 * ============================================================================
 */

import React from "react";
import LanguageSwitcher from "../components/common/LanguageSwitcher/LanguageSwitcher";
import Button from "../components/common/Button/Button";
import BottomNav from "../components/layout/BottomNav";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import { CONTACT_INFO } from "../utils/constants";

export default function SettingsPage() {
  const { user, logoutSession } = useAuth();
  const { t } = useLanguage();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        padding: "20px 20px 100px",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#ffc800", marginBottom: "20px" }}>
        {t("nav.settings")}
      </h2>

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          padding: "16px",
          borderRadius: "16px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ color: "#fff", marginBottom: "12px" }}>زمان / Language</h4>
        <LanguageSwitcher />
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          padding: "16px",
          borderRadius: "16px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ color: "#fff", marginBottom: "8px" }}>
          پەیوەندی بە دەستەی بەڕێوەبردن
        </h4>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          📞 {CONTACT_INFO.PHONE_DISPLAY}
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          📍 {CONTACT_INFO.OFFICE_LOCATION}
        </p>
      </div>

      {user && (
        <Button variant="danger" fullWidth onClick={logoutSession}>
          چوونەدەرەوە لە هەژمار
        </Button>
      )}

      <BottomNav onOpenBuyModal={() => {}} />
    </div>
  );
}
