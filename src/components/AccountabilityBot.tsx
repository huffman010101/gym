import { useState, useEffect, useCallback } from 'react';
import { MessageCircleHeart, RefreshCw, Loader2 } from 'lucide-react';
import { lockinLog } from './LockIn';
import { loadWhoop, latest, zoneOf, todaysSession, todayKey as whoopToday } from '../lib/whoop';
import { dailyCheckIn } from '../lib/generators';

const todayStr = () => new Date().toISOString().split('T')[0];
const cacheKey = () => `gymforge_checkin_${todayStr()}`;

function buildSummary(): string {
  const lines: string[] = [];
  const log = lockinLog();
  lines.push(`locked in today: ${log[todayStr()] ?? 0} of 120 minutes`);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    return log[d] ?? 0;
  });
  lines.push(`locked in over the last 7 days: ${week.reduce((a, b) => a + b, 0)} minutes, ${week.filter(m => m >= 25).length} days with a real session`);
  const w = latest(loadWhoop());
  const zone = w?.date === whoopToday() ? zoneOf(w.recovery) : null;
  if (w && zone) lines.push(`WHOOP today: recovery ${w.recovery}% (${zone}), HRV ${w.hrv ?? '?'} ms, sleep ${w.sleepHours ?? '?'} h`);
  else lines.push('WHOOP: nothing logged today');
  const s = todaysSession(zone);
  lines.push(`today's training: ${s.title}`);
  try {
    const plan = JSON.parse(localStorage.getItem(`gymforge_plan_${todayStr()}`) || 'null') as { priorities: string[] } | null;
    if (plan?.priorities?.length) {
      const doneMap = JSON.parse(localStorage.getItem(`gymforge_plan_done_${todayStr()}`) || '{}') as Record<number, boolean>;
      lines.push(`today's plan: ${plan.priorities.filter((_, i) => doneMap[i]).length}/${plan.priorities.length} priorities done`);
    }
  } catch { /* ignore */ }
  return lines.join('\n');
}

export default function AccountabilityBot() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const generate = useCallback(async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(cacheKey());
      if (cached) { setMessage(cached); return; }
    }
    setBusy(true);
    try {
      const msg = await dailyCheckIn(buildSummary());
      localStorage.setItem(cacheKey(), msg);
      setMessage(msg);
    } catch {
      setMessage("Show up today. That's the whole job.");
    }
    setBusy(false);
  }, []);

  useEffect(() => { generate(); }, [generate]);

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-[#111] border border-orange-500/25 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 bg-orange-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
        <MessageCircleHeart size={16} className="text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">J.A.R.V.I.S. — daily check-in</p>
        {busy ? (
          <p className="text-gray-500 text-sm flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Running diagnostics, sir…</p>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        )}
      </div>
      <button onClick={() => generate(true)} disabled={busy}
        className="flex-shrink-0 text-gray-600 hover:text-orange-400 transition-colors disabled:opacity-40" title="New check-in">
        <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}
