/**
 * ============================================================================
 * File: src/components/admin/OfferCMSForm.jsx
 * Description: 3:4 Offer CMS Builder with Zero `locale` Dependency, Crash
 *              Recovery Drafts, First-Step 3:4 Image Cropper, and Live Preview.
 * Usage / Imported By: src/pages/AdminDashboard.jsx
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import Button from "../common/Button/Button";
import api from "../../services/api";
import "../../styles/components/_offer-cms-form.scss";

const DRAFT_STORAGE_KEY = "sc_admin_offer_cms_draft_v3";

// فەرهەنگی ناوخۆیی سەربەخۆ بە هەر ٣ زمانەکە بۆ ئەوەی هەرگیز هەڵەی locale نەدات
const CMS_TEXTS = {
  ku: {
    add_offer: "دروستکردنی ئۆفەری نوێ (3:4)",
    draft_found_title: "داتای پاشەکەوتکراوی پێشوو دۆزرایەوە!",
    draft_found_desc:
      "ئایا دەتەوێت ئەو نووسینانەی پێش ڕیفرێشکردن نووسیبووت بیانگەڕێنیتەوە؟",
    restore_yes: "بەڵێ، بیگەڕێنەوە",
    restore_no: "نەخێر، فۆڕمی نوێ",
    step1_upload_title: "١. بارکردنی وێنەی ئۆفەر (قەبارەی ستانداردی 3:4)",
    step1_upload_hint:
      "وێنەیەک هەڵبژێرە (کەمتر لە 2MB) و بە دڵی خۆت بە ڕێژەی 3:4 بیبڕە",
    recrop_btn: "دووبارە بڕین و ڕێکخستنی وێنەکە (3:4)",
    step2_select_lang:
      "٢. زمانی نووسین هەڵبژێرە (دەتوانیت ١، ٢ یان هەر ٣ زمانەکە دیاری بکەیت)",
    select_lang_warning:
      "تکایە سەرەتا لە سەرەوە کلیک لەسەر زمانێک یان زیاتر بکە بۆ کردنەوەی خانەکانی نووسین.",
    step3_general_info: "٣. زانیارییە گشتییەکان (بێ وەرگێڕان)",
    center_name_en_label: "ناوی سەنتەر (تەنها بە ئینگلیزی - CAPITAL LETTERS)",
    phone_label: "ژمارەی مۆبایلی سەنتەر",
    price_label: "نرخی ئۆفەر بە دینار (IQD)",
    text_bg_toggle_label:
      "پاشبنەما بۆ تێکستەکانی سەر وێنە (بادجی سەرەوە لای ڕاست و فیچەرەکانی خوارەوە هەمیشە پاشبنەمایان هەیە)",
    text_bg_yes: "بەڵێ، بە پاشبنەماوە",
    text_bg_no: "نەخێر، بێ پاشبنەما (تەنها تێکست)",
    lang_section_title: "خانەکانی نووسین بە زمانی",
    copy_ku_to_ar: "کۆپیکردنی تایتڵی کوردی بۆ عەرەبی",
    left_badge_label:
      "بادجی سەرەوە لای چەپ (جۆری کار: لێزەری پێست، غەسلی ئۆتۆمبێل، پڕکردنەوەی ددان)",
    right_badge_label:
      "بادجی سەرەوە لای ڕاست (ڕێژەی داشکاندن یان خۆڕایی: FREE 100% / 20% OFF)",
    offer_title_label:
      "تایتڵی ئۆفەر (تەنها لەسەر وێنەکە لە ژێر ناوی سەنتەر دەردەکەوێت)",
    offer_title_hint: "باشترە لە ٥ وشە کەمتر بێت بۆ جوانیی دیزاینەکە",
    location_label:
      "ناونیشانی شوێن (تەنها لە بەشی خوارەوەی دەرەوەی وێنەکە دەردەکەوێت)",
    description_label:
      "دیسکریپشن (تەنها لە بەشی خوارەوەی دەرەوەی وێنەکە دەردەکەوێت)",
    step4_features_title:
      "٤. تایبەتمەندییەکانی خوارەوەی ناو وێنە (سکرۆڵ بۆ چەپ و ڕاست)",
    add_feature_btn: "+ زیادکردنی تایبەتمەندی",
    feature_item_label: "تایبەتمەندی",
    delete: "سڕینەوە",
    save: "پاشەکەوتکردنی ئۆفەر",
    saving: "لە کاتی پاشەکەوتکردندایە...",
    live_preview_title: "پێشبینینی ڕاستەوخۆ (Live Preview)",
    cropper_title: "بڕینی وێنە بە قەبارەی 3:4",
    cropper_hint:
      "بە ماوس یان پەنجە وێنەکە بجوڵێنە بۆ دیاریکردنی چوارچێوەی بڕینەکە",
    cropper_zoom: "نزیککردنەوە (Zoom)",
    cropper_apply: "بڕین و پەسەندکردن (3:4)",
    cropper_cancel: "پاشگەزبوونەوە",
  },
  ar: {
    add_offer: "إنشاء عرض جديد (3:4)",
    draft_found_title: "تم العثور على بيانات محفوظة مسبقاً!",
    draft_found_desc: "هل تريد استعادة النصوص التي كتبتها قبل تحديث الصفحة؟",
    restore_yes: "نعم، استعادة البيانات",
    restore_no: "لا، بدء نموذج جديد",
    step1_upload_title: "١. رفع صورة العرض (حجم قياسي 3:4)",
    step1_upload_hint: "اختر صورة (أقل من 2MB) وقم بقصها بنسبة 3:4",
    recrop_btn: "إعادة قص وضبط الصورة (3:4)",
    step2_select_lang:
      "٢. اختر لغات الإدخال (يمكنك اختيار لغة واحدة أو اثنتين أو الثلاث لغات)",
    select_lang_warning:
      "يرجى النقر على لغة واحدة على الأقل في الأعلى لإظهار حقول الإدخال.",
    step3_general_info: "٣. المعلومات الأساسية العامة",
    center_name_en_label: "اسم المركز (بالإنجليزية فقط - CAPITAL LETTERS)",
    phone_label: "رقم هاتف المركز",
    price_label: "سعر العرض بالدينار (IQD)",
    text_bg_toggle_label:
      "خلفية للنصوص فوق الصورة (الشارة العلوية اليمنى والمميزات السفلية تحتفظ بخلفية دائماً)",
    text_bg_yes: "نعم، مع خلفية",
    text_bg_no: "لا، بدون خلفية (نص فقط)",
    lang_section_title: "حقول الإدخال باللغة",
    copy_ku_to_ar: "نسخ العنوان الكردي إلى العربية",
    left_badge_label:
      "الشارة العلوية اليسرى (نوع العمل: ليزر، غسيل سيارات، تجميل أسنان)",
    right_badge_label:
      "الشارة العلوية اليمنى (مجاني أو نسبة الخصم: FREE 100% / 20% OFF)",
    offer_title_label: "عنوان العرض (يظهر وسط الصورة تحت اسم المركز)",
    offer_title_hint: "يفضل أن يكون أقل من 5 كلمات لمظهر أفضل",
    location_label: "عنوان الموقع (يظهر فقط في القسم السفلي خارج الصورة)",
    description_label: "الوصف التفصيلي (يظهر في القسم السفلي خارج الصورة)",
    step4_features_title:
      "٤. المميزات السفلية داخل الصورة (قابلة للتمرير يميناً ويساراً)",
    add_feature_btn: "+ إضافة ميزة",
    feature_item_label: "الميزة",
    delete: "حذف",
    save: "حفظ العرض",
    saving: "جاري الحفظ...",
    live_preview_title: "المعاينة المباشرة (Live Preview)",
    cropper_title: "قص الصورة بنسبة 3:4",
    cropper_hint: "اسحب الصورة بالماوس أو الإصبع لضبط منطقة القص",
    cropper_zoom: "تكبير / تصغير (Zoom)",
    cropper_apply: "قص وتأكيد (3:4)",
    cropper_cancel: "إلغاء",
  },
  en: {
    add_offer: "Create New Offer (3:4)",
    draft_found_title: "Unsaved Draft Data Found!",
    draft_found_desc:
      "Would you like to restore the inputs you entered before the page refreshed?",
    restore_yes: "Yes, Restore Data",
    restore_no: "No, Start Fresh",
    step1_upload_title: "1. Upload Offer Image (3:4 Aspect Ratio)",
    step1_upload_hint: "Select an image (max 2MB) and crop it to 3:4 format",
    recrop_btn: "Re-crop & Adjust Image (3:4)",
    step2_select_lang:
      "2. Select Input Languages (Choose 1, 2, or all 3 languages)",
    select_lang_warning:
      "Please select at least one language above to display the form inputs.",
    step3_general_info: "3. Core Offer Settings",
    center_name_en_label: "Center Name (English Only - Auto Capitalized)",
    phone_label: "Center Phone Number",
    price_label: "Single Offer Price (IQD)",
    text_bg_toggle_label:
      "Background behind overlay texts (Top-Right badge & bottom features always keep background)",
    text_bg_yes: "Yes, Show Pill Background",
    text_bg_no: "No, Transparent Text Only",
    lang_section_title: "Localized Inputs for",
    copy_ku_to_ar: "Copy Kurdish Title to Arabic",
    left_badge_label:
      "Top-Left Specialty Tag (e.g., Skin Laser, Car Wash, Dental Filling)",
    right_badge_label: "Top-Right Offer Badge (e.g., FREE 100% or 20% OFF)",
    offer_title_label: "Offer Title (Displayed on image below Center Name)",
    offer_title_hint: "Recommended: Keep under 5 words for best visual balance",
    location_label:
      "Location Address (Displayed only in bottom box outside image)",
    description_label: "Description (Displayed in bottom box outside image)",
    step4_features_title: "4. Bottom Scrollable Features (Swipe Left & Right)",
    add_feature_btn: "+ Add Feature Pill",
    feature_item_label: "Feature",
    delete: "Delete",
    save: "Save Changes",
    saving: "Saving Offer...",
    live_preview_title: "Live Card Preview",
    cropper_title: "Crop Image to 3:4 Ratio",
    cropper_hint: "Drag the image to position it inside the 3:4 frame",
    cropper_zoom: "Zoom Level",
    cropper_apply: "Apply 3:4 Crop",
    cropper_cancel: "Cancel",
  },
};

export default function OfferCMSForm({ onSave }) {
  const [uiLang, setUiLang] = useState("ku");
  const tr = (key) => CMS_TEXTS[uiLang]?.[key] || CMS_TEXTS.ku[key] || key;

  // ١. بارکردنی وێنەی 3:4 (لە سەرەتای فۆڕمەکەدا دانراوە)
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  // ٢. هەڵبژاردنی زمان (لە سەرەتادا هیچ زمانێک دیاری نەکراوە و ئینپوتەکان دەرناکەون)
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [previewLang, setPreviewLang] = useState("ku");

  // ٣. زانیارییە گشتییەکان
  const [centerNameEn, setCenterNameEn] = useState("");
  const [phone, setPhone] = useState("0750 377 6072");
  const [price, setPrice] = useState("7000");
  const [hasTextBg, setHasTextBg] = useState(false);

  // ٤. ئینپوتە تێکستییەکان بە هەر ٣ زمانەکە
  const [leftBadges, setLeftBadges] = useState({ ku: "", ar: "", en: "" });
  const [rightBadges, setRightBadges] = useState({
    ku: "FREE 100%",
    ar: "FREE 100%",
    en: "FREE 100%",
  });
  const [titles, setTitles] = useState({ ku: "", ar: "", en: "" });
  const [locations, setLocations] = useState({ ku: "", ar: "", en: "" });
  const [descriptions, setDescriptions] = useState({ ku: "", ar: "", en: "" });

  // ٥. لیستی فیچەرەکانی خوارەوەی وێنە
  const [features, setFeatures] = useState([
    {
      id: 1,
      ku: "شوشتنی ددان بە خۆڕایی",
      ar: "غسيل الأسنان مجاناً",
      en: "Free Scaling",
    },
    { id: 2, ku: "پشکنین بە خۆڕایی", ar: "فحص مجاني", en: "Free Checkup" },
    { id: 3, ku: "15% داشکاندن", ar: "خصم 15%", en: "15% Discount" },
  ]);

  // ٦. گەڕاندنەوەی داتا لە کاتی ڕیفرێش بوونەوە
  const [savedDraftData, setSavedDraftData] = useState(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageObjRef = useRef(null);

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        const hasContent =
          parsed.centerNameEn ||
          parsed.selectedLangs?.length > 0 ||
          parsed.titles?.ku ||
          parsed.titles?.en;
        if (hasContent) {
          setSavedDraftData(parsed);
          setShowRestorePrompt(true);
        }
      }
    } catch (e) {
      console.error("Failed to read draft", e);
    }
  }, []);

  useEffect(() => {
    if (showRestorePrompt) return;
    const draftPayload = {
      selectedLangs,
      centerNameEn,
      phone,
      price,
      hasTextBg,
      leftBadges,
      rightBadges,
      titles,
      locations,
      descriptions,
      features,
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
  }, [
    selectedLangs,
    centerNameEn,
    phone,
    price,
    hasTextBg,
    leftBadges,
    rightBadges,
    titles,
    locations,
    descriptions,
    features,
    showRestorePrompt,
  ]);

  const handleRestoreDraft = () => {
    if (savedDraftData) {
      setSelectedLangs(savedDraftData.selectedLangs || []);
      setCenterNameEn(savedDraftData.centerNameEn || "");
      setPhone(savedDraftData.phone || "0750 377 6072");
      setPrice(savedDraftData.price || "7000");
      setHasTextBg(Boolean(savedDraftData.hasTextBg));
      setLeftBadges(savedDraftData.leftBadges || { ku: "", ar: "", en: "" });
      setRightBadges(
        savedDraftData.rightBadges || {
          ku: "FREE 100%",
          ar: "FREE 100%",
          en: "FREE 100%",
        },
      );
      setTitles(savedDraftData.titles || { ku: "", ar: "", en: "" });
      setLocations(savedDraftData.locations || { ku: "", ar: "", en: "" });
      setDescriptions(
        savedDraftData.descriptions || { ku: "", ar: "", en: "" },
      );
      if (Array.isArray(savedDraftData.features)) {
        setFeatures(savedDraftData.features);
      }
    }
    setShowRestorePrompt(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setSavedDraftData(null);
    setShowRestorePrompt(false);
  };

  const toggleLanguageSelection = (code) => {
    setSelectedLangs((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code],
    );
  };

  const copyKurdishTitleToArabic = () => {
    if (!selectedLangs.includes("ar")) {
      setSelectedLangs((prev) => [...prev, "ar"]);
    }
    setTitles((prev) => ({ ...prev, ar: prev.ku }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setStatusMsg({
        type: "error",
        text: "قەبارەی وێنەکە نابێت لە 2MB زیاتر بێت!",
      });
      return;
    }

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
    const targetW = 900;
    const targetH = 1200;
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#060b13";
    ctx.fillRect(0, 0, targetW, targetH);

    const img = imageObjRef.current;
    const baseScale = Math.max(targetW / img.width, targetH / img.height);
    const finalScale = baseScale * cropZoom;

    const drawW = img.width * finalScale;
    const drawH = img.height * finalScale;
    const ratioMultiplier = targetW / 300;
    const drawX = (targetW - drawW) / 2 + cropOffset.x * ratioMultiplier;
    const drawY = (targetH - drawH) / 2 + cropOffset.y * ratioMultiplier;

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

  const addFeatureItem = () => {
    setFeatures((prev) => [
      ...prev,
      { id: Date.now(), ku: "", ar: "", en: "" },
    ]);
  };

  const updateFeatureItem = (id, langKey, val) => {
    setFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [langKey]: val } : item)),
    );
  };

  const removeFeatureItem = (id) => {
    setFeatures((prev) => prev.filter((item) => item.id !== id));
  };

  const getLocalized = (obj, fallback = "") => {
    if (!obj) return fallback;
    return obj[previewLang] || obj.ku || obj.en || obj.ar || fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (!croppedBlob) {
      setStatusMsg({
        type: "error",
        text: "تکایە سەرەتا وێنەی ئۆفەرەکە بە قەبارەی 3:4 بار بکە و بیبڕە.",
      });
      return;
    }

    if (selectedLangs.length === 0) {
      setStatusMsg({
        type: "error",
        text: tr("select_lang_warning"),
      });
      return;
    }

    if (!centerNameEn.trim()) {
      setStatusMsg({
        type: "error",
        text: "تکایە ناوی سەنتەر بە ئینگلیزی بنووسە.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("image", croppedBlob, "offer-3x4.webp");
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

      const res = await api.post("/admin/offers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setStatusMsg({
        type: "success",
        text: "✅ ئۆفەرەکە بە سەرکەوتوویی لە داتابەیس پاشەکەوت کرا!",
      });

      if (onSave) onSave(res.data);
    } catch (err) {
      setStatusMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "هەڵەیەک لە کاتی پاشەکەوتکردن ڕوویدا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="offer-cms" dir={uiLang === "en" ? "ltr" : "rtl"}>
      <div className="offer-cms__header">
        <h3 className="offer-cms__title">✨ {tr("add_offer")}</h3>

        {/* دوگمەی گۆڕینی زمانی ڕووکاری فۆڕمی ئادمین */}
        <div className="offer-cms__lang-pills">
          {["ku", "ar", "en"].map((l) => (
            <button
              key={l}
              type="button"
              className={`offer-cms__lang-btn ${
                uiLang === l ? "is-selected" : ""
              }`}
              onClick={() => {
                setUiLang(l);
                setPreviewLang(l);
              }}
            >
              {l === "ku" ? "کوردی" : l === "ar" ? "عربي" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {/* ئاگادارکردنەوەی گەڕاندنەوەی داتا لە دوای ڕیفرێش */}
      {showRestorePrompt && (
        <div className="offer-cms__draft-banner">
          <div className="offer-cms__draft-banner-text">
            <strong>⚠️ {tr("draft_found_title")}</strong>
            <span>{tr("draft_found_desc")}</span>
          </div>
          <div className="offer-cms__draft-banner-actions">
            <Button type="button" variant="gold" onClick={handleRestoreDraft}>
              ✓ {tr("restore_yes")}
            </Button>
            <button
              type="button"
              className="offer-cms__lang-btn"
              onClick={handleDiscardDraft}
            >
              ✕ {tr("restore_no")}
            </button>
          </div>
        </div>
      )}

      {statusMsg.text && (
        <div
          className={`offer-cms__status-alert offer-cms__status-alert--${statusMsg.type}`}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="offer-cms__grid">
        <form onSubmit={handleSubmit} className="offer-cms__form-col">
          {/* هەنگاوی ١: بارکردنی وێنەی 3:4 لە هەرە سەرەوە */}
          <div className="offer-cms__section-box offer-cms__section-box--highlight">
            <h4 className="offer-cms__section-title">
              📷 {tr("step1_upload_title")}
            </h4>
            <span className="offer-cms__hint">{tr("step1_upload_hint")}</span>

            <div className="offer-cms__upload-zone">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {croppedPreviewUrl && !showCropper && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    type="button"
                    className="offer-cms__copy-btn"
                    onClick={() => setShowCropper(true)}
                  >
                    ✂️ {tr("recrop_btn")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* هەنگاوی ٢: هەڵبژاردنی زمانەکان */}
          <div className="offer-cms__section-box offer-cms__section-box--highlight">
            <h4 className="offer-cms__section-title">
              🌐 {tr("step2_select_lang")}
            </h4>
            <div className="offer-cms__lang-pills">
              {[
                { code: "ku", label: "کوردی (Kurdish)" },
                { code: "ar", label: "عربي (Arabic)" },
                { code: "en", label: "English (ئینگلیزی)" },
              ].map((lang) => {
                const isSelected = selectedLangs.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`offer-cms__lang-btn ${
                      isSelected ? "is-selected" : ""
                    }`}
                    onClick={() => toggleLanguageSelection(lang.code)}
                  >
                    {isSelected ? "✓ " : "+ "} {lang.label}
                  </button>
                );
              })}
            </div>

            {selectedLangs.length === 0 && (
              <p className="offer-cms__empty-notice">
                ⚠️ {tr("select_lang_warning")}
              </p>
            )}
          </div>

          {/* تەنها دوای هەڵبژاردنی زمان، ئینپوتەکان دەردەکەون */}
          {selectedLangs.length > 0 && (
            <>
              {/* هەنگاوی ٣: زانیارییە گشتییەکان */}
              <div className="offer-cms__section-box">
                <h4 className="offer-cms__section-title">
                  ⚙️ {tr("step3_general_info")}
                </h4>

                <div className="offer-cms__field">
                  <label>{tr("center_name_en_label")}:</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="KURD SMILE DENTAL"
                    value={centerNameEn}
                    onChange={(e) => {
                      const cleanEn = e.target.value
                        .replace(/[^\x00-\x7F]/g, "")
                        .toUpperCase();
                      setCenterNameEn(cleanEn);
                    }}
                    className="offer-cms__input offer-cms__input--english-caps"
                  />
                </div>

                <div className="offer-cms__field-row">
                  <div className="offer-cms__field">
                    <label>{tr("phone_label")}:</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="0750 377 6072"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="offer-cms__input"
                    />
                  </div>

                  <div className="offer-cms__field">
                    <label>{tr("price_label")}:</label>
                    <input
                      type="number"
                      dir="ltr"
                      placeholder="7000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="offer-cms__input"
                    />
                  </div>
                </div>

                <div className="offer-cms__field">
                  <label>{tr("text_bg_toggle_label")}:</label>
                  <div className="offer-cms__bg-toggle-row">
                    <button
                      type="button"
                      className={`offer-cms__toggle-pill ${
                        !hasTextBg ? "is-active" : ""
                      }`}
                      onClick={() => setHasTextBg(false)}
                    >
                      ✨ {tr("text_bg_no")}
                    </button>
                    <button
                      type="button"
                      className={`offer-cms__toggle-pill ${
                        hasTextBg ? "is-active" : ""
                      }`}
                      onClick={() => setHasTextBg(true)}
                    >
                      🎴 {tr("text_bg_yes")}
                    </button>
                  </div>
                </div>
              </div>

              {/* خانەکانی نووسین بۆ هەر زمانێک */}
              {selectedLangs.map((lang) => {
                const langLabel =
                  lang === "ku"
                    ? "کوردی (Kurdish)"
                    : lang === "ar"
                      ? "عربي (Arabic)"
                      : "English";

                return (
                  <div
                    key={lang}
                    className="offer-cms__section-box offer-cms__section-box--lang"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <h4 className="offer-cms__section-title">
                        🏳️ {tr("lang_section_title")}: {langLabel}
                      </h4>

                      {lang === "ku" && (
                        <button
                          type="button"
                          className="offer-cms__copy-btn"
                          onClick={copyKurdishTitleToArabic}
                        >
                          📋 {tr("copy_ku_to_ar")}
                        </button>
                      )}
                    </div>

                    <div className="offer-cms__field-row">
                      <div className="offer-cms__field">
                        <label>{tr("left_badge_label")}:</label>
                        <input
                          type="text"
                          dir={lang === "en" ? "ltr" : "rtl"}
                          placeholder={
                            lang === "en"
                              ? "Skin Laser / Car Wash"
                              : "لێزەری پێست / غەسلی ئۆتۆمبێل"
                          }
                          value={leftBadges[lang]}
                          onChange={(e) =>
                            setLeftBadges((prev) => ({
                              ...prev,
                              [lang]: e.target.value,
                            }))
                          }
                          className="offer-cms__input"
                        />
                      </div>

                      <div className="offer-cms__field">
                        <label>{tr("right_badge_label")}:</label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="FREE 100% / 20% OFF"
                          value={rightBadges[lang]}
                          onChange={(e) =>
                            setRightBadges((prev) => ({
                              ...prev,
                              [lang]: e.target.value,
                            }))
                          }
                          className="offer-cms__input"
                        />
                      </div>
                    </div>

                    <div className="offer-cms__field">
                      <label>{tr("offer_title_label")}:</label>
                      <span className="offer-cms__hint">
                        💡 {tr("offer_title_hint")}
                      </span>
                      <input
                        type="text"
                        dir={lang === "en" ? "ltr" : "rtl"}
                        placeholder={
                          lang === "en"
                            ? "VIP Dental Care Package"
                            : "پاکێجی تایبەتی جوانکاری و ددان"
                        }
                        value={titles[lang]}
                        onChange={(e) =>
                          setTitles((prev) => ({
                            ...prev,
                            [lang]: e.target.value,
                          }))
                        }
                        className="offer-cms__input"
                      />
                    </div>

                    <div className="offer-cms__field">
                      <label>{tr("location_label")}:</label>
                      <input
                        type="text"
                        dir={lang === "en" ? "ltr" : "rtl"}
                        placeholder={
                          lang === "en"
                            ? "Erbil - Gulan Street"
                            : "هەولێر - شەقامی گوڵان"
                        }
                        value={locations[lang]}
                        onChange={(e) =>
                          setLocations((prev) => ({
                            ...prev,
                            [lang]: e.target.value,
                          }))
                        }
                        className="offer-cms__input"
                      />
                    </div>

                    <div className="offer-cms__field">
                      <label>{tr("description_label")}:</label>
                      <textarea
                        rows={3}
                        dir={lang === "en" ? "ltr" : "rtl"}
                        placeholder={
                          lang === "en"
                            ? "Full details of the services and terms..."
                            : "وردەکاریی تەواوی ئۆفەرەکە لێرە بنووسە..."
                        }
                        value={descriptions[lang]}
                        onChange={(e) =>
                          setDescriptions((prev) => ({
                            ...prev,
                            [lang]: e.target.value,
                          }))
                        }
                        className="offer-cms__textarea"
                      />
                    </div>
                  </div>
                );
              })}

              {/* هەنگاوی ٤: تایبەتمەندییەکانی خوارەوەی ناو وێنە */}
              <div className="offer-cms__section-box">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <h4 className="offer-cms__section-title">
                    ⚡ {tr("step4_features_title")}
                  </h4>
                  <button
                    type="button"
                    className="offer-cms__copy-btn"
                    onClick={addFeatureItem}
                  >
                    {tr("add_feature_btn")}
                  </button>
                </div>

                {features.map((feat, idx) => (
                  <div key={feat.id} className="offer-cms__feature-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong style={{ color: "#ffc800", fontSize: "0.85rem" }}>
                        {tr("feature_item_label")} #{idx + 1}
                      </strong>
                      <button
                        type="button"
                        onClick={() => removeFeatureItem(feat.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ✕ {tr("delete")}
                      </button>
                    </div>

                    <div className="offer-cms__field-row">
                      {selectedLangs.map((lang) => (
                        <input
                          key={lang}
                          type="text"
                          dir={lang === "en" ? "ltr" : "rtl"}
                          placeholder={`Future ${idx + 1} (${lang.toUpperCase()})`}
                          value={feat[lang] || ""}
                          onChange={(e) =>
                            updateFeatureItem(feat.id, lang, e.target.value)
                          }
                          className="offer-cms__input"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                variant="gold"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? tr("saving") : `💾 ${tr("save")}`}
              </Button>
            </>
          )}
        </form>

        {/* ============================================================
            ستوونی چەپ: پێشبینینی ڕاستەوخۆ (LIVE PREVIEW)
           ============================================================ */}
        <div className="offer-cms__preview-col">
          <div className="offer-cms__preview-topbar">
            <strong style={{ color: "#00e5c9", fontSize: "0.9rem" }}>
              👁️ {tr("live_preview_title")}
            </strong>

            <div style={{ display: "flex", gap: "6px" }}>
              {["ku", "ar", "en"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setPreviewLang(l)}
                  style={{
                    background: previewLang === l ? "#ffc800" : "transparent",
                    color: previewLang === l ? "#060b13" : "#cbd5e1",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {l === "ku" ? "کوردی" : l === "ar" ? "عربي" : "EN"}
                </button>
              ))}
            </div>
          </div>

          <div
            className="offer-cms__preview-card"
            dir={previewLang === "en" ? "ltr" : "rtl"}
          >
            <div className="offer-cms__image-stage">
              {croppedPreviewUrl ? (
                <img src={croppedPreviewUrl} alt="3:4 Offer Preview" />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  📷 وێنەی 3:4 لێرە دەردەکەوێت
                </div>
              )}

              <div className="offer-cms__image-shade" />

              <div className="offer-cms__top-badges">
                <span
                  className={`offer-cms__left-work-tag ${
                    hasTextBg ? "has-bg" : "no-bg"
                  }`}
                >
                  {getLocalized(leftBadges, "لێزەری پێست / غەسل")}
                </span>

                <span className="offer-cms__right-discount-badge">
                  {getLocalized(rightBadges, "FREE 100%")}
                </span>
              </div>

              <div className="offer-cms__center-overlay">
                <div
                  className={`offer-cms__center-name-en ${
                    hasTextBg ? "has-bg" : "no-bg"
                  }`}
                >
                  {centerNameEn || "CENTER NAME"}
                </div>

                <div
                  className={`offer-cms__overlay-title ${
                    hasTextBg ? "has-bg" : "no-bg"
                  }`}
                >
                  {getLocalized(titles, "تایتڵی ئۆفەر لەسەر وێنە")}
                </div>
              </div>

              <div className="offer-cms__features-strip">
                {features.map((feat, i) => {
                  const text =
                    feat[previewLang] ||
                    feat.ku ||
                    feat.en ||
                    feat.ar ||
                    `Future ${i + 1}`;
                  return (
                    <span key={feat.id} className="offer-cms__feature-pill">
                      ✓ {text}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="offer-cms__outside-bottom">
              <p className="offer-cms__outside-desc">
                {getLocalized(
                  descriptions,
                  "دیسکریپشن و وردەکاریی ئۆفەرەکە لێرە لە دەرەوەی وێنەکە پیشان دەدرێت...",
                )}
              </p>

              <div className="offer-cms__outside-meta">
                <div className="offer-cms__meta-info">
                  <span>
                    📍 {getLocalized(locations, "هەولێر - شەقامی گوڵان")}
                  </span>
                  <span dir="ltr">📞 {phone || "0750 377 6072"}</span>
                </div>

                <div className="offer-cms__price-tag">
                  {Number(price || 0).toLocaleString()} د.ع
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCropper && rawImageSrc && (
        <div className="offer-cms__cropper-backdrop">
          <div className="offer-cms__cropper-modal">
            <h4 style={{ color: "#ffc800", marginTop: 0 }}>
              ✂️ {tr("cropper_title")}
            </h4>
            <p style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
              {tr("cropper_hint")}
            </p>

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
                alt="Crop Target"
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  fontSize: "0.8rem",
                  marginBottom: "6px",
                }}
              >
                🔍 {tr("cropper_zoom")}: {Math.round(cropZoom * 100)}%
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                type="button"
                variant="gold"
                fullWidth
                onClick={applyCrop3by4}
              >
                ✓ {tr("cropper_apply")}
              </Button>
              <button
                type="button"
                className="offer-cms__lang-btn"
                onClick={() => setShowCropper(false)}
              >
                {tr("cropper_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
