/**
 * ============================================================================
 * File: src/components/customer/GiftBoxModal.jsx
 * Description: The "C-BOX" instant-lottery reveal experience. Renders the
 *              closed luxury black & gold chest, which on tap transitions
 *              through shaking -> lid-opening -> prize-reveal states driven
 *              by the useGiftLottery state machine (which performs the
 *              single atomic, idempotent server-side prize claim). Displays
 *              the won prize with a celebratory animation and a claim
 *              confirmation button.
 * Usage / Imported By: pages/ProfilePage.jsx (opened via the
 *                       "کردنەوەی سندوقی دیاری" button once a card is active)
 * ============================================================================
 */

import React, { useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import useLanguage from '../../hooks/useLanguage';
import useGiftLottery, { BOX_STATES } from '../../hooks/useGiftLottery';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} [props.onClaimed] - Called with the prize once claimed
 */
export default function GiftBoxModal({ isOpen, onClose, onClaimed }) {
  const { t } = useLanguage();
  const { boxState, prize, error, openBox, reset, isShaking, isRevealed } = useGiftLottery();

  useEffect(() => {
    if (!isOpen) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isRevealed && prize) {
      onClaimed && onClaimed(prize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, prize]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} bare closeOnBackdrop={boxState === BOX_STATES.CLOSED}>
      <div className="gift-box">
        {boxState !== BOX_STATES.REVEALED && (
          <>
            <h3 className="text-h3 text-gold-gradient">{t('giftBox.title')}</h3>
            <p className="text-sm text-muted">{t('giftBox.subtitle')}</p>
          </>
        )}

        <div className="gift-box__chest-wrap">
          {boxState === BOX_STATES.REVEALING && (
            <div className="gift-box__particles" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="gift-box__particle"
                  style={{
                    left: `${10 + i * 8}%`,
                    bottom: '30%',
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          )}

          {boxState !== BOX_STATES.REVEALED && (
            <button
              type="button"
              className={`gift-box__chest${isShaking ? ' gift-box__chest--shaking' : ''}`}
              onClick={boxState === BOX_STATES.CLOSED ? openBox : undefined}
              disabled={boxState !== BOX_STATES.CLOSED}
              aria-label={t('giftBox.tapToOpen')}
            >
              <div
                className={`gift-box__chest-lid${
                  boxState === BOX_STATES.REVEALING ? ' gift-box__chest-lid--open' : ''
                }`}
              />
              <div className="gift-box__chest-base" />
            </button>
          )}
        </div>

        {boxState === BOX_STATES.CLOSED && (
          <p className="gift-box__cta">{t('giftBox.tapToOpen')}</p>
        )}

        {isShaking && <p className="text-sm text-cyan">{t('giftBox.shaking')}</p>}

        {boxState === BOX_STATES.REVEALING && <p className="text-sm text-cyan">{t('giftBox.revealing')}</p>}

        {boxState === BOX_STATES.REVEALED && prize && (
          <div className="gift-box__prize-reveal">
            <p className="text-h2 text-gold-gradient">{t('giftBox.congrats')}</p>
            {prize.imageUrl && <img src={prize.imageUrl} alt={prize.name} className="gift-box__prize-image" />}
            <p className="gift-box__prize-name">
              {t('giftBox.youWon')} {prize.name}
            </p>
            <Button onClick={onClose}>{t('giftBox.claimPrize')}</Button>
          </div>
        )}

        {boxState === BOX_STATES.ERROR && (
          <div>
            <p className="field__error">{error}</p>
            <Button variant="secondary" onClick={reset} style={{ marginTop: 12 }}>
              {t('common.retry')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
