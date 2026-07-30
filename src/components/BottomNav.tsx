import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Swords, Sparkles, Brain } from 'lucide-react';

const TABS = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/programs', icon: Dumbbell, label: 'Gym' },
  { path: '/combat', icon: Swords, label: 'Combat' },
  { path: '/looksmax', icon: Sparkles, label: 'Looks' },
  { path: '/mind', icon: Brain, label: 'Mind' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {TABS.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? 'text-orange-400' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5}
                style={active ? { filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.6))' } : undefined} />
              <span className="text-[10px] font-medium">{label}</span>
              <span className={`h-1 w-1 rounded-full transition-all ${active ? 'bg-orange-400' : 'bg-transparent'}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
