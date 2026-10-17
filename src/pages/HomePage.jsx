/**
 * ============================================================================
 * File: src/pages/HomePage.jsx
 * Description: Home Page featuring Compact Colored Boxes (Name, Offer Count +
 *              Gift, Mini Turquoise Gift Icons, and "زانیاری زیاتر" button)
 *              plus the 3:4 Offers Grid.
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeroBio from "../components/customer/HeroBio";
import WhatsAppCTA from "../components/customer/WhatsAppCTA";
import GiftSvgIcon from "../components/common/GiftSvgIcon";
import useLanguage from "../hooks/useLanguage";
import api from "../services/api";
import "../styles/components/_box-system.scss";
import "./_home-page.scss";

const BACKEND_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export const resolveAssetUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  return `${BACKEND_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

const HOME_TEXTS = {
  ku: {
    boxes_heading: "پاکێج و بۆکسەکانی سوپەر کارت",
    offers_unit: "ئۆفەر",
    plus_gift: "+ دیاری",
    more_info_btn: "زانیاری زیاتر",
    all_offers_title: "ئۆفەرە تایبەتەکان",
    currency: "د.ع",
    close_btn: "داخستن",
  },
  ar: {
    boxes_heading: "باقات وصناديق سوبر كارد",
    offers_unit: "عروض",
    plus_gift: "+ هدية",
    more_info_btn: "معلومات أكثر",
    all_offers_title: "العروض الخاصة",
    currency: "د.ع",
    close_btn: "إغلاق",
  },
  en: {
    boxes_heading: "Super Card Packages & Boxes",
    offers_unit: "Offers",
    plus_gift: "+ Gift",
    more_info_btn: "More Info",
    all_offers_title: "Featured Offers",
    currency: "IQD",
    close_btn: "Close",
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const langHook = useLanguage();
  const activeLang = langHook?.language || langHook?.locale || "ku";
  const tr = (k) => HOME_TEXTS[activeLang]?.[k] || HOME_TEXTS.ku[k] || k;

  const [offers, setOffers] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [heroStats, setHeroStats] = useState({
    activeCentersCount: 4,
    freeGuarantee: "100%",
    paymentGateway: "FIB",
  });

  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [selectedOfferModal, setSelectedOfferModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/offers");
      const loadedOffers = res.offers || [];
      const loadedBoxes = res.boxes || [];
      const loadedGifts = res.gifts || [];

      setOffers(loadedOffers);
      setGifts(loadedGifts);

      if (loadedBoxes.length > 0) {
        setBoxes(loadedBoxes);
      } else {
        setBoxes([
          {
            id: 1,
            planName: "SUPER CARD VIP",
            boxColor: "#00e5c9",
            titles: {
              ku: "بۆکسی سوپەر کارت VIP",
              ar: "صندوق سوبر كارد VIP",
              en: "SUPER CARD VIP BOX",
            },
            basePrice: 25000,
            finalPrice: 25000,
            includesGiftBox: true,
            maxOffersCount: loadedOffers.length,
            includedOffers: [],
          },
        ]);
      }

      if (res.heroStats) setHeroStats(res.heroStats);
    } catch (err) {
      console.error("Failed to fetch home data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const getLocalized = (obj, fallback = "") => {
    if (!obj) return fallback;
    return obj[activeLang] || obj.ku || obj.en || obj.ar || fallback;
  };

  const handlePrevBox = () => {
    if (boxes.length <= 1) return;
    setActiveBoxIndex((prev) => (prev - 1 + boxes.length) % boxes.length);
  };

  const handleNextBox = () => {
    if (boxes.length <= 1) return;
    setActiveBoxIndex((prev) => (prev + 1) % boxes.length);
  };

  return (
    <div className="sc-home-page" dir={activeLang === "en" ? "ltr" : "rtl"}>
      <main className="sc-home-page__content">
        <HeroBio stats={heroStats} />

        {/* ================================================================
            ١. بەشی بۆکسە بچووکە ڕەنگاوڕەنگەکان (Compact Colored Boxes)
           ================================================================ */}
        {boxes.length > 0 && (
          <section className="sc-compact-boxes-section">
            <div className="sc-compact-boxes__header">
              <h2 className="sc-home-page__section-title">
                {tr("boxes_heading")}
              </h2>

              {boxes.length > 1 && (
                <div className="sc-compact-boxes__nav" dir="ltr">
                  <button
                    type="button"
                    className="sc-compact-boxes__arrow"
                    onClick={handlePrevBox}
                    aria-label="Previous"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <span className="sc-compact-boxes__counter">
                    {activeBoxIndex + 1} / {boxes.length}
                  </span>
                  <button
                    type="button"
                    className="sc-compact-boxes__arrow"
                    onClick={handleNextBox}
                    aria-label="Next"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="sc-compact-boxes__grid">
              {boxes.map((box, idx) => {
                const boxTitle = getLocalized(box.titles, box.planName);
                const offersCount =
                  box.maxOffersCount > 0
                    ? box.maxOffersCount
                    : Array.isArray(box.includedOffers) &&
                        box.includedOffers.length > 0
                      ? box.includedOffers.length
                      : offers.length;
                const borderColor = box.boxColor || "#00e5c9";
                const isFocused = idx === activeBoxIndex;

                // فلتەرکردنی دیارییەکانی تایبەت بەم بۆکسە
                const boxGifts =
                  Array.isArray(box.includedGifts) &&
                  box.includedGifts.length > 0
                    ? gifts.filter((g) => box.includedGifts.includes(g.id))
                    : gifts;

                return (
                  <div
                    key={box.id}
                    className={`sc-compact-box ${isFocused ? "is-focused" : ""}`}
                    style={{
                      "--box-accent-color": borderColor,
                    }}
                    onClick={() => navigate(`/box/${box.id}`)}
                  >
                    <div className="sc-compact-box__top">
                      <h3 className="sc-compact-box__title">{boxTitle}</h3>
                      <span className="sc-compact-box__summary-pill">
                        {offersCount} {tr("offers_unit")}{" "}
                        {box.includesGiftBox ? tr("plus_gift") : ""}
                      </span>
                    </div>

                    {box.includesGiftBox && boxGifts.length > 0 && (
                      <div className="sc-compact-box__mini-gifts">
                        {boxGifts.slice(0, 5).map((g) => {
                          const giftTitle = getLocalized(g.names, g.giftName);
                          return (
                            <div
                              key={g.id}
                              className="sc-compact-box__mini-gift-item"
                              title={giftTitle}
                            >
                              <div className="sc-compact-box__mini-gift-icon">
                                <GiftSvgIcon
                                  iconType={g.iconType}
                                  svgName={g.svgIconName}
                                  imageUrl={resolveAssetUrl(g.imageUrl)}
                                  alt={giftTitle}
                                  size={22}
                                />
                              </div>
                              <span className="sc-compact-box__mini-gift-name">
                                {giftTitle}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="sc-compact-box__footer">
                      <div className="sc-compact-box__price-wrap">
                        {box.hasActiveDiscount &&
                          box.basePrice !== box.finalPrice && (
                            <del className="sc-compact-box__old-price">
                              {Number(box.basePrice).toLocaleString()}
                            </del>
                          )}
                        <strong className="sc-compact-box__price">
                          {Number(box.finalPrice).toLocaleString()}{" "}
                          <small>{tr("currency")}</small>
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="sc-compact-box__more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/box/${box.id}`);
                        }}
                      >
                        <span>{tr("more_info_btn")}</span>
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                        >
                          <polyline
                            points={
                              activeLang === "en"
                                ? "9 18 15 12 9 6"
                                : "15 18 9 12 15 6"
                            }
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================================================================
            ٢. بەشی کارتی ئۆفەرەکان بە قەبارەی 3:4
           ================================================================ */}
        <section className="sc-home-page__offers">
          <div className="sc-home-page__section-header">
            <h2 className="sc-home-page__section-title">
              {tr("all_offers_title")} ({offers.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="sc-home-page__loading-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="sc-home-page__skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="sc-home-page__offers-grid">
              {offers.map((offer, idx) => {
                const imgUrl = resolveAssetUrl(offer.imageUrl);
                const hasBg = Boolean(offer.hasTextBg);

                return (
                  <article
                    key={offer.id}
                    className="sc-home-page__offer-card34"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    onClick={() => setSelectedOfferModal(offer)}
                  >
                    <div className="sc-home-page__offer-stage">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={getLocalized(offer.titles, offer.title)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="sc-home-page__offer-placeholder">
                          SUPER CARD
                        </div>
                      )}

                      <div className="sc-home-page__offer-shade" />

                      <div className="sc-home-page__offer-top-badges">
                        <span
                          className={`sc-home-page__left-work-tag ${
                            hasBg ? "has-bg" : "no-bg"
                          }`}
                        >
                          {getLocalized(offer.leftBadges, offer.leftBadge)}
                        </span>

                        <span className="sc-home-page__right-discount-badge">
                          {getLocalized(
                            offer.rightBadges,
                            offer.rightBadge || "FREE 100%",
                          )}
                        </span>
                      </div>

                      <div className="sc-home-page__offer-center-overlay">
                        <div
                          className={`sc-home-page__center-name-en ${
                            hasBg ? "has-bg" : "no-bg"
                          }`}
                        >
                          {offer.centerNameEn}
                        </div>

                        <div
                          className={`sc-home-page__overlay-title ${
                            hasBg ? "has-bg" : "no-bg"
                          }`}
                        >
                          {getLocalized(offer.titles, offer.title)}
                        </div>
                      </div>

                      {Array.isArray(offer.features) &&
                        offer.features.length > 0 && (
                          <div
                            className="sc-home-page__features-strip"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {offer.features.map((feat, i) => {
                              const text =
                                feat[activeLang] ||
                                feat.ku ||
                                feat.en ||
                                feat.ar;
                              if (!text) return null;
                              return (
                                <span
                                  key={feat.id || i}
                                  className="sc-home-page__feature-pill"
                                >
                                  ✓ {text}
                                </span>
                              );
                            })}
                          </div>
                        )}
                    </div>

                    <div className="sc-home-page__offer-outside-bottom">
                      <p className="sc-home-page__offer-desc">
                        {getLocalized(offer.descriptions, offer.description)}
                      </p>

                      <div className="sc-home-page__offer-meta">
                        <div className="sc-home-page__meta-details">
                          <span>
                            📍 {getLocalized(offer.locations, "هەولێر")}
                          </span>
                          <span dir="ltr">📞 {offer.phone}</span>
                        </div>

                        <div className="sc-home-page__price-badge">
                          {Number(offer.price || 7000).toLocaleString()}{" "}
                          {tr("currency")}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <WhatsAppCTA />
      </main>

      {selectedOfferModal && (
        <div
          className="sc-home-page__modal-backdrop"
          onClick={() => setSelectedOfferModal(null)}
        >
          <div
            className="sc-home-page__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#ffc800", marginTop: 0 }}>
              {selectedOfferModal.centerNameEn}
            </h3>
            <h4 style={{ color: "#00e5c9", margin: "6px 0" }}>
              {getLocalized(
                selectedOfferModal.titles,
                selectedOfferModal.title,
              )}
            </h4>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              {getLocalized(
                selectedOfferModal.descriptions,
                selectedOfferModal.description,
              )}
            </p>
            <button type="button" onClick={() => setSelectedOfferModal(null)}>
              {tr("close_btn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
