import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ChevronDown, Check, Minus, X, Repeat } from 'lucide-react';
import { localDate } from './DailyPlan';
import { DAILY } from '../data/myNotes';

/*
 * Home → the Mind protocol. One focus at a time (the "Actually changing"
 * rule), a concrete rep for today, the when-then trigger, and a one-tap
 * evening answer so you can see whether you are living it. Stored under
 * gymforge_* so it syncs, and fed into the J.A.R.V.I.S. check-in.
 */

const K_FOCUS = 'gymforge_mindfocus';
const K_LOG = 'gymforge_mindfocus_log';

export interface Focus { id: string; title: string; why: string; rep: string; when: string; say: string }

export const FOCUSES: Focus[] = [
  { id: 'negativity', title: 'No negativity', why: 'Complaining trains your brain to hunt for problems and makes you tiring company.', rep: 'Zero complaints today — out loud or in texts. If one slips, follow it with what you will do about it.', when: 'When I catch myself complaining → I say what I will do instead, or drop it.', say: 'Act or accept.' },
  { id: 'slow', title: 'Slow everything down', why: 'Rushed speech and fast walking read as nervous before you say a word.', rep: 'Speak 20% slower in every conversation and walk slower between places.', when: 'When I notice I am rushing → one breath out, then half speed.', say: 'Slow is calm. Calm is confident.' },
  { id: 'warm', title: 'Be warm first', why: 'Warmth plus composure is what people mean by charisma.', rep: 'Greet three people before they greet you — smile, eye contact, name.', when: 'When I walk into a room → I say hello first.', say: 'Go first.' },
  { id: 'listen', title: 'Listen properly', why: 'People like whoever makes them feel heard. It also takes the pressure off you.', rep: 'In one conversation: phone away, three follow-up questions before you talk about yourself.', when: 'When I start planning my reply → I ask one more question instead.', say: 'Interested, not interesting.' },
  { id: 'frame', title: 'Hold your frame', why: 'Over-explaining and defending yourself are the biggest tells of insecurity.', rep: 'Say things once. When teased, agree and exaggerate instead of defending.', when: 'When I feel the urge to explain → I stop after one sentence.', say: 'Say it once.' },
  { id: 'scared', title: 'One scared thing a day', why: 'Nerves only shrink with reps — rejection therapy is how the fear dies.', rep: 'Get one "no" today: an approach, a request, an honest opinion you would normally swallow.', when: 'When I hesitate → 3, 2, 1, go.', say: 'The win is in the approach.' },
  { id: 'approval', title: 'Stop seeking approval', why: 'Scanning the room and checking reactions is neediness people can see.', rep: 'No checking who is looking, no checking if she has replied. Enjoy your own company.', when: 'When I want to check a reaction → I look at what I am doing instead.', say: 'My validation is enough.' },
  { id: 'names', title: 'Names and details', why: 'Remembering someone shows you actually care — rarer than any compliment.', rep: 'Use three people\'s names today and bring up one thing someone told you before.', when: 'When I meet someone → I say their name back straight away.', say: 'Make them feel seen.' },
  { id: 'reactions', title: 'Calm reactions', why: 'The calmer person holds the frame; reacting hands it away.', rep: 'Pause one beat before every reply. No free reactions to bait, banter or bad news.', when: 'When something winds me up → one breath and "will this matter in a week?"', say: 'Not reacting is power.' },
  { id: 'promise', title: 'Keep your word to yourself', why: 'Confidence is evidence. Every kept promise is proof you can rely on you.', rep: 'Make one small promise before noon and keep it no matter what.', when: 'When I want to skip it → I do the smallest version instead.', say: 'Do what you said.' },
  { id: 'phone', title: 'Phone discipline', why: 'Scrolling cooks your focus and steals the hours that build everything else.', rep: 'No phone for the first hour, phone out of the bedroom, no short-form video today.', when: 'When I reach for my phone without a reason → I put it in another room.', say: 'Attention is the asset.' },
  { id: 'chooser', title: 'Do I like them?', why: 'Switching from "do they like me" to "do I like them" removes desperation in one thought.', rep: 'In every conversation today, ask yourself what you actually like or do not like about the person.', when: 'When I feel myself trying to impress → I ask "do I like them?"', say: 'I am choosing too.' },
  { id: 'playful', title: 'Playful and positive', why: 'People remember how you made them feel. Fun and light is magnetic; trying hard is not.', rep: 'Make three people laugh or smile today. No complaining, no heavy energy.', when: 'When a moment gets awkward or flat → I make it playful.', say: 'I am here to have fun.' },
  { id: 'outcome', title: 'No outcome attachment', why: 'Needing a result makes you tense and reactive. Nobody will remember this in a year.', rep: 'Do one thing today where the result does not matter — only that you did it.', when: 'When I worry how it will go → "Will this matter in a week?"', say: 'The win is the attempt.' },
  { id: 'walk', title: 'Walk with no music', why: 'Constant input stops you thinking clearly. A quiet walk resets your head.', rep: '20 minutes walking today with no music, podcast or phone.', when: 'When I reach for my headphones → I leave them for the first walk of the day.', say: 'Let the brain be bored.' },
  { id: 'energy', title: 'Match the energy', why: 'Chasing weak signals kills attraction and self-respect.', rep: 'Mirror effort in every chat today — same length, same speed. No double texts.', when: 'When I want to send another message → I wait for theirs.', say: 'Want it, do not need it.' },
];

