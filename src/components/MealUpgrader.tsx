import { useState } from 'react';
import { Leaf, Sparkles, Loader2, AlertCircle, Trash2, ChevronDown, Plus } from 'lucide-react';
import { upgradeMeal, VEG_FACTS, type Upgrade } from '../data/vegUpgrade';
import { aiMealUpgrade, explainFailure, type MealUpgradeAI } from '../lib/generators';

/*
 * Looks → Diet: type a meal you actually eat and get the veg and fruit to
 * add, how to add them, and why. Instant rule-based upgrade, optional AI
 * upgrade, and a saved list of your own meals (gymforge_my_meals, synced).
 */

const K = 'gymforge_my_meals';
type Saved = { meal: string; ai?: MealUpgradeAI };

const DOT: Record<string, string> = {
  green: 'bg-emerald-400', red: 'bg-red-400', orange: 'bg-orange-400', yellow: 'bg-yellow-300',
  purple: 'bg-fuchsia-400', white: 'bg-gray-200', brown: 'bg-amber-700', fruit: 'bg-pink-400',
};

function UpgradeView({ up }: { up: Upgrade }) {
  return (
    <div className="space-y-2">
      {up.matched.length > 0 && <p className="text-[11px] text-gray-500">Read as: {up.matched.join(' · ')}</p>}
      {up.veg.map(v => (
        <div key={v.item} className="rounded-lg bg-black/30 px-3 py-2">
          <p className="text-sm font-semibold text-gray-100 flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${DOT[v.colour] ?? 'bg-emerald-400'}`} />{v.item} <span className="text-[10px] text-gray-500 font-normal">· {v.amount}</span></p>
          <p className="text-xs text-gray-300 mt-0.5">{v.how}</p>
          <p className="text-[11px] text-emerald-200/80 mt-0.5">{v.why}</p>
        </div>
      ))}
      <div className="rounded-lg bg-black/30 px-3 py-2">
        <p className="text-sm font-semibold text-gray-100 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-400" />{up.fruit.item} <span className="text-[10px] text-gray-500 font-normal">· {up.fruit.amount}</span></p>
        <p className="text-[11px] text-emerald-200/80 mt-0.5">{up.fruit.why}</p>
      </div>
      <p className="text-xs text-gray-400 border-l-2 border-emerald-400/40 pl-2.5">{up.extra}</p>
      <p className="font-hud text-[11px] uppercase tracking-wider text-emerald-300">≈ {up.portions} of your 5-a-day from this meal</p>
    </div>
  );
}

function AIView({ ai }: { ai: MealUpgradeAI }) {
  return (
    <div className="space-y-2">
      {ai.additions.map(a => (
        <div key={a.item} className="rounded-lg bg-yellow-400/[0.05] border border-yellow-400/15 px-3 py-2">
          <p className="text-sm font-semibold text-gray-100">{a.item} {a.amount && <span className="text-[10px] text-gray-500 font-normal">· {a.amount}</span>}</p>
          {a.how && <p className="text-xs text-gray-300 mt-0.5">{a.how}</p>}
          {a.why && <p className="text-[11px] text-emerald-200/80 mt-0.5">{a.why}</p>}
        </div>
      ))}
      {ai.fruit.item && <p className="text-xs text-gray-300"><span className="text-pink-300 font-semibold">Fruit:</span> {ai.fruit.item} — {ai.fruit.why}</p>}
      {ai.swap && <p className="text-xs text-gray-300"><span className="text-yellow-300 font-semibold">Swap:</span> {ai.swap}</p>}
      {ai.note && <p className="text-[11px] text-gray-500">{ai.note}</p>}
      {ai.portions > 0 && <p className="font-hud text-[11px] uppercase tracking-wider text-emerald-300">≈ {ai.portions} of your 5-a-day</p>}
    </div>
  );
}

