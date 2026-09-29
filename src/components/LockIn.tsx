import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Lock, X, Play } from 'lucide-react';
import { ArcReactor } from './Jarvis';

/*
 * LOCK IN — a full-screen focus session. The end time is stored, not a
 * running counter, so a reload, a locked phone or a backgrounded tab does not
 * lose the session. Completed minutes are logged per day.
 */

const K_SESSION = 'gymforge_lockin_session';
const K_LOG = 'gymforge_lockin_log';

interface Session { task: string; minutes: number; endsAt: number; startedAt: number }

const today = () => new Date().toISOString().split('T')[0];

export function lockedInToday(): number {
  try { return (JSON.parse(localStorage.getItem(K_LOG) || '{}') as Record<string, number>)[today()] ?? 0; } catch { return 0; }
}
function logMinutes(mins: number) {
  try {
    const log = JSON.parse(localStorage.getItem(K_LOG) || '{}') as Record<string, number>;
    log[today()] = (log[today()] ?? 0) + mins;
    localStorage.setItem(K_LOG, JSON.stringify(log));
  } catch { /* ignore */ }
}
function loadSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(K_SESSION) || 'null') as Session | null; } catch { return null; }
}

const LINES = [
  'No one is coming to save you. That is the good news — it means it is up to you.',
  'The version of you that you want is on the other side of this timer.',
  'Phone face down, out of reach. You can have it back when this ends.',
  'Discomfort is the price of entry. Pay it.',
  'Every minute here is a vote for who you are becoming.',
  'You will not regret finishing. You will regret quitting.',
  'Nobody is watching. That is exactly when it counts.',
  'Time is the one thing you do not get back, sir.',
];

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 1;
    u.pitch = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* no speech on this device */ }
}

