/**
 * ============================================================================
 * File: src/pages/NotFoundPage.jsx
 * Description: 404 luxury dark error page.
 * Usage / Imported By: App.jsx (Route: *).
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button/Button";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "4rem", color: "#ffc800", margin: 0 }}>٤٠٤</h1>
        <p style={{ color: "#cbd5e1", margin: "12px 0 24px" }}>
          ئەم پەڕەیە بوونی نییە یان گوێزراوەتەوە.
        </p>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="gold">گەڕانەوە بۆ سەرەکی</Button>
        </Link>
      </div>
    </div>
  );
}
