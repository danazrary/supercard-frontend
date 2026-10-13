import React from "react";
import "./_hero-bio.scss";

const STATS = [
  { value: "FIB", label: "پاراستنی کوالێتی" },
  { value: "100%", label: "خزمەتگوزاری خۆڕایی" },
  { value: "4", label: "سەنتەری تایبەت" },
];

const HeroBio = () => {
  return (
    <section className="sc-hero" dir="rtl">
      <div className="sc-hero__badge">
        <span>FIB STYLE</span>
        <span className="sc-hero__badge-dot">•</span>
        <span>4K ULTRA</span>
      </div>

      <div className="sc-hero__logo">
        <span className="sc-hero__logo-letter">S</span>
      </div>

      <h1 className="sc-hero__title">SUPER CARD</h1>

      <p className="sc-hero__subtitle">
        هەموو ئۆفەرەکان تەنها لە هەولێر بەردەستە
      </p>

      <div className="sc-hero__social-pills">
        <a
          className="sc-hero__social-pill sc-hero__social-pill--instagram"
          href="https://instagram.com/super.card.company"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
          <span>@super.card.company</span>
        </a>

        <a
          className="sc-hero__social-pill sc-hero__social-pill--snapchat"
          href="https://snapchat.com/add/rebo_emarate1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2c3 0 5.2 2.3 5.2 5.4 0 1.3-.1 2.3-.1 2.9.3.2.9.3 1.5.1.4-.1.8.1.9.5.1.5-.1 1-.6 1.3-.5.3-1.2.6-1.9.9-.1.5-.3.9-.5 1.3.9.7 2.1 1.2 3.3 1.4.3.1.5.3.5.6 0 .6-1 1-1.9 1.2-.2.3-.4.9-.6 1.2-.1.2-.3.3-.6.3h-.1c-.6-.1-1.2-.3-2-.3-.5 0-1 .1-1.5.3-.8.4-1.7 1.1-3.1 1.1s-2.3-.7-3.1-1.1c-.5-.2-1-.3-1.5-.3-.8 0-1.4.2-2 .3h-.1c-.3 0-.5-.1-.6-.3-.2-.3-.4-.9-.6-1.2-.9-.2-1.9-.6-1.9-1.2 0-.3.2-.5.5-.6 1.2-.2 2.4-.7 3.3-1.4-.2-.4-.4-.8-.5-1.3-.7-.3-1.4-.6-1.9-.9-.5-.3-.7-.8-.6-1.3.1-.4.5-.6.9-.5.6.2 1.2.1 1.5-.1 0-.6-.1-1.6-.1-2.9C6.8 4.3 9 2 12 2z" />
          </svg>
          <span>rebo_emarate1</span>
        </a>
      </div>

      <div className="sc-hero__stats">
        {STATS.map((stat) => (
          <div className="sc-hero__stat" key={stat.label}>
            <span className="sc-hero__stat-value">{stat.value}</span>
            <span className="sc-hero__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroBio;
