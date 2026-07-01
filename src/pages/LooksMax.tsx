import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { analyseFace } from '../lib/generators';
import type { FaceAnalysisResult } from '../lib/generators';
import {
  ArrowLeft, ChevronDown, ChevronUp, Check, Sparkles, Scissors, Smile, User,
  BarChart2, Camera, Loader2, AlertCircle, Droplets, Wind, Sun, Moon,
  Activity, Eye,
} from 'lucide-react';

type LooksTab = 'scan' | 'hair' | 'face' | 'grooming' | 'fragrance' | 'tracker';

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
      {open && (
        <div className="px-4 pb-3 space-y-1.5 border-t border-white/5">
          {content.map((line, i) => (
            <p key={i} className={`${accent} text-sm leading-relaxed`}>{line}</p>
          ))}
        </div>
      )}
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
  const [tab, setTab] = useState<LooksTab>('scan');
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
      const compressed = await compressImage(ev.target!.result as string);
      setScanPhoto(compressed);
      setScanResult(null);
      setScanError('');
    };
    reader.readAsDataURL(file);
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
    { id: 'grooming', label: 'Groom', icon: User },
    { id: 'fragrance', label: 'Scent', icon: Wind },
    { id: 'tracker', label: 'Tracker', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-4 bg-gradient-to-b from-purple-950/30 to-transparent">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={15} className="mr-1" /> Dashboard
        </Link>
        <h1 className="text-3xl font-black tracking-tight gradient-text-purple">Looksmax Hub</h1>
        <p className="text-gray-500 text-xs mt-1">AI Scan · Hair · Face · Grooming · Fragrance · Tracker</p>
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

      <div className="px-4 space-y-4">

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
