import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Utensils, Camera, ClipboardList } from 'lucide-react';

const TABS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/training', icon: Dumbbell, label: 'Train' },
  { path: '/food', icon: Utensils, label: 'Fuel' },
  { path: '/physique', icon: Camera, label: 'Body' },
  { path: '/plan', icon: ClipboardList, label: 'Plan' },
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
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
