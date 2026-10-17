/**
 * ============================================================================
 * File: src/pages/AdminDashboard.jsx
 * Description: Super Admin panel with tabs for Offers, List, Centers, and Prizes.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OfferCMSForm from "../components/admin/OfferCMSForm";
import OfferListTable from "../components/admin/OfferListTable";
import EditOfferModal from "../components/admin/EditOfferModal";
import CenterManagerTable from "../components/admin/CenterManagerTable";
import PrizeEnginePanel from "../components/admin/PrizeEnginePanel";
import useLanguage from "../hooks/useLanguage";
import useAuth from "../hooks/useAuth";

export default function AdminDashboard({ defaultTab = "OFFERS" }) {
  const { t } = useLanguage();
  const { user, logoutSession } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [editingOffer, setEditingOffer] = useState(null);

  useEffect(() => {
    setActiveTab(defaultTab);
    if (defaultTab !== "OFFERS") setEditingOffer(null);
  }, [defaultTab]);

  const handleTabChange = (tab, routePath) => {
    setEditingOffer(null);
    setActiveTab(tab);
    navigate(routePath);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        padding: "32px 20px",
        maxWidth: "960px",
        margin: "0 auto",
        direction: "rtl",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ color: "#ffc800", margin: 0 }}>
            👑 پەنێڵی کۆنتڕۆڵی ئادمین (Super Admin)
          </h2>
          <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
            بەخێربێیت، {user?.fullName || "بەڕێوەبەری گشتی"}
          </span>
        </div>

        <button
          onClick={() => {
            logoutSession();
            navigate("/admin/login");
          }}
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "8px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          چوونەدەرەوە
        </button>
      </div>

      {/* تابەکانی داشبۆرد */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => handleTabChange("OFFERS", "/admin/offers")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 200, 0, 0.3)",
            background: activeTab === "OFFERS" ? "#ffc800" : "#0b1522",
            color: activeTab === "OFFERS" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📱 زیاد کردنی ئۆفەر
        </button>
        <button
          onClick={() => handleTabChange("OFFERS-LIST", "/admin/offers-list")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 200, 0, 0.3)",
            background: activeTab === "OFFERS-LIST" ? "#ffc800" : "#0b1522",
            color: activeTab === "OFFERS-LIST" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📋 لیستی ئۆفەرەکان
        </button>
        <button
          onClick={() => handleTabChange("CENTERS", "/admin/centers")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 200, 0, 0.3)",
            background: activeTab === "CENTERS" ? "#ffc800" : "#0b1522",
            color: activeTab === "CENTERS" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🏥 بەڕێوەبردنی سەنتەرەکان
        </button>

        <button
          onClick={() => handleTabChange("PRIZES", "/admin/prizes")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 200, 0, 0.3)",
            background: activeTab === "PRIZES" ? "#ffc800" : "#0b1522",
            color: activeTab === "PRIZES" ? "#060b13" : "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🎁 مەکینەی دیارییەکان (C-BOX)
        </button>
      </div>

      {/* ناوەڕۆکی تابەکان */}
      {activeTab === "OFFERS" &&
        (editingOffer ? (
          <EditOfferModal
            offer={editingOffer}
            onUpdated={() => {
              setEditingOffer(null);
              setActiveTab("OFFERS-LIST");
              navigate("/admin/offers-list");
            }}
            onCancel={() => setEditingOffer(null)}
          />
        ) : (
          <OfferCMSForm
            onSave={() => {
              setActiveTab("OFFERS-LIST");
              navigate("/admin/offers-list");
            }}
          />
        ))}

      {activeTab === "OFFERS-LIST" && (
        <OfferListTable
          onEditOffer={(offer) => {
            setEditingOffer(offer);
            setActiveTab("OFFERS");
          }}
        />
      )}

      {activeTab === "CENTERS" && <CenterManagerTable />}
      {activeTab === "PRIZES" && <PrizeEnginePanel />}
    </div>
  );
}
