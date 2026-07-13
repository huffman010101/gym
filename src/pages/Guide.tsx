import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronDown, AlertTriangle, Sun, Moon, Sparkles } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'skin' | 'bone' | 'fatloss' | 'jaw' | 'hair' | 'grooming' | 'posture' | 'debloat' | 'supps' | 'lifestyle' | 'execution' | 'aura' | 'social';

const TABS: { id: Tab; label: string }[] = [
  { id: 'skin', label: 'Skin' },
  { id: 'bone', label: 'Bone' },
  { id: 'fatloss', label: 'Fat Loss' },
  { id: 'jaw', label: 'Jaw' },
  { id: 'hair', label: 'Hair' },
  { id: 'grooming', label: 'Grooming' },
  { id: 'posture', label: 'Posture' },
  { id: 'debloat', label: 'Debloat' },
  { id: 'supps', label: 'Supps' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'execution', label: 'Execution' },
  { id: 'aura', label: 'Aura 0→100' },
  { id: 'social', label: 'Social Edge' },
];

function Step({ n, title, desc, products }: { n: string; title: string; desc: string; products?: string[] }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center flex-shrink-0 text-amber-400 font-black text-[11px] mt-0.5">{n}</div>
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

function Fold({ title, tag, children, defaultOpen = false }: { title: string; tag?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          {tag && <p className="text-xs text-amber-400/70 mt-0.5">{tag}</p>}
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

function Pairs({ items }: { items: [string, string][] }) {
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

function Callout({ title, text, tone = 'amber' }: { title: string; text: string; tone?: 'amber' | 'red' | 'emerald' }) {
  const tones = {
    amber: 'bg-amber-500/5 border-amber-500/20 text-amber-200/85',
    red: 'bg-red-500/5 border-red-500/20 text-red-200/85',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200/85',
  };
  return (
    <div className={`border rounded-xl px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs leading-relaxed"><span className="font-bold">{title}:</span> {text}</p>
    </div>
  );
}

function Lists({ left, right, leftTitle, rightTitle }: { left: string[]; right: string[]; leftTitle: string; rightTitle: string }) {
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

export default function Guide() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (TABS.map(x => x.id) as string[]).includes(t || '') ? (t as Tab) : 'skin';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-amber-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <BookOpen className="text-amber-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">The Blueprint</h1>
            <p className="text-gray-500 text-sm">Your complete appearance, aura & social protocol</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-4">
          {[['4–6', 'weeks to first visible changes'], ['3', 'months to dramatic shift'], ['6+', 'months to compound results']].map(([n, d]) => (
            <div key={d} className="bg-[#111] border border-white/8 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-amber-400">{n}</p>
              <p className="text-[10px] text-gray-500 leading-tight">{d}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                tab === t.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ================= SKIN ================= */}
        {tab === 'skin' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">01</span> Skin & Acne Protocol</h2>
              <p className="text-gray-400 text-sm leading-relaxed">For active acne on cheeks and jaw (bacterial + hormonal), post-inflammatory marks, congested pores, blackheads, milia and uneven texture. The underlying tone is strong — clearing breakouts and fading marks creates a dramatic difference fast.</p>
            </div>
            <Callout tone="amber" title="The SPF Rule" text="SPF 50 every single morning without exception — indoors, cloudy days, all of it. UV penetrates glass. Without SPF, every dark mark gets re-damaged daily and never fully fades. Retinol also sharply increases sun sensitivity. This single step decides whether everything else works." />
            <Fold title="Morning Routine" tag="6 steps, in order" defaultOpen>
              <Step n="01" title="Cleanse" desc="Lukewarm water — never hot (strips the barrier). Circular motions for a full 60 seconds. Pat dry, never rub." products={['CeraVe Foaming Cleanser', 'La Roche-Posay Toleriane']} />
              <Step n="02" title="Niacinamide 10%" desc="Most versatile morning ingredient. Shrinks pores, controls oil, fades dark spots, calms redness, strengthens the barrier. Wait 60 seconds before next step." products={['The Ordinary 10% Niacinamide + Zinc']} />
              <Step n="03" title="Vitamin C Serum" desc="The most important morning ingredient after SPF. Brightens tone, fades hyperpigmentation, protects from UV, boosts collagen. Wait 60 seconds." products={['Timeless 20% Vit C + E Ferulic', 'Skinceuticals CE Ferulic (premium)']} />
              <Step n="04" title="Eye Cream" desc="Tap in with ring finger only — minimum pressure. Never rub the under-eye area." products={['The Ordinary Caffeine 5% + EGCG', 'The Inkey List Caffeine']} />
              <Step n="05" title="Moisturise" desc="Even oily skin needs this. Skipping causes the skin to overproduce sebum in compensation, making oiliness and acne worse." products={['CeraVe Moisturising Cream', 'Neutrogena Hydro Boost']} />
              <Step n="06" title="SPF 50 — always last" desc="Reapply every 2 hours outdoors. Without this, every other product is half as effective and dark marks actively worsen." products={['LRP Anthelios Invisible Fluid', 'Isntree Watery Sun Gel']} />
            </Fold>
            <Fold title="Night Routine" tag="8 steps — actives alternate">
              <Step n="01" title="Oil Cleanse (first cleanse)" desc="Massage oil into DRY face for 90 seconds. Add water to emulsify, rinse. Dissolves sunscreen, sebum and pollution — your second cleanser cannot work without this." products={['Skin1004 Centella Cleansing Oil', 'DHC Deep Cleansing Oil']} />
              <Step n="02" title="Second Cleanse" desc="Same as morning. Now actually cleaning the skin beneath surface debris." />
              <Step n="3A" title="BHA — 3× per week" desc="The only ingredient that enters the pore and dissolves blockages from within. Essential for blackheads. Results at 4–6 weeks. NEVER with Benzoyl Peroxide or retinol on the same night." products={["Paula's Choice 2% BHA Liquid"]} />
              <Step n="3B" title="Benzoyl Peroxide 2.5% — alternate nights" desc="Thin layer over the full cheek and jaw area — not just spots. Kills acne bacteria. BP nights and BHA nights alternate — never both together." products={['LRP Effaclar Duo 2.5%']} />
              <Step n="04" title="Targeted treatments (pick by concern)" desc="Alpha Arbutin — best for post-acne dark marks. Azelaic Acid — kills bacteria AND fades marks, reduces redness. Tranexamic Acid — exceptional for stubborn red marks." products={['The Ordinary Alpha Arbutin 2%', 'Azelaic Acid 10%', 'Tranexamic Acid']} />
              <Step n="05" title="Retinol — build up slowly" desc="The most proven long-term skin transformer. Milia clear gradually with retinol — do not squeeze them. You will purge initially — push through, it's normal." products={['CeraVe Resurfacing Retinol', 'The Ordinary Retinol 0.2% in Squalane']} />
              <Step n="06" title="Moisturise" desc="Seals everything in and reduces retinol irritation significantly." />
              <Step n="07" title="Face oils" desc="2 drops squalane + 2 drops rosehip, warmed between palms, pressed gently in. Rosehip fades scars and marks; squalane locks moisture without clogging. After moisturiser." products={['The Ordinary Squalane', 'The Ordinary Rosehip Oil']} />
              <Step n="08" title="Slugging — 2–3× per week, absolute last step" desc="Thin layer of Vaseline over everything. Locks in every product underneath. Wake up with softer, plumper, clearer skin. Doesn't break you out when done over a complete routine." products={['Vaseline Original', 'Aquaphor']} />
            </Fold>
            <Fold title="Retinol Build-Up Schedule" tag="Rushing this = wrecked skin barrier">
              <Pairs items={[
                ['Weeks 1–2 — twice per week', 'Skin adjusting. Mild dryness is normal.'],
                ['Weeks 3–4 — 3× per week', 'May see purging — temporary breakout increase. Push through it.'],
                ['Month 2 — every other night', 'Texture improving, pores refining. Marks beginning to fade noticeably.'],
                ['Month 3+ — nightly', 'Full benefits: smooth texture, clear pores, faded marks. Now consider stepping up to 0.3–0.5%.'],
              ]} />
            </Fold>
            <Fold title="Weekly Additions & Daily Habits">
              <Pairs items={[
                ['Clay mask — 1× per week', 'Aztec Secret with ACV, 10 minutes, deep pore cleanse.'],
                ['AHA exfoliation — 1× per week', 'The Ordinary Glycolic 7%. Resurfaces skin. Never with BHA on the same night.'],
                ['Hydrating sheet mask', 'Korean hyaluronic acid masks for intense moisture.'],
                ['Pillowcase every 2–3 days', 'Bacteria accumulate rapidly.'],
                ['Clean phone screen daily', 'Direct skin contact transfers significant bacteria.'],
                ['Never touch your face', 'All day. And ice roll every morning — reduces redness and puffiness immediately.'],
              ]} />
            </Fold>
            <Fold title="Diet — Direct Skin Impact">
              <Lists leftTitle="REMOVE" rightTitle="ADD"
                left={['Dairy — most directly linked to cheek/jaw acne. Eliminate 30 days and observe.', 'High glycemic foods — white bread, sugar, pasta. Insulin spikes drive sebum.', 'Alcohol — dehydrates skin, destroys sleep, accelerates ageing.', 'Processed foods — systemically inflammatory.']}
                right={['Fatty fish (salmon, sardines) — omega-3 for barrier and anti-inflammation.', 'Spearmint tea 2 cups daily — reduces androgens driving hormonal acne.', 'Green tea — antioxidants, mildly reduces DHT.', 'Berries, avocado, sweet potato — antioxidants and vitamin A.']} />
            </Fold>
            <Callout tone="red" title="If skin doesn't clear in 8 weeks" text="See a dermatologist. Topical antibiotics (clindamycin), prescription azelaic acid, or oral antibiotics clear what topicals cannot. Low-dose Accutane is the permanent solution for persistent hormonal/bacterial acne. Don't manage it for years when effective solutions exist." />
          </div>
        )}

        {/* ================= BONE ================= */}
        {tab === 'bone' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">02</span> Facial Bone Development</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Under 25, facial bones remain genuinely responsive to mechanical forces. This is the most important window of your life for structural facial development — permanent, compounding changes impossible to achieve later.</p>
            </div>
            <Callout tone="amber" title="The Core Principle" text="Bone responds to mechanical load applied consistently over time. Teeth, tongue, muscles and posture exert constant pressure on facial bones 24h a day. The direction of those forces shapes your face — intentionally or not." />
            <Fold title="Mewing — Foundational & Most Important" tag="Correct tongue posture, 24/7" defaultOpen>
              <Pairs items={[
                ['Key 1 — Tongue completely flat on the roof of the mouth', 'Not just the tip — the ENTIRE tongue including the back third must contact the soft palate. This is what most people miss. The front third alone does almost nothing.'],
                ['Key 2 — Lips sealed, teeth lightly touching', 'Breathe exclusively through the nose. Mouth breathing causes low tongue, narrow palate and midface drop over time. Nasal breathing is non-negotiable.'],
                ['Key 3 — 24/7 resting posture, not an exercise', 'Must become your unconscious resting state. Effects accumulate over months to years: forward maxillary growth, wider palate, more defined jaw angles, lifted cheekbones, better airway.'],
                ['Key 4 — Tongue press exercise (active component)', 'Push tongue hard into the roof of the mouth 5 seconds, release. 10 reps, 2–3× daily. Add fist under chin pressing downward simultaneously — targets the suprahyoid for jaw-neck separation.'],
              ]} />
            </Fold>
            <Fold title="Masseter Development" tag="Jaw width and squareness — responds fast">
              <Pairs items={[
                ['Mastic gum — 20–30 minutes daily', 'The hardest gum available, real resistance. Chew EQUALLY on both sides — asymmetric chewing creates facial asymmetry. Visible definition at 3 months; significant at 6. Brands: Falim (Turkish, very firm) or authentic Greek mastic.'],
                ['Chin tucks — 30+ daily', 'Stand against wall, pull chin straight back until head touches, hold 5–10s. Fixes forward head posture (which destroys side-profile jaw definition) and develops the jaw-neck framing muscles.'],
              ]} />
            </Fold>
            <Fold title="Cheekbone Enhancement">
              <Pairs items={[
                ['Mewing — indirect cheekbone effect', 'Forward maxillary growth lifts the entire midface, raising cheekbones visually and structurally over years. Permanent structural change.'],
                ['Cheek lifter exercise', 'Open mouth into an O, fold upper lip over teeth, smile to lift cheek muscles, hold 1s, lower. 10 reps × 3 sets. Builds the zygomatic muscle.'],
                ['Gua sha along cheekbone', 'Flat side at corner of mouth, scrape firmly up and out toward the temple. 10 strokes each side every morning. Combined with debloating, reveals structure fast.'],
                ['Body fat reduction — the core', 'Cheekbones exist for almost everyone — they\'re obscured by fat. 10–12% body fat reveals the structure that was always there. See Fat Loss.'],
              ]} />
            </Fold>
            <Callout tone="emerald" title="Why this matters for looks" text="Forward maxilla growth lifts the under-eye area and defines cheekbones. A developed masseter widens the lower face creating the angular jaw. Forward head posture correction changes the profile — potentially the most visible single structural change on this list." />
          </div>
        )}

        {/* ================= FAT LOSS ================= */}
        {tab === 'fatloss' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">03</span> Fat Loss & Face Reveal</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Body fat % is the single most impactful variable for facial definition. Every 1% reduction reveals more jawline, cheekbones and neck definition. You cannot spot-reduce face fat — only full-body loss works. But the face is usually where it shows first.</p>
            </div>
            <Callout tone="amber" title="Target Range" text="At 10–12% body fat, facial bone structure becomes clearly defined — cheekbones emerge, jawline sharpens, jaw-neck separation becomes distinct. Lean but absolutely achievable with a sustained modest deficit." />
            <Fold title="The Calorie Deficit" defaultOpen>
              <Pairs items={[
                ['300–500 calorie daily deficit — sustainable wins', 'A 500 kcal deficit ≈ 0.5kg fat loss/week. More aggressive = muscle loss, hair shedding, hormonal disruption and skin deterioration — all counterproductive to appearance.'],
                ['Protein: 2–2.4g per kg bodyweight daily', 'Preserves muscle in a deficit — the difference between defined and hollowed. Directly supports skin and hair too. Aim 160–200g daily.'],
                ['Resistance training 3–4×/week minimum', 'Preserves and builds muscle while cutting, and raises resting metabolic rate. This is what separates lean-and-defined from just thin.'],
              ]} />
            </Fold>
            <Fold title="Training for Facial Definition">
              <Lists leftTitle="KEY LIFTS" rightTitle="CARDIO APPROACH"
                left={['Compound lifts (squat, deadlift, row, press) — max metabolic stimulus and retention.', 'Neck training every other day — jaw-neck separation.', 'Face pulls every session — posture that frames the face.', 'Pull-ups and rows — upper back width brings the head into proportion.']}
                right={['Zone 2 walking 8–10k steps daily — low cortisol, high burn, no muscle loss.', '2–3 low-moderate cardio sessions weekly, 30–40 min.', 'Avoid excessive HIIT in a deficit — cortisol promotes facial retention.', 'Daily movement is the most underrated fat loss tool.']} />
            </Fold>
            <Fold title="Diet for Fat Loss and Skin">
              <Lists leftTitle="CUT THESE" rightTitle="BUILD MEALS AROUND"
                left={['Dairy — inflammatory, acne-driving, water-retaining.', 'Alcohol — 7 cal/g, zero nutrition, wrecks sleep and cortisol.', 'Ultra-processed foods — calorie dense, low satiety.', 'Liquid calories — juice, soft drinks, energy drinks.']}
                right={['Lean protein every meal — chicken, fish, eggs, Greek yoghurt.', 'High-volume vegetables — full stomach, minimal calories.', 'Fatty fish 3×/week — omega-3 cuts cortisol-driven retention.', 'Potassium foods — banana, avocado, sweet potato — counteract sodium.']} />
            </Fold>
          </div>
        )}

        {/* ================= JAW ================= */}
        {tab === 'jaw' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">04</span> Jawline Enhancement</h2>
              <p className="text-gray-400 text-sm leading-relaxed">A strong jawline = low body fat revealing the bone + masseter size + correct tongue posture guiding bone development + zero facial bloat. All four are actionable.</p>
            </div>
            <Fold title="The Jaw Routine" defaultOpen>
              <Pairs items={[
                ['Mewing — 24 hours per day', 'The single most important jawline habit. Under 25 this produces genuine structural results over 12–18 months that are permanent. Non-negotiable.'],
                ['Mastic gum — 20–30 min daily', 'Hypertrophies the masseter. Both sides equally. Jaw angles visibly wider and squarer at 3–6 months — the fastest visible jaw change available.'],
                ['Chin tucks — 30+ daily', 'Pull chin straight back horizontally, hold 5–10s. Repositions the cervical spine, improves side-profile jaw definition, builds neck flexors. Throughout the day, not just morning.'],
                ['Neck curls — 3 sets of 12, 3× daily protocol', 'Lie flat, tuck chin, lift head slightly, hold briefly, lower slowly. Builds the front-neck muscles that create jaw-neck separation — one of the most visually important jaw features from any angle.'],
                ['Gua sha along jawline — daily', 'Sequence: open the lymph drain at the collarbone FIRST (10 downward presses). Then scrape from centre of chin outward along the jawline to the ear, 10 strokes each side. Does the most for the jaw of any single morning tool.'],
              ]} />
            </Fold>
            <Callout tone="amber" title="The Biggest Lever" text="Reducing body fat reveals the jawline more than any exercise, gum or practice. Everything else enhances what fat loss reveals. The hierarchy: fat loss → debloating → mewing/bone → masseter development." />
          </div>
        )}

        {/* ================= HAIR ================= */}
        {tab === 'hair' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">05</span> Hair & Scalp</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Thick, dark hair with natural wave and good density is a genuine asset — currently unstyled. The right products and routine unlock it dramatically. Scalp health is the foundation for growth, thickness and texture.</p>
            </div>
            <Fold title="Scalp Health" defaultOpen>
              <Pairs items={[
                ['Scalp massage — 5–10 min daily', 'Fingertips only, never nails. Firm circles across the whole scalp. Clinically shown to increase hair thickness over time via blood flow.'],
                ['Rosemary oil — 3× weekly, the most important growth tool', 'Clinically proven as effective as Minoxidil for growth and thickness. 3–4 drops in jojoba carrier, massage in, leave 30+ min or overnight. Compounds over months.'],
                ['Dermaroller 0.5mm — weekly', 'Micro-stimulation triggers the growth response. Apply rosemary oil immediately after. Dermaroller + rosemary + massage together beat any single tool by far.'],
                ['Scalp scrub — weekly', 'Removes buildup, dead skin and oil that clog follicles. Briogeo Scalp Revival or DIY brown sugar + conditioner.'],
              ]} />
            </Fold>
            <Fold title="Washing Routine">
              <Pairs items={[
                ['Maximum 3× per week', 'Daily washing strips the oils that define your wave pattern. If using Nizoral for dandruff: 2–3×/week with a gentler shampoo on off-days.'],
                ['Shampoo scalp only, conditioner lengths only', 'Dragging shampoo through lengths strips them; conditioner on scalp causes grease. Cold water final rinse seals the cuticle — shinier, more defined waves.'],
                ['Microfibre towel or old t-shirt — scrunch, never rub', 'Regular towels cause the friction that makes waves frizzy. Scrunching forms the wave. Never heat-dry without a diffuser.'],
              ]} />
            </Fold>
            <Fold title="Products for Wavy Hair">
              <Pairs items={[
                ['Define waves', 'Verb Ghost Whip or Verb Curl Cream — apply to damp hair, scrunch upward, air dry.'],
                ['Light hold + shine', 'Verb Ghost Oil — small amount through damp lengths.'],
                ['Structured texture', 'Uppercut Deluxe Clay — DRY hair only, for control.'],
                ['Deep condition — weekly', 'Olaplex No.3 or K18 Mask — towel-dry hair, 20–30 min, rinse.'],
              ]} />
              <Callout tone="red" title="Never" text="Heavy clay or pomade on damp wavy hair — it collapses the wave pattern entirely and looks greasy. Clay goes on dry hair only. Damp hair gets curl cream, ghost oil or mousse." />
            </Fold>
            <Fold title="Haircut Guidance — longer/narrower face">
              <Lists leftTitle="AVOID" rightTitle="ASK FOR"
                left={['Slicked back — elongates the face further.', 'High volume on top — adds vertical length.', 'Growing out unshaped — unkempt, not intentional.', 'Raised square back — width in the wrong place, draws eyes to the crown.']}
                right={['French Crop — horizontal fringe adds width, reduces perceived length.', 'Textured Crop with mid fade — works with the wave, clean sides.', 'Say: "Textured top with movement, low-to-mid taper, texturise the top to define the wave. Flat taper at the back — don\'t square it off."', 'Bring reference photos. Always.']} />
            </Fold>
          </div>
        )}

        {/* ================= GROOMING ================= */}
        {tab === 'grooming' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">06</span> Grooming & Detail</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Brows, facial hair, lips, under-eyes, teeth — the details that decide whether the whole reads as deliberate.</p>
            </div>
            <Fold title="Eyebrows" tag="Strong thick brows = asset. Make them deliberate." defaultOpen>
              <Pairs items={[
                ['Get threaded monthly — not waxed', 'Threading is more precise. Tell them: keep masculine and full, clean the middle gap, define the arch slightly, strays from UNDER the brow bone only — nothing from the top. Every 3–4 weeks, £5–10.'],
                ['Brush up with a spoolie + clear brow gel daily', 'Brushed-up brows look intentional, full and defined. 20 seconds. Boy Brow by Glossier (clear).'],
                ['Castor oil nightly', 'Clean spoolie, every night. Density and growth visible within 4–6 weeks.'],
              ]} />
            </Fold>
            <Fold title="Facial Hair">
              <Pairs items={[
                ['Clean shave', 'Most intentional while coverage is developing. Shows the jawline clearly. Maintain daily or every 2 days.'],
                ['Light stubble (1–2mm)', 'Trimmer with guard. Define the neckline and cheek line SHARPLY — that\'s what makes it intentional. Every 2–3 days.'],
                ['Full beard', 'Commit through the 4–6 week awkward phase. Topical Minoxidil on the face increases coverage if patchy. Shape weekly.'],
              ]} />
              <Callout tone="amber" title="Neckline Rule" text="Two fingers above the Adam's apple, curved ear to ear. Never a straight horizontal line. Sharp edges are the difference between groomed and unkempt. Always fade the beard into sideburns and hairline." />
            </Fold>
            <Fold title="Lips">
              <Pairs items={[
                ['Nightly', 'Aquaphor or CeraVe Healing Ointment as a lip mask. Wake up noticeably softer.'],
                ['Daytime', 'SPF lip balm — Jack Black Intense Therapy or EOS. And do NOT lick your lips — saliva dries them further.'],
                ['Weekly + hyperpigmentation', 'Exfoliate: Vaseline + soft toothbrush, circles, 60s (or brown sugar + honey + coconut oil scrub). Vitamin C carefully at the lip border fades discolouration; daily SPF prevents further darkening.'],
              ]} />
            </Fold>
            <Fold title="Under Eyes">
              <Pairs items={[
                ['AM — caffeine serum', 'Tap with ring finger only, never rub. Reduces puffiness and darkening. The Ordinary Caffeine 5% + EGCG.'],
                ['Nightly — castor oil on the lash line', 'Clean spoolie. Visibly thicker lashes in 6–8 weeks.'],
                ['Morning — gua sha under eye, outward only', 'Very gentle strokes toward the temple. Moves lymph, kills overnight puffiness. Never inward or pressing down.'],
              ]} />
            </Fold>
            <Fold title="Teeth">
              <Pairs items={[
                ['Daily', 'Electric toothbrush 2× + floss every night.'],
                ['Whitening', 'Strips 2–3× per year — HiSmile or Crest Whitestrips.'],
                ['Warning', 'Gum recession cannot be reversed — never brush hard at the gum line.'],
              ]} />
            </Fold>
          </div>
        )}

        {/* ================= POSTURE ================= */}
        {tab === 'posture' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">07</span> Posture & Structure</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Anterior pelvic tilt, rounded shoulders, forward head posture and rib flare are one interconnected chain: tight hip flexors and chest from sitting + weak glutes, deep core and upper back. All fully correctable.</p>
            </div>
            <Callout tone="amber" title="Forward head posture and your jaw" text="When the head sits forward of the shoulders, the jaw recedes visually, the neck shortens, and jaw-neck separation disappears entirely — even at low body fat. Fixing head posture is one of the highest-impact changes for jaw appearance." />
            <Fold title="The 10-Minute Daily Routine — every morning" defaultOpen>
              <Pairs items={[
                ['Dead hang — 45–60s', 'Decompresses the spine, opens shoulders passively.'],
                ['90-90 breathing — 10 slow breaths, legs up wall', 'Rib flare + deep core: full exhale, pull ribs DOWN, posteriorly tilt the pelvis.'],
                ['Hip flexor stretch (low lunge) — 60–90s each side', 'For APT — squeeze the rear glute and tuck the pelvis while holding.'],
                ['Glute bridges — 20 reps, 2s hold at top', 'Activates the inhibited glutes — root cause of APT.'],
                ['Dead bug — 10 each side', 'Transverse abdominis — lower back FLAT into the floor throughout. Fixes lower-belly protrusion.'],
                ['Chin tucks (wall) — 15–20 reps, 5–10s hold', 'Forward head posture — repositions the cervical spine over time.'],
                ['Wall angels — 10 reps', 'Rounded shoulders + thoracic mobility.'],
                ['Doorway chest stretch — 30–45s', 'Releases the tight pec minor pulling shoulders forward.'],
                ['Band pull-aparts — 20 reps', 'Rear delts and mid-back — pulls shoulders into position.'],
                ['Stomach vacuum — 3 × 20–30s, fasted', 'Transverse abdominis — directly reduces lower belly protrusion.'],
              ]} />
            </Fold>
            <Fold title="Stomach Vacuum — most important for the belly">
              <Pairs items={[
                ['How', 'Exhale completely, then pull belly button to spine — draw the navel inward and upward as hard as possible without inhaling. Hold 10–30s, release slowly. Fasted every morning.'],
                ['Progression', 'Weeks 1–2: 3×10s. Weeks 3–4: 3×20s. Month 2: 3×30s. Month 3+: standing and walking throughout the day — that\'s when it becomes a postural habit.'],
              ]} />
            </Fold>
            <Fold title="Neck Training — every other day">
              <Pairs items={[
                ['Neck curls — 3×10–12', 'Lie on back, tuck chin, lift head slightly, hold briefly, lower slowly. Front neck and jaw-neck separation.'],
                ['Neck extensions — 3×10–12', 'Face down, head off bench edge. Raise to neutral, lower slowly. Back neck.'],
                ['Lateral flexion — 3×10 each side', 'Sit upright, tilt toward shoulder with gentle hand resistance. Side neck.'],
                ['Tongue press — 2–3× daily anywhere', 'Fist under chin, press tongue down against it, 5s × 10–15. Suprahyoid — jaw-neck separation.'],
              ]} />
            </Fold>
            <Fold title="Back Extensions & Erector Training" tag="The armour of the lower back — posture, power, and the V from behind">
              <Pairs items={[
                ['Why they matter', 'Strong spinal erectors hold your posture upright all day (a weak lower back is why posture collapses by evening), protect you in every heavy lift, and build the visible ridges of muscle along the spine that complete a developed back.'],
                ['Bodyweight back extension — 3×12-15, 2-3×/week', 'On the 45° bench: hips ON the pad edge, hinge down under control, drive up by squeezing glutes and hamstrings first, finish with the spine neutral — NOT hyperextended. Ribs down at the top; arching past straight shifts stress to the discs.'],
                ['Progression: weighted extensions', 'Hold a plate to your chest (start 5-10kg), add gradually. 3×10-12. When the bench feels easy, this is one of the best hamstring-glute-erector builders in the gym.'],
                ['The glute-focused variant', 'Round the upper back slightly, tuck the chin, and pivot purely from the hips squeezing glutes hard at the top — turns the same bench into a glute builder (great for APT fix).'],
                ['Alternatives that hit the same chain', 'Romanian deadlifts (the king — 3×8-10), good mornings (light, strict), reverse hypers if available, and supermans/bird-dogs at home (3×15, holds at top).'],
                ['Programming', 'Slot after your main compound on pull/leg days. Erectors recover slowly — 2-3 quality sessions a week beats daily grinding. If your lower back rounds in squats/deadlifts or pumps up painfully when standing, this is the weak link to fix.'],
                ['Form line that saves your spine', 'Move at the HIPS, not the lower back. The spine stays one rigid unit; the hinge happens below it. Sharp pain (vs muscle burn) = stop and reassess, don\'t push through.'],
              ]} />
            </Fold>
            <Fold title="Neck Thickness — the full build programme" tag="From pencil neck to frame: the most underrated aesthetic + combat muscle">
              <Pairs items={[
                ['Why the neck is a cheat code', 'It\'s visible in EVERY outfit, frames the jaw from every angle, adds instant physical presence (a 2-3cm thicker neck changes how your whole head-shoulder structure reads), and in combat it\'s literal concussion protection.'],
                ['Phase 1 (weeks 1-4): wake it up', 'No load. Neck curls 3×15 (lying on back, chin tuck, curl head up slow), neck extensions 3×15 (face down, head off the bench edge), lateral raises 2×12 each side (on your side), + manual isometrics: palm against forehead/side/back, push and resist 10s × 5 each direction. Every other day.'],
                ['Phase 2 (month 2+): add resistance', 'Plate on forehead for curls (start 2.5kg, towel underneath), plate on the back of the head for extensions, or a neck harness (£15-25, the best purchase for this) — 3-4×12-15 with the harness, slow and controlled. Progress the weight like any lift: +1.25-2.5kg when 15 reps feel clean.'],
                ['Phase 3: the full routine (every other day, ~12 min)', 'Harness extensions 4×15 · plate curls 3×15 · lateral flexion 2×12/side · shrugs 3×12 (heavy dumbbells — traps are half the "thick neck" look) · finish with the suprahyoid tongue press for the jaw-neck line.'],
                ['Growth expectations', 'The neck responds FAST — most people add 2-4cm of circumference in 4-6 months of consistent training. Measure monthly at the Adam\'s apple; it\'s the most motivating tape measurement on the body.'],
                ['Combat carryover', 'A strong neck resists chokes longer, absorbs strikes better (less head whip = fewer flash knockdowns), and makes your posture in the clinch far harder to break. Wrestlers train neck daily for a reason.'],
                ['Safety rules', 'Never train the neck to failure · full control, zero jerking · no wrestling bridges until months of harness work (and honestly, the harness makes them unnecessary) · slight muscle soreness is normal, joint/nerve sensations are not — back off if anything tingles.'],
              ]} />
            </Fold>
            <Fold title="Gym Additions & Daily Habits">
              <Lists leftTitle="REMOVE / REDUCE" rightTitle="ADD EVERY SESSION"
                left={['Front raises — front delts already overdeveloped from pressing.', 'Any pressing before face pulls are done.', 'Face-down sleeping — ruins neck alignment completely.']}
                right={['Face pulls 3×15–20 at the START of every session — the most important exercise for these issues.', 'Band pull-aparts 3×15 as warm-up.', 'Rear delt flyes 3×15 on pull days.', 'Phone at eye level always · posture alarm every 30–45 min · sit on sit bones · back sleeping (side with pillow between knees acceptable).']} />
            </Fold>
          </div>
        )}

        {/* ================= DEBLOAT ================= */}
        {tab === 'debloat' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">08</span> Face Debloating</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Facial bloat conceals structure — jawline, cheekbones and eye-socket definition all disappear under retained fluid. Most bloat = sodium, dairy, poor lymphatic drainage and low-grade inflammation. All addressable.</p>
            </div>
            <Fold title="Morning Debloating Sequence — 7 minutes" defaultOpen>
              <Pairs items={[
                ['FIRST — open the lymph drain (collarbone press)', 'Press gently downward at the collarbone 10 times. This opens the terminal lymph node where ALL facial lymph drains. Massaging the face without this is squeezing a balloon with no opening.'],
                ['THEN — gua sha, always outward and upward', '2–3 drops facial oil first. Neck downward to collarbone → jawline out to ear → cheekbone out to temple → under-eye out to temple → forehead out to temples. 10 strokes each. Visible in days; structural benefit accumulates for months. Rose quartz or bian stone + jojoba/squalane.'],
                ['AFTER — ice roller, 30 seconds', 'Roll outward in the same directions. Cold constricts vessels, kills puffiness and redness instantly. Alternative: ice-cold water splash 30s.'],
              ]} />
            </Fold>
            <Fold title="Dietary Debloating">
              <Lists leftTitle="CAUSES BLOAT" rightTitle="REDUCES BLOAT"
                left={['Sodium — the greatest culprit. Kill processed foods (hidden salt).', 'Dairy — inflammatory, retains water specifically in the face.', 'Alcohol — massive next-day facial puffiness.', 'Carbonated drinks — gas retention expands the face visibly.', 'Gluten — considerable facial bloat for the sensitive.']}
                right={['Water 3–4L daily — more water = LESS retention.', 'Potassium: banana, avocado, sweet potato — counteracts sodium.', 'Green tea — natural diuretic, anti-inflammatory.', 'Dandelion tea — effective natural diuretic.', 'Asparagus, cucumber — natural diuretics, high water.']} />
            </Fold>
            <Fold title="Lifestyle Debloating">
              <Pairs items={[
                ['Sleep', 'On your back, head elevated. Never face-down. 8+ hours.'],
                ['Movement', 'Daily exercise is the ONLY way lymph drains — it has no pump of its own.'],
                ['Stress', 'Cortisol causes retention — manage it (see Lifestyle).'],
              ]} />
            </Fold>
          </div>
        )}

        {/* ================= SUPPS ================= */}
        {tab === 'supps' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">09</span> Supplement Stack</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Evidence-backed supplements with meaningful appearance impact. Additions to a good diet, not substitutes.</p>
            </div>
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <div className="space-y-3">
                {[
                  ['Zinc — 30mg daily', 'Reduces acne (as effective as low-dose antibiotics in some studies). Supports testosterone and immunity.'],
                  ['Omega-3 Fish Oil — 2–4g daily', 'Cuts the systemic inflammation driving redness, breakouts and retention. Skin hydration and hair quality.'],
                  ['Vitamin D3 + K2 — 5000IU D3 daily', 'Almost everyone is deficient. Skin clarity, mood, immunity, testosterone. K2 sends calcium to bones, not arteries.'],
                  ['Magnesium Glycinate — 400mg at night', 'Significantly reduces water retention. Better sleep, lower cortisol — both directly reduce facial puffiness.'],
                  ['Creatine — 5g daily', 'Muscle performance and retention during fat loss + cognitive benefits. Every day, consistently.'],
                  ['Biotin — 5000mcg daily', 'Keratin production — hair and nail growth.'],
                  ['Collagen Peptides — 10g daily', 'Skin elasticity and firmness. Joint health.'],
                  ['Vitamin B6 — 50mg daily', 'Natural diuretic effect, hormone regulation.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-amber-300">{t}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <Callout tone="emerald" title="Spearmint tea — separate mention" text="2 cups daily. Reduces the androgens (DHT) that drive hormonal acne on cheeks and jaw. One of the most effective non-prescription interventions for hormonal acne. 4–6 weeks to notice change." />
          </div>
        )}

        {/* ================= LIFESTYLE ================= */}
        {tab === 'lifestyle' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">10</span> Lifestyle Foundations</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Not optional extras — the substrate everything runs on. Poor sleep, chronic stress and dehydration actively undermine every product, supplement and exercise in this guide.</p>
            </div>
            <Fold title="Sleep" defaultOpen>
              <Pairs items={[
                ['8+ hours — non-negotiable', 'Sleep deprivation raises cortisol (puffiness + acne), lowers testosterone (impairs fat loss and muscle), increases retention, worsens under-eyes, slows all skin healing.'],
                ['On your back, head slightly elevated', 'Fluid pools when the face is pressed down. Face-down sleeping also wrecks neck alignment and feeds forward head posture.'],
                ['Consistent timing + dark cool room + no screens 60 min before', 'Blue light suppresses melatonin. Magnesium glycinate 400mg before bed measurably improves sleep quality.'],
              ]} />
            </Fold>
            <Fold title="Hydration & Stress">
              <Pairs items={[
                ['3–4 litres water daily minimum', 'Large glass immediately on waking. Less puffiness, clearer skin, better cognition.'],
                ['Stress management', 'Chronic cortisol causes breakouts, facial bloat, hair shedding, accelerated ageing and face-fat accumulation. Exercise is the most effective cortisol tool available; 10 min meditation or breathwork daily measurably lowers it over time.'],
              ]} />
            </Fold>
          </div>
        )}

        {/* ================= EXECUTION ================= */}
        {tab === 'execution' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1"><span className="text-amber-400">11</span> Execution Order</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Consistency over perfection: 70% of this for 6 months beats 100% for 2 weeks then stopping. Start with the highest-leverage habits, layer in more over time.</p>
            </div>
            <Fold title="Week 1 — Start Now" tag="The foundations" defaultOpen>
              <Pairs items={[
                ['Skin', 'Cleanser + niacinamide + moisturiser + SPF every morning · Benzoyl Peroxide 2.5% on cheeks/jaw every night.'],
                ['Structure', '10-min posture routine every morning · begin mewing as resting posture NOW · gua sha + ice roller every morning.'],
                ['Inputs', 'Cut dairy completely for 30 days · zinc 30mg + omega-3 3g daily · 3–4L water · scalp massage with rosemary oil.'],
              ]} />
            </Fold>
            <Fold title="Weeks 2–4 — Layer In">
              <Pairs items={[
                ['Skin', 'Add Vitamin C (AM) · BHA 3×/week (alternating with BP nights) · Alpha Arbutin for marks · Azelaic Acid for redness.'],
                ['Grooming', 'Eyebrows threaded · proper haircut with reference photos.'],
                ['Structure', 'Mastic gum daily · face pulls every gym session · neck training every other day.'],
              ]} />
            </Fold>
            <Fold title="Month 2+ — Full Protocol">
              <Pairs items={[
                ['Skin', 'Begin retinol 2×/week, build gradually · squalane + rosehip nightly · slugging 2–3×/week · weekly clay mask + AHA. If not clearing — dermatologist.'],
                ['Hair & body', 'Dermaroller weekly · full supplement stack · stomach vacuums fasted every morning.'],
              ]} />
            </Fold>
            <Fold title="Expected Timeline" tag="What happens when">
              <Pairs items={[
                ['Weeks 1–2', 'Skin more hydrated and cleaner. Puffiness down from gua sha + diet. More groomed appearance from threading and haircut.'],
                ['Weeks 4–6', 'Active breakouts reducing. Dark marks starting to fade. Brow/lash growth visible from castor oil. Posture noticeably improving.'],
                ['Month 3', 'Skin significantly clearer. Masseter definition beginning. Posture habitual. Jawline more defined from fat loss + debloating. Hair visibly improved.'],
                ['Month 6', 'Skin clear, marks faded, retinol full effect. Jaw noticeably more defined. Posture transformed — side profile dramatically better. Bone changes from mewing becoming visible. You will look like a genuinely different person to someone who knew you 6 months ago.'],
              ]} />
            </Fold>
            <Callout tone="emerald" title="The Combination Effect" text="Clearing skin + fixing posture + debloating + building jaw muscle + reducing body fat all reinforce each other. None in isolation produces what all together produce. Your strongest natural features are simply obscured — this guide systematically removes every layer of obscurity." />
          </div>
        )}

        {/* ================= AURA ================= */}
        {tab === 'aura' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1">Aura & Presence — Level 0 → 100</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Aura = the gap between what people expect and what they get. It's not mystery — it's a signal: the accumulated
                product of how you look, move, speak, dress and hold yourself. Most people's problem isn't potential, it's
                <span className="text-gray-200 font-semibold"> incongruence</span> — strong pieces, inconsistent whole. The job is congruence: every signal pointing the same direction at once.
              </p>
            </div>
            <Fold title="Level 0 → 25 — The Foundation Lock-In" tag="Weeks 1–4 · free · most people never complete this" defaultOpen>
              <Pairs items={[
                ['Posture — fix how you occupy space', 'String pulling the crown of your head up, neck long, chin level, shoulders rolled back and down, chest passively open. Trigger: every doorway = posture reset. Unconscious within 2 weeks.'],
                ['Slow your walk by 20%', 'Fast walking signals anxiety. Longer deliberate strides, arms natural, head level looking ahead. The most immediately visible change on this list.'],
                ['Voice — lower and slower', 'Speak from the chest (diaphragmatic breath first) · slow speech 20–30% · start sentences in a lower register. Practice: record 60s daily, listen back — the gap between how you sound in your head and on tape is the gap to close.'],
                ['Eye contact 70/30', 'Hold 70% listening, 50% speaking. Break to the SIDE, never down. When someone finishes talking, hold 1–2s before responding — reads as confidence, intelligence and deliberateness at once.'],
                ['Grooming baseline', 'Every grooming variable consistent and maintained (see Grooming tab). The discipline of maintenance is itself the signal.'],
                ['Fix the fit before buying anything', 'Audit the wardrobe for shoulder-seam fit; tailor the 2–3 best pieces (£15–25 each). A tailored basic beats a badly fitting designer piece every time.'],
              ]} />
            </Fold>
            <Fold title="Level 25 → 50 — The Visible Transformation" tag="Weeks 4–12">
              <Pairs items={[
                ['Reach 12–13% body fat', 'Where face, physique and aura intersect. The jaw and cheekbone structure becomes prominent — the face moves from "attractive" to "distinctively angular". The single highest-ROI physical intervention.'],
                ['Build the wardrobe', 'Palette: black, charcoal, navy, camel, off-white. No loud patterns, no logos, no oversized streetwear. Slim body, proportionate shoulder, slightly cropped trousers. Arket, COS, Massimo Dutti, Zara Man (carefully). One statement piece max. Simple watch, no sports rubber straps.'],
                ['Become harder to impress', 'Stop laughing at everything unfunny. Stop "yeah absolutely" to everything. Let pauses exist. Selective reaction makes your engagement mean something. 2–3 weeks of conscious practice.'],
                ['Stop seeking validation in real time', 'No checking if the joke landed, no over-explaining, no qualifying everything. Say what you mean, let it land, move on. Practice: one unsoftened true statement per interaction, no reaction check.'],
                ['Speak less, say more', 'Shorter sentences. Downward inflection. State conclusions, not thought processes. When you have nothing to add — nothing. High-presence silence reads as contemplation.'],
              ]} />
            </Fold>
            <Fold title="Level 50 → 75 — Rooms Start to Notice" tag="Months 3–6 · the compounding begins">
              <Pairs items={[
                ['One hero piece per season', 'A quality dark wool overcoat or structured leather jacket is the highest-ROI single item for a tall man — it changes how you enter every room. One good coat beats 10 mediocre pieces.'],
                ['Curate the circle', 'You\'re perceived partly as the average of your visible circle. Build toward ambitious, disciplined, interesting people — societies, networks, people building things. It raises perceived status AND your actual standards.'],
                ['Build reference points', 'One non-fiction book/month, genuine expertise in 2–3 areas, travel when possible. Depth fills silence with signal; shallowness fills it with noise.'],
                ['Shoulder-dominant training', 'V-taper: overhead press, lateral raises, pull-ups, rows, face pulls. Neck training 2×/week — neck thickness frames the jaw. The silhouette signals before the face is visible.'],
                ['Instagram — intentional curation', '3 posts/week, window light or golden hour, consistent aesthetic — a mood board, not a diary. No ring-light gym selfies. Meaningful social proof by month 6.'],
                ['Scent as signature', 'ONE consistent daytime scent so you become associated with it; one heavy evening scent that leaves a trail. Fragrance memory is one of the strongest human memory associations.'],
              ]} />
            </Fold>
            <Fold title="Level 75 → 100 — The Compound Effect" tag="Months 6–18 · being it, not doing it">
              <Pairs items={[
                ['Become the archetype fully', 'Stop thinking of aura as something you work on — accumulated consistency makes it who you are. Lean, defined, intentional grooming, measured speech, elevated circle, work that matters.'],
                ['Position in high-value rooms', 'Be the most physically put-together person in the room who ALSO has something to say. At that intersection the status signal amplifies beyond either alone.'],
                ['Develop a signature', 'One recognisable element — a chain worn consistently, a colour palette, a style of coat. People should be able to picture you without seeing you.'],
              ]} />
            </Fold>
            <Fold title="The 8 Rules of High-Status Behaviour" tag="Memorise these — all free, all learnable">
              <Pairs items={[
                ['1. Don\'t over-explain', '"Sorry I\'m late." Full stop. Over-explanation is a bid for approval. State the fact, move on — decisions, opinions, choices, all of it.'],
                ['2. Comfortable with silence', 'When you\'ve said what you wanted to say — stop. No qualifiers, no "you know?". Silence after a strong statement lets it land. Be the still point in the room.'],
                ['3. Move toward what you want without asking permission', 'Pick the restaurant. Walk over and introduce yourself. State opinions without "I don\'t know, maybe…". Most people are desperate for someone to just decide. Be that person.'],
                ['4. Genuinely interested, not performatively interesting', 'Actually curious. Follow-up questions. Remembering what people said three conversations ago. People feel seen and associate that feeling with you.'],
                ['5. Treat everyone the same regardless of status', 'As attentive to the barman as the CEO. Everyone notices — especially the CEO. It signals security.'],
                ['6. Don\'t seek reactions', 'No scanning the room after a joke. Say it, share it, move on as if the outcome is irrelevant — because it is.'],
                ['7. Time visibly valuable', 'Decline without elaborate apology. Arrive when you said, leave when you decide. People want more of time that\'s rationed.'],
                ['8. Standards, held visibly', 'Don\'t tolerate disrespect, don\'t linger in environments beneath your standards — never aggressively, just clearly true. Visible standards = self-respect = the foundation of every other signal.'],
              ]} />
            </Fold>
            <Fold title="Voice Deep Dive — the hidden multiplier" tag="Weighted more than looks in ongoing interactions">
              <Pairs items={[
                ['Pitch', 'Social pressure constricts the throat and raises pitch — your relaxed voice is lower. Diaphragmatic breath in, speak on the exhale in the lower register. Default within 4–6 weeks.'],
                ['Pace', 'Speak 25% slower than natural. It sounds absurd to you and measured to everyone else. Fast speech = fear of losing attention; slow = expecting to be heard.'],
                ['Pauses', '1–3 seconds of silence before answering is one of the most powerful status signals in conversation. It says: considered, unhurried, worth waiting for.'],
                ['Downward inflection', 'End statements going DOWN. Upward = seeking confirmation. The most common low-confidence tell and the easiest to fix.'],
                ['Daily practice', 'Record 60 seconds every morning, listen back in the evening. Lower, slower, more deliberate. Weekly audible improvement.'],
              ]} />
            </Fold>
            <Fold title="Style System for the Tall Man" tag="Why standard sizing fails and the fix">
              <Pairs items={[
                ['Tier 1 — the foundation five', '2 plain crew tees (black, white — quality, not Gildan) · slim dark denim (no distressing) · black/navy chino · clean white Oxford. Fits the shoulder, slim body, trousers at the ankle. Covers 80% of situations.'],
                ['Tier 2 — the statement layer', 'Dark wool or camel overcoat · one quality leather jacket (minimal hardware) · one quality knit (merino roll-neck or crew, navy/camel). Worn over Tier 1, changes the register instantly.'],
                ['Tier 3 — details professionals notice', 'Shoes (most-noticed after the face): clean white trainers, Chelsea boots, or loafers — no box-fresh hype shoes. Watch: field or slim dress (Seiko, Tissot). Chain: keep it. Bag: minimal, unbranded.'],
                ['The tall fit formula', 'Buy for the shoulder seam, tailor the body/waist and lengthen hems (£15–25/piece). Trousers: no break — hem at the ankle bone. £80–120 of tailoring transforms 4–5 pieces and comes before ANY new purchase.'],
                ['Environment as signal', 'Clean minimal room (one afternoon, £50: declutter, one lamp, a plant, clean surfaces, dark/neutral tones) · be seen in well-designed places · your feed is googled before every significant meeting — curate it.'],
              ]} />
            </Fold>
          </div>
        )}

        {/* ================= SOCIAL EDGE ================= */}
        {tab === 'social' && (
          <div className="fade-up stagger space-y-3">
            <div className="card-premium p-5">
              <h2 className="font-black text-lg mb-1">The Social Edge</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Confidence, charisma and money are not personality traits — they're learnable skills with clear mechanics. The deep-dive version, from psychology to execution.</p>
            </div>
            <Fold title="Real Confidence — the actual method" tag="Confidence follows action, never precedes it" defaultOpen>
              <Pairs items={[
                ['The core mechanism', 'Every time you act despite fear, your brain updates its prediction of what the situation costs. The discomfort before the thing is always worse than the thing. Your nervous system is simply wrong about the danger — action corrects it.'],
                ['The four types', 'Competence (skill — the most durable) · Social (built ONLY by reps) · Physical (posture and training change hormones within minutes — Cuddy et al.) · Identity (clear values + kept commitments — criticism can\'t destabilise it).'],
                ['Systematic exposure — the most important practice', 'ONE uncomfortable social action daily minimum (speak first, introduce yourself to a stranger, hold eye contact a beat longer) + ONE high-discomfort action weekly (event alone, join a class, ask for something you expect refused).'],
                ['Never avoid because of anxiety', 'Avoidance is the only behaviour that genuinely damages confidence long-term — it tells your brain the danger was real. Act WITH the anxiety present; it doesn\'t need to leave first.'],
                ['Kept commitments to yourself', 'Self-confidence is self-trust. Every "I\'ll do X" followed by doing X is a deposit; every broken one erodes it. Small ones count as much as big ones.'],
                ['Timeline', 'Weeks 1–2 harder (recalibration) → weeks 3–6 first shifts → month 3 new baseline → month 6+ all four types reinforcing each other.'],
              ]} />
            </Fold>
            <Fold title="The Science of Charisma" tag="Presence × Power × Warmth">
              <Pairs items={[
                ['Presence — the biggest driver', 'Fully in the interaction: their words, face and meaning — nothing else. People FEEL whether you\'re present. Phone disappears entirely in meaningful interactions (top 5% instantly). 10 min daily mindfulness is literally presence training.'],
                ['Power — the capability signal', 'Posture, confident unhedged opinions, being seen with capable people, not seeming desperate. Power without warmth = threatening.'],
                ['Warmth — the intent signal', 'Genuine interest, remembering and referencing what people tell you, celebrating others authentically, giving without transaction. Power + warmth = magnetic leadership.'],
                ['Listen to understand, not to respond', 'The 1–2s pause before you reply signals you processed what they said, not just waited your turn.'],
                ['Never chase — mild scarcity of attention', 'Universally available attention has no perceived value. Not manipulation: build a genuinely full life and the scarcity follows naturally.'],
              ]} />
            </Fold>
            <Fold title="Being Memorable" tag="The peak-end rule">
              <Pairs items={[
                ['Peak-end rule (Nobel-winning research)', 'People remember the PEAK moment and the END of an interaction — the middle barely registers. Create one standout moment, and always exit well.'],
                ['Specificity principle', '"That\'s cool" is forgotten instantly; a specific observation or reference sticks. Depth in your interest areas produces specificity naturally.'],
                ['Violate the script in small ways', '"How are you?" → "Honestly? Better than expected — the long route in was worth it." A genuine human moment instead of social friction-reduction.'],
                ['Ask the question no one else asked', 'The one everyone was thinking. Signals intellectual sharpness and social courage simultaneously.'],
                ['Storytelling — the memorability engine', 'Brains process narrative ~22× better than facts. Structure: situation → tension → resolution → meaning. Prepare and rehearse 5–10 personal stories (a failure, a turning point, a funny one) until they feel spontaneous.'],
                ['The strong exit', 'Leave before the energy dips, end specific and forward-looking: "I want to hear how the interview goes — let me know."'],
              ]} />
            </Fold>
            <Fold title="Social Mastery — conversation & network" tag="FORD + the second question">
              <Pairs items={[
                ['FORD framework', 'Family ("Are you from here originally?") · Occupation ("What does your day actually look like?") · Recreation ("What do you do that makes time disappear?") · Dreams ("If this wasn\'t what you were doing, what would you be?"). Add Values: "What\'s changed most in how you think about X this year?" — instant depth.'],
                ['Mirror and label (FBI negotiator technique)', 'Mirror: repeat their last 2–3 words as a question — invites them to continue. Label: name the emotion ("sounds like that frustrated you"). People feel deeply understood — fastest trust builder there is.'],
                ['Ask the second question', 'Everyone asks the first. "You mentioned you weren\'t happy there — what was missing?" The second question is where real conversation lives.'],
                ['Everyone is interesting', 'Boring people are almost always a failure of YOUR curiosity. Hunt for the fascinating thing you haven\'t found yet — it changes your questions, which changes everything.'],
                ['Be the connector', 'Introduce people who should know each other, unasked, expecting nothing. Highest-value network move that exists, costs nothing, makes you the hub.'],
                ['Follow up within 24h, stay in orbit without agenda', 'Reference something specific from the conversation. Then: send genuinely interesting things, remember what mattered to them, comment meaningfully on their work. Compounds over years into a dense network of people who trust you.'],
                ['Level up your environments', 'Seek the room where you\'re NOT the most accomplished person. Your circle\'s average ambition becomes yours — choose accordingly.'],
              ]} />
            </Fold>
            <Fold title="Money — the income hierarchy" tag="Skills ranked by time-to-first-income">
              <Pairs items={[
                ['The core principle', 'Income is a lagging indicator of value delivered. Skills, connections and execution capacity are the three variables — all developable. Order at your stage: high-value skill → first income → network → business mechanics. Investing before income is premature.'],
                ['Tier 1 (0–3 months to income): Copywriting', '£500–5k/mo early → £3–15k/mo pro. Learn: The Copywriter\'s Handbook (Bly), swipe files, rewrite real ads daily. Start with free portfolio work, pitch small businesses directly.'],
                ['Tier 1: Social Media Management', '£500–2k/mo early → £3–8k with 5+ clients. Build your own account first as proof, pick one platform + one niche.'],
                ['Tier 1: Video Editing', '£800–3k early → £4–12k specialised. DaVinci (free). Edit free for 10–100k-follower creators, build a reel, specialise and raise rates hard.'],
                ['Tier 2 (2–8 months): Web Design & Paid Ads', 'Webflow University (free) to pro standard in 4–8 weeks; £1–5k/project. Media buying: Meta Blueprint, performance deals — one large client can be £5k+/month.'],
                ['Personal brand — highest ceiling, longest runway', 'One platform, 12 months consistent. Monetise: products → consulting → sponsorships. It amplifies every other path — it IS leverage.'],
                ['The freelance ladder', 'Skill (4–8 wks, 2–4h/day) → portfolio (2–3 free pieces for people with audiences) → clients (20 researched outreaches/week, 1 client/month at first) → raise rates each client until pushback → productise or agency.'],
                ['The four money rules', 'Spend less than you earn, always · emergency fund (3–6 months) before investing · then automatic index funds (global/S&P in an ISA) · but at your stage the highest-return investment is SKILLS — a £200 book that adds £5k/year income returns 2,500%.'],
              ]} />
            </Fold>
            <Fold title="Reading List" tag="The foundation shelf">
              <Pairs items={[
                ['People skills', 'How to Win Friends and Influence People (Carnegie) · The Charisma Myth (Fox Cabane) · Never Split the Difference (Voss) · Models (Manson) · Influence (Cialdini).'],
                ['Mindset & growth', 'Mindset (Dweck) · The Courage to Be Disliked (Kishimi & Koga) · Man\'s Search for Meaning (Frankl) · Atomic Habits (Clear) · The 48 Laws of Power (Greene — study it to understand dynamics).'],
              ]} />
            </Fold>
            <div className="bg-[#111] border border-amber-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2"><Sparkles size={15} /> The Non-Negotiable Daily Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {['One social initiation', '20 pages of reading', '10 min mindfulness', '2 hours skill building', '30 min physical training', 'Evening debrief', 'Phone away in all conversations', 'One kept promise to yourself'].map(s => (
                  <span key={s} className="text-[11px] bg-amber-500/10 border border-amber-500/25 text-amber-200 px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-3">"The best time to start was yesterday. The second best time is right now."</p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
