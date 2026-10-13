/**
 * ============================================================================
 * File: src/hooks/useGiftLottery.js
 * Description: Finite state machine hook managing "C-BOX Luxury Black & Gold"
 *              chest opening animation phases: IDLE -> SHAKING -> OPENING -> REVEALED.
 * Usage / Imported By: GiftBoxModal, ProfilePage.
 * ============================================================================
 */

import { useState, useCallback } from "react";
import * as prizeService from "../services/prizeService";

export default function useGiftLottery() {
  const [step, setStep] = useState("IDLE"); // IDLE | SHAKING | OPENING | REVEALED | ERROR
  const [wonPrize, setWonPrize] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerOpenBox = useCallback(async (cardId) => {
    setErrorMessage("");
    setStep("SHAKING");

    // 1. Initiate luxury golden chest shake animation (1.8s)
    setTimeout(async () => {
      setStep("OPENING");

      try {
        // 2. Perform zero-trust backend claim
        const response = await prizeService.openGiftBox(cardId);

        // 3. Reveal stage after light explosion animation (1.2s)
        setTimeout(() => {
          setWonPrize(response.prize);
          setStep("REVEALED");
        }, 1200);
      } catch (err) {
        setStep("ERROR");
        setErrorMessage(err.message || "Unable to open mystery box.");
      }
    }, 1800);
  }, []);

  const resetLottery = useCallback(() => {
    setStep("IDLE");
    setWonPrize(null);
    setErrorMessage("");
  }, []);

  return {
    step,
    wonPrize,
    errorMessage,
    triggerOpenBox,
    resetLottery,
    isShaking: step === "SHAKING",
    isOpening: step === "OPENING",
    isRevealed: step === "REVEALED",
  };
}
