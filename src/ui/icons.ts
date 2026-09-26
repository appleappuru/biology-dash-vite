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
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="50%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
        <linearGradient id="amoxGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#eab308"/>
        </linearGradient>
      </defs>
      <g transform="rotate(45 20 20)">
        <rect x="12" y="8" width="16" height="12" rx="8" fill="url(#amoxGrad1)"/>
        <rect x="12" y="20" width="16" height="12" rx="8" fill="url(#amoxGrad2)"/>
        <line x1="12" y1="20" x2="28" y2="20" stroke="#ffffff" stroke-width="1.5"/>
        <ellipse cx="17" cy="14" rx="2" ry="4" fill="#ffffff" opacity="0.6"/>
      </g>
    </svg>
  `,

  doxycycline: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="doxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe"/>
          <stop offset="45%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-30 20 20)">
        <rect x="12" y="10" width="16" height="20" rx="8" fill="url(#doxyGrad)" stroke="#bae6fd" stroke-width="1.5"/>
        <line x1="12" y1="20" x2="28" y2="20" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="16" cy="15" r="2" fill="#ffffff" opacity="0.75"/>
        <circle cx="24" cy="25" r="2" fill="#ffffff" opacity="0.5"/>
      </g>
    </svg>
  `,

  cefepime: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cefGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d1fae5"/>
          <stop offset="40%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <polygon points="20,6 32,13 32,27 20,34 8,27 8,13" fill="url(#cefGrad)" stroke="#a7f3d0" stroke-width="1.8"/>
      <circle cx="20" cy="20" r="5" fill="#ffffff" opacity="0.45"/>
      <ellipse cx="16" cy="14" rx="2" ry="4" fill="#ffffff" opacity="0.7" transform="rotate(-30 16 14)"/>
    </svg>
  `,

  micafungin: `
    <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="micaGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fdf4ff"/>
          <stop offset="35%" stop-color="#f0abfc"/>
          <stop offset="75%" stop-color="#c026d3"/>
          <stop offset="100%" stop-color="#701a75"/>
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="15" fill="url(#micaGrad)" stroke="#f5d0fe" stroke-width="2"/>
      <circle cx="20" cy="20" r="8" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="2,3"/>
      <ellipse cx="16" cy="14" rx="4" ry="2" fill="#ffffff" opacity="0.75" transform="rotate(-30 16 14)"/>
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
