import { useState, useEffect } from 'react';
import { CalendarDays, Check, PenLine } from 'lucide-react';

const dateStr = (offset = 0) => {
  const d = new Date(Date.now() + offset * 86400000);
  return d.toISOString().split('T')[0];
};

interface Plan { priorities: string[]; notes: string }

const load = (key: string): Plan | null => {
  try {
    const raw = localStorage.getItem(`gymforge_plan_${key}`);
    return raw ? (JSON.parse(raw) as Plan) : null;
  } catch { return null; }
};

export default function TomorrowPlan() {
  const [todayPlan, setTodayPlan] = useState<Plan | null>(null);
  const [editing, setEditing] = useState(false);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [doneMap, setDoneMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setTodayPlan(load(dateStr(0)));
    const tomorrow = load(dateStr(1));
    if (tomorrow) {
      setP1(tomorrow.priorities[0] || '');
      setP2(tomorrow.priorities[1] || '');
      setP3(tomorrow.priorities[2] || '');
      setNotes(tomorrow.notes || '');
      setSaved(true);
    }
    try { setDoneMap(JSON.parse(localStorage.getItem(`gymforge_plan_done_${dateStr(0)}`) || '{}') as Record<number, boolean>); } catch {}
  }, []);

  const save = () => {
    const plan: Plan = { priorities: [p1, p2, p3].map(s => s.trim()).filter(Boolean), notes: notes.trim() };
    localStorage.setItem(`gymforge_plan_${dateStr(1)}`, JSON.stringify(plan));
    setSaved(true);
    setEditing(false);
  };

  const toggleDone = (i: number) => {
    const updated = { ...doneMap, [i]: !doneMap[i] };
    setDoneMap(updated);
    localStorage.setItem(`gymforge_plan_done_${dateStr(0)}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-3">
      {/* Today's plan (written yesterday) */}
      {todayPlan && (todayPlan.priorities.length > 0 || todayPlan.notes) && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-[#111] border border-emerald-500/25 rounded-2xl p-4">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2.5 flex items-center gap-1.5">
            <CalendarDays size={12} /> Today's plan — you wrote this yesterday
          </p>
          <div className="space-y-1.5">
            {todayPlan.priorities.map((p, i) => (
              <button key={i} onClick={() => toggleDone(i)} className="w-full flex items-center gap-2.5 text-left">
                <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                  doneMap[i] ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                }`}>
                  {doneMap[i] && <Check size={12} className="text-white" />}
                </span>
                <span className={`text-sm ${doneMap[i] ? 'text-gray-600 line-through' : 'text-gray-200'}`}>{p}</span>
              </button>
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
              <p className="text-gray-600 text-[11px]">{saved ? 'Plan set ✓ — tap to edit' : 'Write it tonight, own it in the morning'}</p>
            </div>
          </div>
          <span className={`text-xs font-bold ${saved ? 'text-emerald-400' : 'text-gray-600'}`}>{saved ? 'SET' : '—'}</span>
        </button>
        <div className={`collapse-wrap ${editing ? 'open' : ''}`}>
          <div className="collapse-inner">
            <div className="collapse-content px-4 pb-4 space-y-2">
              <p className="text-gray-500 text-xs">Tomorrow's 3 priorities — the things that make the day a win:</p>
              {[
                [p1, setP1, '1. e.g. Deep work block on econ notes 9-11'],
                [p2, setP2, '2. e.g. Push session + 30 min Zone 2'],
                [p3, setP3, '3. e.g. 20 outreach DMs sent'],
              ].map(([val, set, ph], i) => (
                <input key={i} value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={ph as string}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500/50" />
              ))}
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="Anything else about how you want the day to go (schedule, reminders, mindset)…"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
              <button onClick={save} disabled={!p1.trim() && !p2.trim() && !p3.trim() && !notes.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                Lock in tomorrow's plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
