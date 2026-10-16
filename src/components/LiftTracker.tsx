import { useState } from 'react';
import { ChevronDown, TrendingUp, AlertTriangle, Trash2, Plus } from 'lucide-react';

/*
 * Gym → Lean Bulk: log the top set of each main lift and get the next
 * target from double progression (hit the top of the rep range → add the
 * smallest jump and drop to the bottom). Flags a lift as stalled when its
 * estimated 1RM has not beaten its previous best in 3 sessions across 2+
 * weeks. Stored in gymforge_lifts, so it syncs.
 */

const K = 'gymforge_lifts';
type Entry = { d: string; kg: number; reps: number };
type Log = Record<string, Entry[]>;
interface Lift { id: string; name: string; day: string; lo: number; hi: number; step: number; unit: string; bw?: boolean; goal: [number, number] }

export const LIFTS: Lift[] = [
  { id: 'incline', name: 'Incline DB press', day: 'Mon', lo: 8, hi: 10, step: 2, unit: 'kg per hand', goal: [40, 8] },
  { id: 'bench', name: 'Bench press', day: 'Mon', lo: 6, hi: 10, step: 2.5, unit: 'kg', goal: [110, 6] },
  { id: 'dips', name: 'Weighted dips', day: 'Mon', lo: 8, hi: 10, step: 2.5, unit: 'kg added', bw: true, goal: [40, 8] },
  { id: 'trap', name: 'Trap bar deadlift', day: 'Wed', lo: 4, hi: 6, step: 5, unit: 'kg', goal: [200, 5] },
  { id: 'bss', name: 'Bulgarian split squat', day: 'Wed', lo: 8, hi: 10, step: 2, unit: 'kg per hand', goal: [32, 8] },
  { id: 'pullup', name: 'Weighted pull-up', day: 'Thu', lo: 6, hi: 8, step: 2.5, unit: 'kg added', bw: true, goal: [30, 6] },
  { id: 'row', name: 'Chest-supported row', day: 'Thu', lo: 8, hi: 10, step: 2, unit: 'kg per hand', goal: [40, 8] },
  { id: 'curl', name: 'Incline DB curl', day: 'Thu', lo: 10, hi: 12, step: 1, unit: 'kg per hand', goal: [18, 10] },
  { id: 'ohp', name: 'Seated DB shoulder press', day: 'Fri', lo: 8, hi: 10, step: 2, unit: 'kg per hand', goal: [34, 8] },
];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const daysBetween = (a: string, b: string) => Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000);
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/** Latest bodyweight from quick weigh-ins, Physique, or the quiz — for dips and pull-ups. */
export function latestBodyweight(): number | null {
  try {
    const w = JSON.parse(localStorage.getItem('gymforge_weighins') || '[]') as { d: string; kg: number }[];
    if (w.length) return [...w].sort((a, b) => b.d.localeCompare(a.d))[0].kg;
  } catch { /* ignore */ }
  try {
    const m = JSON.parse(localStorage.getItem('gymforge_body_metrics') || '[]') as { date: string; weight: number }[];
    const ok = m.filter(x => x.weight > 0).sort((a, b) => b.date.localeCompare(a.date));
    if (ok.length) return ok[0].weight;
  } catch { /* ignore */ }
  try {
    const q = JSON.parse(localStorage.getItem('gymforge_quiz') || '{}') as { unit?: string; weightKg?: string; weightLbs?: string };
    const kg = q.unit === 'metric' ? +(q.weightKg ?? 0) : +(q.weightLbs ?? 0) / 2.205;
    if (kg > 0) return Math.round(kg);
  } catch { /* ignore */ }
  return null;
}

function e1rm(l: Lift, e: Entry, bw: number) {
  const load = l.bw ? bw + e.kg : e.kg;
  return load * (1 + e.reps / 30);
}

export function nextTarget(l: Lift, last?: Entry): { kg: number; reps: number; up: boolean } | null {
  if (!last) return null;
  if (last.reps >= l.hi) return { kg: last.kg + l.step, reps: l.lo, up: true };
  if (last.reps < l.lo) return { kg: last.kg, reps: l.lo, up: false };
  return { kg: last.kg, reps: last.reps + 1, up: false };
}