export default function MealUpgrader() {
  const [text, setText] = useState('');
  const [shown, setShown] = useState('');
  const [saved, setSaved] = useState<Saved[]>(() => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } });
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [why, setWhy] = useState(false);

  const persist = (next: Saved[]) => { setSaved(next); try { localStorage.setItem(K, JSON.stringify(next)); } catch { /* quota */ } };
  const check = () => { if (text.trim()) { setShown(text.trim()); setErr(''); } };
  const save = () => {
    const m = shown || text.trim();
    if (!m || saved.some(s => s.meal.toLowerCase() === m.toLowerCase())) return;
    persist([{ meal: m }, ...saved].slice(0, 30));
    setOpenIdx(0);
  };
  const askAI = async (meal: string) => {
    setBusy(meal); setErr('');
    try {
      let goal = '';
      try { goal = (JSON.parse(localStorage.getItem('gymforge_face_intake') || '{}') as { bodyGoal?: string }).bodyGoal ?? ''; } catch { /* ignore */ }
      const ai = await aiMealUpgrade(meal, goal);
      const exists = saved.some(s => s.meal === meal);
      persist(exists ? saved.map(s => s.meal === meal ? { ...s, ai } : s) : [{ meal, ai }, ...saved].slice(0, 30));
      setOpenIdx(exists ? saved.findIndex(s => s.meal === meal) : 0);
      setShown('');
    } catch (e) { setErr(explainFailure(e)); }
    setBusy(null);
  };

  const input = 'flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-emerald-400/50';

  return (
    <div className="bg-[#111] border border-emerald-500/30 rounded-2xl p-4 space-y-3" data-testid="meal-upgrader">
      <div>
        <h3 className="font-bold text-base text-emerald-300 flex items-center gap-2"><Leaf size={16} /> Upgrade my meal</h3>
        <p className="text-xs text-gray-500 mt-0.5">Type something you actually eat — "beef and rice", "chicken wrap", "spag bol" — and get the veg and fruit to add without changing the dish.</p>
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="e.g. beef and rice" className={input} aria-label="Your meal" />
        <button onClick={check} disabled={!text.trim()} className="rounded-xl px-4 text-sm font-hud font-bold uppercase tracking-wider border border-emerald-300/40 text-emerald-100 bg-emerald-400/10 disabled:opacity-35">Upgrade</button>
      </div>

      {shown && (
        <div className="rounded-xl border border-emerald-400/25 p-3 space-y-3">
          <p className="text-sm font-semibold text-white">{shown}</p>
          <UpgradeView up={upgradeMeal(shown)} />
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 rounded-lg py-2 text-xs font-hud font-bold uppercase tracking-wider border border-white/10 text-gray-300 inline-flex items-center justify-center gap-1"><Plus size={12} /> Save to my meals</button>
            <button onClick={() => askAI(shown)} disabled={busy === shown} className="flex-1 rounded-lg py-2 text-xs font-hud font-bold uppercase tracking-wider border border-yellow-300/40 text-yellow-100 bg-yellow-400/10 inline-flex items-center justify-center gap-1 disabled:opacity-40">
              {busy === shown ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Ask J.A.R.V.I.S.
            </button>
          </div>
        </div>
      )}
      {err && <p className="text-xs text-red-300 flex gap-1.5"><AlertCircle size={13} className="flex-shrink-0 mt-0.5" />{err}</p>}

      {saved.length > 0 && (
        <div>
          <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1.5">My meals</p>
          <div className="space-y-1.5">
            {saved.map((s, i) => (
              <div key={s.meal} className="rounded-xl bg-black/25 border border-white/5">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left">
                  <span className="text-sm text-gray-100">{s.meal}{s.ai && <Sparkles size={11} className="inline ml-1.5 text-yellow-300 -mt-0.5" />}</span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                {openIdx === i && (
                  <div className="px-3 pb-3 space-y-3">
                    {s.ai ? <AIView ai={s.ai} /> : <UpgradeView up={upgradeMeal(s.meal)} />}
                    <div className="flex gap-2">
                      {!s.ai && (
                        <button onClick={() => askAI(s.meal)} disabled={busy === s.meal} className="flex-1 rounded-lg py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider border border-yellow-300/40 text-yellow-100 inline-flex items-center justify-center gap-1 disabled:opacity-40">
                          {busy === s.meal ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />} Ask J.A.R.V.I.S.
                        </button>
                      )}
                      <button onClick={() => persist(saved.filter((_, j) => j !== i))} className="rounded-lg px-3 border border-white/10 text-gray-500 hover:text-red-300" aria-label={`Delete ${s.meal}`}><Trash2 size={13} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/5 pt-3">
        <button onClick={() => setWhy(w => !w)} className="w-full flex items-center justify-between text-left">
          <span className="font-semibold text-sm text-gray-100">Why fruit and veg matter</span>
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${why ? 'rotate-180' : ''}`} />
        </button>
        {why && (
          <div className="mt-2 space-y-2.5">
            {VEG_FACTS.map(([t, d]) => (
              <div key={t}>
                <p className="text-sm font-semibold text-gray-200">{t}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
