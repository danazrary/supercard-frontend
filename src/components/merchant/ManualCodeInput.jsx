/**
 * ============================================================================
 * File: src/components/merchant/ManualCodeInput.jsx
 * Description: Manual input fallback for clinic staff when camera scanner is unavailable.
 * Usage / Imported By: MerchantScanner.
 * ============================================================================
 */

import React, { useState } from "react";
import Button from "../common/Button/Button";
import useLanguage from "../../hooks/useLanguage";

export default function ManualCodeInput({ onSubmit, isLoading }) {
  const { t } = useLanguage();
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "8px", marginTop: "16px" }}
    >
      <input
        type="text"
        placeholder="SC-XXXX-XXXX"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "#060b13",
          color: "#00e5c9",
          fontFamily: "monospace",
          fontSize: "1rem",
          textAlign: "center",
        }}
      />
      <Button type="submit" variant="cyan" disabled={isLoading || !code}>
        پشکنین
      </Button>
    </form>
  );
}
