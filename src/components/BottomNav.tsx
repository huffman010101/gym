import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Swords, Sparkles, Brain } from 'lucide-react';

const TABS = [
  { path: '/', icon: LayoutDashboard, label: 'Command' },
  { path: '/programs', icon: Dumbbell, label: 'Gym' },
  { path: '/combat', icon: Swords, label: 'Combat' },
  { path: '/looksmax', icon: Sparkles, label: 'Looks' },
  { path: '/mind', icon: Brain, label: 'Mind' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#04060a]/92 backdrop-blur border-t border-cyan-400/15"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* reactor-line along the top edge */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {TABS.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? 'text-cyan-300' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {active && <span className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-cyan-400/[0.07] border border-cyan-400/20" />}
              <Icon size={20} strokeWidth={active ? 2.3 : 1.5} className="relative"
                style={active ? { filter: 'drop-shadow(0 0 7px rgba(34,211,238,0.8))' } : undefined} />
              <span className="relative font-hud text-[10px] font-bold uppercase tracking-[0.14em]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
