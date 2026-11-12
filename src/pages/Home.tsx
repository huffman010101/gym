import { Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import {
  Dumbbell, Target, ChevronRight, ChevronDown, Trophy, Swords, Sparkles, Brain, GraduationCap, Flame, CircleDot, Youtube, Crosshair, Settings,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AccountabilityBot from '../components/AccountabilityBot';
import OfflineStatus from '../components/OfflineStatus';
import JarvisHud, { BatMark } from '../components/Jarvis';
import BottomNav from '../components/BottomNav';
import FocusMap from '../components/FocusMap';
import DailyPlan from '../components/DailyPlan';
import MindFocus from '../components/MindFocus';
import DailyAffirmation from '../components/DailyAffirmation';
import SyncPanel from '../components/SyncPanel';
import ThemePicker from '../components/ThemePicker';

/*
 * Home is J.A.R.V.I.S., the Mind protocol, your daily plan, and the way into every section.
 * Routines live in Mind; there are no reminders or notifications.
 */

function HudLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="font-hud text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300/80">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
    </div>
  );
}

const SECTIONS = [
  { to: '/programs', icon: Dumbbell, label: 'Gym', desc: 'The plan · training · physique', color: 'text-orange-400', border: 'hover:border-orange-500/40', bg: 'bg-orange-500/10' },
  { to: '/mind', icon: Brain, label: 'Mind', desc: 'Playbook · confidence · discipline', color: 'text-pink-400', border: 'hover:border-pink-500/40', bg: 'bg-pink-500/10' },
  { to: '/looksmax', icon: Sparkles, label: 'Aura', desc: 'Face scan · skin · diet · style', color: 'text-purple-400', border: 'hover:border-purple-500/40', bg: 'bg-purple-500/10' },
  { to: '/money', icon: Target, label: 'Money', desc: 'Skills · business · investing', color: 'text-yellow-400', border: 'hover:border-yellow-500/40', bg: 'bg-yellow-500/10' },
  { to: '/combat', icon: Swords, label: 'Combat', desc: 'Grappling · striking · fight IQ', color: 'text-red-400', border: 'hover:border-red-500/40', bg: 'bg-red-500/10' },
  { to: '/football', icon: Trophy, label: 'Football', desc: 'Speed · shooting · warm-up', color: 'text-emerald-400', border: 'hover:border-emerald-500/40', bg: 'bg-emerald-500/10' },
  { to: '/uni', icon: GraduationCap, label: 'Uni & Brain', desc: 'AI revision · career · sleep', color: 'text-sky-400', border: 'hover:border-sky-500/40', bg: 'bg-sky-500/10' },
  { to: '/padel', icon: CircleDot, label: 'Padel', desc: 'Technique · strategy · walls', color: 'text-sky-300', border: 'hover:border-sky-400/40', bg: 'bg-sky-400/10' },
];

const MORE = [
  { to: '/programs?tab=food', icon: Flame, label: 'Fuel Log', color: 'text-orange-300' },
  { to: '/knowledge', icon: GraduationCap, label: 'Know More', color: 'text-sky-300' },
  { to: '/videonotes', icon: Youtube, label: 'Video Notes', color: 'text-red-300' },
];

export default function Home() {
  const [focusOpen, setFocusOpen] = useState(() => {
    try { return !!localStorage.getItem('gymforge_focus'); } catch { return false; }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-transparent text-white pb-24">
      <JarvisHud />

      {/* Today first: the line to say, the Mind rep, the plan, the check-in */}
      <section className="px-5 pb-4 max-w-4xl mx-auto">
        <DailyAffirmation />
      </section>
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <MindFocus />
      </section>
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <DailyPlan />
      </section>
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <AccountabilityBot />
      </section>

      {/* Then everywhere else */}
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <HudLabel>Sections</HudLabel>
        <div className="mb-3"><SearchBar /></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SECTIONS.map(({ to, icon: Icon, label, desc, color, border, bg }) => (
            <Link key={to} to={to}
              className={`home-tile hud-frame bg-gradient-to-br ${bg} to-[#0b1017] border border-white/8 ${border} rounded-2xl p-4 transition-all hover:-translate-y-0.5 group press`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`home-tile-icon w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
                <ChevronRight size={15} className="text-gray-700 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="home-tile-title font-hud font-bold text-base uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-gray-600 text-[11px] leading-snug">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {MORE.map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to} className="home-more hud-panel flex flex-col items-center gap-1.5 py-3 hover:border-cyan-400/40 transition-colors press">
              <Icon size={17} className={color} />
              <span className="font-hud text-[10px] font-bold uppercase tracking-wide text-gray-300 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Settings and help — sync, theme, "where does X live", offline/update */}
      <section className="px-5 pb-5 max-w-4xl mx-auto">
        <div className="mb-3 empty:hidden"><OfflineStatus alertOnly /></div>
        <button onClick={() => setSettingsOpen(o => !o)} aria-expanded={settingsOpen}
          className="w-full hud-panel flex items-center justify-between px-4 py-3" data-testid="settings-toggle">
          <span className="flex items-center gap-2 font-hud text-[12px] font-bold uppercase tracking-[0.2em] text-cyan-200">
            <Settings size={14} /> Settings &amp; help
          </span>
          <ChevronDown size={16} className={`text-cyan-300 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
        </button>
        {settingsOpen && (
          <div className="mt-3 space-y-3 fade-up">
            <ThemePicker />
            <SyncPanel />
            <button onClick={() => setFocusOpen(o => !o)}
              className="w-full hud-panel flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 font-hud text-[12px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                <Crosshair size={14} /> Where does everything live?
              </span>
              <ChevronDown size={16} className={`text-cyan-300 transition-transform ${focusOpen ? 'rotate-180' : ''}`} />
            </button>
            {focusOpen && <FocusMap />}
            <div className="hud-panel px-3 py-3"><OfflineStatus compact /></div>
          </div>
        )}
      </section>

      <footer className="border-t border-cyan-400/10 px-6 py-6 text-center text-gray-700 text-sm">
        <div className="flex items-center justify-center gap-2 font-hud uppercase tracking-[0.25em] text-[11px]">
          <BatMark className="w-7 text-cyan-400/40" />
          Wayne–Stark Systems · GymForge
        </div>
      </footer>

      <BottomNav />
    </main>
  );
}
