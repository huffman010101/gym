import { useState, useEffect } from 'react';
import { Check, Flame, ChevronDown } from 'lucide-react';

export interface HabitDef { id: string; label: string }

const POOL_SIZE = 6;

export const HABITS: Record<string, { title: string; color: string; bar: string; items: HabitDef[] }> = {
  mind: {
    title: 'Daily Mind Reps',
    color: 'text-pink-400',
    bar: 'from-pink-500 to-rose-500',
    items: [
      { id: 'selftalk_am', label: 'Morning self-talk / identity script said out loud' },
      { id: 'discomfort', label: 'One discomfort rep done (3-second rule)' },
      { id: 'no_complaint', label: 'No-complaint day held (action instead)' },
      { id: 'posture_presence', label: 'Posture + slow-down check ×3 today' },
      { id: 'social_rep', label: 'Started one conversation / gave one real compliment' },
      { id: 'wins_pm', label: '3 wins logged tonight' },
      { id: 'cold_exposure', label: 'Cold shower or cold finish done' },
      { id: 'journal', label: '5 min journal — what am I avoiding?' },
      { id: 'gratitude', label: '3 things you\'re grateful for, said out loud' },
      { id: 'eye_contact', label: 'Held eye contact a beat longer than comfortable, twice today' },
      { id: 'single_task', label: 'One deep-focus block, phone out of the room' },
      { id: 'reframe', label: 'Caught one negative thought and reframed it on the spot' },
    ],
  },
  combat: {
    title: 'Daily Combat Work',
    color: 'text-red-400',
    bar: 'from-red-500 to-orange-500',
    items: [
      { id: 'shadow', label: '10 min shadowboxing (stance, jab, movement)' },
      { id: 'drill', label: 'One technique visualised/drilled from this section' },
      { id: 'neck_hips', label: 'Neck + hip mobility done' },
      { id: 'sprawl', label: '10 sprawls or 20 shrimps' },
      { id: 'breathe', label: 'Breathing under fatigue practised (exhale on effort)' },
      { id: 'grip', label: 'Grip work — dead hangs or towel pull-ups' },
      { id: 'footwork', label: '5 min footwork ladder / pivot drills' },
      { id: 'core_frame', label: 'Core circuit — planks, anti-rotation holds' },
      { id: 'watch_film', label: '10 min film study of a fighter in your style' },
      { id: 'flexibility', label: 'Hip flexor / hamstring stretch routine' },
    ],
  },
  football: {
    title: 'Daily Touches',
    color: 'text-emerald-400',
    bar: 'from-emerald-500 to-green-500',
    items: [
      { id: 'touches', label: '100 wall touches (both feet)' },
      { id: 'weakfoot', label: '50 weak-foot reps' },
      { id: 'scan', label: 'Scanning habit practised (check shoulders)' },
      { id: 'sprint_mob', label: 'Sprint drills or hip/hamstring mobility' },
      { id: 'watch', label: '10 min match study (your position)' },
      { id: 'shooting_reps', label: '20 shooting reps, both feet' },
      { id: 'lower_body', label: 'Lower-body power set (squats, jumps, or sprints)' },
      { id: 'core_stability', label: 'Core + single-leg stability work' },
      { id: 'cone_agility', label: 'Cone weave / change-of-direction drill' },
      { id: 'juggling', label: '2 min juggling — first touch under pressure' },
    ],
  },
  money: {
    title: 'Daily Money Moves',
    color: 'text-yellow-400',
    bar: 'from-yellow-500 to-amber-500',
    items: [
      { id: 'skill2h', label: '2h skill work (the 90-day sprint)' },
      { id: 'outreach', label: 'Outreach sent (DMs/applications/content posted)' },
      { id: 'no_impulse', label: 'No impulse purchases today' },
      { id: 'learn', label: '15 min money learning (investing, business)' },
      { id: 'track_spend', label: 'Logged every expense from today' },
      { id: 'network', label: 'One networking touchpoint — message, call, or intro' },
      { id: 'review_goal', label: 'Reviewed your 90-day money goal for 2 min' },
      { id: 'sell_something', label: 'Tried to sell or pitch something, even small' },
    ],
  },
  uni: {
    title: 'Daily Brain Work',
    color: 'text-sky-400',
    bar: 'from-sky-500 to-blue-500',
    items: [
      { id: 'deepwork', label: '90-min deep work block (phone in other room)' },
      { id: 'recall', label: 'Active recall / flashcards done' },
      { id: 'read', label: '20 pages read' },
      { id: 'light_am', label: 'Morning light within 30 min of waking' },
      { id: 'shutdown', label: 'Screens dimmed + tomorrow\'s 3 priorities written' },
      { id: 'teach_back', label: 'Explained one concept out loud like teaching someone' },
      { id: 'no_multitask', label: 'One single-tab study session, no tab-switching' },
      { id: 'review_notes', label: 'Reviewed yesterday\'s notes for 10 min' },
      { id: 'sleep_target', label: 'Hit your sleep target last night' },
    ],
  },
  padel: {
    title: 'Daily Padel Reps',
    color: 'text-sky-400',
    bar: 'from-sky-500 to-blue-500',
    items: [
      { id: 'bandeja_reps', label: '20 bandeja/overhead reps against a wall or with a partner' },
      { id: 'volley_reps', label: '20 volley reps, both sides — short punchy contact' },
      { id: 'split_step', label: 'Split-step drilled on every shadow rally' },
      { id: 'wall_reading', label: 'Wall-bounce reading practised (let it bounce, then react)' },
      { id: 'lateral_mobility', label: 'Lateral lunges or side shuffles done' },
      { id: 'shoulder_care', label: 'Rotator cuff / shoulder prehab band work' },
      { id: 'watch_match', label: '10 min pro match study — court positioning' },
    ],
  },
};

