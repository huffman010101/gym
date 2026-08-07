import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, Target, Users, Activity, ChevronDown, Trophy } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'plan' | 'home' | 'speed' | 'shooting' | 'skills' | 'position' | 'setpieces' | 'physical' | 'elite' | 'gym';

const TABS: { id: Tab; label: string }[] = [
  { id: 'plan', label: 'The Plan' },
  { id: 'home', label: 'Home Drills' },
  { id: 'speed', label: 'Speed' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'skills', label: 'Every Metric' },
  { id: 'position', label: 'By Position' },
  { id: 'setpieces', label: 'Set Pieces' },
  { id: 'physical', label: 'Physicality' },
  { id: 'elite', label: 'Becoming Elite' },
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
    return (['plan', 'home', 'speed', 'shooting', 'skills', 'position', 'setpieces', 'physical', 'elite', 'gym'] as const).includes(t as Tab) ? (t as Tab) : 'plan';
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

        {/* ===== HOME DRILLS ===== */}
        {tab === 'home' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">What you can genuinely build alone</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Being honest about the ceiling: decision-making, positioning and reading the game only improve in real
                matches. But <span className="text-emerald-300 font-semibold">touch, control, both feet, ball mastery
                and striking technique</span> are all pure repetition — and repetition is exactly what you can do alone
                in a garden, a garage or against any wall. That is a huge share of what separates players.
              </p>
            </div>

            <Block title="You need almost nothing" items={[
              ['A ball and a wall', 'A wall is the best training partner available — it returns every pass instantly, never gets tired, and forces a first touch every single time. A garage door, a garden fence, a park wall.'],
              ['Space: about 3 × 3 metres', 'Every ball-mastery drill below fits in a space smaller than a bedroom. You do not need a pitch to get a better touch.'],
              ['Optional, under £20', 'A set of cones (or just shoes, cans, socks), and a size 4 or futsal ball — the smaller heavier ball makes control harder, so a normal ball feels easy afterwards.'],
              ['Boots off is fine', 'Trainers or barefoot on grass are both fine for touch work. Only shooting really benefits from boots.'],
            ]} />

            <Fold title="Ball mastery — 10 min, every day" tag="The base layer everything else sits on" items={[
              ['Toe taps — 3 × 30s', 'Ball still, tap the top of it alternating feet, fast and light on the balls of your feet. Builds the foot speed and rhythm behind every close-control move.'],
              ['Inside-inside rolls — 3 × 30s', 'Push the ball side to side using the inside of each foot, staying low. This is the exact motion of shifting a ball away from a defender.'],
              ['Sole rolls (V-pulls) — 3 × 30s each foot', 'Roll the ball across with the sole, pull it back diagonally with the same foot. The most-used escape move in tight areas.'],
              ['Figure of eights — 2 × 45s', 'Weave the ball between your legs in a figure of eight using the inside of both feet. Brutal for coordination, brilliant for close control.'],
              ['Juggling — 5 min, targets not time', 'Not just showing off: it builds soft feet and air control. Progress: 20 with each foot, then alternating feet, then thigh-foot-thigh, then no bounce for 50.'],
              ['Why this works', 'Ten minutes daily is roughly 60 hours a year of pure touch repetition. That is the difference between a heavy first touch and a clean one, and it is entirely available to you at home.'],
            ]} />

            <Fold title="Wall work — the highest-value solo drill there is" tag="15-20 min, 3-4× a week" items={[
              ['One-touch returns — 3 × 2 min', 'Pass against the wall and return it first time with the same foot. Then swap feet. Sounds basic; it is the single best drill for a reliable first touch under pressure.'],
              ['Two-touch: control then pass — 3 × 2 min', 'Take a deliberate first touch away from where the ball came from, then pass. This trains the habit of touching INTO space rather than stopping the ball dead.'],
              ['Weak foot only — 5 min minimum', 'Every session. The weak foot is the biggest single upgrade available to most players and it is trained almost entirely through boring repetition like this.'],
              ['Turn and pass — 3 × 2 min', 'Pass to the wall, take the return with the back foot, turn 180°, pass to a target (a cone, a mark). Trains receiving on the half-turn, which is what separates midfielders.'],
              ['Volleys and half-volleys — 5 min', 'Throw the ball against the wall so it comes back in the air, strike the return. Cleanest way to practise the technique that produces the best goals.'],
              ['Add a constraint to make it real', 'Say the number of touches out loud before the ball arrives, or set a 3-second limit per rep. Pressure is what makes wall work transfer to matches instead of staying a party trick.'],
            ]} />

            <Fold title="Cone work — dribbling and agility" tag="Any five objects will do" items={[
              ['Straight-line slalom — 5 reps', 'Cones a metre apart, weave through using both feet, ball never more than a step ahead. Speed comes later; clean touches first.'],
              ['Figure-of-eight around two cones', 'Two cones three metres apart, dribble a figure of eight. Forces sharp direction changes with the ball at your feet.'],
              ['Skill move at the cone — 10 each side', 'Dribble at a single cone and execute one move (step-over, body feint, drag-back, cut inside) at pace, then accelerate two steps past it. The acceleration AFTER the move is the part most players skip and the part that actually beats defenders.'],
              ['The 1v1 rule', 'Pick ONE move and drill it until it is automatic before adding a second. A player with one unstoppable move beats a player with six they cannot do at speed — see the Every Metric tab for the full toolbox.'],
              ['Reaction starts', 'Ball at your feet, phone playing a random beep, explode into a 5-metre dribble on the sound. Adds the reaction element that pure cone work lacks.'],
            ]} />

            <Fold title="Solo finishing and striking" tag="Garden, park or against a wall" items={[
              ['Technique before power, always', 'Non-kicking foot planted beside the ball, ankle locked, strike through the middle with the laces, follow through toward the target. Ten slow correct reps beat fifty wild ones.'],
              ['Target practice against a wall', 'Chalk or tape a target. 20 strikes each foot, aiming for the same spot. Accuracy is a trained skill, not a talent.'],
              ['Placement over power — 20 reps', 'Side-foot finishes into a small target from 10-12 metres. Most goals are passed in, not blasted.'],
              ['Weak-foot finishing — half of every session', 'Non-negotiable if you want to be complete. Defenders show you onto your weak foot precisely because most players cannot use it.'],
              ['First-touch-then-finish', 'Throw the ball up or off the wall, take one controlling touch, finish on the second. This is how goals actually arrive — almost never from a static ball.'],
            ]} />

            <Fold title="Fitness you can do without a pitch" tag="Football-specific, no equipment" items={[
              ['Shuttle runs — 6 × 20m', 'Two marks 20m apart (a garden, a street, a park). Sprint, turn, sprint back. Football is repeated sprints with turns, not steady jogging.'],
              ['Zig-zag sprints', 'Cones or markers in a zig-zag, sprint through changing direction hard. Trains the deceleration and cutting that actually causes injuries when untrained.'],
              ['Nordic curls and Copenhagen planks', 'The two best injury-prevention exercises for footballers, both doable at home with no kit. Full detail in the Gym tab and The Program.'],
              ['Jump work — 3 × 5', 'Broad jumps, single-leg hops, quick pogo hops. Builds the elastic strength behind sprinting and jumping for headers.'],
              ['Wall-sit into sprint', 'Wall sit 30 seconds, then immediately sprint 20m. Trains producing power with tired legs, which is the last 15 minutes of every match.'],
            ]} />

            <div className="bg-[#111] border border-emerald-500/25 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-300 mb-3">The 30-minute home session</h3>
              <div className="space-y-2">
                {[
                  ['0-5 min — Ball mastery', 'Toe taps, rolls, V-pulls. Wakes the feet up.'],
                  ['5-10 min — Juggling', 'Both feet, targets not time.'],
                  ['10-20 min — Wall work', 'One-touch, two-touch, turns. Half of it weak foot.'],
                  ['20-27 min — Cones or finishing', 'Alternate days: dribbling one day, striking the next.'],
                  ['27-30 min — Sprints or jumps', 'Short, sharp, full recovery between reps.'],
                  ['Frequency', '4-5× a week is realistic and enough. Every day for two weeks then nothing for a month is worth far less than 20 minutes most days for a year.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <p className="font-semibold text-sm text-gray-200">{t}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== BECOMING ELITE ===== */}
        {tab === 'elite' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">The honest version first</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nobody can hand you a route to being the best player ever — that involves genetics, timing, academy
                access and luck nobody controls. What IS fully controllable is becoming
                <span className="text-emerald-300 font-semibold"> dramatically better than you are now, and the best
                player in most rooms you walk into</span>. Everything below is the part that is actually in your hands,
                and almost nobody does all of it.
              </p>
            </div>

            <Block title="What actually separates players" items={[
              ['Volume of touches, over years', 'The strongest single pattern in elite players is not talent — it is having touched a ball vastly more times than everyone else by the time they were 18. This is why the home drills tab matters more than it looks: it is the only lever that adds thousands of touches without needing a team, a coach or a pitch.'],
              ['Being two-footed', 'The clearest, most achievable separator available. Genuinely comfortable on both feet doubles your options in every situation and removes the single most common way defenders neutralise a player. It costs nothing but boring repetition.'],
              ['Speed of decision, not speed of feet', 'The best players look like they have more time because they decided before the ball arrived. Scanning — checking your shoulders every few seconds before receiving — is a trainable habit and is what makes a good player look elite.'],
              ['A game they actually understand', 'Watching football as a student rather than a fan: watching one player for a whole match, seeing why space appears, noticing what a striker does in the 88 minutes without the ball. This is free and almost nobody does it.'],
              ['Physical durability', 'The most talented player who is injured four months a year loses to the good player who is available every week. Nordics, Copenhagens, sleep, and not skipping the boring prevention work — this is why the gym plan exists.'],
              ['Ruthless consistency over intensity', 'Two hours of extra work on a motivated Sunday means little. Twenty focused minutes, five days a week, for three years, is transformative. The maths is genuinely that simple and it is why most people never get there.'],
            ]} />

            <Fold title="The mentality that separates" tag="The half nobody trains" items={[
              ['Train your weaknesses, play to your strengths', 'Most players spend practice doing what they are already good at because it feels better. An hour on your weak foot or your heading is worth ten on the thing you already do well.'],
              ['Deliberate practice, not just playing', 'Playing is fun and builds decision-making. But focused repetition on ONE specific weakness, with full attention, is what actually changes ability. Both are needed and most players only do the first.'],
              ['Judge yourself on performance, not the result', 'Did you make good decisions, track back, take your chances? A goal from a poor performance teaches you nothing; a strong performance in a loss is progress. This is the Stoic "judge yourself on inputs" rule applied to football.'],
              ['Be the easiest player to coach', 'Take criticism without sulking, apply it immediately, ask questions. Coaches invest their time in players who visibly use it — that extra attention compounds over seasons.'],
              ['Recover like it is part of training', 'Sleep, protein, and actually taking the rest day. Adaptation happens in recovery, and this is where most young players quietly leave progress on the table.'],
              ['Handle being dropped without collapsing', 'Every player faces a bad spell, a bad manager, a season on the bench. The ones who come through it are not the most talented — they are the ones whose self-belief was not resting on being picked.'],
            ]} />

            <Fold title="How to actually improve fastest" tag="A method, not a wish" items={[
              ['Pick ONE weakness per 6-8 weeks', 'Weak foot, first touch, heading, scanning, finishing. One at a time, drilled in every session, until it stops being a weakness. Trying to fix everything at once fixes nothing.'],
              ['Film yourself', 'Phone propped up for one home session or one match. You will immediately see things you cannot feel — heavy touches, poor body shape, standing still off the ball. The single fastest feedback loop available to you.'],
              ['Keep a training log', 'What you drilled, for how long, and one line on how it went. It converts vague effort into visible progression, and it stops you from quietly doing only what you enjoy.'],
              ['Play with better players wherever possible', 'Being the worst player in a strong session improves you faster than dominating a weak one. It is uncomfortable, which is exactly why it works.'],
              ['Play other formats', 'Futsal and 5-a-side massively accelerate close control and quick decisions because the ball comes to you constantly in tight space. Many elite players credit futsal specifically.'],
              ['Get game time above all else', 'If you are not playing, change something — a different team, a different level, a different position. Minutes on a pitch are the one input that has no substitute.'],
            ]} />

            <div className="bg-[#111] border border-emerald-500/25 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-300 mb-2">If you want the realistic path</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Touch every day at home. Weak foot in every session. Scan constantly. Watch football like a student.
                Do the injury-prevention work. Play at the highest level that will have you, as often as possible.
                Fix one specific weakness at a time and film yourself doing it.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                Do that for three years and you will be unrecognisable as a player — and you will have done more than
                almost anyone you play with. Whether it ends in a professional contract is not fully yours to decide;
                whether you get genuinely, visibly good absolutely is.
              </p>
            </div>
          </div>
        )}

        {/* ===== THE PLAN ===== */}
        {tab === 'plan' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">How to actually get good — the structure</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You already have the technique content in the other tabs. This is the missing piece: how to organise
                it so you improve every week instead of just playing and hoping. The gap between a good amateur and a
                professional is far less about hours and far more about whether those hours are structured, specific
                and fed back on.
              </p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3.5">
              <p className="text-xs text-amber-200/85 leading-relaxed">
                <span className="font-bold">One honest thing first.</span> Pros train twice a day with physios,
                nutritionists, analysts and no job. You cannot copy the volume and you should not try — that is how
                you get injured. What you CAN copy exactly is the structure: deliberate practice on specific
                weaknesses, video feedback, periodised load, and daily technical touches. That is the part that
                actually transfers, and almost no amateur does it.
              </p>
            </div>

            <Block title="The professional week — what they actually do" items={[
              ['MD+1 (day after a match) — recovery', 'Light movement only: pool, bike, mobility, walking. Nothing that adds load. Amateurs skip this and stay tired all week.'],
              ['MD+2 — off, or gym', 'Full rest or upper-body/strength work. The furthest point from the last match and the next one, so it takes the heaviest non-football load.'],
              ['MD-3 — the biggest day', 'Highest physical and tactical load of the week: full-intensity possession work, conditioning, heavy running. Far enough out to recover from.'],
              ['MD-2 — sharp and short', 'Speed, finishing, set pieces. High intensity but low volume — the nervous system stays sharp without accumulating fatigue.'],
              ['MD-1 — activation only', 'Short, light, technical. Shape, set pieces, a few sprints to stay switched on. Nothing that could leave you heavy-legged tomorrow.'],
              ['MD — match', 'The point of the entire week. Everything above exists so you arrive fresh and sharp.'],
              ['The principle to steal', 'Load rises away from match day and falls toward it. Most amateurs train hardest the day before a game and wonder why they play badly.'],
            ]} />

            <Block title="Your realistic week (fits the gym programme)" items={[
              ['Daily — 20 min technical (non-negotiable)', 'Wall work, touches, weak foot. This is the single biggest lever you have and it costs 20 minutes. Consistency beats duration: 20 min daily destroys 3 hours on a Sunday.'],
              ['Mon — Gym Push + technical', 'Upper body does not interfere with football. Do your 20 min of touches before or after.'],
              ['Tue — Gym Legs A + light touches', 'Heavy legs day. Keep football to gentle technical work only — no sprinting.'],
              ['Wed — Football session or small-sided games', 'Your main skill day. Play, drill, or train with a team. Highest football-specific quality.'],
              ['Thu — Gym Explosive (this IS your speed work)', 'Sprints, jumps, change of direction. Do not duplicate this with extra running elsewhere.'],
              ['Fri — Gym Shoulders + technical, or rest', 'Light day if you have a match Saturday. Activation only.'],
              ['Sat — MATCH (or Legs B if no match)', 'If you play, that replaces Legs B entirely. Never do both.'],
              ['Sun — recovery', 'Walk, mobility, stretch. Genuinely easy. This is where the week gets absorbed.'],
            ]} />

            <Fold title="The daily 20 minutes — exactly what to do" tag="The thing that separates people, done alone" items={[
              ['100 wall passes, both feet', 'One touch against a wall, controlling and returning. Start close, move back as it gets easy. This builds first touch and passing weight better than anything else you can do alone.'],
              ['50 weak-foot passes + 20 weak-foot finishes', 'The single highest-return investment in your game. A genuinely two-footed player is far harder to defend and it takes months, not years.'],
              ['Close control — 5 min', 'Cone weave, figure-8s, tight touches at pace, head up on every third touch. Both feet, both surfaces (inside and outside).'],
              ['Juggling — 5 min', 'Not for show. It calibrates touch, and doing it with weak foot only, thigh only, or one-bounce forces genuine control.'],
              ['One skill move, 50 reps', 'The move you picked in the Skills tab. Slow first, then at full speed. Fifty reps a day for a month is 1,500 reps and it becomes automatic.'],
              ['Why this works when team training does not', 'In a team session you might touch the ball a few dozen times. Twenty minutes alone gives you hundreds of quality touches on exactly the thing you are worst at.'],
            ]} />

            <Fold title="Deliberate practice — the actual difference" tag="Why some players improve for years and others plateau at 17" items={[
              ['Pick ONE weakness per 4-6 week block', 'Weak foot. Or first touch under pressure. Or heading. Trying to fix everything fixes nothing. Name the weakness, attack it for six weeks, then reassess.'],
              ['Practise at match speed and under pressure', 'Cones do not close you down. Once a skill works unopposed, add a defender, a time limit, or a restriction. Skills that only work in isolation do not exist in matches.'],
              ['Use constraints to force the adaptation', 'Weak foot only. One touch. Two-touch maximum. No talking. Constraints make the thing you are avoiding unavoidable, and they work far faster than instruction.'],
              ['Get feedback or you are guessing', 'Video, a coach, or a teammate who will be honest. Practising for months without feedback usually means grooving errors deeper.'],
              ['Train the specific, play the whole', 'Isolate a sub-skill in practice, then play games where you have to use it under real conditions. Neither alone is enough — this is the loop.'],
            ]} />

            <Fold title="Game intelligence — the invisible level-up" tag="Why some slower players always look faster" items={[
              ['Scanning — check your shoulders every 2-3 seconds', 'Elite midfielders scan far more often than average players. Knowing what is around you BEFORE the ball arrives is what makes a player look like they have more time. Count your scans in a game — most people are shocked how few they do.'],
              ['Decide before you receive', 'Your first touch should already be going where you decided to play. That decision comes from the scan you did two seconds earlier.'],
              ['Watch full matches, not highlights', 'Pick one elite player in your position and watch what they do WITHOUT the ball for a full 90 minutes. That is 95% of their game and 0% of any highlight reel.'],
              ['Film your own games', 'Uncomfortable and by far the fastest feedback available. Watch three things only: your decisions, your positioning off the ball, and your first touch. You will see things you would swear did not happen.'],
              ['Learn your position properly', 'See the By Position tab. Knowing where you should be at each phase is a skill you can learn from a sofa, and it makes you look quicker without moving faster.'],
            ]} />

            <Block title="The 12-week block" items={[
              ['Weeks 1-2 — audit', 'Film a game. Be honest about the two weaknesses costing you most. Set your daily 20 minutes around one of them, and get your gym and sleep consistent.'],
              ['Weeks 3-6 — build', 'Daily technical work every day without fail. Gym programme running. One weakness attacked deliberately. Expect it to feel worse before it feels better — new technique always does.'],
              ['Weeks 7-10 — pressure', 'Take the improved skill into games and small-sided play under real pressure. Add the second weakness. Film again and compare with week 1.'],
              ['Weeks 11-12 — consolidate + deload', 'Reduce volume, play more, let it become automatic. Reassess with video, then choose the next block\'s weakness.'],
              ['What to expect, honestly', 'Noticeable touch and fitness change in about 6-8 weeks. A level change others comment on in 6-12 months. Anyone promising faster than that is selling something.'],
            ]} />

            <Fold title="On going pro — the honest picture" tag="Worth knowing rather than guessing" items={[
              ['The standard pathway is early', 'Most professionals are in an academy well before 16. If you are past that and not in a club system, the realistic route is not a Premier League academy — that is just the honest position, and it is better to know it than not.'],
              ['But the pathway is not closed', 'Non-league, semi-pro, university football at a high level, trials at lower-league clubs, and playing abroad are all real. Players do get picked up late — it is rarer, not impossible, and it happens to people who are visibly excellent, fit and reliable.'],
              ['What actually gets you seen', 'Playing at the highest level that will have you, being physically outstanding for that level, and being coachable. Scouts notice players who dominate their current standard, not players who are theoretically good.'],
              ['The version of this that always pays', 'Getting genuinely good at football makes you fitter, more confident and better socially, whether or not it becomes a career. Train like it matters, keep the degree and the income skills running, and you cannot lose either way.'],
            ]} />
          </div>
        )}

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
