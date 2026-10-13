/**
 * ============================================================================
 * File: src/pages/AdminDashboard.jsx
 * Description: Super Admin panel with tabs for Offers (9:16), Centers, and Prizes.
 * Usage / Imported By: App.jsx (Route: /admin/dashboard, /admin/offers, etc.).
 * ============================================================================
 */

import React, { useState } from "react";
import OfferCMSForm from "../components/admin/OfferCMSForm";
import CenterManagerTable from "../components/admin/CenterManagerTable";
import PrizeEnginePanel from "../components/admin/PrizeEnginePanel";
import useLanguage from "../hooks/useLanguage";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("OFFERS"); // 'OFFERS' | 'CENTERS' | 'PRIZES'

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        padding: "32px 20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#ffc800", marginBottom: "24px" }}>
        {t("admin.dashboard_title")}
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setActiveTab("OFFERS")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            background: activeTab === "OFFERS" ? "#ffc800" : "#0b1522",
            color: activeTab === "OFFERS" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {t("admin.tab_offers")}
        </button>
        <button
          onClick={() => setActiveTab("CENTERS")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            background: activeTab === "CENTERS" ? "#ffc800" : "#0b1522",
            color: activeTab === "CENTERS" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {t("admin.tab_centers")}
        </button>
        <button
          onClick={() => setActiveTab("PRIZES")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            background: activeTab === "PRIZES" ? "#ffc800" : "#0b1522",
            color: activeTab === "PRIZES" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {t("admin.tab_prizes")}
        </button>
      </div>

      {activeTab === "OFFERS" && (
        <OfferCMSForm onSave={(data) => console.log("Saved offer", data)} />
      )}
      {activeTab === "CENTERS" && <CenterManagerTable />}
      {activeTab === "PRIZES" && <PrizeEnginePanel />}
    </div>
  );
}
