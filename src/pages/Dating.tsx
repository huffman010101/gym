import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, BookOpen, ChevronDown, ListChecks } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { DATING_CARDS, CATEGORY_ORDER, PHASE_LABELS, type DatingCard } from '../lib/datingContent';

function CardRow({ card }: { card: DatingCard }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 leading-snug">{card.short_form}</p>
          <p className="text-[10px] text-pink-400/60 font-bold uppercase tracking-wide mt-1">{PHASE_LABELS[card.phase]}</p>
        </div>
        <ChevronDown size={15} className={`text-gray-600 flex-shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-4 pb-3.5">
            <p className="text-gray-500 text-sm leading-relaxed">{card.long_form}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dating() {
  const [pw, setPw] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem('gymforge_secret_unlocked') === '1'); } catch {}
  }, []);

  const tryUnlock = () => {
    if (pw.trim().toLowerCase() === 'roy') {
      setUnlocked(true);
      try { localStorage.setItem('gymforge_secret_unlocked', '1'); } catch {}
    } else {
      setPw('');
    }
  };

  const byCategory = CATEGORY_ORDER.map(cat => ({
    category: cat,
    cards: DATING_CARDS.filter(c => c.category === cat),
  })).filter(g => g.cards.length > 0);

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-pink-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/mind?tab=secret" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Mind
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-pink-500/10 rounded-xl flex items-center justify-center">
            <ListChecks className="text-pink-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Dating — Full Reference</h1>
            <p className="text-gray-500 text-sm">Every principle, by category — tap to expand</p>
          </div>
        </div>

        {unlocked && (
          <Link to="/cheatsheet"
            className="flex items-center justify-between bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-500/25 rounded-2xl px-5 py-3.5 mt-4 mb-2 hover:from-pink-500/20 transition-all group press">
            <div className="flex items-center gap-3">
              <BookOpen className="text-pink-400 flex-shrink-0" size={18} />
              <p className="font-bold text-sm">Prefer the fast version? Open the Cheat Sheet</p>
            </div>
          </Link>
        )}

        {!unlocked ? (
          <div className="fade-up mt-6">
            <div className="card-premium p-8 text-center">
              <Lock size={28} className="text-pink-400 mx-auto mb-4" />
              <h3 className="font-black text-lg mb-1">Members Only</h3>
              <p className="text-gray-500 text-sm mb-6">This page is password-protected.</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryUnlock()}
                  placeholder="Password"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500/50"
                />
                <button onClick={tryUnlock}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fade-up stagger space-y-6 mt-4">
            {byCategory.map(({ category, cards }) => (
              <div key={category}>
                <h2 className="text-sm font-black text-pink-300 mb-2.5 uppercase tracking-wide">{category}</h2>
                <div className="space-y-2">
                  {cards.map(card => <CardRow key={card.id} card={card} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
