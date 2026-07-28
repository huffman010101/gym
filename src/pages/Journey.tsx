import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map, Check, ChevronLeft, ChevronRight, Sparkles, Loader2, AlertCircle, Send } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { askAdvisor } from '../lib/generators';

interface Phase {
  id: string;
  title: string;
  duration: string;
  why: string;
  actions: { id: string; label: string; link?: string }[];
  graduate: string;
}

const PHASES: Phase[] = [
  {
    id: 'foundation',
    title: 'Phase 1 — Foundation',
    duration: 'Weeks 1-4',
    why: 'Nothing else works on a broken base. This phase installs the four systems every later phase runs on: sleep, training, skin, and a consistent day. It feels basic — it\'s the difference between compounding and restarting forever.',
    actions: [
      { id: 'f1', label: 'Fixed wake time set (7 days/week) + morning light habit', link: '/uni?tab=sleep' },
      { id: 'f2', label: 'Do the quiz → AI training + meal plan generated', link: '/quiz' },
      { id: 'f3', label: 'Training 3-4×/week started (any consistency > perfection)', link: '/programs' },
      { id: 'f4', label: 'Basic AM/PM skincare running (cleanser, moisturiser, SPF)', link: '/looksmax?tab=face' },
      { id: 'f5', label: 'Supplements started: creatine, D3, omega-3, magnesium', link: '/looksmax?tab=techniques' },
      { id: 'f6', label: 'High-Value Day template adapted to your timetable', link: '/uni?tab=day' },
      { id: 'f7', label: 'Baseline photos taken (face + physique) for the AI scans', link: '/looksmax?tab=scan' },
    ],
    graduate: 'You wake at the same time daily, train without negotiating with yourself, and the routine runs on autopilot. ~4 weeks of 80% consistency.',
  },
  {
    id: 'body',
    title: 'Phase 2 — Body',
    duration: 'Months 2-4',
    why: 'Body composition is the single biggest looks lever (face definition, clothes fit, presence) AND the biggest confidence lever. This phase is about visible physical change.',
    actions: [
      { id: 'b1', label: 'Nutrition dialled: protein target hit 6 days/week, food logged', link: '/food' },
      { id: 'b2', label: 'Progressive overload — beating last week\'s weights', link: '/programs' },
      { id: 'b3', label: 'Cardio protocol: Zone 2 3×/week + 10k steps daily', link: '/looksmax?tab=techniques' },
      { id: 'b4', label: 'Posture routine daily (chin tucks, doorway stretch, face pulls)', link: '/looksmax?tab=techniques' },
      { id: 'b5', label: 'Monthly physique AI review — course-correct from photos', link: '/physique' },
      { id: 'b6', label: 'Football/combat training slotted in if it\'s your thing', link: '/football' },
    ],
    graduate: 'Visible change in the monthly photos, clothes fitting differently, and at least one compliment you didn\'t fish for. Typically 8-12 weeks in.',
  },
  {
    id: 'face',
    title: 'Phase 3 — Face & Style',
    duration: 'Months 3-5 (overlaps Phase 2)',
    why: 'Now the leanness from Phase 2 starts showing in your face, this phase maximises it: the right haircut, grooming standard, skin quality, and a wardrobe that fits the new body.',
    actions: [
      { id: 's1', label: 'AI Face Scan done → haircut/facial hair/glasses matched to YOUR face', link: '/looksmax?tab=scan' },
      { id: 's2', label: 'Skin photo AI review → personalised routine with actives running', link: '/physique' },
      { id: 's3', label: 'Teeth whitening protocol completed (2 weeks)', link: '/looksmax?tab=techniques' },
      { id: 's4', label: 'Undertone + contrast tested → wardrobe colours known', link: '/looksmax?tab=style' },
      { id: 's5', label: 'Capsule wardrobe built (core pieces, tailored fit)', link: '/looksmax?tab=style' },
      { id: 's6', label: 'Fragrance wardrobe: one day scent + one night scent tested', link: '/looksmax?tab=fragrance' },
      { id: 's7', label: 'Grooming standard locked: brows, neckline, nails, weekly reset', link: '/looksmax?tab=grooming' },
    ],
    graduate: 'You look deliberate — haircut, skin, clothes, scent all working together. The mirror and the camera agree. The Desirability Audit scores jump.',
  },
  {
    id: 'social',
    title: 'Phase 4 — Social & Mind',
    duration: 'Months 4-7',
    why: 'Looks open doors; presence walks through them. This phase converts the physical upgrade into charisma, composure and a real social life — the part people actually fall for.',
    actions: [
      { id: 'm1', label: 'Voice + body language drills from Charisma tab (2 weeks each)', link: '/mind?tab=charisma' },
      { id: 'm2', label: 'One social discomfort rep DAILY (the 3-second rule)', link: '/mind?tab=confidence' },
      { id: 'm3', label: 'Approval-seeking detox run for 30 days', link: '/mind?tab=confidence' },
      { id: 'm4', label: 'Aura habits installed: composure, decisiveness, no complaining', link: '/mind?tab=aura' },
      { id: 'm5', label: 'Self-talk scripts running morning + night', link: '/mind?tab=selftalk' },
      { id: 'm6', label: 'Social calendar alive: 2+ social things a week, new people monthly', link: '/mind?tab=secret' },
      { id: 'm7', label: 'The secret playbook applied in the real world (approaches, dates)', link: '/mind?tab=secret' },
    ],
    graduate: 'You can walk into rooms without rehearsing, hold conversations that go somewhere, and rejection doesn\'t dent your week. Dating becomes a choice, not a hope.',
  },
  {
    id: 'money',
    title: 'Phase 5 — Money & Mission',
    duration: 'Months 6-12',
    why: 'A man with a mission is magnetic and free. This phase builds the income engine and the studies so the transformation is funded and future-proof — the difference between looking the part and being it.',
    actions: [
      { id: 'e1', label: 'One money skill chosen + 90-day sprint started', link: '/money?tab=skills' },
      { id: 'e2', label: 'First £1 earned online (validates everything)', link: '/money?tab=online' },
      { id: 'e3', label: 'Stocks & Shares ISA opened, monthly auto-invest running', link: '/money?tab=trading' },
      { id: 'e4', label: 'Uni: AI study pack generated per module, revision system running', link: '/uni?tab=ai' },
      { id: 'e5', label: 'Career headstart: CV built, spring week/internship deadlines mapped', link: '/uni?tab=career' },
      { id: 'e6', label: 'One-page business plan written (even if not launched yet)', link: '/money?tab=launch' },
    ],
    graduate: 'Money coming in from a skill, money compounding in the ISA, grades protected by a system, and a pipeline for the career. The mission exists.',
  },
  {
    id: 'mastery',
    title: 'Phase 6 — Mastery',
    duration: 'Year 1+',
    why: 'Everything above is now maintenance + refinement. This phase is about compounding: deeper skills, bigger bets, and becoming the guy others ask "how did you do it?"',
    actions: [
      { id: 'x1', label: 'Monthly Desirability Audit — attack the two lowest scores', link: '/looksmax?tab=techniques' },
      { id: 'x2', label: 'Physique: from "fit" to standout (or fight-ready via Combat)', link: '/combat' },
      { id: 'x3', label: 'Business scaled or career pipeline converting (internship → offer)', link: '/money?tab=launch' },
      { id: 'x4', label: 'Social circle upgraded: builders and trainers, not just mates by habit', link: '/mind?tab=aura' },
      { id: 'x5', label: 'Teach one person behind you — teaching locks in everything', link: '/mind?tab=icons' },
    ],
    graduate: 'There is no graduation — this is the life. The app becomes your dashboard, not your teacher.',
  },
];

