import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { OneThing, SectionHeader, TabBar } from '../components/Hud';
import { suggestLayering, isValidLayering } from '../lib/generators';
import type { LayeringResult } from '../lib/generators';
import FaceDossier from '../components/FaceDossier';
import MealPlanner from '../components/MealPlanner';
import {
  ArrowLeft, ChevronDown, ChevronUp, Check, Sparkles, Scissors, Smile, User,
  BarChart2, Camera, Loader2, AlertCircle, Droplets, Wind, Sun, Moon,
  Activity, Eye, ChevronRight, Utensils,
} from 'lucide-react';

type LooksTab = 'scan' | 'look' | 'skin' | 'diet' | 'techniques' | 'fragrance';
const LOOKS_TABS = ['scan', 'look', 'skin', 'diet', 'techniques', 'fragrance'] as const;
// Face, Hair, Grooming and Style were merged into one tab; old links land on
// the right section of it.
const LOOK_SECTIONS = [
  { id: 'face', label: 'Face' },
  { id: 'hair', label: 'Hair' },
  { id: 'grooming', label: 'Groom' },
  { id: 'style', label: 'Style' },
] as const;
function resolveTab(t: string | null): { tab: LooksTab; section?: string } | null {
  if (!t) return null;
  if ((LOOKS_TABS as readonly string[]).includes(t)) return { tab: t as LooksTab };
  if (LOOK_SECTIONS.some(s => s.id === t)) return { tab: 'look', section: t };
  return null;
}

interface ExpandCard { title: string; content: string[]; badge?: string; accent?: string; }

