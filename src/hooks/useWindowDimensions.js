/**
 * ============================================================================
 * File: src/hooks/useWindowDimensions.js
 * Description: Real-time window size tracker supporting mobile viewport adjustments.
 * Usage / Imported By: QRScannerCamera, BottomNav, GiftBoxModal.
 * ============================================================================
 */

import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}
