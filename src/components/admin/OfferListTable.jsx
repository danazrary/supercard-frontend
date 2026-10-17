/**
 * ============================================================================
 * File: src/components/admin/OfferListTable.jsx
 * Description: Admin management table for viewing, deleting, and editing added offers.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function OfferListTable({ onEditOffer }) {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/offers");
      setOffers(res.offers || []);
    } catch (err) {
      setError("ناتوانرێت لیستی ئۆفەرەکان بهێنرێت.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (offerId) => {
    if (!window.confirm("ئایا دڵنیایت لە سڕینەوەی ئەم ئۆفەرە؟")) return;

    try {
      await api.delete(`/admin/offers/${offerId}`);
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch (err) {
      alert("هەڵە لە سڕینەوەی ئۆفەرەکەدا ڕوویدا.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ color: "#cbd5e1", textAlign: "center", padding: "40px" }}>
        چاوەڕوان بە... لیستی ئۆفەرەکان دەهێنرێت...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0b1522",
        padding: "24px",
        borderRadius: "20px",
        border: "1px solid rgba(255,200,0,0.2)",
        direction: "rtl",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#ffc800", margin: 0 }}>
          📋 هەموু ئۆفەرە زیادکراوەکان ({offers.length})
        </h3>
        <button
          onClick={fetchOffers}
          style={{
            background: "rgba(0,229,201,0.15)",
            color: "#00e5c9",
            border: "1px solid #00e5c9",
            padding: "6px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 نوێکردنەوەی لیست
        </button>
      </div>

      {error && (
        <div style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</div>
      )}

      {offers.length === 0 ? (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: "30px" }}>
          هیچ ئۆفەرێک تا ئێستا زیاد نەکراوە.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {offers.map((offer) => {
            const fullImgUrl = offer.image_url?.startsWith("http")
              ? offer.image_url
              : `http://localhost:5000${offer.image_url}`;

            return (
              <div
                key={offer.id}
                style={{
                  background: "#060b13",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    background: "#14283d",
                    position: "relative",
                  }}
                >
                  <img
                    src={fullImgUrl}
                    alt={offer.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#00e5c9",
                      color: "#060b13",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {offer.right_badge || "FREE"}
                  </span>
                </div>

                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    flex: 1,
                  }}
                >
                  <h4 style={{ color: "#ffc800", margin: 0, fontSize: "1rem" }}>
                    {offer.center_name_en || "CENTER"}
                  </h4>
                  <p
                    style={{
                      color: "#fff",
                      margin: 0,
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    {offer.title}
                  </p>
                  <span
                    style={{
                      color: "#00e5c9",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(offer.single_base_price).toLocaleString()} د.ع
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "auto",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <button
                      onClick={() => onEditOffer && onEditOffer(offer)}
                      style={{
                        flex: 1,
                        background: "rgba(255,200,0,0.15)",
                        color: "#ffc800",
                        border: "1px solid rgba(255,200,0,0.4)",
                        padding: "8px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                      }}
                    >
                      ✏️ دەستکاری
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      style={{
                        flex: 1,
                        background: "rgba(239,68,68,0.15)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.4)",
                        padding: "8px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                      }}
                    >
                      🗑️ سڕینەوە
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
