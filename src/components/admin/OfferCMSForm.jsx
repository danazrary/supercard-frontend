/**
 * ============================================================================
 * File: src/components/admin/OfferCMSForm.jsx
 * Description: Create/Edit 9:16 vertical visual offer CMS form with live preview.
 * Usage / Imported By: AdminDashboard.
 * ============================================================================
 */

import React, { useState } from "react";
import Button from "../common/Button/Button";
import { IMAGES } from "../../assets/images";

export default function OfferCMSForm({ onSave }) {
  const [titleKu, setTitleKu] = useState("");
  const [discountRate, setDiscountRate] = useState(20);
  const [imageUrl, setImageUrl] = useState(IMAGES.OFFER_PLACEHOLDER_916);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ titleKu, discountRate, imageUrl });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#0b1522",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "24px",
      }}
    >
      <h3 style={{ color: "#ffc800", marginBottom: "16px" }}>
        زیادکردنی ئۆفەری 9:16
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 140px",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="ناونیشانی کوردی (بۆ نموونە: پشکنینی ددان بەخۆڕایی)"
            value={titleKu}
            onChange={(e) => setTitleKu(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: "#060b13",
              border: "1px solid #334155",
              color: "#fff",
            }}
          />
          <input
            type="number"
            placeholder="ڕێژەی داشکاندن (%)"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: "#060b13",
              border: "1px solid #334155",
              color: "#fff",
            }}
          />
          <Button type="submit" variant="gold">
            پاشەکەوتکردن
          </Button>
        </div>
        <div>
          <img
            src={imageUrl}
            alt="9:16 Preview"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
    </form>
  );
}
