/**
 * ============================================================================
 * File: src/components/common/GiftSvgIcon.jsx
 * Description: Modern Turquoise SVG Icon Library for C-BOX Rewards (Cash, Car,
 *              Phone, Watch, Gold, Laptop, Headphones, Diamond, Travel, etc.)
 *              + Seamless Transparent PNG/WebP Image Renderer.
 * ============================================================================
 */

import React from "react";

export const GIFT_SVG_CATALOG = [
  {
    id: "cash",
    labelKu: "پارەی کاش",
    labelAr: "مبلغ نقدي",
    labelEn: "Cash Money",
  },
  { id: "car", labelKu: "ئۆتۆمبێل", labelAr: "سيارة", labelEn: "Luxury Car" },
  {
    id: "phone",
    labelKu: "مۆبایلی زیرەک",
    labelAr: "هاتف ذكي",
    labelEn: "Smartphone",
  },
  {
    id: "watch",
    labelKu: "کاتژمێری زیرەک",
    labelAr: "ساعة ذكية",
    labelEn: "Smart Watch",
  },
  {
    id: "gold",
    labelKu: "زێڕ و خشڵ",
    labelAr: "ذهب ومجوهرات",
    labelEn: "Gold & Jewelry",
  },
  { id: "laptop", labelKu: "لاپتۆپ", labelAr: "لابتوب", labelEn: "Laptop" },
  {
    id: "headphones",
    labelKu: "هێدفۆن",
    labelAr: "سماعات",
    labelEn: "Headphones",
  },
  {
    id: "diamond",
    labelKu: "ئەڵماس / VIP",
    labelAr: "ألماس / VIP",
    labelEn: "VIP Diamond",
  },
  {
    id: "voucher",
    labelKu: "کۆبۆنی داشکاندن",
    labelAr: "قسيمة شراء",
    labelEn: "Gift Voucher",
  },
  {
    id: "travel",
    labelKu: "گەشتی فڕۆکە",
    labelAr: "رحلة سفر",
    labelEn: "Travel Ticket",
  },
  {
    id: "perfume",
    labelKu: "عەتر و جوانکاری",
    labelAr: "عطور وتجميل",
    labelEn: "Luxury Perfume",
  },
  {
    id: "gaming",
    labelKu: "پلەیستەیشن / گەیمینگ",
    labelAr: "ألعاب إلكترونية",
    labelEn: "Gaming Console",
  },
];

export default function GiftSvgIcon({
  iconType = "svg",
  svgName = "cash",
  imageUrl = null,
  alt = "Reward",
  size = 32,
  className = "",
}) {
  if (iconType === "image" && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`sc-gift-visual-img ${className}`}
        loading="lazy"
      />
    );
  }

  const strokeColor = "currentColor";

  switch (svgName) {
    case "car":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
          <circle cx="6.5" cy="16.5" r="2.5" />
          <circle cx="16.5" cy="16.5" r="2.5" />
        </svg>
      );
    case "phone":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <path d="M10 5h4" />
        </svg>
      );
    case "watch":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="6" />
          <polyline points="12 10 12 12 13.5 13.5" />
          <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
          <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
        </svg>
      );
    case "gold":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="6 14 18 14 21 20 3 20 6 14" />
          <polygon points="8 8 16 8 18 14 6 14 8 8" />
          <path d="M12 2v3m-5 0 1.5 1.5M17 5l-1.5 1.5" />
        </svg>
      );
    case "laptop":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      );
    case "headphones":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      );
    case "diamond":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6 3h12l4 6-10 12L2 9Z" />
          <path d="M11 3 8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    case "voucher":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2m0 10v2m0-8v2" />
        </svg>
      );
    case "travel":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    case "perfume":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="6" y="9" width="12" height="12" rx="3" />
          <path d="M9 9V6h6v3" />
          <path d="M12 6V3m-2 0h4m3 2h3" />
        </svg>
      );
    case "gaming":
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="6" />
        </svg>
      );
    case "cash":
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      );
  }
}
