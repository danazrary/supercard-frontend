/**
 * ============================================================================
 * File: src/hooks/useGiftLottery.js
 * Description: Drives the finite state machine behind the C-BOX gift reveal
 *              UX: closed -> shaking -> revealing -> revealed (or error).
 *              The actual prize draw is a single atomic server call
 *              (prizeService.openGiftBox); this hook purely orchestrates the
 *              client-side animation timing around that call so the reveal
 *              always feels deliberate (never instant) regardless of network
 *              latency, while remaining safe to call multiple times thanks
 *              to backend idempotency.
 * Usage / Imported By: components/customer/GiftBoxModal.jsx, pages/ProfilePage.jsx
 * ============================================================================
 */

import { useState, useCallback, useRef } from 'react';
import { openGiftBox } from '../services/prizeService';

export const BOX_STATES = {
  CLOSED: 'closed',
  SHAKING: 'shaking',
  REVEALING: 'revealing',
  REVEALED: 'revealed',
  ERROR: 'error',
};

const MIN_SHAKE_DURATION_MS = 1800;
const MIN_REVEAL_DURATION_MS = 1200;

export default function useGiftLottery() {
  const [boxState, setBoxState] = useState(BOX_STATES.CLOSED);
  const [prize, setPrize] = useState(null);
  const [error, setError] = useState(null);
  const isOpeningRef = useRef(false);

  const openBox = useCallback(async () => {
    if (isOpeningRef.current || boxState === BOX_STATES.REVEALED) return;
    isOpeningRef.current = true;
    setError(null);
    setBoxState(BOX_STATES.SHAKING);

    const shakeStart = Date.now();

    try {
      // Fire the authoritative server claim in parallel with the shake
      // animation so the UI never feels like it's "waiting on the network".
      const resultPromise = openGiftBox();

      const elapsedDuringShake = Date.now() - shakeStart;
      const remainingShakeTime = Math.max(0, MIN_SHAKE_DURATION_MS - elapsedDuringShake);
      await delay(remainingShakeTime);

      setBoxState(BOX_STATES.REVEALING);
      const revealStart = Date.now();

      const result = await resultPromise;

      const elapsedDuringReveal = Date.now() - revealStart;
      const remainingRevealTime = Math.max(0, MIN_REVEAL_DURATION_MS - elapsedDuringReveal);
      await delay(remainingRevealTime);

      setPrize(result.prize);
      setBoxState(BOX_STATES.REVEALED);
    } catch (err) {
      setError(err.message || 'Failed to open the gift box.');
      setBoxState(BOX_STATES.ERROR);
    } finally {
      isOpeningRef.current = false;
    }
  }, [boxState]);

  const reset = useCallback(() => {
    setBoxState(BOX_STATES.CLOSED);
    setPrize(null);
    setError(null);
  }, []);

  return {
    boxState,
    prize,
    error,
    openBox,
    reset,
    isShaking: boxState === BOX_STATES.SHAKING,
    isRevealing: boxState === BOX_STATES.REVEALING,
    isRevealed: boxState === BOX_STATES.REVEALED,
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
