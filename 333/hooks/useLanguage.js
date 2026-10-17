/**
 * ============================================================================
 * File: src/hooks/useLanguage.js
 * Description: Thin convenience hook exposing LanguageContext (the `t`
 *              translation function, current language/dir, and the language
 *              setter). Throws a clear error if consumed outside of a
 *              LanguageProvider tree.
 * Usage / Imported By: virtually all pages/ and components/ that render
 *                       user-facing text; components/common/LanguageSwitcher.jsx
 * ============================================================================
 */

import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';

export default function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>.');
  }
  return ctx;
}
