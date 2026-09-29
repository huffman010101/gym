import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Pencil, Check, Sunrise, Moon, Dumbbell, Fingerprint, ChevronRight, Shield, Lock, Hourglass } from 'lucide-react';
import LockIn, { lockedInToday, lockinLog } from './LockIn';
import WhoopPanel from './WhoopPanel';
import { loadWhoop, latest, zoneOf, todayKey as whoopToday, todaysSession } from '../lib/whoop';

/*
 * J.A.R.V.I.S. — the command layer on the home screen.
 * Everything here is computed locally from data the app already stores, so it
 * works offline and costs nothing. The one AI piece (the daily check-in) lives
 * in AccountabilityBot and is unchanged apart from its voice.
 */

const TITLE_KEY = 'gymforge_jarvis_title';
const LOG_KEY = 'gymforge_jarvis_active_days';
const BOOT_KEY = 'gymforge_jarvis_booted';

const today = () => new Date().toISOString().split('T')[0];
const yesterday = () => new Date(Date.now() - 86400000).toISOString().split('T')[0];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/* ---------- Art ---------- */

export function ArcReactor({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="reactor" aria-hidden>
      <defs>
        <radialGradient id="rc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0fdff" />
          <stop offset="45%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" />
      <g className="spin">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34,211,238,0.7)" strokeWidth="2"
          strokeDasharray="14 7" />
      </g>
      <g className="spin-rev">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x="47" y="17" width="6" height="11" rx="1.5"
            fill="rgba(103,232,249,0.85)" transform={`rotate(${i * 36} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(165,243,252,0.9)" strokeWidth="2" />
      <circle cx="50" cy="50" r="20" fill="url(#rc-core)" />
      <circle cx="50" cy="50" r="7" fill="#ecfeff" />
    </svg>
  );
}

/* An original bat silhouette — used as a watermark, not a logo. */
export function BatMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} aria-hidden fill="currentColor">
      <path d="M100 18 l-5 -12 l-3 14 C 80 22 70 20 60 12 C 58 26 48 34 30 34 C 36 40 38 48 34 56
               C 18 52 8 42 2 30 C 4 52 22 72 58 76 C 62 66 72 60 84 62 C 90 64 96 70 100 78
               C 104 70 110 64 116 62 C 128 60 138 66 142 76 C 178 72 196 52 198 30
               C 192 42 182 52 166 56 C 162 48 164 40 170 34 C 152 34 142 26 140 12
               C 130 20 120 22 108 20 l-3 -14 z" />
    </svg>
  );
}

/* ---------- Boot sequence ---------- */

const BOOT_LINES = [
  'WAYNE–STARK SYSTEMS  //  SECURE LINK',
  'Initialising J.A.R.V.I.S. core',
  'Biometric profile ........ verified',
  'Training protocols ....... loaded',
  'Offline archive .......... ready',
  'All systems nominal',
  'No one is coming. Lock in.',
];

export function JarvisBoot() {
  const [phase, setPhase] = useState<'off' | 'on' | 'out'>(() => {
    try {
      if (sessionStorage.getItem(BOOT_KEY)) return 'off';
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'off';
    } catch { return 'off'; }
    return 'on';
  });

  useEffect(() => {
    if (phase !== 'on') return;
    try { sessionStorage.setItem(BOOT_KEY, '1'); } catch { /* ignore */ }
    const t1 = setTimeout(() => setPhase('out'), 1900);
    return () => clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'out') return;
    const t = setTimeout(() => setPhase('off'), 450);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'off') return null;
  return (
    <div onClick={() => setPhase('out')}
      className={`fixed inset-0 z-[200] bg-[#02040a] flex flex-col items-center justify-center px-8 ${phase === 'out' ? 'boot-out' : ''}`}>
      <BatMark className="absolute w-[85vw] max-w-xl text-cyan-400/[0.04]" />
      <ArcReactor size={96} />
      <p className="font-orbitron text-cyan-300 text-lg tracking-[0.35em] mt-6 hud-text-cyan">J.A.R.V.I.S.</p>
      <div className="mt-6 w-full max-w-xs font-mono text-[11px] text-cyan-200/70 space-y-1">
        {BOOT_LINES.map((l, i) => (
          <p key={l} className="boot-line" style={{ animationDelay: `${0.15 + i * 0.22}s` }}>
            <span className="text-cyan-500">›</span> {l}
          </p>
        ))}
      </div>
      <p className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] text-gray-600 font-hud">Tap to skip</p>
    </div>
  );
}

