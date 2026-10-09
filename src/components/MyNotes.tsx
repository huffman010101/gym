import { useState, type ReactNode } from 'react';
import { ChevronDown, Shuffle, Plus, X, Lock, Flame, Sun } from 'lucide-react';
import { NOTE_GROUPS as GROUPS, AFFIRMATIONS, BEFORE_OUT, DAILY } from '../data/myNotes';

/*
 * Mind → My Notes: the owner's own rules, organised and kept short, with a
 * daily view that surfaces three of them each day. Notes they add here join
 * the daily rotation. Anything about girls stays behind the Game Plan lock.
 * The notes themselves live in src/data/myNotes.ts.
 */

const K_NOTES = 'gymforge_my_notes';

function dayNumber() {
  const d = new Date();
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5);
}

function Fold({ title, tag, open, onToggle, children }: { title: string; tag: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-pink-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
}

export default function MyNotes({ unlocked }: { unlocked: boolean }) {
  const [mine, setMine] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(K_NOTES) || '[]') as string[]; } catch { return []; }
  });
  const [draft, setDraft] = useState('');
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState<Record<string, boolean>>({ 'Who I am': true });

  const saveMine = (next: string[]) => {
    setMine(next);
    try { localStorage.setItem(K_NOTES, JSON.stringify(next)); } catch { /* quota */ }
  };
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    saveMine([t, ...mine]);
    setDraft('');
  };

  // Three a day, stepping through the whole pool so nothing repeats for days.
  const pool = [...mine, ...DAILY];
  const start = ((dayNumber() + offset) * 3) % pool.length;
  const today = [0, 1, 2].map(i => pool[(start + i) % pool.length]).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="space-y-4">
      {/* ---------- daily view ---------- */}
      <div className="bg-[#111] border border-pink-500/30 rounded-2xl p-5" data-testid="notes-today">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-hud text-[12px] font-bold uppercase tracking-[0.22em] text-pink-300">Today's three</h3>
          <button onClick={() => setOffset(o => o + 1)} className="text-[11px] text-gray-500 hover:text-pink-300 inline-flex items-center gap-1"><Shuffle size={12} /> Another three</button>
        </div>
        <ol className="space-y-2.5">
          {today.map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="font-orbitron text-pink-300/80 text-sm w-4 flex-shrink-0">{i + 1}</span>
              <span className="text-[15px] text-gray-100 leading-snug">{t}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-gray-600 mt-3">New three every day, drawn from your notes below and anything you add.</p>
      </div>

      {/* ---------- every morning ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 flex items-center gap-2 mb-1"><Sun size={15} className="text-pink-400" /> Every morning, out loud</h3>
        <p className="text-xs text-gray-500 mb-2.5">Say them like you mean them. Then act like they are true.</p>
        <ul className="space-y-1">
          {AFFIRMATIONS.map(t => <li key={t} className="text-[15px] text-gray-200 font-semibold">{t}</li>)}
        </ul>
      </div>

      {/* ---------- before going out ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 flex items-center gap-2 mb-2.5"><Flame size={15} className="text-pink-400" /> Before you go out</h3>
        <ul className="space-y-1.5">
          {BEFORE_OUT.map(t => <li key={t} className="text-sm text-gray-400 flex gap-2"><span className="text-pink-400">▸</span>{t}</li>)}
        </ul>
      </div>

      {/* ---------- the notes, organised ---------- */}
      {GROUPS.map(g => (
        g.locked && !unlocked ? (
          <div key={g.title} className="bg-[#111] border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between">
            <p className="font-bold text-gray-500">{g.title}</p>
            <span className="text-[11px] text-gray-600 inline-flex items-center gap-1"><Lock size={11} /> Unlock in Game Plan</span>
          </div>
        ) : (
          <Fold key={g.title} title={g.title} tag={g.tag} open={!!open[g.title]} onToggle={() => setOpen(o => ({ ...o, [g.title]: !o[g.title] }))}>
            {g.items.map(([t, d]) => (
              <div key={t}>
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </Fold>
        )
      ))}

      {/* ---------- your own additions ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">Add a note</h3>
        <p className="text-xs text-gray-500 mb-3">Something you heard, read or learned the hard way. Keep it to one line; it joins the daily three.</p>
        <div className="flex gap-2">
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="e.g. Slow down when you feel nervous"
            className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-pink-400/50" aria-label="New note" />
          <button onClick={add} disabled={!draft.trim()} className="rounded-xl px-3 border border-pink-300/40 text-pink-100 disabled:opacity-35" aria-label="Add note"><Plus size={16} /></button>
        </div>
        {mine.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {mine.map((t, i) => (
              <li key={t + i} className="flex items-start justify-between gap-2 text-sm text-gray-300 bg-black/25 rounded-lg px-3 py-2">
                <span>{t}</span>
                <button onClick={() => saveMine(mine.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-300 flex-shrink-0" aria-label="Delete note"><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
