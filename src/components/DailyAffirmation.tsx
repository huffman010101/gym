import { useState } from 'react';
import { Mic } from 'lucide-react';
import { localDate } from './DailyPlan';
import { DAILY_AFFIRMATIONS } from '../data/myNotes';

/*
 * Home → today's affirmation: a new line each day, said out loud. One tap
 * logs it (gymforge_affirm_log, synced) so there is a small streak to keep.
 */

const K = 'gymforge_affirm_log';

export default function DailyAffirmation() {
  const today = localDate(0);
  const [log, setLog] = useState<Record<string, true>>(() => {
    try { return JSON.parse(localStorage.getItem(K) || '{}'); } catch { return {}; }
  });
  const dayIdx = Math.floor(new Date(today).getTime() / 864e5);
  const line = DAILY_AFFIRMATIONS[dayIdx % DAILY_AFFIRMATIONS.length];
  const said = !!log[today];

  let streak = 0;
  for (let i = said ? 0 : 1; i < 365; i++) { if (log[localDate(-i)]) streak++; else break; }

  const mark = () => {
    const next = { ...log, [today]: true as const };
    // Keep the log small: last 60 days only.
    const cutoff = localDate(-60);
    for (const k of Object.keys(next)) if (k < cutoff) delete next[k];
    setLog(next);
    try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ }
  };

  return (
    <div className="hud-frame rounded-2xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/[0.10] via-[#0b1017] to-[#0b1017] px-5 py-5 text-center" data-testid="affirmation">
      <p className="font-hud text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-300 flex items-center justify-center gap-1.5"><Mic size={12} /> Today — say it out loud</p>
      <p className="font-orbitron text-xl sm:text-2xl text-white leading-snug mt-3" data-testid="affirmation-line">“{line}”</p>
      <p className="text-[11px] text-gray-500 mt-2">Three times, slowly, from the chest. Like you already believe it.</p>
      <button onClick={mark} disabled={said}
        className={`mt-3.5 rounded-xl px-5 py-2 font-hud font-bold uppercase tracking-wider text-xs border ${said ? 'border-emerald-300/50 text-emerald-200 bg-emerald-400/10' : 'border-cyan-300/50 text-cyan-100 bg-cyan-400/10 hover:bg-cyan-400/20'}`}>
        {said ? 'Said it ✓' : 'I said it out loud'}
      </button>
      {streak > 1 && <p className="font-hud text-[11px] uppercase tracking-wider text-emerald-300 mt-2">{streak} days in a row</p>}
    </div>
  );
}
