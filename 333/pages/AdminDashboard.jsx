/**
 * ============================================================================
 * File: src/pages/AdminDashboard.jsx
 * Description: Super-admin shell with a tabbed interface switching between
 *              Offers (OfferCMSForm + list/delete/toggle), Centers
 *              (CenterManagerTable), and Prizes (PrizeEnginePanel). Owns the
 *              data-fetching for each tab and passes mutation callbacks down
 *              so child components stay presentation-focused.
 * Usage / Imported By: App.jsx route "/admin/offers" | "/admin/centers" |
 *                       "/admin/prizes" (wrapped in ProtectedRoute with
 *                       allowedRole="admin")
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import OfferCMSForm from '../components/admin/OfferCMSForm';
import CenterManagerTable from '../components/admin/CenterManagerTable';
import PrizeEnginePanel from '../components/admin/PrizeEnginePanel';
import Button from '../components/common/Button/Button';
import { getOffers, deleteOffer, toggleOfferActive } from '../services/offerService';
import { getAdminPrizeList } from '../services/prizeService';
import api from '../services/api';
import { ENDPOINTS, USER_ROLES } from '../utils/constants';
import { LogoutIcon, PlusIcon, EditIcon, TrashIcon } from '../assets/icons';

const TABS = ['offers', 'centers', 'prizes'];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const activeTab = TABS.includes(params.tab) ? params.tab : 'offers';

  const [offers, setOffers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const loadOffers = useCallback(() => getOffers().then(setOffers), []);
  const loadCenters = useCallback(
    () => api.get(ENDPOINTS.ADMIN.CENTERS_LIST).then(({ data }) => setCenters(data.centers)),
    []
  );
  const loadPrizes = useCallback(() => getAdminPrizeList().then(setPrizes), []);

  useEffect(() => {
    setIsLoading(true);
    const loader = activeTab === 'offers' ? loadOffers : activeTab === 'centers' ? loadCenters : loadPrizes;
    loader().finally(() => setIsLoading(false));
  }, [activeTab, loadOffers, loadCenters, loadPrizes]);

  async function handleDeleteOffer(id) {
    await deleteOffer(id);
    loadOffers();
  }

  async function handleToggleOffer(id) {
    await toggleOfferActive(id);
    loadOffers();
  }

  async function handleToggleCenter(id) {
    await api.patch(ENDPOINTS.ADMIN.CENTERS_TOGGLE(id));
    loadCenters();
  }

  async function handleDeleteCenter(id) {
    // Centers typically aren't hard-deleted (historical redemption records
    // depend on them); deactivation via the toggle is the primary control.
    await handleToggleCenter(id);
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="text-h2">{t('admin.dashboardTitle')}</h1>
        <button type="button" className="icon-btn" onClick={handleLogout} aria-label={t('nav.logout')}>
          <LogoutIcon size={18} />
        </button>
      </div>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tabs__tab${activeTab === tab ? ' admin-tabs__tab--active' : ''}`}
            onClick={() => navigate(`/admin/${tab}`)}
          >
            {t(`admin.${tab}Tab`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="skeleton" style={{ height: 240 }} />
      ) : (
        <>
          {activeTab === 'offers' && (
            <div>
              {!showOfferForm ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <Button
                      icon={<PlusIcon size={18} />}
                      size="sm"
                      onClick={() => {
                        setEditingOffer(null);
                        setShowOfferForm(true);
                      }}
                    >
                      {t('admin.addNew')}
                    </Button>
                  </div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t('admin.offerTitle')}</th>
                          <th>{t('admin.centerName')}</th>
                          <th>{t('admin.centerStatus')}</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {offers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="data-table__empty">
                              —
                            </td>
                          </tr>
                        )}
                        {offers.map((offer) => (
                          <tr key={offer.id}>
                            <td className="data-table__cell-primary">{offer.title}</td>
                            <td>{offer.centerName}</td>
                            <td>
                              <label className="toggle-switch">
                                <input
                                  type="checkbox"
                                  className="toggle-switch__input"
                                  checked={offer.isActive}
                                  onChange={() => handleToggleOffer(offer.id)}
                                />
                                <span className="toggle-switch__track">
                                  <span className="toggle-switch__thumb" />
                                </span>
                              </label>
                            </td>
                            <td>
                              <div className="data-table__cell-actions">
                                <button
                                  type="button"
                                  className="icon-btn"
                                  onClick={() => {
                                    setEditingOffer(offer);
                                    setShowOfferForm(true);
                                  }}
                                  aria-label="edit"
                                >
                                  <EditIcon size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="icon-btn"
                                  onClick={() => handleDeleteOffer(offer.id)}
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
                </>
              ) : (
                <div className="content-card">
                  <OfferCMSForm
                    existingOffer={editingOffer}
                    centers={centers}
                    onSaved={() => {
                      setShowOfferForm(false);
                      loadOffers();
                    }}
                    onCancel={() => setShowOfferForm(false)}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'centers' && (
            <CenterManagerTable
              centers={centers}
              onToggleActive={handleToggleCenter}
              onEdit={() => {}}
              onDelete={handleDeleteCenter}
              onAddNew={() => {}}
            />
          )}

          {activeTab === 'prizes' && <PrizeEnginePanel prizes={prizes} onPrizesChanged={loadPrizes} />}
        </>
      )}
    </div>
  );
}
