import { useState } from 'react';
import { BookOpen, ChevronDown, Quote, AlertTriangle, CheckSquare, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BOOKS, TOP_FIVE } from '../data/bookNotes';
import type { Book } from '../data/bookNotes';

const GROUPS: { key: Book['category']; label: string }[] = [
  { key: 'people', label: 'People & influence' },
  { key: 'habits', label: 'Habits, discipline & mind' },
  { key: 'money', label: 'Money & wealth' },
];

function BookCard({ b }: { b: Book }) {
  const [open, setOpen] = useState(false);
  const [deep, setDeep] = useState(false);

  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="min-w-0">
          <p className="font-bold text-gray-100">{b.title}</p>
          <p className="text-xs text-sky-400/70 mt-0.5">{b.author} · {b.tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">
            {b.takeaways.map(([t, d]) => (
              <div key={t}>
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}

            {/* verdict is short enough to always show */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-sky-300/70 mb-1">Verdict</p>
              <p className="text-gray-400 text-xs leading-relaxed">{b.verdict}</p>
            </div>

            <button
              onClick={() => setDeep(d => !d)}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-colors border ${
                deep ? 'bg-white/5 border-white/15 text-gray-400' : 'bg-sky-500/15 border-sky-500/40 text-sky-200'
              }`}>
              {deep ? 'Hide the full detail' : 'View in full detail'}
            </button>

            {deep && (
              <div className="space-y-3 pt-1 fade-up">
                <div className="bg-gradient-to-br from-sky-500/12 to-transparent border border-sky-500/25 rounded-xl p-3.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-sky-300/70 mb-1.5">The whole argument</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{b.thesis}</p>
                </div>

                {b.deep.map(s => (
                  <div key={s.h} className="border-l-2 border-sky-500/25 pl-3">
                    <p className="font-bold text-sm text-gray-200 mb-0.5">{s.h}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{s.body}</p>
                  </div>
                ))}

                {b.quotes && b.quotes.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3.5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Quote size={11} /> In their words
                    </p>
                    {b.quotes.map(q => (
                      <p key={q} className="text-gray-400 text-xs leading-relaxed italic">&ldquo;{q}&rdquo;</p>
                    ))}
                  </div>
                )}

                <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-red-300/80 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle size={11} /> Where it falls short
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">{b.criticism}</p>
                </div>

                <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300/80 mb-1.5 flex items-center gap-1.5">
                    <CheckSquare size={11} /> Do this week
                  </p>
                  <ul className="space-y-1.5">
                    {b.doThisWeek.map(x => (
                      <li key={x} className="text-gray-300 text-xs leading-relaxed flex gap-2">
                        <span className="text-emerald-400/60 flex-shrink-0">·</span>{x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookNotes() {
  return (
    <div className="fade-up stagger space-y-4">
      <div className="card-premium p-5">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <BookOpen size={16} className="text-sky-400" /> The important bits, without reading 4,000 pages
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Most self-improvement books are one genuinely good idea stretched to 300 pages. Tap any book for the takeaways,
          then <span className="text-sky-300 font-semibold">View in full detail</span> for the whole argument, the
          chapter-level frameworks, where the book falls short, and three things to do this week.
        </p>
        <p className="text-gray-500 text-xs leading-relaxed mt-3">
          A summary is not a substitute for reading the ones that hit — but it tells you which are worth your time, and
          it means you can act on the idea today rather than in three weeks.
        </p>
      </div>

      {GROUPS.map(g => (
        <div key={g.key} className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-300/60 pt-1">{g.label}</p>
          {BOOKS.filter(b => b.category === g.key).map(b => <BookCard key={b.id} b={b} />)}
        </div>
      ))}

      <div className="bg-[#111] border border-sky-500/25 rounded-2xl p-5">
        <h3 className="font-bold text-sky-300 mb-3 flex items-center gap-2">
          <Compass size={15} /> If you only take five things from all of it
        </h3>
        <div className="space-y-2">
          {TOP_FIVE.map(([t, d]) => (
            <div key={t}>
              <p className="font-semibold text-sm text-gray-200">{t}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
        <p className="text-gray-400 text-xs leading-relaxed mb-2">
          Where to apply each of these — the sections that already run on these ideas:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ['/mind?tab=charisma', 'Mind → Charisma'],
            ['/mind?tab=focus', 'Mind → Focus & Discipline'],
            ['/mind?tab=stoic', 'Mind → Stoic'],
            ['/money?tab=invest', 'Money → Investing'],
            ['/uni?tab=smarter', 'Uni → Get Smarter'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="text-[11px] font-bold bg-sky-500/10 border border-sky-500/25 text-sky-200 px-3 py-1.5 rounded-full">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
