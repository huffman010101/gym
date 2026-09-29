import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Loader2, AlertCircle, ScanFace, Crown, Target, Clock, Sun, Moon, Utensils, Ban,
  Stethoscope, Send, ImagePlus, X, ChevronDown, Scissors, Glasses, Trash2, Quote, RefreshCw,
} from 'lucide-react';
import {
  analyseFaceDossierWithRetry, askLooksAdvisor, explainFailure, isValidFaceDossier, normaliseDossier,
} from '../lib/generators';
import type { FaceDossier as Dossier, FaceIntake, AdvisorTurn, MetricStatus } from '../lib/generators';
import { ArcReactor } from './Jarvis';

/*
 * The J.A.R.V.I.S. face dossier: intake → up to three photos → a full
 * per-metric analysis with a timed daily protocol → follow-up questions.
 * Photos are never stored (size); the dossier, intake and chat text are.
 */

const K_DOSSIER = 'gymforge_face_dossier';
const K_INTAKE = 'gymforge_face_intake';
const K_CHAT = 'gymforge_face_chat';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* quota */ }
}

function compress(dataUrl: string, maxPx = 900): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * scale;
      c.height = img.height * scale;
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const SLOTS = [
  { id: 'front', label: 'Front', hint: 'Straight on, daylight, no filter', required: true },
  { id: 'side', label: 'Side profile', hint: 'Jaw, chin, nose, posture', required: false },
  { id: 'close', label: 'Skin close-up', hint: 'Texture, spots, under-eyes', required: false },
] as const;

const SCAN_LINES = [
  'Mapping facial thirds',
  'Reading skin texture and tone',
  'Assessing jawline and midface',
  'Examining brows, eyes and lashes',
  'Evaluating hairline and density',
  'Checking grooming details',
  'Cross-referencing your routine',
  'Composing your daily protocol',
];

const STATUS_STYLE: Record<MetricStatus, string> = {
  Strong: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  Solid: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
  Improve: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  Priority: 'bg-rose-500/15 text-rose-300 border-rose-400/35',
};

function Label({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Crown }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      {Icon && <Icon size={13} className="text-cyan-300/80" />}
      <span className="font-hud text-[11px] font-bold uppercase tracking-[0.26em] text-cyan-300/80">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
    </div>
  );
}

/* Plain-text answer → paragraphs and bullet lists, no markdown parser needed. */
function Answer({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        const lines = b.split('\n').filter(Boolean);
        if (lines.every(l => /^\s*[-•]\s/.test(l))) {
          return (
            <ul key={i} className="space-y-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2"><span className="text-cyan-400">▸</span><span>{l.replace(/^\s*[-•]\s/, '')}</span></li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.join(' ')}</p>;
      })}
    </div>
  );
}

