/**
 * High-end tactile 3D SVG vector icons with volumetric bevels,
 * specular glints, and soft drop shadows.
 * (STRICT SPEC REQUIREMENT: ZERO UNICODE EMOJIS)
 */

export const ICONS = {
  coin: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="coinGrad" cx="35%" cy="32%" r="65%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="25%" stop-color="#fef08a"/>
          <stop offset="65%" stop-color="#eab308"/>
          <stop offset="90%" stop-color="#ca8a04"/>
          <stop offset="100%" stop-color="#854d0e"/>
        </radialGradient>
        <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#451a03" flood-opacity="0.5"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="16" fill="url(#coinGrad)" filter="url(#coinShadow)"/>
      <circle cx="20" cy="20" r="13" fill="none" stroke="#fef08a" stroke-width="1.8" stroke-dasharray="3,1.5"/>
      <ellipse cx="16" cy="14" rx="6" ry="3" fill="#ffffff" opacity="0.65" transform="rotate(-30 16 14)"/>
      <path d="M17 13 L23 13 L23 16 L20 18 L23 20 L23 27 L17 27" fill="none" stroke="#854d0e" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="20" cy="12" r="1.5" fill="#fef08a"/>
      <circle cx="20" cy="28" r="1.5" fill="#ca8a04"/>
    </svg>
  `,

  star: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="starGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="#fef08a"/>
          <stop offset="70%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
        <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#78350f" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path d="M20 4 L24.5 14.5 L36 15.5 L27.5 23 L30 34.5 L20 28.5 L10 34.5 L12.5 23 L4 15.5 L15.5 14.5 Z"
        fill="url(#starGrad)" stroke="#fef08a" stroke-width="1.5" filter="url(#starShadow)"/>
      <ellipse cx="17" cy="15" rx="3.5" ry="1.5" fill="#ffffff" opacity="0.75" transform="rotate(-25 17 15)"/>
    </svg>
  `,

  starEmpty: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 L24.5 14.5 L36 15.5 L27.5 23 L30 34.5 L20 28.5 L10 34.5 L12.5 23 L4 15.5 L15.5 14.5 Z"
        fill="rgba(51, 65, 85, 0.4)" stroke="#64748b" stroke-width="2"/>
    </svg>
  `,

  cytokineSurge: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="surgeGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="85%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="rgba(239, 68, 68, 0.2)" stroke="#f59e0b" stroke-width="2"/>
      <path d="M22 4 L11 21 L19 21 L16 36 L29 17 L21 17 Z" fill="url(#surgeGrad)" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="21" cy="12" r="1.5" fill="#ffffff"/>
    </svg>
  `,

  amoxicillin: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="amoxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffedd5"/>
          <stop offset="30%" stop-color="#fb923c"/>
          <stop offset="85%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#9a3412"/>
        </linearGradient>
        <linearGradient id="amoxGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="35%" stop-color="#facc15"/>
          <stop offset="85%" stop-color="#ca8a04"/>
          <stop offset="100%" stop-color="#854d0e"/>
        </linearGradient>
        <filter id="amoxShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2.5" stdDeviation="2" flood-color="#431407" flood-opacity="0.5"/>
        </filter>
        <clipPath id="amoxClip">
          <rect x="12" y="7" width="16" height="26" rx="8" ry="8"/>
        </clipPath>
      </defs>
      <g transform="rotate(45 20 20)" filter="url(#amoxShadow)">
        <g clip-path="url(#amoxClip)">
          <!-- Top Orange Half -->
          <rect x="12" y="7" width="16" height="13" fill="url(#amoxGrad1)"/>
          <!-- Bottom Yellow Half -->
          <rect x="12" y="20" width="16" height="13" fill="url(#amoxGrad2)"/>
          <!-- Center seam ring -->
          <line x1="12" y1="20" x2="28" y2="20" stroke="#ffffff" stroke-width="1.2" opacity="0.9"/>
          <line x1="12" y1="20.8" x2="28" y2="20.8" stroke="#78350f" stroke-width="0.8" opacity="0.4"/>
          <!-- 3D Cylindrical Shadow Along Right Edge -->
          <rect x="25" y="7" width="3" height="26" fill="#000000" opacity="0.25"/>
          <!-- Long Specular Highlight Sheen Down Left Edge -->
          <path d="M 14.5 10 Q 14.5 20 14.5 29" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
          <!-- Specular Glint Top Cap -->
          <ellipse cx="16.5" cy="11" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.9"/>
        </g>
        <!-- Pill Rim Stroke -->
        <rect x="12" y="7" width="16" height="26" rx="8" ry="8" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      </g>
    </svg>
  `,

  doxycycline: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="doxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f0f9ff"/>
          <stop offset="30%" stop-color="#38bdf8"/>
          <stop offset="75%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
        <linearGradient id="doxyCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#bae6fd"/>
          <stop offset="100%" stop-color="#7dd3fc"/>
        </linearGradient>
        <filter id="doxyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2.5" stdDeviation="2" flood-color="#0c4a6e" flood-opacity="0.5"/>
        </filter>
        <clipPath id="doxyClip">
          <rect x="12" y="8" width="16" height="24" rx="8" ry="8"/>
        </clipPath>
      </defs>
      <g transform="rotate(-35 20 20)" filter="url(#doxyShadow)">
        <g clip-path="url(#doxyClip)">
          <!-- Top Ice-Blue Cap -->
          <rect x="12" y="8" width="16" height="12" fill="url(#doxyCapGrad)"/>
          <!-- Bottom Deep-Cyan Body -->
          <rect x="12" y="20" width="16" height="12" fill="url(#doxyGrad)"/>
          <!-- Center seam -->
          <line x1="12" y1="20" x2="28" y2="20" stroke="#ffffff" stroke-width="1.2"/>
          <!-- Shading & Highlights -->
          <rect x="25" y="8" width="3" height="24" fill="#000000" opacity="0.2"/>
          <path d="M 14.5 11 L 14.5 28" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
          <circle cx="16" cy="11.5" r="1.5" fill="#ffffff"/>
        </g>
        <rect x="12" y="8" width="16" height="24" rx="8" ry="8" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      </g>
    </svg>
  `,

  cefepime: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cefFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a7f3d0"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
        <linearGradient id="cefFacet2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
        <linearGradient id="cefFacet3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <filter id="cefShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#064e3b" flood-opacity="0.5"/>
        </filter>
      </defs>
      <g filter="url(#cefShadow)">
        <!-- 3D Emerald Gemstone Facets -->
        <polygon points="20,5 33,13 20,20" fill="url(#cefFacet1)"/>
        <polygon points="20,5 7,13 20,20" fill="#6ee7b7"/>
        <polygon points="7,13 20,20 20,35 7,27" fill="url(#cefFacet2)"/>
        <polygon points="33,13 20,20 20,35 33,27" fill="url(#cefFacet3)"/>
        <!-- Gemstone Outer Outline -->
        <polygon points="20,5 33,13 33,27 20,35 7,27 7,13" fill="none" stroke="#d1fae5" stroke-width="1.5"/>
        <line x1="20" y1="5" x2="20" y2="35" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
        <line x1="7" y1="13" x2="33" y2="13" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <!-- Specular Glint -->
        <circle cx="16" cy="11" r="2" fill="#ffffff" opacity="0.9"/>
      </g>
    </svg>
  `,

  micafungin: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="micaGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#fdf4ff"/>
          <stop offset="55%" stop-color="#e879f9"/>
          <stop offset="85%" stop-color="#a21caf"/>
          <stop offset="100%" stop-color="#701a75"/>
        </radialGradient>
        <filter id="micaShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#4a044e" flood-opacity="0.5"/>
        </filter>
      </defs>
      <!-- Glowing Radial Aura -->
      <circle cx="20" cy="20" r="16.5" fill="none" stroke="#f0abfc" stroke-width="1.5" stroke-dasharray="2,3" opacity="0.75"/>
      <!-- Glossy 3D Crystal Pearl Orb -->
      <circle cx="20" cy="20" r="14" fill="url(#micaGrad)" stroke="#fdf4ff" stroke-width="1.5" filter="url(#micaShadow)"/>
      <!-- Specular Highlight Curve -->
      <ellipse cx="16" cy="14" rx="4" ry="2" fill="#ffffff" opacity="0.85" transform="rotate(-30 16 14)"/>
      <circle cx="23" cy="23" r="1.5" fill="#ffffff" opacity="0.5"/>
    </svg>
  `,

  barracks: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="60%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M20 6 L32 11 L32 22 C32 28 20 34 20 34 C20 34 8 28 8 22 L8 11 Z" fill="url(#shieldGrad)" stroke="#bae6fd" stroke-width="2"/>
      <path d="M20 11 L20 28 M14 19 L26 19" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `,

  fieldGuide: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="55%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#4c1d95"/>
        </linearGradient>
      </defs>
      <rect x="8" y="7" width="24" height="26" rx="4" fill="url(#bookGrad)" stroke="#e9d5ff" stroke-width="1.8"/>
      <line x1="14" y1="7" x2="14" y2="33" stroke="#e9d5ff" stroke-width="2"/>
      <!-- DNA helix mark -->
      <path d="M19 14 Q23 18 19 22 Q15 26 19 30" fill="none" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
      <path d="M25 14 Q21 18 25 22 Q29 26 25 30" fill="none" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  map: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="compassGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#fdf2f8"/>
          <stop offset="40%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#9d174d"/>
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="15" fill="url(#compassGrad)" stroke="#fbcfe8" stroke-width="2"/>
      <polygon points="20,9 24,19 20,16 16,19" fill="#ffffff"/>
      <polygon points="20,31 24,21 20,24 16,21" fill="#4c0519"/>
    </svg>
  `,

  audioOn: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16 L16 16 L23 10 L23 30 L16 24 L10 24 Z" fill="#34d399" stroke="#ffffff" stroke-width="1.5"/>
      <path d="M27 15 Q31 20 27 25" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <path d="M30 11 Q36 20 30 29" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  audioOff: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16 L16 16 L23 10 L23 30 L16 24 L10 24 Z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="8" y1="8" x2="32" y2="32" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  close: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="rgba(30, 41, 59, 0.85)" stroke="#64748b" stroke-width="1.8"/>
      <line x1="14" y1="14" x2="26" y2="26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="26" y1="14" x2="14" y2="26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `
};
