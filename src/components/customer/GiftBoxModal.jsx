/**
 * ============================================================================
 * File: src/components/customer/GiftBoxModal.jsx
 * Description: 3-step C-BOX lottery reveal modal: Closed Chest -> Shake -> Won Prize.
 * Usage / Imported By: ProfilePage, HomePage.
 * ============================================================================
 */

import React from "react";
import Modal from "../common/Modal/Modal";
import Button from "..//common/Button/Button";
import useGiftLottery from "../../hooks/useGiftLottery";
import useLanguage from "../../hooks/useLanguage";
import { IMAGES } from "../../assets/images";
import { SparklesIcon } from "../../assets/icons";

export default function GiftBoxModal({ isOpen, onClose, cardId }) {
  const { t, locale } = useLanguage();
  const {
    step,
    wonPrize,
    triggerOpenBox,
    resetLottery,
    isShaking,
    isOpening,
    isRevealed,
  } = useGiftLottery();

  const handleClose = () => {
    resetLottery();
    onClose();
  };

  const prizeName = wonPrize
    ? locale === "ku"
      ? wonPrize.nameKu
      : locale === "ar"
        ? wonPrize.nameAr
        : wonPrize.nameEn
    : "";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("lottery.box_title")}>
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        {!isRevealed ? (
          <div>
            <div
              style={{
                width: "180px",
                height: "180px",
                margin: "0 auto 20px",
                animation: isShaking
                  ? "chest-shake 0.5s infinite"
                  : "gold-pulse 2s infinite",
              }}
            >
              <img
                src={
                  isOpening ? IMAGES.GOLD_CHEST_OPEN : IMAGES.GOLD_CHEST_CLOSED
                }
                alt="Luxury Chest"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "0.95rem",
                marginBottom: "20px",
              }}
            >
              {isShaking
                ? t("lottery.shaking_text")
                : isOpening
                  ? t("lottery.opening_text")
                  : t("lottery.box_subtitle")}
            </p>
            {step === "IDLE" && (
              <Button
                variant="gold"
                fullWidth
                onClick={() => triggerOpenBox(cardId)}
              >
                ⚡ {t("lottery.claim_btn")}
              </Button>
            )}
          </div>
        ) : (
          <div style={{ animation: "fade-in-scale 0.5s ease-out" }}>
            <SparklesIcon size={48} color="#ffc800" />
            <h3 style={{ color: "#00e5c9", margin: "12px 0 6px" }}>
              {t("lottery.won_title")}
            </h3>
            <h2
              style={{
                color: "#ffc800",
                fontSize: "1.6rem",
                marginBottom: "12px",
              }}
            >
              {prizeName}
            </h2>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "0.85rem",
                marginBottom: "24px",
              }}
            >
              {t("lottery.congratulations")}
            </p>
            <Button variant="gold" fullWidth onClick={handleClose}>
              {t("lottery.claim_reward_btn")}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
