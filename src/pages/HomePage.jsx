import React, { useState, useCallback } from "react";

import Header from "../components/layout/Header";
import BottomNav from "../components/layout/BottomNav";
import HeroBio from "../components/customer/HeroBio";
import InstantPrizeBanner from "../components/customer/InstantPrizeBanner";
import OfferCard916 from "../components/customer/OfferCard916";
import WhatsAppCTA from "../components/customer/WhatsAppCTA";

import "./_home-page.scss";

// ---------------------------------------------------------------------------
// Mock data: 4 Erbil centers participating in the Super Card offer network.
// Replace `image` with real asset URLs/imports when available.
// ---------------------------------------------------------------------------
const OFFERS = [
  {
    id: "kurd-smile-dental",
    title: "سەنتەری کورد سمایل",
    categoryTag: "ددان • تایبەت",
    highlightTag: "1st OFFER • بە خۆڕایی FREE",
    image: null,
    services: [
      { id: "scaling", label: "خاوێنکردنەوەی ددان بە خۆڕایی", included: true },
      { id: "checkup", label: "پشکنینی گشتی", included: true },
      { id: "discount", label: "15% داشکاندن", included: true },
    ],
  },
  {
    id: "guli-bahasht-beauty",
    title: "سەنتەری گوڵی بەهەشت",
    categoryTag: "جوانکاری • تایبەت",
    highlightTag: "2nd OFFER • بە خۆڕایی FREE",
    image: null,
    services: [
      { id: "facial", label: "پاککردنەوەی ڕوخسار بە خۆڕایی", included: true },
      { id: "consult", label: "ڕاوێژکاری پێستی ڕوخسار", included: true },
      { id: "discount", label: "15% داشکاندن", included: true },
    ],
  },
  {
    id: "laser-center",
    title: "سەنتەری لەیزەر",
    categoryTag: "لەیزەر • تایبەت",
    highlightTag: "3rd OFFER • بە خۆڕایی FREE",
    image: null,
    services: [
      { id: "session", label: "یەک سیشنی لەیزەر بە خۆڕایی", included: true },
      { id: "checkup", label: "پشکنینی پێست", included: true },
      { id: "discount", label: "15% داشکاندن", included: true },
    ],
  },
  {
    id: "fourth-center",
    title: "سەنتەری چوارەم",
    categoryTag: "خزمەتگوزاری • تایبەت",
    highlightTag: "4th OFFER • بە خۆڕایی FREE",
    image: null,
    services: [
      { id: "service", label: "خزمەتگوزاری سەرەکی بە خۆڕایی", included: true },
      { id: "checkup", label: "پشکنینی سەرەتایی", included: true },
      { id: "discount", label: "15% داشکاندن", included: true },
    ],
  },
];

const HomePage = () => {
  const [activeNavKey, setActiveNavKey] = useState("home");
  const [isAuthenticated] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const handleNavigate = useCallback((key, meta) => {
    if (meta?.requiresAuth) {
      // Placeholder: route to login/auth flow before granting access.
      // eslint-disable-next-line no-console
      console.log(`[auth required] blocked navigation to "${key}"`);
      return;
    }
    setActiveNavKey(key);
  }, []);

  const handleBuyCard = useCallback(() => {
    // Placeholder: opens the purchase modal/flow.
    setIsBuyModalOpen(true);
  }, []);

  const handleOfferDetail = useCallback((offer) => {
    // Placeholder: route to a full offer detail page/modal.
    // eslint-disable-next-line no-console
    console.log("[offer detail]", offer.id);
  }, []);

  const handleMenuClick = useCallback(() => {
    // Placeholder: opens a side menu / drawer.
    // eslint-disable-next-line no-console
    console.log("[menu] opened");
  }, []);

  return (
    <div className="sc-home-page" dir="rtl">
     <Header onMenuClick={handleMenuClick} />

      <main className="sc-home-page__content">
        <HeroBio />

        <InstantPrizeBanner />

        <section
          className="sc-home-page__offers"
          aria-label="ئۆفەرە تایبەتەکان"
        >
          <h2 className="sc-home-page__section-title">ئۆفەرە تایبەتەکان</h2>

          <div className="sc-home-page__offers-scroll">
            {OFFERS.map((offer) => (
              <OfferCard916
                key={offer.id}
                offer={offer}
                onDetailClick={handleOfferDetail}
              />
            ))}
          </div>
        </section>

        <WhatsAppCTA />
      </main>

      <BottomNav
        activeKey={activeNavKey}
        isAuthenticated={isAuthenticated}
        onNavigate={handleNavigate}
        onBuyCard={handleBuyCard}
      /> 

      {isBuyModalOpen && (
        <div
          className="sc-home-page__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="کڕینی سوپەر کارت"
          onClick={() => setIsBuyModalOpen(false)}
        >
          <div
            className="sc-home-page__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>کڕینی سوپەر کارت</h3>
            <p>
              ئەم بەشە placeholder ـە بۆ modal ی کڕینی کارت — دواتر پەیوەندی بە
              پەرۆسەی پارەدان بکرێت.
            </p>
            <button type="button" onClick={() => setIsBuyModalOpen(false)}>
              داخستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
