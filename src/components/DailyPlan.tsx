import { useEffect, useState } from 'react';
import { CalendarDays, Check, Plus, X, Sparkles, Loader2, ChevronDown, Target, Flag } from 'lucide-react';
import { todaysSession } from '../lib/whoop';
import { planAdvice } from '../lib/generators';

/*
 * The plan on the command screen: today's priorities with ticks, week goals,
 * and the next seven days planned ahead. Dates are LOCAL calendar dates — UTC
 * dates put a plan written after midnight in the UK on the wrong day.
 * Storage keys are unchanged: gymforge_plan_YYYY-MM-DD and gymforge_plan_done_YYYY-MM-DD.
 */

export const localDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

interface Plan { priorities: string[]; notes: string; advice?: string[] }

const load = (day: string): Plan | null => {
  try {
    const raw = localStorage.getItem(`gymforge_plan_${day}`);
    return raw ? (JSON.parse(raw) as Plan) : null;
  } catch { return null; }
};

const dateAt = (offset: number) => { const d = new Date(); d.setDate(d.getDate() + offset); return d; };

/* Monday of the week a date falls in, as a local YYYY-MM-DD — the key for week goals. */
export function weekKey(d = new Date()) {
  const m = new Date(d);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(m.getDate()).padStart(2, '0')}`;
}

/* The week goals refer to. On Sunday you are planning the week ahead, so
 * Sunday's goals belong to the coming Monday's week, not the one ending. */
export function goalsWeekKey(now = new Date()) {
  if (now.getDay() !== 0) return weekKey(now);
  const mon = new Date(now);
  mon.setDate(mon.getDate() + 1);
  return weekKey(mon);
}

export function loadWeekGoals(key = goalsWeekKey()): string[] {
  try { return (JSON.parse(localStorage.getItem(`gymforge_week_${key}`) || '[]') as string[]).filter(Boolean); } catch { return []; }
}

/* Training for a date, from the fixed weekly plan (recovery is unknown ahead of time). */
const trainingFor = (d: Date) => todaysSession(null, d).title.replace(' + ankle work', '').replace(' day', '').replace(' + Speed', '');

function Editor({ day, initial, onSaved, cta }: { day: string; initial: Plan | null; onSaved: (p: Plan) => void; cta: string }) {
  const [tasks, setTasks] = useState<string[]>(initial?.priorities.length ? initial.priorities : ['', '', '']);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const priorities = tasks.map(s => s.trim()).filter(Boolean);
    const plan: Plan = { priorities, notes: notes.trim() };
    try { localStorage.setItem(`gymforge_plan_${day}`, JSON.stringify(plan)); } catch { /* quota */ }
    onSaved(plan);
    // AI advice per task is a bonus — the plan is already saved.
    if (priorities.length) {
      setBusy(true);
      try {
        const advice = await planAdvice(priorities, plan.notes);
        const withAdvice = { ...plan, advice };
        localStorage.setItem(`gymforge_plan_${day}`, JSON.stringify(withAdvice));
        onSaved(withAdvice);
      } catch { /* offline or no key: fine */ }
      setBusy(false);
    }
  };

  const input = 'flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-cyan-400/50';
  return (
    <div className="space-y-2 mt-3">
      {tasks.map((v, i) => (
        <div key={i} className="flex gap-1.5">
          <input value={v} onChange={e => setTasks(t => t.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={`${i + 1}. ${['The hardest thing first', 'Training', 'One thing that moves money or uni forward'][i] ?? 'Task…'}`}
            className={input} />
          {tasks.length > 1 && (
            <button onClick={() => setTasks(t => t.filter((_, j) => j !== i))} className="w-8 text-gray-600 hover:text-rose-300" aria-label="Remove"><X size={14} className="mx-auto" /></button>
          )}
        </div>
      ))}
      <button onClick={() => setTasks(t => [...t, ''])}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/15 hover:border-cyan-400/40 text-gray-500 hover:text-cyan-300 py-1.5 rounded-lg text-xs font-bold">
        <Plus size={12} /> Add a task
      </button>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
        placeholder="Anything else — timings, where you need to be, the mindset for the day"
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-cyan-400/50 resize-none" />
      <button onClick={save} disabled={busy || (!tasks.some(t => t.trim()) && !notes.trim())}
        className="w-full rounded-lg py-2.5 font-hud font-bold uppercase tracking-[0.16em] text-sm bg-cyan-400/15 border border-cyan-300/50 text-cyan-50 disabled:opacity-35 inline-flex items-center justify-center gap-2">
        {busy ? <><Loader2 size={14} className="animate-spin" /> Saved — adding advice…</> : cta}
      </button>
    </div>
  );
}

export default function DailyPlan() {
  const today = localDate(0);
  const [todayPlan, setTodayPlan] = useState<Plan | null>(() => load(today));
  const [done, setDone] = useState<Record<number, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(`gymforge_plan_done_${today}`) || '{}') as Record<number, boolean>; } catch { return {}; }
  });
  const [editToday, setEditToday] = useState(false);

  // The week: today plus the next six days. Each day uses the same key as
  // today's plan, so whatever is planned for Thursday becomes Thursday's plan.
  const days = Array.from({ length: 7 }, (_, i) => ({ offset: i, key: localDate(i), date: dateAt(i) }));
  const [week, setWeek] = useState<Record<string, Plan | null>>(() => Object.fromEntries(days.map(d => [d.key, load(d.key)])));
  const now = new Date();
  const evening = now.getHours() >= 18;
  const planningTime = evening && now.getDay() === 0; // Sunday evening
  const [selected, setSelected] = useState<string | null>(null);
  const wk = goalsWeekKey(now);
  const [goals, setGoals] = useState<string[]>(() => loadWeekGoals(wk));
  const [editGoals, setEditGoals] = useState(false);
  const [goalDraft, setGoalDraft] = useState<string[]>(() => { const g = loadWeekGoals(wk); return [g[0] ?? '', g[1] ?? '', g[2] ?? '']; });

  // Housekeeping: drop days that have passed (and old week goals), keep the future.
  useEffect(() => {
    try {
      const drop: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        const m = k.match(/^gymforge_(?:plan|plan_done)_(\d{4}-\d{2}-\d{2})$/);
        if (m && m[1] < today) drop.push(k);
        const w = k.match(/^gymforge_week_(\d{4}-\d{2}-\d{2})$/);
        if (w && w[1] < weekKey(dateAt(-14))) drop.push(k);
      }
      drop.forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
  }, [today]);

  const saveGoals = () => {
    const g = goalDraft.map(x => x.trim()).filter(Boolean);
    setGoals(g);
    try { localStorage.setItem(`gymforge_week_${wk}`, JSON.stringify(g)); } catch { /* quota */ }
    setEditGoals(false);
  };

  const toggle = (i: number) => {
    const next = { ...done, [i]: !done[i] };
    setDone(next);
    try { localStorage.setItem(`gymforge_plan_done_${today}`, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const has = !!todayPlan && (todayPlan.priorities.length > 0 || !!todayPlan.notes);
  const count = todayPlan?.priorities.length ?? 0;
  const ticked = todayPlan ? todayPlan.priorities.filter((_, i) => done[i]).length : 0;
  const allDone = count > 0 && ticked === count;

  return (
    <div className="space-y-3">
      {/* ---------- Today ---------- */}
      <div className={`hud-panel p-4 ${allDone ? 'border-emerald-400/40' : ''}`}>
        <div className="flex items-center justify-between">
          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/80 flex items-center gap-1.5">
            <Target size={12} /> Today's plan
          </p>
          {has && (
            <div className="flex items-center gap-3">
              <span className={`font-orbitron text-xs ${allDone ? 'text-emerald-300' : 'text-gray-400'}`}>{ticked}/{count}</span>
              <button onClick={() => setEditToday(e => !e)} className="text-[10px] font-hud font-bold uppercase tracking-wider text-gray-500 hover:text-cyan-300">
                {editToday ? 'Close' : 'Edit'}
              </button>
            </div>
          )}
        </div>

        {has && !editToday && (
          <div className="space-y-2 mt-3">
            {todayPlan!.priorities.map((p, i) => (
              <div key={i}>
                <button onClick={() => toggle(i)} className="w-full flex items-center gap-2.5 text-left">
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${done[i] ? 'bg-cyan-400 border-cyan-300' : 'border-white/20'}`}>
                    {done[i] && <Check size={12} className="text-black" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm ${done[i] ? 'text-gray-600 line-through' : 'text-gray-100'}`}>{p}</span>
                </button>
                {todayPlan!.advice?.[i] && !done[i] && (
                  <p className="text-[11px] text-cyan-200/60 leading-snug ml-7 mt-0.5 flex items-start gap-1">
                    <Sparkles size={10} className="flex-shrink-0 mt-0.5" /> {todayPlan!.advice[i]}
                  </p>
                )}
              </div>
            ))}
            {todayPlan!.notes && <p className="text-gray-500 text-xs leading-relaxed pt-1">{todayPlan!.notes}</p>}
            {allDone && <p className="text-emerald-300 text-xs font-hud uppercase tracking-[0.2em] pt-1">All done. Exemplary, sir.</p>}
          </div>
        )}

        {(!has || editToday) && (
          <>
            {!has && <p className="text-gray-400 text-sm mt-2">No plan for today yet. Write the three things that would make today a win — hardest first.</p>}
            <Editor key={`today-${editToday}`} day={today} initial={todayPlan} cta={has ? 'Update today' : 'Set today\'s plan'}
              onSaved={p => { setTodayPlan(p); setWeek(w => ({ ...w, [today]: p })); setEditToday(false); }} />
          </>
        )}
      </div>

      {/* ---------- The week ---------- */}
      <div className={`hud-panel p-4 ${planningTime ? 'border-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.12)]' : ''}`}>
        <div className="flex items-center justify-between">
          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.25em] text-yellow-300/90 flex items-center gap-1.5">
            <CalendarDays size={12} /> The week
          </p>
          {planningTime && <span className="text-[10px] font-hud uppercase tracking-wider text-yellow-300/80">Sunday — plan it now</span>}
        </div>

        {/* Week goals */}
        <div className="mt-3 rounded-xl border border-yellow-400/20 bg-yellow-400/[0.04] p-3">
          <div className="flex items-center justify-between">
            <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-yellow-400/80 flex items-center gap-1.5"><Flag size={10} /> {now.getDay() === 0 ? "Next week's goals" : "This week's goals"}</p>
            <button onClick={() => setEditGoals(e => !e)} className="text-[10px] font-hud font-bold uppercase tracking-wider text-gray-500 hover:text-yellow-300">
              {editGoals ? 'Close' : goals.length ? 'Edit' : 'Set'}
            </button>
          </div>
          {!editGoals && (goals.length
            ? <ol className="mt-1.5 space-y-1">{goals.map((g, i) => <li key={i} className="text-sm text-gray-100 flex gap-2"><span className="font-orbitron text-yellow-300 text-xs mt-0.5">{i + 1}</span>{g}</li>)}</ol>
            : <p className="text-xs text-gray-500 mt-1">Three things that would make this week a win.</p>)}
          {editGoals && (
            <div className="mt-2 space-y-1.5">
              {goalDraft.map((g, i) => (
                <input key={i} value={g} onChange={e => setGoalDraft(d => d.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`${i + 1}. ${['Hit every session', 'Revise 10 hours', 'Talk to 30 new people'][i]}`}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-yellow-400/50" />
              ))}
              <button onClick={saveGoals} className="w-full rounded-lg py-2 font-hud font-bold uppercase tracking-[0.16em] text-xs bg-yellow-400/10 border border-yellow-300/40 text-yellow-100">Save goals</button>
            </div>
          )}
        </div>

        {/* Day strip */}
        <div className="grid grid-cols-7 gap-1 mt-3">
          {days.map(d => {
            const p = week[d.key];
            const n = p?.priorities.length ?? 0;
            const isSel = selected === d.key;
            return (
              <button key={d.key} onClick={() => setSelected(isSel ? null : d.key)}
                className={`rounded-lg border px-0.5 py-2 text-center transition-colors ${isSel ? 'border-yellow-300/60 bg-yellow-400/10' : d.offset === 0 ? 'border-cyan-400/40 bg-cyan-400/[0.06]' : 'border-white/10 bg-white/[0.02] hover:border-white/25'}`}>
                <p className={`font-hud text-[10px] font-bold uppercase ${d.offset === 0 ? 'text-cyan-200' : 'text-gray-300'}`}>
                  {d.offset === 0 ? 'Today' : d.date.toLocaleDateString([], { weekday: 'short' })}
                </p>
                <p className="font-orbitron text-sm text-gray-100 leading-tight">{d.date.getDate()}</p>
                <p className="text-[8px] text-gray-500 leading-tight mt-0.5 truncate px-0.5">{trainingFor(d.date)}</p>
                <p className={`text-[9px] mt-1 font-bold ${n ? 'text-yellow-300' : 'text-gray-700'}`}>{n ? `${n} task${n === 1 ? '' : 's'}` : '—'}</p>
              </button>
            );
          })}
        </div>

        {selected && (() => {
          const d = days.find(x => x.key === selected)!;
          return (
            <div className="mt-3 border-t border-white/5 pt-3">
              <p className="text-sm font-semibold text-gray-100">
                {d.offset === 0 ? 'Today' : d.offset === 1 ? 'Tomorrow' : d.date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
                <span className="text-xs text-gray-500 font-normal ml-2">Training: {trainingFor(d.date)}</span>
              </p>
              <Editor key={selected} day={selected} initial={week[selected]} cta={week[selected] ? 'Update this day' : 'Lock in this day'}
                onSaved={p => {
                  setWeek(w => ({ ...w, [selected]: p }));
                  if (selected === today) setTodayPlan(p);
                }} />
            </div>
          );
        })()}
        {!selected && <p className="text-[11px] text-gray-500 mt-2">Tap a day to plan it. Each day becomes "Today's plan" when it arrives.</p>}
      </div>
    </div>
  );
}