function GStep({ n, title, desc, products }: { n: string; title: string; desc: string; products?: string[] }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center flex-shrink-0 text-purple-400 font-black text-[11px] mt-0.5">{n}</div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-200">{title}</p>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        {products && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {products.map(p => <span key={p} className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">{p}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function GFold({ title, tag, children, defaultOpen = false }: { title: string; tag?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          {tag && <p className="text-xs text-purple-400/70 mt-0.5">{tag}</p>}
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function GPairs({ items }: { items: [string, string][] }) {
  return (
    <div className="space-y-3">
      {items.map(([t, d]) => (
        <div key={t}>
          <p className="font-semibold text-sm text-gray-200">{t}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
        </div>
      ))}
    </div>
  );
}

function GCallout({ title, text, tone = 'amber' }: { title: string; text: string; tone?: 'amber' | 'red' | 'emerald' }) {
  const tones = {
    amber: 'bg-purple-500/5 border-purple-500/20 text-purple-200/85',
    red: 'bg-red-500/5 border-red-500/20 text-red-200/85',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200/85',
  };
  return (
    <div className={`border rounded-xl px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs leading-relaxed"><span className="font-bold">{title}:</span> {text}</p>
    </div>
  );
}

function GLists({ left, right, leftTitle, rightTitle }: { left: string[]; right: string[]; leftTitle: string; rightTitle: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="bg-black/30 border border-red-500/15 rounded-xl p-4">
        <p className="text-xs font-bold text-red-300 mb-2">{leftTitle}</p>
        {left.map((l, i) => <p key={i} className="text-gray-400 text-xs leading-relaxed mb-1.5">• {l}</p>)}
      </div>
      <div className="bg-black/30 border border-emerald-500/15 rounded-xl p-4">
        <p className="text-xs font-bold text-emerald-300 mb-2">{rightTitle}</p>
        {right.map((l, i) => <p key={i} className="text-gray-400 text-xs leading-relaxed mb-1.5">• {l}</p>)}
      </div>
    </div>
  );
}


function Tldr({ points }: { points: string[] }) {
  return <OneThing points={points} />;
}

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

export default function LooksMax() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<LooksTab>(() => resolveTab(params.get('tab'))?.tab ?? 'scan');
  // Follow ?tab= changes while already on this page, and jump to the right
  // section when an old Face/Hair/Grooming/Style link lands on the merged tab.
  useEffect(() => {
    const r = resolveTab(params.get('tab'));
    if (!r) return;
    setTab(r.tab);
    if (r.section) {
      const id = `look-${r.section}`;
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 80);
    }
  }, [params]);

  useEffect(() => {
    const savedLayering = localStorage.getItem('gymforge_layering');
    if (savedLayering) {
      try {
        const parsed = JSON.parse(savedLayering) as { input: string; result: unknown };
        if (isValidLayering(parsed.result)) setLayering(parsed.result);
        else localStorage.removeItem('gymforge_layering');
        // Only fall back to the input stored alongside an old result if nothing
        // has been typed since — the live key is the source of truth.
        if (!localStorage.getItem('gymforge_frag_input') && parsed.input) {
          setFragInput(parsed.input);
          localStorage.setItem('gymforge_frag_input', parsed.input);
        }
      } catch {}
    }
  }, []);



  // Fragrance layering AI state.
  // The collection you type is saved on every keystroke under its own key, NOT
  // as a side effect of a successful AI call — otherwise a failed or slow
  // generation loses everything you typed.
  const [fragInput, setFragInput] = useState(() => {
    try { return localStorage.getItem('gymforge_frag_input') ?? ''; } catch { return ''; }
  });
  const [layering, setLayering] = useState<LayeringResult | null>(null);
  const [layeringBusy, setLayeringBusy] = useState(false);
  const [layeringError, setLayeringError] = useState('');
  const [fragSeason, setFragSeason] = useState(() => {
    try { return localStorage.getItem('gymforge_frag_season') ?? 'any'; } catch { return 'any'; }
  });
  const [fragOccasion, setFragOccasion] = useState(() => {
    try { return localStorage.getItem('gymforge_frag_occasion') ?? 'any'; } catch { return 'any'; }
  });

  const updateFragInput = (v: string) => {
    setFragInput(v);
    try { localStorage.setItem('gymforge_frag_input', v); } catch { /* quota */ }
  };
  const updateFragSeason = (v: string) => {
    setFragSeason(v);
    try { localStorage.setItem('gymforge_frag_season', v); } catch { /* quota */ }
  };
  const updateFragOccasion = (v: string) => {
    setFragOccasion(v);
    try { localStorage.setItem('gymforge_frag_occasion', v); } catch { /* quota */ }
  };

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
      const raw = e instanceof Error ? e.message : '';
      const timedOut = /timeout|timed out|aborted/i.test(raw);
      setLayeringError(
        timedOut
          ? 'That took too long and was cancelled — usually a very long list. Your fragrances are saved: try again, or split the list in half and run it twice.'
          : raw || 'Failed. Check your API key and connection.'
      );
    }
    setLayeringBusy(false);
  };


  const TABS: { id: LooksTab; label: string; icon: typeof Sparkles }[] = [
    { id: 'scan', label: 'J.A.R.V.I.S. Scan', icon: Camera },
    { id: 'look', label: 'Face · Hair · Style', icon: Smile },
    { id: 'skin', label: 'Skin', icon: Droplets },
    { id: 'diet', label: 'Diet', icon: Utensils },
    { id: 'techniques', label: 'Body & Habits', icon: Sparkles },
    { id: 'fragrance', label: 'Scent', icon: Wind },
  ];

  return (
    <div className="min-h-screen bg-transparent bg-gradient-to-b from-purple-950/40 via-transparent to-transparent text-white pb-24">
      <div className="px-5 pt-6">
        <SectionHeader icon={Sparkles} title="Looks" subtitle="Scan · Face, Hair & Style · Skin · Diet · Body · Scent" />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <div className="px-5 space-y-4 stagger" key={tab}>

        {/* ===== J.A.R.V.I.S. SCAN ===== */}
        {tab === 'scan' && <FaceDossier />}

        {/* ===== FACE, HAIR & STYLE — the essentials only ===== */}
        {tab === 'look' && (
          <>
            <div className="sticky top-0 z-30 -mx-5 px-5 py-2 bg-[#04060a]/90 backdrop-blur border-b border-white/5 flex gap-1.5">
              {LOOK_SECTIONS.map(s => (
                <button key={s.id} onClick={() => document.getElementById(`look-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="flex-1 font-hud text-[11px] font-bold uppercase tracking-wider py-1.5 rounded-lg border border-cyan-400/25 text-cyan-200 bg-cyan-500/[0.06] hover:bg-cyan-500/15">
                  {s.label}
                </button>
              ))}
            </div>

            <Tldr points={[
              'Body fat is the biggest face changer there is. At 10-14% the jaw and cheekbones appear; nothing else on this page competes.',
              'A haircut chosen for your face shape, kept fresh every 3-4 weeks, is the fastest visible upgrade. The J.A.R.V.I.S. Scan names yours.',
              'Clothes that fit beat clothes that cost. At 6ft 4, buy tall ranges or everything will look borrowed.',
              'Posture lives in Gym → Posture. Skin lives in the Skin tab. This tab is structure, hair, grooming and clothes.',
            ]} />

            {/* ---------- FACE ---------- */}
            <section id="look-face" className="scroll-mt-16 space-y-3">
              <h2 className="font-orbitron text-lg uppercase tracking-[0.12em] text-cyan-200 pt-2">Face</h2>
              <GFold title="Jawline" tag="Leanness first, then the muscle and the shadow" defaultOpen>
                <GPairs items={[
                  ['Get lean', 'Most "weak jaws" are a fat layer. Dropping from ~18% to 12% body fat does more than every exercise combined.'],
                  ['Chin tucks — 3×15 daily', 'Pull your head straight back, hold 3 seconds. Sharpens the neck-to-jaw angle over months and fixes forward head.'],
                  ['Hard gum — 20 min a day, optional', 'Mastic or falim gum builds the masseter (jaw corners) over months. Stop at any jaw pain or clicking.'],
                  ['Use shadow', 'Short stubble along the jawline reads as a stronger jaw, especially in photos.'],
                ]} />
              </GFold>
              <GFold title="Eyes" tag="Sleep does most of it">
                <GPairs items={[
                  ['Puffiness', 'Cold spoons or a cold flannel for 60 seconds in the morning, caffeine eye serum, less salt and alcohol the night before.'],
                  ['Dark circles', 'Mostly genetic and blood vessels showing through thin skin. Eight hours sleep, retinol eye cream at night for thickness. If severe, a blood test for iron.'],
                  ['Frame them', 'Tidy, full brows do more for your eyes than anything applied to them. See Grooming.'],
                ]} />
              </GFold>
              <GFold title="Fascia and facial massage" tag="What it really does, and the 4-minute routine">
                <GPairs items={[
                  ['What fascia is', 'A thin web of connective tissue wrapped around every muscle, including the 40-odd in your face. Under it sits lymph, the fluid that pools overnight and makes you look puffy.'],
                  ['What massage does', 'Pushes that fluid out towards the lymph nodes in your neck. The face looks sharper and the cheekbones show more for a few hours. It also eases a tight, clenched jaw.'],
                  ['What it does not do', 'It does not "release" fascia into a new shape, lift your face or move bone. Anyone selling permanent change from gua sha is overselling. Use it as a daily de-puff and before photos or nights out.'],
                  ['Tools', 'Clean fingers work. A gua sha stone or ice roller adds cold and makes it easier. Always over a few drops of oil or moisturiser so you glide, never drag.'],
                ]} />
                <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-3 mb-1.5">The routine — light pressure, 5 strokes each</p>
                <ol className="space-y-1.5">
                  {[
                    ['Neck first', 'Stroke down both sides of the neck from behind the ear to the collarbone. This opens the drain, so do it first and last.'],
                    ['Jaw', 'From the chin along the jawbone to just under the ear.'],
                    ['Cheeks', 'From beside the nose, under the cheekbone, out to the ear. This is the stroke that brings the cheekbones out.'],
                    ['Under the eyes', 'Ring finger only, barely any pressure, from the inner corner out to the temple.'],
                    ['Brow and forehead', 'From the centre outwards to the temples, then hold the temples for a breath.'],
                    ['Neck again', 'Five more strokes down to the collarbone to clear it all.'],
                  ].map(([t, d], i) => (
                    <li key={t} className="text-sm text-gray-300 flex gap-2.5"><span className="font-orbitron text-cyan-300 text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span><span><span className="text-white font-semibold">{t}.</span> {d}</span></li>
                  ))}
                </ol>
                <GCallout tone="amber" title="Before a night out or photos" text="The night before: low salt, no alcohol, 3L water, head slightly raised in bed. The morning of: cold water on the face, then the routine above. Skip it on active breakouts, broken skin, or the night after retinol if you are sore." />
              </GFold>
              <GFold title="Mewing — the honest version">
                <GPairs items={[
                  ['What to do', 'Whole tongue on the roof of the mouth, lips sealed, breathe through your nose. Make it your resting posture.'],
                  ['What it does', 'A tighter resting face and under-chin, better nasal breathing. It will not reshape an adult skull.'],
                ]} />
              </GFold>
              <GFold title="Lips, teeth and smile">
                <GPairs items={[
                  ['Lips', 'SPF lip balm in the day, a thick ointment at night, never lick them.'],
                  ['Teeth', 'Electric brush 2 minutes twice a day, floss at night, whitening strips 2-3 times a year, hygienist twice a year. Gentle at the gum line — recession does not come back.'],
                  ['Smile', 'A relaxed, slightly closed-mouth smile photographs best. Practise on video, not in a mirror.'],
                ]} />
              </GFold>
              <GFold title="Symmetry — what you can actually even out" tag="Habits shape the soft tissue; bone stays">
                <GPairs items={[
                  ['Chew on both sides', 'Favouring one side builds a bigger masseter on that side over time. Feel your jaw corners while you clench: if one is fuller, chew on the other side for a few months.'],
                  ['Release the tight side', 'Knuckle circles on the bulkier masseter for 60 seconds a day, jaw relaxed and teeth apart. If you wake with a sore jaw you are clenching at night: see a dentist about a guard.'],
                  ['Sleep on your back', 'Sleeping on one side squashes that side every night, so it is puffier in the morning and creases there first. Back sleeping, or alternate sides, with a silk or satin pillowcase.'],
                  ['Head and shoulders level', 'A head tilt or forward head shows in every photo as a lopsided face. Chin tucks (see Jawline) and Gym → Posture fix the base it sits on.'],
                  ['Even expressions', 'Most people raise one brow or smile with one side. Film yourself talking for a minute, spot it, and practise the even version.'],
                  ['Groom to balance', 'Match the brows, part your hair on the side that is fuller, and keep beard lines level. The scan tells you which way your proportions lean.'],
                  ['Judge it properly', 'Nobody is symmetrical, and small differences read as normal. Front cameras at arm’s length exaggerate them, so use a mirror or the rear lens.'],
                ]} />
                <GCallout tone="red" title="See a doctor" text="Asymmetry that appears suddenly, such as one side drooping or a smile that will not lift, needs urgent help: call 999. Jaw clicking, locking or pain goes to a dentist." />
              </GFold>
              <GCallout tone="red" title="Ignore" text="Bone smashing, nose exercises, 'hunter eye' tricks, eyelid taping and DIY fillers. They range from useless to injurious." />
            </section>

            {/* ---------- HAIR ---------- */}
            <section id="look-hair" className="scroll-mt-16 space-y-3">
              <h2 className="font-orbitron text-lg uppercase tracking-[0.12em] text-cyan-200 pt-4">Hair</h2>
              <GFold title="The right cut" tag="The single biggest style lever" defaultOpen>
                <GPairs items={[
                  ['Choose for your face', 'Longer face: keep height low and add width at the sides. Round face: height on top, shorter sides. Square: textured crop or a soft side part. Your scan names the exact cuts.'],
                  ['At the barber', 'Bring two photos of the cut on someone with your hair type. Ask for a scissor-cut top and a low or mid taper so it grows out well.'],
                  ['Keep it fresh', 'Every 3-4 weeks. A great cut at week six looks like no cut.'],
                ]} />
              </GFold>
              <GFold title="Styling in two minutes">
                <GPairs items={[
                  ['The routine', 'Towel dry, sea-salt spray, blow-dry in the direction you want it to sit, then a small amount of matte clay or paste worked from the back forward.'],
                  ['Wavy hair', 'Curl cream on damp hair and let it air-dry or diffuse. Heavy clay on wet waves flattens them.'],
                  ['The difference-maker', 'The blow-dryer. Product only holds the shape you create with heat.'],
                ]} />
              </GFold>
              <GFold title="Keeping it" tag="Act early — you keep what you have, you rarely regrow what is gone">
                <GPairs items={[
                  ['Check', 'Look at your temples and crown in photos every 3 months. Family history matters.'],
                  ['What actually works', 'Finasteride and minoxidil are the evidence-backed pair. Finasteride is prescription and has possible side effects worth discussing with a GP or online clinic before starting.'],
                  ['Cheap and sensible', 'Ketoconazole 2% shampoo twice a week; microneedling weekly alongside minoxidil has decent evidence.'],
                ]} />
              </GFold>
              <GFold title="Scalp and washing">
                <GPairs items={[
                  ['How often', 'Shampoo 2-4 times a week, condition every time, finish with cool water.'],
                  ['Dandruff', 'Ketoconazole or zinc pyrithione shampoo, left on for 3 minutes.'],
                ]} />
              </GFold>
            </section>

            {/* ---------- GROOMING ---------- */}
            <section id="look-grooming" className="scroll-mt-16 space-y-3">
              <h2 className="font-orbitron text-lg uppercase tracking-[0.12em] text-cyan-200 pt-4">Grooming</h2>
              <GFold title="Brows" defaultOpen>
                <GPairs items={[
                  ['Tidy, never thin', 'Remove only the strays between and clearly below the brow. Trim long hairs with small scissors after brushing them up.'],
                  ['Better still', 'Threading every 4-6 weeks. Clear brow gel if they go wild.'],
                ]} />
              </GFold>
              <GFold title="Beard">
                <GPairs items={[
                  ['Pick the length for your face', 'The scan names it. Stubble at 3-5mm suits most faces and sharpens the jaw.'],
                  ['Lines', 'Neckline two fingers above the Adam’s apple, curved ear to ear. Leave the cheek line natural, only clean up strays.'],
                  ['Upkeep', 'Trim weekly, beard oil daily once it is past stubble. Patchy? Grow it 6 weeks before judging.'],
                ]} />
              </GFold>
              <GFold title="The details people notice">
                <GPairs items={[
                  ['Nose and ear hair', 'Trim weekly.'],
                  ['Nails and hands', 'Short, filed, clean. Hand cream if they crack.'],
                  ['Body', 'Trimmed, not necessarily removed. Antiperspirant at night works better than in the morning.'],
                  ['The easy fails', 'Dry lips, flakes on your shoulders, dirty trainers, greyed white T-shirts.'],
                ]} />
              </GFold>
            </section>

            {/* ---------- STYLE ---------- */}
            <section id="look-style" className="scroll-mt-16 space-y-3">
              <h2 className="font-orbitron text-lg uppercase tracking-[0.12em] text-cyan-200 pt-4">Style</h2>
              <GFold title="Fit — at 6ft 4" tag="Fit beats brand, every time" defaultOpen>
                <GPairs items={[
                  ['Shoulders', 'The seam sits on the edge of your shoulder. If it droops or pulls, nothing else can save it.'],
                  ['Length', 'Sleeves end at the wrist bone, T-shirts cover the belt, trousers have little or no break.'],
                  ['Tall ranges', 'ASOS Tall, Uniqlo, COS and Next Tall make longer bodies and sleeves. Regular sizes will look borrowed.'],
                  ['A tailor', 'Taking in a shirt or hemming trousers costs little and makes cheap clothes look expensive.'],
                ]} />
              </GFold>
              <GFold title="The wardrobe that covers everything">
                <GPairs items={[
                  ['Tops', 'Heavyweight tees (white, navy, black), two knitted polos, an oxford shirt, a merino crewneck, an overshirt.'],
                  ['Outerwear', 'A bomber or harrington, and a dark wool overcoat for winter.'],
                  ['Bottoms', 'Dark jeans, chinos, one pair of tailored trousers.'],
                  ['Shoes', 'Clean white leather trainers, suede Chelsea boots, loafers.'],
                  ['Colours', 'Navy, charcoal, black, white, cream, olive. Everything goes with everything, which is the point.'],
                ]} />
              </GFold>
              <GFold title="What to wear where">
                <GPairs items={[
                  ['Night out', 'Dark fitted shirt or knitted polo, black jeans, Chelsea boots, one good scent. Nothing with a big logo.'],
                  ['Date', 'Overshirt or knit over a tee, chinos or dark jeans, clean trainers.'],
                  ['Interview', 'Navy suit, white shirt, plain tie or none, polished shoes.'],
                ]} />
              </GFold>
              <GFold title="Photos and Instagram">
                <GPairs items={[
                  ['Taking them', 'Daylight, rear camera at chest height, body angled slightly, chin forward and down a touch. Candid beats posed.'],
                  ['The profile', 'Nine good posts beat ninety average ones. Show a life — sport, travel, friends, things you are building — not your face on repeat.'],
                  ['Avoid', 'Mirror selfies, gym-mirror flexing, heavy filters, anything that looks like trying.'],
                ]} />
              </GFold>
            </section>
          </>
        )}




        {/* ===== METHODS / TECHNIQUES TAB ===== */}
        {tab === 'skin' && (
          <div className="fade-up stagger space-y-3">
            <Tldr points={[
              'SPF 50 every morning, whatever the weather. Without it, nothing else on this page works.',
              'Morning: cleanse, niacinamide, moisturise, SPF. Night: cleanse, one active, moisturise. That is the whole routine.',
              'One new active at a time, and give it 8 weeks. Tretinoin is the strongest thing you can use — ramp it slowly.',
              'Not clearing after 8 weeks, or painful cysts? See a GP. Prescriptions exist for exactly this.',
            ]} />
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-purple-400">01</span> Skin & Acne Protocol</h2>
              <p className="text-gray-400 text-sm leading-relaxed">For active acne on cheeks and jaw (bacterial + hormonal), post-inflammatory marks, congested pores, blackheads, milia and uneven texture. The underlying tone is strong — clearing breakouts and fading marks creates a dramatic difference fast.</p>
            </div>
            <GCallout tone="amber" title="The SPF Rule" text="SPF 50 every single morning without exception — indoors, cloudy days, all of it. UV penetrates glass. Without SPF, every dark mark gets re-damaged daily and never fully fades. Retinol also sharply increases sun sensitivity. This single step decides whether everything else works." />
            <GFold title="Morning Routine" tag="6 steps, in order" defaultOpen>
              <GStep n="01" title="Cleanse" desc="Lukewarm water — never hot (strips the barrier). Circular motions for a full 60 seconds. Pat dry, never rub." products={['CeraVe Foaming Cleanser', 'La Roche-Posay Toleriane']} />
              <GStep n="02" title="Niacinamide 10%" desc="Most versatile morning ingredient. Shrinks pores, controls oil, fades dark spots, calms redness, strengthens the barrier. Wait 60 seconds before next step." products={['The Ordinary 10% Niacinamide + Zinc']} />
              <GStep n="03" title="Vitamin C Serum" desc="The most important morning ingredient after SPF. Brightens tone, fades hyperpigmentation, protects from UV, boosts collagen. Wait 60 seconds." products={['Timeless 20% Vit C + E Ferulic', 'Skinceuticals CE Ferulic (premium)']} />
              <GStep n="04" title="Eye Cream" desc="Tap in with ring finger only — minimum pressure. Never rub the under-eye area." products={['The Ordinary Caffeine 5% + EGCG', 'The Inkey List Caffeine']} />
              <GStep n="05" title="Moisturise" desc="Even oily skin needs this. Skipping causes the skin to overproduce sebum in compensation, making oiliness and acne worse." products={['CeraVe Moisturising Cream', 'Neutrogena Hydro Boost']} />
              <GStep n="06" title="SPF 50 — always last" desc="Reapply every 2 hours outdoors. Without this, every other product is half as effective and dark marks actively worsen." products={['LRP Anthelios Invisible Fluid', 'Isntree Watery Sun Gel']} />
            </GFold>
            <GFold title="Night Routine" tag="8 steps — actives alternate">
              <GStep n="01" title="Oil Cleanse (first cleanse)" desc="Massage oil into DRY face for 90 seconds. Add water to emulsify, rinse. Dissolves sunscreen, sebum and pollution — your second cleanser cannot work without this." products={['Skin1004 Centella Cleansing Oil', 'DHC Deep Cleansing Oil']} />
              <GStep n="02" title="Second Cleanse" desc="Same as morning. Now actually cleaning the skin beneath surface debris." />
              <GStep n="3A" title="BHA — 3× per week" desc="The only ingredient that enters the pore and dissolves blockages from within. Essential for blackheads. Results at 4–6 weeks. NEVER with Benzoyl Peroxide or retinol on the same night." products={["Paula's Choice 2% BHA Liquid"]} />
              <GStep n="3B" title="Benzoyl Peroxide 2.5% — alternate nights" desc="Thin layer over the full cheek and jaw area — not just spots. Kills acne bacteria. BP nights and BHA nights alternate — never both together." products={['LRP Effaclar Duo 2.5%']} />
              <GStep n="04" title="Targeted treatments (pick by concern)" desc="Alpha Arbutin — best for post-acne dark marks. Azelaic Acid — kills bacteria AND fades marks, reduces redness. Tranexamic Acid — exceptional for stubborn red marks." products={['The Ordinary Alpha Arbutin 2%', 'Azelaic Acid 10%', 'Tranexamic Acid']} />
              <GStep n="05" title="Retinol — build up slowly" desc="The most proven long-term skin transformer. Milia clear gradually with retinol — do not squeeze them. You will purge initially — push through, it's normal." products={['CeraVe Resurfacing Retinol', 'The Ordinary Retinol 0.2% in Squalane']} />
              <GStep n="06" title="Moisturise" desc="Seals everything in and reduces retinol irritation significantly." />
              <GStep n="07" title="Face oils" desc="2 drops squalane + 2 drops rosehip, warmed between palms, pressed gently in. Rosehip fades scars and marks; squalane locks moisture without clogging. After moisturiser." products={['The Ordinary Squalane', 'The Ordinary Rosehip Oil']} />
              <GStep n="08" title="Slugging — 2–3× per week, absolute last step" desc="Thin layer of Vaseline over everything. Locks in every product underneath. Wake up with softer, plumper, clearer skin. Doesn't break you out when done over a complete routine." products={['Vaseline Original', 'Aquaphor']} />
            </GFold>
            <GFold title="Retinol Build-Up Schedule" tag="Rushing this = wrecked skin barrier">
              <GPairs items={[
                ['Weeks 1–2 — twice per week', 'Skin adjusting. Mild dryness is normal.'],
                ['Weeks 3–4 — 3× per week', 'May see purging — temporary breakout increase. Push through it.'],
                ['Month 2 — every other night', 'Texture improving, pores refining. Marks beginning to fade noticeably.'],
                ['Month 3+ — nightly', 'Full benefits: smooth texture, clear pores, faded marks. Now consider stepping up to 0.3–0.5%.'],
              ]} />
            </GFold>
            <GFold title="Tretinoin — the prescription step up from retinol" tag="Stronger, faster, and needs more respect">
              <GPairs items={[
                ['What it actually is', 'Retinol is over-the-counter and your skin has to convert it into retinoic acid before it works — a slow, weak process. Tretinoin IS retinoic acid already, applied directly. That is the entire difference, and it is why it works faster and harder than any strength of retinol.'],
                ['How to get it in the UK', 'Prescription-only — it is not sold over the counter. Options: your GP (can prescribe but often reluctant for cosmetic use), a private dermatologist, or an online prescriber (Skin + Me, Dermatica, ZAVA) who assesses your skin via photos and posts it out. The online route is the fastest for most people.'],
                ['Strengths', '0.025% is the standard starting strength, 0.05% and 0.1% are stronger. Cream is gentler than gel — start with 0.025% cream unless a dermatologist says otherwise. Going in strong is the single most common way people wreck their skin barrier.'],
                ['When to actually switch from retinol', 'Once you have run 0.2-0.5% retinol nightly for several months with no further improvement, or if you want faster results and are willing to manage more irritation. If you are still purging on retinol, you are not ready for tretinoin — fix the barrier first.'],
                ['The build-up is slower than retinol\'s', 'Once every 3 nights for 2-3 weeks, then every other night for a month, then nightly — and only once your skin tolerates each step without persistent redness or flaking. Rushing tretinoin causes real, sometimes weeks-long irritation, not just mild dryness.'],
                ['Purging is real and can be worse than retinol\'s', 'Tretinoin speeds up cell turnover, which can bring existing microcomedones to the surface faster — expect a possible flare around weeks 2-6 before skin clears. This is genuinely different from a bad reaction; a true purge happens in areas you already tend to break out, and it resolves.'],
                ['The moisturiser sandwich — the actual irritation fix', 'Moisturiser first, wait 20 minutes, apply a pea-sized amount of tretinoin (whole face, not just problem areas), then more moisturiser on top once it has absorbed. This "buffers" the dose without meaningfully reducing efficacy, and it is the single best tool for surviving the first month.'],
                ['SPF is not optional, it is mandatory', 'Tretinoin thins the outer skin layer and increases sun sensitivity significantly more than retinol does. Skipping SPF while on tretinoin will burn skin that is already compromised and can undo months of progress in one exposure.'],
                ['Never combine carelessly', 'Not on the same night as BHA, benzoyl peroxide or AHA — stack the irritation and you get a wrecked barrier, not faster results. Space actives across different nights, exactly as with retinol.'],
                ['Pregnancy and general safety', 'Not for use during pregnancy or if trying to conceive — this applies to all retinoids. Otherwise well-studied and dermatologist-standard for acne and ageing when used correctly.'],
                ['Realistic timeline', 'Weeks 2-6: possible purge, redness, flaking — the hard part. Month 2-3: skin adjusting, texture visibly improving. Month 4-6: clearer skin, faded marks, refined pores — noticeably ahead of what retinol alone would have achieved by then.'],
              ]} />
            </GFold>
            <GFold title="Weekly Additions & Daily Habits">
              <GPairs items={[
                ['Clay mask — 1× per week', 'Aztec Secret with ACV, 10 minutes, deep pore cleanse.'],
                ['AHA exfoliation — 1× per week', 'The Ordinary Glycolic 7%. Resurfaces skin. Never with BHA on the same night.'],
                ['Hydrating sheet mask', 'Korean hyaluronic acid masks for intense moisture.'],
                ['Pillowcase every 2–3 days', 'Bacteria accumulate rapidly.'],
                ['Clean phone screen daily', 'Direct skin contact transfers significant bacteria.'],
                ['Never touch your face', 'All day. And ice roll every morning — reduces redness and puffiness immediately.'],
              ]} />
            </GFold>
            <GCallout tone="red" title="If skin doesn't clear in 8 weeks" text="See a dermatologist. Topical antibiotics (clindamycin), prescription azelaic acid, or oral antibiotics clear what topicals cannot. Low-dose Accutane is the permanent solution for persistent hormonal/bacterial acne. Don't manage it for years when effective solutions exist." />
          </div>
        )}

        {/* ===== DIET TAB ===== */}
        {tab === 'diet' && (
          <div className="fade-up stagger space-y-3">
            <div className="bg-gradient-to-br from-emerald-950/40 to-transparent border border-emerald-500/20 rounded-2xl p-4">
              <h2 className="font-bold text-base text-emerald-300 mb-1">Diet — size, skin and the glow</h2>
              <Tldr points={[
                'Gaining: eat 300-500 kcal over maintenance, 1.6-2.2g protein per kg, four or five meals. Aim for 0.25-0.5kg a week — faster is mostly fat.',
                'Skin: fewer sugar spikes, oily fish twice a week, colourful fruit and veg daily, water. If you break out, test dairy and whey first.',
                'Build every meal the same way: a big protein, a carb, a colour, a fat. The planner below does it for you — swap any meal, tap it for the full recipe.',
              ]} />
              <p className="text-gray-500 text-xs mt-2">
                Your exact calories: <Link to="/plan" className="text-emerald-300 hover:underline">AI Plan</Link> · track it in the <Link to="/food" className="text-emerald-300 hover:underline">Food Log</Link>.
                Numbers below are honest estimates, not lab values.
              </p>
            </div>

            <GFold title="Gaining weight — the rules" tag="Why most skinny guys stay skinny" defaultOpen>
              <GPairs items={[
                ['Eat more than feels normal, consistently', 'Most people who "eat loads" are eating a lot twice a week. Weigh yourself 3 mornings a week; if the weekly average has not moved in two weeks, add 250 kcal a day.'],
                ['Protein every meal', '1.6-2.2g per kg bodyweight a day. At 80kg that is 130-175g — roughly 35-45g across four meals. Without it, a surplus becomes fat instead of muscle.'],
                ['Calorie-dense, not junk', 'Olive oil, nuts, nut butter, whole milk, oats, rice, salmon, mince, eggs, avocado, dried fruit. A tablespoon of olive oil is 120 kcal you do not feel.'],
                ['Drink some of it', 'A shake is the easiest 800-1000 kcal of the day because liquid does not fill you up the same way. Have it between meals, not instead of one.'],
                ['Four or five eating times', 'Three meals plus a shake plus a snack. Appetite grows with routine — the first two weeks are the hardest.'],
                ['Train hard or it will not be muscle', 'The surplus is only building material. The Gym plan is what tells your body to build with it.'],
              ]} />
              <GCallout tone="amber" title="The whey and dairy caveat" text="Whey and milk are the easiest weight-gain tools and also the most common acne triggers in people who are sensitive to them. If your skin gets worse after starting a gaining diet, swap whey for egg or pea protein and milk for oat milk for three weeks before blaming anything else." />
            </GFold>

            <MealPlanner />

            <GFold title="Eating for clearer, brighter skin" tag="What the evidence supports — and what it does not">
              <GLists leftTitle="REDUCE" rightTitle="ADD"
                left={[
                  'High-sugar, high-GI foods — white bread, sweets, fizzy drinks. The best-supported diet link to acne: insulin spikes push oil production.',
                  'Dairy, especially skimmed milk — linked to acne in some people. Test 3 weeks off rather than cutting it forever.',
                  'Whey if you break out on it — see the caveat above.',
                  'Alcohol — dehydrates, wrecks sleep, and shows as puffiness for days.',
                  'Ultra-processed takeaway food — salt and sugar together are what puff the face.',
                ]}
                right={[
                  'Oily fish twice a week (salmon, mackerel, sardines) — omega-3 calms inflammation; fish-oil capsules if you will not eat it.',
                  'Orange and red produce daily — carrots, sweet potato, peppers, tomatoes. Carotenoids give a warmer skin tone that people rate as healthier and more attractive.',
                  'Vitamin C foods — citrus, berries, kiwi, peppers. Your body needs it to make collagen.',
                  'Zinc — red meat, pumpkin seeds, oysters. Low zinc is common in people with acne.',
                  'Water — 2.5-3L a day. It will not cure acne, but dehydrated skin looks dull and tight.',
                ]} />
              <GCallout tone="emerald" title="Honest limits" text="Diet moves skin at the margins over 6-12 weeks. It will not replace a proper routine, and moderate to severe acne needs a GP or dermatologist, not a food list. Chocolate, greasy food on its own, and 'detox' anything have weak or no evidence." />
            </GFold>

            <GFold title="The shopping list" tag="Buy this, and every meal above is 15 minutes away">
              <GPairs items={[
                ['Protein', 'Chicken thighs, beef mince, steak, salmon fillets, tinned tuna, eggs, Greek yoghurt, cottage cheese, whey'],
                ['Carbs', 'Oats, rice, pasta, new potatoes, sweet potatoes, sourdough, bananas'],
                ['Fats', 'Olive oil, butter, peanut butter, almonds, walnuts, avocados'],
                ['Colour', 'Spinach, broccoli, peppers, carrots, tinned tomatoes, berries, oranges or kiwis'],
                ['Flavour', 'Garlic, onions, soy sauce, curry paste, honey, lemons, salsa'],
              ]} />
            </GFold>
            <div className="pt-2"><p className="font-hud text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300/80">Reference</p></div>
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
          </div>
        )}

        {tab === 'techniques' && (
          <>
            <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/20 border border-purple-500/20 rounded-2xl p-4">
            <Tldr points={[
              'Body fat is the single biggest face changer — 10-14% is where a jawline appears. Nothing else here competes with it.',
              'Sleep 8h, SPF every day, and creatine + D3 + omega-3. That is the whole supplement argument.',
              'Debloat for events: cut late salt and alcohol, sleep with your head raised, cold water on the face in the morning.',
              'Tan with SPF, not without it — and a little colour from sport outdoors beats any bed.',
            ]} />
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-purple-400" />
                <h2 className="font-bold text-base text-purple-300">Body & Habits</h2>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Body fat, debloating, diet, supplements, sun and the habits that quietly change how you look. Face-specific methods are in the Face tab; posture is in Gym → Posture.
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
          </>
        )}



        {/* ===== FRAGRANCE TAB ===== */}
        {tab === 'fragrance' && (
          <>
            <Tldr points={[
              'Own two: one fresh scent for the day, one warm scent for nights out. That covers 90% of life.',
              'Two to four sprays on skin — neck and chest. Never rub your wrists together.',
              'Buy decants first. Only buy the full bottle of something you have finished and missed.',
            ]} />
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
              <p className="text-gray-500 text-xs mb-3">Type the fragrances you own (one per line or comma-separated) — AI designs your best combos. Your list is saved as you type, so it survives a failed or slow generation.</p>
              <textarea
                value={fragInput}
                onChange={e => updateFragInput(e.target.value)}
                placeholder={'e.g.\nVersace Eros EDT\nDior Sauvage EDP\nJPG Le Male Le Parfum'}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
              />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {['any', 'summer', 'winter', 'spring', 'autumn'].map(s => (
                  <button key={s} onClick={() => updateFragSeason(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-all ${
                      fragSeason === s ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                    }`}>
                    {s === 'any' ? 'Any season' : s}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {['any', 'day', 'night', 'date', 'gym', 'formal'].map(o => (
                  <button key={o} onClick={() => updateFragOccasion(o)}
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
                  {layeringBusy ? <><Loader2 size={15} className="animate-spin" /> Mixing… (up to a minute)</> : 'Build My Combos'}
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
                  {(layering.combos ?? []).map(c => (
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

      </div>

      <BottomNav />
    </div>
  );
}
