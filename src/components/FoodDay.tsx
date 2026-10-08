import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Clock, Utensils, Repeat, Package, Shuffle, ChefHat } from 'lucide-react';
import { CARBS, FATS, MEALS, PREP_PLANS, PROTEINS, VEG_ROTATION } from '../data/meals';
import type { Food } from '../data/meals';
import { weekKey } from './DailyPlan';

/*
 * The Diet tab's "how to actually eat" layer: the shape of a day scaled to
 * your target, a plate builder that turns any protein/carb/fat into grams,
 * a weekly rotation so dinners are not the same five things, and three meal
 * prep sessions. Numbers are estimates from typical UK supermarket labels.
 */

const K_PLATE = 'gymforge_plate';
const K_ROTATION = 'gymforge_food_rotation';

function load<T>(k: string, f: T): T {
  try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : f; } catch { return f; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } }

const r5 = (n: number) => Math.max(0, Math.round(n / 5) * 5);
const half = (n: number) => {
  const v = Math.max(0.5, Math.round(n * 2) / 2);
  return Number.isInteger(v) ? String(v) : `${Math.floor(v) || ''}½`;
};
const amount = (food: Food, grams: number) =>
  food.unit ? `${grams}g · ≈ ${half(grams / food.unit.grams)} ${food.unit.label}${grams / food.unit.grams > 1.25 ? 's' : ''}` : `${grams}g`;
const byName = (list: Food[], name: string) => list.find(f => f.name === name) ?? list[0];

interface DayMeal { id: string; name: string; when: string; k: number; p: number; idea: string }
const DAY: DayMeal[] = [
  { id: 'breakfast', name: 'Breakfast', when: 'Within an hour of waking', k: 0.25, p: 0.22, idea: 'Oats, eggs or yoghurt, plus a fruit.' },
  { id: 'lunch', name: 'Lunch', when: 'Midday', k: 0.25, p: 0.23, idea: 'The plate: protein, carb, colour, fat.' },
  { id: 'pre', name: 'Pre-training', when: '60-90 min before you train', k: 0.2, p: 0.18, idea: 'Easy carbs and protein: the mass shake, a bagel with eggs, or rice and chicken.' },
  { id: 'dinner', name: 'Dinner', when: 'After training', k: 0.25, p: 0.22, idea: 'Your biggest plate: protein, carb and two veg.' },
  { id: 'bed', name: 'Before bed', when: '30-60 min before sleep', k: 0.05, p: 0.15, idea: 'Greek yoghurt or cottage cheese: slow protein overnight.' },
];

