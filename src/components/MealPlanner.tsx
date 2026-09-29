import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChefHat, Shuffle, Repeat, X, Clock, Flame, Beef, Sparkles, Loader2, AlertCircle, Search, Trash2, Leaf } from 'lucide-react';
import { MEALS, SLOT_LABEL, LOOKS_FOODS } from '../data/meals';
import type { Meal, Slot } from '../data/meals';
import { generateRecipe, explainFailure } from '../lib/generators';

/*
 * The Diet tab's planner: a day of meals you can swap slot by slot, every
 * recipe written out properly, and an AI chef for anything not in the book.
 */

const K_PLAN = 'gymforge_meal_plan';
const K_TARGET = 'gymforge_meal_target';
const K_CUSTOM = 'gymforge_custom_meals';

const PLAN_SLOTS: { key: string; slot: Slot }[] = [
  { key: 'breakfast', slot: 'breakfast' },
  { key: 'lunch', slot: 'lunch' },
  { key: 'snack', slot: 'snack' },
  { key: 'dinner', slot: 'dinner' },
];
const DEFAULT_PLAN: Record<string, string> = {
  breakfast: 'oats-loaded', lunch: 'chicken-rice-bowl', snack: 'mass-shake', dinner: 'steak-sweet-potato',
};
const TAGS = ['Gain', 'Skin', 'Quick', 'Batch', 'Lean', 'Dairy-free'];

function load<T>(k: string, f: T): T {
  try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : f; } catch { return f; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } }

const TAG_STYLE: Record<string, string> = {
  Gain: 'text-orange-300 border-orange-400/30', Skin: 'text-emerald-300 border-emerald-400/30',
  Quick: 'text-sky-300 border-sky-400/30', Batch: 'text-purple-300 border-purple-400/30',
  Lean: 'text-cyan-300 border-cyan-400/30', 'Dairy-free': 'text-yellow-200 border-yellow-400/30',
};
function Tag({ t }: { t: string }) {
  return <span className={`text-[9px] font-hud font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${TAG_STYLE[t] ?? 'text-gray-400 border-white/15'}`}>{t}</span>;
}

