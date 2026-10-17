/**
 * ============================================================================
 * File: src/pages/HomePage.jsx
 * Description: Public customer landing page. Renders the hero section
 *              (brand title, price, buy CTA), the offers grid (9:16 cards
 *              fetched via offerService), and orchestrates the full purchase
 *              funnel: AuthBuyModal (phone/OTP) -> FibPaymentModal (payment)
 *              -> redirect to /profile for the gift box reveal. Also renders
 *              OfferDetailModal when an offer card is tapped, and the
 *              floating BottomNav.
 * Usage / Imported By: App.jsx route "/" (public)
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import useAuth from '../hooks/useAuth';
import BottomNav from '../components/layout/BottomNav';
import AuthBuyModal from '../components/customer/AuthBuyModal';
import FibPaymentModal from '../components/customer/FibPaymentModal';
import OfferDetailModal from '../components/customer/OfferDetailModal';
import Badge from '../components/common/Badge/Badge';
import { getOffers } from '../services/offerService';
import { formatCurrencyIQD } from '../utils/formatters';
import { SUPER_CARD_PRICE_IQD } from '../utils/constants';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { isCustomer, user } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getOffers()
      .then((data) => {
        if (!cancelled) setOffers(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOffers(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuyCardClick = useCallback(() => {
    if (isCustomer && user?.cardActive) {
      navigate('/profile');
      return;
    }
    if (isCustomer) {
      setIsPaymentModalOpen(true);
      return;
    }
    setIsAuthModalOpen(true);
  }, [isCustomer, user, navigate]);

  function handleAuthVerified() {
    setIsAuthModalOpen(false);
    setIsPaymentModalOpen(true);
  }

  function handlePaymentSuccess() {
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      navigate('/profile');
    }, 1200);
  }

  return (
    <div className="screen page-with-bottom-nav">
      <section className="section" style={{ textAlign: 'center', paddingTop: 48 }}>
        <h1 className="text-h1 text-gold-gradient">{t('home.heroTitle')}</h1>
        <p className="text-body" style={{ margin: '12px auto 20px', maxWidth: 320 }}>
          {t('home.heroSubtitle')}
        </p>

        <p className="text-sm text-muted">{t('home.priceLabel')}</p>
        <p className="price-display">{formatCurrencyIQD(SUPER_CARD_PRICE_IQD, language)}</p>

        <button type="button" className="btn btn--primary btn--lg" style={{ marginTop: 20 }} onClick={handleBuyCardClick}>
          {t('home.ctaButton')}
        </button>

        <p className="text-sm text-cyan" style={{ marginTop: 16 }}>
          {t('home.giftBoxTeaser')}
        </p>
      </section>

      <section className="section">
        <h2 className="text-h3" style={{ marginBottom: 16 }}>
          {t('home.offersTitle')}
        </h2>

        {isLoadingOffers ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton offer-card__image-wrap" />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card" onClick={() => setSelectedOfferId(offer.id)}>
                <div className="offer-card__image-wrap">
                  <img src={offer.imageUrl} alt={offer.title} className="offer-card__image" />
                  <div className="offer-card__badges">
                    {offer.isFree ? (
                      <Badge variant="free">{t('offer.freeService')}</Badge>
                    ) : (
                      <Badge variant="discount">{offer.discountPercent}%</Badge>
                    )}
                  </div>
                  <div className="offer-card__gradient-overlay" />
                  <div className="offer-card__content">
                    <span className="offer-card__title">{offer.title}</span>
                    <span className="offer-card__center-name">{offer.centerName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav onBuyCardClick={handleBuyCardClick} />

      <AuthBuyModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onVerified={handleAuthVerified} />
      <FibPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <OfferDetailModal
        isOpen={!!selectedOfferId}
        onClose={() => setSelectedOfferId(null)}
        offerId={selectedOfferId}
      />
    </div>
  );
}
