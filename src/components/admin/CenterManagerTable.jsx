/**
 * ============================================================================
 * File: src/components/admin/CenterManagerTable.jsx
 * Description: Clinics & partner medical centers management table.
 * Usage / Imported By: AdminDashboard.
 * ============================================================================
 */

import React from "react";
import Badge from "../common/Badge/Badge";

export default function CenterManagerTable() {
  const centers = [
    { id: 1, name: "Kurd Smile Dental", category: "ددان", active: true },
    { id: 2, name: "Guli Bahasht Beauty", category: "جوانکاری", active: true },
    { id: 3, name: "Royal Laser Clinic", category: "لێزەر", active: false },
  ];

  return (
    <div
      style={{
        background: "#0b1522",
        padding: "16px",
        borderRadius: "16px",
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "#fff",
          textAlign: "right",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>
            <th style={{ padding: "10px" }}>ناوی سەنتەر</th>
            <th style={{ padding: "10px" }}>بەش</th>
            <th style={{ padding: "10px" }}>دۆخ</th>
          </tr>
        </thead>
        <tbody>
          {centers.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #1e293b" }}>
              <td style={{ padding: "12px" }}>{c.name}</td>
              <td style={{ padding: "12px" }}>{c.category}</td>
              <td style={{ padding: "12px" }}>
                <Badge variant={c.active ? "success" : "danger"}>
                  {c.active ? "چالاک" : "ناچالاک"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
