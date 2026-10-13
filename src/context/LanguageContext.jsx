/**
 * ============================================================================
 * File: src/context/LanguageContext.jsx
 * Description: Localization provider supplying Sorani Kurdish ('ku'), Arabic ('ar'),
 *              and English ('en'), syncing HTML `dir` and persistent settings.
 * Usage / Imported By: App.jsx, LanguageSwitcher, useLanguage, all components.
 * ============================================================================
 */

import React, { createContext, useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS, APP_CONFIG } from "../utils/constants";
import kuTranslations from "../locales/ku.json";
import arTranslations from "../locales/ar.json";
import enTranslations from "../locales/en.json";

export const LanguageContext = createContext(null);

const TRANSLATION_MAP = {
  ku: kuTranslations,
  ar: arTranslations,
  en: enTranslations,
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return (
      localStorage.getItem(STORAGE_KEYS.APP_LOCALE) || APP_CONFIG.DEFAULT_LOCALE
    );
  });

  const isRTL = locale === "ku" || locale === "ar";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_LOCALE, locale);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  const switchLanguage = useCallback((newLocale) => {
    if (APP_CONFIG.SUPPORTED_LOCALES.includes(newLocale)) {
      setLocale(newLocale);
    }
  }, []);

  /**
   * Helper lookup function with fallback.
   * Example: t('fib.modal_title') -> string
   */
  const t = useCallback(
    (keyPath, fallback = "") => {
      if (!keyPath) return fallback;
      const keys = keyPath.split(".");
      let current = TRANSLATION_MAP[locale] || TRANSLATION_MAP.ku;

      for (let k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          return fallback || keyPath;
        }
      }
      return typeof current === "string" ? current : fallback || keyPath;
    },
    [locale],
  );

  const value = {
    locale,
    isRTL,
    switchLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
