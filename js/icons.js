/**
 * icons.js
 * Bibliothèque d'icônes SVG (inline, "currentColor") pour :
 *  - les thématiques de blocs (UI_ICONS)
 *  - les outils IA détectés automatiquement dans le bloc "Outils IA" (AI_TOOL_ICONS)
 *  - des motifs décoratifs en filigrane (PATTERNS)
 *
 * Toutes les icônes sont volontairement stylisées/géométriques (pas de logos
 * protégés reproduits à l'identique) afin de rester simples, légères et
 * facilement recolorables via CSS (currentColor).
 */

const UI_ICONS = {
  spark: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="currentColor"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>`,
  process: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="6" r="2.4" stroke="currentColor" stroke-width="1.6"/><circle cx="19" cy="6" r="2.4" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="18" r="2.4" stroke="currentColor" stroke-width="1.6"/><path d="M7 7.5L11 16M17 7.5L13 16M7.4 6H16.6" stroke="currentColor" stroke-width="1.4"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" stroke-width="1.4"/><path d="M3 12H21M4.5 7.5H19.5M4.5 16.5H19.5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  scale: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V21M5 7L3 13H9L7 7H5ZM19 7L17 13H21L19 7H17Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 13C3 14.6569 4.79086 16 7 16C9.20914 16 11 14.6569 11 13M13 13C13 14.6569 14.7909 16 17 16C19.2091 16 21 14.6569 21 13" stroke="currentColor" stroke-width="1.6"/><path d="M5 3H9" stroke="currentColor" stroke-width="1.6"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.6"/></svg>`,
  merge: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="6" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M8 8L11 15M16 8L13 15" stroke="currentColor" stroke-width="1.6"/></svg>`,
  shift: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58172 7.58172 4 12 4C15.0808 4 17.7551 5.74921 19.0644 8.33333" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M20 12C20 16.4183 16.4183 20 12 20C8.91923 20 6.24488 18.2508 4.93556 15.6667" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M19 4.5V8.5H15M5 19.5V15.5H9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fingerprint: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C7.02944 3 3 7.02944 3 12V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M21 12C21 7.02944 16.9706 3 12 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 3"/><path d="M7 11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 11C9.5 9.61929 10.6193 8.5 12 8.5C13.3807 8.5 14.5 9.61929 14.5 11V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 11V21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7C5 8 4 10 4 12.5C4 15 5.5 16.5 7.5 16.5C9.16 16.5 10.5 15.16 10.5 13.5C10.5 11.84 9.16 10.5 7.5 10.5C7.3 10.5 7.1 10.52 6.9 10.56C7.1 9.2 8.1 8.1 9.5 7.5L7 7Z" fill="currentColor"/><path d="M16.5 7C14.5 8 13.5 10 13.5 12.5C13.5 15 15 16.5 17 16.5C18.66 16.5 20 15.16 20 13.5C20 11.84 18.66 10.5 17 10.5C16.8 10.5 16.6 10.52 16.4 10.56C16.6 9.2 17.6 8.1 19 7.5L16.5 7Z" fill="currentColor"/></svg>`,
  tools: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 3.5L20.5 9.5L18 12L12 6L14.5 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 8L4 14C3 15 3 16.5 4 17.5C5 18.5 6.5 18.5 7.5 17.5L13.5 11.5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4.5 17.5L3.5 20.5L6.5 19.5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L21.5 20H2.5L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9.5V14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`,
  star4: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1C12.3 6.5 13.5 10.7 23 12C13.5 13.3 12.3 17.5 12 23C11.7 17.5 10.5 13.3 1 12C10.5 10.7 11.7 6.5 12 1Z" fill="currentColor"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H20M9 7V4.5C9 4 9.4 3.5 10 3.5H14C14.6 3.5 15 4 15 4.5V7M6 7L7 20H17L18 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20L4.8 16.5L15 6.3L18.7 10L8.5 20.2L4 20Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 8.3L16.7 12" stroke="currentColor" stroke-width="1.6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.5L9.5 18L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V15M12 15L7 10M12 15L17 10M4 19H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15V3M12 3L7 8M12 3L17 8M4 19H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 17L8 12L11 15L16 10L21 15" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  logoPlaceholder: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/><path d="M8 14L10.5 11L13 13.5L16 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="9" r="1" fill="currentColor"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58172 7.58172 4 12 4C14.59 4 16.89 5.25 18.36 7.18M20 12C20 16.4183 16.4183 20 12 20C9.41 20 7.11 18.75 5.64 16.82" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M18 4V8H14M6 20V16H10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3L21 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M10.6 5.3C11.05 5.1 11.5 5 12 5C19 5 22 12 22 12C22 12 21.2 13.7 19.5 15.4M6.5 6.6C3.7 8.4 2 12 2 12C2 12 5 19 12 19C13.4 19 14.6 18.7 15.7 18.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 10.2C9.2 10.7 9 11.3 9 12C9 13.7 10.3 15 12 15C12.7 15 13.3 14.8 13.8 14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

/**
 * Icônes d'outils IA — détection par mot-clé (insensible à la casse, accents ignorés).
 * Chaque entrée : { match: [mots-clés], icon: svg, label: nom affiché }
 *
 * Toutes les icônes sont des dessins génériques (style géométrique,
 * "currentColor") — aucun logo de marque n'est utilisé.
 */
const AI_TOOL_ICONS = [
  {
    match: ["chatgpt", "gpt", "openai"],
    label: "ChatGPT",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    match: ["claude", "anthropic"],
    label: "Claude",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.6 9.5L21 11L13.6 12.5L12 20L10.4 12.5L3 11L10.4 9.5L12 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["gemini", "google ai", "bard"],
    label: "Google Gemini",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C12.6 8 16 11.4 21 12C16 12.6 12.6 16 12 21C11.4 16 8 12.6 3 12C8 11.4 11.4 8 12 3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["perplexity"],
    label: "Perplexity",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M8 8L16 16M16 8L8 16" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    match: ["firefly"],
    label: "Adobe Firefly",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.4"/><path d="M8 16L12 7L16 16M9.5 13H14.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["figma"],
    label: "Figma AI",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="9" cy="17" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="16" cy="12" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M9 10V14" stroke="currentColor" stroke-width="1.3"/></svg>`,
  },
  {
    match: ["midjourney"],
    label: "Midjourney",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17C5 12 7 8 12 8C17 8 19 12 21 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M3 17C5 14 7 11 12 11C17 11 19 14 21 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    match: ["dall", "dalle", "dall-e"],
    label: "DALL·E",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`,
  },
  {
    match: ["copilot", "github"],
    label: "Copilot",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 9C7 6.8 9 5 12 5C15 5 17 6.8 17 9V13C17 15.2 15 17 12 17C9 17 7 15.2 7 13V9Z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10.5" r="1" fill="currentColor"/><circle cx="14" cy="10.5" r="1" fill="currentColor"/></svg>`,
  },
  {
    match: ["notion"],
    label: "Notion AI",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 7L16 17M8 17V7H10" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["canva"],
    label: "Canva",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M7 13C7 10.5 9 9 11.5 9C13 9 14 9.7 14.5 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    match: ["mistral", "le chat"],
    label: "Mistral",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="3.5" height="14" fill="currentColor"/><rect x="10.25" y="5" width="3.5" height="14" fill="currentColor" opacity="0.6"/><rect x="16.5" y="5" width="3.5" height="14" fill="currentColor" opacity="0.3"/></svg>`,
  },
  {
    match: ["llama", "meta ai"],
    label: "Meta AI",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17C4 11 7 6 12 6C17 6 20 11 20 17" stroke="currentColor" stroke-width="1.4"/><path d="M9 17C9 13.5 10 11 12 11C14 11 15 13.5 15 17" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    match: ["deepseek"],
    label: "DeepSeek",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21" stroke="currentColor" stroke-width="1.4"/><path d="M12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
  },
  {
    match: ["grok", "xai", "x.ai"],
    label: "Grok",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  },
  {
    match: ["runway"],
    label: "Runway ML",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M17 9L21 7V17L17 15" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["stable diffusion", "stability", "sdxl"],
    label: "Stable Diffusion",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M5 12C7 9 9 15 12 12C15 9 17 15 19 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["leonardo"],
    label: "Leonardo.ai",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 2V22M4 7L20 17M20 7L4 17" stroke="currentColor" stroke-width="1" opacity="0.6"/></svg>`,
  },
  {
    match: ["recraft"],
    label: "Recraft.ai",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M11 7H17C19.2 7 21 8.8 21 11M13 17H7C4.8 17 3 15.2 3 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    match: ["krea"],
    label: "KREA AI",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4V20M4 12L13 4M4 12L13 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    match: ["lovable"],
    label: "Lovable",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20C12 20 4 15 4 9.5C4 7 6 5 8.5 5C10 5 11.2 5.8 12 7C12.8 5.8 14 5 15.5 5C18 5 20 7 20 9.5C20 15 12 20 12 20Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["framer"],
    label: "Framer",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3H19V9H12L19 16H12V21L5 14V9H12L5 3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["envato"],
    label: "Envato",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C7 21 4 17.5 4 13C4 13 8 14.5 12 11C16 7.5 20 9 20 9C20 14.5 17 21 12 21Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["pacdora"],
    label: "Pacdora",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L20 6V18L12 22L4 18V6L12 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 2V12M4 6L12 12M20 6L12 12" stroke="currentColor" stroke-width="1" opacity="0.6"/></svg>`,
  },
  {
    match: ["sora", "video"],
    label: "Vidéo générative",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M17 9L21 7V17L17 15" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    match: ["elevenlabs", "audio", "voix", "voice"],
    label: "Audio génératif",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H6L9 6V18L12 12H14M16 9C17 10 17 14 16 15M18.5 7C20 9 20 15 18.5 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
];

