/**
 * ============================================================================
 * File: src/components/merchant/RedemptionActions.jsx
 * Description: Clinic redemption actions ("کارتەکەمان بەکارهێنا" and cancel).
 * Usage / Imported By: MerchantScanner.
 * ============================================================================
 */

import React from "react";
import Button from "../common/Button/Button";
import useLanguage from "../../hooks/useLanguage";

export default function RedemptionActions({
  onConfirm,
  onCancel,
  isSubmitting,
  isAvailable,
}) {
  const { t } = useLanguage();

  return (
    <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
      <Button
        variant="gold"
        fullWidth
        disabled={isSubmitting || !isAvailable}
        onClick={onConfirm}
      >
        {isSubmitting ? "تۆمارکردن..." : t("merchant.confirm_redemption")}
      </Button>
      <Button
        variant="cyan"
        fullWidth
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t("merchant.cancel_redemption")}
      </Button>
    </div>
  );
}
