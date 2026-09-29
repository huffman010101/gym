import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Crosshair } from 'lucide-react';

/*
 * "What do you want to work on?" — one tap from a goal to the exact tabs that
 * serve it. This is the answer to "where does X live": every goal points at the
 * single place each topic is kept, so nothing here duplicates content.
 * Keep the links in step with the tab ids in each page.
 */

interface Dest { to: string; label: string; why: string }
interface Goal { id: string; label: string; dests: Dest[] }

const GOALS: Goal[] = [
  { id: 'size', label: 'Bigger & stronger', dests: [
    { to: '/programs?tab=plan', label: 'Gym → The Plan', why: 'The three sessions. Start here, every week.' },
    { to: '/looksmax?tab=diet', label: 'Looks → Diet', why: 'Swappable meal plan with full recipes' },
    { to: '/plan', label: 'AI Plan', why: 'Your calorie number' },
    { to: '/food', label: 'Food Log', why: 'Hit the protein number' },
    { to: '/physique', label: 'Physique', why: 'Measurements and progress photos' },
  ] },
  { id: 'speed', label: 'Faster & explosive', dests: [
    { to: '/programs?tab=legs', label: 'Gym → Legs + Athletic', why: 'Jumps, sprints, trap bar' },
    { to: '/football?tab=speed', label: 'Football → Speed', why: 'Acceleration and change of direction' },
    { to: '/combat?tab=gym', label: 'Combat → Strength & Power', why: 'Rotational power for fighting' },
  ] },
  { id: 'ankle', label: 'Fix my ankle', dests: [
    { to: '/programs?tab=plan', label: 'Gym → The Plan', why: 'The ankle finisher after every session' },
    { to: '/programs?tab=legs', label: 'Gym → Legs + Athletic', why: 'Starting legs with a weak ankle' },
    { to: '/football?tab=warmup', label: 'Football → Warm-Up', why: 'Your ankle on match day' },
  ] },
  { id: 'looks', label: 'Look better', dests: [
    { to: '/looksmax?tab=scan', label: 'Looks → J.A.R.V.I.S. Scan', why: 'Every metric of your face, and a daily plan' },
    { to: '/looksmax?tab=skin', label: 'Looks → Skin', why: 'The morning and night routine' },
    { to: '/looksmax?tab=look', label: 'Looks → Face · Hair · Style', why: 'Jaw, hair, grooming, clothes' },
    { to: '/looksmax?tab=diet', label: 'Looks → Diet', why: 'Meal plan, recipes, foods for skin' },
    { to: '/looksmax?tab=techniques', label: 'Looks → Body & Habits', why: 'Body fat, debloat, sleep' },
  ] },
  { id: 'girls', label: 'Girls & confidence', dests: [
    { to: '/mind?tab=playbook', label: 'Mind → The Playbook', why: 'The confident, charismatic guy on one screen' },
    { to: '/mind?tab=secret', label: 'Mind → Game Plan', why: 'Clubs, approaching, texting, dates' },
    { to: '/mind?tab=confidence', label: 'Mind → Confidence', why: 'Unbothered, no matter what' },
    { to: '/mind?tab=social', label: 'Mind → Charisma & Presence', why: 'Voice, humour, listening, frame' },
  ] },
  { id: 'discipline', label: 'Discipline & no distractions', dests: [
    { to: '/mind?tab=know', label: 'Mind → Know Yourself', why: 'Your values, leaks and personal plan' },
    { to: '/mind?tab=morning', label: 'Mind → Morning & Night', why: 'No phone, meditate, say it out loud' },
    { to: '/mind?tab=discipline', label: 'Mind → Discipline', why: 'Dopamine detox and deep work' },
  ] },
  { id: 'money', label: 'Make money', dests: [
    { to: '/money?tab=skills', label: 'Money → Skills', why: 'Pick the one skill that pays' },
    { to: '/money?tab=online', label: 'Money → Online Income', why: 'First £1 online' },
    { to: '/money?tab=launch', label: 'Money → Launch a Business', why: 'Validate, plan, go legal' },
    { to: '/money?tab=invest', label: 'Money → Investing', why: 'ISA and what to buy' },
  ] },
  { id: 'uni', label: 'Uni & grades', dests: [
    { to: '/uni?tab=ai', label: 'Uni → AI Study Pack', why: 'Upload notes, get the revision pack' },
    { to: '/uni?tab=smarter', label: 'Uni → Get Smarter', why: 'Memory and learning fast' },
    { to: '/uni?tab=career', label: 'Uni → Career', why: 'CV, tests, interviews' },
  ] },
  { id: 'fight', label: 'Fighting', dests: [
    { to: '/combat?tab=fundamentals', label: 'Combat → Fundamentals', why: 'Stance, base, clinch' },
    { to: '/combat?tab=drills', label: 'Combat → Drills', why: 'What to practise alone' },
    { to: '/combat?tab=strategy', label: 'Combat → Strategy', why: 'Opponent types and the street' },
    { to: '/combat?tab=tough', label: 'Combat → Toughness', why: 'Shins, body, pain tolerance' },
  ] },
  { id: 'football', label: 'Football', dests: [
    { to: '/football?tab=plan', label: 'Football → The Plan', why: 'How to actually get better' },
    { to: '/football?tab=warmup', label: 'Football → Warm-Up', why: 'Pre-match stretches, in order' },
    { to: '/football?tab=home', label: 'Football → Home Drills', why: 'Ball mastery alone' },
    { to: '/football?tab=position', label: 'Football → By Position', why: 'Your role, done properly' },
  ] },
  { id: 'padel', label: 'Padel', dests: [
    { to: '/padel?tab=plan', label: 'Padel → The Plan', why: 'Your padel week' },
    { to: '/padel?tab=technique', label: 'Padel → Technique', why: 'Bandeja, volleys, serve' },
    { to: '/padel?tab=walls', label: 'Padel → Wall Play', why: 'Reading the glass' },
  ] },
];

const KEY = 'gymforge_focus';

export default function FocusMap() {
  const [sel, setSel] = useState<string>(() => {
    try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
  });
  const pick = (id: string) => {
    const next = sel === id ? '' : id;
    setSel(next);
    try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
  };
  const goal = GOALS.find(g => g.id === sel);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Crosshair size={13} className="text-cyan-300/80" />
        <span className="font-hud text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300/80">Focus — what are we working on?</span>
        <span className="flex-1 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {GOALS.map(g => (
          <button key={g.id} onClick={() => pick(g.id)}
            className={`font-hud text-[12px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border transition-colors ${
              sel === g.id
                ? 'bg-cyan-400/15 border-cyan-300/60 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.2)]'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
            }`}>
            {g.label}
          </button>
        ))}
      </div>
      {goal && (
        <div className="hud-panel mt-3 divide-y divide-white/5 fade-up">
          {goal.dests.map(d => (
            <Link key={d.to + d.label} to={d.to}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-cyan-400/[0.05] transition-colors">
              <div className="min-w-0">
                <p className="font-hud font-bold text-sm uppercase tracking-wide text-gray-100">{d.label}</p>
                <p className="text-gray-500 text-xs">{d.why}</p>
              </div>
              <ChevronRight size={16} className="text-cyan-400/70 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
