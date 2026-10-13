/**
 * ============================================================================
 * File: src/components/layout/Footer.jsx
 * Description: Production footer featuring dynamic year copyright,
 *              central route navigation, and interactive external social channels.
 * Usage / Imported By: src/App.jsx.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { WhatsAppIcon, InstagramIcon } from "../../assets/icons";
import { CONTACT_INFO, APP_CONFIG } from "../../utils/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social Links with handles and URLs
  const socialLinks = [
    {
      name: "WhatsApp",
      url: CONTACT_INFO.WHATSAPP_LINK,
      icon: <WhatsAppIcon size={18} />,
      color: "#25d366",
    },
    {
      name: "Instagram",
      url:
        CONTACT_INFO.INSTAGRAM_URL || "https://instagram.com/supercard.erbil",
      icon: <InstagramIcon size={18} />,
      color: "#e1306c",
    },
    {
      name: "Snapchat",
      url:
        CONTACT_INFO.SNAPCHAT_URL || "https://snapchat.com/add/supercard.erbil",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.002 2c-3.593 0-5.836 2.378-5.836 4.935 0 .762.247 1.62.593 2.235.105.186.11.272.012.386-.145.17-.468.397-.936.561-.397.139-.757.34-.848.749-.115.518.257.973.81 1.258.826.426 1.487.35 1.77.728.169.226.155.57.143.916-.03.882-.072 2.115-1.745 2.502-.451.104-.78.368-.908.73-.135.385-.018.784.321 1.05.587.461 1.624.634 3.082.514.869-.071 1.834-.337 2.613-.564.444-.129.832-.089 1.173.085.344.175.698.487 1.748.487 1.053 0 1.408-.312 1.753-.487.34-.174.729-.214 1.172-.085.78.227 1.745.493 2.613.564 1.458.12 2.495-.053 3.083-.514.339-.266.456-.665.321-1.05-.128-.362-.457-.626-.908-.73-1.673-.387-1.715-1.62-1.745-2.502-.012-.346-.026-.69.143-.916.283-.378.944-.302 1.77-.728.553-.285.925-.74.81-1.258-.091-.409-.451-.61-.848-.749-.468-.164-.791-.391-.936-.561-.098-.114-.093-.2-.012-.386.346-.615.593-1.473.593-2.235C17.838 4.378 15.595 2 12.002 2z" />
        </svg>
      ),
      color: "#fffc00",
    },
    {
      name: "Phone",
      url: `tel:${CONTACT_INFO.PHONE}`,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      color: "#00e5c9",
    },
  ];

  return (
    <footer className="super-footer">
      <div className="super-footer__container">
        {/* Left Side: Brand Copyright & Dynamic Date */}
        <div className="super-footer__copyright">
          <div className="super-footer__brand-title">
            <span>{APP_CONFIG.NAME_KU}</span>
            <span className="super-footer__badge">VIP</span>
          </div>
          <p className="super-footer__copy-text">
            © {currentYear} {APP_CONFIG.NAME} (سوپەر کارت). هەموو مافەکان
            پارێزراون.
          </p>
          <span className="super-footer__location">
            📍 هەولێر - هەرێمی کوردستان، عێراق
          </span>
        </div>

        {/* Center: Essential Navigation Links */}
        <div className="super-footer__nav-group">
          <span className="super-footer__nav-title">بەستەرە گرنگەکان</span>
          <div className="super-footer__nav-links">
            <Link to="/" className="super-footer__link">
              سەرەکی
            </Link>
            <Link to="/profile" className="super-footer__link">
              کارتی VIP
            </Link>
            <Link to="/settings" className="super-footer__link">
              ڕێکخستنەکان
            </Link>
            <Link to="/merchant/login" className="super-footer__link">
              چوونەژوورەوەی سەنتەر
            </Link>
          </div>
        </div>

        {/* Right Side: Clickable Social Media Outlets */}
        <div className="super-footer__socials-group">
          <span className="super-footer__nav-title">تۆڕە کۆمەڵایەتییەکان</span>
          <div className="super-footer__social-icons">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="super-footer__social-btn"
                aria-label={item.name}
                style={{ "--social-color": item.color }}
              >
                {item.icon}
              </a>
            ))}
          </div>
          <span className="super-footer__support-phone">
            پەیوەندی ڕاستەوخۆ: {CONTACT_INFO.PHONE_DISPLAY}
          </span>
        </div>
      </div>
    </footer>
  );
}