/** Stalled = 3+ sessions over 14+ days without beating the previous best e1RM. */
export function liftStatus(l: Lift, hist: Entry[], bw: number): 'new' | 'moving' | 'holding' | 'stalled' {
  if (hist.length < 4) return 'new';
  const sorted = [...hist].sort((a, b) => a.d.localeCompare(b.d));
  const recent = sorted.slice(-3);
  const before = sorted.slice(0, -3);
  const bestBefore = Math.max(...before.map(e => e1rm(l, e, bw)));
  const bestRecent = Math.max(...recent.map(e => e1rm(l, e, bw)));
  if (bestRecent > bestBefore + 0.01) return 'moving';
  return daysBetween(recent[0].d, recent[recent.length - 1].d) >= 14 ? 'stalled' : 'holding';
}

function Row({ l, hist, bw, onAdd, onDel }: { l: Lift; hist: Entry[]; bw: number; onAdd: (e: Entry) => void; onDel: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const sorted = [...hist].sort((a, b) => b.d.localeCompare(a.d));
  const last = sorted[0];
  const t = nextTarget(l, last);
  const status = liftStatus(l, hist, bw);
  const [kg, setKg] = useState('');
  const [reps, setReps] = useState('');
  const first = sorted[sorted.length - 1];
  const goalPct = last ? Math.min(100, Math.round((e1rm(l, last, bw) / e1rm(l, { d: '', kg: l.goal[0], reps: l.goal[1] }, bw)) * 100)) : 0;
  const gain = last && first && last !== first ? e1rm(l, last, bw) - e1rm(l, first, bw) : 0;

  const submit = () => {
    const k = parseFloat(kg), r = parseInt(reps, 10);
    if (isNaN(k) || k < 0 || isNaN(r) || r < 1 || r > 50) return;
    onAdd({ d: today(), kg: k, reps: r });
    setKg(''); setReps('');
  };
  const input = 'w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-sm text-gray-100 outline-none focus:border-orange-400/50';

  return (
    <div className={`rounded-xl border ${status === 'stalled' ? 'border-amber-400/35 bg-amber-500/[0.04]' : 'border-white/8 bg-black/25'}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 px-3 py-2.5 text-left">
        <span className="text-[10px] font-black text-orange-400 w-7 flex-shrink-0">{l.day}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-semibold text-gray-100 truncate">{l.name}</span>
          <span className="block text-[11px] text-gray-500">
            {last ? <>Last {fmt(last.kg)} × {last.reps}</> : <>{l.lo}-{l.hi} reps · not logged yet</>}
            {t && <> · <span className={t.up ? 'text-emerald-300 font-semibold' : 'text-orange-200'}>Next {fmt(t.kg)} × {t.reps}{t.up ? ' ↑' : ''}</span></>}
          </span>
        </span>
        {status === 'stalled' && <AlertTriangle size={14} className="text-amber-300 flex-shrink-0" aria-label="Stalled" />}
        {status === 'moving' && <TrendingUp size={14} className="text-emerald-300 flex-shrink-0" aria-label="Moving" />}
        <ChevronDown size={14} className={`text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2.5">
          <p className="text-[11px] text-gray-500">Log your best set ({l.unit}). Hit {l.hi} reps and the next target adds {fmt(l.step)}kg.</p>
          <div>
            <div className="flex justify-between text-[11px]"><span className="text-gray-400">Hemsworth standard: <span className="text-orange-200 font-semibold">{fmt(l.goal[0])} × {l.goal[1]}</span></span><span className="text-gray-500">{last ? `${goalPct}%` : '—'}</span></div>
            <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden"><div className="h-full rounded-full bg-orange-400/80" style={{ width: `${goalPct}%` }} /></div>
          </div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input inputMode="decimal" value={kg} onChange={e => setKg(e.target.value)} placeholder={last ? fmt(t?.kg ?? last.kg) : 'kg'} className={input} aria-label={`${l.name} weight`} />
            <input inputMode="numeric" value={reps} onChange={e => setReps(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder={t ? String(t.reps) : 'reps'} className={input} aria-label={`${l.name} reps`} />
            <button onClick={submit} className="rounded-lg px-3 text-xs font-hud font-bold uppercase tracking-wider border border-orange-300/40 text-orange-100 bg-orange-400/10 inline-flex items-center gap-1"><Plus size={12} /> Log</button>
          </div>
          {status === 'stalled' && (
            <p className="text-xs text-amber-100/90 leading-relaxed border-l-2 border-amber-400/50 pl-2.5">
              No new best in 3 sessions over 2+ weeks. Work through these in order: check the bodyweight trend below and add 200 kcal a day if it is flat · sleep 8h+ the night before this session · take the last set to 1 rep from failure · still stuck after 2 more weeks? Drop 10% and build back up over 3 weeks, or swap to a close variation.
            </p>
          )}
          {sorted.length > 0 && (
            <div className="space-y-1">
              {gain !== 0 && <p className={`text-[11px] font-semibold ${gain > 0 ? 'text-emerald-300' : 'text-red-300'}`}>Estimated max {gain > 0 ? '+' : ''}{fmt(Math.round(gain * 10) / 10)}kg since {first.d.slice(5)}</p>}
              {sorted.slice(0, 6).map(e => (
                <div key={e.d + e.kg + e.reps} className="flex items-center justify-between text-xs text-gray-400">
                  <span>{e.d.slice(5)} · {fmt(e.kg)} × {e.reps}</span>
                  <button onClick={() => onDel(hist.indexOf(e))} className="text-gray-600 hover:text-red-300 p-1" aria-label="Delete entry"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LiftTracker() {
  const [log, setLog] = useState<Log>(() => { try { return JSON.parse(localStorage.getItem(K) || '{}'); } catch { return {}; } });
  const bw = latestBodyweight() ?? 80;
  const persist = (next: Log) => { setLog(next); try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ } };

  const add = (id: string, e: Entry) => {
    // One entry per lift per day — a re-log today replaces it.
    const hist = (log[id] ?? []).filter(x => x.d !== e.d);
    persist({ ...log, [id]: [...hist, e].slice(-60) });
  };
  const del = (id: string, i: number) => persist({ ...log, [id]: (log[id] ?? []).filter((_, j) => j !== i) });

  const statuses = LIFTS.map(l => liftStatus(l, log[l.id] ?? [], bw));
  const moving = statuses.filter(s => s === 'moving').length;
  const stalled = statuses.filter(s => s === 'stalled').length;
  const logged = LIFTS.filter(l => (log[l.id] ?? []).length > 0).length;

  return (
    <div className="bg-[#111] border border-orange-500/30 rounded-2xl p-4 space-y-3" data-testid="lift-tracker">
      <div>
        <h3 className="font-black text-orange-300 flex items-center gap-2"><TrendingUp size={16} /> Lift tracker</h3>
        <p className="text-xs text-gray-500 mt-0.5">Log your best set after each lift and it tells you what to beat next time. It flags any lift that stops moving.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[['Logged', `${logged}/${LIFTS.length}`, 'text-gray-200'], ['Moving', String(moving), 'text-emerald-300'], ['Stalled', String(stalled), stalled ? 'text-amber-300' : 'text-gray-500']].map(([k, v, c]) => (
          <div key={k} className="rounded-lg bg-black/30 py-2">
            <p className={`font-hud text-lg font-bold ${c}`}>{v}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">{k}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {LIFTS.map(l => <Row key={l.id} l={l} hist={log[l.id] ?? []} bw={bw} onAdd={e => add(l.id, e)} onDel={i => del(l.id, i)} />)}
      </div>
      <p className="text-[11px] text-gray-600">A lift needs 4 logged sessions before it can show as moving or stalled. The estimated max uses the Epley formula and includes your bodyweight on dips and pull-ups.</p>
    </div>
  );
}
