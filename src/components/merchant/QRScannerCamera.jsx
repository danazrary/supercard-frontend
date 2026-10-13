/**
 * ============================================================================
 * File: src/components/merchant/QRScannerCamera.jsx
 * Description: Camera scanner component for clinic staff with viewfinder & laser.
 * Usage / Imported By: MerchantScanner.
 * ============================================================================
 */

import React, { useEffect } from "react";
import useQRScanner from "../../hooks/useQRScanner";
import { CameraIcon } from "../../assets/icons";

export default function QRScannerCamera({ onScan }) {
  const { videoRef, isScanning, error, startCamera, stopCamera } =
    useQRScanner();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="qr-scanner-wrapper">
      <video ref={videoRef} />
      <div className="qr-viewfinder" />
      <div className="scanline-laser" />

      {!isScanning && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
          }}
        >
          <CameraIcon size={40} color="#ffc800" />
          <p style={{ marginTop: "8px", fontSize: "0.85rem" }}>
            {error || "دەستپێکردنی کامێرا..."}
          </p>
        </div>
      )}
    </div>
  );
}
