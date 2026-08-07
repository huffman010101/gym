import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { analyseFace, suggestLayering } from '../lib/generators';
import type { FaceAnalysisResult, LayeringResult } from '../lib/generators';
import {
  ArrowLeft, ChevronDown, ChevronUp, Check, Sparkles, Scissors, Smile, User,
  BarChart2, Camera, Loader2, AlertCircle, Droplets, Wind, Sun, Moon,
  Activity, Eye,
} from 'lucide-react';

type LooksTab = 'scan' | 'hair' | 'face' | 'techniques' | 'style' | 'grooming' | 'fragrance' | 'tracker';

const todayKey = () => `gymforge_looksmax_checklist_${new Date().toISOString().split('T')[0]}`;

const MORNING_ITEMS = [
  { id: 'spf', label: 'SPF applied (every single day)' },
  { id: 'mewing_check', label: 'Checked tongue posture — mewing' },
  { id: 'supplements', label: 'Took supplements' },
  { id: 'teeth', label: 'Teeth brushed ×2 (electric)' },
  { id: 'tongue', label: 'Tongue scraped' },
];

const EVENING_ITEMS = [
  { id: 'cleanse', label: 'Cleansed face (gentle)' },
  { id: 'retinol_aha_bha', label: 'Retinol / BHA / AHA applied' },
  { id: 'moisturiser', label: 'Moisturiser + eye cream' },
  { id: 'castor', label: 'Castor oil on brows' },
  { id: 'lip_balm', label: 'Lip balm / overnight lip mask' },
];

const WEEKLY_ITEMS = [
  { id: 'dermaroll_scalp', label: 'Dermarolled scalp (0.5mm)' },
  { id: 'dermaroll_brows', label: 'Dermarolled brows (0.25mm)' },
  { id: 'beard_trim', label: 'Haircut / beard trim check' },
  { id: 'whitening', label: 'Whitening strips (30 min)' },
  { id: 'lip_scrub', label: 'Lip scrub + deep moisture' },
  { id: 'posture_session', label: 'Posture exercises (chin tucks, face pulls)' },
  { id: 'cold_eye', label: 'Cold spoon / gua sha eye treatment' },
];

function loadChecklist(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(todayKey()) || '{}') as Record<string, boolean>; }
  catch { return {}; }
}

function loadDermaroll(): { scalp: string; brows: string } {
  try {
    const raw = localStorage.getItem('gymforge_dermaroll');
    if (raw) return JSON.parse(raw) as { scalp: string; brows: string };
  } catch {}
  return { scalp: '', brows: '' };
}

