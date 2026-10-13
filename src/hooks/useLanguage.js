/**
 * ============================================================================
 * File: src/hooks/useLanguage.js
 * Description: Convenience hook providing active locale, direction, and `t` helper.
 * Usage / Imported By: All UI components requiring localization.
 * ============================================================================
 */

import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be consumed within a <LanguageProvider>");
  }
  return context;
}