function RecipeView({ meal, onClose, onUse, onDelete }: { meal: Meal; onClose: () => void; onUse?: () => void; onDelete?: () => void }) {
  // Portal to <body>: the page's animated (transformed) wrappers would
  // otherwise trap position:fixed and push the sheet off-screen.
  return createPortal(
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto bg-[#0a0f16] border border-emerald-400/25 rounded-t-3xl sm:rounded-3xl p-5 pb-24 sm:pb-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-hud text-[10px] uppercase tracking-[0.25em] text-emerald-400/80">{SLOT_LABEL[meal.slot]}{meal.custom ? ' · AI chef' : ''}</p>
            <h3 className="text-xl font-bold text-white leading-snug mt-0.5">{meal.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
          <span><Flame size={12} className="inline text-orange-400 -mt-0.5" /> ~{meal.kcal} kcal</span>
          <span><Beef size={12} className="inline text-red-300 -mt-0.5" /> {meal.protein}g protein</span>
          <span><Clock size={12} className="inline -mt-0.5" /> {meal.mins} min</span>
          <span className="flex gap-1">{meal.tags.map(t => <Tag key={t} t={t} />)}</span>
        </div>
        {meal.looks && <p className="mt-3 text-xs text-emerald-200/90 bg-emerald-400/[0.06] border border-emerald-400/20 rounded-lg px-3 py-2"><Sparkles size={11} className="inline mr-1 -mt-0.5" />{meal.looks}</p>}

        <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-4 mb-1.5">Ingredients</p>
        <ul className="space-y-1">{meal.ingredients.map((x, i) => <li key={i} className="text-sm text-gray-300 flex gap-2"><span className="text-emerald-400">•</span>{x}</li>)}</ul>

        <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-4 mb-1.5">Method</p>
        <ol className="space-y-2">{meal.steps.map((x, i) => (
          <li key={i} className="text-sm text-gray-300 flex gap-2.5"><span className="font-orbitron text-emerald-300 text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>{x}</li>
        ))}</ol>

        {meal.season && (
          <>
            <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-4 mb-1.5">Seasoning</p>
            <p className="text-sm text-gray-300 border-l-2 border-yellow-400/50 pl-3">{meal.season}</p>
          </>
        )}
        {meal.chef.length > 0 && (
          <>
            <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-4 mb-1.5 flex items-center gap-1.5"><ChefHat size={12} /> Chef's upgrades</p>
            <ul className="space-y-1.5">{meal.chef.map((x, i) => <li key={i} className="text-sm text-gray-300 flex gap-2"><span className="text-yellow-300">★</span>{x}</li>)}</ul>
          </>
        )}
        <div className="flex gap-2 mt-5">
          {onUse && <button onClick={onUse} className="flex-1 rounded-xl py-2.5 font-hud font-bold uppercase tracking-wider text-sm bg-emerald-400/15 border border-emerald-300/40 text-emerald-100">Use in my plan</button>}
          {onDelete && <button onClick={onDelete} className="rounded-xl px-3 border border-white/10 text-gray-500 hover:text-red-300" aria-label="Delete recipe"><Trash2 size={15} /></button>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function MealPlanner() {
  const [custom, setCustom] = useState<Meal[]>(() => load<Meal[]>(K_CUSTOM, []));
  const all = useMemo(() => [...MEALS, ...custom], [custom]);
  const byId = (id: string) => all.find(m => m.id === id);

  const [plan, setPlan] = useState<Record<string, string>>(() => ({ ...DEFAULT_PLAN, ...load<Record<string, string>>(K_PLAN, {}) }));
  const [target, setTarget] = useState<{ kcal: number; protein: number }>(() => load(K_TARGET, { kcal: 3000, protein: 170 }));
  const [view, setView] = useState<Meal | null>(null);
  const [viewSlotKey, setViewSlotKey] = useState<string | null>(null);
  const [swapKey, setSwapKey] = useState<string | null>(null);
  const [tag, setTag] = useState('');
  const [browseSlot, setBrowseSlot] = useState<Slot | ''>('');
  const [search, setSearch] = useState('');

  const [req, setReq] = useState('');
  const [reqSlot, setReqSlot] = useState<Slot>('dinner');
  const [cooking, setCooking] = useState(false);
  const [chefErr, setChefErr] = useState('');
  const [foodGroup, setFoodGroup] = useState('All');

  const setSlot = (key: string, id: string) => {
    const next = { ...plan, [key]: id };
    setPlan(next);
    save(K_PLAN, next);
  };
  const shuffle = (key: string, slot: Slot) => {
    const options = all.filter(m => m.slot === slot && m.id !== plan[key] && (!tag || m.tags.includes(tag)));
    if (options.length) setSlot(key, options[Math.floor(Math.random() * options.length)].id);
  };
  const updateTarget = (k: 'kcal' | 'protein', v: string) => {
    const next = { ...target, [k]: Math.max(0, parseInt(v || '0', 10) || 0) };
    setTarget(next);
    save(K_TARGET, next);
  };

  const planned = PLAN_SLOTS.map(p => ({ ...p, meal: byId(plan[p.key]) }));
  const kcal = planned.reduce((a, p) => a + (p.meal?.kcal ?? 0), 0);
  const protein = planned.reduce((a, p) => a + (p.meal?.protein ?? 0), 0);
  const pct = (v: number, t: number) => (t ? Math.min(100, Math.round((v / t) * 100)) : 0);

  const browse = all.filter(m =>
    (!browseSlot || m.slot === browseSlot) &&
    (!tag || m.tags.includes(tag)) &&
    (!search.trim() || (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes(search.toLowerCase())));

  const cook = async () => {
    if (!req.trim()) return;
    setCooking(true);
    setChefErr('');
    try {
      let goal = '';
      try { goal = (JSON.parse(localStorage.getItem('gymforge_face_intake') || '{}') as { bodyGoal?: string }).bodyGoal ?? ''; } catch { /* ignore */ }
      const meal = await generateRecipe(req.trim(), reqSlot, goal);
      const next = [meal, ...custom].slice(0, 40);
      setCustom(next);
      save(K_CUSTOM, next);
      setReq('');
      setView(meal);
      setViewSlotKey(null);
    } catch (e) {
      setChefErr(explainFailure(e));
    }
    setCooking(false);
  };

  const input = 'bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-gray-100 outline-none focus:border-emerald-400/50';

  return (
    <div className="space-y-3">
      {/* ---------- Today's plan ---------- */}
      <div className="bg-[#111] border border-emerald-500/25 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-bold text-base text-emerald-300">Today's plan</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            Target
            <input className={input + ' w-16 text-center py-1'} inputMode="numeric" value={target.kcal} onChange={e => updateTarget('kcal', e.target.value)} aria-label="Calorie target" />kcal
            <input className={input + ' w-12 text-center py-1'} inputMode="numeric" value={target.protein} onChange={e => updateTarget('protein', e.target.value)} aria-label="Protein target" />g
          </div>
        </div>

        <div className="space-y-2">
          {planned.map(({ key, slot, meal }) => (
            <div key={key} className="rounded-xl bg-black/30 border border-white/8 p-3">
              <div className="flex items-start justify-between gap-2">
                <button className="text-left min-w-0" onClick={() => { if (meal) { setView(meal); setViewSlotKey(null); } }}>
                  <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-gray-500">{SLOT_LABEL[slot]}</p>
                  <p className="text-sm font-semibold text-gray-100 leading-snug">{meal?.name ?? 'Pick a meal'}</p>
                  {meal && <p className="text-[11px] text-gray-500 mt-0.5">~{meal.kcal} kcal · {meal.protein}g protein · {meal.mins} min · <span className="text-emerald-300">tap for the recipe</span></p>}
                </button>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => shuffle(key, slot)} className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-emerald-300" title="Random swap"><Shuffle size={14} /></button>
                  <button onClick={() => setSwapKey(swapKey === key ? null : key)} className={`p-2 rounded-lg border ${swapKey === key ? 'border-emerald-300/60 text-emerald-200' : 'border-white/10 text-gray-400 hover:text-emerald-300'}`} title="Choose a swap"><Repeat size={14} /></button>
                </div>
              </div>
              {swapKey === key && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1.5">
                  {all.filter(m => m.slot === slot).map(m => (
                    <button key={m.id} onClick={() => { setSlot(key, m.id); setSwapKey(null); }}
                      className={`w-full text-left rounded-lg px-2.5 py-2 flex items-center justify-between gap-2 ${m.id === plan[key] ? 'bg-emerald-400/10 border border-emerald-400/30' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                      <span className="text-xs text-gray-200">{m.name}{m.custom ? ' ✦' : ''}</span>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">{m.kcal} kcal · {m.protein}g</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: 'Calories', v: kcal, t: target.kcal, unit: 'kcal', bar: 'bg-orange-400' },
            { label: 'Protein', v: protein, t: target.protein, unit: 'g', bar: 'bg-red-400' },
          ].map(x => (
            <div key={x.label}>
              <div className="flex justify-between text-[11px] text-gray-400"><span>{x.label}</span><span>{x.v} / {x.t}{x.unit}</span></div>
              <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden"><div className={`h-full ${x.bar}`} style={{ width: `${pct(x.v, x.t)}%` }} /></div>
            </div>
          ))}
        </div>
        {kcal < target.kcal - 150 && (
          <p className="text-[11px] text-amber-300/90 mt-2">{target.kcal - kcal} kcal short — swap the snack for the 1000 kcal shake, or add a second snack.</p>
        )}
      </div>

      {/* ---------- AI chef ---------- */}
      <div className="bg-[#111] border border-yellow-400/20 rounded-2xl p-4">
        <h3 className="font-bold text-base text-yellow-200 flex items-center gap-2"><ChefHat size={17} /> Ask the chef</h3>
        <p className="text-xs text-gray-500 mt-1 mb-3">Anything not in the book: "high-protein pasta, no dairy", "something with salmon under 20 minutes", "a curry that tastes like the takeaway". Full method, seasoning and upgrades, saved to your recipes.</p>
        <div className="flex gap-2">
          <select value={reqSlot} onChange={e => setReqSlot(e.target.value as Slot)} className={input}>
            {(Object.keys(SLOT_LABEL) as Slot[]).map(s => <option key={s} value={s}>{SLOT_LABEL[s]}</option>)}
          </select>
          <input value={req} onChange={e => setReq(e.target.value)} onKeyDown={e => e.key === 'Enter' && cook()} placeholder="What do you fancy?" className={input + ' flex-1 min-w-0'} />
        </div>
        <button onClick={cook} disabled={!req.trim() || cooking}
          className="mt-2 w-full rounded-xl py-2.5 font-hud font-bold uppercase tracking-wider text-sm bg-yellow-400/10 border border-yellow-300/40 text-yellow-100 disabled:opacity-35 inline-flex items-center justify-center gap-2">
          {cooking ? <><Loader2 size={15} className="animate-spin" /> Writing your recipe…</> : <><ChefHat size={15} /> Write me a recipe</>}
        </button>
        {chefErr && <p className="mt-2 text-xs text-red-300 flex gap-1.5"><AlertCircle size={13} className="flex-shrink-0 mt-0.5" />{chefErr}</p>}
      </div>

      {/* ---------- Recipe book ---------- */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
        <h3 className="font-bold text-base mb-2.5">The recipe book <span className="text-gray-600 font-normal text-sm">· {all.length}</span></h3>
        <div className="flex items-center gap-2 mb-2">
          <Search size={14} className="text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search a dish or ingredient…" className="flex-1 bg-transparent text-sm outline-none placeholder-gray-600" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {(['', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map(s => (
            <button key={s || 'all'} onClick={() => setBrowseSlot(s)}
              className={`flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg border ${browseSlot === s ? 'border-emerald-300/50 text-emerald-100 bg-emerald-400/10' : 'border-white/10 text-gray-500'}`}>
              {s ? SLOT_LABEL[s] : 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 mt-1">
          {TAGS.map(t => (
            <button key={t} onClick={() => setTag(tag === t ? '' : t)}
              className={`flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg border ${tag === t ? 'border-emerald-300/50 text-emerald-100 bg-emerald-400/10' : 'border-white/10 text-gray-500'}`}>{t}</button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-1.5">
          {browse.map(m => (
            <button key={m.id} onClick={() => { setView(m); setViewSlotKey(null); }}
              className="text-left rounded-xl bg-black/25 border border-white/5 hover:border-emerald-400/30 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-100">{m.name}{m.custom ? <span className="text-yellow-300"> ✦</span> : ''}</p>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{m.kcal} kcal · {m.protein}g</span>
              </div>
              <div className="flex gap-1 mt-1">{m.tags.map(t => <Tag key={t} t={t} />)}</div>
            </button>
          ))}
          {browse.length === 0 && <p className="text-xs text-gray-600 py-3 text-center">Nothing matches — ask the chef above.</p>}
        </div>
      </div>

      {/* ---------- Looks foods ---------- */}
      <div className="bg-[#111] border border-emerald-500/20 rounded-2xl p-4">
        <h3 className="font-bold text-base text-emerald-300 flex items-center gap-2"><Leaf size={16} /> Foods that make you look better</h3>
        <p className="text-xs text-gray-500 mt-1 mb-2.5">Rated on how good the evidence actually is. None of it replaces SPF, sleep or a routine — it stacks on top.</p>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {['All', ...Array.from(new Set(LOOKS_FOODS.map(f => f.group)))].map(g => (
            <button key={g} onClick={() => setFoodGroup(g)}
              className={`flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg border ${foodGroup === g ? 'border-emerald-300/50 text-emerald-100 bg-emerald-400/10' : 'border-white/10 text-gray-500'}`}>{g}</button>
          ))}
        </div>
        <div className="mt-2 space-y-1.5">
          {LOOKS_FOODS.filter(f => foodGroup === 'All' || f.group === foodGroup).map(f => (
            <div key={f.name} className="rounded-lg bg-black/25 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-100">{f.name}</p>
                <span className={`text-[9px] font-hud font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                  f.evidence === 'Strong' || f.evidence === 'Good' ? 'text-emerald-300 border-emerald-400/30' : f.evidence === 'Some' ? 'text-amber-300 border-amber-400/30' : 'text-gray-500 border-white/15'}`}>{f.evidence}</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">{f.helps}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.why}</p>
            </div>
          ))}
        </div>
      </div>

      {view && (
        <RecipeView
          meal={view}
          onClose={() => setView(null)}
          onUse={() => {
            const key = viewSlotKey ?? PLAN_SLOTS.find(p => p.slot === view.slot)?.key;
            if (key) setSlot(key, view.id);
            setView(null);
          }}
          onDelete={view.custom ? () => {
            const next = custom.filter(m => m.id !== view.id);
            setCustom(next);
            save(K_CUSTOM, next);
            setView(null);
          } : undefined}
        />
      )}
    </div>
  );
}
