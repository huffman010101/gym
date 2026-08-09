import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Dumbbell, Utensils, Flame, Activity } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'week' | 'push' | 'pull' | 'shoulders' | 'legs' | 'explosive' | 'core' | 'recovery' | 'posture' | 'rules';

const TABS: { id: Tab; label: string }[] = [
  { id: 'week', label: 'The Week' },
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'legs', label: 'Legs' },
  { id: 'explosive', label: 'Explosive' },
  { id: 'core', label: 'Core & Abs' },
  { id: 'recovery', label: 'Recovery' },
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
  ['Tue', 'Big Leg Day', 'Max strength + size — the whole leg, one session'],
  ['Wed', 'Pull', 'Back, biceps, neck — hypertrophy'],
  ['Thu', 'Explosive / Functional Leg Day', 'Speed, jumps, rotational power'],
  ['Fri', 'Shoulders + Arms', 'Delts, traps, arms — hypertrophy'],
  ['Sat', 'Rest / Sport', 'Freed up — padel, football, or genuine rest'],
  ['Sun', 'Rest', 'Full rest — this is where it all happens'],
];

export default function Programs() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['week', 'push', 'pull', 'shoulders', 'legs', 'explosive', 'core', 'recovery', 'posture', 'rules'] as const)
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
            one big leg day built for <span className="text-orange-300 font-bold">football power</span>, one dedicated
            <span className="text-orange-300 font-bold"> explosive/functional leg day</span>, and rotating core work so
            every session finishes with either sport-specific trunk strength or direct ab growth.
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
              ['Tue — Big Leg Day', 'Squat-led strength and size, the whole leg in one session. Anti-extension core.'],
              ['Wed — Pull', 'Back, biceps, neck. Anti-rotation core and carries.'],
              ['Thu — Shoulders + Arms', 'Delts and arms. Weighted ab work.'],
              ['Fri — Explosive / Functional Leg Day', 'Jumps, sprints and rotational power while fresh — your sport can replace part of this if you played this week.'],
              ['Sat/Sun — Sport + one full rest day', 'Football or Muay Thai covers your remaining explosive work. Take at least one genuinely empty day.'],
            ]} />

            <Block title="Why the days sit in this order" items={[
              ['Big Leg Day on Tuesday, Explosive on Thursday', 'Two days apart. Legs get real recovery before the nervous-system work, and power work on tired legs is just conditioning with injury risk attached.'],
              ['Push and Pull separated', 'Monday and Wednesday, so your shoulders are not doing pressing and pulling on consecutive days before the dedicated shoulder day.'],
              ['Shoulders after both', 'By Friday your delts have already had indirect work from pressing and rowing, so Friday is about direct volume rather than heavy overhead strength.'],
              ['Sunday off, properly', 'Not a light gym day. Muscle is built during recovery, and this is the day that makes the other six count.'],
            ]} />

            <Block title="Weekly volume per muscle" items={[
              ['Chest — 12-14 hard sets', 'All on Push. Comfortably inside the 10-20 set range that research associates with maximum growth.'],
              ['Back — 14-16 sets', 'Pull day, plus indirect work from rows and carries elsewhere. Back tolerates and benefits from high volume.'],
              ['Shoulders — 16-18 sets across the week', 'Direct on Friday plus indirect from every press. Side delts get the most because they drive width.'],
              ['Quads and hamstrings — 10-14 sets each', 'All on Big Leg Day, with hamstrings deliberately over-served for sprinting and injury prevention.'],
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

            <Fold title="A lean, defined back — why yours is not showing yet" tag="The footballer / swimmer look, honestly" items={[
              ['Definition is thickness plus leanness, and it is usually the leanness', 'Back detail — the separation between the traps, rhomboids and lats, the lines either side of the spine — only appears when the layer of fat over it is thin. The back is one of the last areas to lean out for most men, so a back that looks flat at 15% can look genuinely impressive at 11% with no extra muscle. If your training is decent and the definition is missing, the honest first answer is body fat, not exercise selection.'],
              ['You cannot see your own back, so you cannot judge it', 'Almost everyone under-rates their own back development because they only ever see it in a badly-lit mirror over one shoulder. Get someone to photograph it relaxed and flexed, in daylight, from directly behind — that is your actual baseline, and it is usually better than you think.'],
              ['The upper back is the bit that reads as "athletic"', 'The V-taper comes from lat width, but the DETAIL people notice — the ridged look across the top — is mid traps, rhomboids and rear delts. Those respond to volume and control, not heavy weight, and they are exactly what gets skipped because you cannot see them while training. This is why face pulls and chest-supported rows are in the session and why they are not optional.'],
              ['Squeeze and stretch beat load, specifically here', 'Back muscles are hard to feel, so most people move weight with their arms and momentum and never contract the target at all. Two rules that change back development faster than adding weight: pause a full second at peak contraction on every row, and let the arms travel all the way forward at the bottom to get a real stretch. Halve the weight if that is what it takes to feel it.'],
              ['Pull with your elbows, not your hands', 'Think of your hands as hooks and drive the ELBOW to the target. On pull-ups, elbows down into your back pockets. On rows, elbows past your ribs. The moment you think about pulling with your hands, your biceps take the work and your back gets a fraction of it.'],
              ['Train the erectors directly', 'The two columns either side of your lower spine are what make a back look built rather than just wide, and almost nobody trains them on purpose. Back extensions and Romanian deadlifts cover it — the Blueprint\'s posture routine has the full detail on erector work and neck thickness.'],
              ['Rear delts are the cheat code', 'They sit right at the top of the back, they are visible from every angle including the front, they recover fast, and they lag in almost everyone. 4 sets of 15-20 twice a week, light, with a hard squeeze. Fastest visible change available on the upper body.'],
              ['Timeline, honestly', 'Noticeable back thickness is a 6-12 month project on consistent volume. Visible definition can appear far sooner than that if you are dropping body fat, because it is revealing what is already there. Both at once is why people seem to transform in a cut.'],
            ]} />

            <Fold title="Weighted pull-ups and chin-ups — the progression" tag="Getting from bodyweight to genuinely loaded" items={[
              ['Chin-up vs pull-up — use both', 'Pull-up (overhand, wider) biases the lats and upper back, so it is the width builder. Chin-up (underhand, shoulder-width) lets the biceps contribute, so you can move more weight and it hits the lats lower plus the arms hard. Neither is superior — alternate them across blocks, or lead with weighted pull-ups and finish with bodyweight chin-ups.'],
              ['Earn the right to load', 'Do not add weight until you can do 10-12 clean bodyweight reps: full hang at the bottom with shoulders active, chest to the bar, no kipping, controlled descent. Adding plates to a sloppy half-rep just loads the sloppiness and your elbows will tell you about it.'],
              ['How to add it', 'A dip belt is the best option — the weight hangs between your legs and does not affect your position. A dumbbell between the feet works but is easy to drop and shifts your balance. A weighted vest is convenient but caps out low. Start at 5kg, not 20.'],
              ['The rep ranges that work', 'Weighted: 4 sets of 5-8. That is the strength/size sweet spot for a loaded vertical pull. Once you hit 8 clean reps on all four sets, add the smallest increment available (2.5kg) and drop back to 5s. Slow, boring, and it works for years.'],
              ['The descent is where the growth is', 'Take 2-3 seconds to lower yourself, all the way to a full hang with the shoulders stretched. Most people drop under control on the first rep and freefall the rest, which throws away the most productive half of the movement.'],
              ['If you cannot do 10 yet', 'Do not jump to bands and never progress. Best progression: negatives (jump up, lower for 5 seconds) for 4-5 sets, plus heavy lat pulldowns in the 6-8 range, plus dead hangs for grip. Three weeks of that moves most people several reps.'],
              ['Where it sits in the session', 'First, always, before rows and before any arm work. It is the most technically demanding pull you do and it deserves your freshest effort — doing it after rows guarantees you under-perform it.'],
              ['Elbow and shoulder insurance', 'Weighted vertical pulling is hard on the elbows if the volume climbs fast. Keep total weighted sets modest, warm up with two light bodyweight sets, and if the inner elbow starts complaining, switch to neutral-grip (parallel handles) for a block — usually the whole fix.'],
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
              <h3 className="font-bold mb-2">One big leg day, one explosive leg day</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tuesday builds the size and the force you can produce — everything loaded, everything for mass.
                Thursday (see the Explosive tab) is where that force gets converted into speed. Splitting size and
                power onto separate days like this, rather than blending them, means neither one waters down the other.
              </p>
            </div>
            <Session
              title="Tuesday — Big Leg Day"
              tag="Max strength + size — the whole leg, one session"
              block="Heavy compound first with full recovery (3 min), then hypertrophy work in higher rep ranges. This is the longest session of the week by design — it is now the only dedicated leg-size day, so it earns the extra time."
              exercises={[
                { name: 'Back squat', sets: '4 × 5-6', targets: 'Quads · glutes · adductors · spinal erectors · trunk', how: "Bar on the upper traps, feet about shoulder-width with toes slightly out. Big breath, brace the trunk like you are about to be punched. Sit down and slightly back, knees tracking over the toes, until the hip crease passes below the knee if your mobility allows. Drive up through the whole foot — chest and hips rising together, not hips shooting up first.", why: 'Your foundational strength lift and the number to progress weekly. Sprint speed and jump height both track with relative squat strength.' },
                { name: 'Romanian deadlift', sets: '3 × 8-10', targets: 'Hamstrings · glutes · spinal erectors', how: "Start standing with the bar at hip height. Soft knees held at a constant angle — this is a hip hinge, not a squat. Push the hips straight back, bar dragging down the thighs, until you feel a strong hamstring stretch around mid-shin. Back stays flat throughout. Drive the hips forward to stand.", why: 'Hamstrings under a loaded stretch. The hamstrings decelerate your leg every stride at top speed, which is exactly where they tear.' },
                { name: 'Bulgarian split squat', sets: '3 × 8-10/leg', targets: 'Quads · glutes · adductors · balance', how: "Rear foot on a bench behind you, front foot far enough forward that your front shin stays near vertical. Drop straight down until the back knee is just off the floor. More forward lean hits glutes, more upright hits quads. The front leg does everything — the back leg is only balance.", why: 'Football happens on one leg. Single-leg strength transfers more directly to cutting, kicking and planting than any bilateral lift.' },
                { name: 'Hip thrust', sets: '4 × 8-10', targets: 'Glutes · hamstrings', how: "Upper back on a bench, bar across the hips with a pad. Feet planted so your shins are vertical at the top. Drive through the heels, squeeze the glutes hard and finish with the torso parallel to the floor — do not hyperextend the lower back to get higher. Chin tucked, ribs down.", why: 'Direct glute loading. Glutes are the primary engine of sprint acceleration, shot power and kick power — one of the highest-return lifts for a footballer.' },
                { name: 'Leg press or hack squat', sets: '3 × 10-12', targets: 'Quads · glutes', how: "Feet mid-platform, shoulder-width. Lower until your knees reach roughly 90 degrees or just past, without the lower back rounding off the pad — that round is where leg press injuries come from. Press back without locking the knees out hard at the top.", why: 'Pure quad size with the stabilising demand removed, so you can take it close to failure safely after the heavy squatting.' },
                { name: 'Nordic hamstring curl', sets: '3 × 6-8', targets: 'Hamstrings — eccentric strength', how: "Kneel with your ankles anchored under something solid or held by a partner. Body straight from knees to head, squeeze the glutes. Lower yourself forward as slowly as you possibly can, resisting the whole way, then catch with your hands and push back up. Even lowering 20-30 degrees under control is a working rep at the start.", why: 'The single most evidence-backed hamstring injury prevention exercise there is. Now only once a week rather than twice, so the extra sets here make up part of the difference — see the note below.' },
                { name: 'Copenhagen plank', sets: '3 × 20-30s/side', targets: 'Adductors (groin) · obliques', how: "Side-lying, top leg resting on a bench at the knee (easier) or ankle (harder). Lift your hips so the body forms a straight line, holding position with the inner thigh of the top leg. Start with the knee-supported version — the full ankle version is genuinely hard.", why: 'Adductor strength. Groin strains end football seasons, and this is the best prevention exercise available.' },
                { name: 'Standing calf raise', sets: '4 × 10-15', targets: 'Gastrocnemius', how: "Balls of the feet on a raised edge, knees straight. Drop the heels for a full stretch, pause a beat at the bottom, then drive up onto the toes and hold the top for a second. Straight knees are what target the gastroc rather than the soleus.", why: 'Stiff, springy ankles are free speed and protect against rolled ankles. Pause at the top, full stretch at the bottom.' },
                { name: 'Seated calf raise', sets: '3 × 12-15', targets: 'Soleus', how: "Seated with the pad over the knees, balls of the feet on the platform. Knees bent to 90 degrees is what shifts the work from the gastroc to the soleus. Full stretch at the bottom, hard squeeze at the top, slow throughout.", why: 'Seated targets the soleus, which the standing version misses. The soleus takes enormous load in running.' },
                { name: 'CORE — Anti-extension + anti-lateral flexion', sets: 'see Core tab', why: 'Hanging leg raises/ab wheel, then a suitcase carry or side plank. Both trunk functions live here now that there is only one leg day to attach them to.' },
              ]}
            />
            <Block title="Why one day instead of two" items={[
              ['Nothing here is being cut, just recombined', 'Every exercise from the old two-day split is still in the programme — Big Leg Day is genuinely long, and that is the point. It frees Saturday for rest, sport, or extra padel/football rather than a second gym session.'],
              ['The one real trade-off: Nordic frequency', 'Research protocols that roughly halve hamstring injury rates use Nordics twice a week. Dropping to once a week is still valuable, just not quite as protective — the extra set here (6-8 instead of 5) is a partial compensation, not a full one. If hamstring durability is a priority, the fix is doing a short second Nordic-only session (just 2-3 sets, 5 minutes) on a lighter day rather than reviving a whole second leg day.'],
              ['Will heavy legs make me slower? No', 'Strength is the foundation of power. What makes people slow is gaining weight while dropping the sprint and jump work that teaches the body to use it — which is exactly what Thursday exists to prevent.'],
              ['Strength first, then convert it', 'A stronger leg can produce more force. Thursday trains you to produce that force fast. Doing only one of the two is why people end up either strong and slow, or fast and fragile.'],
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
              title="Thursday — Explosive / Functional Leg Day"
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
              <h3 className="font-bold mb-2">Rotating core — why it is not the same thing five times</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trunk has four jobs: resist extension, resist rotation, resist sideways bend, and produce rotation.
                Sport needs all four. Visible abs also need actual muscle, which needs loaded reps in a hypertrophy
                range — not endless bodyweight crunches. This rotation covers every function across the week and gives
                the abs a dedicated growth slot.
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
              title="Tue (Big Leg Day) — Anti-extension + anti-lateral flexion"
              tag="Resist arching, resist sideways bend"
              open={false}
              block="After legs. Keeps the lower back out of work that belongs to the abs — both trunk functions now sit here since Big Leg Day absorbed the old Saturday session."
              exercises={[
                { name: 'Hanging leg raise', sets: '3 × 10-15', targets: 'Lower abs · hip flexors', how: "Hang from a bar, shoulders active. Curl the pelvis up toward your ribs rather than just lifting the legs — that posterior tilt is what makes it an ab exercise instead of a hip flexor swing. Lower slowly with no swinging. Bend the knees if straight legs are too hard.", why: 'Lower abs and hip flexors. Control the lowering — swinging turns it into a hip flexor swing with no ab work at all.' },
                { name: 'Ab wheel rollout', sets: '3 × 8-12', targets: 'Whole anterior core — anti-extension', how: "Start on your knees, wheel under the shoulders. Roll out keeping the ribs pulled down and the lower back flat — the moment your back arches, you have gone past your range. Only roll out as far as you can control and pull back with the abs, not the hips.", why: 'One of the highest ab-activation exercises measured. Keep the ribs down and the lower back flat throughout.' },
                { name: 'Side plank with reach-through', sets: '3 × 30-40s/side', targets: 'Obliques · QL — anti-lateral flexion', how: "Side plank on the forearm, body in a straight line, hips lifted high. Reach the top arm under your body, rotate slightly, then return and open back up. Hips must not sag toward the floor at any point.", why: 'Obliques and quadratus lumborum. Keeps you upright when someone leans into you mid-stride.' },
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
            <Fold title="Rotational Pallof — the full progression" tag="Anti-rotation → rotation, and how to actually do it" items={[
              ['Set up properly first', 'Cable or band at chest height. Stand side-on to it, feet shoulder-width, knees soft. Both hands gripping the handle at your sternum, elbows tucked. Squeeze your glutes, pull your ribs DOWN toward your hips, and breathe out. That rib-down position is the whole exercise — lose it and you are just holding a cable.'],
              ['1. Standard Pallof press — 3 × 30s/side', 'Press the handle straight out until your arms are locked. The cable is trying to rotate you; your job is to not let it. Hips and shoulders stay square to the front. Breathe normally through the hold — if you are holding your breath, the weight is too heavy.'],
              ['2. Pallof press-out with rotation — 3 × 8-10/side', 'Press out to full extension, then rotate your arms AWAY from the stack until they point straight ahead of you, pause a beat, and come back. Only the arms and upper trunk travel — the hips stay facing forward the whole time. This is the version most people mean by "rotational Pallof".'],
              ['3. Full rotational Pallof (hips follow) — 3 × 8/side', 'Same press-out, but now let the back hip and back foot pivot as you rotate, so the movement travels ground-up: foot, hip, torso, then arms. This is the actual sport pattern — a kick, a punch and a shot all sequence in exactly that order.'],
              ['4. Half-kneeling variation', 'Inside knee down, outside foot forward. Removes the ability to cheat with your legs, so the trunk does all of it. The hardest version for most people and the best one for learning what bracing actually feels like.'],
              ['5. Overhead Pallof — 3 × 20s/side', 'Press the handle straight overhead and hold. Brutal for the anti-lateral-flexion side of things and it exposes rib flare instantly — if your lower back arches as the arms go up, you have found your weak point.'],
              ['How to load it', 'Light. Genuinely light. This is a positional exercise, not a strength lift — you progress by holding position longer, moving slower, and stepping further from the stack (which increases the lever), not by adding plates until you are visibly leaning.'],
              ['The mistake that wastes the exercise', 'Letting the shoulders rotate while the hips rotate too, so nothing resists anything. If your whole body turns as one unit, the cable is doing no work. The tension you want is the twisting force being absorbed BETWEEN your hips and your ribs.'],
            ]} />

            <Fold title="Why your lower abs pooch out when you tense" tag="Top four visible, bottom bit still pushing forward" items={[
              ['Most likely cause: you are bearing down, not bracing', 'The big one, and it is a technique problem rather than a body-fat problem. Most people "tense" by pushing the abdominal wall outward — bearing down like a Valsalva. That literally forces your abdominal contents forward, so the lower belly protrudes exactly when you are trying to make it flat. A correct brace is 360° tension — front, sides and back tightening inward and around, with no forward push. Test it: exhale fully, pull your ribs down toward your hips, then tighten as if bracing for a punch WITHOUT letting your stomach move outward. If it moves out, that is the fault.'],
              ['Second cause: anterior pelvic tilt', 'If your pelvis is tipped forward, the whole lower abdomen is tipped forward with it — so the lower portion sits in front of the upper even at low body fat. It also lengthens and switches off the lower rectus and transverse abdominis, which is why that region feels like it will not engage. The fix is the posture work, not more crunches. See the Posture tab and Blueprint → Posture Routine.'],
              ['Third cause: rib flare and a lost stack', 'Ribs pulled up and flared means your ribcage and pelvis are not stacked over each other, so you cannot generate proper intra-abdominal pressure. You end up with a visible upper block of abs and a soft, unsupported lower section. Getting ribs down over hips changes the shape of the midsection immediately, with no fat loss involved.'],
              ['Fourth cause: lower abdominal fat genuinely goes last', 'Unavoidable and partly genetic. The lower abdomen and the area just above the hips hold subcutaneous fat longest in most men. It is completely normal to have a clear top four around 12-13% body fat and still need to get to roughly 9-10% before the bottom two and the lower section flatten out. This is the honest part: if you have done the bracing and posture work and it is still there, it is fat, and the only lever is a longer patient deficit — you cannot spot-reduce it.'],
              ['Fifth cause: distension, not fat at all', 'If it varies through the day — flat in the morning, pushing out by evening — that is gut contents and water, not fat. Trace it to food volume, fizzy drinks, high sodium, dairy or fibre load. Same shape, completely different cause, and it responds within days rather than months. See the Debloat protocol in the Blueprint.'],
              ['What to actually train for it', 'Movements that make the pelvis tuck UNDER, since that is the lower rectus\'s real job: reverse crunches, hanging leg raises where you deliberately curl the pelvis toward the ribs rather than just lifting the legs, and dead bugs done slowly with the lower back flat. Add stomach vacuums for the transverse abdominis, which is the muscle that actually pulls the waist inward. Endless normal crunches train the part you can already see.'],
              ['One thing worth ruling out', 'If you can feel a gap down the midline when you tense, or the bulge is a distinct ridge up the centre rather than a general softness, that can be a separation of the connective tissue down the middle. Uncommon in young men who have not carried heavy loads badly, but if that is what you are seeing it is worth a physio looking at rather than training harder through it.'],
            ]} />

            <Block title="The honest bit about visible abs" items={[
              ['Training grows them, diet reveals them', 'You can build genuinely thick abs and still not see one of them at 18% body fat. Both halves are required, and they are separate jobs.'],
              ['Roughly 10-12% body fat for a clear four, lower for six', 'Individual and largely genetic in terms of where you store fat and how your abs are shaped. Training makes them thicker; it cannot change their arrangement.'],
              ['Do not train abs daily', 'They recover like any other muscle. Five short, varied, quality sessions across the week is more than enough — the rotation above is deliberately not the same thing every time.'],
            ]} />
          </div>
        )}

        {/* ===== RECOVERY ===== */}
        {tab === 'recovery' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">Recovery is the programme</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Training is the stimulus. Every bit of the actual adaptation — muscle, strength, speed, skill —
                happens while you recover. At six sessions a week plus sport, recovery stops being optional
                maintenance and becomes the thing that decides whether any of it works. Ranked below by how much
                each actually matters.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/15 to-[#111] border border-emerald-500/30 rounded-2xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300/70 mb-3">The big four — in order</p>
              <div className="space-y-3">
                {[
                  ['Sleep — 8-9 hours', 'Nothing else on this list comes close. Growth hormone peaks in deep sleep, muscle protein synthesis and CNS recovery both depend on it, and a week of 6-hour nights measurably reduces strength and increases injury risk. If you are training six days and sleeping six hours, fix the sleep before you change anything in the gym.'],
                  ['Protein — 1.6-2.2g per kg bodyweight', 'The raw material. Spread it across 3-4 meals of roughly 30-40g rather than one huge hit, since the response to a single dose plateaus. At 75kg that is around 120-165g a day, every day, including rest days.'],
                  ['Total calories', 'You cannot recover from six sessions in a meaningful deficit. Building muscle needs a surplus of roughly 300-500 kcal; maintaining while training this hard needs at least maintenance. Chronic under-eating shows up as stalled lifts, poor sleep and constant niggles long before it shows up on the scale.'],
                  ['Deloads — every 6-8 weeks', 'One week at roughly 60% of normal volume, keeping the weights similar. Fatigue accumulates faster than you notice, and a planned deload is how you avoid the unplanned one where something tears. Non-negotiable at this frequency.'],
                ].map(([t, d], i) => (
                  <div key={t} className="flex gap-3">
                    <span className="text-emerald-400/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-200">{t}</p>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Block title="Around your sessions" items={[
              ['Carbs before and after training', 'Glycogen is the fuel for both lifting and sprinting. Training depleted is why some sessions feel inexplicably heavy. Carbs before, carbs after, and more of them on your leg and explosive days.'],
              ['Protein timing matters less than total', 'The "anabolic window" is far wider than the old 30-minute rule. Getting your daily total is what counts — though protein within a couple of hours either side of training is a sensible default.'],
              ['Hydration the day before, not just during', 'Even mild dehydration reduces strength output and makes everything feel harder. Turning up already low is a self-inflicted bad session.'],
              ['Walk on rest days', '20-40 minutes of easy walking increases blood flow without adding fatigue. It genuinely speeds recovery, unlike lying completely still all day.'],
              ['Do not train through sharp pain', 'Muscle soreness is fine to train around. Sharp, localised or joint pain is information — training through it turns a two-week problem into a three-month one.'],
            ]} />

            <Fold title="What actually works — ranked honestly" tag="Most recovery products are not worth the money" items={[
              ['Sleep, food, deloads', 'Roughly 90% of your recovery. Everything below is fine-tuning at the margins, and none of it compensates for getting these wrong.'],
              ['Sauna — decent evidence', 'Regular heat exposure is associated with cardiovascular benefits and may aid recovery and heat adaptation. Pleasant, low risk, genuinely worth doing if it is available. Not a substitute for sleep.'],
              ['Massage / foam rolling — real but short-lived', 'Reduces perceived soreness and briefly improves range of motion. The effect on actual tissue recovery is small. Worth it because feeling better makes you train better, not because it repairs muscle.'],
              ['Cold water immersion — useful, with a big caveat', 'Good for reducing soreness and for recovering between events on the same day. BUT taken straight after lifting it appears to blunt the muscle-growth signal. Use it after football or a match, not after your hypertrophy sessions — or leave 4+ hours.'],
              ['Compression garments, massage guns — mild', 'Small effects on perceived soreness, minimal on performance. Harmless, just do not expect much and do not pay a lot.'],
              ['Static stretching after training — neutral', 'Does not reduce soreness meaningfully and does not prevent injury. Do it if you want mobility gains; do not do it expecting recovery.'],
              ['Ice baths for everything, always', 'The most over-applied tool in the gym. Timing determines whether it helps or actively works against the training you just did.'],
            ]} />

            <Block title="Reading your own fatigue" items={[
              ['Resting heart rate on waking', 'A consistent rise of 5-10 bpm over your normal for several days usually means accumulated fatigue or illness coming. Cheapest useful metric there is — check it before you get out of bed.'],
              ['Sleep quality falling', 'Counter-intuitively, being genuinely overreached often wrecks sleep rather than improving it. Waking at 3am when you are training hard is a warning sign, not bad luck.'],
              ['Numbers stalling across multiple lifts', 'One lift stalling is normal. Three or four stalling in the same week is systemic fatigue, not a programming problem — do not respond by adding volume.'],
              ['Motivation gone', 'Not wanting to train, for more than a couple of days, in someone who normally does, is a physiological signal as much as a psychological one.'],
              ['The rule', 'Any two of the above at once means deload NOW rather than in three weeks. Taking four easy days deliberately is always cheaper than being forced to take three weeks off.'],
            ]} />

            <Block title="Recovering from sport on top of lifting" items={[
              ['Count your sport as training', 'A football match is roughly a hard leg session plus conditioning. If you played Saturday, going straight into a full Big Leg Day fully fatigued is not brave, it is a mistake. Move it or cut the volume.'],
              ['Match day plus 48 hours', 'Leave at least two days between a match or hard sparring and your heavy leg or explosive day. That is when hamstring injuries happen.'],
              ['Hard days hard, easy days easy', 'If both a sport session and a lift must happen, do them on the SAME day and keep the next day genuinely easy. Two moderately hard days in a row is worse recovery than one very hard day plus a real rest day.'],
              ['In-season, cut volume not intensity', 'Keep the weights heavy and drop the number of sets by about a third. You maintain strength on far less volume than you needed to build it.'],
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
