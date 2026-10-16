/*
 * J.A.R.V.I.S. colour schemes. The palettes themselves are generated as CSS
 * variables by tailwind.config.js (THEMES there — keep the ids in step); this
 * file names them, holds the preview swatches and applies the choice by
 * setting html[data-theme]. The choice is a gymforge_* key, so it syncs.
 */

export interface Theme { id: string; name: string; line: string; a: string; g: string; bg: string }

export const THEMES: Theme[] = [
  { id: 'arc', name: 'Arc Reactor', line: 'The original. Reactor cyan with Stark gold.', a: '#22d3ee', g: '#eab308', bg: '#04121a' },
  { id: 'mark3', name: 'Mark III', line: 'Hot-rod orange and gold — the suit itself.', a: '#fb923c', g: '#facc15', bg: '#180c04' },
  { id: 'vibranium', name: 'Vibranium', line: 'Royal violet with brushed silver.', a: '#a78bfa', g: '#cbd5e1', bg: '#0e0a1c' },
  { id: 'gamma', name: 'Gamma', line: 'Radioactive lime with purple. Loud.', a: '#a3e635', g: '#a78bfa', bg: '#0b1404' },
  { id: 'stealth', name: 'Stealth', line: 'Silver and ice blue. Quiet, serious, night mode.', a: '#94a3b8', g: '#38bdf8', bg: '#0a0d12' },
  { id: 'ultraviolet', name: 'Ultraviolet', line: 'Magenta with cyan — synthwave HUD.', a: '#e879f9', g: '#22d3ee', bg: '#160a1a' },
  { id: 'deepsea', name: 'Deep Sea', line: 'Electric blue with teal. Calm focus.', a: '#60a5fa', g: '#2dd4bf', bg: '#050c1c' },
];

const KEY = 'gymforge_theme';

export function currentTheme(): string {
  try {
    const t = localStorage.getItem(KEY);
    if (t && THEMES.some(x => x.id === t)) return t;
  } catch { /* ignore */ }
  return 'arc';
}

export function applyTheme(id: string) {
  document.documentElement.dataset.theme = id;
}

export function setTheme(id: string) {
  try { localStorage.setItem(KEY, id); } catch { /* quota */ }
  applyTheme(id);
}

/** Apply the saved theme now, and again whenever sync pulls another device's choice. */
export function startTheme() {
  applyTheme(currentTheme());
  window.addEventListener('gymforge-synced', () => applyTheme(currentTheme()));
}
