/**
 * ============================================================================
 * File: src/components/customer/OfferDetailModal.jsx
 * Description: Modal displaying clinic perks, Google map location, terms, and WhatsApp.
 * Usage / Imported By: HomePage, ProfilePage.
 * ============================================================================
 */

import React from "react";
import Modal from "../common/Modal/Modal";
import Button from "..//common/Button/Button";
import Badge from "..//common/Badge/Badge";
import { WhatsAppIcon } from "../../assets/icons";
import useLanguage from "../../hooks/useLanguage";

export default function OfferDetailModal({ isOpen, onClose, offer }) {
  const { locale } = useLanguage();
  if (!offer) return null;

  const title =
    locale === "ku"
      ? offer.titleKu
      : locale === "ar"
        ? offer.titleAr
        : offer.titleEn;
  const centerName =
    locale === "ku" ? offer.centerNameKu || offer.centerName : offer.centerName;

  const handleWhatsApp = () => {
    const phone = offer.phone?.replace(/\D/g, "") || "9647503776072";
    window.open(
      `https://wa.me/${phone}?text=Hello, I am asking about Super Card offer: ${title}`,
      "_blank",
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={centerName}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <img
          src={offer.imageUrl}
          alt={title}
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <Badge variant="cyan">١٠٠٪ بەخۆڕایی</Badge>
          <Badge variant="gold">{offer.discountRate}% داشکاندنی بەردەوام</Badge>
        </div>
        <h4 style={{ color: "#fff", fontSize: "1.1rem", margin: 0 }}>
          {title}
        </h4>
        <p style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
          📍 {offer.location}
        </p>
        <Button
          variant="gold"
          fullWidth
          icon={<WhatsAppIcon size={18} />}
          onClick={handleWhatsApp}
        >
          پەیوەندی لە ڕێگەی واتسئەپ
        </Button>
      </div>
    </Modal>
  );
}
