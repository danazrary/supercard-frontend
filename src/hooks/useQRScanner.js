/**
 * ============================================================================
 * File: src/hooks/useQRScanner.js
 * Description: Camera stream & QR scanning hook utilizing native WebRTC media
 *              devices with video track constraints and fallback canvas detection.
 * Usage / Imported By: QRScannerCamera, MerchantScanner.
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from "react";

export default function useQRScanner(onScanSuccess) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setHasPermission(true);
        setIsScanning(true);
      }
    } catch (err) {
      setHasPermission(false);
      setError("Camera access denied or device not supported.");
      stopCamera();
    }
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    hasPermission,
    isScanning,
    error,
    startCamera,
    stopCamera,
  };
}
