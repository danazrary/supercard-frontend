/**
 * ============================================================================
 * File: src/pages/MerchantLogin.jsx
 * Description: Username/password login screen for partner clinic staff
 *              accounts, issued by the super-admin. On success, redirects
 *              to /merchant/scanner (or back to the originally requested
 *              protected route via location.state.from, if present).
 * Usage / Imported By: App.jsx route "/merchant/login" (public)
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button/Button';

export default function MerchantLogin() {
  const { t } = useLanguage();
  const { loginMerchant } = useAuth();
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
      await loginMerchant(username, password);
      const redirectTo = location.state?.from?.pathname || '/merchant/scanner';
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
          {t('merchant.loginTitle')}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="merchant-username">
              {t('merchant.username')}
            </label>
            <input
              id="merchant-username"
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
            <label className="field__label" htmlFor="merchant-password">
              {t('merchant.password')}
            </label>
            <input
              id="merchant-password"
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
