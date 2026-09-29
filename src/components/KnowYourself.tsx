import { useEffect, useState } from 'react';
import { ChevronDown, Plus, X, Check, Sparkles, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { generatePersonalPlanWithRetry, explainFailure } from '../lib/generators';
import type { PersonalPlan } from '../lib/generators';

/*
 * The interactive half of Mind. Everything here is stored per-device under
 * gymforge_ky_* and read lazily in try/catch, same as the rest of the app.
 *
 * The design point: self-concept is built from evidence of your own behaviour,
 * not from reading about confidence. So this tab is mostly inputs — what you
 * value, what you will not accept, and a running log of things you have
 * actually done. The prose is deliberately the smaller half.
 */

const VALUES = [
  'Honesty', 'Loyalty', 'Discipline', 'Courage', 'Kindness', 'Ambition',
  'Independence', 'Humour', 'Curiosity', 'Calm', 'Generosity', 'Fairness',
  'Health', 'Craft', 'Family', 'Freedom', 'Competence', 'Warmth',
  'Directness', 'Patience', 'Creativity', 'Reliability', 'Humility', 'Drive',
];

function useStored<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* quota */ }
  }, [key, v]);
  return [v, setV];
}

function Fold({ title, tag, items }: { title: string; tag: string; items: [string, string][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-pink-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">
            {items.map(([t, d]) => (
              <div key={t}>
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Evidence { id: string; text: string; date: string }

const LEAKS = [
  'Phone / short-form video', 'Gaming', 'Porn', 'Weed', 'Drinking',
  'Late nights for no reason', 'Snoozing', 'Doomscrolling', 'Online shopping',
  'Comparing yourself online', 'Starting things and not finishing', 'People who drain you',
];

const NIGHT_SIGNS = [
  'I checked whether she was looking before I moved',
  'I rehearsed an opener instead of just going',
  'I needed a drink in my hand to feel ready',
  'I felt worse about myself after a no',
  'I counted results rather than attempts',
  'I stayed with my mates where it was safe',
  'I decided nobody was my type before speaking to anyone',
];

export default function KnowYourself() {
  const [values, setValues] = useStored<string[]>('gymforge_ky_values', []);
  const [standards, setStandards] = useStored<string>('gymforge_ky_standards', '');
  const [identity, setIdentity] = useStored<string>('gymforge_ky_identity', '');
  const [evidence, setEvidence] = useStored<Evidence[]>('gymforge_ky_evidence', []);
  const [signs, setSigns] = useStored<string[]>('gymforge_ky_signs', []);
  const [draft, setDraft] = useState('');
  const [situation, setSituation] = useStored<string>('gymforge_ky_situation', '');
  const [leaks, setLeaks] = useStored<Record<string, number>>('gymforge_ky_leaks', {});
  const [obstacles, setObstacles] = useStored<string>('gymforge_ky_obstacles', '');
  const [oneThing, setOneThing] = useStored<string>('gymforge_ky_onething', '');
  const [plan, setPlan] = useStored<PersonalPlan | null>('gymforge_ky_plan', null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  /* Gate: a plan built from blank inputs is a generic plan, which is worse than
   * no plan. Require the values plus something written about themselves. */
  const ready = values.length === 5 && (standards.trim().length > 20 || identity.trim().length > 20);

  async function build() {
    setErr('');
    setBusy(true);
    try {
      const out = await generatePersonalPlanWithRetry({
        values, standards, identity,
        evidence: evidence.map(e => e.text),
        signs, situation, obstacles, oneThing,
        leaks: Object.entries(leaks).map(([name, hours]) => ({ name, hours })),
      });
      setPlan({ ...out, builtAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) });
    } catch (e) {
      setErr(explainFailure(e));
    }
    setBusy(false);
  }

  function toggleValue(v: string) {
    if (values.includes(v)) setValues(values.filter(x => x !== v));
    else if (values.length < 5) setValues([...values, v]);
  }

  function addEvidence() {
    const t = draft.trim();
    if (!t) return;
    setEvidence([
      { id: `${Date.now()}`, text: t, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) },
      ...evidence,
    ]);
    setDraft('');
  }

  return (
    <div className="fade-up stagger space-y-4">
      <div className="bg-gradient-to-br from-pink-500/15 to-[#111] border border-pink-500/30 rounded-2xl p-5">
        <h3 className="font-black text-pink-300 mb-2">You cannot read your way to this one</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Confidence that does not move is not a feeling you talk yourself into — it is the
          conclusion you draw from watching your own behaviour over time. You believe what you have
          seen yourself do. So this tab is mostly boxes to fill in rather than paragraphs to read,
          and it is worth doing slowly and honestly once rather than skimming now.
        </p>
      </div>

      {/* ---------- VALUES ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-100">What you actually value</h3>
          <span className="text-[11px] font-bold text-pink-400/80">{values.length}/5</span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Pick five. Not the five that sound best — the five you would defend at a cost. Knowing
          these is most of what "knowing who you are" actually means, and it is what makes you hard
          to move: someone with five clear values cannot be talked out of himself.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {VALUES.map(v => {
            const on = values.includes(v);
            const full = values.length >= 5 && !on;
            return (
              <button
                key={v}
                onClick={() => toggleValue(v)}
                disabled={full}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
                  on
                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-200'
                    : full
                      ? 'bg-white/[0.02] border-white/5 text-gray-700'
                      : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
        {values.length === 5 && (
          <div className="mt-3 bg-pink-500/8 border border-pink-500/20 rounded-xl px-3.5 py-2.5">
            <p className="text-pink-200/90 text-xs leading-relaxed">
              <span className="font-bold">Now the real question:</span> what would someone who genuinely
              held {values.slice(0, -1).join(', ')} and {values[values.length - 1]} do differently this
              week? That answer is the whole exercise — values you do not act on are preferences.
            </p>
          </div>
        )}
      </div>

      {/* ---------- STANDARDS ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">What you will not accept</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Your actual non-negotiables — in how you are treated, how you behave, what you tolerate.
          Decide them now, calmly, because almost every time you fold it is because you had not
          decided in advance and were improvising under pressure.
        </p>
        <textarea
          value={standards}
          onChange={e => setStandards(e.target.value)}
          rows={4}
          placeholder={'I will not chase someone who is lukewarm.\nI will not be the funny one to be liked.\nI will not skip the gym because someone made me feel small.'}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:border-pink-500/40 outline-none resize-y leading-relaxed"
        />
      </div>

      {/* ---------- IDENTITY ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">Who you are when nobody is watching</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Finish the sentence a few times: <span className="text-gray-300">"I am the kind of person who…"</span>
          {' '}Only write things that are already true, or things you are actively becoming with evidence
          below. Aspirational statements you have no proof of do not build identity — they build a
          gap you feel every time you read them.
        </p>
        <textarea
          value={identity}
          onChange={e => setIdentity(e.target.value)}
          rows={4}
          placeholder={'I am the kind of person who does the hard session anyway.\nI am the kind of person who says the thing rather than sitting on it.\nI am the kind of person who is warm first.'}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:border-pink-500/40 outline-none resize-y leading-relaxed"
        />
      </div>

      {/* ---------- EVIDENCE LOG ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-100">Evidence log</h3>
          <span className="text-[11px] text-gray-600">{evidence.length} entries</span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          The engine of the whole tab. Every time you do something that proves one of the statements
          above — you approached, you held a standard, you trained when you did not want to, you said
          the awkward thing — log it. Self-concept is built from a pile of these, and the pile is
          also what you read on the days you feel like none of it is true.
        </p>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEvidence()}
            placeholder="What did you do?"
            className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:border-pink-500/40 outline-none"
          />
          <button
            onClick={addEvidence}
            className="bg-pink-500 hover:bg-pink-400 text-white px-4 rounded-xl transition-colors flex items-center justify-center"
            aria-label="Add evidence"
          >
            <Plus size={16} />
          </button>
        </div>
        {evidence.length > 0 && (
          <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
            {evidence.map(e => (
              <div key={e.id} className="flex items-start gap-2 bg-black/25 rounded-xl px-3 py-2">
                <Check size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-[13px] text-gray-300 leading-relaxed">{e.text}</p>
                <span className="text-[10px] text-gray-700 flex-shrink-0 mt-0.5">{e.date}</span>
                <button onClick={() => setEvidence(evidence.filter(x => x.id !== e.id))}
                  className="text-gray-700 hover:text-gray-500 flex-shrink-0">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- OUTCOME ATTACHMENT AUDIT ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">The outcome-attachment audit</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Tick anything true of your last night out. This is not a scorecard to feel bad about — it
          is a list of the specific behaviours that give you away, and each one is separately
          fixable. Come back and re-tick it after a few nights.
        </p>
        <div className="space-y-1.5">
          {NIGHT_SIGNS.map(sgn => {
            const on = signs.includes(sgn);
            return (
              <button
                key={sgn}
                onClick={() => setSigns(on ? signs.filter(s => s !== sgn) : [...signs, sgn])}
                className={`w-full flex items-start gap-2.5 text-left rounded-xl px-3 py-2 border transition-colors ${
                  on ? 'bg-amber-500/10 border-amber-500/30' : 'bg-black/25 border-white/8'
                }`}
              >
                <div className={`w-4 h-4 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  on ? 'bg-amber-500/80 border-amber-400' : 'border-white/20'
                }`}>
                  {on && <Check size={11} className="text-black" />}
                </div>
                <span className={`text-[13px] leading-relaxed ${on ? 'text-amber-100' : 'text-gray-400'}`}>{sgn}</span>
              </button>
            );
          })}
        </div>
        {signs.length > 0 && (
          <p className="text-gray-500 text-xs leading-relaxed mt-3">
            {signs.length} ticked. Pick the single one you would find easiest to drop and target only
            that next time. Trying to fix all of them at once is how people end up more
            self-conscious, not less.
          </p>
        )}
      </div>

      {/* ---------- WHAT IS IN THE WAY ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">Where your time actually goes</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Tick what applies and put an honest hours-per-week next to it. Guess high rather than low —
          the point is not to feel bad, it is to see the arithmetic, because "a bit of scrolling" and
          "twenty-one days a year" are the same sentence and only one of them makes you move.
        </p>
        <div className="space-y-1.5">
          {LEAKS.map(name => {
            const on = name in leaks;
            return (
              <div key={name} className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-colors ${
                on ? 'bg-red-500/8 border-red-500/25' : 'bg-black/25 border-white/8'
              }`}>
                <button
                  onClick={() => {
                    const next = { ...leaks };
                    if (on) { delete next[name]; if (oneThing === name) setOneThing(''); }
                    else next[name] = 5;
                    setLeaks(next);
                  }}
                  className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                >
                  <div className={`w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center ${
                    on ? 'bg-red-500/80 border-red-400' : 'border-white/20'
                  }`}>
                    {on && <Check size={11} className="text-black" />}
                  </div>
                  <span className={`text-[13px] ${on ? 'text-red-100' : 'text-gray-400'}`}>{name}</span>
                </button>
                {on && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={leaks[name]}
                      onChange={e => setLeaks({ ...leaks, [name]: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                      className="w-14 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-[12px] text-gray-200 text-right outline-none focus:border-red-500/40"
                    />
                    <span className="text-[10px] text-gray-600">h/wk</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(leaks).length > 0 && (() => {
          const total = Object.values(leaks).reduce((a, b) => a + b, 0);
          const daysAYear = Math.round((total * 52) / 24);
          const biggest = Object.entries(leaks).sort((a, b) => b[1] - a[1])[0];
          return (
            <div className="mt-3 bg-red-500/8 border border-red-500/20 rounded-xl px-3.5 py-3">
              <p className="text-red-200 text-sm font-bold">
                {total}h a week — about {daysAYear} full days a year.
              </p>
              <p className="text-gray-400 text-xs leading-relaxed mt-1">
                Biggest single one is {biggest[0]} at {biggest[1]}h. You do not need to remove all of
                this and you would not want to — some of it is rest and some of it is your life. But
                that number is the budget everything you say you want has to come out of.
              </p>
            </div>
          );
        })()}

        {Object.keys(leaks).length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Kill one first</p>
            <p className="text-gray-500 text-xs leading-relaxed mb-2">
              Not all of them. One, for two weeks, with friction rather than willpower — app off the
              home screen, console unplugged in a cupboard, phone charging in another room. Willpower
              loses to convenience every time, so make the thing genuinely harder to reach.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(leaks).map(name => (
                <button
                  key={name}
                  onClick={() => setOneThing(oneThing === name ? '' : name)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
                    oneThing === name
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">What is genuinely in the way</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Money, time, the ankle, your course, someone in your life, a habit you cannot shift. Write
          them plainly. The plan will sort them into the real constraints to work around and the ones
          that are avoidance wearing an obstacle's clothes — and being honest here is the only way
          that sorting is worth anything.
        </p>
        <textarea
          value={obstacles}
          onChange={e => setObstacles(e.target.value)}
          rows={3}
          placeholder={'No money until January.\nAnkle still not right so I keep skipping the running.\nI only go out with people who make it a big night.'}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:border-pink-500/40 outline-none resize-y leading-relaxed"
        />
      </div>

      {/* ---------- PERSONAL PLAN ---------- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-gray-100 mb-1">Anything else about your situation</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Optional, but it is what makes the plan yours rather than generic — what you are working
          toward, what keeps going wrong, what you are avoiding, anything going on right now.
        </p>
        <textarea
          value={situation}
          onChange={e => setSituation(e.target.value)}
          rows={3}
          placeholder="6ft 4, at uni, play football, in the gym 3x a week. Go out most weekends and it has gone quiet. Ankle still not right from a sprain."
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:border-pink-500/40 outline-none resize-y leading-relaxed"
        />
      </div>

      <div className="bg-gradient-to-br from-pink-500/12 to-[#111] border border-pink-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-2.5 mb-3">
          <Sparkles size={16} className="text-pink-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-pink-300">Your plan, built from your answers</h3>
            <p className="text-gray-500 text-xs leading-relaxed mt-0.5">
              Reads everything above — including the behaviours you ticked — and looks for the gaps
              between who you say you are and what your log actually shows.
            </p>
          </div>
        </div>

        {!ready && (
          <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl px-3.5 py-2.5 flex items-start gap-2 mb-3">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200/85 text-xs leading-relaxed">
              Fill in your five values and either your standards or your identity statements first.
              Built from blank boxes this would hand you the same plan it would hand anyone, which is
              exactly what you do not want.
            </p>
          </div>
        )}

        {err && (
          <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl px-3.5 py-2.5 mb-3">
            <p className="text-amber-200/85 text-xs leading-relaxed">{err}</p>
          </div>
        )}

        <button
          onClick={build}
          disabled={busy || !ready}
          className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-40 text-white font-bold text-sm rounded-xl py-3 transition-colors inline-flex items-center justify-center gap-2"
        >
          {busy
            ? <><Loader2 size={15} className="animate-spin" /> Reading your answers…</>
            : plan ? <><RefreshCw size={14} /> Rebuild the plan</> : 'Build my plan'}
        </button>

        {plan && (
          <div className="mt-4 space-y-3.5">
            {plan.builtAt && <p className="text-[10px] text-gray-600">Built {plan.builtAt}</p>}

            <div className="bg-black/30 rounded-xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-pink-400/80 mb-1.5">The read</p>
              <p className="text-gray-300 text-[13px] leading-relaxed">{plan.read}</p>
            </div>

            {!!plan.strengths?.length && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500/80 mb-1.5">What you already have</p>
                <ul className="space-y-1">
                  {plan.strengths.map(x => (
                    <li key={x} className="text-gray-400 text-[13px] leading-relaxed flex gap-2">
                      <span className="text-emerald-400/80 flex-shrink-0">•</span><span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!plan.gaps?.length && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-500/80 mb-1.5">The gaps</p>
              <div className="space-y-2">
                {(plan.gaps ?? []).map(g => (
                  <div key={g.gap} className="bg-black/30 rounded-xl px-3.5 py-2.5">
                    <p className="font-semibold text-[13px] text-gray-200">{g.gap}</p>
                    {g.why && <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{g.why}</p>}
                    {g.fix && <p className="text-emerald-300/80 text-xs leading-relaxed mt-1">→ {g.fix}</p>}
                  </div>
                ))}
              </div>
            </div>
            )}

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-pink-400/80 mb-1.5">This week</p>
              <ul className="space-y-1">
                {(plan.thisWeek ?? []).map(x => (
                  <li key={x} className="text-gray-300 text-[13px] leading-relaxed flex gap-2">
                    <span className="text-pink-400/80 flex-shrink-0">□</span><span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">The next 90 days</p>
              {(plan.phases ?? []).map(f => (
                <div key={f.name} className="bg-black/30 rounded-xl px-3.5 py-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-bold text-[13px] text-gray-200">{f.name}</p>
                    <span className="text-[10px] font-bold text-gray-600 flex-shrink-0">{f.weeks}</span>
                  </div>
                  {f.focus && <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{f.focus}</p>}
                  <ul className="mt-1.5 space-y-1">
                    {(f.actions ?? []).map(a => (
                      <li key={a} className="text-gray-400 text-xs leading-relaxed flex gap-2">
                        <span className="text-gray-600 flex-shrink-0">–</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {!!plan.stopDoing && (
              <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-3.5 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400/80 mb-1">Stop doing this</p>
                <p className="text-gray-300 text-[13px] leading-relaxed">{plan.stopDoing}</p>
              </div>
            )}

            {!!plan.measure?.length && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 mb-1.5">How you will know in 30 days</p>
                <ul className="space-y-1">
                  {plan.measure.map(x => (
                    <li key={x} className="text-gray-400 text-[13px] leading-relaxed flex gap-2">
                      <span className="text-gray-600 flex-shrink-0">•</span><span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.honest && (
              <div className="bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5">
                <p className="text-gray-400 text-xs leading-relaxed">
                  <span className="font-bold text-gray-300">Honestly:</span> {plan.honest}
                </p>
              </div>
            )}

            <p className="text-gray-700 text-[10px] leading-relaxed">
              Saved on this device. Rebuild it after a few weeks of new entries in the evidence log —
              the plan is only as good as what you have put in above it.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

/* The dating half of what used to sit under Know Yourself. It belongs with
 * the Game Plan, so Mind renders it there; the helpers stay local to this file. */
export function DatingMindset() {
  return (
    <div className="space-y-4">
      <Fold title="Waiting for her to look at you first" tag="The specific thing costing you the ones you want" items={[
        ['You have built a filter that excludes exactly who you want', 'If you only approach people who look at you first, you only ever approach people who were already interested. The ones you actually want — who are being looked at all night and have learned not to look back — are structurally excluded by your own rule. That is not bad luck; it is the filter working as designed.'],
        ['A look is a weak signal anyway', 'People avoid eye contact when they are interested at least as often as when they are not, especially in a club, especially with someone tall who they have clocked and do not want to seem eager toward. You are reading a noisy signal as if it were data.'],
        ['Approach on your decision, not her signal', 'The rule that fixes it: you decide, in advance, that you will speak to someone because YOU want to. Not because she gave you permission. That single change moves you from reactive to deciding, and it is most of what people mean when they say someone has presence.'],
        ['It also removes the sting', 'When the approach was your decision rather than a response to a signal you thought you read, a no means far less. You were not rejected — an idea you had did not land.'],
      ]} />

      <Fold title="Outcome attachment — what it actually is" tag="You named it yourself, so here is the mechanism" items={[
        ['It is needing a specific result to feel okay', 'Not wanting one — wanting is fine and normal. Attachment is when the result determines how you feel about yourself afterwards. That is the part people detect, and it is the part that repels.'],
        ['It leaks in the body before the words', 'Slightly too much eye contact, laughing a beat early, hovering, checking her reaction after each sentence, hanging in a conversation past its natural end. Nobody consciously spots these; everybody feels them.'],
        ['The fix is changing what counts as success', 'Define the night by behaviour you control — ten conversations started, stayed until the end of one, said the thing rather than sitting on it. You cannot control whether someone wants you. You can control whether you were the version of you that you respect. Judge that.'],
        ['Have somewhere else to be', 'Non-neediness is arithmetic more than attitude. If the week contains training, work, friends and things you would do with nobody watching, no single interaction can carry much weight. The most effective anti-neediness work is not psychological — it is having a full week.'],
        ['Appreciation, since you raised it', 'You are right that it is connected. If you cannot notice what is already good — the friends, the body, the fact you get told you are good-looking — everything becomes a deficit to be fixed by the next result. Two minutes a night listing three things is not a wellness cliché, it is the thing that stops you needing the win.'],
      ]} />

      <Fold title="On wanting to be the guy everyone wants" tag="The honest version of the goal" items={[
        ['Universal appeal is not an available option', 'Nobody has it. Being strongly wanted by some people requires being distinctly something — and anything distinct repels a portion of the room. The people you can think of who "everyone wants" are simply vivid enough that the ones who do not like them are not the ones talking.'],
        ['Aiming to be liked by everyone makes you bland', 'It is also, precisely, outcome attachment with a bigger audience. The tuning-yourself-to-the-room habit is what removes the thing that would have made you compelling.'],
        ['Unpressed is a by-product, not a target', 'You cannot practise being unbothered. You get there by having enough evidence of your own behaviour that other people\'s reactions stop being load-bearing. That is what the boxes above are building, slowly.'],
        ['The version worth aiming at', 'Not wanted by everyone — hard to unsettle, warm to be around, clearly something rather than agreeable to all. That one is achievable, and it is mostly built from keeping promises to yourself where nobody sees.'],
      ]} />
    </div>
  );
}
