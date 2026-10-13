/**
 * ============================================================================
 * File: src/components/layout/BottomNav.jsx
 * Description: Fully animated luxury floating dock for mobile viewports
 *              featuring radiant CTA pulse, glowing badges, and spring motions.
 * Usage / Imported By: src/App.jsx, HomePage, ProfilePage.
 * ============================================================================
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { QRIcon, GiftBoxIcon } from "../../assets/icons";

export default function BottomNav({ onOpenBuyModal }) {
  const { t } = useLanguage();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/profile";
  const isSettings = location.pathname === "/settings";

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__dock">
        {/* Tab 1: Home */}
        <Link
          to="/"
          className={`bottom-nav__item ${isHome ? "bottom-nav__item--active" : ""}`}
        >
          <span className="bottom-nav__icon-wrapper">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className="bottom-nav__label">{t("nav.home") || "سەرەکی"}</span>
          {isHome && <span className="bottom-nav__glow-pill" />}
        </Link>

        {/* Center Floating Action Button (CTA) with radiant pulse */}
        <div className="bottom-nav__action-wrapper">
          <button
            type="button"
            className="bottom-nav__action-btn"
            onClick={onOpenBuyModal}
            aria-label="Buy Super Card"
          >
            <span className="bottom-nav__action-pulse" />
            <span className="bottom-nav__action-shine" />
            <span className="bottom-nav__action-icon">⚡</span>
            <span className="bottom-nav__action-text">
              {t("nav.buy_card_btn") || "کڕینی کارت"}
            </span>
          </button>
        </div>

        {/* Tab 2: Profile & VIP Card */}
        <Link
          to="/profile"
          className={`bottom-nav__item ${isProfile ? "bottom-nav__item--active" : ""}`}
        >
          <span className="bottom-nav__icon-wrapper">
            <QRIcon size={20} />
          </span>
          <span className="bottom-nav__label">
            {t("nav.profile") || "کارتی من"}
          </span>
          {isProfile && <span className="bottom-nav__glow-pill" />}
        </Link>

        {/* Tab 3: Settings */}
        <Link
          to="/settings"
          className={`bottom-nav__item ${isSettings ? "bottom-nav__item--active" : ""}`}
        >
          <span className="bottom-nav__icon-wrapper">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span className="bottom-nav__label">
            {t("nav.settings") || "ڕێکخستن"}
          </span>
          {isSettings && <span className="bottom-nav__glow-pill" />}
        </Link>
      </div>
    </nav>
  );
}
