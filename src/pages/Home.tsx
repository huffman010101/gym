import { Link } from 'react-router-dom';
import { Dumbbell, Target, ChevronRight, Zap, Trophy, LayoutDashboard, Swords, Sparkles, Brain, GraduationCap, Map, CircleDot , Youtube } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import SearchBar from '../components/SearchBar';
import { HABITS, loadHabits, todaysItems } from '../components/DailyHabits';
import TomorrowPlan from '../components/TomorrowPlan';
import MorningReminder from '../components/MorningReminder';
import DailyRoutines from '../components/DailyRoutines';
import AccountabilityBot from '../components/AccountabilityBot';
import NotifyPrompt from '../components/NotifyPrompt';
import OfflineStatus from '../components/OfflineStatus';
import JarvisHud, { BatMark } from '../components/Jarvis';
import BottomNav from '../components/BottomNav';

function HudLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="font-hud text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300/80">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
    </div>
  );
}



export default function Home() {
  const [hasPlan, setHasPlan] = useState(false);
  const [habitCounts, setHabitCounts] = useState<{ section: string; label: string; done: number; total: number; path: string; color: string }[]>([]);

  useEffect(() => {
    try {
      setHasPlan(!!localStorage.getItem('gymforge_quiz'));
      const paths: Record<string, string> = { mind: '/mind', combat: '/combat', football: '/football', money: '/money', uni: '/uni', padel: '/padel' };
      setHabitCounts(Object.entries(HABITS).map(([section, def]) => {
        const items = todaysItems(section as keyof typeof HABITS);
        const done = items.filter(i => loadHabits(section)[i.id]).length;
        return { section, label: section === 'uni' ? 'Uni' : section[0].toUpperCase() + section.slice(1), done, total: items.length, path: paths[section], color: def.color };
      }));
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-white">
      <JarvisHud />

      {/* Search */}
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <SearchBar />
      </section>

      {/* Intel feeds */}
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <HudLabel>Intel</HudLabel>
        <div className="grid grid-cols-3 gap-2">
          {[
            { to: '/journey', icon: Map, label: 'The Journey', desc: 'Start here', color: 'text-orange-300' },
            { to: '/feed', icon: Zap, label: 'The Feed', desc: 'Scroll & learn', color: 'text-purple-300' },
            { to: '/knowledge', icon: GraduationCap, label: 'Know More', desc: "Today's lesson", color: 'text-sky-300' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to}
              className="hud-panel px-3 py-3 hover:border-cyan-400/40 transition-colors press">
              <Icon size={17} className={color} />
              <p className="font-hud font-bold text-[13px] uppercase tracking-wide mt-2 leading-tight">{label}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Notifications opt-in */}
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <NotifyPrompt />
      </section>

      {/* Accountability bot */}
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <AccountabilityBot />
      </section>

      {/* Today's habits strip */}
      {habitCounts.length > 0 && (
        <section className="px-5 pb-5 max-w-4xl mx-auto">
          <HudLabel>Protocol status</HudLabel>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {habitCounts.map(h => (
              <Link key={h.section} to={h.path}
                className={`flex-shrink-0 flex items-center gap-2 bg-[#111] border rounded-xl px-3.5 py-2 transition-all press ${
                  h.done === h.total ? 'border-emerald-500/40' : 'border-white/8 hover:border-white/20'
                }`}>
                <span className={`text-xs font-bold ${h.color}`}>{h.label}</span>
                <span className={`text-[11px] font-black ${h.done === h.total ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {h.done === h.total ? '✓' : `${h.done}/${h.total}`}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tomorrow planner */}
      <section className="px-5 pb-5 max-w-4xl mx-auto space-y-3">
        <TomorrowPlan />
        <MorningReminder />

        {/* Daily routines — the actual checklist, not just a link */}
        <DailyRoutines />
      </section>

      {/* The sections */}
      <section className="px-5 pb-10 max-w-4xl mx-auto">
        <HudLabel>Operations</HudLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { to: '/programs', icon: Dumbbell, label: 'Gym',      desc: 'Your split · training · physique',    color: 'text-orange-400',  border: 'hover:border-orange-500/40',  bg: 'bg-orange-500/10' },
            { to: '/combat',    icon: Swords,   label: 'Combat',   desc: 'Takedowns · grappling · fight IQ',      color: 'text-red-400',     border: 'hover:border-red-500/40',     bg: 'bg-red-500/10' },
            { to: '/looksmax',  icon: Sparkles, label: 'Looks',    desc: 'AI face scan · style · fragrance',      color: 'text-purple-400',  border: 'hover:border-purple-500/40',  bg: 'bg-purple-500/10' },
            { to: '/mind',      icon: Brain,    label: 'Mind',     desc: 'Charisma · aura · confidence',          color: 'text-pink-400',    border: 'hover:border-pink-500/40',    bg: 'bg-pink-500/10' },
            { to: '/football',  icon: Trophy,   label: 'Football', desc: 'Speed · shooting · position mastery',   color: 'text-emerald-400', border: 'hover:border-emerald-500/40', bg: 'bg-emerald-500/10' },
            { to: '/padel',     icon: CircleDot, label: 'Padel',    desc: 'Technique · strategy · wall play',      color: 'text-sky-400',     border: 'hover:border-sky-500/40',     bg: 'bg-sky-500/10' },
            { to: '/money',     icon: Target,   label: 'Money',    desc: 'Skills · business · investing',         color: 'text-yellow-400',  border: 'hover:border-yellow-500/40',  bg: 'bg-yellow-500/10' },
            { to: '/uni',       icon: GraduationCap, label: 'Uni & Brain', desc: 'AI revision · career · sleep · IQ', color: 'text-sky-400', border: 'hover:border-sky-500/40', bg: 'bg-sky-500/10' },
          ].map(({ to, icon: Icon, label, desc, color, border, bg }) => (
            <Link key={to} to={to}
              className={`hud-frame bg-gradient-to-br ${bg} to-[#0b1017] border border-white/8 ${border} rounded-2xl p-4 transition-all hover:-translate-y-0.5 group press`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
                <ChevronRight size={15} className="text-gray-700 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-hud font-bold text-base uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-gray-600 text-[11px] leading-snug">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick tools */}
        <div className="mt-6"><HudLabel>Gadgets</HudLabel></div>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/looksmax"
            className="flex items-center gap-3 bg-[#111] border border-white/8 hover:border-purple-500/30 rounded-2xl px-4 py-3 transition-all">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-xs">AI Face Scan</p>
              <p className="text-gray-600 text-[10px]">Haircut & style for YOUR face</p>
            </div>
          </Link>
          <Link to="/videonotes"
            className="flex items-center gap-3 bg-[#111] border border-white/8 hover:border-red-500/30 rounded-2xl px-4 py-3 transition-all">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Youtube size={15} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-xs">Video Notes</p>
              <p className="text-gray-600 text-[10px]">Paste a video → keep the substance</p>
            </div>
          </Link>
          <Link to="/quiz"
            className="flex items-center gap-3 bg-[#111] border border-white/8 hover:border-orange-500/30 rounded-2xl px-4 py-3 transition-all">
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target size={15} className="text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-xs">{hasPlan ? 'Redo the Quiz' : 'Build My Plan'}</p>
              <p className="text-gray-600 text-[10px]">2-min quiz → full AI plan</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Plan CTA card (compact) */}
      {!hasPlan && (
        <section className="px-5 pb-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-black text-lg mb-1">Start with your AI plan</h2>
              <p className="text-gray-500 text-sm">Workout split, calories, and a meal rotation tuned to your body and goal. Free, no account, 2 minutes.</p>
            </div>
            <Link to="/quiz"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105">
              Build My Plan <ChevronRight size={17} />
            </Link>
          </div>
        </section>
      )}

      <OfflineStatus />
      <BottomNav />

      <footer className="border-t border-cyan-400/10 px-6 py-6 pb-24 text-center text-gray-700 text-sm">
        <div className="flex items-center justify-center gap-2 font-hud uppercase tracking-[0.25em] text-[11px]">
          <BatMark className="w-7 text-cyan-400/40" />
          Wayne–Stark Systems · GymForge
        </div>
      </footer>
    </main>
  );
}
