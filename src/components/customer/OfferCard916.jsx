import React, { useState } from "react";
import "./_card-vertical.scss";

/**
 * OfferCard916
 * Story/Reels-style vertical offer card using the 9:16 aspect ratio.
 *
 * Props (offer shape):
 * {
 *   id, title, categoryTag, highlightTag, image,
 *   services: [{ id, label, included }],
 *   detailText
 * }
 */
const OfferCard916 = ({ offer, onDetailClick }) => {
  const [expanded, setExpanded] = useState(false);

  if (!offer) return null;

  const { title, categoryTag, highlightTag, image, services = [] } = offer;

  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick(offer);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <article className="sc-offer-card" dir="rtl">
      <div
        className="sc-offer-card__media"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      >
        <div className="sc-offer-card__gradient" />

        <div className="sc-offer-card__badges">
          <span className="sc-offer-card__badge sc-offer-card__badge--category">
            {categoryTag}
          </span>
          <span className="sc-offer-card__badge sc-offer-card__badge--highlight">
            {highlightTag}
          </span>
        </div>

        <div className="sc-offer-card__content">
          <h3 className="sc-offer-card__title">{title}</h3>

          <ul className="sc-offer-card__pills">
            {services.map((service) => (
              <li
                key={service.id}
                className={`sc-offer-card__pill${service.included ? " sc-offer-card__pill--included" : ""}`}
              >
                {service.included && (
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span>{service.label}</span>
              </li>
            ))}
          </ul>

          {expanded && (
            <div className="sc-offer-card__checklist">
              {services.map((service) => (
                <div
                  className="sc-offer-card__checklist-item"
                  key={`detail-${service.id}`}
                >
                  <span className="sc-offer-card__checklist-dot" />
                  <span>{service.label}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="sc-offer-card__detail-btn"
            onClick={handleDetailClick}
          >
            زانیاری زیاتر لەسەر ئەم ئۆفەرە
          </button>
        </div>
      </div>
    </article>
  );
};

export default OfferCard916;
