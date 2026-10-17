/**
 * ============================================================================
 * File: src/hooks/useQRScanner.js
 * Description: Encapsulates the WebRTC camera stream lifecycle and QR
 *              decoding loop used by the merchant scanning dashboard. Opens
 *              the device's rear camera via getUserMedia, attaches it to a
 *              provided <video> ref, runs a decode loop (via the html5-qrcode
 *              / BarcodeDetector-style API abstracted behind `decodeFrame`),
 *              and surfaces the first successfully decoded payload while
 *              cleanly tearing down the camera stream on unmount or stop().
 * Usage / Imported By: components/merchant/QRScannerCamera.jsx,
 *                       pages/MerchantScanner.jsx
 * ============================================================================
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { isValidUUID } from '../utils/validations';

const SCAN_INTERVAL_MS = 350;

/**
 * @param {Object} options
 * @param {Function} [options.onDecode] - Callback invoked with the decoded UUID string
 * @param {Function} [options.onError] - Callback invoked with an Error on camera/decoding failure
 * @returns {Object} Scanner control surface
 */
export default function useQRScanner({ onDecode, onError } = {}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const detectorRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [lastError, setLastError] = useState(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const decodeFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;

    try {
      // Prefer the native BarcodeDetector API when available; consuming
      // components may alternatively inject a polyfill-backed detector.
      if (!detectorRef.current && 'BarcodeDetector' in window) {
        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
      }
      if (!detectorRef.current) return;

      const barcodes = await detectorRef.current.detect(videoRef.current);
      if (barcodes && barcodes.length > 0) {
        const rawValue = barcodes[0].rawValue;
        const candidate = extractCardCode(rawValue);
        if (candidate && isValidUUID(candidate)) {
          stop();
          onDecode && onDecode(candidate);
        }
      }
    } catch (err) {
      // Non-fatal per-frame decode errors are ignored; only surfaced if
      // they persist (left to the caller via onError if desired).
    }
  }, [onDecode, stop]);

  const start = useCallback(async () => {
    setLastError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsScanning(true);
      intervalRef.current = setInterval(decodeFrame, SCAN_INTERVAL_MS);
    } catch (err) {
      setHasCameraPermission(false);
      setLastError(err);
      onError && onError(err);
    }
  }, [decodeFrame, onError]);

  useEffect(() => stop, [stop]);

  return {
    videoRef,
    isScanning,
    hasCameraPermission,
    lastError,
    start,
    stop,
  };
}

/**
 * Extracts the card UUID from a raw QR payload, which may either be a
 * bare UUID or a full deep-link URL (e.g. "supercard://scan?code=uuid").
 * @param {string} rawValue - Raw decoded QR text
 * @returns {string|null} Extracted UUID candidate
 */
function extractCardCode(rawValue) {
  if (!rawValue) return null;
  if (isValidUUID(rawValue)) return rawValue;

  try {
    const url = new URL(rawValue);
    const codeParam = url.searchParams.get('code') || url.searchParams.get('cardCode');
    return codeParam || null;
  } catch (e) {
    return null;
  }
}
