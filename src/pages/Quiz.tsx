import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Dumbbell, Trophy, Zap, Flame, Shield, Wind, Heart } from 'lucide-react';

interface QuizData {
  unit: 'metric' | 'imperial';
  heightCm: string; heightFt: string; heightIn: string;
  weightKg: string; weightLbs: string;
  age: string; gender: string;
  primaryGoal: string; secondaryGoal: string;
  experience: string;
  daysPerWeek: number; sessionLength: string;
  mealsPerDay: number; targetWeight: string;
  dietaryRestrictions: string[]; extraNotes: string;
}

const INITIAL: QuizData = {
  unit: 'metric',
  heightCm: '', heightFt: '', heightIn: '',
  weightKg: '', weightLbs: '',
  age: '', gender: '',
  primaryGoal: '', secondaryGoal: '',
  experience: '',
  daysPerWeek: 4, sessionLength: '60',
  mealsPerDay: 3, targetWeight: '',
  dietaryRestrictions: [], extraNotes: '',
};

const GOALS = [
  { id: 'powerlifting', label: 'Powerlifting',   desc: 'Maximum strength on squat, bench, deadlift',      icon: Trophy, tc: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'aesthetic',    label: 'Aesthetic',       desc: 'Sculpted physique and visible muscle definition',  icon: Zap,    tc: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  { id: 'weight_loss',  label: 'Weight Loss',     desc: 'Burn fat while preserving lean muscle',            icon: Flame,  tc: 'text-red-400',    bg: 'bg-red-500/10'    },
  { id: 'functional',   label: 'Combat / Sports', desc: 'Speed, power, and functional athleticism',         icon: Shield, tc: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'endurance',    label: 'Endurance',       desc: 'Cardio, stamina, and long-distance performance',   icon: Wind,   tc: 'text-green-400',  bg: 'bg-green-500/10'  },
  { id: 'general',      label: 'General Fitness', desc: 'Build a balanced, healthy, capable body',          icon: Heart,  tc: 'text-pink-400',   bg: 'bg-pink-500/10'   },
];

const SUB: Record<string, string[]> = {
  powerlifting: ['Increase my 1RM on all three lifts', 'Peak for an upcoming competition', 'Build raw strength from scratch', 'Improve technique alongside strength'],
  aesthetic:    ['Build bigger arms and shoulders', 'Get a visible six-pack', 'Full body muscle definition', 'V-taper / wide-back physique'],
  weight_loss:  ['Lose weight as fast as possible', 'Steady, sustainable fat loss', 'Maintain muscle while cutting', 'Improve overall body composition'],
  functional:   ['Punch faster and harder', 'Improve grappling and takedown strength', 'Explosive speed and agility', 'Full combat conditioning'],
  endurance:    ['Run a 5K or 10K', 'Train for a marathon', 'Improve VO2 max', 'Cycling or swimming endurance'],
  general:      ['Stay healthy and active', 'Build a solid fitness foundation', 'Tone up overall', 'Move better and feel better'],
};

const DIETS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Halal', 'Kosher', 'Keto'];

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>(INITIAL);
  const nav = useNavigate();
  const TOTAL = 6;

  const set = <K extends keyof QuizData>(f: K, v: QuizData[K]) =>
    setData(p => ({ ...p, [f]: v }));

  const toggleDiet = (v: string) =>
    setData(p => ({
      ...p,
      dietaryRestrictions: p.dietaryRestrictions.includes(v)
        ? p.dietaryRestrictions.filter(x => x !== v)
        : [...p.dietaryRestrictions, v],
    }));

  const canNext = (): boolean => {
    if (step === 1) {
      const sz = data.unit === 'metric' ? !!(data.heightCm && data.weightKg) : !!(data.heightFt && data.weightLbs);
      return !!(data.gender && data.age && sz);
    }
    if (step === 2) return !!data.primaryGoal;
    if (step === 3) return !!data.secondaryGoal;
    if (step === 4) return !!data.experience;
    return true;
  };

  const next = () => {
    if (step < TOTAL) { setStep(s => s + 1); return; }
    localStorage.setItem('gymforge_quiz', JSON.stringify(data));
    nav('/plan');
  };

  const inp = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all';
  const lbl = 'text-sm text-gray-400 mb-2 block';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-orange-500" size={22} />
          <span className="font-black">GymForge</span>
        </div>
        <span className="text-gray-600 text-sm">{step} / {TOTAL}</span>
      </div>

      <div className="h-0.5 bg-white/5">
        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
          style={{ width: `${(step / TOTAL) * 100}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg fade-up" key={step}>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black mb-1">Let’s start with the basics</h2>
              <p className="text-gray-500 mb-8 text-sm">We use these to calculate your exact calorie needs.</p>
              <div className="flex gap-2 mb-6">
                {(['metric', 'imperial'] as const).map(u => (
                  <button key={u} onClick={() => set('unit', u)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${data.unit === u ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-gray-500 hover:border-white/25'}`}>
                    {u === 'metric' ? 'Metric (kg / cm)' : 'Imperial (lbs / ft)'}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} onClick={() => set('gender', g.toLowerCase())}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${data.gender === g.toLowerCase() ? 'bg-orange-500/15 border-orange-500 text-orange-300' : 'border-white/10 text-gray-400 hover:border-white/25'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className={lbl}>Age</label>
                  <input type="number" min="13" max="80" value={data.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 25" className={inp} />
                </div>
                <div><label className={lbl}>Height</label>
                  {data.unit === 'metric'
                    ? <input type="number" value={data.heightCm} onChange={e => set('heightCm', e.target.value)} placeholder="Height in cm (e.g. 178)" className={inp} />
                    : <div className="flex gap-3">
                        <input type="number" value={data.heightFt} min="3" max="8" onChange={e => set('heightFt', e.target.value)} placeholder="ft" className={inp} />
                        <input type="number" value={data.heightIn} min="0" max="11" onChange={e => set('heightIn', e.target.value)} placeholder="in" className={inp} />
                      </div>
                  }
                </div>
                <div><label className={lbl}>Weight</label>
                  {data.unit === 'metric'
                    ? <input type="number" value={data.weightKg} onChange={e => set('weightKg', e.target.value)} placeholder="Weight in kg (e.g. 75)" className={inp} />
                    : <input type="number" value={data.weightLbs} onChange={e => set('weightLbs', e.target.value)} placeholder="Weight in lbs (e.g. 165)" className={inp} />
                  }
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black mb-1">What’s your main goal?</h2>
              <p className="text-gray-500 mb-8 text-sm">This shapes your entire training philosophy.</p>
              <div className="space-y-2.5">
                {GOALS.map(({ id, label, desc, icon: Icon, tc, bg }) => (
                  <button key={id} onClick={() => { set('primaryGoal', id); set('secondaryGoal', ''); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all card-hover ${data.primaryGoal === id ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 hover:border-white/20'}`}>
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${data.primaryGoal === id ? bg : 'bg-white/5'}`}>
                      <Icon size={20} className={data.primaryGoal === id ? tc : 'text-gray-500'} />
                    </div>
                    <div>
                      <p className={`font-semibold ${data.primaryGoal === id ? 'text-white' : 'text-gray-300'}`}>{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black mb-1">Get more specific</h2>
              <p className="text-gray-500 mb-8 text-sm">What outcome are you working towards?</p>
              <div className="space-y-2.5 mb-5">
                {(SUB[data.primaryGoal] || []).map(sg => (
                  <button key={sg} onClick={() => set('secondaryGoal', sg)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${data.secondaryGoal === sg ? 'bg-orange-500/10 border-orange-500 text-orange-300' : 'border-white/10 text-gray-300 hover:border-white/20 hover:text-white'}`}>
                    {sg}
                  </button>
                ))}
              </div>
              <div>
                <label className={lbl}>Or describe your own goal</label>
                <textarea value={(SUB[data.primaryGoal] || []).includes(data.secondaryGoal) ? '' : data.secondaryGoal}
                  onChange={e => set('secondaryGoal', e.target.value)}
                  placeholder="e.g. I want to throw a knockout punch…" rows={3} className={`${inp} resize-none`} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-black mb-1">Your experience level</h2>
              <p className="text-gray-500 mb-8 text-sm">Determines exercise selection and progression speed.</p>
              <div className="space-y-3">
                {[
                  { id: 'beginner',     label: 'Beginner',     desc: 'Less than 1 year of consistent training',         badge: '< 1 year'  },
                  { id: 'intermediate', label: 'Intermediate', desc: '1–3 years — comfortable with the main lifts',      badge: '1–3 years' },
                  { id: 'advanced',     label: 'Advanced',     desc: '3+ years with solid technique and a strong base',  badge: '3+ years'  },
                ].map(({ id, label, desc, badge }) => (
                  <button key={id} onClick={() => set('experience', id)}
                    className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all card-hover ${data.experience === id ? 'bg-orange-500/10 border-orange-500' : 'border-white/10 hover:border-white/20'}`}>
                    <div className="text-left">
                      <p className={`font-bold text-lg ${data.experience === id ? 'text-orange-300' : 'text-white'}`}>{label}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ml-4 ${data.experience === id ? 'border-orange-500/40 text-orange-400' : 'border-white/10 text-gray-600'}`}>{badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-black mb-1">Training schedule</h2>
              <p className="text-gray-500 mb-8 text-sm">How much time can you commit each week?</p>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className={lbl}>Days per week</label>
                  <span className="text-orange-400 font-bold">{data.daysPerWeek} days</span>
                </div>
                <input type="range" min="2" max="7" value={data.daysPerWeek}
                  onChange={e => set('daysPerWeek', Number(e.target.value))} className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs text-gray-600 mt-2 px-0.5">{[2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}</div>
              </div>
              <div>
                <label className={lbl}>Session length</label>
                <div className="grid grid-cols-4 gap-2">
                  {['30','45','60','90'].map(t => (
                    <button key={t} onClick={() => set('sessionLength', t)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${data.sessionLength === t ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/25'}`}>
                      {t} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-black mb-1">Nutrition preferences</h2>
              <p className="text-gray-500 mb-8 text-sm">We’ll build your meal rotation around these.</p>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={lbl}>Meals per day</label>
                    <span className="text-orange-400 font-bold text-sm">{data.mealsPerDay}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[2,3,4,5].map(n => (
                      <button key={n} onClick={() => set('mealsPerDay', n)}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${data.mealsPerDay === n ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/25'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={lbl}>Target weight (optional) — {data.unit === 'metric' ? 'kg' : 'lbs'}</label>
                  <input type="number" value={data.targetWeight} onChange={e => set('targetWeight', e.target.value)}
                    placeholder={data.unit === 'metric' ? 'e.g. 80' : 'e.g. 180'} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Dietary restrictions</label>
                  <div className="flex flex-wrap gap-2">
                    {DIETS.map(d => (
                      <button key={d} onClick={() => toggleDiet(d)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-all ${data.dietaryRestrictions.includes(d) ? 'bg-orange-500/15 border-orange-500 text-orange-300' : 'border-white/10 text-gray-500 hover:border-white/25'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={lbl}>Anything else? (injuries, equipment, allergies)</label>
                  <textarea value={data.extraNotes} onChange={e => set('extraNotes', e.target.value)}
                    placeholder="e.g. Bad lower back, only have dumbbells…" rows={3} className={`${inp} resize-none`} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-5 border-t border-white/5">
        <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
          className="flex items-center gap-1.5 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={next} disabled={!canNext()}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm">
          {step === TOTAL ? 'Build My Plan' : 'Continue'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