/**
 * Retourne le HTML d'icône correspondant au nom d'outil donné : toujours une
 * icône générique dessinée (style géométrique, "currentColor"), avec repli
 * sur l'icône "spark" si aucune correspondance n'est trouvée. Aucun logo de
 * plateforme (image ou SVG de marque) n'est utilisé — uniquement des icônes
 * vectorielles générées, simples et recolorables.
 */
function getToolIcon(name) {
  if (!name) return UI_ICONS.spark;
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  for (const entry of AI_TOOL_ICONS) {
    if (entry.match.some((kw) => normalized.includes(kw))) {
      return entry.icon;
    }
  }
  return UI_ICONS.spark;
}

/**
 * Motifs SVG décoratifs en filigrane (utilisés en arrière-plan de certains blocs).
 */
const PATTERNS = {
  wireGlobe: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="0.6"/>
    <ellipse cx="100" cy="100" rx="40" ry="90" stroke="currentColor" stroke-width="0.6"/>
    <ellipse cx="100" cy="100" rx="65" ry="90" stroke="currentColor" stroke-width="0.6"/>
    <ellipse cx="100" cy="100" rx="90" ry="40" stroke="currentColor" stroke-width="0.6"/>
    <ellipse cx="100" cy="100" rx="90" ry="65" stroke="currentColor" stroke-width="0.6"/>
    <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" stroke-width="0.6"/>
    <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="0.6"/>
  </svg>`,
  bigStar: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <path d="M50 2C51.5 28 59 41 98 50C59 59 51.5 72 50 98C48.5 72 41 59 2 50C41 41 48.5 28 50 2Z" stroke="currentColor" stroke-width="0.8" fill="none"/>
  </svg>`,
  dots: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    ${Array.from({ length: 6 })
      .map((_, r) =>
        Array.from({ length: 6 })
          .map(
            (_, c) =>
              `<circle cx="${8 + c * 17}" cy="${8 + r * 17}" r="1.2" fill="currentColor"/>`
          )
          .join("")
      )
      .join("")}
  </svg>`,
};

window.CADRE_ICONS = { UI_ICONS, AI_TOOL_ICONS, getToolIcon, PATTERNS };
