import { useState, useEffect, useCallback } from 'react';
import { MessageCircleHeart, RefreshCw, Loader2 } from 'lucide-react';
import { HABITS, loadHabits, todaysItems } from './DailyHabits';
import { dailyCheckIn } from '../lib/generators';

const todayStr = () => new Date().toISOString().split('T')[0];
const cacheKey = () => `gymforge_checkin_${todayStr()}`;

function buildSummary(): string {
  const lines: string[] = [];
  for (const section of Object.keys(HABITS)) {
    const items = todaysItems(section as keyof typeof HABITS);
    const done = loadHabits(section);
    const count = items.filter(i => done[i.id]).length;
    let streak = 0;
    try { streak = JSON.parse(localStorage.getItem(`gymforge_habits_streak_${section}`) || '{"n":0}').n || 0; } catch { /* ignore */ }
    lines.push(`${section}: ${count}/${items.length} done today, streak ${streak}`);
  }
  try {
    const plan = JSON.parse(localStorage.getItem(`gymforge_plan_${todayStr()}`) || 'null') as { priorities: string[] } | null;
    if (plan?.priorities?.length) {
      const doneMap = JSON.parse(localStorage.getItem(`gymforge_plan_done_${todayStr()}`) || '{}') as Record<number, boolean>;
      const done = plan.priorities.filter((_, i) => doneMap[i]).length;
      lines.push(`today's plan: ${done}/${plan.priorities.length} tasks done`);
    } else {
      lines.push(`today's plan: nothing set`);
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
        <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">Your coach — daily check-in</p>
        {busy ? (
          <p className="text-gray-500 text-sm flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Reading your numbers…</p>
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
