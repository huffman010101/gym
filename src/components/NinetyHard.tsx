import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, RotateCcw, Play } from 'lucide-react';
import { localDate } from './DailyPlan';

/*
 * 90 Hard, built from the app's own pillars. Not a checklist: a day counter
 * from a start date (synced like everything else under gymforge_*), the rules
 * for every day, and the restart rule that makes it hard.
 */

const K = 'gymforge_90hard';
type State = { start: string | null; attempts: number; best: number };

const RULES: { pillar: string; to: string; label: string; items: string[] }[] = [
  { pillar: 'Gym', to: '/programs', label: 'The plan', items: [
    'Two workouts: the day\'s session from the plan, plus 40+ minutes outdoors (walk, run, football or padel). Rest days = two easy walks.',
    'Hit your protein target and eat the meal plan — no takeaway, no alcohol.',
    '3 litres of water.',
    '7.5 hours in bed, same wake time every day.',
  ] },
  { pillar: 'Looks', to: '/looksmax', label: 'Skin & posture', items: [
    'Skincare morning and night, SPF every morning.',
    'The 10-minute posture routine.',
    'A progress photo, same light, same pose.',
  ] },
  { pillar: 'Mind', to: '/mind?tab=notes', label: 'My Notes', items: [
    '10 pages of a real book (non-fiction).',
    '10 minutes of breathwork or meditation.',
    'One social rep: a rejection-therapy rep, a new conversation, or a real compliment.',
    'No porn. Phone out of the bedroom.',
    'One line in the evidence log at night.',
  ] },
  { pillar: 'Uni', to: '/uni', label: 'Uni & Brain', items: [
    'Weekdays: 2 hours of locked-in deep work (use Lock In on Home).',
    'Every lecture and seminar attended.',
    '20 minutes of active recall on the day\'s material — no rereading.',
  ] },
];

function load(): State {
  try { return { start: null, attempts: 0, best: 0, ...JSON.parse(localStorage.getItem(K) || '{}') }; } catch { return { start: null, attempts: 0, best: 0 }; }
}
function daysSince(start: string) {
  const [y, m, d] = start.split('-').map(Number);
  const then = new Date(y, m - 1, d).getTime();
  const [ty, tm, td] = localDate(0).split('-').map(Number);
  const now = new Date(ty, tm - 1, td).getTime();
  return Math.round((now - then) / 864e5) + 1;
}

export default function NinetyHard() {
  const [st, setSt] = useState<State>(load);
  const save = (next: State) => { setSt(next); try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ } };

  const day = st.start ? Math.min(90, daysSince(st.start)) : 0;
  const done = st.start && daysSince(st.start) > 90;
  const start = () => save({ ...st, start: localDate(0), attempts: st.attempts + 1 });
  const restart = () => {
    if (!confirm('Missed a rule? That is the deal — back to Day 1. Restart now?')) return;
    save({ start: localDate(0), attempts: st.attempts + 1, best: Math.max(st.best, day - 1) });
  };

  return (
    <div className="bg-[#111] border border-pink-500/30 rounded-2xl p-5" data-testid="ninety-hard">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-pink-200 flex items-center gap-2"><Flame size={16} /> 90 Hard — your version</h3>
          <p className="text-xs text-gray-500 mt-0.5">Every rule, every day, for 90 days. Miss one and it is back to Day 1.</p>
        </div>
        {st.start && (
          <div className="text-right flex-shrink-0">
            <p className="font-orbitron text-2xl text-pink-200 leading-none" data-testid="ninety-day">{done ? '90' : day}</p>
            <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-gray-500">of 90</p>
          </div>
        )}
      </div>

      {st.start && (
        <div className="h-1.5 rounded-full bg-white/5 mt-3 overflow-hidden">
          <div className="h-full bg-pink-400" style={{ width: `${Math.round(((done ? 90 : day) / 90) * 100)}%` }} />
        </div>
      )}
      {done && <p className="text-sm text-emerald-300 mt-3">Done. Ninety days straight. Keep the habits that stuck — that is who you are now.</p>}

      <div className="mt-4 space-y-3">
        {RULES.map(r => (
          <div key={r.pillar}>
            <div className="flex items-center justify-between">
              <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-pink-300">{r.pillar}</p>
              <Link to={r.to} className="text-[10px] font-hud uppercase tracking-wider text-gray-500 hover:text-pink-300">{r.label} →</Link>
            </div>
            <ul className="mt-1 space-y-1">
              {r.items.map(t => <li key={t} className="text-xs text-gray-300 flex gap-2"><span className="text-pink-400">▸</span>{t}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        {!st.start || done ? (
          <button onClick={start} className="flex-1 rounded-xl py-2.5 font-hud font-bold uppercase tracking-wider text-sm bg-pink-400/15 border border-pink-300/40 text-pink-100 inline-flex items-center justify-center gap-2">
            <Play size={14} /> {done ? 'Go again' : 'Start Day 1 today'}
          </button>
        ) : (
          <button onClick={restart} className="flex-1 rounded-xl py-2.5 font-hud font-bold uppercase tracking-wider text-xs border border-white/10 text-gray-400 inline-flex items-center justify-center gap-2">
            <RotateCcw size={13} /> I missed one — restart
          </button>
        )}
      </div>
      {(st.attempts > 1 || st.best > 0) && <p className="text-[11px] text-gray-600 mt-2">Attempt {st.attempts} · best run {st.best} days</p>}
      <p className="text-[11px] text-gray-600 mt-2">Ill or injured? Swap the workout for a walk and keep everything else — that still counts. Pushing through real illness does not make you harder, it makes you slower.</p>
    </div>
  );
}
