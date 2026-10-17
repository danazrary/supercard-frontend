/**
 * ============================================================================
 * File: src/components/merchant/ManualCodeInput.jsx
 * Description: Fallback text input allowing merchant staff to manually type
 *              a customer's card code when the camera is unavailable, the
 *              QR is damaged/unreadable, or the staff member prefers manual
 *              entry. Validates UUID format client-side before submission.
 * Usage / Imported By: pages/MerchantScanner.jsx
 * ============================================================================
 */

import React, { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import Button from '../common/Button/Button';
import { isValidUUID } from '../../utils/validations';

/**
 * @param {Object} props
 * @param {Function} props.onSubmit - Called with the validated card UUID
 */
export default function ManualCodeInput({ onSubmit }) {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!isValidUUID(trimmed)) {
      setError(t('errors.genericError'));
      return;
    }
    setError('');
    onSubmit(trimmed);
    setCode('');
  }

  return (
    <form className="manual-entry" onSubmit={handleSubmit}>
      <label className="field__label" htmlFor="manual-code">
        {t('merchant.manualEntry')}
      </label>
      <input
        id="manual-code"
        type="text"
        className="manual-entry__input"
        placeholder="xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {error && <span className="field__error">{error}</span>}
      <Button type="submit" variant="secondary" fullWidth disabled={!code.trim()}>
        {t('common.submit')}
      </Button>
    </form>
  );
}
