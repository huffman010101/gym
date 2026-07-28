import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Dumbbell } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'upper' | 'lower' | 'week' | 'rules';

const TABS: { id: Tab; label: string }[] = [
  { id: 'upper', label: 'Upper Body' },
  { id: 'lower', label: 'Lower Body' },
  { id: 'week', label: 'Weekly Split' },
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
    return (['upper', 'lower', 'week', 'rules'] as const).includes(t as Tab) ? (t as Tab) : 'upper';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-orange-950/30 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Dumbbell className="text-orange-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">The Program</h1>
            <p className="text-gray-500 text-sm">Aesthetic + functional upper · explosive lower</p>
          </div>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-orange-200/80 leading-relaxed">
            Built for exactly your goal: an upper body that looks aesthetic AND is genuinely strong and functional for
            combat sports, and a lower body trained for power and speed that transfers to football and Muay Thai.
            No AI needed — this is always here.
          </p>
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

        {/* ===== UPPER ===== */}
        {tab === 'upper' && (
          <div className="fade-up stagger space-y-4">
            <Block title="What this upper body is built for" items={[
              ['Aesthetics come from the V-taper', 'Wide delts + wide lats + a tight waist is what actually reads as an impressive upper body. That\'s why lateral raises and pull-ups are non-negotiable here, not optional accessories.'],
              ['Combat strength is pulling, pressing and rotating', 'Clinch work and grappling are dominated by lats, grip and upper back. Punching power comes from rotation and a stable shoulder — not from bench press numbers.'],
              ['Neck and grip are the combat multipliers', 'A strong neck reduces knockout risk and wins clinch battles; grip decides who controls who. Most gym-goers skip both, which is exactly why training them separates you.'],
            ]} />
            <Session
              title="Day A — Upper Push"
              tag="Pressing strength · delts · punching power"
              block="Power first while fresh, then heavy strength, then aesthetic volume. Rest 2-3 min on the first three, 60-90s on accessories."
              exercises={[
                { name: 'Med ball rotational throw', sets: '4 × 5/side', why: 'Trains the exact hip-to-shoulder rotation that generates punching and kicking power. Explosive intent, full recovery — this is power work, not conditioning.' },
                { name: 'Overhead press (barbell or DB)', sets: '4 × 5-6', why: 'The single best pressing lift for combat — builds overhead shoulder strength and a braced torso. Directly carries to clinch frames and shoulder durability.' },
                { name: 'Weighted dips or incline press', sets: '4 × 6', why: 'Heavy pressing for chest and triceps. Incline builds the upper chest that fills out a shirt; dips build brutal lockout strength.' },
                { name: 'Landmine press', sets: '3 × 8/side', why: 'Pressing in an arc with rotation — shoulder-friendly and far more combat-specific than flat pressing. Great for anyone with cranky shoulders.' },
                { name: 'DB lateral raise', sets: '4 × 12-15', why: 'The #1 aesthetic exercise for upper body width. Side delts create the shoulder-to-waist illusion. Light weight, strict form, high reps — leave ego at the door.' },
                { name: 'Face pulls', sets: '3 × 15', why: 'Rear delts and rotator cuff health. This is what keeps your shoulders working under heavy pressing and punching volume for years.' },
                { name: 'Overhead triceps extension', sets: '3 × 12', why: 'Long head of the triceps = arm thickness from the side, and lockout power on straight punches.' },
              ]}
            />
            <Session
              title="Day B — Upper Pull"
              tag="Lats · back thickness · neck · grip"
              block="Pull days build the combat-relevant strength. Do not skip the neck and grip work at the end — that's the part almost nobody does."
              exercises={[
                { name: 'Weighted pull-ups', sets: '4 × 5', why: 'The king of upper-body pulling. Lat strength is clinch strength, grappling strength, and the widest part of your V-taper. Add weight as soon as you can do 8 clean bodyweight reps.' },
                { name: 'Barbell row or Pendlay row', sets: '4 × 6', why: 'Back thickness and the pulling power behind snapping an opponent down. Heavy, strict, hips hinged — no jerking with the lower back.' },
                { name: 'Chest-supported row', sets: '3 × 10', why: 'Same pulling pattern with the lower back removed, so you can push volume safely. Squeeze the shoulder blades at the top.' },
                { name: 'Straight-arm pulldown', sets: '3 × 12', why: 'Isolates the lats for width without the biceps failing first. This is a pure V-taper builder.' },
                { name: 'Neck curls + extensions', sets: '3 × 15 each', why: 'Non-negotiable for combat sports. A thick, strong neck absorbs strikes, resists chokes, and wins clinch position. Start light and controlled — never explosive.' },
                { name: 'Farmer\'s carry', sets: '3 × 40m', why: 'Grip, traps, and full-body bracing in one. Grip strength is the hidden currency of grappling and clinch control.' },
                { name: 'Incline DB curl', sets: '3 × 12', why: 'Arms — aesthetic, and biceps assist every pull and underhook. Incline puts the long head on stretch for maximum growth.' },
              ]}
            />
            <Block title="Core — do this on both upper days" items={[
              ['Pallof press — 3 × 30s/side', 'Anti-rotation. Teaches your core to resist twisting, which is exactly what lets you transfer hip power into a punch instead of leaking it.'],
              ['Hanging leg raise — 3 × 10-12', 'Lower abs and hip flexor strength — carries directly to knees in the clinch and a tight-looking midsection.'],
              ['Cable woodchop — 3 × 10/side', 'Rotational power under load. The controlled cousin of the med ball throw.'],
            ]} />
          </div>
        )}

        {/* ===== LOWER ===== */}
        {tab === 'lower' && (
          <div className="fade-up stagger space-y-4">
            <Block title="What this lower body is built for" items={[
              ['Power = strength × speed', 'You need both. A heavy squat with no explosive training makes you strong but slow; jumps with no strength base give you nothing to be explosive with. This split trains them on separate days so neither gets compromised.'],
              ['Sprint speed and kick power share a source', 'Both come from the hips and glutes producing force fast. Hip thrusts, jumps and sprints build the same engine that drives a round kick and a 20m sprint.'],
              ['Injury-proofing IS performance', 'Nordics and Copenhagen planks aren\'t optional extras — hamstring and groin injuries are the two things most likely to stop your football and Muay Thai. Training them is training availability.'],
            ]} />
            <Session
              title="Day C — Lower Power & Speed"
              tag="Explosiveness · sprint speed · kick power"
              block="Everything here is done FRESH with full recovery (2-3 min between sets). The moment you're fatigued, you're training endurance not power — stop the session. Quality over volume, always."
              exercises={[
                { name: 'Box jump or broad jump', sets: '5 × 3', why: 'Pure triple extension — ankle, knee, hip firing together. Step down from box jumps, never jump down. Reset fully between every rep.' },
                { name: 'Trap bar jump / jump squat (light)', sets: '4 × 3', why: 'Loaded jumps at ~30% of your max — the sweet spot for peak power output. This is the bridge between heavy strength and pure speed.' },
                { name: 'Acceleration sprints', sets: '6 × 20m', why: 'Football is won in the first 5-20 metres. Sprint from varied starts (standing, lying, rolling), walk back slowly for full recovery.' },
                { name: 'Flying sprints', sets: '4 × 40m', why: 'Build up 20m, then hit 100% for 20m. Trains max velocity mechanics — hips tall, ground contact under you, fast and loose.' },
                { name: 'Lateral bounds', sets: '3 × 5/side', why: 'Side-to-side explosiveness for cutting in football and switching stance in Muay Thai. Stick the landing on each rep — control is the point.' },
                { name: 'Med ball slam / rotational throw', sets: '4 × 5', why: 'Hip rotation under speed — the same chain that fires a round kick. Throw with total intent or don\'t bother.' },
                { name: 'Copenhagen plank', sets: '3 × 20s/side', why: 'Adductor strength. Groin injuries end football and Muay Thai seasons; this is the single best prevention exercise there is.' },
              ]}
            />
            <Session
              title="Day D — Lower Max Strength"
              tag="The force base everything else rides on"
              block="Heavy, controlled, full recovery. This is the day that raises your ceiling — power work on Day C converts this strength into speed."
              exercises={[
                { name: 'Back squat or trap bar deadlift', sets: '5 × 3-5', why: 'Your foundational strength lift. Trap bar is more forgiving on the lower back and arguably transfers better to jumping and sprinting. Pick one and progress it weekly.' },
                { name: 'Bulgarian split squat', sets: '3 × 6/leg', why: 'Football and Muay Thai happen on one leg at a time — cutting, kicking, planting. Single-leg strength transfers more directly than bilateral squatting.' },
                { name: 'Hip thrust', sets: '3 × 8', why: 'Direct glute loading — the muscle that drives sprint speed, shot power and kick power. One of the highest-return lifts for athletes.' },
                { name: 'Nordic hamstring curl', sets: '3 × 5', why: 'Cuts hamstring injury risk roughly in half AND makes you faster. Non-negotiable twice a week. Lower slowly under control, push back up with your hands.' },
                { name: 'Romanian deadlift', sets: '3 × 8', why: 'Hamstring and glute strength through a full hinge. Builds the deceleration ability that makes you agile, not just fast in a straight line.' },
                { name: 'Standing calf raise', sets: '4 × 12-15', why: 'Stiff, springy ankles are free speed and protect against rolled ankles in duels. Pause at the top and full stretch at the bottom.' },
                { name: 'Pallof press', sets: '3 × 30s/side', why: 'Core bracing so your leg power actually reaches the ground instead of leaking through a soft midsection.' },
              ]}
            />
          </div>
        )}

        {/* ===== WEEK ===== */}
        {tab === 'week' && (
          <div className="fade-up stagger space-y-4">
            <Block title="The 4-day split" items={[
              ['Monday — Day A: Upper Push', 'Fresh from the weekend, hit pressing strength and rotational power.'],
              ['Tuesday — Day C: Lower Power & Speed', 'Explosive work on relatively fresh legs. Never the day after heavy squats.'],
              ['Wednesday — Sport / recovery', 'Football, Muay Thai, or active recovery (walk, mobility, Zone 2). No lifting.'],
              ['Thursday — Day B: Upper Pull', 'Lats, back thickness, neck, grip.'],
              ['Friday — Day D: Lower Max Strength', 'Heavy squat/deadlift day. Placed late in the week so it doesn\'t compromise the speed work.'],
              ['Weekend — Sport + one full rest day', 'Match day, sparring, or training. Take at least one genuine full rest day — that\'s when adaptation actually happens.'],
            ]} />
            <Block title="If you only have 3 days" items={[
              ['Option: rotate A → C → B → D', 'Run the same four sessions in order across whatever days you train, rather than fixing them to specific weekdays. You\'ll hit each session roughly every 5-6 days.'],
              ['Never stack lower days back to back', 'Power and heavy strength need 48h between them. If Tuesday was jumps and sprints, Wednesday is not squats.'],
              ['Sport comes first in the hierarchy', 'If you have a match or hard sparring, drop a lower body day that week rather than turning up to the pitch or the gym already cooked.'],
            ]} />
            <Block title="Fitting sport around lifting" items={[
              ['Hard sport + hard lifting on the SAME day beats splitting them', 'If both must happen, do them on the same day (sport first, lift after) and keep the next day genuinely easy. Two hard days in a row is worse than one very hard day plus a real recovery day.'],
              ['Never lift heavy legs within 48h of a match', 'You want fresh legs on the pitch. Move Day D earlier in the week if match day is Saturday.'],
              ['Technical sport work is not conditioning', 'Bag work, pad work, and touches on the ball should be done fresh enough to be sharp. Skill degrades badly under fatigue — and sloppy reps build sloppy habits.'],
            ]} />
          </div>
        )}

        {/* ===== RULES ===== */}
        {tab === 'rules' && (
          <div className="fade-up stagger space-y-4">
            <Block title="The rules that make this work" items={[
              ['Power work always comes first, always fresh', 'Jumps, throws and sprints go at the START of a session, never at the end. Power trained tired is just conditioning with extra injury risk.'],
              ['Full recovery on power and heavy sets', '2-3 minutes. It feels lazy. It\'s the difference between training the nervous system (what you want) and training fatigue tolerance (what you don\'t, on these days).'],
              ['Progressive overload on the main lifts', 'Every week, add a small amount of weight or one rep to your squat, deadlift, press, pull-up and row. Write it down. If the number isn\'t moving over a month, something is wrong with recovery or effort.'],
              ['Accessories are for reps, not ego', 'Lateral raises, face pulls, curls, calves — 8-15 reps, controlled, close to failure. Heaving heavy weight here just steals from the main lifts.'],
              ['Two reps in reserve on most sets', 'Stop most sets when you could have done ~2 more clean reps. Training to absolute failure every set wrecks recovery and does very little extra for you.'],
            ]} />
            <Block title="Progression, concretely" items={[
              ['Weeks 1-2 — learn the movements', 'Lighter loads, focus entirely on technique. Skip depth jumps entirely at this stage. Get the pattern right before you get heavy.'],
              ['Weeks 3-6 — build the base', 'Add weight weekly to main lifts. Power output climbs naturally as strength does. This is where most of your visible change starts.'],
              ['Weeks 7-10 — push power', 'Now add depth jumps (4 × 3, full recovery) and heavier loaded jumps. You have the strength base to convert them safely.'],
              ['Every 5-6 weeks — deload', 'One week at ~60% of your usual volume. Not optional. This is when your body actually catches up and the next block goes better.'],
              ['Track it or it isn\'t real', 'Weight, sets, reps for every main lift, every session. The logbook IS the program — memory lies, paper doesn\'t.'],
            ]} />
            <Block title="Nutrition & recovery for this program" items={[
              ['Protein: 1.6-2.2g per kg bodyweight', 'This is the number that decides whether hard training turns into muscle. Spread it across 3-4 meals — protein at every meal beats one huge hit.'],
              ['Carbs around training', 'Power and sprint work run on glycogen. Eat carbs before and after your training sessions — under-fuelled speed work is just slow work.'],
              ['Sleep 8h+, seriously', 'Strength, power, and recovery from combat training all depend on it more than any supplement. This is the highest-leverage thing on this entire page.'],
              ['Creatine 5g daily', 'The most evidence-backed supplement for exactly this kind of training — strength, power output and repeated sprint ability. Timing doesn\'t matter; consistency does.'],
              ['Hydration the day before, not just the day of', 'Especially for sport. Turning up already slightly dehydrated costs you power, speed, and focus.'],
            ]} />
            <Block title="Common mistakes with this exact goal" items={[
              ['Training upper body like a bodybuilder only', 'Endless bench and curls with no pulling, neck, grip or rotation gives you a body that looks trained but doesn\'t perform. The split above deliberately balances both.'],
              ['Doing power work when tired', 'Jumps at the end of leg day, sprints after a hard session — this is the single most common way athletes waste their power training entirely.'],
              ['Skipping Nordics and Copenhagens', 'They\'re boring and they\'re hard. They\'re also the two exercises most likely to keep you on the pitch and on the mats all season.'],
              ['Chasing soreness instead of progress', 'Soreness measures novelty, not effectiveness. The logbook going up measures effectiveness.'],
              ['Adding more instead of progressing what\'s there', 'The urge to add exercises is almost always the wrong instinct. Add weight to what you\'re already doing first.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
