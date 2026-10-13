/**
 * ============================================================================
 * File: src/App.jsx
 * Description: Master application layout, routing configuration, global
 *              modals (Auth & FIB Payment), and context provider orchestration.
 * Usage / Imported By: src/index.jsx
 * ============================================================================
 */

import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// -------------------------------------------------------------
// Global Context Providers
// -------------------------------------------------------------
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";

// -------------------------------------------------------------
// Global Hooks & Modals
// -------------------------------------------------------------
import useFibPayment from "./hooks/useFibPayment";
import AuthBuyModal from "./components/customer/AuthBuyModal";
import FibPaymentModal from "./components/customer/FibPaymentModal";

// -------------------------------------------------------------
// Layout Components
// -------------------------------------------------------------
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";

// -------------------------------------------------------------
// Route Guards & Pages
// -------------------------------------------------------------
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import HomePage from "./pages/HomePage";
import PaymentCallback from "./pages/PaymentCallback";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import MerchantLogin from "./pages/MerchantLogin";
import MerchantScanner from "./pages/MerchantScanner";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";

// -------------------------------------------------------------
// شریتی تاقیکردنەوەی خێرا (Dev Navigation Switcher)
// -------------------------------------------------------------
const DevNavSwitcher = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const routes = [
    { name: "پەڕەی سەرەکی (Landing)", path: "/" },
    { name: "گەڕانەوەی FIB (Callback)", path: "/payment/callback" },
    { name: "پرۆفایل و کارت (Profile)", path: "/profile" },
    { name: "ڕێکخستنەکان (Settings)", path: "/settings" },
    { name: "چوونەژوورەوەی سەنتەر", path: "/merchant/login" },
    { name: "سکانەری سەنتەرەکان", path: "/merchant/scanner" },
    { name: "چوونەژوورەوەی ئادمین", path: "/admin/login" },
    { name: "ئادمین: بەڕێوەبردنی ئۆفەر", path: "/admin/offers" },
    { name: "ئادمین: سەنتەرەکان", path: "/admin/centers" },
    { name: "ئادمین: خەڵاتەکان", path: "/admin/prizes" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        left: "20px",
        zIndex: 9999,
        direction: "rtl",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#ffc800",
          color: "#060b13",
          border: "none",
          padding: "10px 18px",
          borderRadius: "50px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(255, 200, 0, 0.4)",
        }}
      >
        {open ? "✕ داخستنی لیست" : "⚡ گۆڕینی پەڕەکان (Routes)"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "0",
            background: "#0b1522",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "12px",
            width: "260px",
            maxHeight: "400px",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          <p
            style={{
              color: "#00e5c9",
              fontSize: "12px",
              margin: "0 0 8px 0",
              fontWeight: "bold",
            }}
          >
            کلیک لە هەر ڕاوتێک بکە بۆ بینینی:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {routes.map((r) => {
              const isActive = location.pathname === r.path;
              return (
                <li key={r.path} style={{ marginBottom: "6px" }}>
                  <Link
                    to={r.path}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "13px",
                      color: isActive ? "#060b13" : "#cbd5e1",
                      background: isActive
                        ? "#00e5c9"
                        : "rgba(255,255,255,0.03)",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    {r.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// پێکهاتەی ناوەوەی پرۆژە (AppContent)
// دەستی دەگات بە کۆنتێکستەکانی ناوەوە (PaymentContext و هتد)
// -------------------------------------------------------------
function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { startPayment } = useFibPayment();
  const location = useLocation();

  const handleAuthSuccess = (phone) => {
    startPayment(phone);
  };

  const isScannerView = location.pathname === "/merchant/scanner";

  return (
    <div
      className="super-card-app"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#060b13",
      }}
    >
      {/* شریتی یارمەتیدەری Dev بۆ تاقیکردنەوەی خێرا */}
      <DevNavSwitcher />

      {/* سەرپەڕەی سەرەکی (Header) */}
      <Header onOpenAuth={() => setAuthModalOpen(true)} />

      {/* ناوەڕۆکی پەڕەکان */}
      <main style={{ flex: 1, position: "relative" }}>
        <Routes>
          {/* ۱. بەشی کڕیار (Customer Routes) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* ۲. بەشی سەنتەرەکان (Merchant Routes) */}
          <Route path="/merchant/login" element={<MerchantLogin />} />
          <Route
            path="/merchant/scanner"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantScanner />
              </ProtectedRoute>
            }
          />

          {/* ۳. بەشی بەڕێوەبەرایەتی گشتی (Super Admin Routes) */}
          <Route path="/admin/login" element={<MerchantLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard defaultTab="OFFERS" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/centers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard defaultTab="CENTERS" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/prizes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard defaultTab="PRIZES" />
              </ProtectedRoute>
            }
          />

          {/* ۴. پەڕەی دۆزینەوەنەکراو (404 Not Found) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* ژێرپەڕە (Footer) */}
      <Footer />

      {/* شریتی جووڵاوی مۆبایل (BottomNav) */}
      {!isScannerView && (
        <BottomNav onOpenBuyModal={() => setAuthModalOpen(true)} />
      )}

      {/* مۆداڵەکانی کڕین و پارەدانی FIB لەسەر ئاستی گشتی بەرنامە */}
      <AuthBuyModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      <FibPaymentModal />
    </div>
  );
}

// -------------------------------------------------------------
// ڕێکخەری سەرەکی بەرنامە بە گشت پرۆڤایدەرەکانەوە
// -------------------------------------------------------------
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PaymentProvider>
          <AppContent />
        </PaymentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
