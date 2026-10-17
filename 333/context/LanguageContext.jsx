/**
 * ============================================================================
 * File: src/context/LanguageContext.jsx
 * Description: Provides application-wide i18n state. Loads the locale JSON
 *              bundle (ku/ar/en) matching the active language, exposes a `t`
 *              translation lookup function (dot-path keyed, e.g. t('auth.
 *              phoneLabel')), persists the chosen language to localStorage,
 *              and automatically flips the document's `dir` attribute
 *              (rtl for ku/ar, ltr for en) plus `lang` attribute whenever the
 *              language changes.
 * Usage / Imported By: App.jsx (provider wrapper), hooks/useLanguage.js,
 *                       components/common/LanguageSwitcher.jsx, all pages/
 *                       and components/ that render user-facing text
 * ============================================================================
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import ku from '../locales/ku.json';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import { STORAGE_KEYS, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../utils/constants';

export const LanguageContext = createContext(null);

const BUNDLES = { ku, ar, en };

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (stored && BUNDLES[stored]) return stored;
  return DEFAULT_LANGUAGE;
}

/**
 * Resolves a dot-path key (e.g. "auth.phoneLabel") against a nested
 * translation bundle object.
 * @param {Object} bundle - The active locale JSON bundle
 * @param {string} path - Dot-separated key path
 * @returns {string|undefined} Resolved string or undefined if not found
 */
function resolvePath(bundle, path) {
  return path.split('.').reduce((acc, segment) => (acc && acc[segment] !== undefined ? acc[segment] : undefined), bundle);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const activeMeta = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  useEffect(() => {
    document.documentElement.setAttribute('dir', activeMeta.dir);
    document.documentElement.setAttribute('lang', activeMeta.code);
  }, [activeMeta]);

  const setLanguage = useCallback((code) => {
    if (!BUNDLES[code]) return;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    setLanguageState(code);
  }, []);

  /**
   * Translation lookup. Falls back to the Kurdish bundle, then to the
   * raw key itself, so missing translations never render as "undefined"
   * in production.
   * @param {string} key - Dot-path translation key
   * @param {Object} [vars] - Optional {placeholder: value} interpolation map
   * @returns {string} Resolved (and interpolated) translation string
   */
  const t = useCallback(
    (key, vars) => {
      const bundle = BUNDLES[language] || BUNDLES[DEFAULT_LANGUAGE];
      let str = resolvePath(bundle, key);
      if (str === undefined) {
        str = resolvePath(BUNDLES[DEFAULT_LANGUAGE], key);
      }
      if (str === undefined) return key;

      if (vars) {
        Object.keys(vars).forEach((v) => {
          str = str.replace(new RegExp(`{{${v}}}`, 'g'), vars[v]);
        });
      }
      return str;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      dir: activeMeta.dir,
      setLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language, activeMeta, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export default LanguageContext;
