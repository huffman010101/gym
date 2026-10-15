import { useState } from 'react';
import { Scale, Trash2 } from 'lucide-react';

/*
 * Gym → Lean Bulk: quick morning weigh-ins (gymforge_weighins, synced) plus
 * any weights logged in Physique. Fits a line through the last 28 days and
 * turns the slope into one instruction: eat more, hold, or eat less. Also
 * reads waist from Physique, because a fast-rising waist is what softens the
 * jawline first.
 */

const K = 'gymforge_weighins';
type W = { d: string; kg: number };

const LOW = 0.1, HIGH = 0.35; // kg per week — lean-bulk target band

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const dayNum = (s: string) => new Date(s + 'T00:00:00').getTime() / 86400000;

function physique(): { date: string; weight: number; waist: number }[] {
  try { return JSON.parse(localStorage.getItem('gymforge_body_metrics') || '[]'); } catch { return []; }
}

/** Least-squares slope in kg/week over the last 28 days, or null without enough data. */
export function weeklyRate(points: W[]): { rate: number; avg7: number; n: number } | null {
  if (!points.length) return null;
  const end = Math.max(...points.map(p => dayNum(p.d)));
  const win = points.filter(p => dayNum(p.d) >= end - 28);
  const span = win.length ? end - Math.min(...win.map(p => dayNum(p.d))) : 0;
  const last7 = points.filter(p => dayNum(p.d) > end - 7);
  const avg7 = last7.reduce((a, p) => a + p.kg, 0) / (last7.length || 1);
  if (win.length < 4 || span < 10) return { rate: NaN, avg7, n: win.length };
  const xs = win.map(p => dayNum(p.d)), ys = win.map(p => p.kg);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0, den = 0;
  xs.forEach((x, i) => { num += (x - mx) * (ys[i] - my); den += (x - mx) ** 2; });
  return { rate: den ? (num / den) * 7 : 0, avg7, n: win.length };
}

export default function BulkCheck() {
  const [own, setOwn] = useState<W[]>(() => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } });
  const [kg, setKg] = useState('');
  const persist = (next: W[]) => { setOwn(next); try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ } };

  const log = () => {
    const v = parseFloat(kg);
    if (isNaN(v) || v < 30 || v > 250) return;
    persist([...own.filter(w => w.d !== today()), { d: today(), kg: v }].sort((a, b) => a.d.localeCompare(b.d)).slice(-120));
    setKg('');
  };

  const metrics = physique();
  // Quick weigh-ins win on days that have both.
  const merged: W[] = [
    ...own,
    ...metrics.filter(m => m.weight > 0 && !own.some(w => w.d === m.date)).map(m => ({ d: m.date, kg: m.weight })),
  ].sort((a, b) => a.d.localeCompare(b.d));
  const r = weeklyRate(merged);

  const waists = metrics.filter(m => m.waist > 0).sort((a, b) => a.date.localeCompare(b.date));
  let waistNote = '';
  if (waists.length >= 2) {
    const last = waists[waists.length - 1];
    const base = [...waists].reverse().find(w => dayNum(last.date) - dayNum(w.date) >= 21);
    if (base) {
      const perMonth = ((last.waist - base.waist) / (dayNum(last.date) - dayNum(base.date))) * 30;
      waistNote = perMonth > 1
        ? `Waist rising about ${perMonth.toFixed(1)}cm a month — faster than muscle explains. Trim 150-200 kcal a day to protect your jawline.`
        : `Waist ${perMonth >= 0 ? '+' : ''}${perMonth.toFixed(1)}cm a month — fine, the gain is mostly going where you want it.`;
    }
  }

  let verdict: { tone: string; title: string; text: string } | null = null;
  if (r && !isNaN(r.rate)) {
    if (r.rate < LOW) verdict = { tone: 'amber', title: 'Not gaining — eat more', text: 'This is the most likely reason your lifts are stuck. Add 200 kcal a day (a pint of whole milk, or a bowl of oats with peanut butter) and check again in two weeks.' };
    else if (r.rate > HIGH) verdict = { tone: 'red', title: 'Gaining too fast', text: 'Above about 0.35kg a week, most of the extra is fat, and it shows on your face first. Drop 150-200 kcal a day — usually the snacks or the liquid calories.' };
    else verdict = { tone: 'emerald', title: 'On track', text: 'This is the lean-bulk window: fast enough to build, slow enough to keep your jawline. Change nothing and keep beating the logbook.' };
  }
  const tones: Record<string, string> = {
    amber: 'border-amber-400/40 bg-amber-500/[0.06] text-amber-100',
    red: 'border-red-400/40 bg-red-500/[0.06] text-red-100',
    emerald: 'border-emerald-400/40 bg-emerald-500/[0.06] text-emerald-100',
  };

  return (
    <div className="bg-[#111] border border-orange-500/30 rounded-2xl p-4 space-y-3" data-testid="bulk-check">
      <div>
        <h3 className="font-black text-orange-300 flex items-center gap-2"><Scale size={16} /> Bulk check</h3>
        <p className="text-xs text-gray-500 mt-0.5">Weigh yourself first thing, after the toilet, 3-4 mornings a week. The trend tells you whether to eat more or less — no need to guess.</p>
      </div>
      <div className="flex gap-2">
        <input inputMode="decimal" value={kg} onChange={e => setKg(e.target.value)} onKeyDown={e => e.key === 'Enter' && log()} placeholder="Morning weight (kg)"
          className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-orange-400/50" aria-label="Morning weight" />
        <button onClick={log} disabled={!kg} className="rounded-xl px-4 text-sm font-hud font-bold uppercase tracking-wider border border-orange-300/40 text-orange-100 bg-orange-400/10 disabled:opacity-35">Log</button>
      </div>

      {r && (
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-black/30 py-2">
            <p className="font-hud text-lg font-bold text-gray-100">{r.avg7.toFixed(1)}kg</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">7-day average</p>
          </div>
          <div className="rounded-lg bg-black/30 py-2">
            <p className="font-hud text-lg font-bold text-gray-100">{isNaN(r.rate) ? '—' : `${r.rate >= 0 ? '+' : ''}${r.rate.toFixed(2)}`}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">kg per week</p>
          </div>
        </div>
      )}
      {verdict ? (
        <div className={`border rounded-xl px-3 py-2.5 ${tones[verdict.tone]}`}>
          <p className="text-sm font-bold">{verdict.title}</p>
          <p className="text-xs opacity-85 leading-relaxed mt-0.5">{verdict.text}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-500">Needs 4 weigh-ins over at least 10 days{r ? ` — you have ${r.n}` : ''}. Target: +0.1 to +0.35kg a week.</p>
      )}
      {waistNote && <p className="text-xs text-gray-300 border-l-2 border-orange-400/40 pl-2.5">{waistNote}</p>}

      {own.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {[...own].reverse().slice(0, 8).map(w => (
            <span key={w.d} className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-black/30 rounded-full pl-2.5 pr-1 py-0.5">
              {w.d.slice(5)} · {w.kg}
              <button onClick={() => persist(own.filter(x => x.d !== w.d))} className="p-0.5 text-gray-600 hover:text-red-300" aria-label={`Delete ${w.d}`}><Trash2 size={10} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
