import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Zap, Hash, Grid3x3, Palette, Trophy } from 'lucide-react';

/*
 * Uni → Brain Gym: four short tests (reaction time, digit span, sequence
 * memory, Stroop focus). Bests and recent scores live in gymforge_brain so
 * they sync across devices. The honest note matters: practice improves the
 * trained task; transfer to general intelligence is weak.
 */

const K = 'gymforge_brain';
type Game = 'reaction' | 'span' | 'seq' | 'stroop';
type Scores = Record<Game, { best: number | null; recent: number[] }>;
const EMPTY: Scores = { reaction: { best: null, recent: [] }, span: { best: null, recent: [] }, seq: { best: null, recent: [] }, stroop: { best: null, recent: [] } };
const LOWER_IS_BETTER: Record<Game, boolean> = { reaction: true, span: false, seq: false, stroop: false };

function loadScores(): Scores {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(K) || '{}') }; } catch { return EMPTY; }
}

function useScores() {
  const [scores, setScores] = useState<Scores>(loadScores);
  const record = (g: Game, v: number) => {
    setScores(prev => {
      const cur = prev[g];
      const better = cur.best === null || (LOWER_IS_BETTER[g] ? v < cur.best : v > cur.best);
      const next = { ...prev, [g]: { best: better ? v : cur.best, recent: [v, ...cur.recent].slice(0, 10) } };
      try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  };
  return { scores, record };
}

function Shell({ icon, title, sub, best, unit, children }: { icon: ReactNode; title: string; sub: string; best: number | null; unit: string; children: ReactNode }) {
  return (
    <div className="bg-[#111] border border-sky-500/20 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-sky-200 flex items-center gap-2">{icon} {title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1 justify-end"><Trophy size={10} /> Best</p>
          <p className="font-orbitron text-sky-200 text-sm">{best === null ? '—' : `${best}${unit}`}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

const btn = 'rounded-xl px-4 py-2.5 font-hud font-bold uppercase tracking-wider text-sm border border-sky-300/40 text-sky-100 bg-sky-400/10';

/* ---------------- Reaction time ---------------- */
function Reaction({ best, onDone }: { best: number | null; onDone: (ms: number) => void }) {
  const [phase, setPhase] = useState<'idle' | 'wait' | 'go' | 'early' | 'shown'>('idle');
  const [times, setTimes] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const t0 = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const arm = () => {
    setPhase('wait');
    timer.current = window.setTimeout(() => { t0.current = performance.now(); setPhase('go'); }, 1200 + Math.random() * 2800);
  };
  const tap = () => {
    if (phase === 'idle' || phase === 'shown' || phase === 'early') {
      if (phase === 'shown' && times.length >= 5) setTimes([]);
      arm();
      return;
    }
    if (phase === 'wait') { window.clearTimeout(timer.current); setPhase('early'); return; }
    const ms = Math.round(performance.now() - t0.current);
    const next = [...times, ms];
    setLast(ms);
    setTimes(next);
    setPhase('shown');
    if (next.length === 5) onDone(Math.round(next.reduce((a, b) => a + b, 0) / 5));
  };
  const avg = times.length === 5 ? Math.round(times.reduce((a, b) => a + b, 0) / 5) : null;
  const colour = phase === 'go' ? 'bg-emerald-500/80 border-emerald-300' : phase === 'wait' ? 'bg-red-500/70 border-red-300' : 'bg-black/40 border-sky-400/30';
  const label = phase === 'idle' ? 'Tap to start'
    : phase === 'wait' ? 'Wait for green…'
    : phase === 'go' ? 'TAP!'
    : phase === 'early' ? 'Too early — tap to retry'
    : avg !== null ? `Average ${avg}ms — tap to go again` : `${last}ms — tap for the next (${times.length}/5)`;
  return (
    <Shell icon={<Zap size={16} />} title="Reaction time" sub="Five taps, averaged. Most people sit around 250ms; trained athletes 180-220ms." best={best} unit="ms">
      <button onPointerDown={tap} data-testid="reaction-pad" className={`w-full h-36 rounded-2xl border-2 font-hud font-bold uppercase tracking-wider text-lg text-white select-none transition-colors ${colour}`}>
        {label}
      </button>
    </Shell>
  );
}

/* ---------------- Digit span ---------------- */
function DigitSpan({ best, onDone }: { best: number | null; onDone: (n: number) => void }) {
  const [len, setLen] = useState(3);
  const [digits, setDigits] = useState('');
  const [show, setShow] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'answer' | 'over'>('idle');
  const [answer, setAnswer] = useState('');
  const [reverse, setReverse] = useState(false);

  const play = (n: number) => {
    const d = Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
    setDigits(d); setAnswer(''); setPhase('showing');
    d.split('').forEach((c, i) => {
      window.setTimeout(() => setShow(c), i * 1000);
      window.setTimeout(() => setShow(null), i * 1000 + 700);
    });
    window.setTimeout(() => setPhase('answer'), n * 1000 + 100);
  };
  const submit = () => {
    const target = reverse ? digits.split('').reverse().join('') : digits;
    if (answer.trim() === target) { setLen(len + 1); play(len + 1); }
    else { setPhase('over'); onDone(len - 1); }
  };
  return (
    <Shell icon={<Hash size={16} />} title="Digit span" sub="Digits flash one at a time; type them back. Average adults hold about 7 forwards, 5 backwards." best={best} unit=" digits">
      <div className="h-24 rounded-2xl bg-black/40 border border-sky-400/20 flex items-center justify-center">
        {phase === 'showing' && <span className="font-orbitron text-5xl text-sky-100" data-testid="span-digit">{show ?? ''}</span>}
        {phase === 'idle' && <span className="text-sm text-gray-500">Starts at 3 digits, adds one each time you get it right.</span>}
        {phase === 'answer' && (
          <input autoFocus inputMode="numeric" value={answer} onChange={e => setAnswer(e.target.value.replace(/\D/g, ''))} onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder={reverse ? 'Type them backwards' : 'Type the digits'} aria-label="Digits"
            className="w-48 text-center font-orbitron text-2xl bg-transparent border-b border-sky-400/40 outline-none text-sky-100" />
        )}
        {phase === 'over' && <span className="text-sm text-gray-300">It was <span className="font-orbitron text-sky-200">{digits}</span>. You held <span className="text-sky-200 font-bold">{len - 1}</span>.</span>}
      </div>
      <div className="flex gap-2 mt-3">
        {phase === 'answer'
          ? <button onClick={submit} className={btn + ' flex-1'}>Check</button>
          : <button onClick={() => { setLen(3); play(3); }} disabled={phase === 'showing'} className={btn + ' flex-1 disabled:opacity-40'}>{phase === 'over' ? 'Again' : 'Start'}</button>}
        <button onClick={() => setReverse(r => !r)} disabled={phase === 'showing' || phase === 'answer'}
          className={`rounded-xl px-3 text-xs font-hud uppercase tracking-wider border ${reverse ? 'border-sky-300/50 text-sky-100 bg-sky-400/10' : 'border-white/10 text-gray-500'} disabled:opacity-40`}>
          Backwards
        </button>
      </div>
    </Shell>
  );
}

/* ---------------- Sequence memory ---------------- */
function Sequence({ best, onDone }: { best: number | null; onDone: (n: number) => void }) {
  const [seq, setSeq] = useState<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'over'>('idle');

  const show = (s: number[]) => {
    setPhase('showing'); setPos(0);
    s.forEach((cell, i) => {
      window.setTimeout(() => setLit(cell), 500 + i * 650);
      window.setTimeout(() => setLit(null), 500 + i * 650 + 400);
    });
    window.setTimeout(() => setPhase('input'), 500 + s.length * 650);
  };
  const start = () => { const s = [Math.floor(Math.random() * 9)]; setSeq(s); show(s); };
  const tap = (i: number) => {
    if (phase !== 'input') return;
    setLit(i); window.setTimeout(() => setLit(null), 150);
    if (seq[pos] !== i) { setPhase('over'); onDone(seq.length - 1); return; }
    if (pos + 1 === seq.length) {
      const next = [...seq, Math.floor(Math.random() * 9)];
      setSeq(next);
      window.setTimeout(() => show(next), 400);
    } else setPos(pos + 1);
  };
  return (
    <Shell icon={<Grid3x3 size={16} />} title="Sequence memory" sub="Watch the squares light up, repeat the order. One longer each round." best={best} unit="">
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {Array.from({ length: 9 }, (_, i) => (
          <button key={i} onClick={() => tap(i)} aria-label={`Square ${i + 1}`}
            className={`aspect-square rounded-xl border transition-colors ${lit === i ? 'bg-sky-300 border-sky-200' : 'bg-black/40 border-sky-400/20'}`} />
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">
        {phase === 'idle' ? 'Tap start.' : phase === 'showing' ? `Watch… (level ${seq.length})` : phase === 'input' ? `Your turn — ${pos}/${seq.length}` : `Level ${seq.length - 1} reached.`}
      </p>
      {(phase === 'idle' || phase === 'over') && <button onClick={start} className={btn + ' w-full mt-2'}>{phase === 'over' ? 'Again' : 'Start'}</button>}
    </Shell>
  );
}

/* ---------------- Stroop ---------------- */
const COLOURS = [
  { name: 'RED', cls: 'text-red-400' }, { name: 'GREEN', cls: 'text-emerald-400' },
  { name: 'BLUE', cls: 'text-[#5b8cff]' }, { name: 'YELLOW', cls: 'text-yellow-300' },
];
function Stroop({ best, onDone }: { best: number | null; onDone: (n: number) => void }) {
  const [left, setLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [card, setCard] = useState({ word: 0, ink: 1 });
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const scoreRef = useRef(0);
  const deal = () => {
    const word = Math.floor(Math.random() * 4);
    let ink = Math.floor(Math.random() * 4);
    if (Math.random() < 0.75) while (ink === word) ink = Math.floor(Math.random() * 4);
    setCard({ word, ink });
  };
  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => {
      if (left === 1) onDone(scoreRef.current);
      setLeft(left - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [left, onDone]);
  const start = () => { scoreRef.current = 0; setScore(0); setLeft(30); deal(); };
  const pick = (i: number) => {
    if (left <= 0) return;
    const right = i === card.ink;
    scoreRef.current += right ? 1 : -1;
    setScore(scoreRef.current);
    setFlash(right ? 'ok' : 'bad'); window.setTimeout(() => setFlash(null), 150);
    deal();
  };
  return (
    <Shell icon={<Palette size={16} />} title="Stroop focus" sub="Tap the colour of the INK, not the word. 30 seconds; wrong answers cost a point." best={best} unit="">
      <div className={`h-24 rounded-2xl border flex items-center justify-center ${flash === 'ok' ? 'border-emerald-400/60' : flash === 'bad' ? 'border-red-400/60' : 'border-sky-400/20'} bg-black/40`}>
        {left > 0
          ? <span className={`font-orbitron text-4xl ${COLOURS[card.ink].cls}`} data-testid="stroop-word">{COLOURS[card.word].name}</span>
          : <span className="text-sm text-gray-400">{score ? `Score ${score}` : 'Tap start'}</span>}
      </div>
      {left > 0 && <p className="text-center text-[11px] text-gray-500 mt-1">{left}s · score {score}</p>}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {left > 0
          ? COLOURS.map((c, i) => <button key={c.name} onClick={() => pick(i)} className={`rounded-xl py-2.5 border border-white/10 bg-white/[0.03] font-hud text-xs font-bold ${c.cls}`}>{c.name}</button>)
          : <button onClick={start} className={btn + ' col-span-4'}>Start</button>}
      </div>
    </Shell>
  );
}

export default function BrainGym() {
  const { scores, record } = useScores();
  const trend = (g: Game) => {
    const r = scores[g].recent;
    if (r.length < 2) return null;
    return Math.round(r.slice(0, 5).reduce((a, b) => a + b, 0) / Math.min(5, r.length));
  };
  return (
    <div className="space-y-3">
      <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
        <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Your numbers · average of last 5</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {([['reaction', 'React', 'ms'], ['span', 'Span', ''], ['seq', 'Sequence', ''], ['stroop', 'Stroop', '']] as [Game, string, string][]).map(([g, l, u]) => (
            <div key={g} className="rounded-xl bg-black/30 py-2">
              <p className="font-orbitron text-sky-200 text-sm">{trend(g) ?? '—'}{trend(g) !== null ? u : ''}</p>
              <p className="text-[10px] text-gray-500 font-hud uppercase tracking-wider">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <Reaction best={scores.reaction.best} onDone={v => record('reaction', v)} />
      <DigitSpan best={scores.span.best} onDone={v => record('span', v)} />
      <Sequence best={scores.seq.best} onDone={v => record('seq', v)} />
      <Stroop best={scores.stroop.best} onDone={v => record('stroop', v)} />
    </div>
  );
}
