/**
 * ============================================================================
 * File: src/components/customer/OfferDetailModal.jsx
 * Description: Displays full detail for a single partner-center offer:
 *              9:16 hero image, FREE/discount badge, description, terms &
 *              conditions, center location, and a one-tap WhatsApp contact
 *              button. Fetches the detailed offer record by ID on open
 *              (the landing page grid only carries summary fields).
 * Usage / Imported By: pages/HomePage.jsx
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import Badge from '../common/Badge/Badge';
import Button from '../common/Button/Button';
import useLanguage from '../../hooks/useLanguage';
import { getOfferById } from '../../services/offerService';
import { WhatsAppIcon, LocationIcon } from '../../assets/icons';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string|null} props.offerId - Offer UUID to fetch detail for
 */
export default function OfferDetailModal({ isOpen, onClose, offerId }) {
  const { t } = useLanguage();
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isOpen || !offerId) {
      setOffer(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    getOfferById(offerId)
      .then((data) => {
        if (!cancelled) setOffer(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, offerId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={offer?.title || t('offer.viewDetails')} sheet>
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div className="spinner" />
        </div>
      )}

      {loadError && (
        <p className="field__error text-center" style={{ padding: '24px 0' }}>
          {loadError}
        </p>
      )}

      {offer && !isLoading && (
        <div>
          <div className="offer-card__image-wrap" style={{ marginBottom: 16, maxWidth: 220, margin: '0 auto 16px' }}>
            <img src={offer.imageUrl} alt={offer.title} className="offer-card__image" />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
            {offer.isFree ? (
              <Badge variant="free">{t('offer.freeService')}</Badge>
            ) : (
              <Badge variant="discount">
                {t('offer.discountUpTo')} {offer.discountPercent}%
              </Badge>
            )}
            <Badge variant="category">{offer.category}</Badge>
          </div>

          <p className="text-body" style={{ marginBottom: 16 }}>
            {offer.description}
          </p>

          {offer.terms && (
            <div className="content-card" style={{ marginBottom: 16 }}>
              <h4 className="text-h4" style={{ marginBottom: 8 }}>
                {t('offer.terms')}
              </h4>
              <p className="text-sm text-muted">{offer.terms}</p>
            </div>
          )}

          {offer.center && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
              <LocationIcon size={20} color="var(--color-accent-cyan, #00e5c9)" />
              <div>
                <p className="text-semibold">{offer.center.name}</p>
                <p className="text-sm text-muted">{offer.center.address}</p>
              </div>
            </div>
          )}

          {offer.center?.whatsapp && (
            <Button
              variant="whatsapp"
              fullWidth
              icon={<WhatsAppIcon size={20} />}
              href={`https://wa.me/${offer.center.whatsapp.replace('+', '')}`}
            >
              {t('offer.contactWhatsapp')}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
}
