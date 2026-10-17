/**
 * ============================================================================
 * File: src/components/admin/CenterManagerTable.jsx
 * Description: Full Centers Manager with Add New Center Modal (Name, Specialty
 *              like ددان / جوانکاری / غەسل, Email, Password) + Edit & Remove.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Button from "../common/Button/Button";

export default function CenterManagerTable() {
  const [centers, setCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // دۆخی فۆڕمی زیادکردن یان دەستکاریکردن
  const [showForm, setShowForm] = useState(false);
  const [editingCenterId, setEditingCenterId] = useState(null);

  const [centerName, setCenterName] = useState("");
  const [category, setCategory] = useState(""); // نموونە: ددان، جوانکاری، غەسل
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCenters = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/centers");
      setCenters(res.centers || []);
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: "نەتوانرا لیستی سەنتەرەکان بهێنرێت.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const openAddForm = () => {
    setEditingCenterId(null);
    setCenterName("");
    setCategory("");
    setEmail("");
    setPassword("");
    setStatusMsg({ type: "", text: "" });
    setShowForm(true);
  };

  const openEditForm = (center) => {
    setEditingCenterId(center.id);
    setCenterName(center.center_name || "");
    setCategory(center.category || "");
    setEmail(center.email || "");
    setPassword(""); // ئەگەر بەتاڵ بێت پاسۆردە کۆنەکەی ناگۆڕێت
    setStatusMsg({ type: "", text: "" });
    setShowForm(true);
  };

  const handleSaveCenter = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (!centerName.trim() || !category.trim() || !email.trim()) {
      setStatusMsg({
        type: "error",
        text: "تکایە ناوی سەنتەر، جۆری کار و ئیمەیڵ بنووسە.",
      });
      return;
    }

    if (!editingCenterId && !password.trim()) {
      setStatusMsg({
        type: "error",
        text: "تکایە وشەی تێپەڕ بۆ سەنتەرە نوێیەکە بنووسە.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCenterId) {
        await api.put(`/admin/centers/${editingCenterId}`, {
          centerName,
          category,
          email,
          password,
        });
        setStatusMsg({
          type: "success",
          text: "✅ سەنتەرەکە بە سەرکەوتوویی نوێ کرایەوە!",
        });
      } else {
        await api.post("/admin/centers", {
          centerName,
          category,
          email,
          password,
        });
        setStatusMsg({
          type: "success",
          text: "✅ سەنتەری نوێ بە سەرکەوتوویی زیاد کرا!",
        });
      }
      setShowForm(false);
      fetchCenters();
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "هەڵەیەک لە کاتی پاشەکەوتکردن ڕوویدا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCenter = async (id, name) => {
    if (!window.confirm(`ئایا دڵنیایت لە سڕینەوەی (${name})؟`)) return;
    try {
      await api.delete(`/admin/centers/${id}`);
      setCenters((prev) => prev.filter((c) => c.id !== id));
      setStatusMsg({ type: "success", text: "🗑️ سەنتەرەکە سڕایەوە." });
    } catch (err) {
      setStatusMsg({ type: "error", text: "هەڵە لە سڕینەوەی سەنتەر." });
    }
  };

  return (
    <div
      style={{
        background: "#0b1522",
        padding: "24px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 200, 0, 0.2)",
        direction: "rtl",
      }}
    >
      {/* سەرپەڕە و دوگمەی زیادکردنی سەنتەر */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ color: "#ffc800", margin: 0 }}>
            🏥 بەڕێوەبردنی سەنتەرەکان ({centers.length})
          </h3>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            زیادکردن، دەستکاریکردن و سڕینەوەی سەنتەر و کلینیکەکان
          </span>
        </div>

        <Button type="button" variant="gold" onClick={openAddForm}>
          + زیادکردنی سەنتەری نوێ
        </Button>
      </div>

      {statusMsg.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "18px",
            background:
              statusMsg.type === "error"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(16, 185, 129, 0.15)",
            color: statusMsg.type === "error" ? "#ef4444" : "#10b981",
            border: `1px solid ${statusMsg.type === "error" ? "#ef4444" : "#10b981"}`,
            fontWeight: "bold",
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {/* فۆڕمی زیادکردن / دەستکاریکردنی سەنتەر */}
      {showForm && (
        <form
          onSubmit={handleSaveCenter}
          style={{
            background: "#060b13",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #00e5c9",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "#00e5c9", margin: 0 }}>
              {editingCenterId
                ? "✏️ دەستکاریکردنی سەنتەر"
                : "➕ زیادکردنی سەنتەری نوێ"}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕ داخستن
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                ناوی سەنتەر:
              </label>
              <input
                type="text"
                placeholder="بۆ نموونە: سەنتەری کورد سمایل"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                چییان هەیە / جۆری کار (نموونە: ددان، جوانکاری، غەسل):
              </label>
              <input
                type="text"
                placeholder="ددان / جوانکاری / غەسلی ئۆتۆمبێل"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                ئیمەیڵی چوونەژوورەوە:
              </label>
              <input
                type="email"
                dir="ltr"
                placeholder="center@supercard.iq"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                {editingCenterId
                  ? "وشەی تێپەڕی نوێ (ئارەزوومەندانە):"
                  : "وشەی تێپەڕ (Password):"}
              </label>
              <input
                type="password"
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editingCenterId}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="gold" disabled={isSubmitting}>
              {isSubmitting
                ? "چاوەڕوان بە..."
                : editingCenterId
                  ? "💾 نوێکردنەوە"
                  : "💾 زیادکردنی سەنتەر"}
            </Button>
          </div>
        </form>
      )}

      {/* خشتەی لیستی هەموو سەنتەرەکان */}
      {isLoading ? (
        <div style={{ color: "#cbd5e1", textAlign: "center", padding: "30px" }}>
          لیستی سەنتەرەکان دەهێنرێت...
        </div>
      ) : centers.length === 0 ? (
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "30px" }}>
          هیچ سەنتەرێک تۆمار نەکراوە.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#fff",
              textAlign: "right",
            }}
          >
            <thead>
              <tr
                style={{ borderBottom: "1px solid #1e293b", color: "#ffc800" }}
              >
                <th style={{ padding: "12px" }}>#</th>
                <th style={{ padding: "12px" }}>ناوی سەنتەر</th>
                <th style={{ padding: "12px" }}>جۆری کار (چییان هەیە)</th>
                <th style={{ padding: "12px" }}>ئیمەیڵ</th>
                <th style={{ padding: "12px", textAlign: "center" }}>
                  کردارەکان
                </th>
              </tr>
            </thead>
            <tbody>
              {centers.map((c, index) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background:
                      index % 2 === 0
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                  }}
                >
                  <td style={{ padding: "12px", color: "#94a3b8" }}>{c.id}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {c.center_name}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background: "rgba(0, 229, 201, 0.14)",
                        color: "#00e5c9",
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "0.82rem",
                        fontWeight: "bold",
                      }}
                    >
                      {c.category}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      direction: "ltr",
                      textAlign: "right",
                      color: "#cbd5e1",
                    }}
                  >
                    {c.email}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openEditForm(c)}
                        style={{
                          background: "rgba(255, 200, 0, 0.15)",
                          color: "#ffc800",
                          border: "1px solid rgba(255, 200, 0, 0.4)",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                        }}
                      >
                        ✏️ دەستکاری
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveCenter(c.id, c.center_name)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                        }}
                      >
                        🗑️ سڕینەوە
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "#0b1522",
  border: "1px solid #334155",
  color: "#fff",
  marginTop: "6px",
  fontSize: "0.88rem",
};
