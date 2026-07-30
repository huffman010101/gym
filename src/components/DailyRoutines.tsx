import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ChevronRight } from 'lucide-react';

/*
 * Compact morning/night reference for the Home page — the six things that
 * matter for each, with no explanation. Full reasoning lives in
 * Mind → Morning/Night Routine; this is the at-a-glance version, because Home
 * is what actually gets looked at every day.
 *
 * Defaults to whichever routine is relevant right now (night from 6pm).
 */
const MORNING = [
  'Same wake time — no snooze',
  'Daylight in your eyes within 30 min',
  'No phone for 30-60 min',
  '500ml water before anything else',
  'Move for 5-10 min',
  'Hardest task first',
];

const NIGHT = [
  'Same bedtime, every night',
  'Screens down 30-60 min before',
  'Phone charges outside the bedroom',
  'No food 2-3h / no coffee 8-10h before',
  'Write tomorrow down',
  'Cool, dark, quiet room',
];

export default function DailyRoutines() {
  const hour = new Date().getHours();
  const [mode, setMode] = useState<'morning' | 'night'>(hour >= 18 || hour < 4 ? 'night' : 'morning');
  const isMorning = mode === 'morning';
  const items = isMorning ? MORNING : NIGHT;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-colors ${
      isMorning ? 'bg-gradient-to-br from-amber-500/10 to-[#111] border-amber-500/30'
                : 'bg-gradient-to-br from-indigo-500/10 to-[#111] border-indigo-500/30'
    }`}>
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">Daily routines</p>
        <div className="flex bg-black/30 rounded-full p-0.5">
          {(['morning', 'night'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                mode === m
                  ? m === 'morning' ? 'bg-amber-500 text-black' : 'bg-indigo-500 text-white'
                  : 'text-gray-500'
              }`}
            >
              {m === 'morning' ? <Sun size={11} /> : <Moon size={11} />}
              {m === 'morning' ? 'Morning' : 'Night'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-3">
        <ul className="space-y-1.5">
          {items.map((x, i) => (
            <li key={x} className="flex gap-2.5 text-[13px] leading-snug">
              <span className={`font-black text-[11px] mt-0.5 w-3 flex-shrink-0 ${
                isMorning ? 'text-amber-400/70' : 'text-indigo-400/70'
              }`}>{i + 1}</span>
              <span className="text-gray-300">{x}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={isMorning ? '/mind?tab=morning' : '/mind?tab=night'}
        className={`flex items-center justify-between px-4 py-2.5 border-t transition-colors ${
          isMorning
            ? 'border-amber-500/20 hover:bg-amber-500/10'
            : 'border-indigo-500/20 hover:bg-indigo-500/10'
        }`}
      >
        <span className={`text-[12px] font-bold ${isMorning ? 'text-amber-300' : 'text-indigo-300'}`}>
          Full routine — timings &amp; why it works
        </span>
        <ChevronRight size={14} className={isMorning ? 'text-amber-400' : 'text-indigo-400'} />
      </Link>
    </div>
  );
}
