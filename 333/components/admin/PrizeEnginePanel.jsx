/**
 * ============================================================================
 * File: src/components/admin/PrizeEnginePanel.jsx
 * Description: Admin control panel for the C-BOX prize engine: displays
 *              live stock counts and probability weights per prize tier,
 *              allows inline editing of stock/weight (persisted via
 *              updatePrizeStock), and an activation toggle per prize to
 *              pause a tier from the live lottery rotation (e.g. a sold-out
 *              grand prize) without deleting its historical record.
 * Usage / Imported By: pages/AdminDashboard.jsx (Prizes tab)
 * ============================================================================
 */

import React, { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import { updatePrizeStock, togglePrizeActive } from '../../services/prizeService';

/**
 * @param {Object} props
 * @param {Array} props.prizes - [{ id, name, tier, stockRemaining, weight, isActive }]
 * @param {Function} props.onPrizesChanged - Called after any successful mutation to refetch
 */
export default function PrizeEnginePanel({ prizes, onPrizesChanged }) {
  const { t } = useLanguage();
  const [editingValues, setEditingValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  function getFieldValue(prize, field) {
    return editingValues[prize.id]?.[field] ?? prize[field];
  }

  function handleFieldChange(prizeId, field, value) {
    setEditingValues((prev) => ({
      ...prev,
      [prizeId]: { ...prev[prizeId], [field]: value },
    }));
  }

  async function handleSave(prizeId) {
    const changes = editingValues[prizeId];
    if (!changes) return;
    setSavingId(prizeId);
    try {
      await updatePrizeStock(prizeId, changes);
      setEditingValues((prev) => {
        const next = { ...prev };
        delete next[prizeId];
        return next;
      });
      onPrizesChanged && onPrizesChanged();
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggle(prizeId) {
    setSavingId(prizeId);
    try {
      await togglePrizeActive(prizeId);
      onPrizesChanged && onPrizesChanged();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Prize</th>
            <th>Tier</th>
            <th>{t('admin.prizeStock')}</th>
            <th>{t('admin.prizeWeight')}</th>
            <th>{t('admin.centerStatus')}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {prizes.length === 0 && (
            <tr>
              <td colSpan={6} className="data-table__empty">
                —
              </td>
            </tr>
          )}
          {prizes.map((prize) => {
            const hasChanges = !!editingValues[prize.id];
            return (
              <tr key={prize.id}>
                <td className="data-table__cell-primary">{prize.name}</td>
                <td>
                  <span className={`badge badge--${prize.tier === 'grand' ? 'error' : prize.tier === 'gadget' ? 'info' : 'discount'}`}>
                    {prize.tier}
                  </span>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="field__input"
                    style={{ width: 90, padding: '6px 10px' }}
                    value={getFieldValue(prize, 'stockRemaining')}
                    onChange={(e) => handleFieldChange(prize.id, 'stockRemaining', Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="field__input"
                    style={{ width: 80, padding: '6px 10px' }}
                    value={getFieldValue(prize, 'weight')}
                    onChange={(e) => handleFieldChange(prize.id, 'weight', Number(e.target.value))}
                  />
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      className="toggle-switch__input"
                      checked={prize.isActive}
                      disabled={savingId === prize.id}
                      onChange={() => handleToggle(prize.id)}
                    />
                    <span className="toggle-switch__track">
                      <span className="toggle-switch__thumb" />
                    </span>
                  </label>
                </td>
                <td>
                  {hasChanges && (
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleSave(prize.id)}
                      disabled={savingId === prize.id}
                    >
                      {t('common.save')}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