export default function Journey() {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymforge_journey');
      if (saved) {
        const parsed = JSON.parse(saved) as { idx: number; done: Record<string, boolean> };
        setIdx(Math.min(parsed.idx, PHASES.length - 1));
        setDone(parsed.done || {});
      }
    } catch {}
  }, []);

  const save = (newIdx: number, newDone: Record<string, boolean>) => {
    localStorage.setItem('gymforge_journey', JSON.stringify({ idx: newIdx, done: newDone }));
  };

  const phase = PHASES[idx];
  const phaseDone = phase.actions.filter(a => done[a.id]).length;
  const totalDone = PHASES.reduce((n, p) => n + p.actions.filter(a => done[a.id]).length, 0);
  const totalActions = PHASES.reduce((n, p) => n + p.actions.length, 0);

  const toggle = (id: string) => {
    const updated = { ...done, [id]: !done[id] };
    setDone(updated);
    save(idx, updated);
  };

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(PHASES.length - 1, i));
    setIdx(clamped);
    setAnswer(''); setQuestion(''); setError('');
    save(clamped, done);
  };

  const ask = async () => {
    if (!question.trim()) return;
    setBusy(true); setError('');
    try {
      const ctx = `${phase.title} (${phase.duration}) — focus: ${phase.why} Current actions: ${phase.actions.map(a => a.label).join('; ')}`;
      const res = await askAdvisor(question.trim(), ctx);
      setAnswer(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed. Check your API key.');
    }
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-orange-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Map className="text-orange-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">The Journey</h1>
            <p className="text-gray-500 text-sm">Your transformation, one phase at a time</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-[#111] border border-white/8 rounded-2xl px-4 py-3 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-gray-500 font-semibold">Total progress</p>
            <p className="text-xs text-orange-400 font-bold">{totalDone}/{totalActions}</p>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(totalDone / totalActions) * 100}%` }} />
          </div>
        </div>

        {/* Phase dots */}
        <div className="flex items-center justify-between mb-5 px-1">
          {PHASES.map((p, i) => {
            const complete = p.actions.every(a => done[a.id]);
            return (
              <button key={p.id} onClick={() => goTo(i)} className="flex flex-col items-center gap-1 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  complete ? 'bg-emerald-500 text-white'
                  : i === idx ? 'bg-orange-500 text-white scale-110'
                  : 'bg-white/5 text-gray-500 group-hover:bg-white/10'
                }`}>
                  {complete ? <Check size={14} /> : i + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current phase */}
        <div className="fade-up" key={phase.id}>
          <div className="card-premium p-5 mb-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-black text-lg">{phase.title}</h2>
              <span className="text-[10px] bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/25 flex-shrink-0">{phase.duration}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{phase.why}</p>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Phase actions</h3>
              <span className="text-xs text-gray-500">{phaseDone}/{phase.actions.length}</span>
            </div>
            <div className="space-y-1.5">
              {phase.actions.map(a => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <button onClick={() => toggle(a.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                      done[a.id] ? 'bg-emerald-500 border-emerald-500' : 'border-white/15 hover:border-white/30'
                    }`}>
                    {done[a.id] && <Check size={13} className="text-white" />}
                  </button>
                  {a.link ? (
                    <Link to={a.link} className={`text-sm leading-snug py-1 flex-1 ${done[a.id] ? 'text-gray-600 line-through' : 'text-gray-300 hover:text-white'}`}>
                      {a.label} <span className="text-gray-600">→</span>
                    </Link>
                  ) : (
                    <span className={`text-sm leading-snug py-1 flex-1 ${done[a.id] ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{a.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 mb-4">
            <p className="text-xs text-gray-500"><span className="font-bold text-emerald-400">You graduate this phase when:</span> {phase.graduate}</p>
          </div>

          {/* AI Advisor */}
          <div className="card-premium p-5 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-orange-400" />
              <h3 className="font-bold">Ask the Advisor</h3>
            </div>
            <p className="text-gray-500 text-xs mb-3">Stuck on anything in this phase — or anything at all? Ask. It knows where you are in the journey.</p>
            <div className="flex gap-2">
              <input value={question} onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder={`e.g. "I keep skipping evening skincare, fix my routine?"`}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50" />
              <button onClick={ask} disabled={busy || !question.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-4 rounded-xl transition-colors flex items-center justify-center">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle size={12} /> {error}</p>}
            {answer && (
              <div className="mt-3 bg-black/30 border border-orange-500/15 rounded-xl p-4 fade-up">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex gap-3">
            <button onClick={() => goTo(idx - 1)} disabled={idx === 0}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 py-3 rounded-xl text-sm font-bold transition-colors">
              <ChevronLeft size={16} /> Previous
            </button>
            <button onClick={() => goTo(idx + 1)} disabled={idx === PHASES.length - 1}
              className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-30 text-white py-3 rounded-xl text-sm font-bold transition-colors">
              Next Phase <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
