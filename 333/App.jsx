/**
 * ============================================================================
 * File: src/App.jsx
 * Description: Root application component. Composes the three global
 *              context providers (Language, Auth, Payment) and defines the
 *              complete route tree: public customer routes (landing,
 *              payment callback), protected customer routes (profile,
 *              settings), merchant routes (login + protected scanner), and
 *              admin routes (login + protected tabbed dashboard), plus the
 *              404 fallback.
 * Usage / Imported By: src/index.jsx
 * ============================================================================
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';

import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

import HomePage from './pages/HomePage';
import PaymentCallback from './pages/PaymentCallback';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MerchantLogin from './pages/MerchantLogin';
import MerchantScanner from './pages/MerchantScanner';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PaymentProvider>
          <div className="super-card-app">
            <Routes>
              {/* ---------------- Customer: Public ---------------- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />

              {/* ---------------- Customer: Protected ---------------- */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* ---------------- Merchant ---------------- */}
              <Route path="/merchant/login" element={<MerchantLogin />} />
              <Route
                path="/merchant/scanner"
                element={
                  <ProtectedRoute allowedRole="merchant">
                    <MerchantScanner />
                  </ProtectedRoute>
                }
              />

              {/* ---------------- Admin ---------------- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/:tab"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ---------------- 404 ---------------- */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </PaymentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