const todayStr = () => new Date().toISOString().split('T')[0];
const key = (section: string) => `gymforge_habits_${section}_${todayStr()}`;
const streakKey = (section: string) => `gymforge_habits_streak_${section}`;

export function loadHabits(section: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(key(section)) || '{}') as Record<string, boolean>; }
  catch { return {}; }
}

// Deterministic daily rotation: same day + section always yields the same subset,
// so it feels fresh every day without an AI call.
function seededPick(items: HabitDef[], seed: number, count: number): HabitDef[] {
  const arr = [...items];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function daySeed(section: string): number {
  const day = Math.floor(Date.now() / 86400000);
  let hash = day;
  for (let i = 0; i < section.length; i++) hash = (hash * 31 + section.charCodeAt(i)) % 1000000;
  return hash;
}

export function todaysItems(section: keyof typeof HABITS): HabitDef[] {
  const def = HABITS[section];
  if (def.items.length <= POOL_SIZE) return def.items;
  return seededPick(def.items, daySeed(section), POOL_SIZE);
}

export default function DailyHabits({ section }: { section: keyof typeof HABITS }) {
  const def = HABITS[section];
  const items = todaysItems(section);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setDone(loadHabits(section));
    try { setStreak(JSON.parse(localStorage.getItem(streakKey(section)) || '{"n":0}').n || 0); } catch {}
  }, [section]);

  const count = items.filter(i => done[i.id]).length;
  const allDone = count === items.length;

  const toggle = (id: string) => {
    const updated = { ...done, [id]: !done[id] };
    setDone(updated);
    localStorage.setItem(key(section), JSON.stringify(updated));
    // streak: bump once per day when all complete
    const nowAll = items.every(i => updated[i.id]);
    try {
      const raw = JSON.parse(localStorage.getItem(streakKey(section)) || '{"n":0,"last":""}') as { n: number; last: string };
      if (nowAll && raw.last !== todayStr()) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const n = raw.last === yesterday ? raw.n + 1 : 1;
        localStorage.setItem(streakKey(section), JSON.stringify({ n, last: todayStr() }));
        setStreak(n);
      }
    } catch {}
  };

  const pct = Math.round((count / items.length) * 100);

  return (
    <div className={`rounded-3xl overflow-hidden mb-6 shadow-2xl ring-1 transition-all ${
      allDone ? 'ring-emerald-400/40 shadow-emerald-500/10' : 'ring-white/10'
    }`}>
      {/* Vibrant gradient header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-5 pt-5 pb-4 bg-gradient-to-br ${allDone ? 'from-emerald-500 to-green-600' : def.bar} relative`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 mb-0.5">
              {allDone ? 'Complete — see you tomorrow' : "Today's checklist"}
            </p>
            <h2 className="text-2xl font-black text-white leading-tight drop-shadow-sm">{def.title}</h2>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-baseline gap-0.5 text-white drop-shadow-sm">
              <span className="text-3xl font-black leading-none">{count}</span>
              <span className="text-lg font-bold text-white/60 leading-none">/{items.length}</span>
            </div>
            {streak > 1 && (
              <span className="flex items-center gap-1 text-[11px] bg-black/25 text-white px-2 py-0.5 rounded-full font-black">
                <Flame size={11} /> {streak} day streak
              </span>
            )}
          </div>
        </div>

        <div className="h-3 bg-black/25 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-1 mt-2 -mb-1">
          <span className="text-[11px] font-bold text-white/70">{open ? 'Hide' : 'Show'} tasks</span>
          <ChevronDown size={14} className={`text-white/70 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Task list */}
      <div className={`collapse-wrap ${open ? 'open' : ''} bg-[#141414]`}>
        <div className="collapse-inner">
          <div className="collapse-content px-4 py-4 space-y-2">
            {items.map(i => (
              <button
                key={i.id}
                onClick={() => toggle(i.id)}
                className={`w-full flex items-center gap-3.5 text-left px-3.5 py-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                  done[i.id]
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07]'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  done[i.id] ? 'bg-emerald-500 border-emerald-500 scale-105' : 'border-white/25'
                }`}>
                  {done[i.id] && <Check size={17} strokeWidth={3.5} className="text-white" />}
                </div>
                <span className={`text-[15px] font-semibold leading-snug ${
                  done[i.id] ? 'text-gray-500 line-through' : 'text-gray-100'
                }`}>{i.label}</span>
              </button>
            ))}
            <p className="text-[11px] text-gray-600 text-center pt-2">
              Fresh set each day — resets at midnight. Complete all to build your streak 🔥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
