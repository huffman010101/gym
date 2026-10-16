import { useState } from 'react';
import { ChevronDown, Palette, Check } from 'lucide-react';
import { THEMES, currentTheme, setTheme, type Theme } from '../lib/themes';

/*
 * One slim row on Home that opens the colour schemes. Tapping a card
 * recolours the whole HUD instantly; the previews are drawn in each theme's
 * own colours so you can compare them side by side.
 */

function Preview({ t }: { t: Theme }) {
  return (
    <svg viewBox="0 0 120 54" className="w-full h-auto rounded-lg" aria-hidden>
      <rect width="120" height="54" fill={t.bg} />
      <circle cx="22" cy="27" r="15" fill="none" stroke={t.a} strokeOpacity="0.3" strokeWidth="1.5" />
      <circle cx="22" cy="27" r="11" fill="none" stroke={t.a} strokeWidth="2" strokeDasharray="5 3" />
      <circle cx="22" cy="27" r="5" fill={t.a} />
      <rect x="44" y="12" width="56" height="5" rx="2.5" fill={t.a} fillOpacity="0.85" />
      <rect x="44" y="22" width="38" height="4" rx="2" fill={t.g} fillOpacity="0.9" />
      <rect x="44" y="31" width="64" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.15" />
      <rect x="44" y="38" width="48" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.1" />
    </svg>
  );
}

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(currentTheme);
  const now = THEMES.find(t => t.id === active) ?? THEMES[0];

  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl" data-testid="theme-picker">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-2.5 px-4 py-3 text-left">
        <Palette size={15} className="text-cyan-300 flex-shrink-0" />
        <span className="flex-1 text-sm text-gray-300">Theme: <span className="font-semibold text-cyan-200">{now.name}</span></span>
        <span className="flex gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: now.a }} />
          <span className="w-3 h-3 rounded-full" style={{ background: now.g }} />
        </span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3">
          <p className="text-[11px] text-gray-500 px-1 mb-2">Tap to switch — it recolours the whole app straight away and syncs to your other devices. Red, green and amber always keep their meaning (warning, good, caution).</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(t => (
              <button key={t.id} onClick={() => { setTheme(t.id); setActive(t.id); }}
                className="text-left rounded-xl border p-2 transition-all"
                style={{ borderColor: t.id === active ? t.a : 'rgba(255,255,255,0.08)', boxShadow: t.id === active ? `0 0 14px ${t.a}40` : undefined }}>
                <Preview t={t} />
                <p className="text-[13px] font-bold mt-1.5 flex items-center gap-1" style={{ color: t.a }}>
                  {t.name}{t.id === active && <Check size={12} />}
                </p>
                <p className="text-[10px] text-gray-500 leading-snug">{t.line}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