export default function FaceDossier() {
  const [intake, setIntake] = useState<FaceIntake>(() => {
    const jt = (() => { try { return localStorage.getItem('gymforge_jarvis_title') || 'sir'; } catch { return 'sir'; } })();
    return { title: jt, age: '', skinType: '', products: '', concerns: '', goalLook: '', bodyGoal: '', ...load<Partial<FaceIntake>>(K_INTAKE, {}) };
  });
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [dossier, setDossier] = useState<Dossier | null>(() => {
    const d = load<unknown>(K_DOSSIER, null);
    return isValidFaceDossier(d) ? normaliseDossier(d) : null;
  });
  const [busy, setBusy] = useState(false);
  const [line, setLine] = useState(0);
  const [error, setError] = useState('');
  const [showIntake, setShowIntake] = useState(() => !load<unknown>(K_DOSSIER, null));
  const [cat, setCat] = useState('All');
  const [openMetric, setOpenMetric] = useState<number | null>(null);

  const [chat, setChat] = useState<AdvisorTurn[]>(() => load<AdvisorTurn[]>(K_CHAT, []));
  const [q, setQ] = useState('');
  const [qPhoto, setQPhoto] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState('');
  const chatEnd = useRef<HTMLDivElement>(null);
  const resultsTop = useRef<HTMLDivElement>(null);

  const setField = (k: keyof FaceIntake, v: string) => {
    const next = { ...intake, [k]: v };
    setIntake(next);
    save(K_INTAKE, next);
  };

  useEffect(() => {
    if (!busy) return;
    setLine(0);
    const id = setInterval(() => setLine(l => (l + 1) % SCAN_LINES.length), 1800);
    return () => clearInterval(id);
  }, [busy]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [chat.length, asking]);

  const pickPhoto = async (slot: string, file?: File) => {
    if (!file) return;
    const small = await compress(await readFile(file));
    setPhotos(p => ({ ...p, [slot]: small }));
  };

  const runScan = async () => {
    if (!photos.front) return;
    setBusy(true);
    setError('');
    try {
      const list = SLOTS.filter(s => photos[s.id]).map(s => ({ label: s.label, dataUrl: photos[s.id] }));
      const d = await analyseFaceDossierWithRetry(list, intake);
      setDossier(d);
      save(K_DOSSIER, d);
      setShowIntake(false);
      setCat('All');
      setTimeout(() => resultsTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (e) {
      setError(explainFailure(e));
    }
    setBusy(false);
  };

  const ask = async (text?: string) => {
    const question = (text ?? q).trim();
    if (!question || asking) return;
    const turn: AdvisorTurn = { role: 'user', text: question, ...(qPhoto ? { photo: qPhoto } : {}) };
    const history = [...chat, turn];
    setChat(history);
    setQ('');
    setQPhoto(null);
    setAsking(true);
    setAskError('');
    try {
      const reply = await askLooksAdvisor(history.slice(-12), intake, dossier);
      const next = [...history, { role: 'assistant' as const, text: reply }];
      setChat(next);
      // Photos are too big to keep; store the text and a marker.
      save(K_CHAT, next.map(t => ({ role: t.role, text: t.photo ? `${t.text}  [photo attached]` : t.text })));
    } catch (e) {
      setAskError(explainFailure(e));
      setChat(chat);
      setQ(question);
    }
    setAsking(false);
  };

  const title = intake.title?.trim() || 'sir';
  const cats = dossier ? ['All', ...Array.from(new Set(dossier.metrics.map(m => m.category)))] : [];
  const shown = dossier ? dossier.metrics.filter(m => cat === 'All' || m.category === cat) : [];
  const counts = dossier
    ? (['Priority', 'Improve', 'Solid', 'Strong'] as MetricStatus[]).map(s => ({ s, n: dossier.metrics.filter(m => m.status === s).length }))
    : [];

  const input = 'w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-cyan-400/50';

  return (
    <div className="space-y-4">
      {/* ---------- Header ---------- */}
      <div className="hud-panel hud-frame relative overflow-hidden p-4">
        <div className="hud-scanline" />
        <div className="relative flex items-center gap-3">
          <ArcReactor size={40} />
          <div>
            <p className="font-orbitron text-[12px] tracking-[0.25em] hud-text-cyan">J.A.R.V.I.S. // FACE DOSSIER</p>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Every visible metric, what better looks like, and exactly how — then a timed daily protocol built around
              you. Ask follow-ups underneath.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Intake ---------- */}
      <div className="hud-panel p-4">
        <button onClick={() => setShowIntake(v => !v)} className="w-full flex items-center justify-between">
          <span className="font-hud text-[12px] font-bold uppercase tracking-[0.22em] text-cyan-200">Briefing — tell me about you</span>
          <ChevronDown size={16} className={`text-cyan-300 transition-transform ${showIntake ? 'rotate-180' : ''}`} />
        </button>
        {showIntake && (
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <label className="col-span-1 text-[11px] text-gray-500">Address me as
              <input className={input + ' mt-1'} value={intake.title} onChange={e => setField('title', e.target.value)} placeholder="sir, Mr Bateman…" />
            </label>
            <label className="col-span-1 text-[11px] text-gray-500">Age
              <input className={input + ' mt-1'} value={intake.age} onChange={e => setField('age', e.target.value)} inputMode="numeric" placeholder="20" />
            </label>
            <label className="col-span-1 text-[11px] text-gray-500">Skin type
              <select className={input + ' mt-1'} value={intake.skinType} onChange={e => setField('skinType', e.target.value)}>
                <option value="">Not sure</option>
                {['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'Acne-prone'].map(o => <option key={o}>{o}</option>)}
              </select>
            </label>
            <label className="col-span-1 text-[11px] text-gray-500">Body goal
              <select className={input + ' mt-1'} value={intake.bodyGoal} onChange={e => setField('bodyGoal', e.target.value)}>
                <option value="">Not set</option>
                {['Gain weight / size', 'Lean out', 'Maintain'].map(o => <option key={o}>{o}</option>)}
              </select>
            </label>
            <label className="col-span-2 text-[11px] text-gray-500">Current routine, actives and treatments
              <textarea rows={2} className={input + ' mt-1 resize-y'} value={intake.products} onChange={e => setField('products', e.target.value)}
                placeholder="CeraVe cleanser, SPF 50… starting tretinoin 0.025% next week" />
            </label>
            <label className="col-span-2 text-[11px] text-gray-500">What bothers you
              <textarea rows={2} className={input + ' mt-1 resize-y'} value={intake.concerns} onChange={e => setField('concerns', e.target.value)}
                placeholder="Spots on my chin and back, dark circles, patchy beard…" />
            </label>
            <label className="col-span-2 text-[11px] text-gray-500">The look you want
              <input className={input + ' mt-1'} value={intake.goalLook} onChange={e => setField('goalLook', e.target.value)} placeholder="Clean, sharp, model-ish" />
            </label>
          </div>
        )}
      </div>

      {/* ---------- Photos ---------- */}
      <div className="hud-panel p-4">
        <Label icon={Camera}>Imaging</Label>
        <div className="grid grid-cols-3 gap-2">
          {SLOTS.map(s => (
            <label key={s.id} className="relative block cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={e => pickPhoto(s.id, e.target.files?.[0])} />
              <div className={`aspect-[3/4] rounded-xl overflow-hidden border ${photos[s.id] ? 'border-cyan-400/40' : 'border-dashed border-white/15 hover:border-cyan-400/40'} bg-black/40 flex items-center justify-center`}>
                {photos[s.id]
                  ? <img src={photos[s.id]} alt={s.label} className="w-full h-full object-cover" />
                  : <div className="text-center px-1.5"><Camera size={18} className="mx-auto text-gray-600" /><p className="text-[10px] text-gray-500 mt-1 leading-tight">{s.hint}</p></div>}
              </div>
              <p className="font-hud text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1 text-center">
                {s.label}{s.required ? '' : ' · optional'}
              </p>
              {photos[s.id] && (
                <button onClick={e => { e.preventDefault(); setPhotos(p => { const n = { ...p }; delete n[s.id]; return n; }); }}
                  className="absolute top-1 right-1 bg-black/70 rounded-full p-1" aria-label="Remove"><X size={11} /></button>
              )}
            </label>
          ))}
        </div>

        {busy ? (
          <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.06] p-4 flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-cyan-300 flex-shrink-0" />
            <div>
              <p className="font-hud text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">{SCAN_LINES[line]}…</p>
              <p className="text-[11px] text-gray-500">A full dossier takes around a minute. Stay on this screen.</p>
            </div>
          </div>
        ) : (
          <button onClick={runScan} disabled={!photos.front}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 font-hud font-bold uppercase tracking-[0.18em] text-sm bg-cyan-400/15 border border-cyan-300/50 text-cyan-100 hover:bg-cyan-400/25 disabled:opacity-35 transition-colors press">
            <ScanFace size={17} /> {dossier ? 'Run a new scan' : 'Run full analysis'}
          </button>
        )}
        {!photos.front && !busy && <p className="text-[11px] text-gray-600 mt-2 text-center">Add a front photo to begin. Side and close-up make the read far more accurate.</p>}
        {error && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-xs">{error}</p>
          </div>
        )}
      </div>

      {/* ---------- Dossier ---------- */}
      {dossier && (
        <div ref={resultsTop} className="space-y-4 scroll-mt-4">
          <div className="hud-panel hud-frame gold p-4">
            <p className="font-hud text-[10px] uppercase tracking-[0.25em] text-yellow-400/80">
              Subject: {title}{dossier.builtAt ? ` · ${new Date(dossier.builtAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}` : ''}
            </p>
            {dossier.greeting && <p className="text-lg font-bold text-white mt-1 leading-snug">{dossier.greeting}</p>}
            <p className="text-gray-300 text-sm leading-relaxed mt-2">{dossier.headline}</p>
            {dossier.strongest.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {dossier.strongest.map(s => (
                  <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
                    <Crown size={10} className="inline mr-1 -mt-0.5" />{s}
                  </span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 gap-1.5 mt-4">
              {counts.map(({ s, n }) => (
                <div key={s} className={`rounded-lg border px-2 py-1.5 text-center ${STATUS_STYLE[s]}`}>
                  <p className="font-orbitron text-base leading-none">{n}</p>
                  <p className="font-hud text-[9px] uppercase tracking-wider mt-1">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {dossier.priorities.length > 0 && (
            <div className="hud-panel p-4">
              <Label icon={Target}>The levers that matter most</Label>
              <div className="space-y-2.5">
                {dossier.priorities.map((p, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="font-orbitron text-lg text-yellow-300 leading-none w-6">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-100">{p.title} <span className="text-[10px] font-hud uppercase tracking-wider text-yellow-400/70 ml-1">{p.impact}</span></p>
                      <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{p.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="hud-panel p-4">
            <Label icon={ScanFace}>Every metric</Label>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1 mb-2">
              {cats.map(c => (
                <button key={c} onClick={() => { setCat(c); setOpenMetric(null); }}
                  className={`flex-shrink-0 font-hud text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border ${cat === c ? 'bg-cyan-400/15 border-cyan-300/50 text-cyan-100' : 'border-white/10 text-gray-500'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {shown.map((m, i) => {
                const open = openMetric === i;
                return (
                  <div key={m.area + i} className="rounded-xl border border-white/8 bg-black/25">
                    <button onClick={() => setOpenMetric(open ? null : i)} className="w-full flex items-start justify-between gap-3 px-3 py-2.5 text-left">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-100">{m.area}</p>
                        <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{m.observed}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-hud font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                    </button>
                    {open && (
                      <div className="px-3 pb-3 space-y-2 border-t border-white/5 pt-2">
                        {m.improve && <p className="text-xs text-gray-300"><span className="text-cyan-300 font-semibold">Better looks like: </span>{m.improve}</p>}
                        {m.how.length > 0 && (
                          <ul className="space-y-1">
                            {m.how.map((h, j) => <li key={j} className="text-xs text-gray-300 flex gap-2"><span className="text-cyan-400">▸</span>{h}</li>)}
                          </ul>
                        )}
                        {m.timeline && <p className="text-[11px] text-gray-500"><Clock size={10} className="inline mr-1 -mt-0.5" />{m.timeline}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Tap any metric for what better looks like and exactly how.</p>
          </div>

          {/* Shape, hair, beard, glasses */}
          <div className="hud-panel p-4 space-y-3">
            <Label icon={Scissors}>Framing — hair, beard, frames</Label>
            {dossier.faceShape && (
              <p className="text-sm text-gray-300"><span className="font-orbitron text-cyan-200 capitalize mr-2">{dossier.faceShape}</span>{dossier.faceShapeReasoning}</p>
            )}
            {dossier.haircuts.map(h => (
              <div key={h.name} className="rounded-lg bg-white/[0.03] px-3 py-2">
                <p className="text-sm font-semibold text-orange-300">{h.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.why}</p>
              </div>
            ))}
            {dossier.facialHair.map(h => (
              <div key={h.style} className="rounded-lg bg-white/[0.03] px-3 py-2">
                <p className="text-sm font-semibold text-sky-300">{h.style}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.why}</p>
              </div>
            ))}
            {dossier.glasses && <p className="text-xs text-gray-400"><Glasses size={12} className="inline mr-1.5 text-indigo-300" />{dossier.glasses}</p>}
          </div>

          {/* Daily protocol */}
          <div className="hud-panel hud-frame p-4">
            <Label icon={Clock}>Your daily protocol</Label>
            <ol className="relative border-l border-cyan-400/25 ml-2 space-y-3">
              {dossier.daily.map((d, i) => (
                <li key={i} className="pl-4 relative">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <p className="text-sm text-gray-100"><span className="font-orbitron text-[12px] text-cyan-200 mr-2">{d.time}</span>{d.action}</p>
                  {d.detail && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{d.detail}</p>}
                </li>
              ))}
            </ol>
            {dossier.weekly.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1.5">Weekly</p>
                <ul className="space-y-1">{dossier.weekly.map((w, i) => <li key={i} className="text-xs text-gray-300 flex gap-2"><span className="text-cyan-400">▸</span>{w}</li>)}</ul>
              </div>
            )}
          </div>

          {/* Skincare */}
          {(dossier.skincare.morning.length > 0 || dossier.skincare.evening.length > 0) && (
            <div className="hud-panel p-4">
              <Label icon={Sun}>Skincare, built around what you use</Label>
              <div className="grid gap-3">
                <div>
                  <p className="text-[11px] font-bold text-yellow-300 mb-1 flex items-center gap-1"><Sun size={11} /> MORNING</p>
                  {dossier.skincare.morning.map((s, i) => <p key={i} className="text-sm text-gray-300 mb-1"><span className="text-gray-600 font-bold mr-1">{i + 1}.</span>{s}</p>)}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-indigo-300 mb-1 flex items-center gap-1"><Moon size={11} /> EVENING</p>
                  {dossier.skincare.evening.map((s, i) => <p key={i} className="text-sm text-gray-300 mb-1"><span className="text-gray-600 font-bold mr-1">{i + 1}.</span>{s}</p>)}
                </div>
                {dossier.skincare.notes && <p className="text-xs text-gray-400 border-l-2 border-indigo-400/40 pl-2.5">{dossier.skincare.notes}</p>}
              </div>
            </div>
          )}

          {/* Diet + avoid */}
          {(dossier.diet.length > 0 || dossier.avoid.length > 0) && (
            <div className="hud-panel p-4">
              <Label icon={Utensils}>Eat for this face</Label>
              <ul className="space-y-1.5">{dossier.diet.map((d, i) => <li key={i} className="text-sm text-gray-300 flex gap-2"><span className="text-emerald-400">▸</span>{d}</li>)}</ul>
              {dossier.avoid.length > 0 && (
                <>
                  <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-rose-300/80 mt-3 mb-1.5 flex items-center gap-1"><Ban size={10} /> Stop doing</p>
                  <ul className="space-y-1">{dossier.avoid.map((d, i) => <li key={i} className="text-xs text-gray-400 flex gap-2"><span className="text-rose-400">×</span>{d}</li>)}</ul>
                </>
              )}
              <Link to="/looksmax?tab=diet" className="inline-block mt-3 text-[11px] text-emerald-300 hover:underline">Meal examples and the full skin diet → Diet tab</Link>
            </div>
          )}

          {/* Monologue */}
          {dossier.monologue && (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#10151d] to-black p-5">
              <Quote size={18} className="text-gray-600" />
              <p className="text-gray-200 text-[15px] leading-relaxed italic mt-2 whitespace-pre-line" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {dossier.monologue}
              </p>
              <p className="font-hud text-[10px] uppercase tracking-[0.3em] text-gray-600 mt-3 text-right">— the morning routine, your version</p>
            </div>
          )}

          {dossier.seeProfessional && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-3 flex gap-2.5">
              <Stethoscope size={16} className="text-amber-300 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-100/90 leading-relaxed">{dossier.seeProfessional}</p>
            </div>
          )}
        </div>
      )}

      {/* ---------- Follow-up advisor ---------- */}
      <div className="hud-panel p-4">
        <div className="flex items-center justify-between">
          <Label icon={Send}>Ask J.A.R.V.I.S.</Label>
          {chat.length > 0 && (
            <button onClick={() => { setChat([]); save(K_CHAT, []); }} className="text-gray-600 hover:text-gray-400 -mt-2.5" title="Clear conversation"><Trash2 size={13} /></button>
          )}
        </div>
        <p className="text-[11px] text-gray-500 -mt-1 mb-3">
          Anything the scan raised, or anything else: spots on your body, fitting tret in, a beard that will not connect. Attach a photo if it helps.
          {dossier ? ' Answers use your dossier.' : ' Works without a scan, better with one.'}
        </p>

        {chat.length === 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(dossier?.followUps.length ? dossier.followUps : [
              'I have spots on my back and chest — how do I get rid of them?',
              'I am starting tretinoin — how do I fit it into my routine?',
              'What should I eat to gain weight and clear my skin?',
            ]).map(f => (
              <button key={f} onClick={() => ask(f)} className="text-left text-[11px] px-2.5 py-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.04] text-cyan-100/90 hover:bg-cyan-400/10">{f}</button>
            ))}
          </div>
        )}

        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
          {chat.map((t, i) => (
            <div key={i} className={t.role === 'user' ? 'flex justify-end' : ''}>
              <div className={`text-sm leading-relaxed rounded-xl px-3 py-2 ${t.role === 'user'
                ? 'max-w-[85%] bg-cyan-400/10 border border-cyan-400/25 text-cyan-50'
                : 'bg-black/30 border border-white/8 text-gray-300'}`}>
                {t.photo && <img src={t.photo} alt="" className="w-24 h-24 object-cover rounded-lg mb-1.5" />}
                {t.role === 'assistant' ? <Answer text={t.text} /> : t.text}
              </div>
            </div>
          ))}
          {asking && (
            <p className="text-xs text-cyan-300/80 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Considering, {title}…</p>
          )}
          <div ref={chatEnd} />
        </div>

        {askError && (
          <div className="mt-3 flex items-start gap-2 text-xs text-red-300">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" /> <span>{askError}</span>
            <button onClick={() => ask()} className="ml-auto text-cyan-300 flex items-center gap-1"><RefreshCw size={11} /> Retry</button>
          </div>
        )}

        <div className="mt-3 flex items-end gap-2">
          <label className="flex-shrink-0 cursor-pointer p-2 rounded-lg border border-white/10 text-gray-400 hover:text-cyan-300 hover:border-cyan-400/40" title="Attach a photo">
            <input type="file" accept="image/*" className="hidden"
              onChange={async e => { const f = e.target.files?.[0]; if (f) setQPhoto(await compress(await readFile(f), 800)); e.target.value = ''; }} />
            <ImagePlus size={17} />
          </label>
          <div className="flex-1 min-w-0">
            {qPhoto && (
              <div className="relative inline-block mb-1.5">
                <img src={qPhoto} alt="" className="w-14 h-14 object-cover rounded-lg" />
                <button onClick={() => setQPhoto(null)} className="absolute -top-1.5 -right-1.5 bg-black rounded-full p-0.5"><X size={11} /></button>
              </div>
            )}
            <textarea rows={1} value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
              placeholder="Ask anything…" className={input + ' resize-none'} />
          </div>
          <button onClick={() => ask()} disabled={!q.trim() || asking}
            className="flex-shrink-0 p-2.5 rounded-lg bg-cyan-400/15 border border-cyan-300/40 text-cyan-100 disabled:opacity-35" aria-label="Send">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
