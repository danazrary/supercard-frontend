/**
 * ============================================================================
 * File: src/hooks/useWindowDimensions.js
 * Description: Tracks the browser viewport width/height reactively, with a
 *              debounced resize listener to avoid excessive re-renders.
 *              Primarily used to compute the QR scanner's camera viewfinder
 *              bounds and to switch between mobile/desktop layout variants
 *              in components that don't rely purely on CSS breakpoints.
 * Usage / Imported By: hooks/useQRScanner.js,
 *                       components/merchant/QRScannerCamera.jsx,
 *                       components/customer/GiftBoxModal.jsx
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';

function getDimensions() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}

/**
 * @param {number} [debounceMs=150] - Debounce delay for resize events
 * @returns {{ width: number, height: number, isMobile: boolean }}
 */
export default function useWindowDimensions(debounceMs = 150) {
  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = useCallback(() => {
    setDimensions(getDimensions());
  }, []);

  useEffect(() => {
    let timeoutId = null;

    function debouncedResize() {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    }

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleResize, debounceMs]);

  return {
    width: dimensions.width,
    height: dimensions.height,
    isMobile: dimensions.width < 768,
  };
}
