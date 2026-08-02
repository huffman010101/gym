import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Shuffle, Lightbulb, Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { CARDS, CATS, TOTAL, todaysCards, daysToSeeAll, type Card, type Cat } from '../data/knowledge';
import { generateKnowledgeCards } from '../lib/generators';

const PER_DAY = 4;
const readKey = () => `gymforge_knowledge_read_${new Date().toISOString().split('T')[0]}`;

function KnowledgeCard({ c, index, read, onRead }: { c: Card; index: number; read: boolean; onRead: () => void }) {
  const [open, setOpen] = useState(false);
  const meta = CATS[c.cat];

  const toggle = () => {
    setOpen(o => !o);
    if (!open && !read) onRead();
  };

  return (
    <div className={`bg-gradient-to-br ${meta.bg} to-[#111] border ${meta.border} rounded-2xl overflow-hidden transition-all`}>
      <button onClick={toggle} className="w-full text-left px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${meta.color}`}>
            {meta.emoji} {meta.label}
          </span>
          {read && <Check size={14} className="text-emerald-400 flex-shrink-0" />}
        </div>
        <p className="font-black text-gray-100 leading-snug">{c.title}</p>
        {!open && <p className="text-gray-600 text-[11px] mt-1.5">Tap to read · {index + 1} of {PER_DAY}</p>}
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5">
            <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
            <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
              <Lightbulb size={14} className={`${meta.color} flex-shrink-0 mt-0.5`} />
              <p className="text-gray-400 text-sm leading-relaxed italic">{c.twist}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Knowledge() {
  const [extra, setExtra] = useState<Card[]>([]);
  const [filter, setFilter] = useState<Cat | 'all'>('all');
  const [browsing, setBrowsing] = useState(false);
  const [read, setRead] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(readKey()) || '{}') as Record<string, boolean>; }
    catch { return {}; }
  });

  // AI-generated cards persist locally, so the library grows permanently and
  // stays available offline once fetched.
  const [generated, setGenerated] = useState<Card[]>(() => {
    try { return JSON.parse(localStorage.getItem('gymforge_knowledge_generated') || '[]') as Card[]; }
    catch { return []; }
  });
  const [genBusy, setGenBusy] = useState(false);
  const [genErr, setGenErr] = useState('');

  const library = useMemo(() => [...CARDS, ...generated], [generated]);

  const today = useMemo(() => todaysCards(PER_DAY), []);
  const doneCount = today.filter(c => read[c.id]).length;

  const generateMore = async () => {
    setGenBusy(true); setGenErr('');
    try {
      const fresh = await generateKnowledgeCards(
        Object.keys(CATS),
        library.map(c => c.title)
      );
      if (!fresh.length) throw new Error('Nothing came back — try again.');
      const stamped: Card[] = fresh.map((c, i) => ({
        id: `gen_${Date.now()}_${i}`,
        cat: (Object.keys(CATS).includes(c.cat) ? c.cat : 'world') as Cat,
        title: c.title,
        text: c.text,
        twist: c.twist,
      }));
      const next = [...generated, ...stamped];
      setGenerated(next);
      setExtra(e => [...e, ...stamped]);
      try { localStorage.setItem('gymforge_knowledge_generated', JSON.stringify(next)); } catch { /* quota */ }
    } catch (e) {
      setGenErr(e instanceof Error ? e.message : 'Generation failed. Check your API key and connection.');
    }
    setGenBusy(false);
  };

  const markRead = (id: string) => {
    setRead(prev => {
      const next = { ...prev, [id]: true };
      try { localStorage.setItem(readKey(), JSON.stringify(next)); } catch { /* non-critical */ }
      return next;
    });
  };

  const addRandom = () => {
    const pool = library.filter(c => !today.includes(c) && !extra.includes(c));
    if (!pool.length) return;
    setExtra(e => [...e, pool[Math.floor(Math.random() * pool.length)]]);
  };

  const browseList = filter === 'all' ? library : library.filter(c => c.cat === filter);

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-sky-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 bg-sky-500/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-sky-400" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Know More</h1>
            <p className="text-gray-500 text-sm">Something new every day — world, history, tech, business</p>
          </div>
        </div>

        {/* Today's progress */}
        <div className="bg-[#111] border border-white/8 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">Today&apos;s lesson</p>
            <p className="text-sm text-gray-300 font-semibold mt-0.5">
              {doneCount === PER_DAY ? 'All read — come back tomorrow 🔥' : `${doneCount} of ${PER_DAY} read`}
            </p>
          </div>
          <div className="flex gap-1">
            {today.map(c => (
              <span key={c.id} className={`w-2.5 h-2.5 rounded-full ${read[c.id] ? 'bg-emerald-400' : 'bg-white/15'}`} />
            ))}
          </div>
        </div>

        {!browsing && (
          <div className="fade-up stagger space-y-3">
            {today.map((c, i) => (
              <KnowledgeCard key={c.id} c={c} index={i} read={!!read[c.id]} onRead={() => markRead(c.id)} />
            ))}

            {extra.map((c, i) => (
              <KnowledgeCard key={c.id} c={c} index={i} read={!!read[c.id]} onRead={() => markRead(c.id)} />
            ))}

            <button onClick={addRandom}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-sky-500/40 text-gray-500 hover:text-sky-400 py-3 rounded-2xl text-sm font-bold transition-colors">
              <Shuffle size={15} /> One more
            </button>

            <button onClick={generateMore} disabled={genBusy}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white py-3 rounded-2xl text-sm font-bold transition-colors">
              {genBusy
                ? <><Loader2 size={15} className="animate-spin" /> Writing 6 new lessons…</>
                : <><Sparkles size={15} /> Generate 6 brand-new lessons</>}
            </button>
            {genErr && <p className="text-red-400 text-xs flex items-center gap-1.5 px-1"><AlertCircle size={12} /> {genErr}</p>}

            <button onClick={() => setBrowsing(true)}
              className="w-full text-center text-gray-600 hover:text-gray-400 text-xs font-semibold py-2 transition-colors">
              Browse all {library.length} lessons{generated.length > 0 ? ` (${generated.length} generated)` : ` — ${daysToSeeAll(PER_DAY)} days`}
            </button>
          </div>
        )}

        {browsing && (
          <div className="fade-up space-y-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
              <button onClick={() => setFilter('all')}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === 'all' ? 'bg-sky-500 text-white' : 'bg-white/5 text-gray-400'
                }`}>All</button>
              {(Object.keys(CATS) as Cat[]).map(k => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === k ? 'bg-sky-500 text-white' : 'bg-white/5 text-gray-400'
                  }`}>{CATS[k].emoji} {CATS[k].label}</button>
              ))}
            </div>
            {browseList.map((c, i) => (
              <KnowledgeCard key={c.id} c={c} index={i} read={!!read[c.id]} onRead={() => markRead(c.id)} />
            ))}
            <button onClick={() => setBrowsing(false)}
              className="w-full text-center text-gray-600 hover:text-gray-400 text-xs font-semibold py-3 transition-colors">
              Back to today
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