/* ---------- Data ---------- */

const LOCK_TARGET = 120;   // minutes locked in that count as a full day
const LOCK_MIN_DAY = 25;   // minutes that keep the streak alive

/* Consecutive days with a real lock-in session. Today counts once it is
 * earned; until then the streak runs to yesterday so it is not shown as lost. */
function lockStreak(log: Record<string, number>): number {
  const d = new Date();
  if ((log[d.toISOString().split('T')[0]] ?? 0) < LOCK_MIN_DAY) d.setDate(d.getDate() - 1);
  let n = 0;
  while ((log[d.toISOString().split('T')[0]] ?? 0) >= LOCK_MIN_DAY) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

const RANKS = [
  { at: 0, name: 'Recruit' },
  { at: 3, name: 'Initiate' },
  { at: 7, name: 'Operative' },
  { at: 14, name: 'Vigilante' },
  { at: 30, name: 'Guardian' },
  { at: 60, name: 'Dark Knight' },
  { at: 120, name: 'Legend' },
];

function rankFor(days: number) {
  let i = 0;
  while (i + 1 < RANKS.length && days >= RANKS[i + 1].at) i++;
  const cur = RANKS[i];
  const next = RANKS[i + 1];
  const pct = next ? Math.round(((days - cur.at) / (next.at - cur.at)) * 100) : 100;
  return { level: i + 1, name: cur.name, next, pct };
}

/* Short, dry, and meant to be acted on — not wallpaper. */
const DIRECTIVES = [
  'No one is coming to save you, sir. Fortunately, you do not need them to.',
  'Time is the only thing you cannot earn back. Spend today like you know that.',
  'The man you want to be is not waiting for Monday. Neither should you.',
  'Comfort is the enemy you invite in. Lock in.',
  'Nobody will remember the excuses. They will remember what you built.',
  'You are one year of real discipline away from a different life.',
  'The hard session first, sir. Everything after it is easier.',
  'Nobody is coming to do it for you. Fortunately, you are quite capable.',
  'Discipline is choosing between what you want now and what you want most.',
  'Phone stays out of reach for the first hour. I will hold the fort.',
  'Train like the man you intend to be is watching. He is.',
  'We fall so we can learn to pick ourselves up. Pick yourself up, sir.',
  'Composure is a weapon. Speak slower than feels natural today.',
  'One conversation you have been avoiding. Today would be efficient.',
  'Money follows skill. One hour on the skill, before anything that entertains you.',
  'Sleep is a performance-enhancing drug, and it is legal. Lights out on time.',
  'You are not behind. You are just not finished.',
  'Be warm first. It costs nothing and it reads as confidence.',
  'Do the ankle work. Unglamorous, and precisely why most people skip it.',
  'Protein at every meal, sir. The suit does not build itself.',
  'Attention is the scarce resource. Spend it like it is money.',
  'Say the thing rather than rehearsing it. Rehearsal is how the moment passes.',
  'Stand up straight, chin level, take up the space you are given.',
  'Outcome detached, effort total. That is the whole trick.',
  'Small, finished beats large, imagined. Close one loop today.',
  'Hydrate before caffeine. I say this every morning and I will continue to.',
  'The version of you that you want is built in boring Tuesdays.',
  'Remove one distraction by making it harder to reach. Willpower is overrated.',
  'You have been told you are good-looking. Now be interesting.',
  'Win the morning, and the rest of the day tends to comply.',
  'Every rep you do not skip is a vote for who you are becoming.',
  'Read ten pages. Knowledge compounds faster than money, and feeds it.',
  'Silence is allowed. Not every gap needs filling.',
  'Walk into the room like you already belong there. You do.',
];

function directiveFor(date: string) {
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) % 100000;
  return DIRECTIVES[h % DIRECTIVES.length];
}

