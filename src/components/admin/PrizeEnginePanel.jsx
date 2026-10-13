/**
 * ============================================================================
 * File: src/components/admin/PrizeEnginePanel.jsx
 * Description: Real-time stock, weights, and lottery controls for C-BOX prizes.
 * Usage / Imported By: AdminDashboard.
 * ============================================================================
 */

import React, { useState } from "react";


export default function PrizeEnginePanel() {
  const [prizes, setPrizes] = useState([
    { id: 1, name: "5,000 IQD Cash", stock: 1200, weight: 60 },
    { id: 2, name: "10,000 IQD Cash", stock: 650, weight: 30 },
    { id: 3, name: "Smart Watch", stock: 45, weight: 7 },
    { id: 4, name: "Luxury Headphones", stock: 20, weight: 2.8 },
    { id: 5, name: "iPhone 18 Pro Max", stock: 2, weight: 0.2 },
  ]);

  return (
    <div
      style={{ background: "#0b1522", padding: "20px", borderRadius: "16px" }}
    >
      <h3 style={{ color: "#00e5c9", marginBottom: "16px" }}>
        کۆنتڕۆڵی مەکینەی بەختی C-BOX
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {prizes.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              background: "#060b13",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong style={{ color: "#ffc800" }}>{p.name}</strong>
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  display: "block",
                }}
              >
                چانس: {p.weight}%
              </span>
            </div>
            <div>
              <span style={{ color: "#fff", marginRight: "12px" }}>
                ماوە: {p.stock} دانە
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
