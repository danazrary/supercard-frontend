/**
 * ============================================================================
 * File: src/pages/SettingsPage.jsx
 * Description: Customer account settings: editable name field, read-only
 *              phone number display, language selector (ku/ar/en), and
 *              logout action with confirmation. Uses AuthContext's
 *              updateUserProfile for optimistic local updates after a
 *              (hypothetical) profile-update API call.
 * Usage / Imported By: App.jsx route "/settings" (wrapped in ProtectedRoute
 *                       with allowedRole="customer")
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button/Button';
import LanguageSwitcher from '../components/common/LanguageSwitcher/LanguageSwitcher';
import { formatIraqiPhone } from '../utils/formatters';
import { LogoutIcon } from '../assets/icons';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  function handleNameBlur() {
    if (name !== user?.name) {
      setIsSavingName(true);
      // Local-only optimistic update; a dedicated profile-update endpoint
      // would be wired here in a full implementation.
      updateUserProfile({ name });
      setIsSavingName(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="container section page-with-bottom-nav">
      <h1 className="text-h2" style={{ marginBottom: 20 }}>
        {t('settings.title')}
      </h1>

      <div className="content-card" style={{ marginBottom: 16 }}>
        <div className="content-card__header">
          <h2 className="content-card__title">{t('settings.accountInfo')}</h2>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="settings-name">
            {t('settings.name')}
          </label>
          <input
            id="settings-name"
            type="text"
            className="field__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            disabled={isSavingName}
          />
        </div>

        <div className="field">
          <span className="field__label">{t('settings.phone')}</span>
          <p className="ltr-inline text-body">{formatIraqiPhone(user?.phone)}</p>
        </div>
      </div>

      <div className="content-card" style={{ marginBottom: 16 }}>
        <div className="content-card__header">
          <h2 className="content-card__title">{t('settings.language')}</h2>
        </div>
        <LanguageSwitcher />
      </div>

      {!showLogoutConfirm ? (
        <Button
          variant="danger"
          fullWidth
          icon={<LogoutIcon size={20} />}
          onClick={() => setShowLogoutConfirm(true)}
        >
          {t('nav.logout')}
        </Button>
      ) : (
        <div className="content-card" style={{ textAlign: 'center' }}>
          <p className="text-body" style={{ marginBottom: 16 }}>
            {t('settings.logoutConfirm')}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" fullWidth onClick={() => setShowLogoutConfirm(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" fullWidth onClick={handleLogout}>
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
