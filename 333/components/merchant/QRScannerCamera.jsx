/**
 * ============================================================================
 * File: src/components/merchant/QRScannerCamera.jsx
 * Description: Renders the live camera feed with an animated viewfinder
 *              (corner brackets + sweeping cyan scanline) for merchant staff
 *              to scan a customer's QR code. Wraps useQRScanner for the
 *              WebRTC lifecycle, handles camera permission denial with a
 *              friendly placeholder + manual-entry fallback prompt, and
 *              invokes onScanSuccess once a valid card UUID is decoded.
 * Usage / Imported By: pages/MerchantScanner.jsx
 * ============================================================================
 */

import React, { useEffect } from 'react';
import useQRScanner from '../../hooks/useQRScanner';
import useLanguage from '../../hooks/useLanguage';
import { CameraIcon } from '../../assets/icons';

/**
 * @param {Object} props
 * @param {Function} props.onScanSuccess - Called with the decoded card UUID
 * @param {boolean} [props.active=true] - Whether scanning should be running
 *        (parent sets false while a scan result is being processed/displayed)
 */
export default function QRScannerCamera({ onScanSuccess, active = true }) {
  const { t } = useLanguage();
  const { videoRef, isScanning, hasCameraPermission, start, stop } = useQRScanner({
    onDecode: onScanSuccess,
  });

  useEffect(() => {
    if (active) {
      start();
    } else {
      stop();
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="qr-scanner">
      {hasCameraPermission === false ? (
        <div className="qr-scanner__placeholder">
          <CameraIcon size={40} color="var(--color-text-muted, #64748b)" />
          <p className="text-sm">{t('errors.unauthorized')}</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="qr-scanner__video" muted playsInline />
          {isScanning && (
            <div className="qr-scanner__overlay">
              <div className="qr-scanner__viewfinder">
                <span className="qr-scanner__corner qr-scanner__corner--tl" />
                <span className="qr-scanner__corner qr-scanner__corner--tr" />
                <span className="qr-scanner__corner qr-scanner__corner--bl" />
                <span className="qr-scanner__corner qr-scanner__corner--br" />
                <span className="qr-scanner__scanline" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
