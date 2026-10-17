/**
 * ============================================================================
 * File: src/components/admin/PrizeEnginePanel.jsx
 * Description: Super Admin Panel for Box Packages (Custom Theme Color,
 *              Per-Box Offer Selection, Per-Box Gift/Reward Selection,
 *              3-Language Texts, Timed Discounts) + Bottom Gift Catalog.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import Button from "../common/Button/Button";
import GiftSvgIcon, { GIFT_SVG_CATALOG } from "../common/GiftSvgIcon";
import { resolveAssetUrl } from "../../pages/HomePage";
import "../../styles/components/_box-system.scss";

const BOX_COLOR_PRESETS = [
  { hex: "#00e5c9", label: "فیرۆزی (Turquoise)" },
  { hex: "#ffc800", label: "زەردی زێڕین (Gold)" },
  { hex: "#a855f7", label: "مۆر (Purple)" },
  { hex: "#3b82f6", label: "شینی شاهانە (Blue)" },
  { hex: "#10b981", label: "سەوزی زمڕود (Emerald)" },
  { hex: "#f43f5e", label: "پەمەیی تاریک (Rose)" },
];

export default function PrizeEnginePanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const [allOffers, setAllOffers] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [gifts, setGifts] = useState([]);

  // فۆڕمی زیادکردن / دەستکاریکردنی بۆکس
  const [showBoxForm, setShowBoxForm] = useState(false);
  const [editingBoxId, setEditingBoxId] = useState(null);
  const [boxColor, setBoxColor] = useState("#00e5c9");
  const [boxTitles, setBoxTitles] = useState({ ku: "", ar: "", en: "" });
  const [boxDescs, setBoxDescs] = useState({ ku: "", ar: "", en: "" });
  const [boxPrice, setBoxPrice] = useState(25000);
  const [boxDiscountActive, setBoxDiscountActive] = useState(false);
  const [boxDiscountPercent, setBoxDiscountPercent] = useState(25);
  const [boxDiscountDays, setBoxDiscountDays] = useState(2);
  const [boxIncludesReward, setBoxIncludesReward] = useState(true);
  const [boxOfferIds, setBoxOfferIds] = useState([]);
  const [boxGiftIds, setBoxGiftIds] = useState([]); // دیارییە دیاریکراوەکانی ناو ئەم بۆکسە
  const [boxSoldCount, setBoxSoldCount] = useState(0);

  const [showOfferPickerModal, setShowOfferPickerModal] = useState(false);
  const [showGiftPickerModal, setShowGiftPickerModal] = useState(false);

  // فۆڕمی زیادکردنی دیاری لە بەشی خوارەوە
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [giftNames, setGiftNames] = useState({ ku: "", ar: "", en: "" });
  const [giftIconType, setGiftIconType] = useState("svg");
  const [giftSvgName, setGiftSvgName] = useState("cash");
  const [giftQuantity, setGiftQuantity] = useState(10);
  const [giftAvailableNow, setGiftAvailableNow] = useState(true);
  const [giftChance, setGiftChance] = useState(15.0);

  // بڕەری چوارگۆشەی 1:1 بە پاراستنی شەفافییەت
  const [rawGiftImg, setRawGiftImg] = useState(null);
  const [showSquareCropper, setShowSquareCropper] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedGiftBlob, setCroppedGiftBlob] = useState(null);
  const [croppedGiftPreview, setCroppedGiftPreview] = useState(null);
  const giftImageRef = useRef(null);

  const fetchAllEngineData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/prize-engine");
      setBoxes(res.boxes || []);
      setGifts(res.gifts || []);
      setAllOffers(res.offers || []);
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: "نەتوانرا داتای بۆکسەکان و دیارییەکان بهێنرێت.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEngineData();
  }, []);

  const openNewBoxForm = () => {
    setEditingBoxId(null);
    setBoxColor("#00e5c9");
    setBoxTitles({ ku: "", ar: "", en: "" });
    setBoxDescs({ ku: "", ar: "", en: "" });
    setBoxPrice(25000);
    setBoxDiscountActive(false);
    setBoxDiscountPercent(25);
    setBoxDiscountDays(2);
    setBoxIncludesReward(true);
    setBoxOfferIds([]);
    setBoxGiftIds([]);
    setBoxSoldCount(0);
    setShowBoxForm(true);
  };

  const openEditBoxForm = (b) => {
    setEditingBoxId(b.id);
    setBoxColor(b.box_color || "#00e5c9");
    setBoxTitles(b.titles || { ku: b.plan_name || "", ar: "", en: "" });
    setBoxDescs(b.descriptions || { ku: "", ar: "", en: "" });
    setBoxPrice(Number(b.base_price) || 25000);
    setBoxDiscountActive(Boolean(b.is_discount_active));
    setBoxDiscountPercent(Number(b.discount_percent) || 25);
    setBoxDiscountDays(Number(b.discount_days) || 2);
    setBoxIncludesReward(Boolean(b.includes_gift_box));
    setBoxOfferIds(b.included_offers || []);
    setBoxGiftIds(b.included_gifts || []);
    setBoxSoldCount(Number(b.sold_count) || 0);
    setShowBoxForm(true);
  };

  const handleSaveBox = async (e) => {
    e.preventDefault();
    const fallbackName =
      boxTitles.ku || boxTitles.en || boxTitles.ar || "Super Card Box";

    const payload = {
      boxName: fallbackName,
      planName: fallbackName,
      titlesJson: boxTitles,
      descriptionsJson: boxDescs,
      boxColor,
      boxPrice,
      basePrice: boxPrice,
      isDiscountActive: boxDiscountActive,
      discountPercent: boxDiscountPercent,
      discountDays: boxDiscountDays,
      includesReward: boxIncludesReward,
      includesGiftBox: boxIncludesReward,
      offersCount: boxOfferIds.length,
      includedOfferIds: boxOfferIds,
      includedGiftIds: boxGiftIds,
      soldCount: boxSoldCount,
    };

    try {
      if (editingBoxId === 1) {
        await api.put("/admin/pricing/full-card", payload);
      } else if (editingBoxId) {
        await api.put(`/admin/boxes/${editingBoxId}`, payload);
      } else {
        await api.post("/admin/boxes", payload);
      }

      setStatusMsg({
        type: "success",
        text: "✅ بۆکسەکە بە ڕەنگ و ئۆفەر و دیارییە دیاریکراوەکانییەوە پاشەکەوت کرا!",
      });
      setShowBoxForm(false);
      fetchAllEngineData();
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "هەڵە لە پاشەکەوتکردنی بۆکس.",
      });
    }
  };

  const handleDeleteBox = async (boxId, name) => {
    if (!window.confirm(`ئایا دڵنیایت لە سڕینەوەی بۆکسی (${name})؟`)) return;
    try {
      await api.delete(`/admin/boxes/${boxId}`);
      setBoxes((prev) => prev.filter((b) => b.id !== boxId));
      setStatusMsg({ type: "success", text: "بۆکسەکە سڕایەوە." });
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    }
  };

  const toggleOfferInBox = (offerId) => {
    setBoxOfferIds((prev) =>
      prev.includes(offerId)
        ? prev.filter((id) => id !== offerId)
        : [...prev, offerId],
    );
  };

  const toggleGiftInBox = (giftId) => {
    setBoxGiftIds((prev) =>
      prev.includes(giftId)
        ? prev.filter((id) => id !== giftId)
        : [...prev, giftId],
    );
  };

  const handleGiftImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setStatusMsg({
        type: "error",
        text: "قەبارەی وێنەکە نابێت لە 25MB زیاتر بێت!",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        giftImageRef.current = img;
        setRawGiftImg(reader.result);
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setShowSquareCropper(true);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: cx - cropOffset.x, y: cy - cropOffset.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setCropOffset({ x: cx - dragStart.x, y: cy - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const applySquareCrop = () => {
    if (!giftImageRef.current) return;
    const canvas = document.createElement("canvas");
    const size = 600;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, size, size);

    const img = giftImageRef.current;
    const baseScale = Math.min(size / img.width, size / img.height);
    const finalScale = baseScale * cropZoom;
    const drawW = img.width * finalScale;
    const drawH = img.height * finalScale;
    const ratio = size / 300;
    const drawX = (size - drawW) / 2 + cropOffset.x * ratio;
    const drawY = (size - drawH) / 2 + cropOffset.y * ratio;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCroppedGiftBlob(blob);
          setCroppedGiftPreview(URL.createObjectURL(blob));
          setShowSquareCropper(false);
        }
      },
      "image/webp",
      0.92,
    );
  };

  const handleAddGift = async (e) => {
    e.preventDefault();
    const fallbackGiftName = giftNames.ku || giftNames.en || giftNames.ar || "";
    if (!fallbackGiftName.trim()) {
      setStatusMsg({
        type: "error",
        text: "تکایە ناوی دیارییەکە لانیکەم بە یەک زمان بنووسە.",
      });
      return;
    }

    try {
      const formData = new FormData();
      if (giftIconType === "image" && croppedGiftBlob) {
        formData.append("image", croppedGiftBlob, "gift-transparent.webp");
      }
      formData.append("giftName", fallbackGiftName.trim());
      formData.append("namesJson", JSON.stringify(giftNames));
      formData.append("iconType", giftIconType);
      formData.append("svgIconName", giftSvgName);
      formData.append("quantity", String(giftQuantity));
      formData.append("isAvailableNow", String(giftAvailableNow));
      formData.append("chancePercentage", String(giftChance));

      await api.post("/admin/gifts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGiftNames({ ku: "", ar: "", en: "" });
      setCroppedGiftBlob(null);
      setCroppedGiftPreview(null);
      setShowGiftForm(false);
      setStatusMsg({
        type: "success",
        text: "✅ دیارییە نوێیەکە زیاد کرا بۆ کۆگای خوارەوە!",
      });
      fetchAllEngineData();
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "هەڵە لە زیادکردنی دیاری.",
      });
    }
  };

  const handleDeleteGift = async (giftId, name) => {
    if (!window.confirm(`ئایا دڵنیایت لە سڕینەوەی (${name})؟`)) return;
    try {
      await api.delete(`/admin/gifts/${giftId}`);
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
    } catch (err) {
      setStatusMsg({ type: "error", text: "هەڵە لە سڕینەوەی دیاری." });
    }
  };

  if (isLoading) {
    return (
      <div className="sc-admin-prize-loading">
        چاوەڕوان بە... زانیارییەکانی بۆکس و دیارییەکان دەهێنرێت...
      </div>
    );
  }

  return (
    <div className="sc-admin-prize-engine" dir="rtl">
      {statusMsg.text && (
        <div
          className={`sc-admin-prize-alert sc-admin-prize-alert--${statusMsg.type}`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* ====================================================================
          ١. بەڕێوەبردنی بۆکسەکان (ڕەنگی تەواوی بۆکس + هەڵبژاردنی ئۆفەر + هەڵبژاردنی دیاری)
         ==================================================================== */}
      <div className="sc-admin-prize-section">
        <div className="sc-admin-prize-section__head">
          <div>
            <h3>📦 بەڕێوەبردنی بۆکسەکانی سوپەر کارت ({boxes.length})</h3>
            <span>
              دەتوانیت بۆ هەر بۆکسێک ڕەنگی تایبەت، ئۆفەری تایبەت و دیاریی تایبەت
              بە خۆی دیاری بکەیت
            </span>
          </div>
          <Button type="button" variant="gold" onClick={openNewBoxForm}>
            + زیادکردنی بۆکسی نوێ
          </Button>
        </div>

        {showBoxForm && (
          <form
            onSubmit={handleSaveBox}
            className="sc-admin-box-form"
            style={{ borderColor: boxColor }}
          >
            <div className="sc-admin-box-form__top">
              <h4 style={{ color: boxColor }}>
                {editingBoxId
                  ? `✏️ دەستکاریکردنی بۆکس (#${editingBoxId})`
                  : "➕ دروستکردنی بۆکسی نوێ"}
              </h4>
              <button
                type="button"
                className="sc-admin-del-btn"
                onClick={() => setShowBoxForm(false)}
              >
                ✕ داخستن
              </button>
            </div>

            {/* هەڵبژاردنی ڕەنگی گشتیی بۆکس */}
            <div className="sc-admin-color-picker">
              <label>
                🎨 ڕەنگی تایبەتی ئەم بۆکسە هەڵبژێرە (هەموو ئایکۆن و دوگمە و
                چوارچێوەکانی ناو بۆکسەکە دەبێتە ئەم ڕەنگە):
              </label>
              <div className="sc-admin-color-swatches">
                {BOX_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    className={`sc-admin-color-pill ${
                      boxColor === preset.hex ? "is-selected" : ""
                    }`}
                    style={{ "--swatch-color": preset.hex }}
                    onClick={() => setBoxColor(preset.hex)}
                  >
                    <span className="sc-admin-color-dot" />
                    <span>{preset.label}</span>
                  </button>
                ))}
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  title="ڕەنگی دڵخواز"
                  className="sc-admin-color-input"
                />
              </div>
            </div>

            {/* ناوی بۆکس و دیسکریپشنی بۆکس بە هەر ٣ زمانەکە */}
            <div className="sc-admin-lang-grid">
              {["ku", "ar", "en"].map((lang) => (
                <div key={lang} className="sc-admin-lang-box">
                  <strong style={{ color: boxColor }}>
                    {lang === "ku"
                      ? "کوردی (KU)"
                      : lang === "ar"
                        ? "عربي (AR)"
                        : "English (EN)"}
                  </strong>
                  <input
                    type="text"
                    dir={lang === "en" ? "ltr" : "rtl"}
                    placeholder={`ناوی بۆکس (${lang.toUpperCase()})`}
                    value={boxTitles[lang] || ""}
                    onChange={(e) =>
                      setBoxTitles((p) => ({ ...p, [lang]: e.target.value }))
                    }
                    className="sc-admin-input"
                  />
                  <textarea
                    rows={2}
                    dir={lang === "en" ? "ltr" : "rtl"}
                    placeholder={`دیسکریپشنی بۆکس (${lang.toUpperCase()})`}
                    value={boxDescs[lang] || ""}
                    onChange={(e) =>
                      setBoxDescs((p) => ({ ...p, [lang]: e.target.value }))
                    }
                    className="sc-admin-textarea"
                  />
                </div>
              ))}
            </div>

            {/* نرخ و تایمەری داشکاندن */}
            <div className="sc-admin-fields-grid">
              <div>
                <label>نرخی بنەڕەتی بۆکس (IQD):</label>
                <input
                  type="number"
                  dir="ltr"
                  value={boxPrice}
                  onChange={(e) => setBoxPrice(Number(e.target.value))}
                  className="sc-admin-input"
                />
              </div>

              <div>
                <label>داشکاندن و تایمەر:</label>
                <select
                  value={boxDiscountActive ? "true" : "false"}
                  onChange={(e) =>
                    setBoxDiscountActive(e.target.value === "true")
                  }
                  className="sc-admin-input"
                >
                  <option value="false">بێ داشکاندن</option>
                  <option value="true">چالاککردنی داشکاندن بە تایمەر</option>
                </select>
              </div>

              {boxDiscountActive && (
                <>
                  <div>
                    <label>ڕێژەی داشکاندن (%):</label>
                    <input
                      type="number"
                      min="1"
                      max="95"
                      dir="ltr"
                      value={boxDiscountPercent}
                      onChange={(e) =>
                        setBoxDiscountPercent(Number(e.target.value))
                      }
                      className="sc-admin-input"
                    />
                  </div>
                  <div>
                    <label>ماوەی تایمەری داشکاندن (بە ڕۆژ):</label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      dir="ltr"
                      value={boxDiscountDays}
                      onChange={(e) =>
                        setBoxDiscountDays(Number(e.target.value))
                      }
                      className="sc-admin-input"
                    />
                  </div>
                </>
              )}
            </div>

            {/* هەڵبژاردنی ئۆفەرەکان و هەڵبژاردنی دیارییەکانی ناو ئەم بۆکسە */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                <input
                  type="checkbox"
                  checked={boxIncludesReward}
                  onChange={(e) => setBoxIncludesReward(e.target.checked)}
                />
                <span>ئەم بۆکسە دیاری لەگەڵدایە؟</span>
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="sc-admin-edit-btn"
                  style={{
                    borderColor: boxColor,
                    color: boxColor,
                    padding: "8px 14px",
                  }}
                  onClick={() => setShowOfferPickerModal(true)}
                >
                  🎯 دیاریکردنی ئۆفەرەکانی بۆکس (
                  {boxOfferIds.length === 0
                    ? "هەمووی"
                    : `${boxOfferIds.length} ئۆفەر`}
                  )
                </button>

                {boxIncludesReward && (
                  <button
                    type="button"
                    className="sc-admin-edit-btn"
                    style={{
                      borderColor: boxColor,
                      color: boxColor,
                      padding: "8px 14px",
                    }}
                    onClick={() => setShowGiftPickerModal(true)}
                  >
                    🎁 دیاریکردنی دیارییەکانی ئەم بۆکسە (
                    {boxGiftIds.length === 0
                      ? "هەمووی"
                      : `${boxGiftIds.length} دیاری`}
                    )
                  </button>
                )}

                <button
                  type="submit"
                  className="sc-admin-turquoise-btn"
                  style={{ background: boxColor, color: "#060b13" }}
                >
                  💾 پاشەکەوتکردنی بۆکس
                </button>
              </div>
            </div>
          </form>
        )}

        {/* لیستی بۆکسەکان */}
        <div className="sc-admin-boxes-list">
          {boxes.map((box) => {
            const bColor = box.box_color || "#00e5c9";
            return (
              <div
                key={box.id}
                className="sc-admin-box-item"
                style={{ "--item-box-color": bColor }}
              >
                <div className="sc-admin-box-item__head">
                  <strong style={{ color: bColor }}>
                    {box.titles?.ku || box.plan_name}
                  </strong>
                  <span
                    className="sc-admin-box-item__color-tag"
                    style={{ background: bColor }}
                  />
                </div>

                <div
                  className="sc-admin-box-item__price"
                  style={{ color: bColor }}
                >
                  {Number(box.base_price).toLocaleString()} د.ع
                  {Boolean(box.is_discount_active) && (
                    <small> (-{box.discount_percent}%)</small>
                  )}
                </div>

                <div className="sc-admin-box-item__meta">
                  <span>کڕدراو: {box.sold_count || 0}</span>
                  <span>•</span>
                  <span>
                    {box.included_offers?.length > 0
                      ? `${box.included_offers.length} ئۆفەر`
                      : "هەموو ئۆفەرەکان"}
                  </span>
                  <span>•</span>
                  <span>
                    {box.included_gifts?.length > 0
                      ? `${box.included_gifts.length} دیاری`
                      : "هەموو دیارییەکان"}
                  </span>
                </div>

                <div className="sc-admin-box-item__btns">
                  <button
                    type="button"
                    onClick={() => openEditBoxForm(box)}
                    className="sc-admin-edit-btn"
                    style={{ borderColor: bColor, color: bColor }}
                  >
                    ✏️ دەستکاری
                  </button>
                  {box.id !== 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBox(box.id, box.plan_name)}
                      className="sc-admin-del-btn"
                    >
                      🗑️ سڕینەوە
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          ٢. بەشی خوارەوە: کۆگای دیارییەکان (زیادکردنی دیاری و دواتر هەڵبژاردنیان لەناو هەر بۆکسێکدا)
         ==================================================================== */}
      <div className="sc-admin-prize-section">
        <div className="sc-admin-prize-section__head">
          <div>
            <h3>🎁 کۆگای گشتیی دیارییەکان ({gifts.length})</h3>
            <span>
              لێرە دیارییەکان زیاد بکە، پاشان لە سەرەوە لەناو هەر بۆکسێکدا دیاری
              بکە کام لەم دیارییانەی تێدابێت
            </span>
          </div>
          <button
            type="button"
            className="sc-admin-turquoise-btn"
            onClick={() => setShowGiftForm(!showGiftForm)}
          >
            {showGiftForm ? "✕ داخستن" : "+ زیادکردنی دیاری نوێ"}
          </button>
        </div>

        {showGiftForm && (
          <form onSubmit={handleAddGift} className="sc-admin-gift-form">
            <div className="sc-admin-lang-grid">
              {["ku", "ar", "en"].map((lang) => (
                <div key={lang} className="sc-admin-lang-box">
                  <label>ناوی دیاری ({lang.toUpperCase()}):</label>
                  <input
                    type="text"
                    dir={lang === "en" ? "ltr" : "rtl"}
                    placeholder={
                      lang === "en"
                        ? "e.g. iPhone 18 / 10,000 IQD"
                        : "نموونە: ئایفۆن ١٨ / ١٠,٠٠٠ دینار"
                    }
                    value={giftNames[lang] || ""}
                    onChange={(e) =>
                      setGiftNames((p) => ({ ...p, [lang]: e.target.value }))
                    }
                    className="sc-admin-input"
                  />
                </div>
              ))}
            </div>

            <div className="sc-admin-visual-type-switch">
              <button
                type="button"
                className={`sc-admin-type-pill ${
                  giftIconType === "svg" ? "is-active" : ""
                }`}
                onClick={() => setGiftIconType("svg")}
              >
                ئایکۆنی مۆدێرنی SVG
              </button>
              <button
                type="button"
                className={`sc-admin-type-pill ${
                  giftIconType === "image" ? "is-active" : ""
                }`}
                onClick={() => setGiftIconType("image")}
              >
                بارکردنی وێنە (بێ باکگراوند یان ئاسایی تا 25MB)
              </button>
            </div>

            {giftIconType === "svg" ? (
              <div className="sc-admin-svg-Selector">
                <label>ئایکۆنێکی مۆدێرن هەڵبژێرە:</label>
                <div className="sc-admin-svg-grid">
                  {GIFT_SVG_CATALOG.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`sc-admin-svg-card ${
                        giftSvgName === item.id ? "is-selected" : ""
                      }`}
                      onClick={() => setGiftSvgName(item.id)}
                    >
                      <div className="sc-admin-svg-card__icon">
                        <GiftSvgIcon
                          iconType="svg"
                          svgName={item.id}
                          size={28}
                        />
                      </div>
                      <span>{item.labelKu}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="sc-admin-image-uploader">
                <label>
                  وێنەی دیاری هەڵبژێرە (PNG بێ باکگراوند یان JPG تا قەبارەی
                  25MB):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGiftImageSelect}
                />
                {croppedGiftPreview && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "10px",
                    }}
                  >
                    <div className="sc-admin-transparent-preview">
                      <img src={croppedGiftPreview} alt="Gift Preview" />
                    </div>
                    <button
                      type="button"
                      className="sc-admin-turquoise-btn"
                      onClick={() => setShowSquareCropper(true)}
                    >
                      دووبارە بڕین (1:1)
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="sc-admin-fields-grid">
              <div>
                <label>بڕ / ژمارەی دانە (1 تا 9999):</label>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  dir="ltr"
                  value={giftQuantity}
                  onChange={(e) =>
                    setGiftQuantity(
                      Math.min(9999, Math.max(1, Number(e.target.value))),
                    )
                  }
                  className="sc-admin-input"
                />
              </div>

              <div>
                <label>دۆخی بەردەستبوون:</label>
                <select
                  value={giftAvailableNow ? "true" : "false"}
                  onChange={(e) =>
                    setGiftAvailableNow(e.target.value === "true")
                  }
                  className="sc-admin-input"
                >
                  <option value="true">ئێستا بەردەستە</option>
                  <option value="false">ڕاگیراوە</option>
                </select>
              </div>
            </div>

            <div className="sc-admin-chance-slider-box">
              <div className="sc-admin-chance-slider-box__head">
                <span>ڕێژەی چانسی دەرچوون (0.01% تا 100%):</span>
                <strong>{Number(giftChance).toFixed(2)}%</strong>
              </div>
              <div className="sc-admin-chance-slider-box__controls" dir="ltr">
                <input
                  type="range"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={giftChance}
                  onChange={(e) => setGiftChance(parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={giftChance}
                  onChange={(e) =>
                    setGiftChance(
                      Math.min(
                        100,
                        Math.max(0.01, parseFloat(e.target.value) || 0.01),
                      ),
                    )
                  }
                  className="sc-admin-chance-num"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="sc-admin-turquoise-btn">
                پاشەکەوتکردنی دیاری
              </button>
            </div>
          </form>
        )}

        <div className="sc-admin-gifts-grid">
          {gifts.map((g) => (
            <div key={g.id} className="sc-admin-gift-item">
              <div className="sc-admin-gift-item__visual">
                <GiftSvgIcon
                  iconType={g.icon_type}
                  svgName={g.svg_icon_name}
                  imageUrl={resolveAssetUrl(g.image_url)}
                  alt={g.gift_name}
                  size={30}
                />
              </div>

              <div className="sc-admin-gift-item__info">
                <strong>{g.names?.ku || g.gift_name}</strong>
                <span>چانس: {Number(g.chance_percentage).toFixed(2)}%</span>
                <small>ماوە: {g.remaining_stock} دانە</small>
              </div>

              <button
                type="button"
                className="sc-admin-del-btn"
                onClick={() => handleDeleteGift(g.id, g.gift_name)}
              >
                سڕینەوە
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* مۆداڵی دیاریکردنی ئۆفەرەکانی ناو بۆکس */}
      {showOfferPickerModal && (
        <div className="sc-admin-modal-backdrop">
          <div className="sc-admin-modal" style={{ borderColor: boxColor }}>
            <h4 style={{ color: boxColor, marginTop: 0 }}>
              🎯 دیاریکردنی ئۆفەرەکانی ناو ئەم بۆکسە
            </h4>
            <div className="sc-admin-modal__list">
              {allOffers.map((off) => {
                const isChecked = boxOfferIds.includes(off.id);
                return (
                  <label
                    key={off.id}
                    className={`sc-admin-offer-check ${
                      isChecked ? "is-checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOfferInBox(off.id)}
                    />
                    <span>
                      {off.title} ({off.center_name_en})
                    </span>
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              className="sc-admin-turquoise-btn"
              style={{ width: "100%", background: boxColor }}
              onClick={() => setShowOfferPickerModal(false)}
            >
              ✓ پەسەندکردن
            </button>
          </div>
        </div>
      )}

      {/* مۆداڵی دیاریکردنی دیارییەکانی ناو بۆکس */}
      {showGiftPickerModal && (
        <div className="sc-admin-modal-backdrop">
          <div className="sc-admin-modal" style={{ borderColor: boxColor }}>
            <h4 style={{ color: boxColor, marginTop: 0 }}>
              🎁 دیاریکردنی دیارییەکانی تایبەت بەم بۆکسە
            </h4>
            <p style={{ color: "#cbd5e1", fontSize: "0.82rem", margin: 0 }}>
              ئەو دیارییانە هەڵبژێرە کە دەتەوێت تەنها لەناو ئەم بۆکسەدا
              دەربکەون:
            </p>
            <div className="sc-admin-modal__list">
              {gifts.map((g) => {
                const isChecked = boxGiftIds.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`sc-admin-offer-check ${
                      isChecked ? "is-checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleGiftInBox(g.id)}
                    />
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: boxColor,
                        padding: "4px",
                      }}
                    >
                      <GiftSvgIcon
                        iconType={g.icon_type}
                        svgName={g.svg_icon_name}
                        imageUrl={resolveAssetUrl(g.image_url)}
                        alt={g.gift_name}
                        size={22}
                      />
                    </div>
                    <span>
                      {g.names?.ku || g.gift_name} (ماوە: {g.remaining_stock})
                    </span>
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              className="sc-admin-turquoise-btn"
              style={{ width: "100%", background: boxColor }}
              onClick={() => setShowGiftPickerModal(false)}
            >
              ✓ پەسەندکردن
            </button>
          </div>
        </div>
      )}

      {/* مۆداڵی بڕینی چوارگۆشەیی وێنەی دیاری */}
      {showSquareCropper && rawGiftImg && (
        <div className="sc-admin-modal-backdrop">
          <div className="sc-admin-modal sc-admin-modal--cropper">
            <h4>بڕینی وێنەی دیاری (1:1 - پاراستنی بێ باکگراوندی)</h4>
            <div
              className="sc-admin-transparent-crop-stage"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              <img
                src={rawGiftImg}
                alt="Crop"
                draggable={false}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px)) scale(${cropZoom})`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  pointerEvents: "none",
                }}
              />
            </div>

            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={cropZoom}
              onChange={(e) => setCropZoom(parseFloat(e.target.value))}
              style={{ width: "100%", margin: "12px 0" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="sc-admin-turquoise-btn"
                style={{ flex: 1 }}
                onClick={applySquareCrop}
              >
                پەسەندکردن (1:1)
              </button>
              <button
                type="button"
                className="sc-admin-del-btn"
                onClick={() => setShowSquareCropper(false)}
              >
                داخستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