function Panel({ icon, title, sub, open, onToggle, children }: { icon: ReactNode; title: string; sub: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="bg-[#111] border border-emerald-500/20 rounded-2xl">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 p-4 text-left">
        <div className="min-w-0">
          <h3 className="font-bold text-base text-emerald-300 flex items-center gap-2">{icon} {title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
        </div>
        <ChevronDown size={16} className={`text-emerald-300 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 -mt-1">{children}</div>}
    </div>
  );
}

/* ---------- weekly rotation ---------- */

const ROT_PROTEINS = ['Chicken thigh (skinless, raw)', 'Chicken breast (raw)', 'Beef mince 5% (raw)', 'Steak, sirloin (raw)', 'Turkey mince 2% (raw)', 'Cod or haddock (raw)', 'Prawns (cooked)', 'Tofu (firm)'];
const ROT_CARBS = ['Rice (dry weight)', 'Pasta (dry weight)', 'Potatoes (raw)', 'Sweet potato (raw)', 'Egg noodles (dry)', 'Couscous (dry)', 'Quinoa (dry)'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
interface RotDay { protein: string; carb: string; veg: string[] }

function shuffled<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}
function newRotation(): RotDay[] {
  // Salmon twice a week (Wed and Sat) for the omega-3; the rest varies.
  const proteins = shuffled(ROT_PROTEINS).slice(0, 5);
  proteins.splice(2, 0, 'Salmon fillet (raw)');
  proteins.splice(5, 0, 'Salmon fillet (raw)');
  const carbs = shuffled(ROT_CARBS);
  const veg = shuffled(VEG_ROTATION);
  return DAYS.map((_, i) => ({ protein: proteins[i], carb: carbs[i % carbs.length], veg: [veg[(i * 2) % veg.length], veg[(i * 2 + 1) % veg.length]] }));
}
const shortName = (n: string) => n.replace(/\s*\(.*?\)\s*/g, '').replace(/, sirloin/, '');

export default function FoodDay({ target, onOpenRecipe }: { target: { kcal: number; protein: number }; onOpenRecipe: (id: string) => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ day: true });
  const toggle = (k: string) => setOpen(o => ({ ...o, [k]: !o[k] }));

  const [plate, setPlate] = useState(() => load(K_PLATE, { meal: 'lunch', protein: PROTEINS[0].name, carb: CARBS[0].name, fat: FATS[0].name }));
  const updatePlate = (patch: Partial<typeof plate>) => {
    const next = { ...plate, ...patch };
    setPlate(next);
    save(K_PLATE, next);
  };

  const wk = weekKey(new Date());
  const [rotation, setRotation] = useState<{ week: string; days: RotDay[] }>(() => {
    const saved = load<{ week: string; days: RotDay[] } | null>(K_ROTATION, null);
    if (saved && saved.week === wk && saved.days?.length === 7) return saved;
    const fresh = { week: wk, days: newRotation() };
    save(K_ROTATION, fresh);
    return fresh;
  });
  const reshuffle = () => {
    const fresh = { week: wk, days: newRotation() };
    setRotation(fresh);
    save(K_ROTATION, fresh);
  };
  const today = (new Date().getDay() + 6) % 7;

  const [prepId, setPrepId] = useState(PREP_PLANS[0].id);
  const prep = PREP_PLANS.find(p => p.id === prepId) ?? PREP_PLANS[0];

  const meal = DAY.find(d => d.id === plate.meal) ?? DAY[1];
  const mealKcal = Math.round(target.kcal * meal.k);
  const mealProtein = Math.round(target.protein * meal.p);

  // The plate: the protein food carries all but ~6g of the meal's protein,
  // a fat tops it up to ~12g fat, two handfuls of veg ~40 kcal, carbs fill the rest.
  const calc = useMemo(() => {
    const pf = byName(PROTEINS, plate.protein);
    const cf = byName(CARBS, plate.carb);
    const ff = byName(FATS, plate.fat);
    const pNeed = Math.max(10, mealProtein - 6);
    const pg = r5(pNeed / (pf.p / 100));
    const pk = (pg * pf.kcal) / 100;
    const fatLeft = Math.max(0, 12 - (pg * pf.f) / 100);
    const fg = fatLeft < 3 ? 0 : Math.max(5, Math.round(fatLeft / (ff.f / 100)));
    const fk = (fg * ff.kcal) / 100;
    const ck = mealKcal - pk - fk - 40;
    const cg = r5(ck / (cf.kcal / 100));
    const ckReal = (cg * cf.kcal) / 100;
    const total = Math.round(pk + fk + 40 + ckReal);
    const totalP = Math.round((pg * pf.p + cg * cf.p + fg * ff.p) / 100 + 3);
    const carbsG = Math.round((cg * cf.c) / 100);
    return { pf, cf, ff, pg, fg, cg, total, totalP, pNeed, carbsG };
  }, [plate, mealKcal, mealProtein]);

  const select = 'bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-100 outline-none focus:border-emerald-400/50 min-w-0 w-full';
  const mealName = (id: string) => MEALS.find(m => m.id === id)?.name ?? id;

  return (
    <div className="space-y-3">
      {/* ---------- The shape of the day ---------- */}
      <Panel icon={<Clock size={16} />} title="What your day of food looks like" sub={`Scaled to your ${target.kcal} kcal · ${target.protein}g protein target`} open={!!open.day} onToggle={() => toggle('day')}>
        <div className="space-y-1.5">
          {DAY.map(d => (
            <button key={d.id} onClick={() => { updatePlate({ meal: d.id }); setOpen(o => ({ ...o, plate: true })); }}
              className={`w-full text-left rounded-xl px-3 py-2.5 border ${plate.meal === d.id ? 'border-emerald-400/40 bg-emerald-400/[0.06]' : 'border-white/5 bg-black/25'}`}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-gray-100">{d.name} <span className="text-[11px] font-normal text-gray-500">· {d.when}</span></p>
                <span className="text-[11px] text-emerald-200 flex-shrink-0 font-semibold">{Math.round(target.kcal * d.k)} kcal · {Math.round(target.protein * d.p)}g</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{d.idea}</p>
            </button>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-xs text-gray-400">
          <li><span className="text-emerald-300">•</span> Every main meal is the same build: a protein, a carb, a colour, a fat. Tap a meal to get the grams.</li>
          <li><span className="text-emerald-300">•</span> Two fruit and three veg a day, at least one orange or red. 2.5-3 litres of water, more on training days.</li>
          <li><span className="text-emerald-300">•</span> Rest days: same food. A bulk is built on the days you are not training, too.</li>
        </ul>
      </Panel>

      {/* ---------- Plate builder + swaps ---------- */}
      <Panel icon={<Utensils size={16} />} title="Portion sizes and swaps" sub="Pick any protein, carb and fat. It gives you the grams." open={!!open.plate} onToggle={() => toggle('plate')}>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {DAY.map(d => (
            <button key={d.id} onClick={() => updatePlate({ meal: d.id })}
              className={`flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg border ${plate.meal === d.id ? 'border-emerald-300/50 text-emerald-100 bg-emerald-400/10' : 'border-white/10 text-gray-500'}`}>{d.name}</button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">{meal.name} target: <span className="text-emerald-200 font-semibold">{mealKcal} kcal · {mealProtein}g protein</span></p>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <label className="text-[10px] font-hud uppercase tracking-wider text-gray-500 space-y-1">Protein
            <select className={select} value={plate.protein} onChange={e => updatePlate({ protein: e.target.value })}>
              {PROTEINS.map(f => <option key={f.name} value={f.name}>{shortName(f.name)}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-hud uppercase tracking-wider text-gray-500 space-y-1">Carb
            <select className={select} value={plate.carb} onChange={e => updatePlate({ carb: e.target.value })}>
              {CARBS.map(f => <option key={f.name} value={f.name}>{shortName(f.name)}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-hud uppercase tracking-wider text-gray-500 space-y-1">Fat
            <select className={select} value={plate.fat} onChange={e => updatePlate({ fat: e.target.value })}>
              {FATS.map(f => <option key={f.name} value={f.name}>{shortName(f.name)}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-3 rounded-xl bg-black/30 border border-emerald-400/20 divide-y divide-white/5" data-testid="plate">
          {[
            ['Protein', calc.pf.name, amount(calc.pf, calc.pg)],
            ['Carb', calc.cf.name, calc.cg ? amount(calc.cf, calc.cg) : 'Skip — the protein covers it'],
            ['Colour', 'Veg', '2 big handfuls (~160g)'],
            ['Fat', calc.ff.name, calc.fg ? amount(calc.ff, calc.fg) : 'None needed — the protein brings it'],
          ].map(([role, name, amt]) => (
            <div key={role} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-gray-500">{role}</p>
                <p className="text-xs text-gray-300 truncate">{name}</p>
              </div>
              <p className="text-sm font-semibold text-emerald-100 text-right flex-shrink-0">{amt}</p>
            </div>
          ))}
          <p className="px-3 py-2 text-[11px] text-gray-400">Comes to ≈ <span className="text-gray-200">{calc.total} kcal · {calc.totalP}g protein · {calc.carbsG}g carbs</span>. Weigh raw or dry, once — after a week you will know it by eye.</p>
        </div>
        {(calc.pf.note || calc.cf.note) && <p className="text-[11px] text-emerald-200/80 mt-1.5">{[calc.pf.note, calc.cf.note].filter(Boolean).join(' · ')}</p>}

        <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-4 mb-1.5 flex items-center gap-1.5"><Repeat size={12} /> Swap the protein — {calc.pNeed}g is</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {PROTEINS.map(f => {
            const g = r5(calc.pNeed / (f.p / 100));
            return (
              <button key={f.name} onClick={() => updatePlate({ protein: f.name })}
                className={`flex justify-between gap-2 text-left text-xs rounded-lg px-2.5 py-1.5 ${f.name === plate.protein ? 'bg-emerald-400/10 text-emerald-100' : 'bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]'}`}>
                <span className="truncate">{shortName(f.name)}</span>
                <span className="text-gray-400 flex-shrink-0">{amount(f, g)} · {Math.round((g * f.kcal) / 100)} kcal</span>
              </button>
            );
          })}
        </div>

        {calc.cg > 0 && (
          <>
            <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-4 mb-1.5 flex items-center gap-1.5"><Repeat size={12} /> Swap the carb — {calc.carbsG}g carbs is</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {CARBS.map(f => {
                const g = r5(calc.carbsG / (f.c / 100));
                return (
                  <button key={f.name} onClick={() => updatePlate({ carb: f.name })}
                    className={`flex justify-between gap-2 text-left text-xs rounded-lg px-2.5 py-1.5 ${f.name === plate.carb ? 'bg-emerald-400/10 text-emerald-100' : 'bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]'}`}>
                    <span className="truncate">{shortName(f.name)}</span>
                    <span className="text-gray-400 flex-shrink-0">{amount(f, g)}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Panel>

      {/* ---------- Weekly rotation ---------- */}
      <Panel icon={<Shuffle size={16} />} title="This week's rotation" sub="Seven different dinners, salmon twice. Tap a day for its portions." open={!!open.rot} onToggle={() => toggle('rot')}>
        <div className="space-y-1">
          {rotation.days.map((d, i) => (
            <button key={DAYS[i]} onClick={() => { updatePlate({ meal: 'dinner', protein: d.protein, carb: d.carb }); setOpen(o => ({ ...o, plate: true })); }}
              className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-3 ${i === today ? 'bg-emerald-400/10 border border-emerald-400/30' : 'bg-black/25 border border-transparent hover:border-white/10'}`}>
              <span className={`font-hud text-[11px] font-bold uppercase w-8 flex-shrink-0 ${i === today ? 'text-emerald-300' : 'text-gray-500'}`}>{DAYS[i]}</span>
              <span className="text-xs text-gray-200 min-w-0">{shortName(d.protein)} · {shortName(d.carb)} · <span className="text-gray-400">{d.veg.join(' + ')}</span></span>
            </button>
          ))}
        </div>
        <button onClick={reshuffle} className="mt-2.5 w-full rounded-xl py-2 text-xs font-hud font-bold uppercase tracking-wider border border-emerald-300/30 text-emerald-200 inline-flex items-center justify-center gap-2">
          <Shuffle size={13} /> New rotation
        </button>
        <p className="text-[11px] text-gray-500 mt-2">A new one is drawn each Monday. Same build every night, different food — that is how you hit 30 different plants a week without thinking about it.</p>
      </Panel>

      {/* ---------- Meal prep ---------- */}
      <Panel icon={<Package size={16} />} title="Meal prep plans" sub="One session on Sunday, the week is done." open={!!open.prep} onToggle={() => toggle('prep')}>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {PREP_PLANS.map(p => (
            <button key={p.id} onClick={() => setPrepId(p.id)}
              className={`flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg border ${prepId === p.id ? 'border-emerald-300/50 text-emerald-100 bg-emerald-400/10' : 'border-white/10 text-gray-500'}`}>{p.name}</button>
          ))}
        </div>
        <div className="mt-2.5">
          <p className="text-sm font-semibold text-gray-100">{prep.tagline}</p>
          <p className="text-[11px] text-gray-500">{prep.makes} · {prep.time}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {prep.recipeIds.map(id => (
              <button key={id} onClick={() => onOpenRecipe(id)} className="text-[11px] px-2 py-1 rounded-lg border border-yellow-400/30 text-yellow-100 inline-flex items-center gap-1">
                <ChefHat size={11} /> {mealName(id)}
              </button>
            ))}
          </div>

          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-3 mb-1">Shopping list</p>
          <ul className="space-y-0.5">{prep.shopping.map(s => <li key={s} className="text-xs text-gray-300 flex gap-2"><span className="text-emerald-400">•</span>{s}</li>)}</ul>

          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-3 mb-1">The session</p>
          <ol className="space-y-1.5">{prep.steps.map(([t, s]) => (
            <li key={t} className="text-xs text-gray-300 flex gap-2.5"><span className="font-orbitron text-emerald-300 text-[11px] w-9 flex-shrink-0 mt-px">{t}</span>{s}</li>
          ))}</ol>

          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-3 mb-1">Keeping it safe</p>
          <ul className="space-y-1">{prep.storage.map(s => <li key={s} className="text-xs text-amber-100/80 border-l-2 border-amber-400/40 pl-2.5">{s}</li>)}</ul>
        </div>
      </Panel>
    </div>
  );
}
