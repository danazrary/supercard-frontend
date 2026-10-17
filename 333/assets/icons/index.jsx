/**
 * ============================================================================
 * File: src/assets/icons/index.jsx
 * Description: Centralized barrel of inline SVG icon components used across
 *              the app (WhatsApp, Instagram, Snapchat, Camera, GiftBox, FIB,
 *              QR, Check, Alert, and core navigation icons). All icons accept
 *              a `size` and `color` prop (defaulting to `currentColor` so
 *              they inherit text color via CSS) and are stroke/fill based
 *              on 24x24 viewBoxes for consistent scaling.
 * Usage / Imported By: components/layout/BottomNav.jsx,
 *                       components/customer/*, components/merchant/*,
 *                       components/common/Button (icon prop), pages/*
 * ============================================================================
 */

import React from 'react';

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

export function HomeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path d="M3 10.5 12 3l9 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5V21h14V9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UserIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SettingsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GiftBoxIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="9" width="18" height="11" rx="1.5" stroke={color} strokeWidth="2" />
      <path d="M3 9h18v3H3z" fill={color} opacity="0.2" />
      <path d="M12 9v11M3 9h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 9c0-2.5-2-5-4.5-4.5C5.5 5 6 9 12 9ZM12 9c0-2.5 2-5 4.5-4.5C18.5 5 18 9 12 9Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CameraIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path
        d="M4 8a2 2 0 0 1 2-2h1.2l.9-1.5A2 2 0 0 1 9.8 3.5h4.4a2 2 0 0 1 1.7 1l.9 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export function QRIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" fill={color} />
    </svg>
  );
}

export function CheckIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AlertIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M12 7.5v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill={color} />
    </svg>
  );
}

export function CloseAlertIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="m9 9 6 6M15 9l-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)} fill={color}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.5.5 0 0 0 0-.4c-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill={color} />
    </svg>
  );
}

export function SnapchatIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path
        d="M12 3c-3 0-4.6 2.1-4.7 4.4-.1 1.2 0 2.1-.2 2.5-.2.4-1.2.9-2.1 1.2-.3.1-.4.5-.1.8.6.6 1.6.9 1.6 1.3 0 .3-.4.5-.4.9 0 .3.4.4.9.4.3 0 .5 0 .6.3.3.9 1.4 2.4 4.4 2.4s4.1-1.5 4.4-2.4c.1-.3.3-.3.6-.3.5 0 .9-.1.9-.4 0-.4-.4-.6-.4-.9 0-.4 1-.7 1.6-1.3.3-.3.2-.7-.1-.8-.9-.3-1.9-.8-2.1-1.2-.2-.4-.1-1.3-.2-2.5C16.6 5.1 15 3 12 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FibIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" stroke={color} strokeWidth="2" />
      <path d="M2.5 9h19" stroke={color} strokeWidth="2" />
      <path d="M6 14h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LogoutIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path d="M15 17v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12h11m0 0-3.5-3.5M21 12l-3.5 3.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EditIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path
        d="m14.5 4.5 5 5L8 21H3v-5l11.5-11.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0v12.5A1.5 1.5 0 0 1 15.5 21h-7A1.5 1.5 0 0 1 7 19.5V7h10Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LocationIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg {...base(size)}>
      <path
        d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke={color} strokeWidth="2" />
    </svg>
  );
}
