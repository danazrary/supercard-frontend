/**
 * ============================================================================
 * File: src/pages/NotFoundPage.jsx
 * Description: Luxury-themed 404 fallback page shown for any unmatched
 *              route. Provides a single clear path back to the customer
 *              landing page, styled consistently with the dark/gold theme
 *              rather than a generic browser error look.
 * Usage / Imported By: App.jsx wildcard route "*"
 * ============================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 24 }}>
      <p className="text-h1 text-gold-gradient" style={{ fontSize: 72 }}>
        404
      </p>
      <h1 className="text-h3" style={{ marginTop: 12, color: 'var(--color-error, #ef4444)' }}>
        {t('notFound.title')}
      </h1>
      <p className="text-body" style={{ margin: '12px 0 24px' }}>
        {t('notFound.message')}
      </p>
      <Link to="/" className="btn btn--secondary">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}