function greetingFor(hour: number) {
  if (hour < 5) return 'Working late';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ---------- Voice ---------- */

function pickVoice(): SpeechSynthesisVoice | undefined {
  try {
    const voices = window.speechSynthesis.getVoices();
    const prefer = ['Daniel', 'Arthur', 'Google UK English Male', 'Oliver', 'George'];
    for (const name of prefer) {
      const v = voices.find(x => x.name.includes(name));
      if (v) return v;
    }
    return voices.find(v => v.lang === 'en-GB') ?? voices.find(v => v.lang.startsWith('en'));
  } catch {
    return undefined;
  }
}

/* ---------- HUD ---------- */

export default function JarvisHud() {
  const [now, setNow] = useState(() => new Date());
  const [title, setTitle] = useState(() => {
    try { return localStorage.getItem(TITLE_KEY) || 'sir'; } catch { return 'sir'; }
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [speaking, setSpeaking] = useState(false);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [lockOpen, setLockOpen] = useState(() => {
    try { return !!localStorage.getItem('gymforge_lockin_session'); } catch { return false; }
  });
  const [lockedMins, setLockedMins] = useState(lockedInToday);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const [whoop, setWhoop] = useState(() => latest(loadWhoop()));
  const log = useMemo(() => lockinLog(), [lockedMins]);
  const pct = Math.min(100, Math.round((lockedMins / LOCK_TARGET) * 100));
  const streak = lockStreak(log);
  const zone = whoop?.date === whoopToday() ? zoneOf(whoop.recovery) : null;
  const session = todaysSession(zone, now);

  // Lifetime days you showed up: any day with a real lock-in, plus the older
  // log from before the checklists were removed. Never resets.
  const activeDays = useMemo(() => {
    const old = read<string[]>(LOG_KEY, []);
    const set = new Set(old);
    Object.entries(log).forEach(([d, m]) => { if (m >= LOCK_MIN_DAY) set.add(d); });
    return set.size;
  }, [log]);
  const rank = rankFor(activeDays);

  const directive = directiveFor(today());

  // Time left — the whole point is to make it felt.
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  const minsLeftToday = Math.max(0, Math.round((midnight.getTime() - now.getTime()) / 60000));
  const dayPct = Math.round(((24 * 60 - minsLeftToday) / (24 * 60)) * 100);
  const dow = (now.getDay() + 6) % 7; // Monday = 0
  const weekPct = Math.round(((dow * 24 * 60) + (24 * 60 - minsLeftToday)) / (7 * 24 * 60) * 100);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const daysLeftYear = Math.ceil((yearEnd.getTime() - now.getTime()) / 86400000);
  const greeting = greetingFor(now.getHours());
  const statusLine = lockedMins >= LOCK_TARGET
    ? 'Full day locked in. Exemplary work.'
    : zone === 'red'
      ? 'Recovery red. Protect today, win tomorrow.'
      : lockedMins > 0
        ? `${LOCK_TARGET - lockedMins} minutes left to a full day.`
        : 'Nothing locked in yet. The clock is running.';

  const saveTitle = () => {
    const t = draft.trim() || 'sir';
    setTitle(t);
    try { localStorage.setItem(TITLE_KEY, t); } catch { /* ignore */ }
    setEditing(false);
  };

  const brief = () => {
    if (!canSpeak) return;
    const synth = window.speechSynthesis;
    if (speaking) { synth.cancel(); setSpeaking(false); return; }
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const parts = [
      `${greeting}, ${title}. It is ${time}.`,
      lockedMins > 0 ? `You have locked in ${lockedMins} minutes today.` : 'You have not locked in yet today.',
      zone && whoop?.recovery !== undefined ? `Recovery is ${Math.round(whoop.recovery)} percent, ${zone}.` : '',
      streak > 1 ? `Your streak stands at ${streak} days. I would not break it.` : '',
      `Clearance level ${rank.level}, ${rank.name}.`,
      `You have ${Math.floor(minsLeftToday / 60)} hours left today, and ${daysLeftYear} days left this year. No one is coming, ${title}.`,
      `Today's directive: ${directive}`,
      `Today's session: ${session.title}. ${session.detail}`,
    ].filter(Boolean);
    const u = new SpeechSynthesisUtterance(parts.join(' '));
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v?.lang ?? 'en-GB';
    u.rate = 1.02;
    u.pitch = 0.9;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  };

  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* ignore */ } }, []);

  const R = 30;
  const C = 2 * Math.PI * R;

  return (
    <section className="px-5 pt-5 pb-4 max-w-4xl mx-auto">
      {/* System bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <ArcReactor size={34} />
          <div className="leading-none">
            <p className="font-orbitron text-[13px] tracking-[0.3em] hud-text-cyan">J.A.R.V.I.S.</p>
            <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-gray-500 mt-1">GymForge // Wayne–Stark</p>
          </div>
        </div>
        <div className="text-right leading-none">
          <p className="font-orbitron text-base text-cyan-100 tabular-nums">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </p>
          <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">
            {now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      {/* Main panel */}
      <div className="hud-panel hud-frame relative p-5 overflow-hidden">
        <div className="hud-scanline" />
        <BatMark className="absolute -right-8 -bottom-4 w-64 text-cyan-300/[0.035] pointer-events-none" />

        <div className="relative">
          {editing ? (
            <div className="flex items-center gap-2 mb-1">
              <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveTitle()} maxLength={24}
                placeholder="sir, Mr Wayne, your name…"
                className="flex-1 min-w-0 bg-black/40 border border-cyan-400/30 rounded-lg px-3 py-1.5 text-sm text-cyan-50 outline-none focus:border-cyan-300" />
              <button onClick={saveTitle} className="text-cyan-300 p-1.5" aria-label="Save"><Check size={18} /></button>
            </div>
          ) : (
            <button onClick={() => { setDraft(title); setEditing(true); }}
              className="group flex items-center gap-2 text-left" title="How should I address you?">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {greeting}, <span className="hud-text-gold">{title}</span>.
              </h2>
              <Pencil size={13} className="text-gray-600 group-hover:text-cyan-300 transition-colors flex-shrink-0" />
            </button>
          )}
          <p className="font-hud text-sm uppercase tracking-[0.18em] text-cyan-300/80 mt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300 mr-2 align-middle glow-pulse" />
            {statusLine}
          </p>

          {/* Readouts */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="flex flex-col items-center">
              <div className="relative w-[76px] h-[76px]">
                <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
                  <circle cx="38" cy="38" r={R} fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="6" />
                  <circle cx="38" cy="38" r={R} fill="none" stroke="rgb(34,211,238)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
                    style={{ transition: 'stroke-dashoffset 1s ease', filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.7))' }} />
                </svg>
                <p className="absolute inset-0 flex flex-col items-center justify-center font-orbitron text-base text-cyan-100 leading-none">{lockedMins}<span className="text-[8px] font-hud tracking-wider text-gray-500 mt-0.5">/ {LOCK_TARGET} MIN</span></p>
              </div>
              <p className="font-hud text-[10px] uppercase tracking-[0.18em] text-gray-500">Locked in</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="font-orbitron text-3xl hud-text-gold leading-none">{streak}</p>
              <p className="font-hud text-[10px] uppercase tracking-[0.18em] text-gray-500 mt-2">Day streak</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-yellow-400" />
                <p className="font-orbitron text-xl text-yellow-300 leading-none">L{rank.level}</p>
              </div>
              <p className="font-hud text-[11px] font-bold uppercase tracking-[0.14em] text-yellow-200/90 mt-1.5">{rank.name}</p>
              <div className="w-full h-1 rounded-full bg-yellow-400/10 mt-1.5 overflow-hidden">
                <div className="h-full bg-yellow-400/80" style={{ width: `${rank.pct}%` }} />
              </div>
              <p className="text-[9px] text-gray-600 mt-1">
                {rank.next ? `${rank.next.at - activeDays} days to ${rank.next.name}` : 'Maximum clearance'}
              </p>
            </div>
          </div>

          {/* Time left */}
          <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-500/[0.05] p-3">
            <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-rose-300/90 flex items-center gap-1.5">
              <Hourglass size={11} /> Time is running — no one is coming to save you
            </p>
            <div className="grid grid-cols-3 gap-3 mt-2.5">
              {[
                { label: 'Today', value: `${Math.floor(minsLeftToday / 60)}h ${minsLeftToday % 60}m`, sub: 'left', pct: dayPct },
                { label: 'This week', value: `${100 - weekPct}%`, sub: 'left', pct: weekPct },
                { label: now.getFullYear().toString(), value: `${daysLeftYear}`, sub: 'days left', pct: Math.round((1 - daysLeftYear / 365) * 100) },
              ].map(x => (
                <div key={x.label}>
                  <p className="font-orbitron text-base text-rose-100 leading-none tabular-nums">{x.value}</p>
                  <p className="text-[9px] font-hud uppercase tracking-wider text-gray-500 mt-1">{x.label} · {x.sub}</p>
                  <div className="h-1 rounded-full bg-white/5 mt-1.5 overflow-hidden"><div className="h-full bg-rose-400/70" style={{ width: `${x.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Lock in */}
          <button onClick={() => setLockOpen(true)}
            className="mt-3 w-full rounded-xl py-3.5 font-hud font-bold uppercase tracking-[0.3em] text-base bg-cyan-400/15 border border-cyan-300/60 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.2)] hover:bg-cyan-400/25 inline-flex items-center justify-center gap-2.5 press">
            <Lock size={17} /> Lock in
          </button>
          <p className="text-center text-[11px] text-gray-500 mt-1.5">
            {lockedMins > 0 ? `Locked in today: ${lockedMins} min.` : 'Nothing locked in yet today.'}
          </p>

          {/* Directive */}
          <div className="mt-5 border-l-2 border-yellow-400/60 pl-3">
            <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-yellow-400/80">Today’s directive</p>
            <p className="text-gray-200 text-sm leading-relaxed mt-0.5">{directive}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-5">
            {canSpeak && (
              <button onClick={brief}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 font-hud font-bold uppercase tracking-[0.16em] text-sm bg-cyan-400/10 border border-cyan-400/35 text-cyan-200 hover:bg-cyan-400/20 transition-colors press">
                {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {speaking ? 'Stop' : 'Brief me'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3"><WhoopPanel onChange={setWhoop} /></div>

      {/* Protocols */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {[
          { to: '/mind?tab=morning', icon: Sunrise, label: 'Morning' },
          { to: '/programs?tab=plan', icon: Dumbbell, label: 'Training' },
          { to: '/mind?tab=know', icon: Fingerprint, label: 'Identity' },
          { to: '/mind?tab=night', icon: Moon, label: 'Night' },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}
            className="hud-panel flex flex-col items-center gap-1.5 py-3 hover:border-cyan-400/40 transition-colors press">
            <Icon size={18} className="text-cyan-300" />
            <span className="font-hud text-[10px] font-bold uppercase tracking-[0.14em] text-gray-300">{label}</span>
            <span className="font-hud text-[8px] uppercase tracking-[0.2em] text-gray-600 -mt-1">Protocol</span>
          </Link>
        ))}
      </div>

      {lockOpen && <LockIn onClose={() => setLockOpen(false)} onDone={() => setLockedMins(lockedInToday())} />}
    </section>
  );
}
