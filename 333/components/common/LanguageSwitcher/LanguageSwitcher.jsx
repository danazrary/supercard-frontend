/**
 * ============================================================================
 * File: src/components/common/LanguageSwitcher/LanguageSwitcher.jsx
 * Description: Dropdown/pill control allowing the user to switch between
 *              Kurdish (ku), Arabic (ar), and English (en). Reads the
 *              supported language list and setter from LanguageContext via
 *              the useLanguage hook; selecting a language immediately
 *              re-renders the app with the new translation bundle and flips
 *              document direction.
 * Usage / Imported By: pages/SettingsPage.jsx, components/layout/BottomNav
 *                       (optional header placement), pages/HomePage
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import useLanguage from '../../../hooks/useLanguage';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const activeLang = supportedLanguages.find((l) => l.code === language);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(code) {
    setLanguage(code);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ width: compact ? 40 : 'auto', padding: compact ? 0 : '8px 16px', gap: 8 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {compact ? activeLang?.code.toUpperCase() : activeLang?.label}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="content-card"
          style={{
            position: 'absolute',
            top: '110%',
            insetInlineEnd: 0,
            minWidth: 140,
            padding: 8,
            zIndex: 100,
          }}
        >
          {supportedLanguages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === language}
                onClick={() => handleSelect(lang.code)}
                className="btn btn--ghost btn--full btn--sm"
                style={{
                  justifyContent: 'flex-start',
                  color: lang.code === language ? 'var(--color-accent-cyan, #00e5c9)' : undefined,
                }}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
