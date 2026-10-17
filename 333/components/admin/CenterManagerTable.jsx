/**
 * ============================================================================
 * File: src/components/admin/CenterManagerTable.jsx
 * Description: Admin table listing all partner centers (merchant accounts):
 *              name, assigned username, activation status with an inline
 *              toggle switch, and row-level edit/delete actions. Activation
 *              toggling immediately disables/enables that center's merchant
 *              login and scanning access.
 * Usage / Imported By: pages/AdminDashboard.jsx (Centers tab)
 * ============================================================================
 */

import React, { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import Button from '../common/Button/Button';
import { EditIcon, TrashIcon, PlusIcon } from '../../assets/icons';

/**
 * @param {Object} props
 * @param {Array} props.centers - [{ id, name, username, isActive }]
 * @param {Function} props.onToggleActive - (centerId) => Promise
 * @param {Function} props.onEdit - (center) => void
 * @param {Function} props.onDelete - (centerId) => Promise
 * @param {Function} props.onAddNew - () => void
 */
export default function CenterManagerTable({ centers, onToggleActive, onEdit, onDelete, onAddNew }) {
  const { t } = useLanguage();
  const [togglingId, setTogglingId] = useState(null);

  async function handleToggle(centerId) {
    setTogglingId(centerId);
    try {
      await onToggleActive(centerId);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button icon={<PlusIcon size={18} />} onClick={onAddNew} size="sm">
          {t('admin.addNew')}
        </Button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('admin.centerName')}</th>
              <th>Username</th>
              <th>{t('admin.centerStatus')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {centers.length === 0 && (
              <tr>
                <td colSpan={4} className="data-table__empty">
                  —
                </td>
              </tr>
            )}
            {centers.map((center) => (
              <tr key={center.id}>
                <td className="data-table__cell-primary">{center.name}</td>
                <td className="ltr-inline">{center.username}</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      className="toggle-switch__input"
                      checked={center.isActive}
                      disabled={togglingId === center.id}
                      onChange={() => handleToggle(center.id)}
                    />
                    <span className="toggle-switch__track">
                      <span className="toggle-switch__thumb" />
                    </span>
                  </label>
                </td>
                <td>
                  <div className="data-table__cell-actions">
                    <button type="button" className="icon-btn" onClick={() => onEdit(center)} aria-label="edit">
                      <EditIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onDelete(center.id)}
                      aria-label="delete"
                    >
                      <TrashIcon size={16} color="var(--color-error, #ef4444)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