type Log = Record<string, 0 | 1 | 2>; // 0 missed, 1 partly, 2 lived it

function load<T>(k: string, f: T): T {
  try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : f; } catch { return f; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } }

export function currentFocus(): Focus {
  const f = load<{ id: string } | null>(K_FOCUS, null);
  return FOCUSES.find(x => x.id === f?.id) ?? FOCUSES[0];
}
export function focusSummary(): string {
  const f = currentFocus();
  const log = load<Log>(K_LOG, {});
  const last7 = Array.from({ length: 7 }, (_, i) => log[localDate(-i)]);
  const lived = last7.filter(v => v === 2).length;
  return `mind focus this week: "${f.title}" — lived it fully on ${lived} of the last 7 days${log[localDate(0)] === undefined ? ', not answered today yet' : ''}`;
}

export default function MindFocus() {
  const [focusState, setFocusState] = useState(() => load<{ id: string; since: string } | null>(K_FOCUS, null));
  const [log, setLog] = useState<Log>(() => load<Log>(K_LOG, {}));
  const [picking, setPicking] = useState(false);
  const focus = FOCUSES.find(x => x.id === focusState?.id) ?? FOCUSES[0];
  const since = focusState?.since ?? localDate(0);

  const today = localDate(0);
  const answer = (v: 0 | 1 | 2) => { const next = { ...log, [today]: v }; setLog(next); save(K_LOG, next); };
  const choose = (id: string) => { const next = { id, since: today }; setFocusState(next); save(K_FOCUS, next); setPicking(false); };

  const days = Array.from({ length: 7 }, (_, i) => localDate(i - 6));
  const dayNum = Math.max(1, Math.round((new Date(today).getTime() - new Date(since).getTime()) / 864e5) + 1);
  let streak = 0;
  for (let i = log[today] === undefined ? 1 : 0; i < 60; i++) { if (log[localDate(-i)] === 2) streak++; else break; }
  const missedYesterday = log[localDate(-1)] === 0 && log[today] === undefined;
  const livedSince = Object.entries(log).filter(([d, v]) => d >= since && v === 2).length;
  const readyToMove = dayNum >= 14 && livedSince >= 10;

  // One line from the owner's own notes, rotating daily.
  const mine = load<string[]>('gymforge_my_notes', []);
  const pool = [...mine, ...DAILY];
  const dayIdx = Math.floor(new Date(today).getTime() / 864e5);
  const note = pool[dayIdx % pool.length];

  const hour = new Date().getHours();
  const answered = log[today];

  return (
    <div className="hud-frame relative overflow-hidden rounded-2xl border border-pink-400/40 bg-gradient-to-br from-pink-500/[0.12] via-[#0b1017] to-[#0b1017] p-5" data-testid="mind-focus">
      <div className="flex items-start justify-between gap-3">
        <p className="font-hud text-[11px] font-bold uppercase tracking-[0.28em] text-pink-300 flex items-center gap-1.5"><Brain size={13} /> Mind protocol · day {dayNum}</p>
        <button onClick={() => setPicking(p => !p)} className="text-[11px] text-gray-500 hover:text-pink-200 inline-flex items-center gap-1"><Repeat size={11} /> Change</button>
      </div>
      <h2 className="font-orbitron text-2xl text-white mt-2 leading-tight" data-testid="focus-title">{focus.title}</h2>
      <p className="text-xs text-gray-400 mt-1">{focus.why}</p>

      <div className="mt-3 rounded-xl bg-black/40 border border-pink-400/25 px-3.5 py-3">
        <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-pink-300/90">Today's rep</p>
        <p className="text-sm text-gray-100 font-semibold mt-0.5">{focus.rep}</p>
        <p className="text-xs text-gray-400 mt-2"><span className="text-pink-300">Trigger:</span> {focus.when}</p>
        <p className="text-xs text-gray-400 mt-1"><span className="text-pink-300">Say it:</span> “{focus.say}”</p>
      </div>

      {missedYesterday && <p className="text-xs text-amber-300 mt-2.5">Missed yesterday. Never miss twice — today is the one that counts.</p>}
      {readyToMove && <p className="text-xs text-emerald-300 mt-2.5">{livedSince} days lived out of {dayNum}. This one is becoming automatic — keep it and add the next focus when you are ready.</p>}

      <div className="flex items-center justify-between gap-3 mt-3.5">
        <div className="flex gap-1.5" aria-label="Last 7 days">
          {days.map(d => {
            const v = log[d];
            return <span key={d} title={d} className={`w-3.5 h-3.5 rounded-full border ${v === 2 ? 'bg-emerald-400 border-emerald-300' : v === 1 ? 'bg-amber-400/80 border-amber-300' : v === 0 ? 'bg-red-500/70 border-red-400' : d === today ? 'border-pink-300/70' : 'border-white/15'}`} />;
          })}
        </div>
        {streak > 0 && <span className="font-hud text-[11px] uppercase tracking-wider text-emerald-300">{streak}-day streak</span>}
      </div>

      <div className="mt-3">
        <p className="text-[11px] text-gray-500 mb-1.5">{answered === undefined ? (hour >= 18 ? 'Tonight: did you live it?' : 'Answer tonight: did you live it today?') : 'Today logged — you can change it.'}</p>
        <div className="grid grid-cols-3 gap-2">
          {([[2, 'Lived it', Check, 'emerald'], [1, 'Partly', Minus, 'amber'], [0, 'Missed', X, 'red']] as const).map(([v, label, Icon, c]) => (
            <button key={v} onClick={() => answer(v)}
              className={`rounded-xl py-2 text-xs font-hud font-bold uppercase tracking-wider border inline-flex items-center justify-center gap-1 ${answered === v
                ? c === 'emerald' ? 'bg-emerald-400/20 border-emerald-300/60 text-emerald-100' : c === 'amber' ? 'bg-amber-400/20 border-amber-300/60 text-amber-100' : 'bg-red-500/20 border-red-400/60 text-red-100'
                : 'border-white/10 text-gray-400'}`}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-3 border-t border-white/5 pt-2.5">
        From your notes: <span className="text-gray-300">{note}</span> · <Link to="/mind?tab=notes" className="text-pink-300 hover:underline">My Notes</Link>
      </p>

      {picking && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[11px] text-gray-500">Pick one and run it for at least two weeks — one change at a time is how it sticks.</p>
          {FOCUSES.map(f => (
            <button key={f.id} onClick={() => choose(f.id)}
              className={`w-full text-left rounded-lg px-3 py-2 flex items-center justify-between gap-2 ${f.id === focus.id ? 'bg-pink-400/10 border border-pink-400/30' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}>
              <span className="text-sm text-gray-100">{f.title}</span>
              <ChevronDown size={14} className="-rotate-90 text-gray-600" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
