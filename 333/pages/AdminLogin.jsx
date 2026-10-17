/**
 * ============================================================================
 * File: src/pages/AdminLogin.jsx
 * Description: Username/password login screen for the super-admin account
 *              with full CMS access over offers, centers, and the prize
 *              engine. On success, redirects to /admin/offers (the
 *              AdminDashboard's default tab) or back to the originally
 *              requested protected route.
 * Usage / Imported By: App.jsx route "/admin/login" (public)
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button/Button';

export default function AdminLogin() {
  const { t } = useLanguage();
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await loginAdmin(username, password);
      const redirectTo = location.state?.from?.pathname || '/admin/offers';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <div className="content-card" style={{ maxWidth: 380, width: '100%' }}>
        <h1 className="text-h2 text-center" style={{ marginBottom: 24 }}>
          {t('admin.loginTitle')}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="admin-username">
              {t('merchant.username')}
            </label>
            <input
              id="admin-username"
              type="text"
              className="field__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="ltr"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="admin-password">
              {t('merchant.password')}
            </label>
            <input
              id="admin-password"
              type="password"
              className="field__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              required
            />
          </div>

          {error && (
            <p className="field__error text-center" style={{ marginBottom: 12 }}>
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={isSubmitting} disabled={!username || !password}>
            {t('common.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
