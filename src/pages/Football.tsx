import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, Target, Users, Activity, ChevronDown, Trophy } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'speed' | 'shooting' | 'skills' | 'position' | 'setpieces' | 'physical' | 'gym';

const TABS: { id: Tab; label: string }[] = [
  { id: 'speed', label: 'Speed' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'skills', label: 'Every Metric' },
  { id: 'position', label: 'By Position' },
  { id: 'setpieces', label: 'Set Pieces' },
  { id: 'physical', label: 'Physicality' },
  { id: 'gym', label: 'Gym' },
];

function Block({ title, items, accent = 'text-emerald-300' }: { title: string; items: [string, string][]; accent?: string }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className={`font-bold mb-3 ${accent}`}>{title}</h3>
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
          <p className="text-xs text-emerald-400/70 mt-0.5">{tag}</p>
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

export default function Football() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['speed', 'shooting', 'skills', 'position', 'setpieces', 'physical', 'gym'] as const).includes(t as Tab) ? (t as Tab) : 'speed';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-emerald-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <Trophy className="text-emerald-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Football</h1>
            <p className="text-gray-500 text-sm">Speed · Shooting · Skills · Position Mastery</p>
          </div>
        </div>

        <DailyHabits section="football" />

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== SPEED ===== */}
        {tab === 'speed' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Sprint Mechanics — free speed" items={[
              ['Acceleration posture (0-10m)', 'Lean forward 45° from the ankles, drive the ground BACK behind you with big punching steps. Chest over knee. Standing up too early kills acceleration.'],
              ['Arm drive', 'Elbows at ~90°, hands from cheek to back pocket, driven HARD. Arms set the rhythm — sloppy arms = slow legs. Never let hands cross the body\'s midline.'],
              ['Max velocity posture (20m+)', 'Now tall: hips high, core braced, ground contact directly under your hips, ankle stiff like a spring. Overstriding out front is braking with every step.'],
              ['Relax at speed', 'Jaw loose, shoulders down, hands unclenched. Straining tightens muscles that should be cycling — sprinters call it "fast and loose".'],
            ]} />
            <Block title="Speed Training Week (in-season friendly)" items={[
              ['Day 1 — Acceleration', '6-8 × 20m sprints from different starts (lying, side-on, rolling) — full recovery between reps (walk back slowly, 2-3 min). Quality over volume: sprinting tired trains slowness.'],
              ['Day 2 — Max velocity', '4-6 × 40m build-ups: accelerate 20m, FLY the next 20m at 100%. Full recovery. Once a week at true 100% makes you faster; never at 100% year-round without buildup.'],
              ['Gym (2×/week)', 'Heavy half squats or trap bar deadlifts 4×4, hip thrusts 4×6, weighted step-ups, plyometrics (bounds, hurdle hops, depth jumps 3×5). Strength × elasticity = sprint speed.'],
              ['Nordic curls — non-negotiable', '3×5 twice a week. Hamstring injuries end seasons; Nordics cut the risk roughly in half AND make you faster.'],
              ['Technique drills as warm-up', 'A-skips, B-skips, wall drives, high knees with dorsiflexed ankles — 10 min before every session. Mechanics are trained, not born.'],
            ]} />
            <Block title="Game Speed ≠ Track Speed" items={[
              ['First 5 metres wins football', 'Most sprints in a match are under 20m. Train explosive starts and reactive accelerations (react to a ball drop or call) more than long sprints.'],
              ['Change of direction', '5-10-5 shuttle, cone weaves at full intent. Decelerate by dropping the hips and chopping steps — braking ability IS agility.'],
              ['Sprint off the ball', 'Speed shows up in runs in behind, recovery runs, pressing. Anticipation (see Skills tab: scanning) makes you "play faster" than your 40m time.'],
            ]} />
          </div>
        )}

        {/* ===== SHOOTING ===== */}
        {tab === 'shooting' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Striking Technique — the fundamentals" items={[
              ['Plant foot decides everything', 'Beside the ball (not behind it), pointing at your target, knee slightly bent. Plant foot too far away = slice; too close = scuff. This is 70% of bad shots.'],
              ['Lock the ankle', 'Toes down, ankle rigid as bone at contact. A floppy ankle leaks power. Strike with the hard bone of the instep (laces), not the toes.'],
              ['Hit through the middle', 'Contact the centre or just above centre of the ball for driven low shots. Under the centre = balloon. Head steady, eyes ON the ball at contact — look up before, not during.'],
              ['Follow through at the target', 'Your kicking leg finishes pointing where the ball should go, landing on your shooting foot. Stopping the swing at contact = weak shot.'],
            ]} />
            <Block title="The Finishing Toolbox" items={[
              ['Placed finish (side foot)', 'Inside of the foot, pass it into the corner. Low and across the keeper into the far corner is the highest-percentage finish in football. Placement > power inside the box.'],
              ['Driven finish (laces)', 'For edge-of-box and cutbacks. Low, hard, through the ball. Keepers save high shots at their height; low drives to the corners are hardest to reach.'],
              ['One-touch finish', 'Open your body early, decide the corner BEFORE the ball arrives, guide it with pace already on the ball. Don\'t over-hit — redirect.'],
              ['Chip / dink', 'When the keeper rushes: stab under the ball with a short jab, no follow-through. Look for keepers off their line as your first scan in the box.'],
              ['Volley', 'Get over the ball, knee over it at contact, short compact swing. Trying to smash volleys = row Z. Guide first, power comes with timing.'],
              ['1v1 with keeper', 'Three options in order: go around them (touch past as they plant), slot low far corner as they set, chip if they charge low. Decide early, never let them set the tempo.'],
            ]} />
            <Block title="Shooting Practice Protocol (2×/week, 30 min)" items={[
              ['Reps with intent, both feet', '25 placed finishes each corner (weak foot too), 15 driven, 10 one-touch off a rebound/pass, 10 1v1 dribble-and-finish. Track your numbers weekly — what\'s measured improves.'],
              ['Game-realistic', 'Always shoot after movement: a touch out of your feet, a turn, a sprint onto a pass. Standing still shots don\'t transfer.'],
              ['Fatigue finishing', 'End sessions with 5 finishes after a 30m sprint. Matches are decided by finishing while gassed — train it.'],
            ]} />
          </div>
        )}

        {/* ===== EVERY METRIC ===== */}
        {tab === 'skills' && (
          <div className="fade-up stagger space-y-3">
            <Fold title="First Touch" tag="The metric that decides your level" items={[
              ['Wall work — 100 touches/day', 'Pass against a wall: control with inside, outside, sole, thigh, chest. Alternate feet. First touch OUT of your feet into space, never dead under you.'],
              ['Cushion vs push', 'Cushion (soft, absorb) when marked tight; push (firm first touch into space) when you have room. Decide before the ball arrives.'],
              ['Touch with a plan', 'Your first touch should already be your first move: away from pressure, toward goal, or into your passing angle.'],
            ]} />
            <Fold title="Scanning & Positioning" tag="Play faster without being faster" items={[
              ['Check your shoulders every 3 seconds', 'Elite midfielders scan 6-8 times per 10 seconds. Before every ball you receive: one look left, one right. You\'ll always know your next pass before the ball arrives.'],
              ['Body shape', 'Receive side-on (half-turn) so you can see both the ball and the pitch. Receiving flat-footed facing the passer kills your options.'],
              ['Find the pockets', 'Position between opposition lines, in their blind spots. If a defender can see you and the ball at once, move.'],
            ]} />
            <Fold title="Passing" tag="Weight and timing beat Hollywood balls" items={[
              ['Weight of pass', 'The pass should arrive so your teammate doesn\'t break stride. Underweighted = intercepted; overweighted = touch ruined. Practice to moving targets.'],
              ['Play the way you face — mostly', 'One-touch back when pressed, turn when you\'ve scanned and know you have time. The turn decision comes from scanning, not hope.'],
              ['Disguise', 'Look one way, pass the other; open your hips late. One disguised pass a match changes how defenders treat you all game.'],
            ]} />
            <Fold title="Dribbling & 1v1s — Fundamentals" tag="Beat your man on demand" items={[
              ['Two touches per stride at speed', 'Close control drills daily: cone weaves, figure-8s, both feet, head up on every third touch.'],
              ['One move mastered > ten known', 'Pick a go-to (body feint, chop, or push-and-go) and drill it until it works at full speed under pressure. Add a counter-move once defenders expect it.'],
              ['Attack the front foot', 'Dribble AT the defender\'s leading foot, shift as their weight commits, explode past. Speed change beats trick complexity — slow-slow-FAST.'],
              ['Change of pace beats change of direction', 'The defender reacts to your speed change more than your angle change. Slow their momentum down with small touches, then explode — the explosion IS the move, the trick just sets it up.'],
              ['Keep the ball on your strong side', 'Close control means the ball stays on the foot furthest from the defender as you run past them — if it\'s on your near foot, they can poke it away even after you\'ve beaten them.'],
            ]} />
            <Fold title="Named Skill Moves — the toolbox" tag="Learn these in order, drill each to failure before adding the next" items={[
              ['The Step-Over', 'Circle your foot OVER the ball without touching it, hips and shoulders selling the fake direction, then push off the other way with your other foot. The sell is in the hips, not the foot — a step-over with square hips fools nobody.'],
              ['The Body Feint (Matthews)', 'Shift your whole body weight onto one foot as if pushing the ball that way, defender\'s weight commits — then push the ball the OPPOSITE direction with the outside of the same foot. No extra touch needed, which is why it works even under tight pressure.'],
              ['La Croqueta', 'Drag the ball hard across your body from one foot to the other in a single sweeping motion, changing the ball\'s angle instantly while your body stays running in a straight line. Devastating in tight spaces because it needs zero backswing or space.'],
              ['The Cruyff Turn', 'Show a pass or cross, then at the last second drag the ball behind your standing leg with the inside of your foot and spin away in the opposite direction. Best used when a defender is showing you outside and expecting you to cross.'],
              ['The Nutmeg (Panna)', 'Push the ball through the defender\'s open legs and collect it the other side. Works best when they\'re square-on with feet apart (committing to a block or tackle) — never force it on a defender in a good side-on stance, you\'ll just lose the ball.'],
              ['The Chop (Ronaldo Chop)', 'At speed, plant your standing foot and use the inside of your other foot to chop the ball sharply back across your body at an angle, changing direction almost 90° without losing pace. Great for cutting inside from the wing.'],
              ['The Roulette (Marseille Turn)', 'Trap the ball between your feet, spin your body a full 360° using the sole of one foot to drag the ball round with you, coming out the other side facing a new direction. Use it under pressure from behind — it takes the ball away from a chasing defender\'s reach.'],
              ['The Elastico (Flip-Flap)', 'Push the ball outward with the outside of your foot, then instantly whip it back inside with the same foot before it\'s touched the ground — a fast outside-in snap. High skill ceiling; drill it slow for weeks before trying it at match speed.'],
              ['The Fake Shot (Shooting Feint)', 'Wind up like a full shot, plant hard, but stop the swing and push the ball past the defender who\'s flinched/committed to blocking. Works because defenders are trained to react to shooting motion instinctively.'],
            ]} />
            <Fold title="When & Where to Use Each Move" tag="A move is a tool, not a trick — match it to the situation" items={[
              ['Isolated 1v1, space in behind', 'Body feint or chop — you need a move that changes direction AND keeps your speed, since you\'re about to sprint into space.'],
              ['Tight/crowded areas, no space to run into', 'La Croqueta or nutmeg — moves that create a new passing/dribbling angle without needing room to accelerate.'],
              ['Defender showing you the outside (want you to cross)', 'Cruyff turn — punishes exactly this defensive setup by cutting back inside where they didn\'t expect.'],
              ['Being chased from behind', 'Roulette — the spin shields the ball with your whole body as you turn, taking it out of a trailing defender\'s reach.'],
              ['Defender rushing in to block a shot', 'Fake shot — the more committed their block-attempt body language, the more this works.'],
              ['Practice progression', 'Master body feint + chop first (lowest risk, highest success rate) before investing serious hours in elastico or roulette — the fancier moves are for adding a weapon, not for replacing the basics.'],
            ]} />
            <Fold title="Weak Foot" tag="From liability to weapon in 8 weeks" items={[
              ['Daily minimum', '50 wall passes + 20 finishes weak-foot only. Start close and slow, add power weekly.'],
              ['Force it in games', 'One training match a week where you only use the weak foot. Awkwardness now = fluency in two months.'],
            ]} />
            <Fold title="Stamina & Repeat Sprints" tag="Still sharp in the 90th" items={[
              ['Interval base (2×/week)', '4×4 min hard runs (80-90% effort) with 3 min jog recovery, or 10×30s sprint/30s walk. Football fitness is repeated efforts, not marathon pace.'],
              ['Repeat sprint ability', '6×30m sprints with only 20s rest, 2 sets. Horrible, and exactly what the last 15 minutes of a match feels like.'],
              ['The engine multiplier', 'Sleep 8h+ and fuel with carbs before matches — fitness you don\'t recover from doesn\'t exist. Hydrate the DAY BEFORE, not just at kickoff.'],
            ]} />
            <Fold title="Heading & Physicality" tag="Win your duels" items={[
              ['Attack the ball', 'Eyes open, neck tensed, strike with the forehead at the hairline, through the ball. Being hit by the ball = whoever attacked it wins.'],
              ['Timing over height', 'Jump off one foot with a run-up, arms up for leverage (not pushing). Late jump beats early jump — watch the flight, then go.'],
              ['Use your frame', 'Shield with your body side-on, arm feeling the defender, low centre of gravity. The gym section builds this — squats and trap-bar deads translate directly.'],
            ]} />
          </div>
        )}

        {/* ===== BY POSITION ===== */}
        {tab === 'position' && (
          <div className="fade-up stagger space-y-3">
            <Fold title="Striker (ST)" tag="Goals are movement + composure" items={[
              ['Master the blind-side run', 'Start your run when the passer\'s head goes down, curve it to stay onside, attack the space BEHIND the centre-back\'s shoulder.'],
              ['Live on the last line', 'Constant small movements — pin, spin, drop short — never static. Defenders switch off after 3 quiet minutes; that\'s when you kill.'],
              ['Two-touch maximum in the box', 'Touch, finish. Study your keepers: near-post drives, far-post placed. Your job is 5 great actions a game, not 60 touches.'],
            ]} />
            <Fold title="Winger" tag="1v1s and end product" items={[
              ['Isolate then commit', 'Stay wide and high to drag your fullback 1v1. When you receive: first touch positive, attack their front foot, decide cross/cut inside within two touches.'],
              ['End product obsession', 'Beating your man means nothing without the cutback, the far-post cross, or the shot. Track assists+goals per game — that\'s your currency.'],
              ['Defend forward', 'Press their fullback\'s first touch; a winger who wins the ball high creates the easiest chances in football.'],
            ]} />
            <Fold title="Attacking Mid (CAM)" tag="Play between the lines" items={[
              ['Receive half-turned in pockets', 'Find space between their midfield and defence. Scan constantly — you get 1.5 seconds max in there.'],
              ['The final pass', 'Through-balls timed to the runner\'s stride, not to space. Watch the run start, weight it to arrive as they cross the line.'],
              ['Arrive late in the box', 'Second-wave runs to the penalty spot when wingers reach the byline — the most unmarked zone in football.'],
            ]} />
            <Fold title="Central / Defensive Mid (CM/CDM)" tag="Control the game's tempo" items={[
              ['Scan more than anyone', 'Your job is knowing the whole pitch. Check shoulders before EVERY touch. Play one- and two-touch when pressed, carry when there\'s grass.'],
              ['Screen the centre-backs', 'Stay goal-side of their striker/CAM, cut passing lanes with your positioning, intercept more than you tackle.'],
              ['Switch the play', 'One accurate 40-yard diagonal per half undoes 10 minutes of their pressing. Practice long passing weekly.'],
            ]} />
            <Fold title="Fullback (LB/RB)" tag="The most athletic position on the pitch" items={[
              ['Defend 1v1 patiently', 'Don\'t dive in. Side-on stance, show them their weak foot, jockey until support arrives or they make the mistake.'],
              ['Time the overlap', 'Go when your winger cuts inside — arrive at full speed into the space they vacated. Repeat sprint training lives here.'],
              ['Body shape on switches', 'Open your body to see winger AND ball when play is on the far side. The far-post ghost run at the back stick punishes lazy fullbacks — don\'t be one, become one going forward.'],
            ]} />
            <Fold title="Centre-Back (CB)" tag="Defend the space, then the man" items={[
              ['Starting position wins duels', 'Goal-side, ball-side, close enough to touch your striker when the ball comes in. Recovery runs go to the near post first.'],
              ['Front-foot or drop — decide early', 'Ball played into feet = tight and aggressive. Ball over the top threat = drop early. In-between defending is how you get roasted.'],
              ['First pass out', 'Modern CBs launch attacks: break the first press line with a pass or a 10m carry. Composure on the ball doubles your value.'],
            ]} />
            <Fold title="Goalkeeper (GK)" tag="Positioning saves more than reflexes" items={[
              ['Set position at every shot', 'Feet set, weight forward, hands ready at hip height BEFORE they strike. Moving keepers get beaten at their feet.'],
              ['Angles over acrobatics', 'Bisect the angle between ball and posts; a keeper in the right spot makes saves look easy. Top corners are conceded, everything else is positioning.'],
              ['Command your box', 'Claim crosses with a loud early call, punch when crowded. Distribution: throw fast to feet, find the free fullback — you\'re the first playmaker.'],
            ]} />
          </div>
        )}

        {/* ===== PHYSICALITY ===== */}
        {tab === 'physical' && (
          <div className="fade-up stagger space-y-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
              <p className="text-xs text-emerald-200/85 leading-relaxed">
                Haaland and Khusanov don't dominate because they lift the most — they dominate because of
                <span className="text-emerald-300 font-bold"> mass × strength × timing × technique</span>, in that order of neglect.
                Most players only train the second one. This tab covers all four.
              </p>
            </div>
            <Block title="The honest truth about bullying people" items={[
              ['Bodyweight is the floor you can\'t skip', 'Physics doesn\'t negotiate. A strong 65kg player still gets moved by an average 85kg one. If you\'re light, gaining well-built mass is the single biggest upgrade available to you — bigger than any technique on this page.'],
              ['Haaland\'s real advantage is mass that MOVES', '195cm and ~88-90kg, but sprinting near-elite speed. That combination — heavy AND fast — is what makes him unplayable. Getting big and slow is a downgrade; getting big while keeping your speed work in is the goal.'],
              ['Khusanov wins duels with timing, not just power', 'Watch him: he initiates contact first, from a low, stable base, and gets his body in front BEFORE the ball arrives. Half of "strength" in football is arriving in the right body position a half-second earlier.'],
              ['Whoever initiates contact wins', 'The player who braces and delivers contact from a set base beats the player receiving it, almost every time — regardless of who\'s stronger on paper. Being passive in a duel is how strong players still get bodied.'],
              ['Strength you can\'t use is decoration', 'A big squat doesn\'t transfer automatically. You have to practise contact: shoulder-to-shoulder drills, shielding under pressure, jostling in training. Gym builds the engine; duels teach you to drive it.'],
            ]} />
            <Block title="Building the frame — getting bigger" items={[
              ['Eat in a surplus, properly', '300-500 kcal above maintenance daily. Most footballers chronically undereat and wonder why they never fill out. If your weight isn\'t moving on the scale, you are not in a surplus — no matter what you think you ate.'],
              ['Protein: 1.6-2.2g per kg bodyweight', 'This is what turns training into muscle rather than just fatigue. Spread across 3-4 meals. This number matters more than any supplement you could buy.'],
              ['Target 0.25-0.5kg per week', 'Faster than that and you\'re mostly adding fat, which costs you speed. Weigh yourself weekly (same time, same conditions) and adjust food up or down from there.'],
              ['Don\'t fear the scale going up', 'A well-built 80kg beats a lean 68kg in every duel, and if you keep sprinting and jumping in your training you won\'t lose speed — the gym section is built to add mass without making you slow.'],
              ['Sleep 8h+ or none of it works', 'Growth happens in recovery. Undersleeping while eating in a surplus mostly makes you fatter, not stronger.'],
            ]} />
            <Block title="The lifts that build a body people bounce off" items={[
              ['Trap bar deadlift or back squat — 4×5', 'Your base of total-body force. Everything else in this list is built on top of this number going up.'],
              ['Hip thrust — 3×6-8', 'The collision muscle. Glutes drive acceleration, jumping, and the force you deliver through a shoulder in a duel.'],
              ['Weighted carries (farmer\'s + suitcase) — 3×40m', 'The most underrated exercise for football physicality. Carrying heavy load while staying upright IS shielding the ball. Suitcase carries (one side only) train exactly the anti-lean strength you need when someone leans on you.'],
              ['Bulgarian split squat — 3×6-8/leg', 'Duels happen on one leg. Single-leg strength under load is what stops you getting knocked off balance mid-stride.'],
              ['Neck work — 3×15', 'Non-negotiable for aerial dominance. A strong neck means more power through a header and staying upright through contact. Almost no amateur player trains this — it\'s free separation.'],
              ['Bench press + overhead press — 4×5-6', 'Upper body strength for arm-barring, holding someone off, and winning the shoulder battle. Pressing strength is how you create space with your arms legally.'],
              ['Rows + weighted pull-ups — 4×6', 'Back strength for shielding, pulling, and holding position when someone is climbing all over you.'],
              ['Med ball rotational throws — 4×5/side', 'Explosive rotational power — the difference between a soft shoulder barge and one that genuinely moves someone.'],
            ]} />
            <Block title="How to actually use your body in a duel" items={[
              ['Get side-on and low', 'Never square-on and upright — that\'s a body waiting to be moved. Turn sideways, bend the knees, wide base, weight low. A low centre of gravity is worth 10kg of bodyweight.'],
              ['The arm bar', 'Forearm across their chest (not a push — a frame), feeling exactly where they are. Legal, and it lets you control their distance while keeping your eyes on the ball.'],
              ['Feel them, don\'t look at them', 'Use your back and arm to sense their position while your eyes stay on the ball. Turning to look is how you lose the ball and the duel simultaneously.'],
              ['Back into them BEFORE the ball arrives', 'Establish contact and your position early. Arriving at the same time as the ball means you\'re reacting; arriving before it means they are.'],
              ['Roll them using their own momentum', 'When they lean into you hard, spin off that side — their force becomes the thing that takes them out of the play. This is how smaller players beat bigger ones.'],
              ['Shielding: body between ball and defender', 'Far foot on the ball, body square across their path, arm out for space, knees bent. Held properly, this is nearly impossible to defend legally.'],
              ['Explode on first contact, not after', 'The instant you feel them, drive through — don\'t absorb the hit and then try to recover. Accepting contact passively is losing in slow motion.'],
            ]} />
            <Block title="Aerial dominance — winning everything in the air" items={[
              ['Timing beats height, every time', 'Watch the flight, then go. The late jumper wins because they\'re rising as the early jumper is falling. Most headers are lost by jumping too soon, not by being too short.'],
              ['One-foot jump with a run-up', 'Always more height than a two-foot standing jump. Even one or two steps of run-up transforms your reach.'],
              ['Get in front and back into them', 'Body position wins headers before anyone jumps. Establish yourself in front of your marker, feel them with your back, then attack the ball.'],
              ['Use your arms for leverage', 'Arms up and out creates space and helps you rise — legal as long as you\'re not pushing off. Every dominant header does this.'],
              ['Attack the ball, don\'t let it hit you', 'Neck tensed, eyes open, strike through it at the hairline. Whoever attacks the ball wins the duel; whoever waits for it gets beaten and often hurt.'],
              ['Neck strength = header power', 'This is where your neck training pays off — power through a header comes from the neck and trunk snapping through contact, not just the jump.'],
            ]} />
            <Block title="Defending physically — the Khusanov side" items={[
              ['Win the first contact', 'As the ball travels to a striker, make contact early and get touch-tight. A striker who receives with you already leaning on them has no time and no options.'],
              ['Shoulder-to-shoulder is legal, arms are not', 'You can barge shoulder-to-shoulder when contesting the ball. What gets penalised is arms extended, hands pushing, or contact with no attempt to play the ball. Learn that line and live right on it.'],
              ['Read, don\'t lunge', 'Diving in is how strong defenders get embarrassed. Stay side-on, jockey, show them their weak side, and use your strength when the ball is genuinely winnable.'],
              ['Front-foot defending', 'When the ball goes into a striker\'s feet, be aggressive and tight. When there\'s a ball over the top, drop early. Getting caught in between is what makes defenders look slow.'],
              ['Recovery pace covers mistakes', 'Strength without pace gets exposed by any quick forward. Keep the sprint work in the Speed tab going — being big AND fast is what makes Khusanov work.'],
              ['Be relentless, not reckless', 'Constant physical presence across 90 minutes wears strikers down mentally. Late in games they stop wanting the ball. That\'s the real win.'],
            ]} />
            <Block title="Slotting this into your week" items={[
              ['3 gym sessions minimum', 'Two heavy lower/full-body sessions plus one upper. See the Gym tab for the full structure — that programme is already built for this.'],
              ['Carries and neck every session', 'They\'re quick, they\'re the ones everyone skips, and they\'re the ones that show up most in duels. Two minutes each, non-negotiable.'],
              ['Practise contact in training', 'Ask for 1v1 shielding drills, back-to-goal work, and aerial duels in training. Gym strength that never meets a real opponent stays theoretical.'],
              ['Keep sprinting while you bulk', 'Sprint and jump work is what stops added mass turning into slowness. Never drop the speed work during a gaining phase.'],
              ['Give it 3-6 months', 'Meaningful mass and strength changes take a season, not a month. Track weight, main lifts, and how duels actually feel — all three should trend up together.'],
            ]} />
          </div>
        )}

        {/* ===== SET PIECES ===== */}
        {tab === 'setpieces' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Corners" items={[
              ['Inswinger vs outswinger', 'Inswinger (curling toward goal, kicked with the foot on the same side as the corner flag) is more dangerous because it moves toward goal even if flicked — most professional corners are inswingers for this reason.'],
              ['Target the front-post run', 'A near-post flick-on from a fast attacker creates chaos defenders can\'t react to — deliver it low and hard to the front post rather than a lazy floated ball to the back post.'],
              ['Near-post, far-post, and the penalty spot', 'Three zones defenders must cover — overload one with 2-3 attackers making staggered runs (not all arriving at once) to create a free header somewhere.'],
              ['Short corners break set defences', 'A quick pass to a nearby teammate drags a marker out and creates a passing/crossing angle a set defence hasn\'t prepared for — use it occasionally to keep defenders honest.'],
              ['Attack the ball, don\'t wait for it', 'Time your run to meet the ball at its highest point with a running jump, not a standing one — attacking the flight beats defenders who are set and waiting.'],
            ]} />
            <Block title="Free Kicks" items={[
              ['Direct free kick technique — the wrap', 'Approach on a slight curve (not straight-on), strike with the inside of the foot low on the ball to generate topspin/sidespin that dips it over the wall and down under the bar.'],
              ['The knuckleball (no-spin driven shot)', 'Strike with minimal spin using the top of the laces dead-centre through the ball — the lack of spin makes it move unpredictably in the air, a genuine goalkeeper nightmare when mastered.'],
              ['Wall gap and near-post routines', 'A short pass to the side of the wall into a runner exploits the gap defences must leave for the "wall" player watching the far post — practice this as a genuine set play, not an afterthought.'],
              ['Indirect free kicks near the box', 'Set up a low, first-time strike from the edge of the box off a short lay-off — the keeper and wall are set for a direct strike and are often slow to react to the second touch.'],
              ['Placement over power, inside 25 yards', 'Corners of the goal, especially low into the corner the keeper\'s momentum is moving away from, convert more often than raw power straight down the middle.'],
            ]} />
            <Block title="Penalties" items={[
              ['Pick your corner before you run up', 'Decide your placement in advance and commit fully — keepers read late hip/foot hesitation better than they read direction, so a confidently placed "wrong" corner beats an indecisive "right" one.'],
              ['Placement over power', 'Low into a corner beats blasting down the middle — most penalty misses are from over-hitting a shot the keeper never had the reaction time to reach anyway.'],
              ['Consistent run-up, no stutter unless practiced', 'A stutter-step run-up (waiting for the keeper to commit) is a real technique but needs hours of practice — if you haven\'t drilled it, a standard confident run-up beats an improvised one.'],
              ['Ignore the keeper\'s movement', 'Once you\'ve committed to a corner, follow through regardless of what the keeper does — second-guessing mid-run-up is how clean strikes become weak, central pushovers.'],
            ]} />
            <Block title="Throw-Ins" items={[
              ['Legal technique, non-negotiable', 'Both feet on the ground (or behind the line), ball held with both hands, released from behind and over the head in one continuous motion — get any of these wrong and it\'s given to the opposition.'],
              ['Quick throws beat set plays', 'A fast throw before the defence reorganises catches teams in transition — always scan for a quick option before opting for a slow, set throw-in routine.'],
              ['Long throws as a corner-like weapon', 'Near the opposition box, a well-drilled long throw functions like a short corner — practice targeting the same near-post flick zones.'],
              ['Support angles', 'The receiver should show for the ball at an angle, not standing square — a throw to a player facing the thrower square-on has nowhere good to go with the first touch.'],
            ]} />
          </div>
        )}

        {/* ===== GYM ===== */}
        {tab === 'gym' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Lower Body First — the foundation you're missing" items={[
              ['Why lower body leads', 'Speed, power on the ball, and shot power all come from the hips, glutes and legs. If you feel underdeveloped there, this is the highest-leverage place to train — everything else on the ball rides on top of it.'],
              ['Squat pattern (2×/week)', 'Back squat or goblet squat 4×5-6, building load week to week. This is your base strength — the number one driver of jump height and sprint power.'],
              ['Hip hinge (2×/week)', 'Romanian deadlifts or trap bar deadlifts 4×6. Builds the hamstrings and glutes that decelerate you and protect your knees — most football injuries happen in this exact chain.'],
              ['Single-leg work', 'Bulgarian split squats or walking lunges 3×8 each leg. Football is played on one leg at a time — single-leg strength transfers directly to duels, shots and cutting.'],
              ['Calves & ankles', 'Standing calf raises 3×15, plus pogo hops. Stiff, springy ankles are free speed and stop rolled ankles in duels.'],
            ]} />
            <Block title="Power on the Ball — strength that shows up in matches" items={[
              ['Hip thrusts 3×6-8', 'The single best exercise for shot power and holding off defenders — loads the glutes that drive your hips through the ball.'],
              ['Jump training 2×/week', 'Box jumps or broad jumps 4×4, resetting fully between reps. Converts raw strength into explosive power — the quality that actually shows up in sprints and jumps for headers.'],
              ['Medicine ball throws', 'Rotational throws against a wall, 3×6 each side. Trains the hip rotation that powers a driven shot and a long throw-in.'],
              ['Core anti-rotation', 'Pallof press and side planks 3×30s. A strong core lets your hip power transfer into the ball instead of leaking through a wobbly torso.'],
            ]} />
            <Block title="Get Faster & Stronger on the Ball — a simple weekly split" items={[
              ['Mon — Heavy lower body', 'Squats + Romanian deadlifts + core. Strength day, full recovery between sets.'],
              ['Wed — Power & speed', 'Jump training + short acceleration sprints (see Speed tab) + hip thrusts.'],
              ['Fri — Single-leg + shooting', 'Split squats, lunges, calf work — then straight into a shooting session so leg power transfers to strikes while you\'re primed.'],
              ['Progress weekly', 'Add small load or reps every week on your main lifts. Underdeveloped legs catch up fast with consistent progressive overload — expect visible changes in 6-8 weeks.'],
            ]} />
            <Block title="Shooting Power — where it actually comes from" items={[
              ['It\'s hips, not arms', 'A powerful shot is hip rotation + a locked ankle + a strong plant leg, not swinging your leg harder. The lower-body work above IS your shooting power program.'],
              ['Plant leg strength', 'A weak plant leg collapses on contact and kills power transfer. Single-leg squats build exactly the stability you need at the moment of the strike.'],
              ['Combine with technique', 'Do 10 shots straight after your gym session on power days — you\'ll feel the extra drive through the ball almost immediately once the strength is there.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