function daysSinceStr(dateStr: string): string {
  if (!dateStr) return 'Never';
  const then = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

interface ExpandCard { title: string; content: string[]; badge?: string; accent?: string; }

function ExpandableCard({ title, content, badge, accent = 'text-gray-400' }: ExpandCard) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {badge && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold border border-orange-500/30">{badge}</span>}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        {open ? <ChevronUp size={15} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />}
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-4 pb-3 space-y-1.5 border-t border-white/5">
            {content.map((line, i) => (
              <p key={i} className={`${accent} text-sm leading-relaxed`}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function compressImage(dataUrl: string, maxPx = 800): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = dataUrl;
  });
}

export default function LooksMax() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<LooksTab>(() => {
    const t = params.get('tab');
    return (['scan', 'hair', 'face', 'techniques', 'style', 'grooming', 'fragrance', 'tracker'] as const).includes(t as LooksTab) ? (t as LooksTab) : 'scan';
  });
  const [checklist, setChecklist] = useState<Record<string, boolean>>(loadChecklist());
  const [dermaroll, setDermaroll] = useState(loadDermaroll());

  // AI Face Scan state
  const [scanPhoto, setScanPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FaceAnalysisResult | null>(null);
  const [scanError, setScanError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setChecklist(loadChecklist());
    setDermaroll(loadDermaroll());
    const saved = localStorage.getItem('gymforge_face_scan');
    if (saved) {
      try { setScanResult(JSON.parse(saved) as FaceAnalysisResult); } catch {}
    }
    const savedLayering = localStorage.getItem('gymforge_layering');
    if (savedLayering) {
      try {
        const parsed = JSON.parse(savedLayering) as { input: string; result: LayeringResult };
        setFragInput(parsed.input);
        setLayering(parsed.result);
      } catch {}
    }
  }, []);

  const toggle = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem(todayKey(), JSON.stringify(updated));
    if ((id === 'dermaroll_scalp' || id === 'dermaroll_brows') && updated[id]) {
      const today = new Date().toISOString().split('T')[0];
      const dr = { ...dermaroll };
      if (id === 'dermaroll_scalp') dr.scalp = today;
      if (id === 'dermaroll_brows') dr.brows = today;
      setDermaroll(dr);
      localStorage.setItem('gymforge_dermaroll', JSON.stringify(dr));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const compressed = await compressImage(ev.target!.result as string, 600);
      setScanPhoto(compressed);
      setScanResult(null);
      setScanError('');
    };
    reader.readAsDataURL(file);
  };

  // Fragrance layering AI state
  const [fragInput, setFragInput] = useState('');
  const [layering, setLayering] = useState<LayeringResult | null>(null);
  const [layeringBusy, setLayeringBusy] = useState(false);
  const [layeringError, setLayeringError] = useState('');
  const [fragSeason, setFragSeason] = useState('any');
  const [fragOccasion, setFragOccasion] = useState('any');

  const handleLayering = async (remix = false) => {
    if (!fragInput.trim()) return;
    setLayeringBusy(true);
    setLayeringError('');
    try {
      const avoid = remix && layering ? layering.combos.map(c => `${c.name} (${c.base} + ${c.top})`) : [];
      const result = await suggestLayering(fragInput.trim(), { season: fragSeason, occasion: fragOccasion, avoid });
      setLayering(result);
      localStorage.setItem('gymforge_layering', JSON.stringify({ input: fragInput.trim(), result }));
    } catch (e) {
      setLayeringError(e instanceof Error ? e.message : 'Failed. Check your API key.');
    }
    setLayeringBusy(false);
  };

  const handleScan = async () => {
    if (!scanPhoto) return;
    setScanning(true);
    setScanError('');
    try {
      const result = await analyseFace(scanPhoto);
      setScanResult(result);
      localStorage.setItem('gymforge_face_scan', JSON.stringify(result));
    } catch (e) {
      setScanError(e instanceof Error ? e.message : 'Scan failed. Check your API key.');
    }
    setScanning(false);
  };

  const morningDone = MORNING_ITEMS.filter(i => checklist[i.id]).length;
  const eveningDone = EVENING_ITEMS.filter(i => checklist[i.id]).length;
  const weeklyDone = WEEKLY_ITEMS.filter(i => checklist[i.id]).length;

  const TABS: { id: LooksTab; label: string; icon: typeof Sparkles }[] = [
    { id: 'scan', label: 'AI Scan', icon: Camera },
    { id: 'hair', label: 'Hair', icon: Scissors },
    { id: 'face', label: 'Face', icon: Smile },
    { id: 'techniques', label: 'Methods', icon: Sparkles },
    { id: 'style', label: 'Style', icon: Sun },
    { id: 'grooming', label: 'Groom', icon: User },
    { id: 'fragrance', label: 'Scent', icon: Wind },
    { id: 'tracker', label: 'Tracker', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-purple-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-4 bg-gradient-to-b from-purple-950/30 to-transparent">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={15} className="mr-1" /> Home
        </Link>
        <h1 className="text-3xl font-black tracking-tight gradient-text-purple">Looksmax Hub</h1>
        <p className="text-gray-500 text-xs mt-1">AI Scan · Hair · Face · Methods · Style · Grooming · Scent · Tracker</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 bg-[#111] border border-white/10 rounded-2xl p-1 overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                tab === id ? 'bg-white/10 text-purple-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 stagger" key={tab}>

        {/* ===== AI FACE SCAN TAB ===== */}
        {tab === 'scan' && (
          <>
            <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/20 border border-purple-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-purple-400" />
                <h2 className="font-bold text-base text-purple-300">AI Face Analysis</h2>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">Upload a well-lit front-facing photo. Claude analyses your face shape, ideal haircuts, facial hair styles, eyebrows, eyes, lips and skin — personalised to you.</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
              {!scanPhoto ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-40 flex flex-col items-center justify-center gap-3 bg-white/5 border-2 border-dashed border-white/15 rounded-xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all"
                >
                  <Camera size={28} className="text-gray-500" />
                  <div className="text-center">
                    <p className="text-gray-300 font-semibold text-sm">Upload face photo</p>
                    <p className="text-gray-600 text-xs mt-0.5">Front-facing, good lighting, neutral expression</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <img src={scanPhoto} alt="Face scan" className="w-full max-h-64 object-cover rounded-xl" />
                    <button
                      onClick={() => { setScanPhoto(null); setScanResult(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                    >
                      Change
                    </button>
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    {scanning
                      ? <><Loader2 size={16} className="animate-spin" /> Analysing your face...</>
                      : <><Sparkles size={16} /> Analyse My Face</>}
                  </button>
                </div>
              )}
              {scanError && (
                <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-xs">{scanError}</p>
                </div>
              )}
            </div>

            {scanResult && (
              <>
                <div className="bg-gradient-to-br from-purple-900/30 to-transparent border border-purple-500/25 rounded-2xl p-4">
                  <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Face Shape</p>
                  <p className="text-2xl font-black capitalize text-white">{scanResult.faceShape}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{scanResult.faceShapeReasoning}</p>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Scissors size={15} className="text-orange-400" />
                    <h3 className="font-bold text-sm">Best Haircuts For You</h3>
                  </div>
                  <div className="space-y-2">
                    {scanResult.haircuts.map((h, i) => (
                      <div key={i} className="bg-white/5 rounded-xl px-3 py-3">
                        <p className="font-semibold text-sm text-orange-400">{h.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{h.why}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={15} className="text-blue-400" />
                    <h3 className="font-bold text-sm">Facial Hair Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {scanResult.facialHair.map((f, i) => (
                      <div key={i} className="bg-white/5 rounded-xl px-3 py-3">
                        <p className="font-semibold text-sm text-blue-400">{f.style}</p>
                        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{f.why}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    ...(scanResult.glasses ? [{ label: 'Glasses', icon: Eye, color: 'text-indigo-400', accent: 'border-indigo-500/20', text: scanResult.glasses }] : []),
                    { label: 'Eyebrows', icon: Eye, color: 'text-green-400', accent: 'border-green-500/20', text: scanResult.eyebrows },
                    { label: 'Eye Area', icon: Eye, color: 'text-cyan-400', accent: 'border-cyan-500/20', text: scanResult.eyes },
                    { label: 'Lips', icon: Smile, color: 'text-pink-400', accent: 'border-pink-500/20', text: scanResult.lips },
                    { label: 'Skin', icon: Sun, color: 'text-yellow-400', accent: 'border-yellow-500/20', text: scanResult.skinObservations },
                  ].map(({ label, icon: Icon, color, accent, text }) => (
                    <div key={label} className={`bg-[#111] border ${accent} rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={14} className={color} />
                        <p className={`font-bold text-sm ${color}`}>{label}</p>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                {scanResult.skincareRoutine && (
                  <div className="card-premium p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets size={15} className="text-teal-400" />
                      <h3 className="font-bold text-base text-teal-300">Your Personalised Skincare Routine</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-yellow-300 mb-1.5 flex items-center gap-1"><Sun size={12} /> MORNING</p>
                        {scanResult.skincareRoutine.morning.map((s, i) => (
                          <p key={i} className="text-gray-300 text-sm leading-relaxed mb-1"><span className="text-gray-600 font-bold">{i + 1}.</span> {s}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-300 mb-1.5 flex items-center gap-1"><Moon size={12} /> EVENING</p>
                        {scanResult.skincareRoutine.evening.map((s, i) => (
                          <p key={i} className="text-gray-300 text-sm leading-relaxed mb-1"><span className="text-gray-600 font-bold">{i + 1}.</span> {s}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1"><Activity size={12} /> WEEKLY</p>
                        {scanResult.skincareRoutine.weekly.map((s, i) => (
                          <p key={i} className="text-gray-300 text-sm leading-relaxed mb-1"><span className="text-gray-600 font-bold">•</span> {s}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#111] border border-purple-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={15} className="text-purple-400" />
                    <h3 className="font-bold text-sm">Your 5 Action Tips</h3>
                  </div>
                  <div className="space-y-2">
                    {scanResult.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-purple-500/5 border border-purple-500/10 rounded-xl px-3 py-2.5">
                        <span className="text-purple-400 font-black text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <h3 className="font-bold text-sm mb-3 text-gray-400">Master Improvement List</h3>
                  <div className="space-y-1.5">
                    {[
                      'Body fat to 12% or below — reveals face structure',
                      'Start minoxidil for hairline if any recession',
                      'Daily SPF — prevents further photodamage',
                      'Shape eyebrows professionally every 4-6 weeks',
                      'Mewing 24/7 — correct tongue posture',
                      'Neck & trap training — frames the jaw',
                      'Mastic gum 30-60 min/day — masseter development',
                      'Cold compress eyes every morning — reduces puffiness',
                      'Lumify eye drops before important occasions',
                      'Castor oil nightly on brows and lashes',
                      'Retinol 3× per week — accelerates skin turnover',
                      'Niacinamide 10% daily — reduces redness, brightens',
                      'Vitamin C serum every morning — antioxidant + glow',
                      'Lip scrub weekly + overnight lip mask nightly',
                      'Whitening strips biweekly — teeth affect face significantly',
                      'Forward head posture fix — chin tucks 3×15 daily',
                      'Shoulder posture — face pulls, band pull-aparts 3×15',
                      'Sleep on back if possible — reduces compression lines',
                      'Silk pillowcase — less friction overnight',
                      'Hydration 3L+/day — skin plumpness and clarity',
                      'Zinc + Vitamin D3 — skin and hair quality',
                      'Fragrance — well-chosen scent is part of the overall impression',
                      'Eye cream with caffeine — reduces dark circles and puffiness',
                      'Posture exercises weekly — standing tall is half the look',
                      'Teeth: electric brush, tongue scraper, purple mouthwash',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 text-xs mt-0.5 flex-shrink-0">▸</span>
                        <p className="text-gray-400 text-xs leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ===== HAIR TAB ===== */}
        {tab === 'hair' && (
          <>
            <div className="bg-[#111] border border-orange-500/20 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1 text-orange-400">Hair Retention Protocol</h2>
              <p className="text-gray-500 text-xs mb-3">DHT blockers + topicals + dermarolling. The gold standard stack.</p>
              <div className="space-y-2">
                <ExpandableCard
                  title="Finasteride 1mg/day"
                  badge="MOST EFFECTIVE"
                  content={[
                    'Prescription DHT blocker — see your GP.',
                    'Blocks 5-alpha-reductase, reducing DHT by ~70%.',
                    'DHT is the primary cause of male pattern baldness.',
                    'Takes 3-6 months to see results, 12 months for full effect.',
                    'Side effects rare but possible — discuss with GP.',
                    'Often combined with minoxidil for maximum retention.',
                  ]}
                />
                <ExpandableCard
                  title="Minoxidil 5% Foam — twice daily"
                  badge="OTC"
                  content={[
                    'Apply to dry scalp — 1ml each application (morning + evening).',
                    'Foam formula preferred over liquid for less scalp irritation.',
                    'Works by increasing blood flow to hair follicles.',
                    'Takes 4-6 months to see results — do not stop.',
                    'Shedding in weeks 2-6 is normal — new growth pushing old hair out.',
                    'Apply 1 hour before bed to avoid transfer to pillow.',
                    'Wait 4 hours before swimming or heavy sweating.',
                  ]}
                />
                <ExpandableCard
                  title="Ketoconazole Shampoo 2%"
                  badge="2-3×/WEEK"
                  content={[
                    'Antifungal with DHT-blocking properties at the scalp.',
                    'Use 2-3 times per week — leave on scalp for 3 minutes before rinsing.',
                    'Reduces scalp inflammation which accelerates hair loss.',
                    'Available as Nizoral 2% (UK) — pharmacy or prescription.',
                    'Can be used on rest days from minoxidil applications.',
                    'Keeps scalp clean and reduces sebum buildup that clogs follicles.',
                  ]}
                />
                <ExpandableCard
                  title="Dermarolling — 0.5mm Scalp"
                  badge="WEEKLY"
                  content={[
                    'Creates micro-channels in the scalp, dramatically increasing minoxidil absorption.',
                    'Use a 0.5mm dermaroller on scalp once per week.',
                    'Roll in 4 directions: vertical, horizontal, diagonal ×2.',
                    'Apply gentle pressure — should feel slight tingling, not sharp pain.',
                    'Wait 24 hours before applying minoxidil after rolling (increased absorption = increased potency).',
                    'Clean roller with 70% isopropyl alcohol before and after each use.',
                    'Replace roller every 3 months or when needles are dulled.',
                  ]}
                />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Growth Supplements</h2>
              <div className="space-y-2">
                {[
                  { name: 'Biotin', dose: '5000mcg/day', note: 'B-vitamin for hair, skin and nails — deficiency accelerates shedding' },
                  { name: 'Saw Palmetto', dose: '320mg/day', note: 'Natural DHT blocker — weaker than finasteride but no prescription needed' },
                  { name: 'Pumpkin Seed Oil', dose: '1 capsule/day', note: 'Shown in studies to reduce DHT activity at the follicle' },
                  { name: 'Vitamin D3 + K2', dose: '4000 IU D3 + 100mcg K2', note: 'D3 deficiency linked to hair loss. K2 directs calcium properly' },
                  { name: 'Zinc', dose: '30mg/day with food', note: 'Zinc deficiency = accelerated hair loss. Take with food to avoid nausea' },
                  { name: 'Collagen Peptides', dose: '10g/day', note: 'Supports hair shaft structure and skin elasticity' },
                ].map(({ name, dose, note }) => (
                  <div key={name} className="bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-sm">{name}</p>
                      <span className="text-orange-400 text-xs font-bold">{dose}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Eyebrow Growth Protocol</h2>
              <div className="space-y-2">
                <ExpandableCard title="Castor Oil — nightly" content={[
                  'Apply to brows every night using a clean spoolie brush.',
                  'Ricinoleic acid in castor oil promotes hair growth and reduces inflammation.',
                  'Also works on eyelashes — apply carefully to lash line with clean brush.',
                  'Results in 6-12 weeks of consistent nightly use.',
                ]} />
                <ExpandableCard title="RevitaBrow Advanced Serum" content={[
                  'OTC brow growth serum — apply along brow line once daily.',
                  'Contains peptides, biotin, and keratin amino acids.',
                  'Results typically visible at 6-8 weeks.',
                  'Available at pharmacies and online.',
                ]} />
                <ExpandableCard title="Latisse / Bimatoprost (prescription)" badge="FAST" content={[
                  'Originally a glaucoma drug — discovered to grow lashes and brows significantly.',
                  'Noticeable results in 4-6 weeks.',
                  'Apply to brow and lash line with applicator each night.',
                  'Requires prescription — see GP or dermatologist.',
                  'Can darken skin if applied outside the brow line — be precise.',
                ]} />
                <ExpandableCard title="Dermarolling Brows — 0.25mm" badge="WEEKLY" content={[
                  'Use a 0.25mm facial roller along the brow area once per week.',
                  'Creates micro-channels for better serum absorption.',
                  'Apply castor oil or RevitaBrow immediately after rolling.',
                  'Gentle pressure only — facial skin is more sensitive than scalp.',
                  'Avoid if active breakouts in the area.',
                ]} />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Haircut by Face Shape</h2>
              <div className="space-y-2.5">
                {[
                  { shape: 'Oval', tip: 'Most versatile — almost any style works. Textured crops, quiffs, and slick backs all suit.' },
                  { shape: 'Square', tip: 'Strong jawline. Avoid super short sides — softer fades with more length on top balance width. Textured quiff ideal.' },
                  { shape: 'Round', tip: 'Add height on top to elongate. Avoid buzzcuts and centre parts. Side-part pompadour or high fade with volume works well.' },
                  { shape: 'Heart', tip: 'Wider forehead tapering to chin. Side fades with volume on top. Avoid extra crown volume. Beard adds width at jaw.' },
                  { shape: 'Oblong / Long', tip: 'Avoid adding height. Textured layers on sides, medium length tops. Beards add width and frame.' },
                  { shape: 'Diamond', tip: 'Wide cheekbones, narrow forehead and jaw. Fringe softens forehead. Layered cuts with side volume. Light stubble defines jaw.' },
                  { shape: 'Triangle', tip: 'Narrow forehead, wider jaw. Volume on top to balance. Avoid wide beards. French crop or structured quiff.' },
                ].map(({ shape, tip }) => (
                  <div key={shape} className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="font-semibold text-sm text-orange-400">{shape} Face</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== FACE TAB ===== */}
        {tab === 'face' && (
          <>
            {/* Posture Section */}
            <div className="bg-[#111] border border-red-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={15} className="text-red-400" />
                <h2 className="font-bold text-base text-red-400">Posture — The Invisible Looksmax</h2>
              </div>
              <p className="text-gray-500 text-xs mb-3">Correct posture adds immediate height, projects confidence, and changes how your face and neck appear. Fix these three patterns.</p>

              <div className="bg-gradient-to-br from-red-500/10 to-[#111] border border-red-500/25 rounded-xl p-3.5 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-300/80 mb-2.5">The fix — 5 minutes, once a day</p>
                <div className="space-y-2">
                  {[
                    ['Chin tucks — 3 × 15', 'Fixes forward head. Pull chin straight back into a double chin, hold 5s.'],
                    ['Face pulls or band pull-aparts — 3 × 15', 'Fixes rounded shoulders. Already in your Pull day if you train it that week.'],
                    ['Glute bridges — 3 × 15', 'Fixes the pelvic tilt. Squeeze glutes hard at the top.'],
                    ['Stack check — a few times a day', 'Ears over shoulders, shoulders over hips. Just glance in any mirror you pass and reset.'],
                  ].map(([t, d]) => (
                    <div key={t} className="flex gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/70 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-xs text-gray-200">{t}</p>
                        <p className="text-gray-500 text-[11px] leading-relaxed">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed mt-2.5 pt-2.5 border-t border-white/5">
                  That is the whole fix. The four cards below exist if you ever want the why or extra options — you do not need to read them to get results.
                </p>
              </div>

              <div className="space-y-2">
                <ExpandableCard
                  title="Forward Head Posture — Fix"
                  badge="PRIORITY 1"
                  content={[
                    'Caused by: phone use, desk work, sleeping on too many pillows.',
                    'Effect: adds perceived weight, shortens neck, reduces jawline visibility.',
                    'Fix 1 — Chin Tucks: pull chin straight back (double chin position), hold 5 sec. 3 × 15 daily.',
                    'Fix 2 — Neck stretches: tilt ear to shoulder, hold 30s each side, 2× daily.',
                    'Fix 3 — Thoracic extension over foam roller — 60 sec, daily.',
                    'Strengthen: deep neck flexors by lying flat, performing chin tucks with gentle head lifts.',
                    'Cue: ears over shoulders, shoulders over hips. Check yourself in mirrors.',
                  ]}
                />
                <ExpandableCard
                  title="Rounded Shoulders — Fix"
                  badge="PRIORITY 2"
                  content={[
                    'Caused by: too much pressing vs pulling, hunching over screens.',
                    'Effect: collapses the chest, makes you look smaller and lacking confidence.',
                    'Fix 1 — Face Pulls: cable or band at eye height, 3 × 15-20 daily.',
                    'Fix 2 — Band Pull-Aparts: hold band in front, pull apart to chest, 3 × 15-20 daily.',
                    'Fix 3 — Wall Angels: back flat against wall, arms slide up and down in a Y, 3 × 10.',
                    'Fix 4 — Doorway chest stretch: 30s each arm, 2× daily.',
                    'At gym: 2:1 pulling to pushing ratio. Rows and pull-ups fix rounded shoulders faster than anything.',
                  ]}
                />
                <ExpandableCard
                  title="Anterior Pelvic Tilt (APT) — Fix"
                  badge="PRIORITY 3"
                  content={[
                    'Caused by: sitting all day, weak glutes, tight hip flexors.',
                    'Effect: pushed-out belly, hyperextended lower back, looks bad in clothing.',
                    'Fix 1 — Hip Flexor Stretch: kneeling lunge, push hips forward, 60s each side, daily.',
                    'Fix 2 — Glute Bridges: 3 × 15, squeeze glutes hard at top, daily.',
                    'Fix 3 — Dead Bug: lying core stability exercise, 3 × 10 each side.',
                    'Fix 4 — Romanian Deadlifts: strengthen posterior chain. 3 × 10 twice weekly.',
                    'Fix 5 — Posterior pelvic tilt: standing against wall, flatten lower back to wall, hold 10s.',
                    'The big picture: strong glutes + mobile hip flexors + stable core = neutral pelvic position.',
                  ]}
                />
                <ExpandableCard
                  title="Ideal Standing & Walking Posture"
                  content={[
                    'Head: neutral — chin parallel to floor, ears over shoulders.',
                    'Shoulders: pulled back and DOWN — not raised or shrugged. Imagine shoulder blades in back pockets.',
                    'Chest: slightly forward and open. Ribcage stacked over pelvis.',
                    'Core: 20% braced — not sucked in hard, but lightly engaged.',
                    'Pelvis: neutral — not tilted anterior or posterior.',
                    'Knees: slight bend, not locked. Weight on the full foot.',
                    'Walking: heel to toe, let arms swing naturally. Lead with chest, not head.',
                    'Daily practice: check posture every time you enter a room or sit down.',
                  ]}
                />
              </div>
            </div>

            {/* Eye Brightening */}
            <div className="bg-[#111] border border-cyan-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye size={15} className="text-cyan-400" />
                <h2 className="font-bold text-base text-cyan-400">Eye Brightening Protocol</h2>
              </div>
              <p className="text-gray-500 text-xs mb-3">Eyes are the first thing people look at. Bright, clear eyes read as healthy, energetic and attractive.</p>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="font-bold text-sm text-cyan-400 mb-2">Instant — Dark Circles & Redness</p>
                  <div className="space-y-1.5">
                    {[
                      'Lumify eye drops (brimonidine): constricts blood vessels, whitens sclera in 1 minute. Lasts 8h. Do not overuse (max every 8h).',
                      'Cold spoons: refrigerate two spoons, press under eyes for 60s each morning. Reduces puffiness and vasoconstriction.',
                      'Cold compress: soaked cloth for 5 minutes reduces dark circle visibility immediately.',
                      'Caffeine eye cream (e.g. Garnier Caffeine Eye Roll-On): apply mornings, vasoconstricting, reduces puffiness in 10-15 min.',
                    ].map((item, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="font-bold text-sm text-blue-400 mb-2">Long-term — Dark Circles</p>
                  <div className="space-y-1.5">
                    {[
                      'Dark circles are 70% genetic (blood vessels showing) — cannot be fully eliminated naturally.',
                      'Sleep 8+ hours: the single most effective intervention. Lack of sleep causes blood to pool under thin under-eye skin.',
                      'Reduce sodium: excess sodium causes fluid retention which worsens puffiness and darkness.',
                      'Vitamin K cream under eyes: some studies show it reduces dark circles over 4-8 weeks.',
                      'Retinol eye cream: thickens under-eye skin over months, making vessels less visible (use lowest concentration).',
                      'Elevate head while sleeping — reduces fluid pooling under eyes overnight.',
                      'Iron / B12 deficiency: can cause dark circles — blood test rules this out.',
                    ].map((item, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="font-bold text-sm text-purple-400 mb-2">Lash & Brow Density — Eye Frame</p>
                  <div className="space-y-1.5">
                    {[
                      'Dense, dark lashes make eyes appear deeper-set and more striking — the "hunter eye" effect.',
                      'Lash serum (Latisse on lash line): 4-8 weeks for noticeable density increase.',
                      'Castor oil on lash line nightly: slower but effective over 8-12 weeks.',
                      'Well-groomed brows that arch over the outer iris frame eyes and increase contrast.',
                      'Brow pencil in feathery strokes fills gaps without looking artificial.',
                    ].map((item, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lips */}
            <div className="bg-[#111] border border-pink-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Smile size={15} className="text-pink-400" />
                <h2 className="font-bold text-base text-pink-400">Lip Care & Enhancement</h2>
              </div>
              <p className="text-gray-500 text-xs mb-3">Well-maintained lips are a major attractiveness signal. Dry, chapped lips undo otherwise great grooming.</p>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="font-bold text-sm text-pink-400 mb-2">Weekly — Lip Scrub</p>
                  <div className="space-y-1.5">
                    {[
                      'DIY: 1 tsp coconut oil + 1 tsp sugar. Rub in circles for 60 seconds, rinse off.',
                      'Or use a ready-made lip scrub (e.g. Lush Bubblegum, Frank Body Lip Polish).',
                      'Removes dead skin cells, restores natural colour and smoothness.',
                      'Follow immediately with thick balm or overnight mask to lock moisture in.',
                      'Do once per week — more frequently is too abrasive.',
                    ].map((item, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="font-bold text-sm text-rose-400 mb-2">Nightly — Overnight Treatment</p>
                  <div className="space-y-1.5">
                    {[
                      'Laneige Lip Sleeping Mask: cult product, intense overnight hydration.',
                      'Or thick layer of Vaseline over a thin layer of castor oil — equally effective.',
                      'CeraVe Healing Ointment on lips: ceramides and hyaluronic acid overnight.',
                      'Results after 1 week of consistent nightly use: visibly softer, fuller-looking lips.',
                      'Do not lick lips — saliva breaks down the skin barrier further.',
                    ].map((item, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="font-bold text-sm text-orange-400 mb-2">Daily Habits</p>
                  <div className="space-y-1.5">
                    {[
                      'SPF lip balm every morning — lips have no melanin and burn and age fastest.',
                      'Stay hydrated: 3L+ water daily. Dehydration shows on lips first.',
                      'Avoid picking or peeling dead skin — pulls healthy tissue and causes bleeding.',
                      'Breathe through your nose — mouth breathing dries lips continuously.',
                      'Natural plumping: cinnamon oil or mint oil (very diluted) in balm causes mild vasodilation.',
                    ].map((item, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mewing */}
            <div className="bg-[#111] border border-blue-500/20 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1 text-blue-400">Mewing — Full Technique</h2>
              <p className="text-gray-500 text-xs mb-3">Correct tongue posture for long-term facial development. Aim for 24/7 habit.</p>
              <div className="space-y-2">
                {[
                  { step: '1', text: 'Place your entire tongue on the roof of your mouth — not just the tip.' },
                  { step: '2', text: 'The posterior (back) third of the tongue is key — press it firmly up and back against the palate.' },
                  { step: '3', text: 'Lips closed, teeth lightly touching or slightly apart (not clenched).' },
                  { step: '4', text: 'Breathe exclusively through your nose — nasal breathing is non-negotiable.' },
                  { step: '5', text: 'This should become your resting tongue posture 24/7 — while working, watching TV, sleeping.' },
                  { step: '6', text: 'Progress: forward and upward facial growth (mid-face and cheekbones) over months to years.' },
                  { step: '7', text: 'No pain at any point. If you feel jaw pain, ease off — you are over-applying force.' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                    <span className="text-blue-400 font-black text-sm flex-shrink-0">{step}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Facial Contrast */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Facial Contrast</h2>
              <p className="text-gray-500 text-xs mb-3">What makes faces look more striking and memorable.</p>
              <div className="space-y-2">
                <ExpandableCard title="Dark, Defined Eyebrows" content={[
                  'Higher contrast between brows and skin = more memorable, striking face.',
                  'Fill sparse areas with a pencil one shade lighter than your hair.',
                  'Use feathery strokes — never block fill.',
                  'Set with clear brow gel to hold shape all day.',
                ]} />
                <ExpandableCard title="Clear, Even Skin Tone" content={[
                  'Reduces visual noise so facial features read more clearly.',
                  'Niacinamide 10% targets hyperpigmentation and redness simultaneously.',
                  'SPF prevents new pigmentation damage every single day.',
                  'Focus on barrier repair first: ceramides calm and protect.',
                ]} />
                <ExpandableCard title="Low Body Fat" content={[
                  'Below 12% BF for males reveals the facial structure nature gave you.',
                  'Cheekbones, jawline, and orbital bone structure become visible.',
                  'Most impactful single factor you can control.',
                  'Face fat is often the last to go — requires overall caloric deficit.',
                ]} />
                <ExpandableCard title="Jawline Development" content={[
                  'Mastic gum (Falim brand) 30-60 min daily — masseter hypertrophy in 2-3 months.',
                  'Neck training: shrugs 4×15, band neck work — frames the jaw.',
                  'Low BF + mewing + mastic gum = maximal natural jawline.',
                  'Sodium reduction before important events removes water retention from face.',
                ]} />
                <ExpandableCard title="Skin for Facial Contrast" content={[
                  'Niacinamide 10% daily: anti-inflammatory, reduces redness, fades pigmentation.',
                  'Azelaic acid 10-15%: fades dark spots and red marks over 8-12 weeks.',
                  'Vitamin C serum (15%+) in morning: antioxidant + brightening.',
                  'Retinol 3× per week: accelerates cell turnover, fades marks, thickens skin.',
                  'SPF 50 daily: prevents new sun damage accumulating.',
                ]} />
              </div>
            </div>
          </>
        )}

        {/* ===== GROOMING TAB ===== */}
        {/* ===== METHODS / TECHNIQUES TAB ===== */}
        {tab === 'techniques' && (
          <>
            <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/20 border border-purple-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-purple-400" />
                <h2 className="font-bold text-base text-purple-300">The Techniques Encyclopedia</h2>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Every method the looksmax community actually talks about — with honesty about what works, what's slow, and what's a myth.
                The big three that dwarf everything else: <span className="text-purple-300 font-semibold">low body fat, good sleep, good posture</span>.
              </p>
            </div>

            <ExpandableCard badge="S-TIER" title="Body Fat % — the #1 face changer" accent="text-gray-400" content={[
              'Nothing reveals cheekbones, jawline and hollow cheeks like dropping from ~20% to 12-15% body fat. Most “bad bone structure” is a fat layer.',
              'This is why the Gym section IS a looksmax section. Calorie deficit + weight training + steps.',
              'Face fat is usually the last to go — patience through the final 5kg.',
              'Warning: below ~10% you start looking gaunt and feeling terrible. Lean, not depleted.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Debloating protocol — sharper face in 72h" content={[
              'Sodium: keep it consistent and moderate — salt binges = moon face for 2 days.',
              'Water: 3L+ daily. Paradoxically, underdrinking makes you retain more.',
              'Alcohol: the single biggest face-bloater. Night of drinking = 3 days of puff.',
              'Sleep 8h with head slightly elevated; sleeping face-down pools fluid in your face.',
              'Morning: cold water splash 30s + 2 min lymphatic massage (push from centre of face outward and down the neck).',
              'Cut late-night carbs+salt combos before events and photos.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Supplement stack — what's actually worth taking" content={[
              'Creatine monohydrate 5g daily, any time, forever — the most proven supplement in existence: strength, muscle fullness, even cognitive benefits. No loading phase needed, no cycling.',
              'Whey protein — food first, whey to fill the gap to your daily protein target. It\'s food, not magic.',
              'Vitamin D3 (2000-4000 IU with a meal) — most people are deficient, especially in the UK. Mood, testosterone support, immunity, skin. Take with K2 if possible.',
              'Omega-3 fish oil (1-2g EPA/DHA daily) — skin quality, joint health, recovery, brain. If you don\'t eat oily fish twice a week, take it.',
              'Magnesium glycinate (200-400mg before bed) — deeper sleep, less muscle cramping, stress regulation. Sleep is your #1 looksmax tool; this feeds it.',
              'Zinc (only if deficient / heavy sweater) — testosterone and skin. Don\'t megadose; it competes with copper.',
              'Caffeine (100-200mg pre-training) — the only legal performance enhancer that\'s truly noticeable. Cut off 8+ hours before bed or it eats your sleep.',
              'Ashwagandha (300-600mg KSM-66) — decent evidence for lowering stress/cortisol; helpful in hard training or stressful periods. Cycle it: 8 weeks on, 2-4 off.',
              'SKIP: fat burners (caffeine in a costume), test boosters (do nothing your sleep wouldn\'t), BCAAs (pointless if protein is adequate), greens powders (expensive urine — eat vegetables).',
              'Order of importance so you never forget: sleep > diet > training > creatine + D3 + omega-3 > everything else is optional.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Foods that make you better looking" content={[
              'Skin: oily fish (salmon, mackerel — omega-3s calm inflammation and acne), berries + citrus (vitamin C builds collagen), carrots/sweet potato (beta-carotene gives a healthy glow — proven in studies to make faces rated more attractive), green tea, dark chocolate 85%+.',
              'Hair: eggs (biotin + protein), red meat and lentils (iron — the #1 nutritional cause of bad hair is low iron), oysters/beef (zinc), nuts and seeds (vitamin E, selenium — 2 brazil nuts a day covers selenium).',
              'Muscle & leanness: protein at every meal (eggs, chicken, beef, fish, Greek yoghurt, whey) — 1.6-2.2g per kg bodyweight. Protein is also the most satiating macro, so it keeps you lean on autopilot.',
              'Hormones: whole eggs (cholesterol is the raw material of testosterone), red meat, olive oil, avocado, cruciferous veg (broccoli). Chronically low-fat diets tank test — keep fats at 20-30% of calories.',
              'Debloat/face definition: potassium foods (bananas, potatoes, spinach) flush sodium retention · consistent salt intake · 3L water · limit alcohol hard — it\'s the single worst looks-food there is.',
              'Teeth & breath: crunchy raw veg and apples (natural cleaning), cheese after meals (neutralises acid), avoid constant-sipping sugary/acidic drinks — sipping cola for an hour is worse than drinking it in 5 minutes.',
              'The anti-list: sugar spikes → glycation → duller skin and acne · seed-oil-heavy takeaways → inflammation · late-night salt+carb combos → morning moon face · excess dairy triggers acne in SOME people (test 3 weeks off if you break out).',
              'The pattern: single-ingredient foods, protein-anchored, colourful plants, water. Every list above is the same list — eat like you train and every metric moves at once.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Whole-food diet — the complete framework" content={[
              'The rule that replaces all other rules: if it had a face, grew from the ground, or has one ingredient — eat it. If it comes in a packet with a mascot and 20 ingredients — that\'s the exception, not the diet.',
              'The plate template (every meal): palm-sized+ protein (meat, fish, eggs, Greek yoghurt) · fist of carbs (rice, potatoes, oats, fruit) · two fists of vegetables · thumb of fats (olive oil, avocado, nuts). No counting needed when the template holds.',
              'Why whole foods win automatically: higher satiety per calorie (hard to overeat a chicken breast, easy to inhale 800kcal of biscuits) · stable blood sugar = stable energy and mood · the micronutrients that skin, hair and hormones run on · less sodium = less bloat by default.',
              'The 80/20 contract: 80% single-ingredient whole foods, 20% whatever you want, guilt-free. Perfection breaks in a week; 80/20 runs for life. The 20% eaten deliberately (a proper meal out) beats it leaking away in mindless snacks.',
              'Shopping rule: shop the edges of the supermarket (meat, fish, produce, eggs, dairy) — the middle aisles are where the ultra-processed stuff lives. If your trolley needs no label-reading, you\'ve done it right.',
              'The weekly prep hour: cook a big batch of protein (chicken thighs, mince, boiled eggs) + carbs (rice, potatoes) on Sunday. Laziness eats whatever\'s closest — make the closest thing whole food.',
              'Upgrade swaps: cereal → eggs/oats · meal-deal sandwich → chicken rice box · crisps → nuts/fruit/biltong · soft drinks → sparkling water · takeaway sauce bombs → same dish home-made in 15 min.',
              'Whole foods ARE the looksmax diet: everything in the foods-for-looks card above is a whole food. One eating pattern moves skin, bloat, physique, energy and mood at once.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Water retention — the full-body fix" content={[
              'What it is: extra water held under the skin and around the middle — the difference between how you look Monday morning vs after a clean week. Often 1-3kg of pure water masquerading as fat.',
              'Sodium-potassium balance is the master lever: the problem is rarely just salt — it\'s high sodium WITH low potassium. Fix both: cut processed/takeaway food (hidden salt bombs) AND eat potassium daily (bananas, potatoes, avocado, spinach, yoghurt).',
              'Drink MORE water to hold less: underdrinking makes your body cling to every drop (aldosterone). 3-4L daily flushes retention. The first few days you\'ll pee constantly — that\'s it working.',
              'Carbs and the scale lie: every gram of stored carb holds ~3g of water. A big carb day = +1-2kg overnight that ISN\'T fat; a low-carb day = flat and "lean" but it\'s water. Judge trends weekly, never day-to-day.',
              'Cortisol retains water: chronic stress and sleep debt visibly puff the face and body. The sleep protocol + daily movement + the Stoic tab are debloating tools.',
              'Alcohol is a retention bomb: dehydrates you acutely, then rebounds into 2-3 days of holding everything. The Friday session shows on your face until Tuesday.',
              'Movement drains lymph: the lymphatic system has no pump — walking IS the pump. 10k steps, plus sweat sessions (training, sauna if available) directly clear retained water.',
              'The event-week protocol: 7 days out — clean whole foods, consistent moderate sodium, 4L water, daily steps, no alcohol. Last 2 days — normal water, slightly lower carbs, potassium up. Wake up event day the leanest version of your current self.',
              'Creatine note: it adds ~1kg of water INSIDE the muscle (looks good, fuller) — that\'s not the puffy under-skin kind. Don\'t drop creatine for debloating; it\'s working for you.',
            ]} />
            <ExpandableCard badge="MASTER" title="The Complete Desirability Audit — every metric in one list" content={[
              'Run this audit monthly. Score yourself 1-10 on each line, attack the lowest two scores first — the lowest metric drags the whole impression down more than your best one lifts it.',
              'BODY: body fat 12-15% · visible training consistency · posture (head back, shoulders down) · walk unhurried · grip strength and hands that look capable.',
              'FACE: skin routine running · teeth white and breath handled · brows tidy · haircut fresh (every 2-4 weeks) and suited to face (AI Scan) · facial hair deliberate, neckline clean · nose/ear hair gone.',
              'SCENT: fragrance wardrobe (day + night) · clothes actually clean · fresh breath kit on you · room/car smells good too — people notice.',
              'STYLE: fits your body (tailored) · your colours (undertone + contrast) · one clear archetype · shoes clean · glasses/accessories chosen not accumulated.',
              'VOICE & PRESENCE: chest voice, downward inflection · comfortable pauses · eye contact steady · phone stays away in company · reactions expressive.',
              'SOCIAL: can open conversations anywhere · tells stories with structure · remembers details and calls back · handles rejection with grace · has actual friends and a social life running.',
              'MIND: composure under stress (aura tab) · no complaining · positive energy as default · self-talk trained · sleeps 8h.',
              'LIFE ENGINE: building something real (money skills, sport, brand) · calendar has things SHE could be added to, not a void she must fill · independent opinions · says no easily.',
              'DATING SPECIFIC: approaches when he feels the urge (3-second rule) · texts with intent · plans real dates · escalates respectfully · keeps standards (screens, doesn\'t just chase).',
              'The truth of the audit: "most desirable man ever" isn\'t one metric maxed — it\'s no metric neglected. A 7 in everything beats a 10 in one thing and 3s everywhere else. Every 7 here is achievable in months.',
            ]} />
            <ExpandableCard badge="PROVEN" title="Teeth whitening — full protocol" content={[
              'Baseline: electric toothbrush 2×2min, floss nightly, tongue scrape. No whitening beats clean.',
              'Whitening strips (hydrogen peroxide, e.g. Crest 3D): 30 min/day for 2 weeks, then maintenance 1×/week. This is the best value method.',
              'Whitening toothpaste only removes surface stains — fine for maintenance, won\'t shift shade.',
              'Sensitivity? Use potassium-nitrate toothpaste (Sensodyne) during the strip weeks and whiten every OTHER day.',
              'Avoid: charcoal powders (abrasive, erode enamel), lemon/baking-soda hacks (acid = permanent damage).',
              'Stain control: straw for coffee/coke, rinse water after espresso, cut smoking — it undoes everything.',
              'Dentist in-office whitening: fastest and safest big jump if you have the budget. Hygienist clean twice a year regardless.',
            ]} />
            <ExpandableCard badge="PROVEN" title="Tanning — the safe glow playbook" content={[
              'The truth first: a light tan reads as healthy and sharpens muscle definition — but UV damage is cumulative and it\'s THE #1 ager of skin. The goal is the glow without the leather-face at 40.',
              'Gradual sun method: 15-25 min of midday sun on unprotected skin 3-4×/week builds a base tan AND vitamin D, then SPF on after. Never burn — a burn is DNA damage, not "the first step of a tan", and it peels off anyway.',
              'Face exception: your face gets enough incidental sun through the year — keep daily SPF on it and let the body do the tanning. Faces age publicly; bodies don\'t.',
              'Self-tanner is the pro move: gradual-tan lotions (or drops mixed into moisturiser) give a controllable colour with ZERO damage. Exfoliate first, moisturise knees/elbows/ankles, wash palms immediately. Once you dial it in, nobody can tell.',
              'Sunbeds: hard no. Concentrated UVA, massively raised melanoma risk, and premature ageing — the worst looks trade in existence.',
              'Maximise the tan you have: exfoliate weekly (even tan, no patches), moisturise daily (tans fade via dead skin shedding), and beta-carotene foods (carrots, sweet potato) add a real, studied warmth to skin tone.',
              'Contrast bonus: a tan makes teeth look whiter and eyes brighter — time the glow-up stack together before events.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Lifestyle that silently ruins your looks" content={[
              'Sleep debt — under 7h visibly causes: darker under-eyes, duller skin, puffier face, lower gym recovery, higher cortisol (belly fat). One week of 8h sleep is a visible glow-up on its own. It\'s the free supplement stack.',
              'Alcohol — dehydrates skin, bloats the face for 2-3 days, wrecks sleep quality (even 2 drinks), adds empty calories, and lowers test. Nothing on this app out-trains a heavy weekly drinking habit.',
              'Smoking & vaping — accelerated skin ageing, grey undertone, stained teeth, worse healing, hair thinning. The before/after photos of smoker vs non-smoker twins should be mandatory viewing.',
              'Mouth breathing — dries the mouth (breath, cavities), pulls the resting face slack, disrupts sleep. Fix: nasal breathing habit + mewing tab.',
              'Chronic phone posture — forward head + rounded shoulders + downward-tilted face = the posture pattern that ages your silhouette 10 years. Screen to eye level, posture resets (Face tab has the fix).',
              'Sun without SPF — 80-90% of visible facial ageing is UV. Daily SPF is the single best anti-ageing product ever invented, and it costs £10.',
              'Sugar & constant snacking — glycation stiffens collagen (dull, saggier skin over time), spikes acne, and grazing all day keeps insulin high (harder to stay lean).',
              'Doomscrolling before bed — blue light + cortisol spike = worse sleep = everything above. Phone out of the bedroom is a looksmax technique.',
              'Dehydration — even mild dehydration shows in skin and energy. 3L/day baseline, more on training days.',
              'The frame: none of these need perfection. 80/20 discipline on sleep, alcohol, SPF and posture beats any product you can buy.',
            ]} />
            <ExpandableCard badge="PROVEN" title="Facial symmetry — what actually moves it" content={[
              'Perfect symmetry doesn\'t exist and isn\'t the goal — reducing obvious imbalance is.',
              'Chew evenly on BOTH sides. Years of one-sided chewing visibly builds one masseter bigger. Consciously switch sides for months.',
              'Sleep position: face-down or always-one-side smashing your face into the pillow for years contributes to asymmetry. Back sleeping is the fix.',
              'Posture: a head that tilts habitually to one side (check selfies) trains asymmetric neck tension. Film yourself, correct the tilt.',
              'Uneven eyebrows are the most fixable asymmetry — groom to match (see Grooming tab).',
              'Photos exaggerate asymmetry (lens distortion). Judge in a mirror at arm\'s length, not front camera at 30cm.',
            ]} />
            <ExpandableCard badge="HONEST" title="Nose — non-surgical playbook" content={[
              'The nose itself is bone and cartilage — no exercise changes its structure. Anyone selling “nose slimming exercises” is selling nothing.',
              'What you CAN change: the frame around it. Stronger brows, defined jaw, fuller hair and beard styling all make the same nose read smaller.',
              'Debloating helps — the soft tissue over the nose and cheeks puffs like everything else.',
              'Beard/moustache styling changes perceived nose-to-lip balance dramatically. Test with the AI Scan tab.',
              'Camera honesty: front cameras at close range enlarge the nose 20-30%. That\'s distortion, not your face. Step back / use the rear lens.',
              'If it genuinely affects you: rhinoplasty is a real, common option to research with a licensed surgeon — never a decision to rush, never a DIY anything.',
            ]} />
            <ExpandableCard badge="LONG GAME" title="Mewing & maxilla — the honest version" content={[
              'Proper tongue posture: WHOLE tongue (including the back third) pressed to the palate, lips sealed, teeth lightly touching or near, breathe through the nose.',
              'In adults, dramatic bone remodelling is not realistic — the adult maxilla is fused. What mewing DOES give: better resting face (no mouth-breather slack jaw), improved neck/jaw line via posture, nasal breathing benefits.',
              'The under-eye support and cheekbone “lift” people report is mostly posture + decreased bloat + lower body fat arriving together.',
              'Nasal breathing 24/7 is the real win: better sleep quality, less dry mouth, better facial rest tone. Mouth-taping at night (if your nose is clear) trains it.',
              'Chewing hard gum (mastic, falim) 20-30 min/day grows the MASSETER (jaw corner width) — visible in months. It does not widen zygos. Don\'t overdo it: jaw pain = stop.',
            ]} />
            <ExpandableCard badge="LONG GAME" title="Zygos & cheekbones — making them pop" content={[
              'Zygomatic bone size is genetic. What makes cheekbones VISIBLE: body fat under ~15%, debloating, and light grooming contrast (see Style tab).',
              'The zygo-pop protocol (event-day): night before — low sodium, no alcohol, 3L water, 8h sleep slightly elevated. Morning — cold water/ice cube pass over cheeks 60s, then lymphatic massage: firm strokes from nose across the cheekbone to the ear, then down the neck, 2 min per side. Instant sharper midface for the day.',
              'Gua sha / lymphatic massage daily compounds the de-puff: same outward-and-down strokes with light oil so you don\'t drag skin.',
              'Fasted morning cardio (see the running card below) is the single fastest natural "zygo pop" lever — it drops water AND face fat together.',
              'Slight squint-smile in photos engages the cheek muscles and lifts the midface — practice on video; it\'s what most male models are doing.',
              'Hairstyle leverage: shorter sides + volume on top visually widens the upper face where zygos live. Light stubble under the cheekbone line adds shadow contrast that reads as hollows.',
              'Anything claiming to “grow” zygos without surgery is lying to you. Cheekbone implants/fillers exist in the surgical world — research-grade decision, licensed professionals only.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Running & cardio for debloat — the exact prescription" content={[
              'Why it works: cardio sweats out retained water + sodium, drops cortisol (a major water-retainer), moves lymph, and burns the face fat that hides definition. It\'s the most reliable natural face-sharpener there is.',
              'The sweet spot: Zone 2 (conversational pace) 30-45 minutes, 3-4×/week. Roughly 5-7km per run at an easy pace. This maximises fat burn and water loss WITHOUT spiking cortisol.',
              'Avoid the trap: daily long hard runs (10k+ at high effort every day) raise cortisol chronically → water retention and a puffier face. More is not better; consistent-moderate is better.',
              'Fastest visible result: fasted morning walk-jog 30-40 min + water + no breakfast carbs until after — noticeably tighter face by the afternoon. Great before events.',
              'Sprints count double: the football speed work (Football tab) is elite debloat cardio — 6-10 sprints twice a week complements the Zone 2.',
              'Sweat means replace: after sweaty runs, water + electrolytes (a pinch of salt is fine) — rebound bloat comes from drinking plain water in huge amounts after heavy sweating with no minerals.',
              '10k steps daily is the floor under all of it — walking is stealth cardio that keeps lymph moving all day.',
            ]} />
            <ExpandableCard badge="S-TIER" title="Full stretching & posture-fix routine" content={[
              'Posture is the frame every other looksmax hangs on — and it\'s also pain prevention. This is the complete daily routine: 12-15 min. (Your chin-tuck question is answered in its own card below.)',
              'DAILY MOBILITY (morning or post-training): 1) Chin tucks 3×15 · 2) Doorway chest stretch 3×30s · 3) Wall slides 3×10 · 4) Cat-cow ×10 · 5) Thoracic extension over a chair back or foam roller 60s · 6) Couch stretch (hip flexors) 60s per side · 7) Deep squat hold 60s · 8) Hamstring hinge stretch 60s.',
              'STRENGTHEN THE WEAK LINKS (3×/week, after workouts): face pulls 3×15, band pull-aparts 3×20, reverse flys 3×12, glute bridges 3×15, dead bugs 3×10 — the posture muscles that phones and desks switch off.',
              'ANTERIOR PELVIC TILT (arched lower back, butt out, gut pushed forward even when lean): stretch hip flexors + lower back, strengthen glutes + abs. Couch stretch, RKC planks, glute bridges, and consciously "tucking your tailbone" standing tall.',
              'ROUNDED SHOULDERS: tight chest + weak upper back. The doorway stretch + face pulls combo above is the fix — 4-8 weeks of consistency visibly changes how you stand.',
              'FORWARD HEAD: chin tucks + raise every screen to eye level + the phone-at-eye-height habit. Each cm your head sits forward adds ~4-5kg of apparent load on your neck — and it shows in every photo.',
              'THE HOURLY RESET: stand, roll shoulders back and down, chin tuck, deep exhale, 10 seconds. Set a repeating timer — posture is won between workouts, not during them.',
              'Test yourself monthly: wall test (heels, bum, upper back, head all touching a wall — head shouldn\'t strain to reach) and a side-profile photo. Progress photos work for posture exactly like they do for muscle.',
            ]} />
            <ExpandableCard badge="LONG GAME" title="Chin, jawline & hyoid" content={[
              'Jawline = bone + masseter + LOW BODY FAT + tight submental (under-chin) area. Attack all four.',
              'Masseter: hard chewing gum protocol (above) adds real corner-of-jaw width.',
              'Hyoid area (the under-chin/neck angle): this is where the biggest visual wins hide.',
              'Chin tucks: 3×15 daily. Pull your head straight BACK (make a double chin on purpose), hold 3s. Trains deep neck flexors, sharpens the neck-jaw angle over months.',
              'Neck curls: lying on a bench face-up, head off the edge, curl chin to chest slowly, 3×15. Builds the neck and lifts the hyoid region. Start with no weight.',
              'Tongue posture (mewing) keeps the floor of the mouth toned — a dropped tongue = softer under-chin.',
              'A well-groomed beard fading down the neck (neckline just above Adam\'s apple) is an instant jawline on hard mode days.',
            ]} />
            <div className="card-premium p-4">
              <h2 className="font-bold text-base mb-2 text-purple-300">“Why do I feel it in my neck when I chin tuck — and why do my shoulders round?”</h2>
              <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                <p>
                  That feeling is <span className="text-gray-200 font-semibold">exactly what's supposed to happen</span> — and it's diagnostic.
                  Years of forward-head posture (phone, desk) leave the deep neck flexors at the front weak and asleep, while the
                  suboccipitals and upper traps at the back of your neck become short and tight. When you chin tuck, you're
                  <span className="text-gray-200 font-semibold"> stretching those chronically tight muscles at the back and firing the weak ones at the front simultaneously</span> —
                  that pulling/working sensation in the neck into the shoulders is the tissue actually being asked to move for the first time in years.
                </p>
                <p>
                  The rounded shoulders are part of the same pattern (upper crossed syndrome): tight chest + tight upper traps,
                  weak deep neck flexors + weak mid-back (lower traps, rhomboids). The head drifts forward, the shoulders follow it round.
                  It's one system — which is good news, because fixing it is one plan:
                </p>
                <p className="text-gray-300">
                  1) Chin tucks 3×15/day (the feeling fades in 2-3 weeks as the muscles wake up) ·
                  2) Doorway chest stretch 3×30s ·
                  3) Face pulls or band pull-aparts 3×15 on training days ·
                  4) Wall slides 3×10 ·
                  5) Raise your screen to eye level and take a posture reset every 45 min.
                </p>
                <p className="text-gray-600">
                  If you ever get sharp pain, numbness or tingling down the arm (rather than a stretch/work feeling), stop and see a physio — that's a different issue.
                </p>
              </div>
            </div>
            <ExpandableCard badge="FEMALE GAZE" title="What women actually notice — the real ranking" content={[
              'The looksmax forums rank jaw angles and canthal tilt. Women, when actually surveyed and observed, rank differently. Here\'s the honest list, roughly in order:',
              '1. Grooming & effort — clean haircut, tidy facial hair, trimmed nails, no unibrow. Signals self-respect, costs nothing, noticed INSTANTLY.',
              '2. Smell — fragrance + clean clothes + fresh breath. The most memory-linked sense; a great scent gets you described as "that guy who smelled amazing".',
              '3. Skin & teeth — clear-ish skin and a clean smile read as health. Perfection not required; care is.',
              '4. Style & fit — clothes that fit properly outrank expensive clothes and even rank above raw physique for most women.',
              '5. Posture & presence — how you stand, walk and hold eye contact. A 7/10 face with straight posture and calm eyes beats a 9/10 who shuffles and stares at the floor.',
              '6. Physique silhouette — shoulders wider than waist, not being under- or overweight. The V-shape reads through a t-shirt; abs don\'t.',
              '7. THEN face structure — and even here, warmth of expression (smile, eye crinkle) moves attractiveness ratings more than bone measurements do.',
              'The takeaway: the stuff men obsess over ranks LAST, and the stuff that ranks first is all controllable this month. Fix the top 5 before spending one more minute mirror-measuring your jaw.',
            ]} />
            <ExpandableCard badge="FEMALE GAZE" title="Facial harmony — improving the whole, not the parts" content={[
              'Harmony = features working together, and it beats any individual feature. A face is read as a whole in ~100ms; nobody sums up your parts.',
              'The thirds check: hairline→brows, brows→nose base, nose base→chin. Roughly equal reads as balanced. You can\'t move bone, but you CAN shift the visual: fringe/volume adjusts the top third, beard length adjusts the bottom third.',
              'Hairstyle is the #1 harmony tool — it literally reframes the face. This is exactly what the AI Scan tab does: upload a photo, it reads your proportions and names the cuts that balance them. Use it after every major haircut decision.',
              'Beard/facial hair is #2 — a beard can add a chin, slim round cheeks, or balance a strong forehead. Again: AI Scan gives you this personalised.',
              'Brows frame the eyes — tidy (not sculpted) brows sharpen the whole midface. See Grooming tab.',
              'Symmetry habits — even chewing, back sleeping, posture (all covered above) protect harmony long-term.',
              'Expression is part of harmony: a relaxed, slightly amused resting face photographs and reads better than a forced mog stare. Practice in video, not mirrors — mirrors lie, video is how others see you.',
              'Debloat + body fat (top of this tab) sharpen every ratio at once — the highest-leverage harmony move there is.',
            ]} />
            <ExpandableCard badge="MYTH CHECK" title="Hunter eyes, bone smashing & the dark corners" content={[
              'Orbital shape (deep-set “hunter” eyes) is overwhelmingly genetic. The look improves at the margins with: low body fat, fixed sleep (less lid puff), brow grooming for a stronger brow ridge line, and no more squint-avoiding posture.',
              '“Bone smashing” is self-harm dressed as a technique. It does not remodel bone into anything except fracture risk. Hard no.',
              'Eyelid tape / repeated tugging: damages the thinnest skin on your body. No.',
              'The pattern to notice: anything promising bone change without a surgeon is either a body-fat effect in disguise or a lie.',
              'The community\'s real consensus after all the noise: leanness, skin, hair, frame (gym), grooming, style, posture — the “softmaxx” stack — covers 90%+ of achievable change.',
            ]} />
          </>
        )}

        {/* ===== STYLE TAB ===== */}
        {tab === 'style' && (
          <>
            <div className="bg-gradient-to-br from-amber-950/40 to-orange-950/20 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sun size={15} className="text-amber-400" />
                <h2 className="font-bold text-base text-amber-300">Colour & Style Lab</h2>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">Wearing YOUR colours makes skin look clearer and eyes brighter — wearing the wrong ones makes you look tired in the exact same outfit.</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Step 1 — Find Your Undertone</h2>
              <div className="space-y-2">
                {[
                  ['Vein test', 'Look at your inner wrist in daylight. Green veins = warm undertone. Blue/purple = cool. Can\'t tell / both = neutral (lucky — most colours work).'],
                  ['Jewellery test', 'Gold flatters you more = warm. Silver flatters more = cool.'],
                  ['White test', 'Cream/off-white looks better on warm undertones; pure bright white looks better on cool.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Step 2 — Find Your Contrast Level</h2>
              <p className="text-gray-500 text-xs mb-3">Contrast = the difference between your hair, skin and eye darkness. It decides how bold your outfits should be.</p>
              <div className="space-y-2">
                {[
                  ['High contrast (dark hair + light skin, or very dark skin)', 'You can wear bold combos: black & white, navy & camel, strong colour blocking. Muted washed-out fits make YOU look washed out.'],
                  ['Low contrast (hair close to skin tone — blonde/light brown + fair, or dark skin + dark hair)', 'Tonal outfits shine: layers of similar depth (all earth tones, all soft neutrals). Harsh black/white combos overpower your face.'],
                  ['Medium contrast', 'Most flexible — medium-bold combos, one statement piece at a time.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Colour Cheat Sheet</h2>
              <div className="space-y-2">
                {[
                  ['Warm undertone → wear', 'Olive, cream, camel, rust, burnt orange, warm browns, forest green, gold accents. Avoid: icy pastels, stark white, cool grey near the face.'],
                  ['Cool undertone → wear', 'Navy, charcoal, pure white, burgundy, emerald, cool blues, silver accents. Avoid: orange, mustard, warm beige near the face.'],
                  ['Universal bangers', 'Navy and olive flatter nearly everyone. A navy overshirt is the safest style purchase in existence.'],
                  ['Near-the-face rule', 'Your top/collar colour matters 5× more than trousers or shoes — that\'s the colour bouncing light onto your skin.'],
                  ['The 3-colour cap', 'Max three colours per outfit, one of them neutral. More = costume.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Glasses & Sunglasses by Face Shape</h2>
              <p className="text-gray-600 text-xs mb-3">Rule of opposites: frames should contrast your face shape, not repeat it. (The AI Scan tab tells you yours specifically.)</p>
              <div className="space-y-2">
                {[
                  ['Round face', 'Angular frames: squared/rectangular, wayfarers, clubmasters/browlines. Sharp lines add the definition the face lacks. Avoid small round frames — they double the roundness.'],
                  ['Square face', 'Softer frames: round, oval, aviators. Curves balance a strong jaw. Avoid boxy rectangular frames that repeat the angles.'],
                  ['Oval face', 'The cheat code — almost everything works. Wayfarers, aviators, squared: pick by style, keep frame width equal to face width.'],
                  ['Oblong / long face', 'Taller, deeper lenses (aviators, oversized squares) shorten the face. Avoid narrow rectangular slits — they stretch it.'],
                  ['Heart face (wide forehead, narrow chin)', 'Bottom-heavy or rimless frames, aviators, clubmasters with a light lower line. Avoid oversized top-heavy frames.'],
                  ['Diamond face', 'Browline/clubmaster or oval frames — emphasis on the brow balances wide cheekbones. Rimless works well too.'],
                  ['Universal rules', 'Frame width = face width (eyes centred in the lens) · brow line follows your brow, not crossing it · black/tortoise for high contrast colouring, lighter frames for low contrast · quality matters most in sunglasses, it\'s the first thing people see on you outside.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Pick Your Look (archetypes)</h2>
              <p className="text-gray-500 text-xs mb-3">Pick ONE lane and go deep — mixed signals read as no signal. Match it to your build and lifestyle.</p>
              <div className="space-y-3">
                {[
                  ['Clean-Cut / Smart Casual', 'Fitted tees & oxfords, tailored chinos/dark denim, white leather sneakers or loafers, one good watch. Works for: everyone, especially lean/athletic builds. The highest-percentage look with women and workplaces.'],
                  ['Old Money / Quiet Luxury', 'Neutral knits, tailored trousers, quality over logos, loafers, structured coats. Works for: taller/slimmer frames, anyone wanting “put-together and unbothered”.'],
                  ['Streetwear (done right)', 'Clean silhouettes — relaxed (not swimming) fits, quality basics, one statement piece, fresh sneakers. Works for: younger scenes, creative fields. Fit discipline separates it from sloppy.'],
                  ['Rugged / Masculine Casual', 'Dark denim, boots, henleys, flannel overshirts, leather jacket. Works for: broader/muscular builds, beard-friendly. Devastating when it matches an actual gym physique.'],
                  ['Athletic Clean', 'Elevated athleisure — fitted joggers/tech pants, plain quality tees, runners, no gym-branding spam. Works for: muscular builds; the “obviously trains” look without trying.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-amber-300">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Fit Rules That Outrank Everything</h2>
              <div className="space-y-2">
                {[
                  ['Fit > brand > colour > everything', 'A £15 tee that fits your shoulders beats a £90 tee that doesn\'t. Shoulder seam ends AT the shoulder bone.'],
                  ['Sleeves & length', 'Tee sleeves end mid-bicep. Tee length ends mid-fly. Trousers: no pooling at the ankle — one break max.'],
                  ['Shoes carry outfits', 'Clean shoes upgrade everything; beat shoes downgrade everything. Two pairs done well (white sneaker + boot or loafer) cover 95% of life.'],
                  ['Iron/steam', 'Wrinkles read as chaos. A £20 steamer is a cheat code.'],
                  ['Tailor relationship', '£10 alterations turn high-street into looks-expensive. Taper trousers, shorten sleeves, slim shirt sides.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Capsule Wardrobe</h2>
              <p className="text-gray-600 text-xs mb-3">A base rotation that mixes across your archetype — not a pile of one-off fits. Every piece should work with at least three others.</p>
              <div className="space-y-2">
                {[
                  ['The core (buy once, wear everywhere)', '2 fitted plain tees (white, black) · 1 muscle-fit tee in your best colour · dark slim/tapered jeans · neutral chinos or tailored joggers · 1 overshirt (navy or olive) · white leather sneakers · 1 boot or loafer · 1 quality plain hoodie.'],
                  ['The KERS layer', 'Your KERS muscle-fit cuts ARE the statement tees of this system — colour-blocked joggers pair with the plain tees, muscle-fit tops pair with the neutral bottoms. One KERS statement piece per outfit, everything else from the core. That\'s how brand pieces read as style instead of billboard.'],
                  ['The mixing rule', 'Statement piece + two neutrals. Colour-blocked joggers → plain white/black tee + clean sneakers. Muscle-fit colour tee → dark jeans + neutral overshirt. Never two statements fighting.'],
                  ['Buy in outfits, not items', 'Before buying anything new: name three outfits it completes with what you already own. Can\'t name them = don\'t buy it.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Occasion Mapping</h2>
              <p className="text-gray-600 text-xs mb-3">3-4 pieces per occasion, reusing the core. Decide once, never stand in front of the wardrobe confused again.</p>
              <div className="space-y-3">
                {[
                  ['Gym', 'KERS muscle-fit tee + colour-blocked joggers + clean trainers. The training fit IS the brand showcase — this is where muscle-fit belongs by definition.'],
                  ['Casual daytime', 'Plain fitted tee + tapered joggers or dark jeans + white sneakers + overshirt if cold. One KERS piece max, rest neutral.'],
                  ['Night out', 'Best-fitting dark tee or muscle-fit in a deep colour + dark jeans + boots or pristine sneakers + your date fragrance (see Scent tab). Darker palette, sharper lines.'],
                  ['Smart-casual', 'Oxford or polo + chinos + loafers/clean leather sneakers + watch. This is the occasion the joggers sit out.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-amber-300">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">How to Pose</h2>
              <p className="text-gray-600 text-xs mb-3">Posing is a skill, not a genetic trait. Everyone looks better in a good position than a lazy one — including you right now.</p>
              <div className="space-y-2">
                {[
                  ['Weight on the back foot, angled 30-45°', 'Never square to the camera — it flattens and widens you. Turn slightly, weight on the back leg, front leg relaxed with a soft bend at the knee.'],
                  ['Create space between arms and torso', 'A small gap at the armpit — hand in a pocket, thumb hooked on a belt loop, arm resting on something — instantly makes the torso look narrower and the shoulders wider by contrast.'],
                  ['Elongate the neck', 'Chin very slightly forward and down, not tucked or raised. This is the single biggest difference between an awkward photo and a natural one — most bad photos are a bad chin, not a bad face.'],
                  ['Engage, don\'t flex', 'A visible flex reads as trying. A braced core and straight spine reads as natural definition. Squeeze subtly, breathe normally, never suck in obviously.'],
                  ['Hands are the tell', 'Dead-straight arms or fully open flat palms look stiff. Soft bend at the elbow, a slight curl in the fingers, or a hand in a pocket. Busy hands (adjusting a cuff, holding a jacket) look more natural than posed hands.'],
                  ['Weight distribution over both feet is the beginner mistake', 'Standing square and even is what makes photos look like a passport photo. Shift weight onto one leg, hip drops slightly, the whole body reads as relaxed instead of braced.'],
                  ['Practise in a mirror first', 'Nobody looks natural on attempt one. Run through 4-5 positions in a mirror until one feels unforced, then that becomes your default for photos — this is genuinely how it is done professionally.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Taking High-Value Photos</h2>
              <p className="text-gray-600 text-xs mb-3">The camera, the light and the angle decide more than the outfit does.</p>
              <div className="space-y-2">
                {[
                  ['Always use the rear/main camera', 'Front cameras are wide-angle and distort faces up close — bigger nose, smaller ears, warped proportions. Rear camera + a few steps back + zoom in slightly beats any front-facing selfie.'],
                  ['Shoot from chest height, never below', 'A low angle exaggerates the chin and nostrils and shortens the body. Camera at chest-to-eye height, phone held level — not tilted up or down.'],
                  ['Natural light, not overhead artificial', 'Golden hour (the hour after sunrise or before sunset) or bright open shade both flatter skin. Direct overhead sun creates harsh shadows under the eyes and nose; ceiling lights cast unflattering shadows upward.'],
                  ['Face the light source', 'Turn so the light hits your face rather than coming from behind you (which silhouettes you) or directly above (which shadows your eyes). A window is the easiest reliable light source indoors.'],
                  ['Clean background, one focal point', 'A busy background competes with you. Plain walls, nature, or a blurred background (portrait mode) all keep the eye on the subject — which is the point of the photo.'],
                  ['Burst mode or multiple shots, always', 'Take 10-15 shots minimum and pick one. Nobody\'s first shot is their best — this is the actual secret behind photos that look effortless.'],
                  ['Editing: correct, don\'t transform', 'Adjust exposure, warmth and contrast — small, honest tweaks. Heavy filters and face-altering apps are usually obvious and undercut trust the moment you meet someone in person.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Framing the Shot</h2>
              <p className="text-gray-600 text-xs mb-3">Composition is a small number of rules, not talent.</p>
              <div className="space-y-2">
                {[
                  ['Rule of thirds', 'Mentally split the frame into a 3×3 grid and position yourself on one of the intersecting lines rather than dead centre. Off-centre reads as an intentional photo, not a snapshot — most phone cameras can overlay this grid in settings.'],
                  ['Leave headroom, not too much', 'A small gap above the head, not a huge empty void or the top of the head cut off. Too much empty space above makes the subject look small and lost in the frame.'],
                  ['Fill the frame with intention', 'Full body for outfit/physique shots, waist-up for a stronger presence shot, chest-up for a portrait that shows the face clearly. Decide what the photo is FOR before you shoot it.'],
                  ['Vertical for solo, horizontal for context', 'Portrait orientation for a single-subject shot (fits every platform). Landscape when the environment — a stadium, a view, a group — is part of the story.'],
                  ['Depth beats a flat background', 'Standing a few metres in front of a wall or landscape (rather than pressed against it) creates separation and a more professional look, especially with portrait/blur mode.'],
                  ['Leading lines', 'A path, a railing, a row of buildings that draws the eye toward you. Not essential, but it is the difference between a good photo and one that looks considered.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Presenting Yourself in a Positive Light</h2>
              <p className="text-gray-600 text-xs mb-3">What the photo says about you matters more than how sharp it is.</p>
              <div className="space-y-2">
                {[
                  ['A genuine expression beats a perfect one', 'Actually think of something that makes you smile rather than performing a smile — the eyes give away the difference instantly, and people register it even if they cannot say why a photo feels "off".'],
                  ['Context photos out-communicate posed ones', 'A photo mid-activity — training, playing, laughing with people — signals more about your life than any posed shot ever will. This is exactly why the Social Media Presence advice below says "document, don\'t perform".'],
                  ['Consistency across photos builds trust', 'If every photo looks radically different in lighting, editing and vibe, it reads as curated or fake. A consistent style across your set is what makes people trust the version of you they are seeing.'],
                  ['One great photo beats ten average ones', 'Be selective and ruthless. A single genuinely strong photo does more for a first impression than a wall of mediocre ones — this applies to dating profiles, social media and anywhere else you are chosen from photos.'],
                  ['Match the photo to the platform', 'A dating profile needs your face clear and early, plus one full-body and one social/activity shot. Instagram grid tolerates more mood and mystery. LinkedIn wants approachable and sharp, not casual.'],
                  ['The confidence in the photo is doing real work', 'Two technically identical photos — same lighting, same outfit — read completely differently if one has a relaxed, grounded posture and the other looks stiff or unsure. This is the Security and High Value tabs showing up in a still image.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Taking the Photo on iPhone</h2>
              <p className="text-gray-600 text-xs mb-3">Every setting below is either DO or AVOID — no ambiguity. A few taps before you shoot beats any amount of editing after.</p>
              <div className="space-y-2.5">
                {[
                  ['Grid', true, 'ON — permanently', 'Settings → Camera → Grid. Gives you live rule-of-thirds lines so you can place yourself instead of guessing.'],
                  ['Lens choice', true, '1x for normal, 3x for portraits', '3x (or the dedicated portrait lens) compresses perspective and flatters the face — it is why pro portraits use long lenses.'],
                  ['Ultra-wide (0.5x) on people', false, 'NEVER for photos of you', 'It visibly distorts faces and bodies — wider nose, stretched edges. It is a landscape lens. Only use it for scenery.'],
                  ['Front (selfie) camera', false, 'AVOID for anything that matters', 'Wider and lower-quality than the rear camera, and it distorts your features. Hand the phone over or use a timer with the rear camera.'],
                  ['AE/AF Lock', true, 'ON — tap and hold to set it', 'Tap to focus, then hold until "AE/AF LOCK" appears. Stops the phone re-exposing every time you shift, which is what ruins outdoor shots with bright sky behind you.'],
                  ['Exposure slider (the sun icon)', true, 'Adjust manually before shooting', 'After locking focus, drag the little sun up or down. Getting brightness right in-camera always beats rescuing it in editing.'],
                  ['Smart HDR', true, 'Leave ON (auto)', 'Balances a bright sky against a shadowed face automatically. Only turn it off if a specific shot looks flat or over-processed.'],
                  ['Portrait mode', true, 'ON for single-subject shots — but check the depth', 'Blurs the background and isolates you. Open the f-stop control afterwards: f/2.8–4 looks natural, f/1.4 is too aggressive and eats into hair and shoulders.'],
                  ['Shutter', true, 'Volume button or 3s/10s timer', 'Both are steadier than tapping the screen. For timer shots prop the phone properly — never balance-and-hope.'],
                  ['Burst mode', true, 'Use it — 10-15 frames minimum', 'Hold the shutter (or slide left) for a burst. One frame in fifteen will have the right expression; one single shot almost never does.'],
                  ['Zooming in with your fingers', false, 'AVOID — move closer instead', 'Digital zoom between the real lenses just crops and softens the image. Physically step closer, or switch to the actual 3x lens.'],
                  ['Flash', false, 'OFF — almost always', 'Direct phone flash flattens your face, blows out skin and kills all depth. Find better light instead; the only exception is total darkness where the shot is unusable otherwise.'],
                  ['Dirty lens', false, 'Wipe it every time', 'Pocket lint and fingerprints create a hazy, soft look no edit properly fixes. Ten seconds with a t-shirt.'],
                ].map(([t, good, verdict, d]) => (
                  <div key={t as string} className="flex gap-2.5">
                    <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${good ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {good ? '✓' : '✕'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-200">
                        {t as string} — <span className={good ? 'text-emerald-400' : 'text-red-400'}>{verdict as string}</span>
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">{d as string}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Editing: Settings That Actually Help</h2>
              <p className="text-gray-600 text-xs mb-3">Native Photos app only — Edit → the sliders icon. Most "influencer" photos are four sliders, not a filter. Numbers below are actual slider values, in the order to apply them.</p>
              <div className="space-y-2.5">
                {[
                  ['Exposure', true, '±10 to 20', 'Overall brightness. Do this first — everything else builds on it being right.'],
                  ['Brilliance', true, '+10 to 20', 'Lifts shadow detail without blowing out the highlights. The most underused slider on the phone.'],
                  ['Contrast', true, '+10 to 15', 'Adds punch. Combined with a shadow lift, this is the single biggest "why does this look better" change.'],
                  ['Shadows', true, '+10 to 20', 'Stops faces looking muddy in anything but perfect light.'],
                  ['Warmth', true, '+5 to 10', 'A touch warmer flatters skin. Cold blue-tinted photos read as unedited phone-flash shots.'],
                  ['Sharpness', true, '+5 to 10 max', 'A small bump rescues a slightly soft shot — and that is the ceiling.'],
                  ['Vignette', true, '10 to 15, or skip it', 'Very subtle only — it pulls the eye toward you. Anything heavier looks dated.'],
                  ['Crop & straighten', true, 'Always last', 'Recompose for rule-of-thirds and headroom, and straighten the horizon. A tilted horizon reads as sloppy.'],
                  ['Preset filters (Vivid, Dramatic etc.)', false, 'AVOID', 'They hit every value at once and stamp an obvious, dated look on the photo. Manual sliders take 30 seconds more and look ten times better.'],
                  ['Beauty / face-tune filters', false, 'NEVER', 'Skin smoothing and face reshaping are spotted instantly, and they destroy trust the moment someone meets you in person. If skin is the real issue, fix it at source — Blueprint → Skin & Acne Protocol.'],
                  ['Heavy saturation', false, 'AVOID', 'Cranking saturation turns skin orange and is the fastest way to make a good photo look amateur. If you want more colour, use Vibrance sparingly instead.'],
                  ['Over-editing generally', false, 'The tell everyone notices', 'If someone can see it was edited, you went too far. The target is "he just photographs well", not "he knows Lightroom".'],
                ].map(([t, good, verdict, d]) => (
                  <div key={t as string} className="flex gap-2.5">
                    <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${good ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {good ? '✓' : '✕'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-200">
                        {t as string} — <span className={good ? 'text-emerald-400' : 'text-red-400'}>{verdict as string}</span>
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">{d as string}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/15 to-[#111] border border-purple-500/30 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1 text-purple-200">A High-Value Instagram</h2>
              <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                The whole thing rests on one rule: <span className="text-purple-200 font-semibold">a high-value profile is
                evidence of a life, not an advert for one.</span> Everything below is downstream of that. If the life
                is not there yet, build the life first — the grid follows it easily and never works in reverse.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-2.5">
                  <p className="font-black text-[11px] text-emerald-300 mb-1.5">Screams high value</p>
                  <ul className="space-y-1">
                    {['Doing things, not posing', 'Other people in frame', 'Places, travel, competition', 'Posts rarely, all good', 'Looks effortless', 'Ignores the comments'].map(x => (
                      <li key={x} className="text-[10.5px] text-gray-300 leading-snug">· {x}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-2.5">
                  <p className="font-black text-[11px] text-red-300 mb-1.5">Screams trying</p>
                  <ul className="space-y-1">
                    {['Gym mirror selfies ×9', 'Always alone in frame', 'Same room, same wall', 'Posts daily, all filler', 'Visibly staged', 'Deletes low-like posts'].map(x => (
                      <li key={x} className="text-[10.5px] text-gray-400 leading-snug">· {x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">The Build — profile, grid, cadence</h2>
              <p className="text-gray-600 text-xs mb-3">In order. Do the profile once, then it is just feeding the grid.</p>
              <div className="space-y-2">
                {[
                  ['Profile photo', 'A clear, well-lit shot of your face — 3x lens, natural light, slight smile. Not a group photo, not sunglasses, not a landscape. It is the one image everyone sees at 40 pixels wide, so it has to read instantly.'],
                  ['Bio: one line, specific, no emoji soup', 'What you actually do plus one human detail. "Economics @ [uni] · football · lifting" beats any quote, any set of emojis, any "living my best life". Vague bios read as having nothing to say.'],
                  ['The first nine tiles are your whole profile', 'Almost nobody scrolls past row three. Those nine should show: your face clearly (2), you doing something (3), you with other people (2), and something that is not about you at all (2) — a place, a view, a match. That mix alone reads as a full life.'],
                  ['One visual lane, held consistently', 'Similar light, similar edit, similar tones across posts. Not a filter — just the same editing approach every time. Consistency is what separates a profile that looks considered from a camera roll dump.'],
                  ['Cadence: 1-2 posts a week, maximum', 'Posting daily guarantees filler, and filler is what makes a profile look try-hard. Fewer, better posts read as selective — which is the whole signal.'],
                  ['Grid vs stories — never invert them', 'Grid = the small number of things you would show a stranger. Stories = loose, real-time, unpolished, disposable. Putting polished content in stories and raw content on the grid gets it exactly backwards.'],
                  ['Captions: short or nothing', 'One line, dry, or no caption at all. Long explanatory captions about your journey undercut the photo. Let the image carry it.'],
                  ['Highlights: 3-4 max, cleanly named', 'Training, travel, a hobby, maybe friends. Fifteen highlight bubbles is clutter — it reads as archiving your life for an audience rather than living it.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Post Ideas That Actually Signal</h2>
              <p className="text-gray-600 text-xs mb-3">Steal these directly. Each one communicates something a posed selfie cannot.</p>
              <div className="space-y-2">
                {[
                  ['Mid-action sport', 'Playing football, padel, sparring — shot by someone else, ideally mid-movement. Signals competence and a physical life in one frame. Ask a mate to take 20 during a game; two will be excellent.'],
                  ['The post-match / post-session group shot', 'You and the lads after playing, all still kitted up. Social proof plus activity plus genuine expressions — one of the highest-signal photos available and it costs nothing to take.'],
                  ['Somewhere that is not your bedroom', 'A city, a coastline, a bar, a pitch, a gym that is not the same corner every time. Varied backgrounds are what make a life look big; the same bedroom wall makes it look small.'],
                  ['Doing the hobby, not announcing it', 'Hands on the ball, at the wheel, cooking, at a desk mid-work. Process shots beat result shots because they look unstaged.'],
                  ['A genuinely good outfit, in daylight, full-length', 'One a month, taken by someone else, outdoors, from chest height. This is the shot that shows the wardrobe work from this tab is real.'],
                  ['A photo where you are laughing at something off-camera', 'Not at the lens. Caught expressions read as real; posed smiles read as performed. This one photo does more for likability than anything else on this list.'],
                  ['Something with zero people in it', 'A view, food, a pitch at night, a car. It breaks up the grid and quietly says you notice things beyond yourself — a profile that is 100% you reads as self-obsessed however good the photos are.'],
                  ['A milestone, understated', 'A result, a PB, an offer — stated flatly with no build-up, or just shown. Understating an achievement lands harder than announcing it, every time.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">The Things That Kill It</h2>
              <p className="text-gray-600 text-xs mb-3">Every one of these is legible effort — and legible effort asking for a response is the opposite of the signal you want.</p>
              <div className="space-y-2">
                {[
                  ['Gym mirror selfies as your identity', 'One occasionally is fine. A grid of them says the gym is the only thing in your life and that you took every photo yourself. Get someone else to shoot you training instead — it changes the read completely.'],
                  ['Obvious thirst traps', 'Shirtless with a caption pretending it is about something else. Everyone clocks it, and it moves you from "interesting" to "available" instantly.'],
                  ['Sad-posting or vague-posting', 'Cryptic lyrics, moody captions aimed at one specific person who will know. The most visible neediness there is, and it is read as such by everyone including the target.'],
                  ['Deleting posts that underperformed', 'It means the like count is running your decisions. Post it because you liked it; let it sit there regardless of the number.'],
                  ['Checking who viewed your story', 'The neediness loop with a nicer interface. If you would not admit to doing it, that is your answer.'],
                  ['Spending all your attention on one person', 'Viewing every story within seconds, liking every post. Attention is the currency — spend all of it in one place and yours is worth nothing.'],
                  ['Buying followers or engagement', 'The ratio is visible and the comments are obviously fake. It reliably makes you look less credible, not more.'],
                  ['Building the grid instead of the life', 'The honest warning: if the profile is the project rather than the record, that is visible too — and it is the same neediness in a different outfit.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-purple-500/25 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1 text-purple-200">The 30-day reset</h2>
              <div className="space-y-2">
                {[
                  ['Week 1 — clear the deck', 'Archive (do not delete) anything that is low quality, thirsty, or from a version of you that no longer applies. Getting to nine strong tiles by removal is faster than by posting.'],
                  ['Week 1 — fix the fixed bits', 'New profile photo, one-line bio, highlights cut down to three or four. Twenty minutes, done once.'],
                  ['Weeks 2-4 — shoot deliberately', 'Every time you play, travel, go out or wear something good, get someone to take 15 photos. You are building a bank, not posting live. Most of them will be bad and that is the point.'],
                  ['Weeks 2-4 — post twice a week from the bank', 'Never post the day you shoot. Pick the best frame a few days later when you are less attached to it — your judgement is far better cold.'],
                  ['The ongoing rule', 'Live the week, capture a bit of it, post the best of that. In that order. The moment it inverts and you are doing things to post them, the signal dies and everyone can tell.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'grooming' && (
          <>
            <div className="bg-[#111] border border-green-500/20 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1 text-green-400">Eyebrow Shaping Guide</h2>
              <p className="text-gray-500 text-xs mb-3">Under-groomed is always better than over-plucked. Start conservatively.</p>
              <div className="space-y-2.5">
                {[
                  { step: 'Shape Blueprint', text: 'Start: directly above inner corner of the eye. Arch: above the outer third of the iris. Tail: 45° line from nose tip through outer corner of eye.' },
                  { step: 'Tools', text: 'Angled tweezers for precision, small curved scissors for length, clear brow gel for setting.' },
                  { step: 'Filling', text: 'Use a pencil one shade lighter than your hair. Apply feathery strokes following natural hair direction. Never block fill — looks unnatural.' },
                  { step: 'Setting', text: 'Clear brow gel (e.g. Benefit Gimme Brow or Boy Brow) sets and holds all day. Tinted gel for depth and density.' },
                  { step: 'Method', text: 'Threading is preferred over waxing — more precise, less skin irritation, cleaner lines.' },
                  { step: 'Frequency', text: 'Touch up stray hairs every 1-2 weeks. Full professional shape every 4-6 weeks.' },
                ].map(({ step, text }) => (
                  <div key={step} className="bg-white/5 rounded-xl px-3 py-2.5">
                    <p className="font-bold text-xs text-green-400 mb-0.5">{step}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Beard by Face Shape</h2>
              <div className="space-y-2.5">
                {[
                  { shape: 'Round', beard: 'Goatee or chin strap — adds length and definition. Avoid full, wide beards that widen further.' },
                  { shape: 'Square', beard: 'Clean-shaven or light stubble shows off strong jaw. Medium full beard also works — soften angular jaw with rounded beard shaping.' },
                  { shape: 'Oval', beard: 'Almost anything works. Short boxed beard or stubble for versatility. Avoid very long beards that elongate further.' },
                  { shape: 'Heart', beard: 'Full beard with length at chin to balance wide forehead. Avoid very short beard that emphasises narrow chin.' },
                  { shape: 'Oblong / Long', beard: 'Keep beard short at chin, fuller at sides. Mutton chops add width. Avoid long chin beards that elongate.' },
                  { shape: 'Diamond', beard: 'Full beard adds width at jaw and chin, balancing wide cheekbones. Avoid narrow chin straps.' },
                  { shape: 'Triangle', beard: 'Keep full and wide at jaw to add width matching the broader lower face. Avoid thin, narrow beards.' },
                ].map(({ shape, beard }) => (
                  <div key={shape} className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="font-semibold text-sm text-orange-400">{shape} Face</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{beard}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Beard Care Protocol</h2>
              <div className="space-y-2">
                <ExpandableCard title="Growing It Out — First 4 Weeks" content={[
                  'Let it grow for at least 4 weeks before the first proper trim.',
                  'Reveals natural growth pattern — direction, density, patchiness.',
                  'Resist trimming — most men trim too early and never see full potential.',
                  'Itching in weeks 1-2 is normal — beard oil will help immediately.',
                ]} />
                <ExpandableCard title="Minoxidil for Patchy Beards" badge="6-12 MONTHS" content={[
                  'Apply minoxidil 5% to beard area (patchy cheeks) once or twice daily.',
                  'Takes 6-12 months of consistent use for significant results.',
                  'Many men grow full beards from very patchy starts.',
                  'Once you stop, growth from minoxidil may reduce — long-term commitment.',
                  'Side effects minimal for beard application.',
                ]} />
                <ExpandableCard title="Beard Oil & Balm" content={[
                  'Beard oil daily: apply 3-4 drops to palm, rub through beard after shower.',
                  'Best bases: jojoba oil (closest to skin sebum), argan oil (shine + softness).',
                  'Beard balm for shaping: beeswax base. Apply to dry beard, shape with comb.',
                  'Oil first for conditioning, balm over top for styling.',
                ]} />
                <ExpandableCard title="Lines & Maintenance" content={[
                  'Neck line: two finger-widths above Adam\'s apple. Everything below gets shaved clean.',
                  'Cheek line: only remove truly stray hairs above the natural line.',
                  'Line up weekly with trimmer and foil shaver for clean edges.',
                  'Full length trim + blending monthly.',
                  'Clean neck every 3 days to keep the line sharp.',
                ]} />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Teeth</h2>
              <div className="space-y-2">
                {[
                  { name: 'Electric Toothbrush', freq: 'Twice daily', text: '2 full minutes, 30s per quadrant. 100% more plaque removed than manual. Oral-B or Philips Sonicare.' },
                  { name: 'Whitening Strips', freq: 'Biweekly', text: 'Crest 3D Whitestrips or equivalent. 30-min application. Avoid eating for 30 min after.' },
                  { name: 'Oil Pulling', freq: 'Morning daily', text: 'Swish 1 tbsp coconut oil for 10-20 minutes before brushing. Removes bacteria, whitens gently over time.' },
                  { name: 'Tongue Scraper', freq: 'Every morning', text: 'Eliminates bacterial biofilm causing bad breath. Scrape from back to front 5-7 times before brushing.' },
                  { name: 'Purple Toning Mouthwash', freq: 'Weekly', text: 'Purple neutralises yellow tones. Rinse for 60s. Do not use daily — can temporarily stain.' },
                ].map(({ name, freq, text }) => (
                  <div key={name} className="bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-sm">{name}</p>
                      <span className="text-green-400 text-xs font-bold">{freq}</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Nails</h2>
              <div className="space-y-1.5">
                {[
                  'File nails to a clean, even edge every week — do not rip or bite.',
                  'Soak hands in warm water for 5 min, then gently push back cuticles.',
                  'Hand cream daily (morning or after washing hands) — dry hands age you.',
                  'Keep all nails the same length — one long nail is worse than none.',
                  'Buff the surface lightly to remove ridges and add subtle gloss.',
                  'Toenails: cut straight across, not curved, to prevent ingrown nails.',
                ].map((item, i) => (
                  <p key={i} className="text-gray-300 text-sm">· {item}</p>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Body Hair</h2>
              <div className="space-y-2">
                {[
                  { zone: 'Chest / Stomach', rec: 'Body groomer to 3-5mm for maintained look. Full shave if lean physique. Waxing lasts 4-6 weeks for smooth finish.' },
                  { zone: 'Back', rec: 'Back shaver (BaKblade) or get waxed — back hair is universally disliked. Wax lasts 4-6 weeks.' },
                  { zone: 'Arms / Legs', rec: 'Generally leave unless very dark and dense. Trim with body groomer on 6mm setting if bothered.' },
                  { zone: 'Eyebrows', rec: 'Clean between brows (monobrow) with tweezers. Do NOT shave — regrows bluntly.' },
                  { zone: 'Nose / Ears', rec: 'Nose hair trimmer weekly. Ear hair — pluck with tweezers or trim. Non-negotiable grooming.' },
                ].map(({ zone, rec }) => (
                  <div key={zone} className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="font-semibold text-sm text-green-400">{zone}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== FRAGRANCE TAB ===== */}
        {tab === 'fragrance' && (
          <>
            <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/20 border border-indigo-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Wind size={15} className="text-indigo-400" />
                <h2 className="font-bold text-base text-indigo-300">Fragrance Masterclass</h2>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">Scent is the most underrated looksmax tool. The right fragrance is remembered long after you've left the room.</p>
            </div>

            {/* AI Layering Lab */}
            <div className="card-premium p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-indigo-400" />
                <h2 className="font-bold text-base">AI Layering Lab</h2>
              </div>
              <p className="text-gray-500 text-xs mb-3">Type the fragrances you own (one per line or comma-separated) — AI designs your best combos.</p>
              <textarea
                value={fragInput}
                onChange={e => setFragInput(e.target.value)}
                placeholder={'e.g.\nVersace Eros EDT\nDior Sauvage EDP\nJPG Le Male Le Parfum'}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
              />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {['any', 'summer', 'winter', 'spring', 'autumn'].map(s => (
                  <button key={s} onClick={() => setFragSeason(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-all ${
                      fragSeason === s ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                    }`}>
                    {s === 'any' ? 'Any season' : s}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {['any', 'day', 'night', 'date', 'gym', 'formal'].map(o => (
                  <button key={o} onClick={() => setFragOccasion(o)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-all ${
                      fragOccasion === o ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                    }`}>
                    {o === 'any' ? 'Any occasion' : o}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleLayering(false)}
                  disabled={layeringBusy || !fragInput.trim()}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {layeringBusy ? <><Loader2 size={15} className="animate-spin" /> Mixing…</> : 'Build My Combos'}
                </button>
                {layering && (
                  <button
                    onClick={() => handleLayering(true)}
                    disabled={layeringBusy || !fragInput.trim()}
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 disabled:opacity-40 text-purple-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    🎲 Mix
                  </button>
                )}
              </div>
              {layeringError && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle size={12} /> {layeringError}</p>
              )}
              {layering && (
                <div className="mt-4 space-y-3">
                  {layering.combos.map(c => (
                    <div key={c.name} className="bg-black/30 border border-indigo-500/15 rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-bold text-sm text-indigo-300">{c.name}</p>
                        <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/25">{c.when}</span>
                      </div>
                      <p className="text-gray-300 text-xs mb-1"><span className="text-gray-500">Base:</span> {c.base}</p>
                      <p className="text-gray-300 text-xs mb-1"><span className="text-gray-500">Over it:</span> {c.top}</p>
                      <p className="text-gray-300 text-xs mb-1.5"><span className="text-gray-500">Ratio:</span> {c.ratio}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{c.vibe}</p>
                    </div>
                  ))}
                  <div className="bg-black/30 border border-white/8 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1.5"><span className="font-bold text-gray-200">Best worn solo:</span> {layering.soloAdvice}</p>
                    <p className="text-xs text-gray-400"><span className="font-bold text-gray-200">Next bottle to unlock combos:</span> {layering.shoppingTip}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Layering rules */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Layering Rules</h2>
              <div className="space-y-2">
                {[
                  ['Share a bridge note', 'Two fragrances layer well when they share a note (vanilla, iris, bergamot…). No bridge = two songs playing at once.'],
                  ['Heavy first, fresh on top', 'Spray the denser/sweeter scent on skin first, the fresher one over it. Fresh over sweet lifts; sweet over fresh smothers.'],
                  ['One loud voice max', 'Never layer two beast-mode gourmands. Pair a statement scent with a quieter partner (musk, iris, clean woods).'],
                  ['Split locations', 'Base on chest/torso, top scent on neck/wrists — they blend in your scent cloud instead of fighting on the same skin.'],
                  ['Test at home first', 'Every combo gets a home-day trial before a date-day debut.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Most complimented */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1">Most Complimented Men's Fragrances</h2>
              <p className="text-gray-600 text-xs mb-3">The compliment-magnet tier, based on years of community consensus. Test before you buy.</p>
              <div className="space-y-2">
                {[
                  ['Jean Paul Gaultier Le Male Le Parfum', 'Vanilla-iris-lavender. Possibly the highest compliment rate in the game. Date-night nuke.'],
                  ['Versace Eros EDP', 'Mint, vanilla, tonka. Young, sweet, loud — a club classic for a reason.'],
                  ['Dior Sauvage Elixir', 'Spicy-woody powerhouse. 2 sprays last all day. The safest blind buy in masculine perfumery.'],
                  ['Yves Saint Laurent Y EDP', 'Apple, sage, amberwood. Clean “successful guy” smell — office through evening.'],
                  ['Emporio Armani Stronger With You Intensely', 'Toffee, vanilla, chestnut. Cosy-sweet compliment machine for autumn/winter.'],
                  ['Azzaro The Most Wanted EDP', 'Cardamom over bourbon-vanilla amber. Nightlife specialist.'],
                  ['Bleu de Chanel EDP', 'Citrus-woody perfection. Zero occasions where it\'s wrong.'],
                  ['Valentino Uomo Born In Roma Intense', 'Vanilla-lavender-leather. Smooth, modern, extremely date-friendly.'],
                ].map(([name, note]) => (
                  <div key={name} className="flex items-start gap-2.5">
                    <Check size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-gray-200">{name}</p>
                      <p className="text-gray-500 text-xs">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concentrations */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Concentration Guide</h2>
              <div className="space-y-2">
                {[
                  { conc: 'Parfum / Extrait', pct: '20-40%', hours: '12-24h', note: 'Longest lasting. Usually 1-2 sprays max. Best for evenings, dates, formal occasions. Worth the price.' },
                  { conc: 'Eau de Parfum (EDP)', pct: '15-20%', hours: '6-12h', note: 'Best balance of longevity and price. Most premium releases are EDP. Versatile — day and night.' },
                  { conc: 'Eau de Toilette (EDT)', pct: '5-15%', hours: '3-6h', note: 'Lighter, better for warm weather and daytime. Often sharper opening notes. Re-apply mid-day.' },
                  { conc: 'Eau de Cologne (EDC)', pct: '2-4%', hours: '1-3h', note: 'Lightest concentration. Great for gym, casual days. Best applied generously. Old Spice, 4711.' },
                ].map(({ conc, pct, hours, note }) => (
                  <div key={conc} className="bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-sm text-indigo-300">{conc}</p>
                      <div className="flex gap-2">
                        <span className="text-orange-400 text-xs font-bold">{pct}</span>
                        <span className="text-gray-500 text-xs">{hours}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fragrance Families */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Fragrance Families</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { family: 'Citrus / Aquatic', desc: 'Fresh, light, energetic. Best for mornings, gym, casual summer. Bleu de Chanel EDT, Acqua di Giò.' },
                  { family: 'Woody / Sandalwood', desc: 'Warm, masculine, versatile. Day to evening. Tom Ford Oud Wood, Dior Sauvage, Y YSL.' },
                  { family: 'Oriental / Amber', desc: 'Rich, warm, seductive. Best for evening, date nights, cold weather. La Nuit de l\'Homme.' },
                  { family: 'Fougère', desc: 'Classic barbershop accord: lavender, oakmoss, coumarin. Versatile, masculine, office-safe.' },
                  { family: 'Gourmand', desc: 'Sweet, dessert-like: vanilla, caramel, tonka. Evening/date use. A.H. Baccarat Rouge 540.' },
                  { family: 'Chypre', desc: 'Mossy, earthy, elegant. Sophisticated and classic. Great for formal occasions.' },
                  { family: 'Floral / Rose', desc: 'Can work powerfully for men — bold and non-conformist. Creed Original Vetiver, Gucci Guilty.' },
                  { family: 'Spicy / Leather', desc: 'Bold, projection-heavy. Evening and cold weather. Tobacco Oud, Habit Rouge, Fahrenheit.' },
                ].map(({ family, desc }) => (
                  <div key={family} className="bg-white/5 rounded-xl p-3">
                    <p className="font-bold text-xs text-indigo-300 mb-1">{family}</p>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Season / Occasion Guide */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Season & Occasion Guide</h2>
              <div className="space-y-2">
                {[
                  { season: 'Spring', icon: '🌿', note: 'Light florals, citrus, fresh woods. Moderate projection. Dior Sauvage EDT, Gucci Guilty, Issey Miyake.' },
                  { season: 'Summer', icon: '☀️', note: 'Aquatic, citrus, light. Heat amplifies projection — go lighter. Acqua di Giò, Bleu de Chanel EDT, Cool Water.' },
                  { season: 'Autumn', icon: '🍂', note: 'Spicy, woody, warm ambers begin. Vetiver, tobacco notes. Dior Homme Intense, Paco Rabanne 1 Million.' },
                  { season: 'Winter', icon: '❄️', note: 'Heavy orientals, leather, oud. Cold air needs strong projection. Spicebomb Extreme, La Nuit de l\'Homme.' },
                ].map(({ season, icon, note }) => (
                  <div key={season} className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="font-semibold text-sm">{icon} {season}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                {[
                  { occ: 'Work / Office', note: 'Light, non-invasive. EDT strength. 2-3 sprays. Avoid heavy orientals. Prada Luna Rossa, Polo Blue.' },
                  { occ: 'Casual / Daytime', note: 'Versatile, fresh, moderate. 3-4 sprays. Almost any well-liked mainstream works here.' },
                  { occ: 'Date Night', note: 'Warm, sensual, projection. EDP strength. 2-3 sprays. La Nuit, Black Orchid, Oud Wood.' },
                  { occ: 'Formal Event', note: 'Classic, sophisticated, clean. A scent everyone can appreciate. Bleu de Chanel Parfum, Givenchy Gentleman.' },
                ].map(({ occ, note }) => (
                  <div key={occ} className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="font-semibold text-sm text-orange-400">{occ}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Technique */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Application Technique</h2>
              <div className="space-y-2">
                {[
                  { n: '1', t: 'Shower first', d: 'Clean, hydrated skin holds fragrance the longest. Apply within 5 minutes of showering while skin is still slightly warm.' },
                  { n: '2', t: 'Unscented moisturiser', d: 'Apply unscented lotion or Vaseline to pulse points before fragrance. Scent binds to oils — this extends longevity significantly.' },
                  { n: '3', t: 'Pulse points', d: 'Inner wrists, neck (sides), behind ears, inner elbows, chest. These areas produce heat that projects scent outward.' },
                  { n: '4', t: 'Correct distance', d: 'Hold bottle 15-20cm from skin. Too close = oversaturated patch. Too far = misses skin.' },
                  { n: '5', t: 'Spray count', d: 'EDP: 2-3 sprays. EDT: 3-4 sprays. Parfum: 1-2 sprays. Fresh/light: 4-5 sprays (EDC). Do not douse.' },
                  { n: '6', t: 'Do not rub', d: 'Never rub wrists together — this breaks the top notes and flattens the fragrance pyramid.' },
                  { n: '7', t: 'Clothes spraying', d: 'Spraying on fabric extends longevity dramatically. Test on an inconspicuous area first — some fragrances can stain.' },
                  { n: '8', t: 'Reapplication', d: 'For EDT: carry a sample/decant for midday reapplication. Apply to neck or chest. Avoid layering over stale scent — shower if possible.' },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                    <span className="text-indigo-400 font-black text-sm flex-shrink-0">{n}</span>
                    <div>
                      <p className="font-semibold text-sm">{t}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Bottle Wardrobe */}
            <div className="bg-[#111] border border-indigo-500/20 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-1 text-indigo-300">The 5-Bottle Wardrobe</h2>
              <p className="text-gray-500 text-xs mb-3">Build this over time. These 5 archetypes cover every situation.</p>
              <div className="space-y-2.5">
                {[
                  { slot: 'Fresh Daily', desc: 'Aquatic or citrus EDT for everyday, office, casual. Inoffensive to everyone.', eg: 'Acqua di Giò, Bleu de Chanel EDT' },
                  { slot: 'Work Professional', desc: 'Clean, sophisticated, low projection. Respected, not noticed for scent.', eg: 'Prada Luna Rossa, Polo Blue EDP' },
                  { slot: 'Warm Evening / Date', desc: 'Sensual, projecting EDP for evenings. The one that gets compliments.', eg: 'La Nuit de l\'Homme, Dior Homme Intense' },
                  { slot: 'Winter Power', desc: 'Heavy oriental or leather for cold months. Maximum longevity.', eg: 'Spicebomb Extreme, Black Orchid, Oud Wood' },
                  { slot: 'Signature Unique', desc: 'Something niche, unusual, that becomes your scent identity.', eg: 'Maison Margiela Replica, Aventus, Baccarat Rouge 540' },
                ].map(({ slot, desc, eg }) => (
                  <div key={slot} className="bg-white/5 rounded-xl p-3">
                    <p className="font-bold text-sm text-indigo-300">{slot}</p>
                    <p className="text-gray-300 text-xs mt-0.5">{desc}</p>
                    <p className="text-gray-600 text-xs mt-1">e.g. {eg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testing & Buying Guide */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Testing & Buying Guide</h2>
              <div className="space-y-2">
                <ExpandableCard title="How to Test Properly" content={[
                  'Never buy on first spray — your nose is overwhelmed after 3-4 sniffs. Come back.',
                  'Spray on wrist, walk around for 30 minutes before judging.',
                  'What smells amazing in the bottle often opens harsh — trust the dry-down, not the top notes.',
                  'Test a maximum of 3 fragrances per visit. More and you lose discrimination.',
                  'Request samples or decants — wear at home for a full day before committing.',
                  'Ask for cards for the first few — sniff them hours later to see the base notes.',
                ]} />
                <ExpandableCard title="Decants First" content={[
                  'Sites like Scent Split, Fragrances of the World, DecantX sell 5-10ml samples.',
                  'Wear for a week before buying a full bottle — context matters (work, date, season).',
                  'This method prevents wasted money on 50ml bottles you never wear.',
                  'Build your bottle collection based only on decants you loved AND finished.',
                ]} />
                <ExpandableCard title="Layering" content={[
                  'Two fragrances can be combined on skin for a unique accord.',
                  'Apply the heavier/base-note-rich scent first, lighter scent on top.',
                  'Safe combinations: woods + vanilla; citrus + musk; amber + spice.',
                  'Start with 1 spray of each — layering amplifies projection.',
                  'Experiment on less important days — not before an event.',
                ]} />
                <ExpandableCard title="Storage" content={[
                  'Store in a cool, dark place — UV light and heat degrade fragrance molecules.',
                  'Do not store in the bathroom — humidity and temperature changes destroy quality.',
                  'Drawer, cupboard, or box away from windows is ideal.',
                  'Avoid shaking bottles — introduces oxygen and accelerates oxidation.',
                  'Once opened, most fragrances last 3-5 years if stored correctly.',
                ]} />
              </div>
            </div>
          </>
        )}

        {/* ===== TRACKER TAB ===== */}
        {tab === 'tracker' && (
          <>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sun size={15} className="text-orange-400" />
                <h2 className="font-bold text-base">Morning Routine</h2>
              </div>
              <div className="space-y-2 mt-3">
                {MORNING_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left ${
                      checklist[item.id]
                        ? 'bg-green-500/10 border-green-500/30 text-green-300'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checklist[item.id] ? 'bg-green-500 border-green-500' : 'border-gray-600'
                    }`}>
                      {checklist[item.id] && <Check size={12} />}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Moon size={15} className="text-purple-400" />
                <h2 className="font-bold text-base">Evening Routine</h2>
              </div>
              <div className="space-y-2 mt-3">
                {EVENING_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left ${
                      checklist[item.id]
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checklist[item.id] ? 'bg-purple-500 border-purple-500' : 'border-gray-600'
                    }`}>
                      {checklist[item.id] && <Check size={12} />}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={15} className="text-blue-400" />
                <h2 className="font-bold text-base">Weekly Checklist</h2>
              </div>
              <div className="space-y-2 mt-3">
                {WEEKLY_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left ${
                      checklist[item.id]
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checklist[item.id] ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
                    }`}>
                      {checklist[item.id] && <Check size={12} />}
                    </div>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {(item.id === 'dermaroll_scalp' || item.id === 'dermaroll_brows') && (
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {item.id === 'dermaroll_scalp' ? daysSinceStr(dermaroll.scalp) : daysSinceStr(dermaroll.brows)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Dermaroll Log</h2>
              <div className="space-y-2">
                {[
                  { key: 'scalp', label: 'Scalp — 0.5mm', sub: 'Weekly · wait 24h before minoxidil', date: dermaroll.scalp },
                  { key: 'brows', label: 'Brows — 0.25mm', sub: 'Weekly · apply serum immediately after', date: dermaroll.brows },
                ].map(({ key, label, sub, date }) => (
                  <div key={key} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-gray-500 text-xs">{sub}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        !date ? 'text-gray-500'
                        : daysSinceStr(date) === 'Today' ? 'text-green-400'
                        : 'text-orange-400'
                      }`}>
                        {daysSinceStr(date)}
                      </p>
                      <p className="text-gray-600 text-xs">Last rolled</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-3 text-center">Tap weekly checklist items above to update log dates</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-sm mb-3 text-gray-400">Today's Summary</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { done: morningDone, total: MORNING_ITEMS.length, label: 'Morning', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                  { done: eveningDone, total: EVENING_ITEMS.length, label: 'Evening', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                  { done: weeklyDone, total: WEEKLY_ITEMS.length, label: 'Weekly', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                ].map(({ done, total, label, color, bg }) => (
                  <div key={label} className={`${bg} border rounded-xl p-3 text-center`}>
                    <p className={`text-2xl font-black ${done === total ? color : 'text-white'}`}>{done}/{total}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                Complete Looksmax Checklist
              </h2>
              <p className="text-gray-500 text-xs mb-3">Everything a person can do to look broadly better — the master list.</p>
              <div className="space-y-1">
                {[
                  ['Hair', [
                    'Minoxidil 5% twice daily',
                    'Finasteride 1mg daily (GP prescription)',
                    'Ketoconazole shampoo 2-3×/week',
                    'Dermaroll scalp 0.5mm weekly',
                    'Castor oil + serum on brows nightly',
                  ]],
                  ['Face', [
                    'Mewing — correct tongue posture 24/7',
                    'Mastic gum 30-60 min daily (masseter)',
                    'Niacinamide 10% daily (redness + pigment)',
                    'Vitamin C serum every morning',
                    'SPF 50 every morning without fail',
                    'Retinol 3× per week (cell turnover)',
                    'Azelaic acid (pigmentation spots)',
                    'Ceramide moisturiser (barrier repair)',
                  ]],
                  ['Eyes', [
                    'Cold spoons every morning (puffiness)',
                    'Caffeine eye cream daily (dark circles)',
                    'Lumify drops for occasions (whitening)',
                    '8+ hours sleep (biggest eye brightener)',
                    'Castor oil on lash line nightly',
                  ]],
                  ['Lips', [
                    'SPF lip balm every morning',
                    'Overnight lip mask every night',
                    'Weekly lip scrub (sugar + coconut oil)',
                    'Hydration 3L+/day (dry lips = dehydrated)',
                  ]],
                  ['Posture', [
                    'Chin tucks 3×15 daily (forward head)',
                    'Face pulls 3×15 daily (rounded shoulders)',
                    'Band pull-aparts 3×15 daily',
                    'Hip flexor stretch 60s/side daily (APT)',
                    'Glute bridges 3×15 daily (APT)',
                  ]],
                  ['Grooming', [
                    'Electric toothbrush 2× daily',
                    'Tongue scraper every morning',
                    'Whitening strips biweekly',
                    'Eyebrows shaped professionally every 4-6 weeks',
                    'Nose and ear hair trimmed weekly',
                    'Nails filed weekly',
                    'Body hair managed (back, chest)',
                  ]],
                  ['Body', [
                    'Body fat below 12% (reveals face structure)',
                    'Neck training 2×/week (frames the jaw)',
                    'Trap development (shrugs, farmers)',
                    'Full physique development for V-taper',
                    'Hydration 3L+/day',
                  ]],
                  ['Fragrance', [
                    '5-bottle wardrobe built over time',
                    'Unscented moisturiser before fragrance',
                    'Correct pulse point application',
                    'Season-appropriate fragrance chosen',
                    'Decant tested before buying full bottle',
                  ]],
                ].map(([category, items]) => (
                  <div key={category as string} className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{category as string}</p>
                    {(items as string[]).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 py-0.5">
                        <span className="text-purple-500 text-xs mt-0.5 flex-shrink-0">▸</span>
                        <p className="text-gray-300 text-xs leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
