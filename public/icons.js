// Hand-drawn SVG icon set for the setup screen, replacing emoji.
// Consistent style: 64x64 viewBox, rounded ink-colored line work (#4a3c2c)
// plus a couple of flat accent-color shapes per icon. Animated via CSS
// (see .choice-icon rules in style.css) rather than baked into the SVGs.

const INK = '#4a3c2c';

const ICONS = {
  // ---------- genre ----------
  'fantasy-kingdom': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="30" width="36" height="24" rx="3" fill="#e8c99a" stroke="${INK}" stroke-width="3"/>
      <rect x="10" y="22" width="12" height="14" rx="2" fill="#e8c99a" stroke="${INK}" stroke-width="3"/>
      <rect x="42" y="22" width="12" height="14" rx="2" fill="#e8c99a" stroke="${INK}" stroke-width="3"/>
      <path d="M10 22l3-6 3 6M42 22l3-6 3 6" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="26" y="38" width="12" height="16" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <path d="M32 12v10" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 12l8 4-8 3z" fill="#ff8c5a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`,
  'space-voyage': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8c8 6 10 20 8 30H24c-2-10 0-24 8-30z" fill="#f2f2f2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="32" cy="24" r="5" fill="#6fa8dc" stroke="${INK}" stroke-width="2.5"/>
      <path d="M24 38l-8 12 10-4M40 38l8 12-10-4" fill="#ff8c5a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M27 50l5 10 5-10" fill="#ffcf5c" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="12" cy="14" r="1.6" fill="${INK}"/>
      <circle cx="50" cy="10" r="1.6" fill="${INK}"/>
      <circle cx="52" cy="26" r="1.6" fill="${INK}"/>
    </svg>`,
  'ocean-adventure': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="46" cy="16" r="7" fill="#ffcf5c" stroke="${INK}" stroke-width="2.5"/>
      <path d="M8 30c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M8 42c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke="#6fa8dc" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M8 54c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  'enchanted-forest': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="40" width="8" height="16" rx="2" fill="#c9a06a" stroke="${INK}" stroke-width="3"/>
      <circle cx="24" cy="28" r="14" fill="#8bc34a" stroke="${INK}" stroke-width="3"/>
      <circle cx="40" cy="24" r="11" fill="#6fc3a0" stroke="${INK}" stroke-width="3"/>
      <circle cx="32" cy="14" r="9" fill="#8bc34a" stroke="${INK}" stroke-width="3"/>
      <path d="M50 14l1.5 3.5L55 19l-3.5 1.5L50 24l-1.5-3.5L45 19l3.5-1.5z" fill="#ffcf5c" stroke="${INK}" stroke-width="2"/>
    </svg>`,
  'pirate-seas': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 50c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8-3 12 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M32 44V12" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M32 16c9 1 13 8 11 17-7-2-11-9-11-17z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 18c-7 1-10 7-9 15 6-2 9-8 9-15z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 12l9 4-9 4z" fill="#ef7c7c" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 44h44l-7 12H17z" fill="#c9a06a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,
  'dinosaur-valley': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 42c7-1 13-6 14-13" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M40 42c7-1 13-6 14-13" stroke="#8bc34a" stroke-width="7" stroke-linecap="round"/>
      <path d="M22 33c-5-7-4-15 2-19" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
      <path d="M22 33c-5-7-4-15 2-19" stroke="#8bc34a" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="30" cy="40" rx="15" ry="11" fill="#8bc34a" stroke="${INK}" stroke-width="3.5"/>
      <ellipse cx="24" cy="14" rx="6" ry="5" fill="#8bc34a" stroke="${INK}" stroke-width="3.5"/>
      <circle cx="26" cy="13" r="1.4" fill="${INK}"/>
      <rect x="19" y="48" width="6" height="9" rx="3" fill="#8bc34a" stroke="${INK}" stroke-width="2.5"/>
      <rect x="34" y="48" width="6" height="9" rx="3" fill="#8bc34a" stroke="${INK}" stroke-width="2.5"/>
    </svg>`,

  // ---------- characterType ----------
  'brave-knight': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10c10 0 16 6 16 16v6c0 12-8 20-16 22-8-2-16-10-16-22v-6c0-10 6-16 16-16z" fill="#c7d3e0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M20 30h24" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M26 30v8M32 30v10M38 30v8" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 6l3 6-3 3-3-3z" fill="#ff8c5a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`,
  'young-wizard': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8l14 34H18z" fill="#b48ee0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="32" cy="42" rx="20" ry="5" fill="#b48ee0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M32 16l1.5 3.5L37 21l-3.5 1.5L32 26l-1.5-3.5L27 21l3.5-1.5z" fill="#ffcf5c" stroke="${INK}" stroke-width="2"/>
    </svg>`,
  'animal-friend': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="40" rx="14" ry="11" fill="#f2a0c1" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="16" cy="26" rx="6" ry="7" fill="#f2a0c1" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="30" cy="18" rx="6" ry="7" fill="#f2a0c1" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="46" cy="22" rx="6" ry="7" fill="#f2a0c1" stroke="${INK}" stroke-width="3"/>
    </svg>`,
  'curious-robot': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8v6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="6" r="3" fill="#ff8c5a" stroke="${INK}" stroke-width="2"/>
      <rect x="14" y="14" width="36" height="30" rx="8" fill="#c7d3e0" stroke="${INK}" stroke-width="3.5"/>
      <circle cx="24" cy="28" r="4" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="40" cy="28" r="4" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <path d="M25 36h14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <rect x="20" y="46" width="24" height="10" rx="4" fill="#c7d3e0" stroke="${INK}" stroke-width="3"/>
    </svg>`,
  'shy-monster': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="36" r="20" fill="#b48ee0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M22 18c-2-4 0-8 4-9M42 18c2-4 0-8-4-9" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="24" cy="32" r="6" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="40" cy="34" r="4.5" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="25" cy="32" r="2.2" fill="${INK}"/>
      <circle cx="40.5" cy="34" r="1.8" fill="${INK}"/>
      <circle cx="19" cy="42" r="3" fill="#f2a0c1"/>
      <circle cx="45" cy="42" r="3" fill="#f2a0c1"/>
      <path d="M27 46c2 2 6 2 8 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  'silly-explorer': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
      <path d="M32 4v6M32 54v6M4 32h6M54 32h6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M40 24l-6 12-12 6 6-12z" fill="#ef7c7c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="32" cy="32" r="2.5" fill="${INK}"/>
    </svg>`,

  // ---------- characterTrait ----------
  'trait-brave': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8l18 6v14c0 14-8 22-18 28-10-6-18-14-18-28V14z" fill="#ff8c5a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M32 20l3 6 6 1-4.5 4.5L37 38l-5-3-5 3 1.5-6.5L24 27l6-1z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
  'trait-clever': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="26" r="16" fill="#ffcf5c" stroke="${INK}" stroke-width="3.5"/>
      <path d="M26 42h12M27 48h10" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 4v4M12 12l3 3M52 12l-3 3M8 26h4M56 26h-4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  'trait-funny': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" fill="#ffcf5c" stroke="${INK}" stroke-width="3.5"/>
      <circle cx="24" cy="28" r="3" fill="${INK}"/>
      <circle cx="40" cy="28" r="3" fill="${INK}"/>
      <path d="M20 38c4 6 20 6 24 0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  'trait-kind': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 52C14 40 8 28 14 19c5-7 15-6 18 2 3-8 13-9 18-2 6 9 0 21-18 33z" fill="#f2a0c1" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,
  'trait-curious': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27" cy="27" r="15" fill="#a8d8ff" fill-opacity="0.5" stroke="${INK}" stroke-width="3.5"/>
      <path d="M38 38l14 14" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`,
  'trait-creative': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 12c-12 0-22 8-22 18 0 6 4 9 9 9h3c2 0 3 2 2 4-1 2 0 4 3 4 11 0 20-8 20-17 0-10-6-18-15-18z" fill="#ffe8c2" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="22" cy="26" r="3" fill="#ff8c5a"/>
      <circle cx="30" cy="20" r="3" fill="#6fc3a0"/>
      <circle cx="39" cy="22" r="3" fill="#b48ee0"/>
      <circle cx="22" cy="36" r="3" fill="#ffcf5c"/>
      <path d="M46 12l6-6M52 6c1-1 3-1 4 0s1 3 0 4l-6 6-4-4z" fill="#c9a06a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`,

  // ---------- sidekick ----------
  'baby-dragon': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="36" rx="18" ry="14" fill="#8bc34a" stroke="${INK}" stroke-width="3.5"/>
      <path d="M44 30c6-2 10-8 8-12-4 2-8 4-10 8z" fill="#8bc34a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 24l-2-6 6 2M32 22l-1-6 6 3" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="22" cy="32" r="2.5" fill="${INK}"/>
      <path d="M12 38c-4 2-6 6-4 10 4-1 7-4 8-8z" fill="#6fc3a0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    </svg>`,
  'wise-owl': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14l4 8M44 14l-4 8" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="32" cy="34" rx="20" ry="18" fill="#c9a06a" stroke="${INK}" stroke-width="3.5"/>
      <circle cx="23" cy="32" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <circle cx="41" cy="32" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <circle cx="23" cy="32" r="3" fill="${INK}"/>
      <circle cx="41" cy="32" r="3" fill="${INK}"/>
      <path d="M32 38l-4 6h8z" fill="#ff8c5a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
  'loyal-puppy': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="34" r="18" fill="#e8c99a" stroke="${INK}" stroke-width="3.5"/>
      <path d="M18 24c-8 0-10 12-4 18 2-6 4-12 4-18zM46 24c8 0 10 12 4 18-2-6-4-12-4-18z" fill="#e8c99a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="25" cy="32" r="2.5" fill="${INK}"/>
      <circle cx="39" cy="32" r="2.5" fill="${INK}"/>
      <ellipse cx="32" cy="40" rx="3" ry="2.5" fill="${INK}"/>
      <path d="M28 44c2 2 6 2 8 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  'chatty-squirrel': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 50c14-2 16-20 6-28-4 8-2 18-6 28z" fill="#c9a06a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="24" cy="34" r="14" fill="#e8c99a" stroke="${INK}" stroke-width="3.5"/>
      <path d="M16 24l2-6 4 4M28 22l2-6 3 5" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="32" r="2.5" fill="${INK}"/>
      <ellipse cx="14" cy="38" rx="3" ry="2" fill="#f2a0c1"/>
    </svg>`,
  'magic-butterfly': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 32c-2-14-18-18-22-10s6 16 22 10z" fill="#b48ee0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 32c2-14 18-18 22-10s-6 16-22 10z" fill="#a8d8ff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 32c-2 10-14 14-17 8s3-12 17-8z" fill="#a8d8ff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 32c2 10 14 14 17 8s-3-12-17-8z" fill="#b48ee0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 20v24" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 20l-4-6M32 20l4-6" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  'steady-turtle': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="34" rx="20" ry="16" fill="#6fc3a0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M32 20v28M18 34h28M22 24l20 20M42 24L22 44" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="50" cy="24" r="6" fill="#8bc34a" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="14" cy="46" rx="4" ry="3" fill="#8bc34a" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="46" cy="48" rx="4" ry="3" fill="#8bc34a" stroke="${INK}" stroke-width="2.5"/>
    </svg>`,

  // ---------- plotTwist ----------
  'hidden-map': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 16l14-4 14 4 14-4v38l-14 4-14-4-14 4z" fill="#f0e2c0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M28 12v38M42 12v38" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M18 24l8 6-6 8 8 4" stroke="#ff8c5a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 5"/>
      <path d="M42 40l4-4 4 4-4 4z" fill="#ef7c7c" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
  'secret-door': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 56V26c0-8 6-14 14-14s14 6 14 14v30z" fill="#c9a06a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="38" cy="40" r="2.5" fill="${INK}"/>
      <path d="M12 56h40" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  'sudden-storm': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 32a10 10 0 019-15 12 12 0 0123 3 9 9 0 01-2 18H18a8 8 0 01-2-6z" fill="#c7d3e0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M34 38l-8 12h7l-5 10 12-14h-7z" fill="#ffcf5c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`,
  'mysterious-stranger': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 52c0-14 8-22 16-22s16 8 16 22z" fill="#b48ee0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="32" cy="24" r="10" fill="#e8c99a" stroke="${INK}" stroke-width="3.5"/>
      <path d="M18 20c4-8 22-8 26 0-6-2-20-2-26 0z" fill="#b48ee0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <text x="32" y="46" font-size="16" font-family="Baloo 2, sans-serif" font-weight="700" fill="${INK}" text-anchor="middle">?</text>
    </svg>`,
  'silly-spell': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 50l26-26" stroke="#c9a06a" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 24l4-4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M46 12l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#b48ee0" stroke="${INK}" stroke-width="2"/>
      <path d="M18 20l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#ffcf5c" stroke="${INK}" stroke-width="2"/>
      <path d="M50 38l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#f2a0c1" stroke="${INK}" stroke-width="1.5"/>
    </svg>`,
  'locked-treasure': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 30a20 10 0 0140 0z" fill="#c9a06a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="12" y="30" width="40" height="20" rx="3" fill="#e8c99a" stroke="${INK}" stroke-width="3.5"/>
      <path d="M12 40h40" stroke="${INK}" stroke-width="2.5"/>
      <rect x="27" y="35" width="10" height="10" rx="2" fill="#ffcf5c" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="32" cy="40" r="1.8" fill="${INK}"/>
    </svg>`,
  'talking-statue': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="44" width="24" height="12" rx="2" fill="#c7d3e0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M24 44c0-12 4-20 8-20s8 8 8 20z" fill="#e8e8e8" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="32" cy="18" r="10" fill="#e8e8e8" stroke="${INK}" stroke-width="3.5"/>
      <path d="M44 14c4 0 6 3 5 6M47 12l3 1-1 3" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  'riddle-clouds': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 38a10 10 0 019-15 12 12 0 0123 3 9 9 0 01-2 18H16a8 8 0 01-2-6z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <text x="32" y="36" font-size="18" font-family="Baloo 2, sans-serif" font-weight="700" fill="#6fa8dc" text-anchor="middle">?</text>
    </svg>`,
  'shrinking-potion': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 10h8v10l10 18a10 10 0 01-9 15H27a10 10 0 01-9-15l10-18z" fill="#a8d8ff" fill-opacity="0.6" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="26" y="8" width="12" height="6" rx="1.5" fill="#c9a06a" stroke="${INK}" stroke-width="2.5"/>
      <path d="M22 42h20" stroke="#6fc3a0" stroke-width="3" stroke-linecap="round"/>
      <circle cx="28" cy="46" r="2" fill="#6fc3a0"/>
      <circle cx="36" cy="49" r="2.5" fill="#6fc3a0"/>
    </svg>`,
  'friendly-ghost': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 52V28a16 16 0 0132 0v24l-5-5-5 5-6-5-5 5-5-5z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="25" cy="28" r="2.5" fill="${INK}"/>
      <circle cx="39" cy="28" r="2.5" fill="${INK}"/>
      <path d="M27 35c3 3 7 3 10 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

  // ---------- endingVibe ----------
  'big-celebration': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 54l8-24 22 14z" fill="#ff8c5a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M26 30l4-14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="44" cy="14" r="2.5" fill="#ffcf5c"/>
      <circle cx="52" cy="24" r="2" fill="#6fc3a0"/>
      <circle cx="40" cy="24" r="2" fill="#f2a0c1"/>
      <circle cx="48" cy="34" r="2.2" fill="#a8d8ff"/>
      <circle cx="34" cy="14" r="2" fill="#b48ee0"/>
    </svg>`,
  'cozy-homecoming': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 30l20-16 20 16" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 28v24h32V28z" fill="#e8c99a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="28" y="38" width="8" height="14" rx="1.5" fill="#ff8c5a" stroke="${INK}" stroke-width="2.5"/>
      <rect x="20" y="34" width="7" height="7" rx="1" fill="#a8d8ff" stroke="${INK}" stroke-width="2"/>
    </svg>`,
  'amazing-discovery': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6l6 16 17 2-13 11 4 17-14-9-14 9 4-17-13-11 17-2z" fill="#ffcf5c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,
  'new-best-friend': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 44C10 34 6 24 12 17c4-5 11-4 14 2 3-6 10-7 14-2 6 7 2 17-16 27z" fill="#f2a0c1" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 50C30 43 27 36 31 31c3-3 8-2 10 1 2-3 7-4 10-1 4 5 1 12-11 19z" fill="#ff8c5a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    </svg>`,
  'silly-surprise': `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" fill="#ffcf5c" stroke="${INK}" stroke-width="3.5"/>
      <path d="M20 24c0 4 3 6 3 6s3-2 3-6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M38 24c0 4 3 6 3 6s3-2 3-6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="32" cy="42" rx="7" ry="8" fill="#fff" stroke="${INK}" stroke-width="3"/>
    </svg>`,
};

function getIcon(key) {
  return ICONS[key] || '';
}
