import { useState } from 'react';
import { Target, Check, RotateCcw, ChevronDown } from 'lucide-react';

/*
 * Combat → ★ This Session. One specific thing to work on in every kickboxing
 * class, in a progression (defence → offence → fight IQ). After class, one
 * tap: nailed it moves you on; partly or forgot repeats it next time. Log is
 * gymforge_fight_log, so it syncs.
 */

interface Focus { id: string; block: string; name: string; say: string; cue: string; check: string; solo: string }

export const FOCUSES: Focus[] = [
  // Block 1 — defence and base
  { id: 'hands', block: 'Defence', name: 'Hands home', say: 'Hands home.', cue: 'Every punch comes straight back to your face — the rear hand glued to the chin, the jab hand back at eye level. Most shots you eat come in the half-second your hand is still out.', check: 'Ask a partner or coach to shout every time a hand drops, or film one round. Aim: zero drops in the last round, when you are tired.', solo: '3 rounds of shadowboxing where the only goal is the return. Slow is fine.' },
  { id: 'chin', block: 'Defence', name: 'Chin down, shoulder up', say: 'Chin behind the shoulder.', cue: 'Chin tucked, eyes looking up through your brows. On every straight punch the punching shoulder rises to cover the chin.', check: 'After each round, ask yourself: did I get caught clean on the chin? If yes, when — while punching or while resetting?', solo: 'Shadowbox in front of a mirror side-on and watch the shoulder rise on each cross.' },
  { id: 'stance', block: 'Defence', name: 'Stance and balance', say: 'Light feet, weight in the middle.', cue: 'Feet just wider than shoulders, weight 50/50, on the balls of the feet. You should be able to lift either leg to check a kick without shifting first.', check: 'Did you ever get knocked off balance or caught flat-footed? Could you check a kick from where you stood?', solo: 'Footwork ladder: step forward, back, left, right from stance for 3 minutes, never crossing your feet.' },
  { id: 'check', block: 'Defence', name: 'Check every leg kick', say: 'Knee to elbow.', cue: 'Lift the knee to meet the elbow, shin turned slightly out. Check, then fire back straight away — a check with no counter just invites the next kick.', check: 'Count the leg kicks you took clean versus checked. Aim to check more than you take.', solo: '50 checks a side in shadowboxing, each followed by a jab-cross.' },
  { id: 'breathe', block: 'Defence', name: 'Breathe and stay loose', say: 'Exhale on every shot.', cue: 'Sharp breath out through the nose or a "tss" on every strike. Shoulders down and loose between exchanges — tension burns your gas tank in two rounds.', check: 'Were you breathing hard after round 1? Did your shoulders burn? Both mean you were tense.', solo: 'One round of shadowboxing at 50% power, focusing only on breathing out with each strike.' },
  // Block 2 — offence
  { id: 'jab', block: 'Offence', name: 'The jab — snap and step', say: 'Jab first.', cue: 'Start most exchanges with the jab. Snap it out and back faster than it went, and step with it to close distance.', check: 'Did you lead with the jab, or start with power shots? Count how many exchanges you opened with it.', solo: '3 rounds of jab only: single, double, step-in, step-out, to the body.' },
  { id: 'cross', block: 'Offence', name: 'The cross — turn the hip', say: 'Pivot the back foot.', cue: 'Turn the back heel out and drive the hip through. The power comes from the floor and the hip, not the arm.', check: 'On the pads, ask the holder which crosses felt heavy. The heavy ones had the pivot.', solo: '100 slow crosses on the bag, thinking only about the back foot.' },
  { id: 'hook', block: 'Offence', name: 'Lead hook', say: 'Elbow up, turn the lead foot.', cue: 'Elbow at shoulder height, short arc, turn on the lead foot and hip. Throw it off the jab-cross so they do not see it coming.', check: 'Did you land the hook off the 1-2 at least three times in pad or sparring rounds?', solo: '1-2-3 on the bag, 3 rounds, rear hand staying on the chin during the hook.' },
  { id: 'body', block: 'Offence', name: 'Body, then head', say: 'Dig, then come up.', cue: 'Bend the knees to go to the body — do not just drop the hands — then come back up to the head. Body shots pull their guard down.', check: 'Did you go to the body at least once in every round?', solo: 'Level-change drill: jab to the body, cross to the head, 3 rounds.' },
  { id: 'kick', block: 'Offence', name: 'Roundhouse — turn the hip over', say: 'Pivot, swing the hip.', cue: 'Step out, pivot on the ball of the standing foot so the heel faces the target, swing the hip over and hit with the shin. Hand on the same side goes back to protect.', check: 'Did the kicks land with the shin, not the foot? Did you finish balanced and back in stance?', solo: '30 slow kicks a side on the bag, holding the end position for a second each.' },
  { id: 'teep', block: 'Offence', name: 'Teep to control distance', say: 'Teep the pressure.', cue: 'Push kick to the stomach or hips when they step in. Lift the knee first, then push through with the ball of the foot. It stops pressure fighters dead.', check: 'Count teeps landed. Did you use it when someone walked forward at you?', solo: 'Teep a heavy bag 3 × 15 per leg, resetting to stance each time.' },
  { id: 'finish', block: 'Offence', name: 'Finish every combo', say: 'Kick or move — never stand there.', cue: 'Every combination ends with a kick or a step out of the line. The moment after your combo is when you get hit.', check: 'After how many of your combos did you get countered? Aim: none, because you finished with movement.', solo: '1-2-kick and 1-2-step-out, alternating, 3 rounds.' },
  // Block 3 — fight IQ
  { id: 'angles', block: 'Fight IQ', name: 'Angles — step off the line', say: 'Hit and turn.', cue: 'After a combo, pivot or step diagonally so you are not straight in front of them. Their power is straight ahead.', check: 'Did you leave at an angle at least once per exchange?', solo: 'Shadowbox: every combo ends with a pivot left or right.' },
  { id: 'feint', block: 'Fight IQ', name: 'Feints', say: 'Show one, throw another.', cue: 'Feint the jab — a shoulder twitch and half step — then throw the real shot. Watch how they react and use it.', check: 'Did you land something off a feint? What did they do when you feinted?', solo: 'Feint-jab-cross and feint-kick-punch combinations, 3 rounds.' },
  { id: 'counter', block: 'Fight IQ', name: 'Slip and counter', say: 'Slip the jab, cross back.', cue: 'Slip outside their jab by turning the shoulder and bending the knees slightly, then come back with the cross straight away.', check: 'How many times did you counter instead of just covering up?', solo: 'Partner jabs slowly, you slip and counter, 3 rounds. Solo: slip a hanging ball or rope.' },
  { id: 'ring', block: 'Fight IQ', name: 'Ring control', say: 'Never straight back.', cue: 'When pressured, move back at an angle or circle out. Backing up in a straight line ends with you on the ropes.', check: 'Did you get trapped against the ropes or wall? How did you get there?', solo: 'Footwork: circle left and right around a cone for 3 rounds, changing direction on the beep.' },
  { id: 'pace', block: 'Fight IQ', name: 'Pace — last round like the first', say: 'Same output, round three.', cue: 'Start at a pace you can keep. Your last round should look like your first. Gas is a skill: relax, breathe, pick your moments.', check: 'Compare your output in the first and last round. Did your hands drop or your strikes slow?', solo: 'Conditioning: 5 × 3-minute bag rounds at steady output, 1 minute rest.' },
];

