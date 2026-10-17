/**
 * ============================================================================
 * File: src/components/layout/Header.jsx
 * Description: Luxury dark glassmorphic top header with animated active tabs,
 *              brand logo, language switcher, and customer auth trigger.
 * Usage / Imported By: src/App.jsx or Layout wrapper.
 * ============================================================================
 */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useAuth from "../../hooks/useAuth";
import LanguageSwitcher from "../common/LanguageSwitcher/LanguageSwitcher";
import Logo from "../../assets/images/logo/logo-only.jpg";
export default function Header({ onOpenAuth }) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      if (onOpenAuth) onOpenAuth();
      return;
    }
  };

  const navLinks = [
    { label: t("nav.home") || "سەرەکی", path: "/", requiresAuth: false },
    {
      label: t("nav.profile") || "پرۆفایل و کارت",
      path: "/profile",
      requiresAuth: true,
    },
    {
      label: t("nav.settings") || "ڕێکخستنەکان",
      path: "/settings",
      requiresAuth: false,
    },
  ];

  return (
    <header className="super-header">
      <div className="super-header__container">
        {/* Left Side: Brand Logo */}
        <Link to="/" className="super-header__brand">
          <div className="super-header__logo-badge">
          <img src={Logo} alt="Super Card Logo" className="super-header__logo" /> 
          </div>
          <div className="super-header__brand-text">
            <span className="super-header__brand-title">SUPER CARD</span>
            <span className="super-header__brand-tag">ERBIL VIP</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar with Animated Hover/Active Glow */}
        <nav className="super-header__nav">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item.path, item.requiresAuth)}
                className={`super-header__nav-link ${isActive ? "super-header__nav-link--active" : ""}`}
              >
                <span>{item.label}</span>
                {isActive && <span className="super-header__nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Language Switcher & Quick Auth Button */}
        <div className="super-header__actions">
          <LanguageSwitcher />

          {!isAuthenticated && onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="super-header__login-btn"
            >
              <span>چوونەژوورەوە</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
