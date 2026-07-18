import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, ListChecks } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { DATING_CARDS, PHASE_ORDER, PHASE_LABELS } from '../lib/datingContent';

export default function CheatSheet() {
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

  const essential = DATING_CARDS.filter(c => c.cheat_sheet_essential);
  const byPhase = PHASE_ORDER.map(phase => ({
    phase,
    cards: essential.filter(c => c.phase === phase),
  })).filter(g => g.cards.length > 0);

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-pink-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/mind?tab=secret" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Mind
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-pink-500/10 rounded-xl flex items-center justify-center">
            <BookOpen className="text-pink-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Cheat Sheet</h1>
            <p className="text-gray-500 text-sm">Check before you go out — everything, one page</p>
          </div>
        </div>

        {!unlocked ? (
          <div className="fade-up">
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
          <div className="fade-up stagger space-y-3">
            <Link to="/dating"
              className="flex items-center justify-between bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-500/25 rounded-2xl px-5 py-3.5 mb-1 hover:from-pink-500/20 transition-all group press">
              <div className="flex items-center gap-3">
                <ListChecks className="text-pink-400 flex-shrink-0" size={18} />
                <p className="font-bold text-sm">Need the full breakdown? Open Full Reference</p>
              </div>
            </Link>
            {byPhase.map(({ phase, cards }) => (
              <div key={phase} className="bg-[#111] border border-white/8 rounded-2xl p-4">
                <h3 className="font-black text-sm text-pink-300 mb-2.5 uppercase tracking-wide">{PHASE_LABELS[phase]}</h3>
                <ul className="space-y-2">
                  {cards.map(c => (
                    <li key={c.id} className="text-sm text-gray-300 leading-snug flex items-start gap-2">
                      <span className="text-pink-400 mt-1 flex-shrink-0">•</span>
                      <span>{c.short_form}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl px-4 py-3.5">
              <p className="text-xs text-pink-200/80 leading-relaxed">
                This is the fast-scan version. Full breakdowns for every point live in Full Reference above.
              </p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
