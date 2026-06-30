import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { analyzeFoodLog } from '../lib/generators';
import { calcMacros } from '../lib/calculations';
import type { FoodAnalysis, Macros } from '../lib/types';
import { Zap, ArrowLeft, Loader2, ChevronDown, ChevronUp, AlertCircle, Check } from 'lucide-react';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function loadQuiz(): Record<string, unknown> {
  try { return JSON.parse(localStorage.getItem('gymforge_quiz') || '{}'); }
  catch { return {}; }
}

export default function FoodLog() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState('');
  const [targets, setTargets] = useState<Macros | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  useEffect(() => {
    const quiz = loadQuiz();
    if (Object.keys(quiz).length > 0) {
      setTargets(calcMacros(quiz));
    }
    const saved = localStorage.getItem(`gymforge_food_${todayStr()}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { savedInput?: string; savedAnalysis?: FoodAnalysis };
        if (parsed.savedInput) setInput(parsed.savedInput);
        if (parsed.savedAnalysis) setAnalysis(parsed.savedAnalysis);
      } catch { /* ignore */ }
    }
  }, []);

  const handleAnalyse = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const t: Macros = targets ?? { calories: 2500, protein: 180, carbs: 250, fat: 80 };
      const result = await analyzeFoodLog(input, t);
      setAnalysis(result);
      localStorage.setItem(`gymforge_food_${todayStr()}`, JSON.stringify({ savedInput: input, savedAnalysis: result }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Check your API key.');
    }
    setLoading(false);
  };

  const pct = (val: number, target: number) => Math.min(100, Math.round((val / target) * 100));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-6 bg-gradient-to-b from-green-950/30 to-transparent">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={15} className="mr-1" /> Dashboard
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Fuel Log</h1>
        <p className="text-gray-400 text-sm mt-1">Tell me what you've eaten — I'll break it down</p>
        <p className="text-gray-600 text-xs mt-0.5">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="px-4 space-y-4">
        {targets && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { label: 'Calories', val: targets.calories, unit: 'kcal', color: 'text-orange-400' },
              { label: 'Protein', val: targets.protein, unit: 'g', color: 'text-blue-400' },
              { label: 'Carbs', val: targets.carbs, unit: 'g', color: 'text-green-400' },
              { label: 'Fat', val: targets.fat, unit: 'g', color: 'text-yellow-400' },
            ].map(({ label, val, unit, color }) => (
              <div key={label} className="flex-shrink-0 bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-center min-w-[80px]">
                <p className={`text-base font-black ${color}`}>{val}<span className="text-xs ml-0.5 text-gray-500">{unit}</span></p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
          <label className="text-sm font-semibold text-gray-200 mb-2 block">What have you eaten today?</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 3 scrambled eggs with butter, 2 slices wholegrain toast, protein shake with 300ml whole milk, 200g chicken breast, 200g cooked rice, large broccoli..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm leading-relaxed resize-none focus:outline-none focus:border-green-500/50 h-28"
          />
          <button
            onClick={handleAnalyse}
            disabled={loading || !input.trim()}
            className="mt-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Analysing your food...</>
              : <><Zap size={16} /> Analyse My Food</>}
          </button>
          {error && (
            <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
        </div>

        {analysis && (
          <>
            {targets && (
              <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
                <h2 className="font-bold text-lg mb-4">Today vs Targets</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Calories', eaten: analysis.totals.calories, target: targets.calories, bar: 'bg-gradient-to-r from-orange-600 to-orange-400', tc: 'text-orange-400', unit: ' kcal' },
                    { label: 'Protein',  eaten: analysis.totals.protein,  target: targets.protein,  bar: 'bg-gradient-to-r from-blue-600 to-blue-400',   tc: 'text-blue-400',   unit: 'g' },
                    { label: 'Carbs',    eaten: analysis.totals.carbs,    target: targets.carbs,    bar: 'bg-gradient-to-r from-green-600 to-green-400',  tc: 'text-green-400',  unit: 'g' },
                    { label: 'Fat',      eaten: analysis.totals.fat,      target: targets.fat,      bar: 'bg-gradient-to-r from-yellow-600 to-yellow-400', tc: 'text-yellow-400', unit: 'g' },
                  ].map(({ label, eaten, target, bar, tc, unit }) => {
                    const p = pct(eaten, target);
                    const remaining = Math.max(0, target - eaten);
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-300 font-semibold">{label}</span>
                          <span><span className={tc + ' font-bold'}>{eaten}{unit}</span><span className="text-gray-500"> / {target}{unit}</span></span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2.5 mb-1">
                          <div className={`${bar} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${p}%` }} />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className={`font-medium ${p >= 90 ? 'text-green-400' : p >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{p}%</span>
                          {remaining > 0
                            ? <span className="text-gray-500">{remaining}{unit} remaining</span>
                            : <span className="text-green-400 flex items-center gap-0.5"><Check size={10} /> Hit!</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
              <h2 className="font-bold text-lg mb-3">Item Breakdown</h2>
              <div className="space-y-2">
                {analysis.items.map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                    <button
                      onClick={() => setExpandedItem(expandedItem === i ? null : i)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">{item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-orange-400 font-bold text-sm">{item.calories} kcal</span>
                        {expandedItem === i ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </button>
                    {expandedItem === i && (
                      <div className="px-3 pb-3 pt-1 grid grid-cols-3 gap-2">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-center">
                          <p className="text-blue-400 font-bold text-base">{item.protein}g</p>
                          <p className="text-gray-500 text-xs">Protein</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 text-center">
                          <p className="text-green-400 font-bold text-base">{item.carbs}g</p>
                          <p className="text-gray-500 text-xs">Carbs</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 text-center">
                          <p className="text-yellow-400 font-bold text-base">{item.fat}g</p>
                          <p className="text-gray-500 text-xs">Fat</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-gray-400 text-sm font-semibold">Total so far</span>
                <div className="text-right">
                  <span className="text-orange-400 font-black text-lg">{analysis.totals.calories} kcal</span>
                  <p className="text-gray-500 text-xs">{analysis.totals.protein}g P · {analysis.totals.carbs}g C · {analysis.totals.fat}g F</p>
                </div>
              </div>
            </div>

            {analysis.missing.length > 0 && (
              <div className="bg-[#111] rounded-2xl border border-red-500/20 p-4">
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-400" />
                  What's Missing
                </h2>
                <ul className="space-y-2">
                  {analysis.missing.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-red-500/5 rounded-lg px-3 py-2">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                      <span className="text-gray-200">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.tips.length > 0 && (
              <div className="bg-[#111] rounded-2xl border border-green-500/20 p-4">
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap size={18} className="text-green-400" />
                  Hit Your Targets
                </h2>
                <ul className="space-y-2">
                  {analysis.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-green-500/5 rounded-lg px-3 py-2">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">→</span>
                      <span className="text-gray-200">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
