/**
 * ============================================================================
 * File: src/components/admin/EditOfferModal.jsx
 * Description: Dedicated Edit Form for existing 3:4 offers with all pointer handlers fixed.
 * ============================================================================
 */

import React, { useState, useRef } from "react";
import Button from "../common/Button/Button";
import api from "../../services/api";
import "../../styles/components/_offer-cms-form.scss";

const EDIT_TEXTS = {
  ku: {
    edit_header: "✏️ دەستکاریکردن و نوێکردنەوەی ئۆفەر",
    step1_title: "١. وێنەی نوێ (گۆڕینی وێنەی 3:4 - ئارەزوومەندانە)",
    recrop: "✂️ بڕین و ڕێکخستنی وێنەی نوێ",
    step2_langs: "٢. زمانە چالاکەکان",
    general_info: "٣. زانیارییە گشتییەکان",
    center_name: "ناوی سەنتەر (ئینگلیزی کاپیتاڵ)",
    phone: "ژمارەی مۆبایل",
    price: "نرخ بە دینار",
    text_bg: "پاشبنەما بۆ تێکستەکانی سەر وێنە",
    yes_bg: "بەڵێ، پاشبنەما هەبێت",
    no_bg: "نەخێر، تەنها تێکست",
    left_tag: "بادجی سەرەوە لای چەپ",
    right_tag: "بادجی سەرەوە لای ڕاست",
    title_lbl: "تایتڵی ئۆفەر (لەسەر وێنە)",
    loc_lbl: "ناونیشانی شوێن (لە خوارەوە)",
    desc_lbl: "دیسکریپشن (لە خوارەوە)",
    features_title: "٤. تایبەتمەندییەکانی خوارەوەی وێنە",
    add_feat: "+ زیادکردنی تایبەتمەندی",
    save_update: "💾 نوێکردنەوەی ئۆفەر",
    cancel: "✕ پاشگەزبوونەوە",
    updating: "لە کاتی نوێکردنەوەدایە...",
  },
  ar: {
    edit_header: "✏️ تعديل وتحديث العرض",
    step1_title: "١. صورة جديدة (تغيير صورة 3:4 - اختيارية)",
    recrop: "✂️ قص وضبط الصورة الجديدة",
    step2_langs: "٢. اللغات النشطة",
    general_info: "٣. المعلومات العامة",
    center_name: "اسم المركز (بالإنجليزية الكبيرة)",
    phone: "رقم الهاتف",
    price: "السعر بالدينار",
    text_bg: "خلفية النصوص فوق الصورة",
    yes_bg: "نعم، مع خلفية",
    no_bg: "لا، بدون خلفية",
    left_tag: "الشارة العليا اليسرى",
    right_tag: "الشارة العليا اليمنى",
    title_lbl: "عنوان العرض (فوق الصورة)",
    loc_lbl: "عنوان الموقع (في الأسفل)",
    desc_lbl: "الوصف التفصيلي (في الأسفل)",
    features_title: "٤. المميزات السفلية داخل الصورة",
    add_feat: "+ إضافة ميزة",
    save_update: "💾 تحديث العرض",
    cancel: "✕ إلغاء",
    updating: "جاري التحديث...",
  },
  en: {
    edit_header: "✏️ Edit & Update Offer",
    step1_title: "1. New Image (Optional 3:4 Replacement)",
    recrop: "✂️ Crop & Adjust New Image",
    step2_langs: "2. Active Languages",
    general_info: "3. General Settings",
    center_name: "Center Name (English Capital)",
    phone: "Phone Number",
    price: "Price (IQD)",
    text_bg: "Overlay Text Background",
    yes_bg: "Yes, Show Background",
    no_bg: "No, Transparent",
    left_tag: "Top-Left Tag",
    right_tag: "Top-Right Badge",
    title_lbl: "Offer Title (On Image)",
    loc_lbl: "Location (Bottom Box)",
    desc_lbl: "Description (Bottom Box)",
    features_title: "4. Bottom Image Features",
    add_feat: "+ Add Feature",
    save_update: "💾 Update Offer",
    cancel: "✕ Cancel",
    updating: "Updating...",
  },
};

