import React from "react";
import "./_instant-prize.scss";

const ICONS = [
  {
    key: "phone",
    label: "مۆبایل",
    svg: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
  {
    key: "cash",
    label: "پارە",
    svg: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: "headphones",
    label: "هێدفۆن",
    svg: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <rect x="2" y="14" width="5" height="7" rx="1.5" />
        <rect x="17" y="14" width="5" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    key: "smartwatch",
    label: "سمارت واچ",
    svg: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M9 7V4h6v3M9 17v3h6v-3" />
      </svg>
    ),
  },
  {
    key: "powerbank",
    label: "باتری",
    svg: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="4" y="3" width="12" height="18" rx="2" />
        <path d="M9 1v2M13 1v2M11 9l-2 4h3l-2 4" />
      </svg>
    ),
  },
];

const InstantPrizeBanner = () => {
  return (
    <section className="sc-prize" dir="rtl">
      <div className="sc-prize__card">
        <div className="sc-prize__badge">
          <span>👑</span>
          <span>25,000 دینار تەنها</span>
        </div>

        <h2 className="sc-prize__headline">
          نرخی کارتی (Super Card) 25 هەزار دینارە بیکڕە لە چوار ئۆفەری بە خۆڕایی
          کۆدی سەر کارتەکە بکەرەوە دیارییەکی ڕاستەوخۆش وەر دەگریت
        </h2>

        <div className="sc-prize__icons">
          {ICONS.map((icon) => (
            <div className="sc-prize__icon" key={icon.key} title={icon.label}>
              {icon.svg}
            </div>
          ))}
        </div>

        <div className="sc-prize__luxury-box">
          <div className="sc-prize__luxury-badge">C BOX • iPhone</div>
          <div className="sc-prize__luxury-label">
            C BOX • LUXURY EDITION • BLACK GOLD
          </div>
          <p className="sc-prize__luxury-text">
            هەموو دیاریەکان لە یەک بۆکسی لوکسی ڕەش زێڕین
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstantPrizeBanner;
