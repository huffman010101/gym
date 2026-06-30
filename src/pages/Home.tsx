import { Link } from 'react-router-dom';
import { Dumbbell, Target, Utensils, Mic, ChevronRight, Zap, Shield, Flame, Wind, Heart, Trophy } from 'lucide-react';

const GOALS = [
  { icon: Trophy, label: 'Powerlifting',   color: 'text-yellow-400' },
  { icon: Zap,    label: 'Aesthetic',       color: 'text-blue-400'   },
  { icon: Flame,  label: 'Weight Loss',     color: 'text-red-400'    },
  { icon: Shield, label: 'Combat / Sports', color: 'text-orange-400' },
  { icon: Wind,   label: 'Endurance',       color: 'text-green-400'  },
  { icon: Heart,  label: 'General Fitness', color: 'text-pink-400'   },
];

const HOW = [
  { n: '1', title: 'Quick quiz',        desc: 'Height, weight, age, and your goal — 2 minutes.' },
  { n: '2', title: 'Plan is generated', desc: 'AI builds your workout split and meal rotation tailored to your body.' },
  { n: '3', title: 'Train and eat',     desc: 'Follow your plan. Speak to modify it. Swap meals you don’t like.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-orange-500" size={26} />
          <span className="text-xl font-black tracking-tight">GymForge</span>
        </div>
        <Link to="/quiz"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105">
          Start Free
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-400 mb-8">
          <Zap size={13} /> AI-Powered. Goal-Specific. Yours.
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
          The gym plan<br />
          <span className="gradient-text">built for you.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Answer a short quiz. Get a personalised workout split, daily calorie targets,
          and a meal rotation — all tuned to your body, your goals, and your lifestyle.
        </p>
        <Link to="/quiz"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
          Build My Plan <ChevronRight size={20} />
        </Link>
        <p className="text-gray-600 text-sm mt-4">Free · No account · Takes 2 minutes</p>
      </section>

      {/* Goals */}
      <section className="px-6 py-16 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 text-xs uppercase tracking-widest font-medium mb-8">Plans for every goal</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GOALS.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 bg-[#111] border border-white/5 rounded-xl px-4 py-3 card-hover">
                <Icon size={18} className={color} />
                <span className="text-sm font-medium text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target,   title: 'Precision Planning', desc: 'Built around your exact metrics, goal, and experience. Not a generic template.' },
            { icon: Utensils, title: 'Smart Meals',         desc: 'Calorie & macro targets with a rotating meal plan. Tap X on any meal to see alternatives.' },
            { icon: Mic,      title: 'Voice Control',       desc: 'Speak to swap exercises, change your split, or adjust meals. Real-time AI coach.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111] border border-white/5 rounded-2xl p-6 card-hover">
              <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="text-orange-500" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-[#0d0d0d]">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">How it works</h2>
          <div className="space-y-8">
            {HOW.map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400 font-bold">
                  {n}
                </div>
                <div>
                  <p className="font-bold text-lg mb-0.5">{title}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl font-black mb-4">Ready to start?</h2>
        <p className="text-gray-500 mb-8">Takes 2 minutes. No signup required.</p>
        <Link to="/quiz"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
          Get My Free Plan <ChevronRight size={20} />
        </Link>
      </section>

      <footer className="border-t border-white/5 px-6 py-6 text-center text-gray-700 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Dumbbell size={14} className="text-orange-500/40" />
          GymForge © 2026
        </div>
      </footer>
    </main>
  );
}