type Rating = 'nailed' | 'partly' | 'missed';
type Entry = { d: string; id: string; rating: Rating; note?: string };
const K = 'gymforge_fight_log';
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Walk the log: a "nailed" on the current focus moves you on; anything else repeats it. */
export function currentFocusIndex(log: Entry[]): number {
  let pos = 0;
  for (const e of log) if (e.id === FOCUSES[pos].id && e.rating === 'nailed') pos = (pos + 1) % FOCUSES.length;
  return pos;
}

export default function FightFocus() {
  const [log, setLog] = useState<Entry[]>(() => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } });
  const [pick, setPick] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [browse, setBrowse] = useState(false);
  const persist = (next: Entry[]) => { setLog(next); try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ } };

  const pos = currentFocusIndex(log);
  const f = FOCUSES.find(x => x.id === pick) ?? FOCUSES[pos];
  const loggedToday = log.find(e => e.d === today());
  const tries = log.filter(e => e.id === f.id).length;

  const rate = (rating: Rating) => {
    const entry: Entry = { d: today(), id: f.id, rating, ...(note.trim() ? { note: note.trim() } : {}) };
    persist([...log.filter(e => e.d !== today()), entry].slice(-200));
    setNote(''); setPick(null);
  };

  const btn = 'flex-1 rounded-xl py-2.5 text-xs font-hud font-bold uppercase tracking-wider border inline-flex items-center justify-center gap-1';

  return (
    <div className="space-y-3" data-testid="fight-focus">
      <div className="bg-gradient-to-br from-red-500/15 to-[#111] border border-red-500/35 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-hud text-[10px] font-bold uppercase tracking-[0.3em] text-red-300/80 flex items-center gap-1.5"><Target size={12} /> This session · {f.block}</p>
          <p className="text-[10px] text-gray-500">{pos + 1}/{FOCUSES.length}{tries ? ` · attempt ${tries + 1}` : ''}</p>
        </div>
        <h3 className="font-black text-2xl text-white mt-1">{f.name}</h3>
        <p className="font-hud text-sm font-bold uppercase tracking-[0.15em] text-red-200 mt-1">Say it before every round: “{f.say}”</p>
        <p className="text-gray-300 text-sm leading-relaxed mt-3">{f.cue}</p>
        <div className="mt-3 rounded-xl bg-black/30 px-3 py-2.5 space-y-1.5">
          <p className="text-xs text-gray-300"><span className="font-bold text-red-200">How you know: </span>{f.check}</p>
          <p className="text-xs text-gray-400"><span className="font-bold text-gray-300">On your own: </span>{f.solo}</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl p-4 space-y-2.5">
        {loggedToday ? (
          <p className="text-sm text-gray-300">
            Logged today: <span className="font-semibold text-white">{FOCUSES.find(x => x.id === loggedToday.id)?.name}</span> —{' '}
            {loggedToday.rating === 'nailed' ? 'nailed it. Next session moves on.' : 'repeat it next session.'}
            <span className="block text-[11px] text-gray-500 mt-0.5">Tap again to change today's answer.</span>
          </p>
        ) : (
          <p className="text-sm font-semibold text-gray-200">After class: how did it go?</p>
        )}
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="One line: what happened, what to fix (optional)"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-red-400/50" aria-label="Session note" />
        <div className="flex gap-2">
          <button onClick={() => rate('nailed')} className={`${btn} border-emerald-400/40 text-emerald-100 bg-emerald-500/10`}><Check size={12} /> Nailed it</button>
          <button onClick={() => rate('partly')} className={`${btn} border-amber-400/40 text-amber-100 bg-amber-500/10`}>Partly</button>
          <button onClick={() => rate('missed')} className={`${btn} border-white/15 text-gray-300`}><RotateCcw size={12} /> Forgot</button>
        </div>
        <p className="text-[11px] text-gray-500">Nailed it moves you to the next focus. Partly or forgot keeps the same one next time — one thing at a time until it is automatic.</p>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <button onClick={() => setBrowse(b => !b)} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <span className="text-sm font-semibold text-gray-200">The progression · pick a different focus</span>
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${browse ? 'rotate-180' : ''}`} />
        </button>
        {browse && (
          <div className="px-3 pb-3 space-y-1">
            {FOCUSES.map((x, i) => {
              const done = log.some(e => e.id === x.id && e.rating === 'nailed');
              const on = x.id === f.id;
              return (
                <button key={x.id} onClick={() => { setPick(i === pos ? null : x.id); setBrowse(false); }}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${on ? 'bg-red-500/10 border border-red-400/30' : 'hover:bg-white/[0.03]'}`}>
                  <span className={`w-5 text-[11px] font-black ${done ? 'text-emerald-400' : 'text-gray-600'}`}>{done ? '✓' : i + 1}</span>
                  <span className="flex-1 text-[13px] text-gray-200">{x.name}</span>
                  <span className="text-[10px] text-gray-500">{x.block}</span>
                </button>
              );
            })}
            <p className="text-[11px] text-gray-500 px-2.5 pt-1">Coach set a theme for class? Pick the closest one. Your place in the progression is kept.</p>
          </div>
        )}
      </div>

      {log.length > 0 && (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Last sessions</p>
          <div className="space-y-1.5">
            {[...log].reverse().slice(0, 6).map(e => (
              <div key={e.d} className="text-xs">
                <span className="text-gray-500">{e.d.slice(5)} · </span>
                <span className="text-gray-200">{FOCUSES.find(x => x.id === e.id)?.name ?? e.id}</span>
                <span className={`ml-1.5 ${e.rating === 'nailed' ? 'text-emerald-300' : e.rating === 'partly' ? 'text-amber-300' : 'text-gray-500'}`}>
                  {e.rating === 'nailed' ? 'nailed' : e.rating === 'partly' ? 'partly' : 'forgot'}
                </span>
                {e.note && <p className="text-gray-500 pl-10">{e.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
