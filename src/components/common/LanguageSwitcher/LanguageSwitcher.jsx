/**
 * ============================================================================
 * File: src/components/common/LanguageSwitcher/LanguageSwitcher.jsx
 * Description: Multi-language selector button toggling ku, ar, and en.
 * Usage / Imported By: Header, SettingsPage, BottomNav.
 * ============================================================================
 */

import React from "react";
import useLanguage from "../../../hooks/useLanguage";

export default function LanguageSwitcher() {
  const { locale, switchLanguage } = useLanguage();

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        background: "rgba(255,255,255,0.06)",
        padding: "4px",
        borderRadius: "50px",
      }}
    >
      <button
        onClick={() => switchLanguage("ku")}
        style={{
          border: "none",
          padding: "6px 12px",
          borderRadius: "20px",
          background: locale === "ku" ? "#ffc800" : "transparent",
          color: locale === "ku" ? "#060b13" : "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        کوردی
      </button>
      <button
        onClick={() => switchLanguage("ar")}
        style={{
          border: "none",
          padding: "6px 12px",
          borderRadius: "20px",
          background: locale === "ar" ? "#ffc800" : "transparent",
          color: locale === "ar" ? "#060b13" : "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        عربي
      </button>
      <button
        onClick={() => switchLanguage("en")}
        style={{
          border: "none",
          padding: "6px 12px",
          borderRadius: "20px",
          background: locale === "en" ? "#ffc800" : "transparent",
          color: locale === "en" ? "#060b13" : "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        EN
      </button>
    </div>
  );
}