export default function EditOfferModal({ offer, onUpdated, onCancel }) {
  const [uiLang, setUiLang] = useState("ku");
  const tr = (k) => EDIT_TEXTS[uiLang]?.[k] || EDIT_TEXTS.ku[k] || k;

  const [centerNameEn, setCenterNameEn] = useState(offer?.center_name_en || "");
  const [phone, setPhone] = useState(offer?.phone || "0750 377 6072");
  const [price, setPrice] = useState(offer?.single_base_price || "7000");
  const [hasTextBg, setHasTextBg] = useState(Boolean(offer?.has_text_bg));

  const parseJson = (val, fallback) => {
    if (!val) return fallback;
    try {
      return typeof val === "string" ? JSON.parse(val) : val;
    } catch {
      return fallback;
    }
  };

  const [leftBadges, setLeftBadges] = useState(
    parseJson(offer?.left_badges_json, {
      ku: offer?.left_badge || "",
      ar: "",
      en: "",
    }),
  );
  const [rightBadges, setRightBadges] = useState(
    parseJson(offer?.right_badges_json, {
      ku: offer?.right_badge || "FREE",
      ar: "FREE",
      en: "FREE",
    }),
  );
  const [titles, setTitles] = useState(
    parseJson(offer?.titles_json, { ku: offer?.title || "", ar: "", en: "" }),
  );
  const [locations, setLocations] = useState(
    parseJson(offer?.locations_json, { ku: "", ar: "", en: "" }),
  );
  const [descriptions, setDescriptions] = useState(
    parseJson(offer?.descriptions_json, {
      ku: offer?.description || "",
      ar: "",
      en: "",
    }),
  );
  const [features, setFeatures] = useState(
    parseJson(offer?.features_json, [
      { id: 1, ku: "خزمەتگوزاری ١", ar: "", en: "Feature 1" },
    ]),
  );

  // وێنە و بڕەر
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(
    offer?.image_url
      ? offer.image_url.startsWith("http")
        ? offer.image_url
        : `http://localhost:5000${offer.image_url}`
      : null,
  );

  const imageObjRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        setRawImageSrc(reader.result);
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setShowCropper(true);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - cropOffset.x, y: clientY - cropOffset.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setCropOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const applyCrop3by4 = () => {
    if (!imageObjRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#060b13";
    ctx.fillRect(0, 0, 900, 1200);

    const img = imageObjRef.current;
    const baseScale = Math.max(900 / img.width, 1200 / img.height);
    const finalScale = baseScale * cropZoom;
    const drawW = img.width * finalScale;
    const drawH = img.height * finalScale;
    const drawX = (900 - drawW) / 2 + cropOffset.x * 3;
    const drawY = (1200 - drawH) / 2 + cropOffset.y * 3;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCroppedBlob(blob);
          setCroppedPreviewUrl(URL.createObjectURL(blob));
          setShowCropper(false);
        }
      },
      "image/webp",
      0.9,
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (croppedBlob) {
        formData.append("image", croppedBlob, "offer-3x4.webp");
      }
      formData.append("centerNameEn", centerNameEn.trim().toUpperCase());
      formData.append("phone", phone.trim());
      formData.append("price", price);
      formData.append("hasTextBg", String(hasTextBg));
      formData.append("leftBadgesJson", JSON.stringify(leftBadges));
      formData.append("rightBadgesJson", JSON.stringify(rightBadges));
      formData.append("titlesJson", JSON.stringify(titles));
      formData.append("locationsJson", JSON.stringify(locations));
      formData.append("descriptionsJson", JSON.stringify(descriptions));
      formData.append("featuresJson", JSON.stringify(features));

      await api.put(`/admin/offers/${offer.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onUpdated) onUpdated();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || "هەڵە لە نوێکردنەوەدا.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="offer-cms" dir={uiLang === "en" ? "ltr" : "rtl"}>
      <div className="offer-cms__header">
        <h3 className="offer-cms__title">
          {tr("edit_header")} (#ID: {offer.id})
        </h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="offer-cms__lang-pills">
            {["ku", "ar", "en"].map((l) => (
              <button
                key={l}
                type="button"
                className={`offer-cms__lang-btn ${uiLang === l ? "is-selected" : ""}`}
                onClick={() => setUiLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="offer-cms__copy-btn"
            onClick={onCancel}
          >
            {tr("cancel")}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="offer-cms__status-alert offer-cms__status-alert--error">
          {errorMsg}
        </div>
      )}

      <div className="offer-cms__grid">
        <form onSubmit={handleUpdateSubmit} className="offer-cms__form-col">
          <div className="offer-cms__section-box">
            <h4 className="offer-cms__section-title">📷 {tr("step1_title")}</h4>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="offer-cms__section-box">
            <h4 className="offer-cms__section-title">
              ⚙️ {tr("general_info")}
            </h4>
            <div className="offer-cms__field">
              <label>{tr("center_name")}:</label>
              <input
                type="text"
                dir="ltr"
                value={centerNameEn}
                onChange={(e) => setCenterNameEn(e.target.value.toUpperCase())}
                className="offer-cms__input offer-cms__input--english-caps"
              />
            </div>
            <div className="offer-cms__field-row">
              <div className="offer-cms__field">
                <label>{tr("phone")}:</label>
                <input
                  type="text"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="offer-cms__input"
                />
              </div>
              <div className="offer-cms__field">
                <label>{tr("price")}:</label>
                <input
                  type="number"
                  dir="ltr"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="offer-cms__input"
                />
              </div>
            </div>
            <div className="offer-cms__field">
              <label>{tr("text_bg")}:</label>
              <div className="offer-cms__bg-toggle-row">
                <button
                  type="button"
                  className={`offer-cms__toggle-pill ${!hasTextBg ? "is-active" : ""}`}
                  onClick={() => setHasTextBg(false)}
                >
                  {tr("no_bg")}
                </button>
                <button
                  type="button"
                  className={`offer-cms__toggle-pill ${hasTextBg ? "is-active" : ""}`}
                  onClick={() => setHasTextBg(true)}
                >
                  {tr("yes_bg")}
                </button>
              </div>
            </div>
          </div>

          {/* خانەکانی زمانەکان */}
          {["ku", "ar", "en"].map((lang) => (
            <div
              key={lang}
              className="offer-cms__section-box offer-cms__section-box--lang"
            >
              <h4 className="offer-cms__section-title">
                🏳️ {lang.toUpperCase()}
              </h4>
              <div className="offer-cms__field-row">
                <div className="offer-cms__field">
                  <label>{tr("left_tag")}:</label>
                  <input
                    type="text"
                    value={leftBadges[lang] || ""}
                    onChange={(e) =>
                      setLeftBadges((p) => ({ ...p, [lang]: e.target.value }))
                    }
                    className="offer-cms__input"
                  />
                </div>
                <div className="offer-cms__field">
                  <label>{tr("right_tag")}:</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={rightBadges[lang] || ""}
                    onChange={(e) =>
                      setRightBadges((p) => ({ ...p, [lang]: e.target.value }))
                    }
                    className="offer-cms__input"
                  />
                </div>
              </div>
              <div className="offer-cms__field">
                <label>{tr("title_lbl")}:</label>
                <input
                  type="text"
                  value={titles[lang] || ""}
                  onChange={(e) =>
                    setTitles((p) => ({ ...p, [lang]: e.target.value }))
                  }
                  className="offer-cms__input"
                />
              </div>
              <div className="offer-cms__field">
                <label>{tr("loc_lbl")}:</label>
                <input
                  type="text"
                  value={locations[lang] || ""}
                  onChange={(e) =>
                    setLocations((p) => ({ ...p, [lang]: e.target.value }))
                  }
                  className="offer-cms__input"
                />
              </div>
              <div className="offer-cms__field">
                <label>{tr("desc_lbl")}:</label>
                <textarea
                  rows={2}
                  value={descriptions[lang] || ""}
                  onChange={(e) =>
                    setDescriptions((p) => ({ ...p, [lang]: e.target.value }))
                  }
                  className="offer-cms__textarea"
                />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            variant="gold"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? tr("updating") : tr("save_update")}
          </Button>
        </form>

        {/* پێشبینینی ڕاستەوخۆ */}
        <div className="offer-cms__preview-col">
          <div
            className="offer-cms__preview-card"
            dir={uiLang === "en" ? "ltr" : "rtl"}
          >
            <div className="offer-cms__image-stage">
              {croppedPreviewUrl && (
                <img src={croppedPreviewUrl} alt="Preview" />
              )}
              <div className="offer-cms__image-shade" />
              <div className="offer-cms__top-badges">
                <span
                  className={`offer-cms__left-work-tag ${hasTextBg ? "has-bg" : "no-bg"}`}
                >
                  {leftBadges[uiLang] || leftBadges.ku || "Tag"}
                </span>
                <span className="offer-cms__right-discount-badge">
                  {rightBadges[uiLang] || rightBadges.ku || "FREE"}
                </span>
              </div>
              <div className="offer-cms__center-overlay">
                <div
                  className={`offer-cms__center-name-en ${hasTextBg ? "has-bg" : "no-bg"}`}
                >
                  {centerNameEn || "CENTER"}
                </div>
                <div
                  className={`offer-cms__overlay-title ${hasTextBg ? "has-bg" : "no-bg"}`}
                >
                  {titles[uiLang] || titles.ku || "Title"}
                </div>
              </div>
            </div>
            <div className="offer-cms__outside-bottom">
              <p className="offer-cms__outside-desc">
                {descriptions[uiLang] || descriptions.ku}
              </p>
              <div className="offer-cms__outside-meta">
                <span>📍 {locations[uiLang] || locations.ku || "Erbil"}</span>
                <div className="offer-cms__price-tag">
                  {Number(price).toLocaleString()} د.ع
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCropper && rawImageSrc && (
        <div className="offer-cms__cropper-backdrop">
          <div className="offer-cms__cropper-modal">
            <h4 style={{ color: "#ffc800" }}>✂️ بڕینی وێنە (3:4)</h4>
            <div
              className="offer-cms__cropper-stage"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              <img
                src={rawImageSrc}
                alt="Crop"
                draggable={false}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px)) scale(${cropZoom})`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={cropZoom}
              onChange={(e) => setCropZoom(parseFloat(e.target.value))}
              style={{ width: "100%", marginBottom: "15px" }}
            />
            <Button
              type="button"
              variant="gold"
              fullWidth
              onClick={applyCrop3by4}
            >
              ✓ پەسەندکردن
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
