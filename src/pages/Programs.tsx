import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Dumbbell, Utensils, Flame, Activity } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'push' | 'pull' | 'shoulders' | 'functional' | 'week' | 'rules';

const TABS: { id: Tab; label: string }[] = [
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'functional', label: 'Functional' },
  { id: 'week', label: 'The Week' },
  { id: 'rules', label: 'How to Run It' },
];

interface Ex { name: string; sets: string; why: string }

function Session({ title, tag, block, exercises }: { title: string; tag: string; block: string; exercises: Ex[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-black text-gray-100">{title}</p>
          <p className="text-xs text-orange-400/80 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5">
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3 bg-white/5 rounded-lg px-3 py-2">{block}</p>
            <div className="space-y-3">
              {exercises.map((e, i) => (
                <div key={e.name} className="flex gap-3">
                  <span className="text-orange-500/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold text-sm text-gray-200">{e.name}</p>
                      <p className="text-xs font-bold text-orange-400 flex-shrink-0">{e.sets}</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{e.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className="font-bold mb-3 text-orange-300">{title}</h3>
      <div className="space-y-3">
        {items.map(([t, d]) => (
          <div key={t}>
            <p className="font-semibold text-sm text-gray-200">{t}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Programs() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['push', 'pull', 'shoulders', 'functional', 'week', 'rules'] as const).includes(t as Tab) ? (t as Tab) : 'push';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-orange-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Dumbbell className="text-orange-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">The Program</h1>
            <p className="text-gray-500 text-sm">Push · Pull · Shoulders · Rest · repeat</p>
          </div>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-orange-200/80 leading-relaxed">
            Your split: <span className="text-orange-300 font-bold">Push → Pull → Shoulders → Rest → Push → Pull → Shoulders/Functional</span>.
            Each session has an A and B version so you never repeat the exact same workout twice in a week.
            Aesthetic upper body, combat-functional strength, and the football/Muay Thai power work on the functional day.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { to: '/plan', icon: Utensils, label: 'AI Plan', color: 'text-blue-400' },
            { to: '/food', icon: Flame, label: 'Food Log', color: 'text-green-400' },
            { to: '/physique', icon: Activity, label: 'Physique', color: 'text-purple-400' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}
              className="bg-[#111] border border-white/8 hover:border-white/20 rounded-xl px-2 py-3 flex flex-col items-center gap-1.5 transition-colors">
              <Icon size={17} className={color} />
              <span className="text-[11px] font-semibold text-gray-300">{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== PUSH ===== */}
        {tab === 'push' && (
          <div className="fade-up stagger space-y-4">
            <Session
              title="Push A — Day 1"
              tag="Chest size & shape · triceps"
              block="Aesthetic emphasis. Heavy compound first, then volume and stretch work. Rest 2-3 min on the first two, 60-90s after."
              exercises={[
                { name: 'Incline barbell or DB press', sets: '4 × 6', why: 'Upper chest is what fills out a shirt and stops the "flat chest" look. Leading with incline while fresh is why most people\'s upper chest lags — they always do flat first.' },
                { name: 'Weighted dips', sets: '4 × 6-8', why: 'Lower chest sweep plus brutal triceps lockout strength. One of the best pure upper-body mass builders there is.' },
                { name: 'Flat DB press', sets: '3 × 8-10', why: 'Dumbbells allow a deeper stretch than a barbell and even out left/right imbalances — important when one side is stronger from sport.' },
                { name: 'Cable fly or pec deck', sets: '3 × 12-15', why: 'Pure stretch and squeeze with no triceps involvement. This is shaping work — the chest detail that pressing alone doesn\'t give you.' },
                { name: 'Overhead triceps extension', sets: '3 × 12', why: 'Hits the long head, which is most of your arm thickness seen from the side. Also the head most neglected by pushdowns alone.' },
                { name: 'Triceps pushdown', sets: '3 × 12-15', why: 'Finishes the triceps with high-rep pump work. Elbows pinned to your sides — no cheating with the shoulders.' },
                { name: 'Pallof press', sets: '3 × 30s/side', why: 'Anti-rotation core. Teaches your midsection to resist twist, which is what lets hip power reach your fist instead of leaking.' },
              ]}
            />
            <Session
              title="Push B — Day 5"
              tag="Pressing strength · punch power"
              block="Strength and combat emphasis. Power work goes FIRST while completely fresh — never at the end."
              exercises={[
                { name: 'Med ball rotational throw', sets: '4 × 5/side', why: 'The exact hip-to-shoulder chain that generates punching power. Full intent every rep, full recovery between sets. This is nervous-system training, not conditioning.' },
                { name: 'Flat barbell bench press', sets: '4 × 5', why: 'Raw pressing strength and the lift you\'ll track progression on. Heavier and lower rep than Push A so the two days don\'t just repeat each other.' },
                { name: 'Landmine press', sets: '3 × 8/side', why: 'Pressing in an arc with rotation — far more shoulder-friendly and combat-specific than pure flat pressing. Great if your shoulders get cranky.' },
                { name: 'Incline DB press', sets: '3 × 10', why: 'Upper chest volume again, but in a different rep range from Push A so you get both strength and size stimulus across the week.' },
                { name: 'Bodyweight dips', sets: '3 × AMRAP-2', why: 'Stop 2 reps short of failure. High-rep bodyweight work builds work capacity without frying recovery like heavy weighted sets do.' },
                { name: 'Close-grip push-up or JM press', sets: '3 × 10', why: 'Triceps under a pressing pattern — direct carryover to straight-punch lockout speed.' },
                { name: 'Hanging leg raise', sets: '3 × 12', why: 'Lower abs and hip flexor strength — carries to knees in the clinch and a tighter-looking midsection.' },
              ]}
            />
          </div>
        )}

        {/* ===== PULL ===== */}
        {tab === 'pull' && (
          <div className="fade-up stagger space-y-4">
            <Session
              title="Pull A — Day 2"
              tag="Lat width · V-taper"
              block="Width emphasis — this is the day that builds the V-taper. Vertical pulling dominates."
              exercises={[
                { name: 'Weighted pull-ups', sets: '4 × 5', why: 'The king of upper-body pulling. Lat strength is clinch and grappling strength, and lats are the widest part of your taper. Add weight once you can do 8 clean bodyweight reps.' },
                { name: 'Lat pulldown', sets: '3 × 10-12', why: 'Same vertical pattern with adjustable load so you can push volume after pull-ups have fatigued you.' },
                { name: 'Chest-supported row', sets: '3 × 10', why: 'Horizontal pulling with the lower back completely removed, so you can train hard without stealing recovery from squats and sprints.' },
                { name: 'Straight-arm pulldown', sets: '3 × 12', why: 'Isolates the lats without the biceps failing first. Pure width builder — one of the most underrated aesthetic exercises.' },
                { name: 'Face pulls', sets: '3 × 15', why: 'Rear delts and rotator cuff. This is what keeps your shoulders healthy under heavy pressing and punching volume for years.' },
                { name: 'Incline DB curl', sets: '3 × 12', why: 'Incline puts the biceps long head on stretch for maximum growth. Biceps also assist every underhook and pull.' },
                { name: 'Farmer\'s carry', sets: '3 × 40m', why: 'Grip, traps and full-body bracing at once. Grip strength is the hidden currency of grappling and clinch control.' },
              ]}
            />
            <Session
              title="Pull B — Day 6"
              tag="Back thickness · neck · grip"
              block="Thickness and combat emphasis. Horizontal pulling dominates. Do not skip the neck work — almost nobody does it, which is exactly why it separates you."
              exercises={[
                { name: 'Barbell or Pendlay row', sets: '4 × 6', why: 'Back thickness and the pulling power behind snapping an opponent\'s head down. Strict, hips hinged, no jerking with the lower back.' },
                { name: 'Weighted chin-ups', sets: '4 × 6', why: 'Supinated grip shifts more load to the biceps while still hammering the lats. Different stimulus from Pull A\'s pronated pull-ups.' },
                { name: 'T-bar row or seal row', sets: '3 × 10', why: 'Heavy mid-back loading. Seal row (chest on bench) removes all momentum if you tend to cheat.' },
                { name: 'Single-arm DB row', sets: '3 × 10/side', why: 'Unilateral work catches imbalances and lets you get a longer range of motion than any bilateral row.' },
                { name: 'Neck curls + extensions', sets: '3 × 15 each', why: 'Non-negotiable for combat sports. A strong neck absorbs strikes, resists chokes and wins clinch position. Start light, controlled, never explosive.' },
                { name: 'Hammer curl', sets: '3 × 12', why: 'Brachialis and forearm — arm thickness plus grip strength that carries directly to gi/clinch control.' },
                { name: 'Towel hang', sets: '3 × max time', why: 'Grip endurance under a thick, awkward grip — the closest gym equivalent to holding a fighting grip while someone tries to break it.' },
              ]}
            />
          </div>
        )}

        {/* ===== SHOULDERS ===== */}
        {tab === 'shoulders' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Why shoulders get their own day" items={[
              ['Delts are the aesthetic cheat code', 'Wide shoulders over a tight waist is the single biggest driver of an impressive-looking upper body. Giving them a dedicated day means they get trained fresh, not as an afterthought after chest.'],
              ['Overhead strength is combat strength', 'Shoulder strength and stability underpin clinch frames, pushing off, and every punch you throw. It also protects the joint under high punching volume.'],
              ['Side delts need volume, not weight', 'Laterals respond to high reps and consistent frequency, not ego loading. That\'s why they appear on both shoulder days plus the functional day.'],
            ]} />
            <Session
              title="Shoulders A — Day 3"
              tag="Overhead strength · full delt development"
              block="Heavy pressing first, then width work, then the rear delts almost everyone neglects."
              exercises={[
                { name: 'Overhead barbell press', sets: '4 × 5-6', why: 'The best pressing lift for combat — overhead strength with a braced torso. Track progression on this one weekly.' },
                { name: 'Seated DB shoulder press', sets: '3 × 8-10', why: 'More range of motion than a barbell and it evens out side-to-side imbalances. Seated removes leg drive so the delts do the work.' },
                { name: 'DB lateral raise', sets: '4 × 12-15', why: 'THE width builder. Side delts create the shoulder-to-waist illusion. Light weight, strict form, no swinging — leave ego at the door on this one.' },
                { name: 'Cable lateral raise', sets: '3 × 15', why: 'Constant tension through the whole range, unlike dumbbells which are easy at the bottom. Brutal pump and a different stimulus.' },
                { name: 'Rear delt fly', sets: '3 × 15', why: 'The delt head everyone skips. Rear delts give shoulders a 3D look from the side and balance out all your pressing.' },
                { name: 'Barbell shrug', sets: '3 × 12', why: 'Traps frame the neck and shoulders — and a strong trap-neck complex is genuinely protective in combat sports.' },
                { name: 'Pallof press', sets: '3 × 30s/side', why: 'Core bracing so overhead work stays stable and safe.' },
              ]}
            />
            <Block title="Shoulders B — Day 7" items={[
              ['It\'s combined with the functional work', 'Day 7 is Shoulders/Functional — lighter shoulder volume paired with the football and Muay Thai power training. Full session is on the Functional tab.'],
              ['Why lighter on day 7', 'You\'ve already pressed heavy on Day 3 and on both push days. Day 7 shoulders is volume and pump work, not another heavy pressing session — that would be too much overhead loading in one week.'],
            ]} />
          </div>
        )}

        {/* ===== FUNCTIONAL ===== */}
        {tab === 'functional' && (
          <div className="fade-up stagger space-y-4">
            <Block title="What the functional day is for" items={[
              ['This is your football and Muay Thai day', 'Explosiveness, sprint speed, change of direction, and kick power — the athletic qualities that actually show up on the pitch and on the pads.'],
              ['Power first, always fresh', 'Jumps, throws and sprints go at the very start. Power trained tired is just conditioning with extra injury risk — if you\'re fatigued, stop the power work and move on.'],
              ['It also carries your leg work', 'Because this split has no dedicated leg day, this session includes the essential lower-body strength and injury-prevention work. If your legs feel undertrained, this is the day to extend — not push or pull.'],
            ]} />
            <Session
              title="Shoulders / Functional — Day 7"
              tag="Power · speed · legs · light delts"
              block="Longest session of the week (~75-90 min). Order matters enormously here: power → sprints → leg strength → shoulder volume. Full recovery (2-3 min) on everything before the shoulder block."
              exercises={[
                { name: 'Med ball slam / rotational throw', sets: '4 × 5', why: 'Hip rotation under speed — the same chain that fires a round kick. Throw with total intent or don\'t bother doing it at all.' },
                { name: 'Box jump or broad jump', sets: '4 × 3', why: 'Pure triple extension — ankle, knee and hip firing together. Step down from box jumps, never jump down. Reset fully between every single rep.' },
                { name: 'Acceleration sprints', sets: '6 × 20m', why: 'Football is won in the first 5-20 metres. Vary the start (standing, side-on, rolling) and walk back slowly for full recovery.' },
                { name: 'Lateral bounds', sets: '3 × 5/side', why: 'Side-to-side explosiveness for cutting in football and switching stance in Muay Thai. Stick and hold each landing — control is the whole point.' },
                { name: 'Bulgarian split squat', sets: '3 × 6-8/leg', why: 'Football and Muay Thai happen on one leg at a time — cutting, kicking, planting. Single-leg strength transfers more directly than bilateral squatting.' },
                { name: 'Nordic hamstring curl', sets: '3 × 5', why: 'Cuts hamstring injury risk roughly in half AND makes you faster. Non-negotiable. Lower slowly under control, push back up with your hands.' },
                { name: 'Hip thrust', sets: '3 × 8', why: 'Direct glute loading — the muscle driving sprint speed, shot power and kick power. Highest-return lift for athletes in your sports.' },
                { name: 'Copenhagen plank', sets: '3 × 20s/side', why: 'Adductor strength. Groin injuries end football and Muay Thai seasons — this is the single best prevention exercise there is.' },
                { name: 'DB or cable lateral raise', sets: '3 × 15', why: 'Light shoulder volume to finish. Delts recover fast and respond to frequency, so a third weekly dose accelerates width.' },
                { name: 'Rear delt fly', sets: '3 × 15', why: 'More rear delt volume — balances all the week\'s pressing and keeps the shoulders healthy.' },
              ]}
            />
            <Block title="If you have football or Muay Thai training that day" items={[
              ['Sport replaces the sprint work', 'If you\'re training football or Muay Thai on Day 7, skip the acceleration sprints and lateral bounds — you\'ll get that stimulus in the session itself. Keep the jumps, leg strength and shoulders.'],
              ['Sport first, gym after', 'Do the technical/sport session while fresh and sharp, then lift. Skill degrades badly under fatigue, and sloppy reps build sloppy habits.'],
              ['Never skip Nordics and Copenhagens', 'Even on a heavy sport day, keep these two. They\'re the exercises most likely to keep you available all season.'],
            ]} />
          </div>
        )}

        {/* ===== WEEK ===== */}
        {tab === 'week' && (
          <div className="fade-up stagger space-y-4">
            <Block title="The 7-day rotation" items={[
              ['Day 1 — Push A', 'Chest size and shape, triceps. Incline-led for upper chest.'],
              ['Day 2 — Pull A', 'Lat width and V-taper. Vertical pulling dominant, plus grip.'],
              ['Day 3 — Shoulders A', 'Heavy overhead pressing, full delt development, traps.'],
              ['Day 4 — REST', 'Genuine rest. This is when adaptation actually happens — not a "light gym" day.'],
              ['Day 5 — Push B', 'Pressing strength and punch power. Heavier, lower rep than Push A.'],
              ['Day 6 — Pull B', 'Back thickness, neck and grip. Horizontal pulling dominant.'],
              ['Day 7 — Shoulders / Functional', 'Power, sprints, leg strength, light delt volume. Your football and Muay Thai day.'],
            ]} />
            <Block title="Then it repeats" items={[
              ['It\'s a rolling 7-day cycle', 'Day 8 is Push A again. If you prefer fixed weekdays, Mon-Sun works perfectly with Thursday as your rest day.'],
              ['Take a second rest day if you need it', 'If sport volume is high that week, insert a rest day after Day 6. Two rest days in a hard week beats grinding through and getting injured.'],
              ['Sport sits on top', 'Football matches, Muay Thai sessions and sparring go wherever they fall — but try to keep hard sport away from Day 7 if that\'s already your big functional session.'],
            ]} />
            <Block title="What each muscle gets per week" items={[
              ['Chest — 2×', 'Push A (size/shape) + Push B (strength). Different rep ranges so you get both stimuli.'],
              ['Back — 2×', 'Pull A (width) + Pull B (thickness). Vertical and horizontal pulling both covered.'],
              ['Shoulders — 3×', 'Heavy on Day 3, plus indirect work on both push days, plus light volume on Day 7. This frequency is why they\'ll grow fast.'],
              ['Arms — 2-3×', 'Triceps on both push days, biceps on both pull days, plus indirect work throughout.'],
              ['Legs — 1× direct', 'Day 7, plus whatever your football and Muay Thai training provides. This is the honest trade-off of a push/pull/shoulders split — see the note below.'],
              ['Neck & grip — 1-2×', 'Pull B primarily, plus carries on Pull A. More than 95% of gym-goers, which matters for combat.'],
            ]} />
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3.5">
              <p className="text-xs text-amber-200/85 leading-relaxed">
                <span className="font-bold">One honest flag:</span> a push/pull/shoulders split trains legs directly only once a week.
                For your football and Muay Thai power goals that's on the light side — your sport sessions cover a lot of it,
                but if you find your legs stalling, the fix is adding a second lower-body slot (easiest swap: make Day 4 a light
                legs day instead of full rest, or extend Day 7). Your split, your call — just know the trade-off you're making.
              </p>
            </div>
          </div>
        )}

        {/* ===== RULES ===== */}
        {tab === 'rules' && (
          <div className="fade-up stagger space-y-4">
            <Block title="The rules that make this work" items={[
              ['Power work always first, always fresh', 'Med ball throws, jumps and sprints go at the START of a session, never at the end. Power trained tired is just conditioning with extra injury risk.'],
              ['Full recovery on power and heavy sets', '2-3 minutes. It feels lazy. It\'s the difference between training the nervous system (what you want) and training fatigue tolerance (what you don\'t, on those days).'],
              ['Progressive overload on the main lifts', 'Every cycle, add a small amount of weight or one rep to: bench, overhead press, row, pull-up, split squat, hip thrust. Write it down. If numbers aren\'t moving over a month, recovery or effort is the problem.'],
              ['Accessories are for reps, not ego', 'Lateral raises, face pulls, curls, flies — 12-15 reps, controlled, close to failure. Heaving heavy weight here just steals recovery from the main lifts.'],
              ['Two reps in reserve on most sets', 'Stop most sets when you could have done ~2 more clean reps. Training to absolute failure every set wrecks recovery and adds very little.'],
              ['A and B days are not interchangeable', 'The whole point of the A/B structure is different rep ranges and emphases. Doing Push A twice a week wastes the design.'],
            ]} />
            <Block title="Progression, concretely" items={[
              ['Weeks 1-2 — learn the movements', 'Lighter loads, full focus on technique. Get the patterns right before you get heavy — especially Nordics, which will humble you.'],
              ['Weeks 3-6 — build the base', 'Add weight weekly to the main lifts. This is where most of your visible change starts showing.'],
              ['Weeks 7-10 — push power', 'Add depth jumps (4 × 3, full recovery) on Day 7 and heavier loaded jumps. You now have the strength base to convert them safely.'],
              ['Every 5-6 weeks — deload', 'One cycle at ~60% of usual volume. Not optional. This is when your body catches up and the next block goes better.'],
              ['Track it or it isn\'t real', 'Weight, sets and reps for every main lift, every session. The logbook IS the program — memory lies, paper doesn\'t.'],
            ]} />
            <Block title="Nutrition & recovery" items={[
              ['Protein: 1.6-2.2g per kg bodyweight', 'The number that decides whether hard training becomes muscle. Spread across 3-4 meals — protein at every meal beats one huge hit.'],
              ['Carbs around training', 'Power and sprint work run on glycogen. Eat carbs before and after sessions — under-fuelled speed work is just slow work.'],
              ['Sleep 8h+', 'Strength, power and recovery from combat training depend on it more than any supplement. Highest-leverage item on this entire page.'],
              ['Creatine 5g daily', 'Most evidence-backed supplement for exactly this training — strength, power output, repeated sprint ability. Timing doesn\'t matter, consistency does.'],
              ['Hydrate the day before', 'Especially before sport. Turning up slightly dehydrated costs power, speed and focus before you\'ve even started.'],
            ]} />
            <Block title="Common mistakes with this exact split" items={[
              ['Turning the rest day into a gym day', 'Day 4 is where the growth actually happens. Training 7 days straight is how you stall and get injured.'],
              ['Doing power work when tired', 'Jumps or sprints tacked onto the end of a session — the most common way athletes waste their power training entirely.'],
              ['Going heavy on lateral raises', 'Side delts respond to strict high-rep work. Swinging 20kg dumbbells trains your traps and lower back, not your delts.'],
              ['Skipping neck, grip, Nordics and Copenhagens', 'They\'re boring and hard. They\'re also what keep you fighting, playing and uninjured.'],
              ['Adding exercises instead of adding weight', 'The urge to add more is almost always wrong. Progress what\'s already there first.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
