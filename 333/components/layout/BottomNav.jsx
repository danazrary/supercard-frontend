/**
 * ============================================================================
 * File: src/components/layout/BottomNav.jsx
 * Description: Floating glassmorphic bottom navigation bar shown on all
 *              customer-facing pages. Displays Home/Profile/Settings nav
 *              items plus a prominent elevated central "کڕینی کارت" (Buy
 *              Card) action button that opens AuthBuyModal if the customer
 *              is not authenticated/doesn't yet have a card, or routes to
 *              the gift box / profile if they already own one.
 * Usage / Imported By: App.jsx (rendered once, outside <Routes>, for all
 *                       customer routes)
 * ============================================================================
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import useAuth from '../../hooks/useAuth';
import { HomeIcon, UserIcon, SettingsIcon, GiftBoxIcon } from '../../assets/icons';

/**
 * @param {Object} props
 * @param {Function} props.onBuyCardClick - Invoked when the central CTA is
 *        tapped; parent (App/HomePage) decides whether to open AuthBuyModal,
 *        FibPaymentModal, or navigate based on current auth/card state.
 */
export default function BottomNav({ onBuyCardClick }) {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, isCustomer } = useAuth();

  const hasActiveCard = isCustomer && user?.cardActive;

  const navItems = [
    { to: '/', label: t('nav.home'), icon: HomeIcon },
    { to: '/profile', label: t('nav.profile'), icon: UserIcon },
    { to: '/settings', label: t('nav.settings'), icon: SettingsIcon },
  ];

  const midpoint = Math.ceil(navItems.length / 2);
  const leftItems = navItems.slice(0, midpoint);
  const rightItems = navItems.slice(midpoint);

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {leftItems.map((item) => (
        <NavItem key={item.to} item={item} active={location.pathname === item.to} />
      ))}

      <button
        type="button"
        className="bottom-nav__cta"
        onClick={onBuyCardClick}
        aria-label={hasActiveCard ? t('profile.giftBoxButton') : t('nav.buyCard')}
      >
        {hasActiveCard ? (
          <GiftBoxIcon size={26} color="var(--color-text-dark, #060b13)" />
        ) : (
          <span style={{ fontSize: 22, fontWeight: 700, color: '#060b13' }}>+</span>
        )}
      </button>

      {rightItems.map((item) => (
        <NavItem key={item.to} item={item} active={location.pathname === item.to} />
      ))}
    </nav>
  );
}

function NavItem({ item, active }) {
  const Icon = item.icon;
  return (
    <Link to={item.to} className={`bottom-nav__item${active ? ' bottom-nav__item--active' : ''}`}>
      <Icon size={22} className="bottom-nav__icon" />
      <span className="bottom-nav__label">{item.label}</span>
    </Link>
  );
}