export default function LockIn({ onClose, onDone }: { onClose: () => void; onDone?: () => void }) {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [task, setTask] = useState('');
  const [minutes, setMinutes] = useState(50);
  const [now, setNow] = useState(Date.now());
  const [line, setLine] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [finished, setFinished] = useState<Session | null>(null);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    const lid = setInterval(() => setLine(l => (l + 1) % LINES.length), 20000);
    // Keep the screen on while locked in, where the browser allows it.
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request('screen').then(w => { wake.current = w; }).catch(() => {});
    return () => { clearInterval(id); clearInterval(lid); wake.current?.release().catch(() => {}); wake.current = null; };
  }, [session]);

  useEffect(() => {
    if (session && now >= session.endsAt) {
      logMinutes(session.minutes);
      try { localStorage.removeItem(K_SESSION); } catch { /* ignore */ }
      setFinished(session);
      setSession(null);
      speak(`Session complete. ${session.minutes} minutes, locked in. Well done, sir.`);
      onDone?.();
    }
  }, [now, session, onDone]);

  const start = () => {
    const s: Session = { task: task.trim() || 'The one thing', minutes, startedAt: Date.now(), endsAt: Date.now() + minutes * 60000 };
    try { localStorage.setItem(K_SESSION, JSON.stringify(s)); } catch { /* ignore */ }
    setSession(s);
    setLine(0);
    setNow(Date.now());
    speak(`Locked in for ${minutes} minutes. No one is coming, sir. Begin.`);
  };

  const quit = () => {
    if (session) {
      const done = Math.floor((Date.now() - session.startedAt) / 60000);
      if (done > 0) logMinutes(done);
    }
    try { localStorage.removeItem(K_SESSION); } catch { /* ignore */ }
    setSession(null);
    setConfirmQuit(false);
    onDone?.();
    onClose();
  };

  const left = session ? Math.max(0, session.endsAt - now) : 0;
  const mm = Math.floor(left / 60000);
  const ss = Math.floor((left % 60000) / 1000);
  const pct = session ? 1 - left / (session.minutes * 60000) : 0;
  const R = 110;
  const C = 2 * Math.PI * R;

  return createPortal(
    <div className="fixed inset-0 z-[150] bg-[#02040a] flex flex-col items-center justify-center px-6 text-center">
      {!session && (
        <button onClick={onClose} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-white" aria-label="Close"><X size={20} /></button>
      )}

      {finished && !session ? (
        <div className="max-w-sm">
          <ArcReactor size={80} />
          <p className="font-orbitron text-cyan-200 tracking-[0.25em] text-lg mt-5">SESSION COMPLETE</p>
          <p className="text-gray-300 mt-3">{finished.minutes} minutes on <span className="text-white font-semibold">{finished.task}</span>.</p>
          <p className="text-gray-500 text-sm mt-2">Locked in today: {lockedInToday()} min. That is a receipt, not an intention.</p>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setFinished(null)} className="flex-1 rounded-xl py-3 font-hud font-bold uppercase tracking-wider text-sm bg-cyan-400/15 border border-cyan-300/50 text-cyan-100">Go again</button>
            <button onClick={onClose} className="flex-1 rounded-xl py-3 font-hud font-bold uppercase tracking-wider text-sm border border-white/15 text-gray-300">Done</button>
          </div>
        </div>
      ) : !session ? (
        <div className="w-full max-w-sm">
          <Lock size={28} className="mx-auto text-cyan-300" />
          <p className="font-orbitron text-cyan-200 tracking-[0.3em] text-xl mt-4">LOCK IN</p>
          <p className="text-gray-400 text-sm mt-2">One task. Phone out of reach. No one is coming to do it for you.</p>
          <input autoFocus value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && start()}
            placeholder="What is the one thing?"
            className="mt-6 w-full bg-black/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-center text-white placeholder-gray-600 outline-none focus:border-cyan-300" />
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[25, 50, 90, 120].map(m => (
              <button key={m} onClick={() => setMinutes(m)}
                className={`rounded-xl py-2.5 font-orbitron text-sm border ${minutes === m ? 'bg-cyan-400/15 border-cyan-300/60 text-cyan-100' : 'border-white/10 text-gray-500'}`}>
                {m}<span className="text-[10px] ml-0.5">m</span>
              </button>
            ))}
          </div>
          <button onClick={start}
            className="mt-5 w-full rounded-xl py-3.5 font-hud font-bold uppercase tracking-[0.25em] text-base bg-cyan-400/20 border border-cyan-300/60 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.25)] inline-flex items-center justify-center gap-2 press">
            <Play size={16} /> Begin
          </button>
          <p className="text-[11px] text-gray-600 mt-3">The timer survives a locked screen or a reload.</p>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <p className="font-hud text-[11px] uppercase tracking-[0.3em] text-cyan-400/70">Locked in on</p>
          <p className="text-white text-lg font-semibold mt-1">{session.task}</p>
          <div className="relative mx-auto mt-6" style={{ width: 260, height: 260 }}>
            <svg width="260" height="260" viewBox="0 0 260 260" className="-rotate-90">
              <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="8" />
              <circle cx="130" cy="130" r={R} fill="none" stroke="rgb(34,211,238)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
                style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.7))' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-orbitron text-5xl text-cyan-50 tabular-nums">{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</p>
              <p className="font-hud text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-2">of {session.minutes} minutes</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mt-6 min-h-[3rem] fade-up" key={line}>{LINES[line]}</p>

          {confirmQuit ? (
            <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4">
              <p className="text-rose-100 text-sm">Quitting now, sir? The version of you that you want does not stop at {Math.round(pct * 100)}%.</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setConfirmQuit(false)} className="flex-1 rounded-lg py-2.5 font-hud font-bold uppercase tracking-wider text-sm bg-cyan-400/15 border border-cyan-300/50 text-cyan-100">Keep going</button>
                <button onClick={quit} className="flex-1 rounded-lg py-2.5 font-hud uppercase tracking-wider text-xs border border-white/10 text-gray-500">Quit anyway</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmQuit(true)} className="mt-8 text-[11px] font-hud uppercase tracking-[0.25em] text-gray-600 hover:text-gray-400">End session</button>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
