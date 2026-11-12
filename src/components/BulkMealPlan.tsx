import { useState } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { withMeasure } from '../lib/measures';
import { TARGETS, BREAKFAST, LUNCH, DINNER, SNACKS, SHAKES, EXAMPLE_DAY, EXAMPLE_TOTAL, SHOPPING, type PlanItem } from '../data/bulkPlan';

/* Gym → Lean Bulk → Meal plan: the 3,400 kcal plan, one section at a time. */

const SECTIONS = [
  { id: 'day', label: 'Example day' },
  { id: 'breakfast', label: 'Breakfast', items: BREAKFAST },
  { id: 'lunch', label: 'Lunch', items: LUNCH },
  { id: 'dinner', label: 'Dinner', items: DINNER },
  { id: 'snacks', label: 'Snacks', items: SNACKS },
  { id: 'shakes', label: 'Shakes', items: SHAKES },
  { id: 'shop', label: 'Shopping' },
] as const;
type Sec = typeof SECTIONS[number]['id'];
const ALL = [...BREAKFAST, ...LUNCH, ...DINNER, ...SNACKS, ...SHAKES];

function Macros({ i }: { i: Pick<PlanItem, 'kcal' | 'p' | 'c' | 'f'> }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 text-center">
      {[['kcal', i.kcal], ['Protein', `${i.p}g`], ['Carbs', `${i.c}g`], ['Fat', `${i.f}g`]].map(([k, v]) => (
        <div key={k} className="rounded-lg bg-black/30 py-1.5">
          <p className="text-sm font-bold text-gray-100">{v}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{k}</p>
        </div>
      ))}
    </div>
  );
}

function Item({ i }: { i: PlanItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-gray-100 text-[15px]">{i.name}</span>
          <span className="block text-[11px] text-gray-500 mt-0.5">{i.kcal} kcal · {i.p}g protein · <Clock size={10} className="inline -mt-0.5" /> {i.time}</span>
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <Macros i={i} />
          <ul className="space-y-1">
            {i.ingredients.map(x => <li key={x} className="text-sm text-gray-300 flex gap-2"><span className="text-orange-400">•</span>{withMeasure(x)}</li>)}
          </ul>
          <ol className="space-y-1">
            {i.method.map((m, n) => <li key={n} className="text-sm text-gray-400 flex gap-2"><span className="text-orange-300 font-bold w-4 flex-shrink-0">{n + 1}</span>{m}</li>)}
          </ol>
          <p className="text-xs text-orange-200 bg-orange-500/10 rounded-lg px-3 py-2">Swap: {i.swap}</p>
        </div>
      )}
    </div>
  );
}

export default function BulkMealPlan() {
  const [sec, setSec] = useState<Sec>('day');
  const current = SECTIONS.find(s => s.id === sec)!;
  let run = { kcal: 0, p: 0, c: 0, f: 0 };

  return (
    <div className="space-y-3" data-testid="bulk-meal-plan">
      <div className="bg-[#111] border border-orange-500/30 rounded-2xl p-4">
        <p className="font-black text-orange-300">3,400 kcal lean bulk</p>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {TARGETS.map(([k, v]) => <p key={k} className="text-xs text-gray-400"><span className="text-gray-200 font-semibold">{k}</span> {v}</p>)}
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Grams are raw/dry. Spoon and handful amounts are close enough for daily use; weigh for the first week so your eye learns them.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide" role="tablist">
        {SECTIONS.map(s => (
          <button key={s.id} role="tab" aria-selected={sec === s.id} onClick={() => setSec(s.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${sec === s.id ? 'bg-orange-400/15 border-orange-300/50 text-orange-100' : 'border-white/10 text-gray-500'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {'items' in current && current.items.map(i => <Item key={i.id} i={i} />)}

      {sec === 'day' && (
        <>
          <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="text-gray-500 text-left"><th className="px-3 py-2 font-semibold">Meal</th><th className="py-2 text-right">kcal</th><th className="py-2 text-right">P</th><th className="py-2 text-right">C</th><th className="py-2 pr-3 text-right">F</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {EXAMPLE_DAY.map(id => {
                  const i = ALL.find(x => x.id === id)!;
                  run = { kcal: run.kcal + i.kcal, p: run.p + i.p, c: run.c + i.c, f: run.f + i.f };
                  return (
                    <tr key={id}>
                      <td className="px-3 py-2 text-gray-200">{i.name}<span className="block text-[10px] text-gray-500">Running: {run.kcal.toLocaleString()} kcal · {run.p}g P</span></td>
                      <td className="py-2 text-right text-gray-300">{i.kcal}</td><td className="py-2 text-right text-gray-300">{i.p}</td>
                      <td className="py-2 text-right text-gray-300">{i.c}</td><td className="py-2 pr-3 text-right text-gray-300">{i.f}</td>
                    </tr>
                  );
                })}
                <tr className="font-bold"><td className="px-3 py-2 text-orange-200">Total</td><td className="py-2 text-right text-orange-200">{EXAMPLE_TOTAL.kcal.toLocaleString()}</td><td className="py-2 text-right text-orange-200">{EXAMPLE_TOTAL.p}</td><td className="py-2 text-right text-orange-200">{EXAMPLE_TOTAL.c}</td><td className="py-2 pr-3 text-right text-orange-200">{EXAMPLE_TOTAL.f}</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-gray-500 px-3 py-2 border-t border-white/5">Fibre {EXAMPLE_TOTAL.fibre}g. Every target hit. Take 5g creatine with any meal.</p>
          </div>
          {EXAMPLE_DAY.map(id => <Item key={id} i={ALL.find(x => x.id === id)!} />)}
        </>
      )}

      {sec === 'shop' && (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-gray-500">The example day × 7.</p>
          {SHOPPING.map(([aisle, rows]) => (
            <div key={aisle}>
              <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300/80 mb-1">{aisle}</p>
              {rows.map(([item, amt, buy]) => (
                <div key={item} className="flex items-baseline justify-between gap-3 py-0.5">
                  <span className="text-sm text-gray-200">{item} <span className="text-gray-500 text-xs">· {amt}</span></span>
                  <span className="text-[11px] text-gray-500 text-right">{buy}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
