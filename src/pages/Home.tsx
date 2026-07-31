import { Link } from 'react-router-dom';
import { Dumbbell, Target, ChevronRight, Zap, Trophy, LayoutDashboard, Swords, Sparkles, Brain, GraduationCap, Map, CircleDot } from 'lucide-react';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { HABITS, loadHabits, todaysItems } from '../components/DailyHabits';
import TomorrowPlan from '../components/TomorrowPlan';
import MorningReminder from '../components/MorningReminder';
import DailyRoutines from '../components/DailyRoutines';
import AccountabilityBot from '../components/AccountabilityBot';
import NotifyPrompt from '../components/NotifyPrompt';



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
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-orange-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-orange-500" size={26} />
          <span className="text-xl font-black tracking-tight">GymForge</span>
        </div>
        <div className="flex items-center gap-3">
          {hasPlan && (
            <Link to="/programs"
              className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors">
              <Dumbbell size={15} /> My Program
            </Link>
          )}
          <Link to="/quiz"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105">
            {hasPlan ? 'Redo Quiz' : 'Start Free'}
          </Link>
        </div>
      </nav>

      {/* Return user banner */}
      {hasPlan && (
        <div className="mx-6 mt-2 max-w-6xl md:mx-auto">
          <Link to="/programs"
            className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-xl px-5 py-3.5 hover:bg-orange-500/15 transition-all group">
            <div className="flex items-center gap-3">
              <Dumbbell className="text-orange-400" size={20} />
              <div>
                <p className="text-orange-300 font-bold text-sm">Welcome back — your plan is ready</p>
                <p className="text-orange-400/60 text-xs">Program · AI Plan · Food Log · Physique</p>
              </div>
            </div>
            <ChevronRight className="text-orange-400 group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>
      )}

      {/* Header */}
      <section className="px-6 pt-10 pb-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-xs text-orange-400 mb-5">
          <Zap size={12} /> Every metric of your life, upgraded
        </div>
        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-2">
          Become <span className="gradient-animate">undeniable.</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          Training, fighting, looks, mindset, football and money — one system.
        </p>
      </section>

      {/* Search */}
      <section className="px-6 pb-5 max-w-4xl mx-auto">
        <SearchBar />
      </section>

      {/* Feed banner */}
      <section className="px-6 pb-3 max-w-4xl mx-auto">
        <Link to="/feed"
          className="flex items-center justify-between bg-gradient-to-r from-purple-500/15 to-pink-500/10 border border-purple-500/25 rounded-2xl px-5 py-4 hover:from-purple-500/20 transition-all group press">
          <div className="flex items-center gap-3">
            <Zap className="text-purple-400 flex-shrink-0" size={20} />
            <div>
              <p className="font-black text-sm">The Feed — scroll & learn</p>
              <p className="text-gray-500 text-xs">Swipeable knowledge cards from every section</p>
            </div>
          </div>
          <ChevronRight size={17} className="text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      </section>

      {/* Know More banner */}
      <section className="px-6 pb-3 max-w-4xl mx-auto">
        <Link to="/knowledge"
          className="flex items-center justify-between bg-gradient-to-r from-sky-500/15 to-cyan-500/10 border border-sky-500/25 rounded-2xl px-5 py-4 hover:from-sky-500/20 transition-all group press">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-sky-400 flex-shrink-0" size={20} />
            <div>
              <p className="font-black text-sm">Know More — today&apos;s lesson</p>
              <p className="text-gray-500 text-xs">World affairs, history, tech &amp; business deals</p>
            </div>
          </div>
          <ChevronRight size={17} className="text-sky-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      </section>

      {/* Journey banner */}
      <section className="px-6 pb-5 max-w-4xl mx-auto">
        <Link to="/journey"
          className="flex items-center justify-between bg-gradient-to-r from-orange-500/15 to-red-500/10 border border-orange-500/25 rounded-2xl px-5 py-4 hover:from-orange-500/20 transition-all group press">
          <div className="flex items-center gap-3">
            <Map className="text-orange-400 flex-shrink-0" size={20} />
            <div>
              <p className="font-black text-sm">The Journey — start here</p>
              <p className="text-gray-500 text-xs">Every phase walked through step by step, with an AI advisor</p>
            </div>
          </div>
          <ChevronRight size={17} className="text-orange-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      </section>

      {/* Notifications opt-in */}
      <section className="px-6 pb-5 max-w-4xl mx-auto">
        <NotifyPrompt />
      </section>

      {/* Accountability bot */}
      <section className="px-6 pb-5 max-w-4xl mx-auto">
        <AccountabilityBot />
      </section>

      {/* Today's habits strip */}
      {habitCounts.length > 0 && (
        <section className="px-6 pb-5 max-w-4xl mx-auto">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold mb-2">Today's reps</p>
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
      <section className="px-6 pb-5 max-w-4xl mx-auto space-y-3">
        <TomorrowPlan />
        <MorningReminder />

        {/* Daily routines — the actual checklist, not just a link */}
        <DailyRoutines />
      </section>

      {/* The sections */}
      <section className="px-6 pb-10 max-w-4xl mx-auto">
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
            { to: '/guide',     icon: Trophy, label: 'The Blueprint', desc: 'Skin · jaw · aura 0→100 · full protocol', color: 'text-amber-400', border: 'hover:border-amber-500/40', bg: 'bg-amber-500/10' },
          ].map(({ to, icon: Icon, label, desc, color, border, bg }) => (
            <Link key={to} to={to}
              className={`bg-gradient-to-br ${bg} to-[#111] border border-white/8 ${border} rounded-2xl p-4 transition-all hover:-translate-y-0.5 group press`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
                <ChevronRight size={15} className="text-gray-700 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-black text-sm mb-0.5">{label}</p>
              <p className="text-gray-600 text-[11px] leading-snug">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick tools */}
        <div className="grid grid-cols-2 gap-3 mt-3">
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
        <section className="px-6 pb-12 max-w-4xl mx-auto">
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

      <footer className="border-t border-white/5 px-6 py-6 text-center text-gray-700 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Dumbbell size={14} className="text-orange-500/40" />
          GymForge © 2026
        </div>
      </footer>
    </main>
  );
}
