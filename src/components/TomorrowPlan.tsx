import { useState, useEffect } from 'react';
import { CalendarDays, Check, PenLine, Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { planAdvice } from '../lib/generators';

const dateStr = (offset = 0) => {
  const d = new Date(Date.now() + offset * 86400000);
  return d.toISOString().split('T')[0];
};

interface Plan { priorities: string[]; notes: string; advice?: string[] }

const load = (key: string): Plan | null => {
  try {
    const raw = localStorage.getItem(`gymforge_plan_${key}`);
    return raw ? (JSON.parse(raw) as Plan) : null;
  } catch { return null; }
};

export default function TomorrowPlan() {
  const [todayPlan, setTodayPlan] = useState<Plan | null>(null);
  const [editing, setEditing] = useState(false);
  const [tasks, setTasks] = useState<string[]>(['', '', '']);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedAdvice, setSavedAdvice] = useState<string[]>([]);
  const [adviceBusy, setAdviceBusy] = useState(false);
  const [doneMap, setDoneMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setTodayPlan(load(dateStr(0)));
    const tomorrow = load(dateStr(1));
    if (tomorrow) {
      setTasks(tomorrow.priorities.length ? tomorrow.priorities : ['', '', '']);
      setNotes(tomorrow.notes || '');
      setSavedAdvice(tomorrow.advice || []);
      setSaved(true);
    }
    try { setDoneMap(JSON.parse(localStorage.getItem(`gymforge_plan_done_${dateStr(0)}`) || '{}') as Record<number, boolean>); } catch {}
    // housekeeping: clear plans/ticks older than yesterday
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('gymforge_plan_') && !k.includes(dateStr(0)) && !k.includes(dateStr(1)))) {
          localStorage.removeItem(k);
        }
      }
    } catch {}
  }, []);

  const updateTask = (i: number, v: string) => setTasks(prev => prev.map((t, j) => (j === i ? v : t)));
  const removeTask = (i: number) => setTasks(prev => prev.filter((_, j) => j !== i));
  const addTask = () => setTasks(prev => [...prev, '']);

  const save = async () => {
    const priorities = tasks.map(s => s.trim()).filter(Boolean);
    const plan: Plan = { priorities, notes: notes.trim() };
    localStorage.setItem(`gymforge_plan_${dateStr(1)}`, JSON.stringify(plan));
    setSaved(true);
    setSavedAdvice([]);
    // AI advice per task
    if (priorities.length) {
      setAdviceBusy(true);
      try {
        const advice = await planAdvice(priorities, notes.trim());
        const withAdvice: Plan = { ...plan, advice };
        localStorage.setItem(`gymforge_plan_${dateStr(1)}`, JSON.stringify(withAdvice));
        setSavedAdvice(advice);
      } catch { /* advice is a bonus — plan is already saved */ }
      setAdviceBusy(false);
    }
  };

  const toggleDone = (i: number) => {
    const updated = { ...doneMap, [i]: !doneMap[i] };
    setDoneMap(updated);
    localStorage.setItem(`gymforge_plan_done_${dateStr(0)}`, JSON.stringify(updated));
  };

  const allDoneToday = todayPlan && todayPlan.priorities.length > 0 && todayPlan.priorities.every((_, i) => doneMap[i]);

  return (
    <div className="space-y-3">
      {/* Today's plan (written yesterday) */}
      {todayPlan && (todayPlan.priorities.length > 0 || todayPlan.notes) && (
        <div className={`bg-gradient-to-br rounded-2xl p-4 border transition-colors ${
          allDoneToday ? 'from-emerald-500/20 to-[#111] border-emerald-500/50' : 'from-emerald-500/10 to-[#111] border-emerald-500/25'
        }`}>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2.5 flex items-center gap-1.5">
            <CalendarDays size={12} /> {allDoneToday ? "Today's plan — ALL DONE 🔥" : "Today's plan — you wrote this yesterday"}
          </p>
          <div className="space-y-2">
            {todayPlan.priorities.map((p, i) => (
              <div key={i}>
                <button onClick={() => toggleDone(i)} className="w-full flex items-center gap-2.5 text-left">
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                    doneMap[i] ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                  }`}>
                    {doneMap[i] && <Check size={12} className="text-white" />}
                  </span>
                  <span className={`text-sm ${doneMap[i] ? 'text-gray-600 line-through' : 'text-gray-200'}`}>{p}</span>
                </button>
                {todayPlan.advice?.[i] && !doneMap[i] && (
                  <p className="text-[11px] text-emerald-300/60 leading-snug ml-7 mt-0.5 flex items-start gap-1">
                    <Sparkles size={10} className="flex-shrink-0 mt-0.5" /> {todayPlan.advice[i]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {todayPlan.notes && <p className="text-gray-500 text-xs mt-2.5 leading-relaxed">{todayPlan.notes}</p>}
        </div>
      )}

      {/* Plan tomorrow */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <button onClick={() => setEditing(!editing)} className="w-full flex items-center justify-between px-4 py-3.5 text-left press">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <PenLine size={15} className="text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-sm">Plan tomorrow</p>
              <p className="text-gray-600 text-[11px]">{saved ? 'Plan set ✓ — tap to view/edit' : 'Write it tonight, own it in the morning'}</p>
            </div>
          </div>
          <span className={`text-xs font-bold ${saved ? 'text-emerald-400' : 'text-gray-600'}`}>{saved ? 'SET' : '—'}</span>
        </button>
        <div className={`collapse-wrap ${editing ? 'open' : ''}`}>
          <div className="collapse-inner">
            <div className="collapse-content px-4 pb-4 space-y-2">
              <p className="text-gray-500 text-xs">Tomorrow's tasks — as many as the day needs:</p>
              {tasks.map((val, i) => (
                <div key={i}>
                  <div className="flex gap-1.5">
                    <input value={val} onChange={e => updateTask(i, e.target.value)}
                      placeholder={`${i + 1}. ${['e.g. Deep work block 9-11', 'e.g. Push session + Zone 2', 'e.g. 20 outreach DMs'][i] || 'Task…'}`}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500/50" />
                    {tasks.length > 1 && (
                      <button onClick={() => removeTask(i)} className="w-9 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors">
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  {saved && savedAdvice[i] && val.trim() && (
                    <p className="text-[11px] text-orange-300/70 leading-snug mt-1 ml-1 flex items-start gap-1">
                      <Sparkles size={10} className="flex-shrink-0 mt-0.5" /> {savedAdvice[i]}
                    </p>
                  )}
                </div>
              ))}
              <button onClick={addTask}
                className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/15 hover:border-orange-500/40 text-gray-500 hover:text-orange-400 py-2 rounded-xl text-xs font-bold transition-colors">
                <Plus size={13} /> Add another task
              </button>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="Anything else about how you want the day to go (schedule, reminders, mindset)…"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
              <button onClick={save} disabled={adviceBusy || (!tasks.some(t => t.trim()) && !notes.trim())}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {adviceBusy ? <><Loader2 size={14} className="animate-spin" /> Saved — getting AI advice…</> : saved ? 'Update plan + refresh advice' : 'Lock in tomorrow\'s plan'}
              </button>
              {saved && savedAdvice.length > 0 && !adviceBusy && (
                <p className="text-[11px] text-gray-600 text-center">AI advice added under each task — it\'ll show tomorrow morning too.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
