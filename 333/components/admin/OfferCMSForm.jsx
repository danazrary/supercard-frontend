/**
 * ============================================================================
 * File: src/components/admin/OfferCMSForm.jsx
 * Description: Create/edit form for partner-center offers in the Admin CMS.
 *              Handles title, description, category, discount percentage vs.
 *              free-service toggle, terms text, center assignment, and a 9:16
 *              image preview dropzone. Submits via offerService's
 *              createOffer/updateOffer depending on whether an existing
 *              offer is passed in for editing.
 * Usage / Imported By: pages/AdminDashboard.jsx (Offers tab)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import useLanguage from '../../hooks/useLanguage';
import Button from '../common/Button/Button';
import { createOffer, updateOffer } from '../../services/offerService';

const CATEGORIES = ['dental', 'beauty', 'laser', 'other'];

/**
 * @param {Object} props
 * @param {Object|null} [props.existingOffer] - Offer to edit; null for create mode
 * @param {Array} props.centers - Available centers to assign the offer to
 * @param {Function} props.onSaved - Called after a successful create/update
 * @param {Function} [props.onCancel]
 */
export default function OfferCMSForm({ existingOffer = null, centers = [], onSaved, onCancel }) {
  const { t } = useLanguage();
  const isEditMode = !!existingOffer;

  const [form, setForm] = useState({
    title: existingOffer?.title || '',
    description: existingOffer?.description || '',
    category: existingOffer?.category || CATEGORIES[0],
    isFree: existingOffer?.isFree || false,
    discountPercent: existingOffer?.discountPercent || 10,
    terms: existingOffer?.terms || '',
    centerId: existingOffer?.centerId || centers[0]?.id || '',
    imageUrl: existingOffer?.imageUrl || '',
  });
  const [imagePreview, setImagePreview] = useState(existingOffer?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setImagePreview(form.imageUrl);
  }, [form.imageUrl]);

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    // NOTE: In a full implementation this would upload to a media endpoint
    // and set form.imageUrl to the returned CDN URL. The upload endpoint is
    // out of scope for this service layer.
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateOffer(existingOffer.id, form);
      } else {
        await createOffer(form);
      }
      onSaved && onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <label className="field__label" style={{ marginBottom: 8, display: 'block' }}>
            {t('admin.offerImage')}
          </label>
          <label className="image-dropzone" style={{ cursor: 'pointer' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="" className="image-dropzone__preview" />
            ) : (
              <span className="text-xs text-muted">9:16</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="field">
            <label className="field__label" htmlFor="offer-title">
              {t('admin.offerTitle')}
            </label>
            <input
              id="offer-title"
              type="text"
              className="field__input"
              value={form.title}
              onChange={(e) => handleField('title', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="offer-category">
              {t('offer.category')}
            </label>
            <select
              id="offer-category"
              className="field__select"
              value={form.category}
              onChange={(e) => handleField('category', e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="offer-center">
              {t('admin.centerName')}
            </label>
            <select
              id="offer-center"
              className="field__select"
              value={form.centerId}
              onChange={(e) => handleField('centerId', e.target.value)}
            >
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="offer-description">
          {t('common.search') /* reused generic label slot */}
        </label>
        <textarea
          id="offer-description"
          className="field__textarea"
          value={form.description}
          onChange={(e) => handleField('description', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="offer-terms">
          {t('offer.terms')}
        </label>
        <textarea
          id="offer-terms"
          className="field__textarea"
          value={form.terms}
          onChange={(e) => handleField('terms', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <label className="toggle-switch">
          <input
            type="checkbox"
            className="toggle-switch__input"
            checked={form.isFree}
            onChange={(e) => handleField('isFree', e.target.checked)}
          />
          <span className="toggle-switch__track">
            <span className="toggle-switch__thumb" />
          </span>
        </label>
        <span className="text-sm">{t('offer.freeService')}</span>
      </div>

      {!form.isFree && (
        <div className="field">
          <label className="field__label" htmlFor="offer-discount">
            {t('offer.discountUpTo')} (%)
          </label>
          <input
            id="offer-discount"
            type="number"
            min="1"
            max="100"
            className="field__input"
            value={form.discountPercent}
            onChange={(e) => handleField('discountPercent', Number(e.target.value))}
          />
        </div>
      )}

      {error && (
        <p className="field__error" style={{ marginBottom: 12 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        {onCancel && (
          <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" fullWidth loading={isSubmitting}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
