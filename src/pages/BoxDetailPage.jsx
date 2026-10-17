/**
 * ============================================================================
 * File: src/pages/BoxDetailPage.jsx
 * Description: Box Detail Page where ALL elements adapt to the Box's Custom
 *              Color, Gifts circle continuously from Left to Right with center
 *              scaling, and clicking any Offer opens its full 3:4 Detail Modal.
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GiftSvgIcon from "../components/common/GiftSvgIcon";
import AuthBuyModal from "../components/customer/AuthBuyModal";
import useLanguage from "../hooks/useLanguage";
import useAuth from "../hooks/useAuth";
import useFibPayment from "../hooks/useFibPayment";
import api from "../services/api";
import { resolveAssetUrl } from "./HomePage";
import "../styles/components/_box-system.scss";
import "./_home-page.scss";

const DETAIL_TEXTS = {
  ku: {
    back_btn: "گەڕانەوە بۆ پەڕەی سەرەکی",
    default_desc:
      "بە کڕینی ئەم بۆکسە دەستبەجێ مافی بەکارهێنانی ئەم ئۆفەرانەی خوارەوەت دەبێت لەگەڵ بردنەوەی دیارییەکی مسۆگەر.",
    offers_heading: "ئۆفەرەکانی ناو ئەم بۆکسە (کلیک بکە بۆ بینینی وردەکاری)",
    gifts_heading: "دیارییەکانی ناو بۆکس • ١٠٠٪ یەکێکیان دەبەیتەوە",
    discount_timer_title: "کاتی ماوە بۆ تەواوبوونی داشکاندن",
    days: "ڕۆژ",
    hours: "کاتژمێر",
    minutes: "خولەک",
    seconds: "چرکە",
    price_label: "نرخی بۆکس",
    buy_btn: "کڕینی ئەم بۆکسە",
    currency: "د.ع",
    close_btn: "داخستن",
    loading: "زانیارییەکانی بۆکس دەهێنرێت...",
  },
  ar: {
    back_btn: "العودة إلى الرئيسية",
    default_desc:
      "عند شراء هذا الصندوق ستحصل فوراً على جميع العروض أدناه بالإضافة إلى ربح هدية فورية مضمونة.",
    offers_heading: "العروض المشمولة في هذا الصندوق (اضغط للتفاصيل)",
    gifts_heading: "هدايا الصندوق • ستربح واحدة منها بنسبة 100%",
    discount_timer_title: "الوقت المتبقي لانتهاء الخصم",
    days: "يوم",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثانية",
    price_label: "سعر الصندوق",
    buy_btn: "شراء هذا الصندوق",
    currency: "د.ع",
    close_btn: "إغلاق",
    loading: "جاري تحميل تفاصيل الصندوق...",
  },
  en: {
    back_btn: "Back to Home",
    default_desc:
      "Purchasing this box unlocks all exclusive offers listed below plus a 100% guaranteed instant reward.",
    offers_heading: "Offers Included in This Box (Click to View Details)",
    gifts_heading: "Box Gifts • You Win One of These 100% Guaranteed",
    discount_timer_title: "Limited Discount Ends In",
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
    price_label: "Box Price",
    buy_btn: "Buy This Box Now",
    currency: "IQD",
    close_btn: "Close",
    loading: "Loading Box Details...",
  },
};

export default function BoxDetailPage() {
  const { boxId } = useParams();
  const navigate = useNavigate();

  const langHook = useLanguage();
  const activeLang = langHook?.language || langHook?.locale || "ku";
  const tr = (k) => DETAIL_TEXTS[activeLang]?.[k] || DETAIL_TEXTS.ku[k] || k;

  const { isAuthenticated, user } = useAuth();
  const { startPayment } = useFibPayment();

  const [box, setBox] = useState(null);
  const [offers, setOffers] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authBuyOpen, setAuthBuyOpen] = useState(false);

  // مۆداڵی بینینی تەواوی وردەکاریی ئۆفەر لە کاتی کلیککردن لەسەر sc-box-detail__offer-item
  const [selectedOfferDetail, setSelectedOfferDetail] = useState(null);

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    expired: false,
  });

  const giftsViewportRef = useRef(null);
  const [centerGiftKey, setCenterGiftKey] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/offers/boxes/${boxId}`);
        setBox(res.box || null);
        setOffers(res.offers || []);
        setGifts(res.gifts || []);
      } catch (err) {
        console.error("Failed to load box detail:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [boxId]);

  useEffect(() => {
    if (!box?.hasActiveDiscount || !box?.discountEndsAt) return;

    const updateTimer = () => {
      const endMs = new Date(box.discountEndsAt).getTime();
      const diff = endMs - Date.now();

      if (diff <= 0) {
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          expired: true,
        });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        expired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [box]);

  // دۆزینەوەی بەردەوامی ئەو دیارییەی کە لە ناوەڕاستی شاشەکەدایە لە کاتی سوڕانەوەدا
  const detectCenterGift = useCallback(() => {
    const viewport = giftsViewportRef.current;
    if (!viewport) return;

    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    const items = viewport.querySelectorAll("[data-gift-key]");
    let closestKey = null;
    let minDistance = Infinity;

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(viewportCenter - itemCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestKey = el.getAttribute("data-gift-key");
      }
    });

    setCenterGiftKey(closestKey);
  }, []);

  useEffect(() => {
    if (gifts.length === 0) return;
    let rafId;
    const loop = () => {
      detectCenterGift();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gifts.length, detectCenterGift]);

  const getLocalized = (obj, fallback = "") => {
    if (!obj) return fallback;
    return obj[activeLang] || obj.ku || obj.en || obj.ar || fallback;
  };

  const handleBuyBox = () => {
    if (isAuthenticated) {
      startPayment(user?.phoneNumber || user?.phone || "");
    } else {
      setAuthBuyOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="sc-box-detail-page" dir="rtl">
        <div className="sc-box-detail__loading">{tr("loading")}</div>
      </div>
    );
  }

  if (!box) return null;

  const boxTitle = getLocalized(box.titles, box.planName);
  const boxDesc = getLocalized(box.descriptions, "") || tr("default_desc");
  const accentColor = box.boxColor || "#00e5c9";

  // ئەگەر دیارییەکان زۆر بوون (زیاتر لە ٢ دانە)، بە شێوەی بازنەیی بێ وەستان لە چەپەوە بۆ ڕاست دەسوڕێنەوە
  const isAutoCircling = gifts.length > 2;
  const circlingGifts = isAutoCircling
    ? [...gifts, ...gifts, ...gifts, ...gifts]
    : gifts;

  return (
    <div
      className="sc-box-detail-page"
      dir={activeLang === "en" ? "ltr" : "rtl"}
      style={{ "--box-detail-color": accentColor }}
    >
      <div className="sc-box-detail__container">
        <button
          type="button"
          className="sc-box-detail__back-btn"
          onClick={() => navigate("/")}
        >
          <span>← {tr("back_btn")}</span>
        </button>

        <div className="sc-box-detail__card">
          <header className="sc-box-detail__header">
            <h1 className="sc-box-detail__title">{boxTitle}</h1>
            <p className="sc-box-detail__description">{boxDesc}</p>
          </header>

          {/* لیستی ئۆفەرەکان لە ڕاستەوە بۆ چەپ (کلیک لە هەر کامێکیان بکەیت وردەکارییەکەی دەکرێتەوە) */}
          <section className="sc-box-detail__offers-section" dir="rtl">
            <h3 className="sc-box-detail__sub-title">
              {tr("offers_heading")} ({offers.length})
            </h3>

            <div className="sc-box-detail__offers-rtl-list">
              {offers.map((offer, i) => {
                const offerTitle = getLocalized(offer.titles, offer.title);
                const badgeText = getLocalized(
                  offer.rightBadges,
                  offer.rightBadge || "FREE 100%",
                );
                const thumbUrl = resolveAssetUrl(offer.imageUrl);

                return (
                  <div
                    key={offer.id || i}
                    className="sc-box-detail__offer-item"
                    onClick={() => setSelectedOfferDetail(offer)}
                    role="button"
                    tabIndex={0}
                  >
                    {thumbUrl && (
                      <img
                        src={thumbUrl}
                        alt={offerTitle}
                        className="sc-box-detail__offer-thumb"
                      />
                    )}
                    <div className="sc-box-detail__offer-info">
                      <span className="sc-box-detail__offer-center">
                        {offer.centerNameEn}
                      </span>
                      <h4 className="sc-box-detail__offer-title">
                        {offerTitle}
                      </h4>
                      <span className="sc-box-detail__offer-badge">
                        {badgeText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* بەشی دیارییەکان: سوڕانەوەی بازنەیی لە چەپەوە بۆ ڕاست + گەورەبوونی نەرم لە ناوەڕاستدا */}
          {box.includesGiftBox && gifts.length > 0 && (
            <section className="sc-box-detail__gifts-section">
              <div className="sc-box-detail__gifts-pill">
                <span>{tr("gifts_heading")}</span>
              </div>

              <div
                ref={giftsViewportRef}
                dir="ltr"
                className={`sc-box-detail__gifts-viewport ${
                  isAutoCircling ? "is-auto-marquee" : "is-centered"
                }`}
              >
                <div className="sc-box-detail__gifts-track">
                  {circlingGifts.map((gift, idx) => {
                    const uniqueKey = `${gift.id}-${idx}`;
                    const isCenter =
                      !isAutoCircling || centerGiftKey === uniqueKey;
                    const giftTitle = getLocalized(gift.names, gift.giftName);

                    return (
                      <div
                        key={uniqueKey}
                        data-gift-key={uniqueKey}
                        className={`sc-box-detail__gift-card ${
                          isCenter ? "is-center-focused" : ""
                        }`}
                      >
                        <div className="sc-box-detail__gift-icon-box">
                          <GiftSvgIcon
                            iconType={gift.iconType}
                            svgName={gift.svgIconName}
                            imageUrl={resolveAssetUrl(gift.imageUrl)}
                            alt={giftTitle}
                            size={34}
                          />
                        </div>
                        <span className="sc-box-detail__gift-name">
                          {giftTitle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* تایمەری داشکاندن و کڕین */}
          <footer className="sc-box-detail__footer">
            {box.hasActiveDiscount && !countdown.expired && (
              <div className="sc-box-detail__countdown-box">
                <div className="sc-box-detail__countdown-header">
                  <span className="sc-box-detail__discount-badge">
                    🔥 {box.discountPercent}% OFF
                  </span>
                  <span>{tr("discount_timer_title")}</span>
                </div>

                <div className="sc-box-detail__timer-grid" dir="ltr">
                  <div className="sc-box-detail__timer-unit">
                    <strong>{countdown.days}</strong>
                    <small>{tr("days")}</small>
                  </div>
                  <span className="sc-box-detail__timer-sep">:</span>
                  <div className="sc-box-detail__timer-unit">
                    <strong>{countdown.hours}</strong>
                    <small>{tr("hours")}</small>
                  </div>
                  <span className="sc-box-detail__timer-sep">:</span>
                  <div className="sc-box-detail__timer-unit">
                    <strong>{countdown.minutes}</strong>
                    <small>{tr("minutes")}</small>
                  </div>
                  <span className="sc-box-detail__timer-sep">:</span>
                  <div className="sc-box-detail__timer-unit">
                    <strong>{countdown.seconds}</strong>
                    <small>{tr("seconds")}</small>
                  </div>
                </div>
              </div>
            )}

            <div className="sc-box-detail__purchase-bar">
              <div className="sc-box-detail__price-box">
                <span className="sc-box-detail__price-label">
                  {tr("price_label")}
                </span>
                <div className="sc-box-detail__price-values">
                  {box.hasActiveDiscount &&
                    box.basePrice !== box.finalPrice && (
                      <del className="sc-box-detail__old-price">
                        {Number(box.basePrice).toLocaleString()}
                      </del>
                    )}
                  <strong className="sc-box-detail__final-price">
                    {Number(box.finalPrice).toLocaleString()}{" "}
                    <small>{tr("currency")}</small>
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="sc-box-detail__buy-btn"
                onClick={handleBuyBox}
              >
                {tr("buy_btn")}
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* مۆداڵی بینینی تەواوی کارتی 3:4 و وردەکاریی ئۆفەر لە کاتی کلیککردن */}
      {selectedOfferDetail && (
        <div
          className="sc-box-detail__offer-modal-backdrop"
          onClick={() => setSelectedOfferDetail(null)}
        >
          <div
            className="sc-box-detail__offer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sc-box-detail__offer-modal-close"
              onClick={() => setSelectedOfferDetail(null)}
            >
              ✕
            </button>

            <article className="sc-home-page__offer-card34">
              <div className="sc-home-page__offer-stage">
                {resolveAssetUrl(selectedOfferDetail.imageUrl) ? (
                  <img
                    src={resolveAssetUrl(selectedOfferDetail.imageUrl)}
                    alt={getLocalized(
                      selectedOfferDetail.titles,
                      selectedOfferDetail.title,
                    )}
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
                      selectedOfferDetail.hasTextBg ? "has-bg" : "no-bg"
                    }`}
                  >
                    {getLocalized(
                      selectedOfferDetail.leftBadges,
                      selectedOfferDetail.leftBadge,
                    )}
                  </span>

                  <span
                    className="sc-home-page__right-discount-badge"
                    style={{ background: accentColor }}
                  >
                    {getLocalized(
                      selectedOfferDetail.rightBadges,
                      selectedOfferDetail.rightBadge || "FREE 100%",
                    )}
                  </span>
                </div>

                <div className="sc-home-page__offer-center-overlay">
                  <div
                    className={`sc-home-page__center-name-en ${
                      selectedOfferDetail.hasTextBg ? "has-bg" : "no-bg"
                    }`}
                  >
                    {selectedOfferDetail.centerNameEn}
                  </div>

                  <div
                    className={`sc-home-page__overlay-title ${
                      selectedOfferDetail.hasTextBg ? "has-bg" : "no-bg"
                    }`}
                  >
                    {getLocalized(
                      selectedOfferDetail.titles,
                      selectedOfferDetail.title,
                    )}
                  </div>
                </div>

                {Array.isArray(selectedOfferDetail.features) &&
                  selectedOfferDetail.features.length > 0 && (
                    <div className="sc-home-page__features-strip">
                      {selectedOfferDetail.features.map((feat, idx) => {
                        const text =
                          feat[activeLang] || feat.ku || feat.en || feat.ar;
                        if (!text) return null;
                        return (
                          <span
                            key={feat.id || idx}
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
                  {getLocalized(
                    selectedOfferDetail.descriptions,
                    selectedOfferDetail.description,
                  )}
                </p>

                <div className="sc-home-page__offer-meta">
                  <div className="sc-home-page__meta-details">
                    <span>
                      📍 {getLocalized(selectedOfferDetail.locations, "هەولێر")}
                    </span>
                    <span dir="ltr">📞 {selectedOfferDetail.phone}</span>
                  </div>

                  <div
                    className="sc-home-page__price-badge"
                    style={{ background: accentColor, color: "#060b13" }}
                  >
                    {Number(selectedOfferDetail.price || 7000).toLocaleString()}{" "}
                    {tr("currency")}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}

      <AuthBuyModal
        isOpen={authBuyOpen}
        onClose={() => setAuthBuyOpen(false)}
        onAuthSuccess={(phone) => startPayment(phone)}
      />
    </div>
  );
}
