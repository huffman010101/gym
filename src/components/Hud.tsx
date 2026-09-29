import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/*
 * Shared J.A.R.V.I.S. chrome so every section looks and reads the same:
 * a header, a tab bar, and the "if you only read one thing" box. Page content
 * keeps its own local helpers (see CLAUDE.md); only the frame is shared.
 */

export function SectionHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <Link to="/" className="inline-flex items-center gap-1 font-hud text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400/70 hover:text-cyan-200 mb-4">
        <ChevronLeft size={14} /> Command
      </Link>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.07] flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.15)] flex-shrink-0">
          <Icon size={21} className="text-cyan-300" />
        </div>
        <div className="min-w-0">
          <p className="font-hud text-[10px] uppercase tracking-[0.28em] text-gray-500 leading-none">J.A.R.V.I.S. // Section</p>
          <h1 className="text-2xl font-black text-white leading-tight mt-1">{title}</h1>
          {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function TabBar<T extends string>({ tabs, active, onChange }: { tabs: { id: T; label: string }[]; active: T; onChange: (id: T) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-5 -mx-5 px-5 pb-1">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex-shrink-0 px-3.5 py-2 rounded-lg font-hud text-[13px] font-bold uppercase tracking-wide border transition-all ${
            active === t.id
              ? 'bg-cyan-400/15 border-cyan-300/60 text-cyan-50 shadow-[0_0_14px_rgba(34,211,238,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* The top-of-tab summary. Every tab in the app opens with one. */
export function OneThing({ points }: { points: ReactNode[] }) {
  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-4">
      <p className="font-hud text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300 mb-2">If you only read one thing</p>
      <ul className="space-y-1.5">
        {points.map((p, i) => (
          <li key={i} className="text-gray-200 text-[13px] leading-relaxed flex gap-2">
            <span className="text-cyan-400 flex-shrink-0">▸</span><span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
