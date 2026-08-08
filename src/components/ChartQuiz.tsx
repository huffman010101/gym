import { useState } from 'react';
import { GraduationCap, Check, X, RotateCcw, Search, ChevronDown } from 'lucide-react';
import CandlestickChart from './CandlestickChart';
import type { Annotation } from './CandlestickChart';
import {
  CONCEPTS, generateQuestion, optionsFor, conceptById, findConcept, conceptIds,
} from '../lib/chartQuiz';
import type { Question } from '../lib/chartQuiz';

const SCORE_KEY = 'gymforge_chartquiz_score';

interface Score { right: number; total: number; per: Record<string, { right: number; total: number }> }

function loadScore(): Score {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    if (raw) return JSON.parse(raw) as Score;
  } catch { /* ignore */ }
  return { right: 0, total: 0, per: {} };
}

export default function ChartQuiz() {
  const [drill, setDrill] = useState<string | null>(null);   // conceptId being drilled, null = mixed
  const [seed, setSeed] = useState(() => Date.now());
  const [q, setQ] = useState<Question>(() => generateQuestion(undefined, Date.now()));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState<Score>(loadScore);
  const [query, setQuery] = useState('');
  const [queryMiss, setQueryMiss] = useState('');
  const [showRef, setShowRef] = useState(false);

  const options = optionsFor(q.conceptId, seed);
  const answered = picked !== null;
  const correct = picked === q.conceptId;

  function next(conceptId: string | null = drill) {
    const s = Date.now() + Math.floor(Math.random() * 100000);
    setSeed(s);
    setQ(generateQuestion(conceptId ?? undefined, s));
    setPicked(null);
  }

  function answer(id: string) {
    if (answered) return;
    setPicked(id);
    const right = id === q.conceptId;
    const next: Score = {
      right: score.right + (right ? 1 : 0),
      total: score.total + 1,
      per: { ...score.per },
    };
    const p = next.per[q.conceptId] ?? { right: 0, total: 0 };
    next.per[q.conceptId] = { right: p.right + (right ? 1 : 0), total: p.total + 1 };
    setScore(next);
    try { localStorage.setItem(SCORE_KEY, JSON.stringify(next)); } catch { /* quota */ }
  }

  function runQuery() {
    const c = findConcept(query);
    if (!c || !conceptIds().includes(c.id)) {
      setQueryMiss(query.trim());
      return;
    }
    setQueryMiss('');
    setDrill(c.id);
    next(c.id);
    setQuery('');
  }

  function resetScore() {
    const fresh = { right: 0, total: 0, per: {} };
    setScore(fresh);
    try { localStorage.removeItem(SCORE_KEY); } catch { /* ignore */ }
  }

  // reveal the pattern location only after answering
  const annotations: Annotation[] = answered
    ? [{
        id: 'answer',
        type: 'box',
        i1: q.from,
        i2: q.to,
        p1: q.band ? Math.min(...q.band) : Math.min(...q.candles.slice(q.from, q.to + 1).map(c => c.low)),
        p2: q.band ? Math.max(...q.band) : Math.max(...q.candles.slice(q.from, q.to + 1).map(c => c.high)),
      }]
    : [];

  const pct = score.total ? Math.round((score.right / score.total) * 100) : 0;

  return (
    <div className="fade-up stagger space-y-4">
      <div className="card-premium p-5">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <GraduationCap size={16} className="text-amber-400" /> Read the chart
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Every chart below is <span className="text-amber-300 font-semibold">built to actually contain</span> the
          concept — the pattern is constructed structurally, not a random chart with a label attached. So when you
          get it wrong, the pattern really was there to be found.
        </p>
      </div>

      {/* drill a specific concept */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Test me on something specific</p>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setQueryMiss(''); }}
            onKeyDown={e => e.key === 'Enter' && runQuery()}
            placeholder="fvg, cisd, choch, sweep, order block…"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600"
          />
          <button onClick={runQuery} className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg px-3 flex items-center">
            <Search size={15} />
          </button>
        </div>
        {queryMiss && (
          <p className="text-[11px] text-red-300/90 mt-2 leading-relaxed">
            No test for &ldquo;{queryMiss}&rdquo; yet — I only quiz concepts I can generate a genuine example of, rather
            than fake one. Currently covered: {CONCEPTS.map(c => c.name).join(' · ')}.
          </p>
        )}
        <div className="flex items-center justify-between mt-3 gap-2">
          <p className="text-[11px] text-gray-500">
            {drill ? <>Drilling <span className="text-amber-300 font-semibold">{conceptById(drill).name}</span></> : 'Mixed — all concepts'}
          </p>
          {drill && (
            <button onClick={() => { setDrill(null); next(null); }} className="text-[11px] font-bold text-gray-400 hover:text-amber-300">
              Back to mixed
            </button>
          )}
        </div>
      </div>

      {/* the chart */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-1 px-1">
          <p className="text-[10px] text-gray-500">What is shown here?</p>
          {score.total > 0 && (
            <p className="text-[10px] font-bold text-gray-400">{score.right}/{score.total} · {pct}%</p>
          )}
        </div>
        <CandlestickChart
          candles={q.candles}
          viewStart={0}
          viewSize={q.candles.length}
          tool="cursor"
          annotations={annotations}
          onAdd={() => { /* read-only in the quiz */ }}
          height={300}
        />
      </div>

      {/* options */}
      <div className="grid grid-cols-1 gap-2">
        {options.map(id => {
          const c = conceptById(id);
          const isAnswer = id === q.conceptId;
          const isPicked = id === picked;
          let cls = 'bg-[#111] border-white/10 hover:border-white/25 text-gray-200';
          if (answered && isAnswer) cls = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200';
          else if (answered && isPicked) cls = 'bg-red-500/15 border-red-500/50 text-red-200';
          else if (answered) cls = 'bg-[#111] border-white/8 text-gray-500';
          return (
            <button key={id} onClick={() => answer(id)} disabled={answered}
              className={`text-left rounded-xl border px-4 py-3 transition-colors ${cls}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{c.name}</p>
                  {answered && <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">{c.short}</p>}
                </div>
                {answered && isAnswer && <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                {answered && isPicked && !isAnswer && <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* result */}
      {answered && (
        <div className={`rounded-2xl border p-4 ${correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className={`font-black text-sm mb-1 ${correct ? 'text-emerald-300' : 'text-red-300'}`}>
            {correct ? 'Correct' : `Not quite — it was ${conceptById(q.conceptId).name}`}
          </p>
          <p className="text-gray-300 text-xs leading-relaxed mb-2">{q.reveal}</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            <span className="font-semibold text-gray-400">How to spot it: </span>{conceptById(q.conceptId).spot}
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => next()} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl py-2.5 text-sm">
              Next chart
            </button>
            {!correct && (
              <button onClick={() => { setDrill(q.conceptId); next(q.conceptId); }}
                className="bg-white/10 hover:bg-white/15 text-gray-200 font-bold rounded-xl px-4 py-2.5 text-sm">
                Drill this
              </button>
            )}
          </div>
        </div>
      )}

      {!answered && (
        <button onClick={() => next()} className="w-full text-xs font-bold text-gray-500 hover:text-gray-300 py-1">
          Skip this one
        </button>
      )}

      {/* per-concept accuracy */}
      {score.total > 0 && (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Your accuracy</p>
            <button onClick={resetScore} className="text-[10px] font-bold text-gray-600 hover:text-red-400 flex items-center gap-1">
              <RotateCcw size={11} /> Reset
            </button>
          </div>
          <div className="space-y-1.5">
            {Object.entries(score.per)
              .sort((a, b) => (a[1].right / a[1].total) - (b[1].right / b[1].total))
              .map(([id, s]) => {
                const p = Math.round((s.right / s.total) * 100);
                return (
                  <div key={id} className="flex items-center gap-2">
                    <p className="text-[11px] text-gray-400 flex-1 min-w-0 truncate">{conceptById(id).name}</p>
                    <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden flex-shrink-0">
                      <div className={`h-full ${p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p}%` }} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 w-12 text-right flex-shrink-0">{s.right}/{s.total}</p>
                  </div>
                );
              })}
          </div>
          <p className="text-[10px] text-gray-600 mt-2.5 leading-relaxed">
            Weakest first. Tap a concept name in the box above to drill whichever one is costing you most.
          </p>
        </div>
      )}

      {/* reference */}
      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <button onClick={() => setShowRef(!showRef)} className="w-full flex items-center justify-between px-5 py-4 text-left">
          <div>
            <p className="font-bold text-gray-100">The definitions</p>
            <p className="text-xs text-amber-400/70 mt-0.5">All {CONCEPTS.length} concepts — read before or after, your call</p>
          </div>
          <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${showRef ? 'rotate-180' : ''}`} />
        </button>
        <div className={`collapse-wrap ${showRef ? 'open' : ''}`}>
          <div className="collapse-inner">
            <div className="collapse-content px-5 pb-5 space-y-3">
              {CONCEPTS.map(c => (
                <div key={c.id}>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-200">{c.name}</p>
                    <button onClick={() => { setDrill(c.id); next(c.id); setShowRef(false); }}
                      className="text-[9px] font-bold uppercase tracking-wider text-amber-400/70 hover:text-amber-300">
                      drill
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{c.short}</p>
                  <p className="text-gray-600 text-xs leading-relaxed mt-0.5">{c.spot}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-200/80 leading-relaxed">
          Reading a pattern on a clean generated chart is the easy version. Live charts are messier and every concept
          here has ambiguous cases — this trains recognition, which is the prerequisite, not the whole skill. Use the
          Replay tab to test whether you can act on what you see without knowing what comes next.
        </p>
      </div>
    </div>
  );
}
