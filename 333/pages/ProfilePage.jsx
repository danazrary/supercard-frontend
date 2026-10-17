/**
 * ============================================================================
 * File: src/pages/ProfilePage.jsx
 * Description: Customer profile screen. Displays the metallic VIP
 *              CustomerQRCard, a checklist of remaining vs. used perks
 *              across the four partner centers, and (if the card is active
 *              and the gift box hasn't been claimed yet) the C-BOX launcher
 *              button that opens GiftBoxModal.
 * Usage / Imported By: App.jsx route "/profile" (wrapped in ProtectedRoute
 *                       with allowedRole="customer")
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import CustomerQRCard from '../components/customer/CustomerQRCard';
import GiftBoxModal from '../components/customer/GiftBoxModal';
import Button from '../components/common/Button/Button';
import { getOffers } from '../services/offerService';
import { GiftBoxIcon, CheckIcon } from '../assets/icons';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [perks, setPerks] = useState([]);
  const [isLoadingPerks, setIsLoadingPerks] = useState(true);
  const [isGiftBoxOpen, setIsGiftBoxOpen] = useState(false);
  const [wonPrize, setWonPrize] = useState(user?.wonPrize || null);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPerks(true);

    getOffers()
      .then((offers) => {
        if (!cancelled) setPerks(offers);
      })
      .catch(() => {
        if (!cancelled) setPerks([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPerks(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleClaimed = useCallback((prize) => {
    setWonPrize(prize);
  }, []);

  const showGiftBoxLauncher = user?.cardActive && !wonPrize;

  return (
    <div className="container section page-with-bottom-nav">
      <h1 className="text-h2" style={{ marginBottom: 20 }}>
        {t('profile.title')}
      </h1>

      <CustomerQRCard
        cardCode={user?.cardCode}
        isActive={!!user?.cardActive}
        customerName={user?.name}
      />

      {showGiftBoxLauncher && (
        <Button
          fullWidth
          icon={<GiftBoxIcon size={20} />}
          style={{ marginTop: 20 }}
          onClick={() => setIsGiftBoxOpen(true)}
        >
          {t('profile.giftBoxButton')}
        </Button>
      )}

      {wonPrize && (
        <div className="content-card" style={{ marginTop: 20, textAlign: 'center' }}>
          <p className="text-sm text-muted">{t('giftBox.prizeClaimed')}</p>
          <p className="text-h3 text-gold-gradient" style={{ marginTop: 4 }}>
            {wonPrize.name}
          </p>
        </div>
      )}

      <h2 className="text-h3" style={{ margin: '28px 0 12px' }}>
        {t('profile.remainingPerks')}
      </h2>

      {isLoadingPerks ? (
        <div className="skeleton" style={{ height: 120 }} />
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {perks.map((perk) => (
            <li
              key={perk.id}
              className="content-card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
            >
              <div>
                <p className="text-semibold">{perk.centerName}</p>
                <p className="text-sm text-muted">{perk.title}</p>
              </div>
              <CheckIcon size={22} color="var(--color-success, #10b981)" />
            </li>
          ))}
        </ul>
      )}

      <GiftBoxModal
        isOpen={isGiftBoxOpen}
        onClose={() => setIsGiftBoxOpen(false)}
        onClaimed={handleClaimed}
      />
    </div>
  );
}
