import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Dumbbell, Utensils, Flame, Activity } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'week' | 'push' | 'pull' | 'shoulders' | 'legs' | 'explosive' | 'core' | 'posture' | 'rules';

const TABS: { id: Tab; label: string }[] = [
  { id: 'week', label: 'The Week' },
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'legs', label: 'Legs' },
  { id: 'explosive', label: 'Explosive' },
  { id: 'core', label: 'Core & Abs' },
  { id: 'posture', label: 'Posture' },
  { id: 'rules', label: 'How to Run It' },
];

interface Ex { name: string; sets: string; targets?: string; how?: string; why: string }

function ExRow({ e, i }: { e: Ex; i: number }) {
  const [open, setOpen] = useState(false);
  const hasGuide = !!(e.how || e.targets);
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => hasGuide && setOpen(o => !o)}
        className="w-full text-left px-3 py-2.5 flex gap-3"
      >
        <span className="text-orange-500/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-semibold text-sm text-gray-200">{e.name}</p>
            <p className="text-xs font-bold text-orange-400 flex-shrink-0">{e.sets}</p>
          </div>
          {e.targets && (
            <p className="text-[11px] text-sky-400/80 mt-0.5 font-medium">{e.targets}</p>
          )}
          {!open && (
            <p className="text-gray-500 text-xs leading-relaxed mt-1">{e.why}</p>
          )}
          {hasGuide && !open && (
            <p className="text-[10px] text-orange-400/60 font-bold mt-1">Tap for form guide</p>
          )}
        </div>
      </button>
      {hasGuide && (
        <div className={`collapse-wrap ${open ? 'open' : ''}`}>
          <div className="collapse-inner">
            <div className="collapse-content px-3 pb-3 pl-10 space-y-2.5">
              {e.how && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400/80 mb-0.5">How to do it</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{e.how}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-400/80 mb-0.5">Why it is here</p>
                <p className="text-gray-400 text-xs leading-relaxed">{e.why}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Session({ title, tag, block, exercises, open: initial = true }:
  { title: string; tag: string; block: string; exercises: Ex[]; open?: boolean }) {
  const [open, setOpen] = useState(initial);
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
            <div className="space-y-2">
              {exercises.map((e, i) => <ExRow key={e.name} e={e} i={i} />)}
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

function Fold({ title, tag, items }: { title: string; tag: string; items: [string, string][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          <p className="text-xs text-orange-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">
            {items.map(([t, d]) => (
              <div key={t}>
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const DAYS: [string, string, string][] = [
  ['Mon', 'Push', 'Chest, triceps — hypertrophy'],
  ['Tue', 'Legs A', 'Max strength + size'],
  ['Wed', 'Pull', 'Back, biceps, neck — hypertrophy'],
  ['Thu', 'Explosive / Sport', 'Speed, jumps, rotational power'],
  ['Fri', 'Shoulders + Arms', 'Delts, traps, arms — hypertrophy'],
  ['Sat', 'Legs B', 'Unilateral, posterior chain, football-specific'],
  ['Sun', 'Rest', 'Full rest — this is where it all happens'],
];

export default function Programs() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['week', 'push', 'pull', 'shoulders', 'legs', 'explosive', 'core', 'posture', 'rules'] as const)
      .includes(t as Tab) ? (t as Tab) : 'week';
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
            <p className="text-gray-500 text-sm">6 days · hypertrophy upper · explosive legs</p>
          </div>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-orange-200/80 leading-relaxed">
            Push / Pull / Shoulders built for <span className="text-orange-300 font-bold">muscle growth</span>,
            two leg days built for <span className="text-orange-300 font-bold">football power</span>, one dedicated
            <span className="text-orange-300 font-bold"> explosive/sport day</span>, and rotating core work so every
            session finishes with either sport-specific trunk strength or direct ab growth.
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

        {/* ===== THE WEEK ===== */}
        {tab === 'week' && (
          <div className="fade-up stagger space-y-4">
            <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/8">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">The 6-day split</p>
              </div>
              <div className="divide-y divide-white/5">
                {DAYS.map(([day, name, sub]) => (
                  <div key={day} className={`flex items-center gap-3 px-5 py-3 ${name === 'Rest' ? 'bg-emerald-500/5' : ''}`}>
                    <span className={`text-[11px] font-black w-9 flex-shrink-0 ${name === 'Rest' ? 'text-emerald-400' : 'text-orange-400'}`}>{day}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${name === 'Rest' ? 'text-emerald-300' : 'text-gray-100'}`}>{name}</p>
                      <p className="text-gray-500 text-[11px] leading-snug">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3.5">
              <p className="text-xs text-amber-200/85 leading-relaxed">
                <span className="font-bold">Read this before you start.</span> Six gym days works IF the gym is your main
                training. If you are also playing football and training Muay Thai on top, that is 8-10 hard sessions a
                week and you will stall — not from lack of effort, from lack of recovery. In that case run the 5-day
                version below and let your sport BE the explosive day. More sessions is not more progress; more
                sessions you recover from is.
              </p>
            </div>

            <Block title="The 5-day version (recommended if you also play sport)" items={[
              ['Mon — Push', 'Chest and triceps, hypertrophy. Rotational core to finish.'],
              ['Tue — Legs A', 'Squat-led strength and size. Anti-extension core.'],
              ['Wed — Pull', 'Back, biceps, neck. Anti-rotation core and carries.'],
              ['Thu — Shoulders + Arms', 'Delts and arms. Weighted ab work.'],
              ['Fri — Legs B + Explosive', 'Merge the two: jumps and sprints first while fresh, then unilateral and posterior chain work.'],
              ['Sat/Sun — Sport + one full rest day', 'Football or Muay Thai covers your remaining explosive work. Take at least one genuinely empty day.'],
            ]} />

            <Block title="Why the days sit in this order" items={[
              ['Legs A on Tuesday, Legs B on Saturday', 'Roughly 96 hours apart. Training legs twice a week beats once for both size and force production, but they need real time between heavy sessions.'],
              ['Explosive on Thursday', 'Two days after heavy legs and the day after an upper session, so your legs are fresh. Power work on tired legs is just conditioning with injury risk attached.'],
              ['Push and Pull separated', 'Monday and Wednesday, so your shoulders are not doing pressing and pulling on consecutive days before the dedicated shoulder day.'],
              ['Shoulders after both', 'By Friday your delts have already had indirect work from pressing and rowing, so Friday is about direct volume rather than heavy overhead strength.'],
              ['Sunday off, properly', 'Not a light gym day. Muscle is built during recovery, and this is the day that makes the other six count.'],
            ]} />

            <Block title="Weekly volume per muscle" items={[
              ['Chest — 12-14 hard sets', 'All on Push. Comfortably inside the 10-20 set range that research associates with maximum growth.'],
              ['Back — 14-16 sets', 'Pull day, plus indirect work from rows and carries elsewhere. Back tolerates and benefits from high volume.'],
              ['Shoulders — 16-18 sets across the week', 'Direct on Friday plus indirect from every press. Side delts get the most because they drive width.'],
              ['Quads and hamstrings — 10-14 sets each', 'Split across Legs A and Legs B, with hamstrings deliberately over-served for sprinting and injury prevention.'],
              ['Arms — 8-10 sets each', 'Direct work on Push, Pull and Shoulders days. They also grow from every compound you do.'],
              ['Core — 6 sessions, rotating function', 'Different quality each day rather than the same crunches six times. See the Core tab.'],
            ]} />
          </div>
        )}

        {/* ===== PUSH ===== */}
        {tab === 'push' && (
          <div className="fade-up stagger space-y-4">
            <Session
              title="Monday — Push"
              tag="Chest & triceps · pure hypertrophy"
              block="Bodybuilding day: 6-12 reps, 1-2 reps left in the tank on most sets, 90-120s rest on compounds and 60s on isolation. Take the last set of each isolation exercise to genuine failure."
              exercises={[
                { name: 'Incline DB press', sets: '4 × 8-10', targets: 'Upper chest · front delts · triceps', how: "Bench at 30 degrees — steeper turns it into a shoulder press. Dumbbells start at chest level with wrists stacked over elbows. Lower under control until you feel a stretch across the upper chest, then press up and slightly together without clanging them. Shoulder blades pulled back and down into the bench the whole set.", why: 'Upper chest first while you are freshest — it is the region that most decides how a chest looks in clothes, and the one that lags when you always start flat.' },
                { name: 'Flat barbell or machine press', sets: '3 × 8-10', targets: 'Mid chest · front delts · triceps', how: "Shoulder blades retracted, slight arch, feet planted. Bar comes down to the lower chest, elbows around 45-60 degrees from your body — not flared to 90. Touch, do not bounce. Press back up in a slight arc toward your face, not straight up.", why: 'Heavy horizontal pressing for overall chest mass. Machine is a legitimate choice here — you can push closer to failure safely without a spotter.' },
                { name: 'Weighted dips', sets: '3 × 8-10', targets: 'Lower chest · triceps · front delts', how: "Lean the torso forward about 30 degrees to bias the chest — staying upright shifts it to triceps. Lower until your upper arms are roughly parallel to the floor, no deeper if your shoulders complain. Elbows tucked in, not flaring wide. Add weight via a dip belt.", why: 'Lower chest and triceps under a big stretch. Lean forward about 30 degrees to bias the chest rather than sitting upright.' },
                { name: 'Cable fly (low to high)', sets: '3 × 12-15', targets: 'Chest — especially the inner and upper fibres', how: "Cables set at the lowest pin. Slight bend in the elbows held constant — the arms never change angle, only the shoulders move. Sweep up and across as if hugging someone, squeeze for a beat at the top, then let the arms travel back until you feel a real stretch across the chest.", why: 'Constant tension through a full stretch with no triceps involvement. The stretched position is where most of the growth stimulus lives.' },
                { name: 'Overhead cable triceps extension', sets: '3 × 10-12', targets: 'Triceps — long head', how: "Face away from the cable, rope overhead, elbows pointing forward and pinned in place. Only the forearms move. Let the rope go behind your head until the triceps are fully stretched, then extend and pull the rope apart slightly at lockout.", why: 'The long head only gets a full stretch with the arm overhead — this is the head that gives arms thickness from the side, and pushdowns alone miss it.' },
                { name: 'Triceps pushdown', sets: '3 × 12-15', targets: 'Triceps — lateral and medial heads', how: "Elbows glued to your ribs, torso upright, no leaning in to cheat the weight down. Push down until the arms are fully locked, spread the rope at the bottom, then control the way back up until the triceps are stretched.", why: 'Finishes the lateral head with high-rep work. Elbows pinned, last set to failure.' },
                { name: 'CORE — Rotational', sets: 'see Core tab', why: 'Cable woodchops and Pallof press. Punch and shot power comes from resisting and producing rotation, and this is the day for it.' },
              ]}
            />
            <Block title="Push day notes" items={[
              ['Why incline leads', 'Whatever you do first gets your best effort. Almost everyone has a flat-dominant chest because flat bench is always exercise one — leading with incline fixes that over months.'],
              ['Full range beats heavy partials', 'Chest growth is strongly driven by the stretched position. Control the eccentric, get a real stretch at the bottom, and do not bounce.'],
              ['Progression', 'Add reps within the range first, then weight. When you hit the top of the range on all sets, add the smallest increment available and start again at the bottom.'],
            ]} />
          </div>
        )}

        {/* ===== PULL ===== */}
        {tab === 'pull' && (
          <div className="fade-up stagger space-y-4">
            <Session
              title="Wednesday — Pull"
              tag="Back, biceps, neck · hypertrophy + combat"
              block="Width first, then thickness, then arms. Back responds well to high volume — do not be afraid of the set count here. Neck and grip at the end are the combat-specific pieces almost nobody trains."
              exercises={[
                { name: 'Weighted pull-ups', sets: '4 × 6-8', targets: 'Lats · teres major · biceps · mid back', how: "Slightly wider than shoulder-width, full hang at the bottom with shoulders active rather than dead. Think about pulling your elbows down into your back pockets rather than pulling your chin up. Chest to the bar, controlled descent to a full stretch every rep.", why: 'The best lat width builder there is. Add weight once you can do 10 clean bodyweight reps. Lats are also your clinch and grappling strength.' },
                { name: 'Barbell or Pendlay row', sets: '4 × 8-10', targets: 'Mid back · lats · rear delts · spinal erectors', how: "Hinge at the hips to around 45 degrees (Pendlay: torso parallel, bar resets on the floor each rep). Brace hard, pull the bar to your lower ribs or navel, elbows driving back not out. No jerking upright to move the weight — if your torso rises, the weight is too heavy.", why: 'Back thickness and the pulling strength behind snapping an opponent down. Strict, hips hinged, no jerking with the lower back.' },
                { name: 'Chest-supported row', sets: '3 × 10-12', targets: 'Mid traps · rhomboids · lats · rear delts', how: "Chest firmly on the pad so the lower back is fully removed. Pull the handles toward your lower ribs, squeeze the shoulder blades together for a beat, then let the arms travel forward fully to stretch the back at the bottom.", why: 'Same horizontal pull with the lower back removed, so you can push genuinely hard without stealing recovery from your leg days.' },
                { name: 'Lat pulldown or straight-arm pulldown', sets: '3 × 12-15', targets: 'Lats — width', how: "Pulldown: lean back slightly, pull the bar to your collarbone, elbows down and back. Straight-arm: arms nearly locked, sweep the bar from overhead down to your thighs in an arc using only the lats — the elbow angle never changes.", why: 'Isolates the lats without the biceps failing first. Pure width work — this is the V-taper exercise.' },
                { name: 'Face pulls', sets: '3 × 15-20', targets: 'Rear delts · external rotators · mid and lower traps', how: "Rope set at roughly face height. Pull the rope apart and toward your forehead, finishing with hands beside your ears and elbows high. Externally rotate at the end so your knuckles face the ceiling. Light weight and a two-second squeeze beats heavy.", why: 'Rear delts and external rotators. This is both a posture exercise and the thing that keeps your shoulders healthy under all the pressing.' },
                { name: 'Incline DB curl', sets: '3 × 10-12', targets: 'Biceps — long head, under stretch', how: "Bench at 45-60 degrees, arms hanging straight down behind the body line — that stretch is the whole point of the exercise. Curl without letting the elbows drift forward, squeeze at the top, lower slowly to a full stretch.", why: 'Incline puts the biceps long head on stretch, which is where the growth is. Biceps also assist every pull and underhook.' },
                { name: 'Hammer curl', sets: '3 × 12', targets: 'Brachialis · brachioradialis · forearms', how: "Neutral grip, palms facing each other, held throughout. Elbows fixed at your sides, no swinging. Curl to shoulder height and lower under control. The brachialis sits under the biceps and pushes it up, adding visible arm thickness.", why: 'Brachialis and forearm — arm thickness plus the grip strength that decides clinch battles.' },
                { name: 'Neck curls + extensions', sets: '3 × 15 each', targets: 'Deep neck flexors · neck extensors · upper traps', how: "Lie on a bench, head off the end. Curls: face up, small plate on a towel on your forehead, tuck the chin toward the chest through a full but comfortable range. Extensions: face down, same setup on the back of the head. Slow, controlled, never a jerk — start with no weight at all for the first two weeks.", why: 'Non-negotiable for combat sports. A strong neck absorbs strikes, resists chokes and reduces knockout risk. Light, controlled, never explosive.' },
                { name: 'CORE — Anti-rotation + carries', sets: 'see Core tab', why: 'Pallof holds and heavy suitcase carries. Trains the trunk to stay rigid while your limbs work, which is what shielding a ball actually is.' },
              ]}
            />
            <Block title="Pull day notes" items={[
              ['Vertical then horizontal', 'Pull-ups build width, rows build thickness. You need both, and doing width first means it gets your best effort.'],
              ['Straps are fine', 'On your heaviest rows and pulldowns, straps let your back fail before your grip does. Train grip separately with carries rather than letting it cap your back training.'],
              ['Neck: start absurdly light', 'This is the one place ego causes real injury. Bodyweight or a 2.5kg plate for the first month, always slow and controlled.'],
            ]} />
          </div>
        )}

        {/* ===== SHOULDERS ===== */}
        {tab === 'shoulders' && (
          <div className="fade-up stagger space-y-4">
            <Session
              title="Friday — Shoulders + Arms"
              tag="Delts, traps, arms · width and volume"
              block="By Friday your front delts have had plenty of indirect pressing, so this day is weighted toward side and rear delts — the two heads that actually create width and a 3D look. High volume, moderate loads."
              exercises={[
                { name: 'Seated DB shoulder press', sets: '4 × 8-10', targets: 'Front and side delts · triceps · upper traps', how: "Back supported, dumbbells starting at ear height with elbows slightly in front of the body rather than flared straight out to the sides. Press up and slightly in until they nearly touch. Do not lock out and rest at the top — keep tension and come straight back down.", why: 'Overhead pressing for front delt mass and overhead strength. Seated removes leg drive so the delts do the work.' },
                { name: 'DB lateral raise', sets: '4 × 12-15', targets: 'Side delts — the width builder', how: "Very light. Slight forward lean, tiny bend in the elbows, lead with the elbows rather than the hands as if pouring a jug. Raise to shoulder height only. Lower slowly over 2-3 seconds — most people get nothing from this exercise because they drop the weight.", why: 'THE width exercise. Side delts create the shoulder-to-waist silhouette. Light, strict, no swinging — this is the one lift where ego costs you the most.' },
                { name: 'Cable lateral raise', sets: '3 × 15', targets: 'Side delts — constant tension', how: "Cable at the lowest setting, running behind your back, handle in the opposite hand. Raise across and out to shoulder height, keeping tension at the bottom rather than letting the arm rest against your side. The cable loads the stretched position dumbbells cannot.", why: 'Constant tension through the whole range, unlike dumbbells which are almost weightless at the bottom. Different stimulus, brutal pump.' },
                { name: 'Rear delt fly or reverse pec deck', sets: '4 × 15-20', targets: 'Rear delts · mid traps · rhomboids', how: "Hinge forward (or use the machine seated facing the pad). Thumbs pointing down or neutral, slight elbow bend held constant. Sweep the arms out and slightly back, squeezing the rear delts — not the shoulder blades together, which turns it into a row.", why: 'The most neglected head. Rear delts make shoulders look full from the side and balance all your pressing — this is also posture work.' },
                { name: 'Barbell or DB shrug', sets: '3 × 12-15', targets: 'Upper traps', how: "Straight up and down — no rolling the shoulders, which achieves nothing and irritates the joint. Hold the top position for a full second, then lower to a complete stretch. Straps let the traps fail before the grip does.", why: 'Upper traps frame the neck and shoulders, and a strong trap-neck complex is genuinely protective in contact sport.' },
                { name: 'EZ-bar curl', sets: '3 × 10-12', targets: 'Biceps — both heads', how: "EZ bar rather than straight to spare the wrists. Elbows at your sides and still, no swinging or leaning back. Curl up, squeeze, then lower over 2-3 seconds to full extension. The lowering is where most of the growth stimulus is.", why: 'Direct biceps volume on a day your back is not fatigued, so your arms get a genuinely hard session rather than leftovers.' },
                { name: 'Skull crusher or overhead extension', sets: '3 × 10-12', targets: 'Triceps — long head', how: "Lying, EZ bar, elbows pointing at the ceiling and staying there. Lower the bar to your forehead or just behind your head — behind gives a bigger long-head stretch. Extend without letting the elbows drift toward your feet.", why: 'Triceps make up roughly two thirds of your arm. Second weekly dose after Push day.' },
                { name: 'CORE — Ab hypertrophy (weighted)', sets: 'see Core tab', why: 'This is the day for actually growing the abs. Weighted cable crunches in the 10-15 rep range — abs are muscles and grow like any other.' },
              ]}
            />
            <Block title="Shoulders day notes" items={[
              ['Why lateral raises get four sets', 'Side delts respond to volume and frequency, recover quickly, and are the single biggest driver of upper-body width. They are worth more sets than almost anything else here.'],
              ['Lighten them until it burns', 'If you are swinging 20kg dumbbells you are training your traps and lower back. Halve the weight, pause at the top, and the delts will let you know.'],
              ['Rear delts before you feel you need them', 'They lag in almost everyone, they improve posture, and they protect the shoulder joint. High reps, light, lots of them.'],
            ]} />
          </div>
        )}

        {/* ===== LEGS ===== */}
        {tab === 'legs' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">Two leg days, two different jobs</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Legs A builds the force you can produce. Legs B makes it usable on a pitch — single leg, posterior chain,
                and the injury-prevention work that keeps you available. Both add size; neither will make you slow,
                because the explosive day and your sprint work are what convert strength into speed.
              </p>
            </div>
            <Session
              title="Tuesday — Legs A"
              tag="Max strength + size"
              block="Heavy compound first with full recovery (3 min), then hypertrophy work. This is the day that raises your ceiling — the explosive day converts it into speed."
              exercises={[
                { name: 'Back squat', sets: '4 × 5-6', targets: 'Quads · glutes · adductors · spinal erectors · trunk', how: "Bar on the upper traps, feet about shoulder-width with toes slightly out. Big breath, brace the trunk like you are about to be punched. Sit down and slightly back, knees tracking over the toes, until the hip crease passes below the knee if your mobility allows. Drive up through the whole foot — chest and hips rising together, not hips shooting up first.", why: 'Your foundational strength lift and the number to progress weekly. Sprint speed and jump height both track with relative squat strength.' },
                { name: 'Romanian deadlift', sets: '3 × 8-10', targets: 'Hamstrings · glutes · spinal erectors', how: "Start standing with the bar at hip height. Soft knees held at a constant angle — this is a hip hinge, not a squat. Push the hips straight back, bar dragging down the thighs, until you feel a strong hamstring stretch around mid-shin. Back stays flat throughout. Drive the hips forward to stand.", why: 'Hamstrings under a loaded stretch. The hamstrings decelerate your leg every stride at top speed, which is exactly where they tear.' },
                { name: 'Bulgarian split squat', sets: '3 × 8-10/leg', targets: 'Quads · glutes · adductors · balance', how: "Rear foot on a bench behind you, front foot far enough forward that your front shin stays near vertical. Drop straight down until the back knee is just off the floor. More forward lean hits glutes, more upright hits quads. The front leg does everything — the back leg is only balance.", why: 'Football happens on one leg. Single-leg strength transfers more directly to cutting, kicking and planting than any bilateral lift.' },
                { name: 'Leg press or hack squat', sets: '3 × 10-12', targets: 'Quads · glutes', how: "Feet mid-platform, shoulder-width. Lower until your knees reach roughly 90 degrees or just past, without the lower back rounding off the pad — that round is where leg press injuries come from. Press back without locking the knees out hard at the top.", why: 'Pure quad size with the stabilising demand removed, so you can take it close to failure safely after the heavy squatting.' },
                { name: 'Nordic hamstring curl', sets: '3 × 5', targets: 'Hamstrings — eccentric strength', how: "Kneel with your ankles anchored under something solid or held by a partner. Body straight from knees to head, squeeze the glutes. Lower yourself forward as slowly as you possibly can, resisting the whole way, then catch with your hands and push back up. Even lowering 20-30 degrees under control is a working rep at the start.", why: 'The single most evidence-backed hamstring injury prevention exercise there is — programmes using it have roughly halved hamstring injury rates. Non-negotiable if you play football.' },
                { name: 'Standing calf raise', sets: '4 × 10-15', targets: 'Gastrocnemius', how: "Balls of the feet on a raised edge, knees straight. Drop the heels for a full stretch, pause a beat at the bottom, then drive up onto the toes and hold the top for a second. Straight knees are what target the gastroc rather than the soleus.", why: 'Stiff, springy ankles are free speed and protect against rolled ankles. Pause at the top, full stretch at the bottom.' },
                { name: 'CORE — Anti-extension', sets: 'see Core tab', why: 'Hanging leg raises and ab wheel. Resisting extension is what stops your lower back taking load that belongs to your abs.' },
              ]}
            />
            <Session
              title="Saturday — Legs B"
              tag="Unilateral · posterior chain · football-specific"
              open={false}
              block="Lighter on the spine, heavier on the hips and hamstrings. This is the session that makes your legs work on a pitch rather than just in a squat rack."
              exercises={[
                { name: 'Trap bar deadlift', sets: '4 × 5', targets: 'Glutes · quads · hamstrings · traps · whole posterior chain', how: "Stand in the middle of the bar, feet hip-width. Hinge down and grip the handles, chest up, back flat, arms straight. Push the floor away with your legs and drive the hips through to stand tall. The neutral grip and centred load make it far kinder on the spine than a straight bar.", why: 'Hip and posterior chain power with a far friendlier spinal position than a barbell deadlift. Arguably transfers better to jumping and sprinting too.' },
                { name: 'Hip thrust', sets: '4 × 8-10', targets: 'Glutes · hamstrings', how: "Upper back on a bench, bar across the hips with a pad. Feet planted so your shins are vertical at the top. Drive through the heels, squeeze the glutes hard and finish with the torso parallel to the floor — do not hyperextend the lower back to get higher. Chin tucked, ribs down.", why: 'Direct glute loading. Glutes are the primary engine of sprint acceleration, shot power and kick power — one of the highest-return lifts for a footballer.' },
                { name: 'Walking lunges', sets: '3 × 10/leg', targets: 'Quads · glutes · adductors · hip stability', how: "Long step forward, drop the back knee toward the floor, front shin roughly vertical. Push through the front heel to stand and step straight into the next rep. Torso upright, no leaning over the front leg. Dumbbells at your sides is the simplest loading.", why: 'Single-leg strength through a stride pattern, plus real hip mobility under load. Closest gym movement to actually running.' },
                { name: 'Single-leg RDL', sets: '3 × 8/leg', targets: 'Hamstrings · glutes · balance · hip control', how: "Weight in the opposite hand to the standing leg. Soft knee, hinge at the hip letting the free leg travel straight back as a counterweight, keeping hips square to the floor. Lower until you feel the hamstring stretch, then drive the hip forward to stand.", why: 'Hamstring and glute strength plus the balance and hip control that stops you getting knocked off the ball.' },
                { name: 'Nordic hamstring curl', sets: '3 × 5', targets: 'Hamstrings — eccentric strength', how: "Kneel with your ankles anchored under something solid or held by a partner. Body straight from knees to head, squeeze the glutes. Lower yourself forward as slowly as you possibly can, resisting the whole way, then catch with your hands and push back up. Even lowering 20-30 degrees under control is a working rep at the start.", why: 'Second weekly dose. Twice a week is what the injury-prevention research protocols actually use, and it is what makes the difference.' },
                { name: 'Copenhagen plank', sets: '3 × 20-30s/side', targets: 'Adductors (groin) · obliques', how: "Side-lying, top leg resting on a bench at the knee (easier) or ankle (harder). Lift your hips so the body forms a straight line, holding position with the inner thigh of the top leg. Start with the knee-supported version — the full ankle version is genuinely hard.", why: 'Adductor strength. Groin strains end football seasons, and this is the best prevention exercise available.' },
                { name: 'Seated calf raise', sets: '3 × 12-15', targets: 'Soleus', how: "Seated with the pad over the knees, balls of the feet on the platform. Knees bent to 90 degrees is what shifts the work from the gastroc to the soleus. Full stretch at the bottom, hard squeeze at the top, slow throughout.", why: 'Seated targets the soleus, which the standing version misses. The soleus takes enormous load in running.' },
                { name: 'CORE — Anti-lateral flexion', sets: 'see Core tab', why: 'Suitcase carries and side planks. Resisting sideways bend is what keeps you upright when someone leans on you mid-sprint.' },
              ]}
            />
            <Block title="Will heavy legs make me slower?" items={[
              ['No — as long as you keep sprinting', 'Strength is the foundation of power. What makes people slow is gaining weight while dropping the sprint and jump work that teaches the body to use it. Your explosive day exists precisely to prevent that.'],
              ['Strength first, then convert it', 'A stronger leg can produce more force. The jumps and sprints on Thursday train you to produce that force fast. Doing only one of the two is why people are either strong and slow or fast and fragile.'],
              ['Do not chase a squat number at any cost', 'Once your squat is roughly 1.5-2x bodyweight, extra maximal strength returns less for sport than more speed work. Keep progressing, but not at the expense of Thursday.'],
            ]} />
          </div>
        )}

        {/* ===== EXPLOSIVE ===== */}
        {tab === 'explosive' && (
          <div className="fade-up stagger space-y-4">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-200/85 leading-relaxed">
                <span className="font-bold">The rule that makes this day work:</span> every rep is at 100% intent with
                full recovery. This is nervous-system training, not conditioning. The moment quality drops — slower
                sprints, lower jumps, sloppy landings — the session is over. Stopping early is the correct call, not
                a failure of effort.
              </p>
            </div>
            <Session
              title="Thursday — Explosive / Sport"
              tag="Speed · jumps · rotational power"
              block="Order matters enormously: most explosive and most technical first, always fresh. Rest 2-3 min between everything. Total working time is short — around 45 minutes including warm-up."
              exercises={[
                { name: 'Thorough warm-up', sets: '10-12 min', targets: 'Whole body · nervous system prep', how: "5 min easy jog, then leg swings front-to-back and side-to-side, walking lunges, A-skips and high knees. Finish with 3-4 build-up runs of about 40m at 60, 70, 80 then 90 percent. You should feel warm and springy before the first real sprint.", why: 'Non-negotiable before sprinting. Easy jog, leg swings, A-skips, then 3-4 build-up runs at 60, 70, 80 and 90%. Cold hamstrings plus max sprints is how you tear something.' },
                { name: 'Med ball rotational throw', sets: '4 × 5/side', targets: 'Obliques · hips · whole rotational chain', how: "Stand side-on to a wall, ball at your hip. Drive off the back foot, rotate the hip first and let the torso and arms follow, and throw the ball hard into the wall. The power comes from the ground and hips — arms are the last link, not the source.", why: 'The exact hip-to-shoulder sequence that fires a punch, a kick and a shot. Throw with total intent — half-effort throws train nothing.' },
                { name: 'Box jump or broad jump', sets: '4 × 3', targets: 'Glutes · quads · calves — triple extension', how: "Box: quarter squat, swing the arms, explode up and land softly in the same quarter-squat position on top. Step down, never jump down. Broad: same swing, jump forward for distance and stick the landing. Full reset between reps — this is quality work, not conditioning.", why: 'Pure triple extension — ankle, knee and hip firing together. Step down from box jumps, never jump down. Full reset between reps.' },
                { name: 'Depth jump (from week 7)', sets: '3 × 3', targets: 'Reactive strength · tendon stiffness', how: "Step (do not jump) off a 30-40cm box, land on the balls of your feet and immediately jump as high as possible. The goal is minimum ground contact time — think of the floor as hot. If you land heavily or pause, the box is too high.", why: 'True reactive strength: minimise ground contact time on landing. Only add this once you have 6+ weeks of the basics and a solid squat — it is high-force and unforgiving.' },
                { name: 'Acceleration sprints', sets: '6 × 20m', targets: 'Glutes · hamstrings · quads — starting power', how: "Start from a staggered stance, torso leaning forward around 45 degrees. Drive the knees and push the ground back behind you, rising gradually to upright over 15-20m rather than popping up immediately. Walk back slowly for full recovery between reps.", why: 'Football is won in the first 5-20 metres. Vary the start — standing, side-on, rolling — and walk back slowly for full recovery.' },
                { name: 'Flying sprints', sets: '4 × 30-40m', targets: 'Hamstrings · glutes — top-speed mechanics', how: "Build gradually over the first 20m, then hit 100% for 20m. At top speed run tall with hips high, foot striking underneath your body, face and shoulders relaxed. Do not clench — tension slows you down.", why: 'Build up over 20m then hit 100% for 20m. Trains top-speed mechanics: tall hips, ground contact underneath you, relaxed face and shoulders.' },
                { name: 'Lateral bounds / change of direction', sets: '3 × 5/side', targets: 'Glute medius · adductors · ankle stability', how: "Push off one leg sideways, land on the other, and stick the landing for a full second before going back. Knee tracking over the foot, not collapsing inward. Control on landing is the training effect.", why: 'Side-to-side explosiveness for cutting in football and switching stance in Muay Thai. Stick and hold each landing — the control is the point.' },
                { name: 'CORE — Sport rotational', sets: 'see Core tab', why: 'Med ball slams and rotational throws for reps. Same pattern as your sport, trained for power rather than size.' },
              ]}
            />
            <Block title="If you play football or train Muay Thai this week" items={[
              ['Your sport can replace part of this', 'A proper football session already contains sprinting, cutting and jumping. If you played this week, cut the sprints and lateral bounds and keep the jumps, throws and Copenhagens.'],
              ['Never do this the day before a match', 'It is CNS-heavy. Leave at least 48 hours between this session and anything competitive.'],
              ['Sport first, gym after, on the same day', 'If both have to happen, do the technical or competitive session while fresh and lift afterwards. Skill degrades badly under fatigue, and sloppy reps build sloppy habits.'],
              ['This is the day you protect', 'If the week gets compressed and something has to go, drop a hypertrophy day — not this one. Size can be regained; speed and injury resilience are harder won.'],
            ]} />
          </div>
        )}

        {/* ===== CORE ===== */}
        {tab === 'core' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">Rotating core — why it is not the same thing six times</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trunk has four jobs: resist extension, resist rotation, resist sideways bend, and produce rotation.
                Sport needs all four. Visible abs also need actual muscle, which needs loaded reps in a hypertrophy
                range — not endless bodyweight crunches. This rotation covers every function across the week and gives
                the abs two dedicated growth slots.
              </p>
            </div>
            <Session
              title="Mon (Push) — Rotational power"
              tag="Produce rotation"
              open={false}
              block="Attached to the end of Push day. 10-12 minutes."
              exercises={[
                { name: 'Cable woodchop', sets: '3 × 10/side', targets: 'Obliques · rotational chain', how: "Cable set high (or low for the reverse). Feet planted, pivot the back foot and rotate through the hips while the arms stay relatively straight. Pull across and down to the opposite hip. Rotate from the trunk and hips, not by yanking with the arms.", why: 'Loaded rotation through a full range. This is the pattern behind a punch, a kick and a shot.' },
                { name: 'Pallof press', sets: '3 × 30s/side', targets: 'Deep core · obliques — anti-rotation', how: "Stand side-on to a cable at chest height, hands at your sternum. Press straight out and hold — the cable is trying to twist you and your job is to not let it. Ribs down, glutes tight, breathe normally through the hold.", why: 'Anti-rotation to finish. Teaches the trunk to transmit force rather than leak it — you cannot punch hard through a soft midsection.' },
              ]}
            />
            <Session
              title="Tue (Legs A) — Anti-extension"
              tag="Resist arching"
              open={false}
              block="After legs. Keeps the lower back out of work that belongs to the abs."
              exercises={[
                { name: 'Hanging leg raise', sets: '3 × 10-15', targets: 'Lower abs · hip flexors', how: "Hang from a bar, shoulders active. Curl the pelvis up toward your ribs rather than just lifting the legs — that posterior tilt is what makes it an ab exercise instead of a hip flexor swing. Lower slowly with no swinging. Bend the knees if straight legs are too hard.", why: 'Lower abs and hip flexors. Control the lowering — swinging turns it into a hip flexor swing with no ab work at all.' },
                { name: 'Ab wheel rollout', sets: '3 × 8-12', targets: 'Whole anterior core — anti-extension', how: "Start on your knees, wheel under the shoulders. Roll out keeping the ribs pulled down and the lower back flat — the moment your back arches, you have gone past your range. Only roll out as far as you can control and pull back with the abs, not the hips.", why: 'One of the highest ab-activation exercises measured. Keep the ribs down and the lower back flat throughout.' },
              ]}
            />
            <Session
              title="Wed (Pull) — Anti-rotation + carries"
              tag="Stay rigid under load"
              open={false}
              block="Doubles as grip work, which is why it sits on pull day."
              exercises={[
                { name: 'Suitcase carry', sets: '3 × 40m/side', targets: 'Obliques · quadratus lumborum · grip · traps', how: "Heavy dumbbell or kettlebell in one hand only. Stand tall, shoulders level, and walk without leaning away from or toward the weight. The whole exercise is refusing to bend sideways. Swap hands each set.", why: 'One-sided load forces the whole trunk to resist collapsing sideways. This IS shielding a ball, trained under load.' },
                { name: 'Renegade row or bird dog row', sets: '3 × 8/side', targets: 'Deep core · lats — anti-rotation', how: "Press-up position on dumbbells, feet wide for stability. Row one dumbbell to your ribs while keeping the hips completely square to the floor — no twisting. Slow and controlled; if the hips rotate, go lighter.", why: 'Resisting rotation while one arm works — the exact demand of holding position while grappling.' },
              ]}
            />
            <Session
              title="Thu (Explosive) — Sport rotational"
              tag="Power, not size"
              open={false}
              block="Explosive intent, low reps, full recovery. Same rules as the rest of the day."
              exercises={[
                { name: 'Med ball slam', sets: '4 × 6', targets: 'Whole anterior chain · lats · abs', how: "Ball overhead with a full body extension, then slam it into the floor as hard as you can, folding through the trunk. Follow through fully. Intent is everything — a gentle slam trains nothing.", why: 'Full-body extension into a violent trunk flexion. Throw it like you mean it.' },
                { name: 'Rotational med ball throw', sets: '4 × 5/side', targets: 'Obliques · hips — rotational power', how: "As per the rotational throw: side-on, drive from the back foot, hips lead, arms finish. Full effort every rep with full recovery between sets.", why: 'Trains the trunk to transfer force from hips to hands as fast as possible.' },
              ]}
            />
            <Session
              title="Fri (Shoulders) — Ab hypertrophy"
              tag="Actually growing the abs"
              open={false}
              block="This is the growth slot. Load it, keep reps in the 10-15 range, and progress the weight like any other muscle."
              exercises={[
                { name: 'Cable crunch', sets: '4 × 10-15', targets: 'Rectus abdominis — loadable ab growth', how: "Kneel facing the stack, rope beside your head, hips fixed in place. Crunch by rounding the spine and driving your ribs toward your hips — the hips must not hinge. Squeeze hard at the bottom, control the way back up. This is the ab exercise you progressively add weight to.", why: 'The best loadable ab exercise. Round the spine and crunch the ribs toward the hips — do not just hinge at the hips. Add weight over time.' },
                { name: 'Weighted decline sit-up', sets: '3 × 10-12', targets: 'Rectus abdominis · hip flexors', how: "Decline bench, plate held on the chest or behind the head. Curl up rounding the spine segment by segment rather than staying rigid and hinging at the hips. Lower slowly. Add weight as it gets easy.", why: 'Hold a plate on your chest. Abs are muscles: they need progressive overload to get thicker, and thickness is what makes them visible.' },
              ]}
            />
            <Session
              title="Sat (Legs B) — Anti-lateral flexion"
              tag="Resist sideways bend"
              open={false}
              block="Completes the four functions. Also the most football-specific of the six."
              exercises={[
                { name: 'Side plank with reach-through', sets: '3 × 30-40s/side', targets: 'Obliques · QL — anti-lateral flexion', how: "Side plank on the forearm, body in a straight line, hips lifted high. Reach the top arm under your body, rotate slightly, then return and open back up. Hips must not sag toward the floor at any point.", why: 'Obliques and quadratus lumborum. Keeps you upright when someone leans into you mid-stride.' },
                { name: 'Heavy suitcase hold', sets: '3 × 30s/side', targets: 'Obliques · QL · grip', how: "Same as the carry but static. Stand completely upright holding a heavy weight in one hand, shoulders level, resisting the sideways pull for the full duration.", why: 'Simple, brutal, and directly transfers to holding your ground in a shoulder-to-shoulder duel.' },
              ]}
            />
            <Block title="The honest bit about visible abs" items={[
              ['Training grows them, diet reveals them', 'You can build genuinely thick abs and still not see one of them at 18% body fat. Both halves are required, and they are separate jobs.'],
              ['Roughly 10-12% body fat for a clear four, lower for six', 'Individual and largely genetic in terms of where you store fat and how your abs are shaped. Training makes them thicker; it cannot change their arrangement.'],
              ['Do not train abs daily', 'They recover like any other muscle. Six short, varied, quality sessions across the week is more than enough — the rotation above is deliberately not six of the same thing.'],
            ]} />
          </div>
        )}

        {/* ===== POSTURE ===== */}
        {tab === 'posture' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">Posture — what the evidence actually supports</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Straight answer first: the popular idea that bad posture directly causes back and neck pain is weaker
                than it is usually presented — plenty of people with textbook-poor posture have no pain, and vice versa.
                What the evidence does support is that specific strength and mobility work changes how you carry
                yourself, how you look, and how resilient you are. So train it for appearance and performance, and
                treat "it will fix your pain" as a maybe rather than a promise.
              </p>
            </div>
            <Block title="The two patterns worth addressing" items={[
              ['Upper cross — forward head, rounded shoulders', 'Tight and overactive: chest, upper traps, deep chest muscles. Weak and lengthened: deep neck flexors, mid and lower traps, rhomboids, rear delts. This is the one that visibly changes your silhouette.'],
              ['Anterior pelvic tilt — arched lower back, stomach pushed forward', 'Tight hip flexors and lower back, weak glutes and abs. A small degree of tilt is completely normal — only worth addressing if it is pronounced.'],
              ['The single most effective intervention', 'Strengthening the weak, lengthened muscles. Stretching the tight side alone reliably fails, because nothing is holding the new position. Strength is what holds posture; mobility just makes the position available.'],
            ]} />
            <Session
              title="The daily 8 minutes"
              tag="Do this most days — it is the whole protocol"
              block="Every one of these is included because it strengthens something weak rather than just stretching something tight. Attach it to the end of a session or do it at home."
              exercises={[
                { name: 'Chin tucks', sets: '3 × 10 (5s holds)', targets: 'Deep neck flexors', how: "Sit or stand tall. Draw the head straight back over the shoulders making a double chin — do not tip the chin down or up. Hold 5 seconds and release. Small, subtle movement; it should feel like a gentle effort at the front of the throat.", why: 'Strengthens the deep neck flexors, which are the muscles that actually hold your head back over your shoulders. The best-supported intervention for forward head posture.' },
                { name: 'Prone Y-T-W raises', sets: '2 × 10 each', targets: 'Lower traps · mid traps · rhomboids · rear delts', how: "Lie face down on the floor or an incline bench. Y: arms overhead in a Y, thumbs up, lift. T: arms straight out to the sides, lift. W: elbows bent at your sides, squeeze back and down. No weight or 1-2kg maximum — this is endurance and control work.", why: 'Face down, light or no weight. Directly targets lower traps, mid traps and rhomboids — the muscles that hold your shoulder blades down and back.' },
                { name: 'Wall slides', sets: '3 × 10', targets: 'Lower traps · serratus · thoracic mobility', how: "Back against a wall, feet slightly forward, lower back gently flattened. Forearms on the wall at shoulder height. Slide the arms overhead keeping wrists, elbows and back in contact. Only go as high as you can without the lower back arching off.", why: 'Back against a wall, arms sliding overhead keeping contact. Trains overhead shoulder mechanics and thoracic position at the same time.' },
                { name: 'Thoracic extension over foam roller', sets: '2 × 8-10', targets: 'Thoracic spine mobility', how: "Roller across the mid back, hands supporting the head, knees bent. Extend backwards over the roller, breathe out at end range, then come up. Move the roller an inch at a time up and down the mid back — never do this on the lower back.", why: 'Roller under the mid back, extend over it. Most rounded-shoulder posture is partly a stiff upper back — this restores the extension your shoulders need.' },
                { name: 'Dead hang', sets: '2 × 30s', targets: 'Lats · shoulders · grip · spinal decompression', how: "Hang from a bar with a full grip, arms straight, shoulders relaxed but not completely dead. Breathe and let gravity do the work. Build to 30-60 seconds. One of the simplest and highest-return daily habits.", why: 'Decompresses the spine, opens the shoulders and builds grip. One of the simplest high-return things you can do daily.' },
                { name: 'Couch stretch (hip flexors)', sets: '2 × 45s/side', targets: 'Hip flexors · quads', how: "Back foot up on a couch or bench with the knee on the floor, front foot planted forward. Squeeze the glute of the back leg and tuck the pelvis under — that posterior tilt is what actually stretches the hip flexor. Stay tall, do not arch the lower back.", why: 'For anterior pelvic tilt. Pair it with glute work below — stretching alone will not hold the change.' },
                { name: 'Glute bridge or hip thrust', sets: '3 × 12', targets: 'Glutes', how: "Bridge: on your back, feet planted, drive the hips up and squeeze the glutes hard at the top with the ribs down. Hold for a beat. Strong glutes pull the pelvis out of an anterior tilt — this is the fix that actually holds.", why: 'Strong glutes pull the pelvis back into neutral. This is the actual fix for anterior pelvic tilt, not the stretching.' },
              ]}
            />
            <Block title="What is already doing the work in your programme" items={[
              ['Face pulls (Pull day, 3 × 15-20)', 'Rear delts and external rotators — the highest-value posture exercise in the whole plan, and it is already in there.'],
              ['Rear delt flies (Shoulders day, 4 × 15-20)', 'Second weekly dose of exactly what rounded shoulders need.'],
              ['Rows and pull-ups', 'Building your mid and upper back is itself posture training, and it does more for your silhouette than any stretch.'],
              ['Suitcase carries (core rotation)', 'Trains you to stand tall and rigid under asymmetric load, which is posture under real-world demand.'],
              ['Nordics and hip thrusts', 'Posterior chain strength directly opposes the tilted-forward pelvis pattern.'],
            ]} />
            <Fold title="What does not work (and what to ignore)" tag="Saves you time and money" items={[
              ['Posture-correcting braces', 'They hold you in position passively, which means the muscles that should be doing the job do not have to. Evidence for lasting change is poor. Use strength instead.'],
              ['Stretching alone', 'Feels productive, changes little on its own. Without strengthening the opposing muscles there is nothing to hold the new position once you stand up.'],
              ['Thinking about it constantly', 'Consciously holding yourself upright is fatiguing and does not build the capacity to do it automatically. Train the muscles and it stops being a conscious effort.'],
              ['One perfect posture', 'There is no single correct posture to hold all day. The best posture is genuinely the next one — moving regularly beats sitting rigidly in an idealised position.'],
            ]} />
          </div>
        )}

        {/* ===== RULES ===== */}
        {tab === 'rules' && (
          <div className="fade-up stagger space-y-4">
            <Block title="The rules that make this work" items={[
              ['Explosive work first and fresh, always', 'Jumps, throws and sprints go at the START of a session, never at the end. Power trained tired is conditioning with injury risk attached.'],
              ['Hypertrophy: 1-2 reps in reserve', 'Stop most sets when you could have done 1-2 more clean reps. Take the last set of isolation exercises to genuine failure. Training everything to failure wrecks recovery for marginal extra growth.'],
              ['Progressive overload, written down', 'Every session, try to beat the logbook by a rep or the smallest weight increment. If nothing has moved in a month, the problem is recovery, food or effort — not the programme.'],
              ['Rest properly', '2-3 min on heavy compounds and all power work, 60-90s on isolation. Cutting rest to feel worked costs you load, and load is what drives growth.'],
              ['Two leg sessions, 96 hours apart', 'Tuesday and Saturday. Do not let them drift next to each other when the week gets messy — that is when things get tweaked.'],
              ['Deload every 6-8 weeks', 'One week at roughly 60% of normal volume, keeping intensity. Not optional. This is when your body catches up and the next block goes better.'],
            ]} />
            <Block title="Recovery — the part that decides whether 6 days works" items={[
              ['Protein: 1.6-2.2g per kg bodyweight', 'The number that turns training into muscle. Spread across 3-4 meals. Non-negotiable at this training frequency.'],
              ['Eat enough overall', 'Six sessions a week in a calorie deficit is how you get flat, weak and injured. If you want size, eat in a surplus of 300-500 kcal and accept some fat gain.'],
              ['Sleep 8h+', 'At this volume, under-sleeping is not a minor issue — it is the thing that will stall you. Growth and CNS recovery both happen asleep. See the Night Routine.'],
              ['Creatine 5g daily', 'Most evidence-backed supplement for exactly this kind of training: strength, power output and repeated sprint ability. Timing irrelevant, consistency is not.'],
              ['Watch the warning signs', 'Sleep getting worse, resting heart rate climbing, motivation gone, numbers stalling across multiple lifts, niggles appearing. Any two of those means take a deload now rather than in three weeks.'],
            ]} />
            <Block title="How to adjust it" items={[
              ['If you are always sore or run down', 'Drop to the 5-day version. It is not a lesser programme — for someone also playing sport it is usually the better one.'],
              ['If a muscle is lagging', 'Add 2-4 sets a week to it before adding anything else, and put it first in its session. Do not add whole exercises to a plan that is already full.'],
              ['If you miss a day', 'Do not stack two sessions together. Shift the week forward and drop whatever falls off the end — usually a hypertrophy day, never the explosive day.'],
              ['If your sport volume spikes', 'Pre-season or a heavy match week: cut a leg day and reduce total sets by about a third. Your sport is training; count it as such.'],
              ['Give it 8-12 weeks before judging it', 'Strength moves in weeks, visible size in months, speed and power somewhere between. Programme-hopping every 3 weeks is the single most common reason people make no progress.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
