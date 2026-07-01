import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, ChevronDown, ChevronUp, Check, Sparkles, Scissors, Smile, User, BarChart2 } from 'lucide-react';

type LooksTab = 'overview' | 'hair' | 'face' | 'grooming' | 'tracker';

const todayKey = () => `gymforge_looksmax_checklist_${new Date().toISOString().split('T')[0]}`;

const MORNING_ITEMS = [
  { id: 'spf', label: 'SPF applied' },
  { id: 'supplements', label: 'Took supplements' },
  { id: 'teeth', label: 'Teeth brushed ×2' },
  { id: 'tongue', label: 'Tongue scraped' },
];

const EVENING_ITEMS = [
  { id: 'retinol_aha_bha', label: 'Retinol / BHA / AHA applied' },
  { id: 'moisturiser', label: 'Moisturiser' },
  { id: 'eyecream', label: 'Eye cream' },
  { id: 'castor', label: 'Castor oil on brows' },
];

const WEEKLY_ITEMS = [
  { id: 'dermaroll_scalp', label: 'Dermarolled scalp (0.5mm)' },
  { id: 'dermaroll_brows', label: 'Dermarolled brows (0.25mm)' },
  { id: 'beard_trim', label: 'Haircut / beard trim check' },
  { id: 'whitening', label: 'Whitening strips (30 min)' },
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

interface ExpandCard { title: string; content: string[]; badge?: string; }

function ExpandableCard({ title, content, badge }: ExpandCard) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
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
            <p key={i} className="text-gray-400 text-sm leading-relaxed">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LooksMax() {
  const [tab, setTab] = useState<LooksTab>('overview');
  const [checklist, setChecklist] = useState<Record<string, boolean>>(loadChecklist());
  const [dermaroll, setDermaroll] = useState(loadDermaroll());

  useEffect(() => {
    setChecklist(loadChecklist());
    setDermaroll(loadDermaroll());
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

  const morningDone = MORNING_ITEMS.filter(i => checklist[i.id]).length;
  const eveningDone = EVENING_ITEMS.filter(i => checklist[i.id]).length;
  const weeklyDone = WEEKLY_ITEMS.filter(i => checklist[i.id]).length;

  const TABS: { id: LooksTab; label: string; icon: typeof Sparkles }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'hair', label: 'Hair', icon: Scissors },
    { id: 'face', label: 'Face', icon: Smile },
    { id: 'grooming', label: 'Groom', icon: User },
    { id: 'tracker', label: 'Tracker', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-4 bg-gradient-to-b from-purple-950/30 to-transparent">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={15} className="mr-1" /> Dashboard
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Looksmax Hub</h1>
        <p className="text-gray-500 text-xs mt-1">Hair · Face · Grooming · Tracker</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 bg-[#111] border border-white/10 rounded-2xl p-1 overflow-x-auto">
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

        {/* ===== OVERVIEW TAB ===== */}
        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Hair', status: 'Retention + growth protocol', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' },
                { label: 'Face', status: 'Mewing · contrast · jawline', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
                { label: 'Grooming', status: 'Brows · beard · teeth', color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5' },
                { label: 'Body', status: 'Physique · skin · fragrance', color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
              ].map(({ label, status, color, border, bg }) => (
                <div key={label} className={`${bg} ${border} border rounded-2xl p-4`}>
                  <p className={`font-black text-lg ${color}`}>{label}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{status}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <Sparkles size={15} className="text-purple-400" /> Start Here
              </h2>
              <div className="space-y-2">
                {[
                  'Begin a daily SPF habit — sun damage is the #1 ageing accelerator',
                  'Start minoxidil immediately if concerned about hair retention',
                  'Learn proper mewing posture — takes 2 weeks to become habit',
                  'Shape eyebrows once — clean brows increase facial attractiveness significantly',
                  'Get body fat to 12% or below — reveals facial structure and jawline',
                  'Build a consistent evening routine: cleanse → active → moisturise',
                  'Invest in a good fragrance and learn to layer properly',
                  'Train neck muscles — frames the face and absorbs impact in combat',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-purple-400 font-black text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-sm mb-2 text-gray-400">Today's Progress</h2>
              <div className="flex gap-3">
                <div className="flex-1 text-center">
                  <p className={`text-2xl font-black ${morningDone === MORNING_ITEMS.length ? 'text-green-400' : 'text-orange-400'}`}>{morningDone}/{MORNING_ITEMS.length}</p>
                  <p className="text-gray-500 text-xs">Morning</p>
                </div>
                <div className="flex-1 text-center">
                  <p className={`text-2xl font-black ${eveningDone === EVENING_ITEMS.length ? 'text-green-400' : 'text-blue-400'}`}>{eveningDone}/{EVENING_ITEMS.length}</p>
                  <p className="text-gray-500 text-xs">Evening</p>
                </div>
                <div className="flex-1 text-center">
                  <p className={`text-2xl font-black ${weeklyDone === WEEKLY_ITEMS.length ? 'text-green-400' : 'text-purple-400'}`}>{weeklyDone}/{WEEKLY_ITEMS.length}</p>
                  <p className="text-gray-500 text-xs">Weekly</p>
                </div>
              </div>
            </div>
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
                  { name: 'Vitamin D3 + K2', dose: '4000 IU D3 + 100mcg K2 daily', note: 'D3 deficiency linked to hair loss. K2 directs calcium away from arteries' },
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
                <ExpandableCard
                  title="Castor Oil — nightly"
                  content={[
                    'Apply to brows every night using a clean spoolie brush.',
                    'Ricinoleic acid in castor oil promotes hair growth and reduces inflammation.',
                    'Also works on eyelashes — apply carefully to lash line with clean brush.',
                    'Results in 6-12 weeks of consistent nightly use.',
                  ]}
                />
                <ExpandableCard
                  title="RevitaBrow Advanced Serum"
                  content={[
                    'OTC brow growth serum — apply along brow line once daily.',
                    'Contains peptides, biotin, and keratin amino acids.',
                    'Results typically visible at 6-8 weeks.',
                    'Available at pharmacies and online.',
                  ]}
                />
                <ExpandableCard
                  title="Latisse / Bimatoprost (prescription)"
                  badge="FAST"
                  content={[
                    'Originally a glaucoma drug — discovered to grow lashes and brows significantly.',
                    'Works fast — noticeable results in 4-6 weeks.',
                    'Apply to brow and lash line with applicator each night.',
                    'Requires prescription — see GP or dermatologist.',
                    'Can darken skin if applied outside the brow line — be precise.',
                  ]}
                />
                <ExpandableCard
                  title="Dermarolling Brows — 0.25mm"
                  badge="WEEKLY"
                  content={[
                    'Use a 0.25mm facial roller along the brow area once per week.',
                    'Creates micro-channels for better serum absorption.',
                    'Apply castor oil or RevitaBrow immediately after rolling.',
                    'Gentle pressure only — facial skin is more sensitive than scalp.',
                    'Avoid if active breakouts in the area.',
                  ]}
                />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Hairline & Styling</h2>
              <div className="space-y-2.5">
                {[
                  { shape: 'Oval', tip: 'Most versatile — almost any style works. Textured crops, quiffs, and slick backs all suit.' },
                  { shape: 'Square', tip: 'Strong jawline face. Avoid super short sides — softer fades with more length on top balance width.' },
                  { shape: 'Round', tip: 'Add height on top to elongate. Avoid buzzcuts and centre parts that widen. Side-part pompadour works well.' },
                  { shape: 'Heart', tip: 'Wider forehead tapering to chin. Side fades with volume on top work. Avoid too much volume on crown.' },
                  { shape: 'Oblong / Long', tip: 'Avoid adding more height. Textured layers on sides, medium length tops. Beards add width and frame.' },
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
                  { step: '7', text: 'No pain at any point. If you feel jaw pain or headaches, ease off — you\'re over-applying force.' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                    <span className="text-blue-400 font-black text-sm flex-shrink-0">{step}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Facial Contrast</h2>
              <p className="text-gray-500 text-xs mb-3">What makes faces look more striking and memorable to others.</p>
              <div className="space-y-2">
                <ExpandableCard
                  title="Dark, defined eyebrows"
                  content={[
                    'Higher contrast between brows and skin = more memorable, striking face.',
                    'Well-groomed brows immediately elevate perceived attractiveness.',
                    'Fill sparse areas with a pencil one shade lighter than your hair.',
                    'Use feathery strokes — never block fill.',
                    'Set with clear brow gel to hold shape all day.',
                  ]}
                />
                <ExpandableCard
                  title="Clear, even skin tone"
                  content={[
                    'Reduces visual noise so facial features read more clearly.',
                    'Redness, uneven pigmentation and acne all reduce contrast and distract from features.',
                    'Focus on barrier repair first: ceramides and niacinamide to calm skin.',
                    'Niacinamide 10% targets hyperpigmentation and redness simultaneously.',
                    'SPF prevents new pigmentation damage every single day.',
                  ]}
                />
                <ExpandableCard
                  title="Low body fat"
                  content={[
                    'Below 12% BF for males reveals the facial structure nature gave you.',
                    'Cheekbones, jawline, and orbital bone structure become visible.',
                    'Reduce sodium and water retention before important events (cut processed food, drink more water).',
                    'Face fat is often the last thing to go — requires overall deficit.',
                    'Most impactful single factor you can control.',
                  ]}
                />
                <ExpandableCard
                  title="Hunter Eyes"
                  content={[
                    'Deep-set eyes with a positive or neutral canthal tilt read as dominant and striking.',
                    'Canthal tilt is largely genetic and structural — cannot be changed naturally.',
                    'However: dark, dense lashes enhance the appearance of deep-set eyes significantly.',
                    'Try lash serum (Latisse) on lower lids for density and length.',
                    'Keeping under-eye area non-puffy (sleep, reduced sodium) helps greatly.',
                    'Avoid looking tired — blue light glasses in evenings, 8h sleep, eye cream.',
                  ]}
                />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Jawline & Bone Structure</h2>
              <div className="space-y-2">
                <ExpandableCard
                  title="Mastic Gum Chewing"
                  badge="DAILY"
                  content={[
                    'Falim or Mastic brand gum — much harder than regular gum.',
                    'Works the masseter (jaw) muscles — the primary jawline muscle.',
                    'Chew 30-60 minutes per day for noticeable masseter hypertrophy.',
                    'Results visible in 2-3 months of consistent daily use.',
                    'One-sided chewing creates imbalance — chew both sides.',
                    'Mastic gum also has gut health benefits.',
                  ]}
                />
                <ExpandableCard
                  title="Reduce Body Fat"
                  badge="HIGHEST IMPACT"
                  content={[
                    'Jawline definition is almost entirely a function of body fat percentage.',
                    'At 12% BF or below, most males have visible jaw angle and definition.',
                    'Subcutaneous fat under the chin and along the jaw obscures bone structure.',
                    'Cannot spot-reduce face fat — overall caloric deficit required.',
                    'Combine with sodium reduction to cut water retention for events.',
                  ]}
                />
                <ExpandableCard
                  title="Neck Training"
                  content={[
                    'Thick neck and traps frame the jaw and face.',
                    'Shrugs: 4 × 15 with heavy weight, twice weekly.',
                    'Band neck exercises: flexion/extension/lateral — start light, build to 3 × 15.',
                    'Farmer carries with heavy kettlebells — trap and neck builder.',
                    'For combat athletes: neck training is injury prevention, not just aesthetics.',
                  ]}
                />
                <ExpandableCard
                  title="Mewing — Long-term"
                  content={[
                    'Correct tongue posture applies upward and forward force on the maxilla over time.',
                    'Most effective in younger individuals with more facial plasticity.',
                    'Adult results are slower but documented — years of consistent practice.',
                    'Combined with chewing and low body fat: maximal jaw development.',
                  ]}
                />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Skin for Facial Contrast</h2>
              <div className="space-y-2">
                {[
                  { name: 'Reduce Redness / Inflammation', items: ['Ceramide-based moisturiser to repair barrier', 'Niacinamide 10% — anti-inflammatory, reduces redness', 'Avoid harsh cleansers that strip skin barrier', 'Cold water face wash in morning to reduce puffiness'] },
                  { name: 'Even Skin Tone', items: ['Niacinamide 10% (also treats pigmentation)', 'Azelaic acid 10-15% — fades dark spots and red marks', 'Vitamin C serum (15%+) in morning — antioxidant + brightening', 'SPF daily — prevents new pigmentation accumulating'] },
                  { name: 'Hyperpigmentation Targeted', items: ['Alpha arbutin 2% — inhibits melanin production', 'Alpha-hydroxy acids (AHA) weekly — removes pigmented surface cells', 'Retinol every 3rd night — accelerates cell turnover and fades marks', 'Avoid picking spots — post-inflammatory hyperpigmentation is preventable'] },
                ].map(({ name, items }) => (
                  <div key={name} className="bg-white/5 rounded-xl p-3">
                    <p className="font-semibold text-sm mb-2">{name}</p>
                    {items.map((item, i) => (
                      <p key={i} className="text-gray-400 text-xs leading-relaxed">· {item}</p>
                    ))}
                  </div>
                ))}
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
              <h2 className="font-bold text-base mb-3">Beard & Facial Hair</h2>
              <div className="space-y-2">
                <ExpandableCard
                  title="Growing It Out — First 4 Weeks"
                  content={[
                    'Let it grow for at least 4 weeks before the first proper trim.',
                    'This reveals your natural growth pattern — direction, density, patchiness.',
                    'Resist trimming — most men trim too early and never see full potential.',
                    'Itching in weeks 1-2 is normal — beard oil will help.',
                  ]}
                />
                <ExpandableCard
                  title="Minoxidil for Patchy Beards"
                  badge="6-12 MONTHS"
                  content={[
                    'Apply minoxidil 5% to beard area (patchy cheeks) once or twice daily.',
                    'Takes 6-12 months of consistent use for significant results.',
                    'Many men grow full beards from very patchy starts — it works.',
                    'Once you stop, growth from minoxidil may reduce — consider committing long-term.',
                    'Side effects minimal for beard application (skin is less sensitive than scalp).',
                  ]}
                />
                <ExpandableCard
                  title="Beard Oil & Balm"
                  content={[
                    'Beard oil daily: apply 3-4 drops to palm, rub through beard after shower.',
                    'Best bases: jojoba oil (closest to skin sebum), argan oil (shine + softness).',
                    'Reduces itch, adds gloss, conditions the skin underneath.',
                    'Beard balm for shaping: beeswax base holds form. Apply to dry beard, shape with comb.',
                    'Combine both: oil first for conditioning, balm over top for styling.',
                  ]}
                />
                <ExpandableCard
                  title="Lines & Maintenance"
                  content={[
                    'Neck line: two finger-widths above your Adam\'s apple. Everything below gets shaved clean.',
                    'Cheek line: let it grow naturally — only remove truly stray hairs above the natural line.',
                    'Line up weekly with a trimmer and foil shaver for clean edges.',
                    'Full shape trim (length + blending) monthly.',
                    'Clean neck every 3 days to keep the line sharp.',
                  ]}
                />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Teeth</h2>
              <div className="space-y-2">
                {[
                  { name: 'Whitening Strips', freq: 'Biweekly', text: 'Crest 3D Whitestrips or equivalent. 30-minute application. Avoid eating for 30 min after. Do not exceed recommended frequency.' },
                  { name: 'Oil Pulling', freq: 'Morning daily', text: 'Swish 1 tbsp coconut oil for 10-20 minutes before brushing. Removes bacteria, reduces inflammation, whitens gently over time.' },
                  { name: 'Electric Toothbrush', freq: 'Twice daily', text: '2 full minutes, 30s per quadrant. Remove 100% more plaque than manual. Oral-B or Philips Sonicare preferred.' },
                  { name: 'Tongue Scraper', freq: 'Every morning', text: 'Eliminates bacterial biofilm that causes bad breath. Scrape from back to front 5-7 times before brushing.' },
                  { name: 'Purple Toning Mouthwash', freq: 'Weekly', text: 'Purple colour theory neutralises yellow tones. Rinse for 60s. Do not use daily — can stain temporarily.' },
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
                  'Soak hands in warm water for 5 min, then gently push back cuticles with a wooden stick.',
                  'Hand cream daily (morning or after washing hands) — dry hands age you.',
                  'Keep all nails the same length — one long nail is worse than none.',
                  'Buff the surface lightly to remove ridges and add subtle gloss.',
                ].map((item, i) => (
                  <p key={i} className="text-gray-300 text-sm">· {item}</p>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Fragrance</h2>
              <div className="space-y-2.5">
                {[
                  { title: 'Layering Protocol', text: 'Shower gel (matching or neutral) → unscented body lotion → perfume on pulse points. Moisturised skin holds scent 3× longer than dry skin.' },
                  { title: 'Pulse Points', text: 'Neck (sides), inner wrists, chest, behind ears. These areas generate heat that projects scent. Do not rub wrists together — breaks down molecules.' },
                  { title: 'Application', text: '3-4 sprays maximum. Hold bottle 15-20cm from skin. Less is more — you should not be noticed from more than 1 metre away.' },
                  { title: 'Scent Families', text: 'Aquatics/citrus: casual/daytime. Woody/amber: evening/formal. Orientals: date nights. Build a small collection for different contexts.' },
                ].map(({ title, text }) => (
                  <div key={title} className="bg-white/5 rounded-xl px-3 py-2.5">
                    <p className="font-bold text-xs text-orange-400 mb-0.5">{title}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== TRACKER TAB ===== */}
        {tab === 'tracker' && (
          <>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-base mb-3">Morning Routine</h2>
              <div className="space-y-2">
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
              <h2 className="font-bold text-base mb-3">Evening Routine</h2>
              <div className="space-y-2">
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
              <h2 className="font-bold text-base mb-3">Weekly Checklist</h2>
              <div className="space-y-2">
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
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm">Scalp — 0.5mm</p>
                    <p className="text-gray-500 text-xs">Weekly · wait 24h before minoxidil</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      !dermaroll.scalp ? 'text-gray-500'
                      : daysSinceStr(dermaroll.scalp) === 'Today' ? 'text-green-400'
                      : 'text-orange-400'
                    }`}>
                      {daysSinceStr(dermaroll.scalp)}
                    </p>
                    <p className="text-gray-600 text-xs">Last rolled</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm">Brows — 0.25mm</p>
                    <p className="text-gray-500 text-xs">Weekly · apply serum immediately after</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      !dermaroll.brows ? 'text-gray-500'
                      : daysSinceStr(dermaroll.brows) === 'Today' ? 'text-green-400'
                      : 'text-orange-400'
                    }`}>
                      {daysSinceStr(dermaroll.brows)}
                    </p>
                    <p className="text-gray-600 text-xs">Last rolled</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-3 text-center">Tap the weekly checklist items above to update log dates</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
              <h2 className="font-bold text-sm mb-2 text-gray-400">Today's Summary</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${morningDone === MORNING_ITEMS.length ? 'text-green-400' : 'text-white'}`}>
                    {morningDone}/{MORNING_ITEMS.length}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">Morning</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${eveningDone === EVENING_ITEMS.length ? 'text-purple-400' : 'text-white'}`}>
                    {eveningDone}/{EVENING_ITEMS.length}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">Evening</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${weeklyDone === WEEKLY_ITEMS.length ? 'text-blue-400' : 'text-white'}`}>
                    {weeklyDone}/{WEEKLY_ITEMS.length}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">Weekly</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
