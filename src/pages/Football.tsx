import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, Target, Users, Activity, ChevronDown, Trophy } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'speed' | 'shooting' | 'skills' | 'position';

const TABS: { id: Tab; label: string }[] = [
  { id: 'speed', label: 'Speed' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'skills', label: 'Every Metric' },
  { id: 'position', label: 'By Position' },
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
    return (['speed', 'shooting', 'skills', 'position'] as const).includes(t as Tab) ? (t as Tab) : 'speed';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
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
            <Fold title="Dribbling & 1v1s" tag="Beat your man on demand" items={[
              ['Two touches per stride at speed', 'Close control drills daily: cone weaves, figure-8s, both feet, head up on every third touch.'],
              ['One move mastered > ten known', 'Pick a go-to (body feint, chop, or push-and-go) and drill it until it works at full speed under pressure. Add a counter-move once defenders expect it.'],
              ['Attack the front foot', 'Dribble AT the defender\'s leading foot, shift as their weight commits, explode past. Speed change beats trick complexity — slow-slow-FAST.'],
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
      </div>
      <BottomNav />
    </main>
  );
}
