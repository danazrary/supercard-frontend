import React from "react";
import "./_whatsapp-cta.scss";

const PHONE_DISPLAY = "0750 377 6072";
const PHONE_TEL = "+9647503776072";
const PHONE_WHATSAPP = "9647503776072";

const WhatsAppCTA = () => {
  return (
    <section className="sc-wa-cta" dir="rtl">
      <div className="sc-wa-cta__card">
        <div className="sc-wa-cta__note-badge">
          <span>NOTE</span>
          <span className="sc-wa-cta__note-dot">•</span>
          <span>تێبینیمان هەیە 📸</span>
        </div>

        <p className="sc-wa-cta__text">
          تکایە ئاگاداربن کە هەموو ئۆفەرەکانی سوپەر کارت تەنها لە کلینیک و
          سەنتەرە بەریتزکراوەکانی شاری هەولێر بەردەستن. پێش سەردانکردن پەیوەندی
          بکەن بۆ دڵنیابوونەوە لە کات و شوێن.
        </p>

        <div className="sc-wa-cta__actions">
          <a className="sc-wa-cta__phone-pill" href={`tel:${PHONE_TEL}`}>
            <span>📞</span>
            <span>{PHONE_DISPLAY} - پەیوەندی</span>
          </a>

          <a
            className="sc-wa-cta__whatsapp-btn"
            href={`https://wa.me/${PHONE_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.69.44 3.33 1.28 4.78L2 22l5.44-1.38a9.9 9.9 0 0 0 4.6 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 1.67c2.21 0 4.29.86 5.85 2.42a8.23 8.23 0 0 1 2.42 5.82c0 4.55-3.71 8.25-8.27 8.25a8.3 8.3 0 0 1-4.2-1.15l-.3-.18-3.23.82.86-3.15-.2-.32a8.2 8.2 0 0 1-1.26-4.4c0-4.55 3.71-8.25 8.27-8.25h.06z" />
              <path d="M9.1 7.3c-.18-.4-.37-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.67 2.67 4.12 3.64 2.04.8 2.46.65 2.9.6.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.18-1.39-1.32-1.63-.14-.24-.02-.37.1-.49.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.52-1.3-.72-1.78z" />
            </svg>
            <span>چات لەگەڵمان بکە لە واتسئەپ</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
