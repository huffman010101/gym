import { useEffect, useState } from 'react';
import { CalendarDays, Check, Plus, X, Sparkles, Loader2, ChevronDown, Target } from 'lucide-react';
import { planAdvice } from '../lib/generators';

/*
 * The daily plan on the command screen: today's priorities with ticks, and
 * tomorrow's planned the night before. Dates are LOCAL calendar dates — UTC
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
  const tomorrowKey = localDate(1);
  const [todayPlan, setTodayPlan] = useState<Plan | null>(() => load(today));
  const [tomorrow, setTomorrow] = useState<Plan | null>(() => load(tomorrowKey));
  const [done, setDone] = useState<Record<number, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(`gymforge_plan_done_${today}`) || '{}') as Record<number, boolean>; } catch { return {}; }
  });
  const [editToday, setEditToday] = useState(false);
  const evening = new Date().getHours() >= 18;
  const [openTomorrow, setOpenTomorrow] = useState(false);

  // Housekeeping: keep only today's and tomorrow's plans.
  useEffect(() => {
    try {
      const drop: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('gymforge_plan_') && !k.endsWith(today) && !k.endsWith(tomorrowKey)) drop.push(k);
      }
      drop.forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
  }, [today, tomorrowKey]);

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
              onSaved={p => { setTodayPlan(p); setEditToday(false); }} />
          </>
        )}
      </div>

      {/* ---------- Tomorrow ---------- */}
      <div className={`hud-panel overflow-hidden ${evening && !tomorrow ? 'border-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.12)]' : ''}`}>
        <button onClick={() => setOpenTomorrow(o => !o)} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div className="min-w-0">
            <p className="font-hud text-[11px] font-bold uppercase tracking-[0.25em] text-yellow-300/90 flex items-center gap-1.5">
              <CalendarDays size={12} /> {tomorrow ? 'Tomorrow is planned' : 'Plan tomorrow'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {tomorrow
                ? `${tomorrow.priorities.length} task${tomorrow.priorities.length === 1 ? '' : 's'} set. It becomes today's plan in the morning.`
                : evening ? 'Two minutes tonight. Wake up with a plan instead of a feed.' : 'Best done in the evening, before bed.'}
            </p>
          </div>
          <ChevronDown size={16} className={`text-yellow-300/80 flex-shrink-0 transition-transform ${openTomorrow ? 'rotate-180' : ''}`} />
        </button>
        {openTomorrow && (
          <div className="px-4 pb-4 -mt-2">
            <Editor day={tomorrowKey} initial={tomorrow} cta={tomorrow ? 'Update tomorrow' : 'Lock in tomorrow'}
              onSaved={p => setTomorrow(p)} />
          </div>
        )}
      </div>
    </div>
  );
}
