import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Swords, Hand, AlertTriangle, Target, Users, Zap, ChevronDown } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'fundamentals' | 'takedowns' | 'ground' | 'chokes' | 'strategy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'takedowns', label: 'Takedowns' },
  { id: 'ground', label: 'Ground Game' },
  { id: 'chokes', label: 'Submissions' },
  { id: 'strategy', label: 'Strategy' },
];

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center flex-shrink-0 text-red-400 font-bold text-xs mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-200">{title}</p>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Technique({ name, tag, steps, keyDetail }: {
  name: string; tag: string; steps: { title: string; desc: string }[]; keyDetail: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{name}</p>
          <p className="text-xs text-red-400/70 mt-0.5">{tag}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">
            {steps.map((s, i) => <Step key={i} n={i + 1} title={s.title} desc={s.desc} />)}
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3 mt-2">
              <p className="text-xs text-red-300/90"><span className="font-bold">Key detail:</span> {keyDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, sub }: { icon: typeof Shield; title: string; sub?: string }) {
  return (
    <div className="mb-4 mt-8 first:mt-0">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-red-400" />
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      {sub && <p className="text-gray-500 text-sm mt-1">{sub}</p>}
    </div>
  );
}

export default function Combat() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['fundamentals', 'takedowns', 'ground', 'chokes', 'strategy'] as const).includes(t as Tab) ? (t as Tab) : 'fundamentals';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Swords className="text-red-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Combat</h1>
            <p className="text-gray-500 text-sm">Striking · Grappling · Takedowns · Submissions · Fight IQ</p>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 mt-4 flex items-start gap-2.5">
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            These are training references. Learn them live at an MMA/BJJ/wrestling gym with a coach and willing partners —
            technique only sticks with reps against resistance. Chokes can seriously injure: drill them slowly, tap early, never
            practice on someone who hasn't agreed. Outside the gym, avoiding and de-escalating a fight is always the win.
          </p>
        </div>

        {/* Tabs */}
        <DailyHabits section="combat" />

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-6 mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ============ FUNDAMENTALS ============ */}
        {tab === 'fundamentals' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Shield} title="Stance & Base" sub="Everything in fighting is built on stance. Get this wrong and nothing else works." />
            <Technique name="Fighting Stance" tag="The foundation of striking and takedown defence"
              steps={[
                { title: 'Feet shoulder-width, staggered', desc: 'Lead foot pointing at opponent, rear foot at ~45°. Weight 50/50 on the balls of your feet — never flat-footed, never crossing your feet when you move.' },
                { title: 'Knees soft, hips under you', desc: 'A slight bend loads your legs like springs. Standing tall = easy to knock over and slow to react.' },
                { title: 'Hands up, elbows in', desc: 'Rear hand glued to your cheek, lead hand at eyebrow height. Elbows tucked to protect the body. Chin down — look through your eyebrows.' },
                { title: 'Move in steps, not jumps', desc: 'Push off the foot opposite your direction: going forward = push rear foot, lead foot steps first. Feet never come together.' },
              ]}
              keyDetail="Chin down + hands up is 80% of not getting knocked out. Film yourself shadowboxing — everyone drops their hands when they get tired without noticing." />
            <Technique name="The Jab" tag="The most important punch in fighting"
              steps={[
                { title: 'Snap it straight from the guard', desc: 'No wind-up, no dropping the hand first. It leaves from your cheek and comes back to your cheek.' },
                { title: 'Step with it', desc: 'Small lead-foot step as the jab lands adds range and power. Rotate the fist palm-down at full extension.' },
                { title: 'Use it as a rangefinder', desc: 'The jab measures distance, blinds them, interrupts their rhythm and sets up everything else — the cross, the takedown, the low kick.' },
              ]}
              keyDetail="Double and triple the jab. One jab gets slipped; three jabs walks someone into the fence." />
            <Technique name="Defence: Blocking, Slipping, Frames" tag="Getting hit less is a skill you drill"
              steps={[
                { title: 'Block', desc: 'Tight guard, forearms take the shot, eyes stay open on the target. Don\'t reach for punches — that opens the door.' },
                { title: 'Slip', desc: 'Small bend of knees + rotation moves your head off the centre line. Slip outside their jab (to your lead side) so you\'re safe from the cross.' },
                { title: 'Frame & clinch', desc: 'When overwhelmed, step IN with forearm frames to their neck/biceps and tie up. Being chest to chest kills their punching power.' },
                { title: 'Circle out, never straight back', desc: 'Backing up in a straight line is how people get finished. Angle off after defending.' },
              ]}
              keyDetail="After every combination you throw, expect a counter — hands come back before you admire your work." />
            <SectionTitle icon={Zap} title="The Clinch" sub="Where striking becomes wrestling. Control the head and the arms and you control the fight." />
            <Technique name="Collar Tie & Underhooks" tag="Clinch control basics"
              steps={[
                { title: 'Collar tie', desc: 'Cup the back of their head (not the neck) with your hand, elbow heavy on their chest/collarbone. Snap their head down — where the head goes, the body follows.' },
                { title: 'Underhook', desc: 'Slide your arm under theirs and lift, hand on their back/shoulder blade. One underhook = takedowns and knees. Double underhooks = you own their hips.' },
                { title: 'Fight for inside position', desc: 'Whoever has hands/arms inside wins the clinch. Swim your arms in — pummel — instead of pulling from outside.' },
                { title: 'Head position', desc: 'Your forehead on their temple or chin over their shoulder — your head is a third hand. Never let your head hang low and loose in front of them.' },
              ]}
              keyDetail="If they get double underhooks on you: drop your hips back, get your own overhooks tight (whizzer), and fight your hips away from theirs immediately." />
          </div>
        )}

        {/* ============ TAKEDOWNS ============ */}
        {tab === 'takedowns' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Target} title="Takedowns" sub="Level change → penetration step → finish through them, not into them." />
            <Technique name="Double Leg" tag="The highest-percentage takedown in MMA"
              steps={[
                { title: 'Set it up', desc: 'Never shoot from far away with no setup. Jab or feint high so their hands rise, or shoot as THEY punch (their hips are square and their mind is elsewhere).' },
                { title: 'Level change', desc: 'Bend your KNEES, not your back — drop your hips so your head is at their chest height. Back stays straight, eyes up.' },
                { title: 'Penetration step', desc: 'Deep step with your lead foot between their feet. Your head goes to the OUTSIDE of their body (head on the wrong side = guillotine).' },
                { title: 'Hands behind the knees', desc: 'Wrap both hands behind their knees/thighs, chest tight to their thighs, pull their legs toward you as you drive.' },
                { title: 'Drive at an angle', desc: 'Run through them at 45° — turn the corner as you drive. Straight-forward pushing gets sprawled on; angles put them down.' },
              ]}
              keyDetail="Posture at the moment of contact decides everything: straight back, head up, hips underneath you. If your head is down and your butt is up, you get guillotined or flattened." />
            <Technique name="Single Leg" tag="More available, works great against taller opponents"
              steps={[
                { title: 'Snatch the lead leg', desc: 'Level change and shoot to their LEAD leg — both hands clasped behind their knee, head tight to their ribs on the inside or outside.' },
                { title: 'Stand up with it', desc: 'Lift their leg and trap it between your thighs or hold it high on your hip. Their balance is now on one leg.' },
                { title: 'Finish 1 — Run the pipe', desc: 'Head pressure into their chest/ribs, big circular steps toward their trapped-leg side, drive down at 45°. They fall because they can\'t hop and post.' },
                { title: 'Finish 2 — Lift and turn', desc: 'Elevate the leg high, sweep their standing leg with your foot, or turn the corner and trip them backwards.' },
              ]}
              keyDetail="Never stay static holding a single — every second you hold without finishing they're attacking your neck. Move your feet the moment you have the leg." />
            <Technique name="Body Lock Takedown" tag="Best option against bigger, stronger opponents"
              steps={[
                { title: 'Get chest to chest', desc: 'From the clinch, pummel for double underhooks and clasp your hands behind their back (palm-to-palm grip).' },
                { title: 'Hips in, squeeze', desc: 'Pull their hips onto yours and squeeze the lock tight so there\'s zero space. Your head on the side you\'ll trip toward.' },
                { title: 'Trip', desc: 'Step your leg outside behind their leg (outside trip) and drive over it, or block their foot and turn them over your hip.' },
                { title: 'Land on top', desc: 'Follow them down chest-first into side control — don\'t launch them and let go.' },
              ]}
              keyDetail="This beats bigger people because it's leverage, not strength: their leg is blocked so their size becomes the reason they fall harder." />
            <Technique name="Foot Sweeps & Trips" tag="Low-effort takedowns off the clinch"
              steps={[
                { title: 'Inside trip', desc: 'From a collar tie + underhook, step your foot INSIDE behind their lead leg, hook their calf, and drive forward with your whole body.' },
                { title: 'Outside foot sweep', desc: 'As they step, sweep their foot in the direction it\'s already moving with the sole of your foot — timing beats power.' },
                { title: 'Snap down', desc: 'Not a trip but a gift: violently snap their head down with the collar tie as they push into you — many people face-plant or give up the front headlock.' },
              ]}
              keyDetail="All sweeps work off THEIR movement. Push them so they push back, then sweep into the direction of their push." />
            <SectionTitle icon={Shield} title="Takedown Defence" sub="You can't strike if you can't stay standing." />
            <Technique name="The Sprawl" tag="The answer to every shot"
              steps={[
                { title: 'Feet back, hips down', desc: 'The instant they change level, throw BOTH legs back and drop your hips heavy onto their shoulders/head.' },
                { title: 'Head control', desc: 'Force their head down and crossface (forearm across their face) so they can\'t see or drive.' },
                { title: 'Circle behind', desc: 'Keep hips heavy, circle to their back, and either take the back or disengage and stand up.' },
              ]}
              keyDetail="Sprawl on their FIRST movement, not when their hands touch your legs — by then it's late. Distance and a stiff jab prevent most shots before they start." />
          </div>
        )}

        {/* ============ GROUND ============ */}
        {tab === 'ground' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Users} title="Positional Hierarchy" sub="Ground fighting is a ladder. Position before submission — always." />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <div className="space-y-2 text-sm">
                {[
                  ['Back control', 'Best position in fighting. Hooks in, chest glued to their back, seatbelt grip.'],
                  ['Mount', 'Sitting on their torso, knees pinched. Huge strikes and arm attacks.'],
                  ['Side control', 'Chest on chest, past their legs. Heavy pressure, sets up mount.'],
                  ['Half guard (top)', 'One leg trapped. Flatten them, free the leg, pass.'],
                  ['Guard (their legs around you)', 'Neutral-ish. They can attack; posture up and pass.'],
                  ['Bottom of everything', 'Bad. Frame, make space, get to your feet or recover guard.'],
                ].map(([pos, note], i) => (
                  <div key={pos} className="flex items-start gap-3">
                    <span className="text-red-400 font-black text-xs mt-1">{i + 1}</span>
                    <div><span className="font-bold text-gray-200">{pos}</span> <span className="text-gray-500">— {note}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <Technique name="Passing the Guard" tag="Getting past their legs"
              steps={[
                { title: 'Posture first', desc: 'In their closed guard: back straight, head up, hands on their hips/chest. Broken posture = you\'re in triangle/armbar range.' },
                { title: 'Open the guard', desc: 'Stand up inside their guard (knee wedged under their tailbone) and push their knee off to break the ankles open.' },
                { title: 'Knee cut', desc: 'Slice your knee across their thigh to the mat while pinning their other leg, chest heavy, and slide through to side control.' },
                { title: 'Or pressure pass', desc: 'Stack their knees to their chest, walk around the legs with your hips low and heavy. Slow, crushing, works on everyone.' },
              ]}
              keyDetail="Control their hips OR their shoulders at all times while passing — if both are free they just re-guard." />
            <Technique name="Escaping Bad Positions" tag="Frames, hips, and patience"
              steps={[
                { title: 'Under mount — trap and roll', desc: 'Trap their arm (grab wrist and pin it), trap their foot on the same side with yours, bridge HARD over that shoulder and roll into their guard.' },
                { title: 'Under mount — elbow escape', desc: 'Frame on their hips, bridge to make space, shrimp your hips out and drag your knee through to recover guard.' },
                { title: 'Under side control', desc: 'Forearm frame across their neck, other frame on their hip. Bridge, shrimp away, insert your knee between you.' },
                { title: 'Standing back up', desc: 'Technical stand-up: post on one hand and the opposite foot, kick the free leg back through, stand in stance with hands up. Never turn your back to crawl away.' },
              ]}
              keyDetail="Escapes run on bridging and shrimping (hip escapes). Drill 50 shrimps as a warm-up every session — hips win ground fights, not arms." />
            <Technique name="Ground Striking (Top)" tag="Ground and pound with control"
              steps={[
                { title: 'Base before punches', desc: 'Every strike you throw loosens your control — keep your hips heavy and legs wide. If you feel them escaping, stop hitting and re-pin.' },
                { title: 'Short and sharp', desc: 'From mount/side control: short elbows and hammer fists beat wild swings. Pin one of their arms, hit the open side.' },
                { title: 'Posture snaps', desc: 'In their guard, don\'t brawl — posture up out of their grip first, pin their hips, then strike. Punching with broken posture gets you submitted.' },
              ]}
              keyDetail="The threat of strikes makes people give up their arms and neck — hit to make them defend, then take the submission they hand you." />
          </div>
        )}

        {/* ============ CHOKES/SUBS ============ */}
        {tab === 'chokes' && (
          <div className="fade-up stagger space-y-3">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-200/80 leading-relaxed">
                Blood chokes cause unconsciousness in seconds and can cause real harm. Only drill with a trained partner who taps,
                release INSTANTLY on the tap, and never hold a choke on someone who's out. This is gym knowledge, not a party trick.
              </p>
            </div>
            <SectionTitle icon={Hand} title="Chokes" sub="Blood chokes close the carotid arteries at the sides of the neck — squeeze the sides, not the windpipe." />
            <Technique name="Rear Naked Choke (RNC)" tag="The king of submissions — from back control"
              steps={[
                { title: 'Get the back properly', desc: 'Chest glued to their back, both feet hooked inside their thighs (or body triangle). Seatbelt grip: one arm over their shoulder, one under their armpit, hands clasped at their chest.' },
                { title: 'Slide the choking arm', desc: 'Your top arm slides across their neck until your ELBOW lines up with their chin — their trachea sits in the crook of your elbow, your forearm and bicep on the carotids.' },
                { title: 'Lock it', desc: 'Choking hand grabs your other bicep; that free hand slides behind their head (palm on their skull, not grabbing hair).' },
                { title: 'Finish', desc: 'Squeeze elbows together, expand your chest, pull them back into you. Pressure comes from the squeeze of the whole arm loop — not from yanking backwards on the throat.' },
              ]}
              keyDetail="Fight the HANDS before the neck: control their wrists so they can't peel your grip. The choke is finished before your arms move — it's finished when your chest is glued to their back." />
            <Technique name="Guillotine" tag="Punishes bad takedowns and low heads"
              steps={[
                { title: 'Catch the head', desc: 'When their head ducks (during their shot, or off your snap-down), wrap your arm around their neck — blade of the wrist under the chin, tight to the throat.' },
                { title: 'Lock the grip', desc: 'Clasp your hands (high-elbow/arm-in variations exist; start with the basic ten-finger grip), their head trapped against your ribs.' },
                { title: 'Hips in, or guard closed', desc: 'Standing: push your hips forward and arch. On the ground: close your guard around their torso, stretch them out and lift your wrist into the neck as your elbows drop.' },
              ]}
              keyDetail="Squeeze up and in toward your own chest with the wrist blade — pulling their head down just stacks them safely. If they jump to the opposite side, let go and take top position." />
            <Technique name="Triangle Choke" tag="Choking with your legs from guard"
              steps={[
                { title: 'One arm in, one arm out', desc: 'The setup: their right arm is inside your legs, their left is out (or vice versa). Break their posture down.' },
                { title: 'Leg over the shoulder', desc: 'Shoot your leg over the shoulder of their OUT-arm side, lock your ankle under your other knee (figure four around their neck + their trapped arm).' },
                { title: 'Adjust the angle', desc: 'Cut your body to 45° (grab your shin, swing your hips), pull their trapped arm across their own neck.' },
                { title: 'Finish', desc: 'Pull the head down, squeeze knees together, lift hips. Their own shoulder closes one artery; your thigh closes the other.' },
              ]}
              keyDetail="No angle, no choke. If you're square-on to them it just feels tight but never finishes — cut the angle first, then squeeze." />
            <SectionTitle icon={Hand} title="Joint Locks" sub="Slower and more controllable than chokes — apply gradually, always." />
            <Technique name="Armbar from Mount/Guard" tag="Hyperextends the elbow — tap early"
              steps={[
                { title: 'Isolate one arm', desc: 'From mount: they push you off their chest — hug that arm to YOUR chest, thumb pointing up.' },
                { title: 'Swing the leg over', desc: 'Turn perpendicular, knees pinched around the arm, swing your leg over their face, and sit back close to their shoulder.' },
                { title: 'Finish', desc: 'Knees squeezed, their thumb up, lift your hips into the elbow gently. It takes tiny movements — this is why control matters.' },
              ]}
              keyDetail="Butt close to their shoulder and knees pinched tight — the space between your hips and their shoulder is exactly the space they'll use to escape." />
            <Technique name="Kimura" tag="Shoulder lock from everywhere"
              steps={[
                { title: 'Grab the wrist', desc: 'Grab their wrist with your same-side hand (e.g., your left on their right wrist).' },
                { title: 'Figure four', desc: 'Your other arm threads over their arm and under, grabbing YOUR OWN wrist. Their arm is now bent at 90°.' },
                { title: 'Rotate', desc: 'Pin their wrist toward their back like turning a steering wheel behind them, keeping their elbow tight to your chest.' },
              ]}
              keyDetail="Works from guard, side control, north-south and against single-leg attempts. Keep their arm bent at 90° — a straight arm becomes a different (weaker) attack." />
          </div>
        )}

        {/* ============ STRATEGY ============ */}
        {tab === 'strategy' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Target} title="Fighting Bigger & Stronger" sub="Size is real — but it's rented, and technique owns the building." />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              {[
                ['Never trade power', 'Don\'t stand in the pocket and swing with someone bigger. Stick and move: jab, low kick, angle out. Make them chase.'],
                ['Clinch is your friend, space is theirs', 'Big punchers need room to generate power. Chest-to-chest with underhooks, their size advantage mostly disappears.'],
                ['Take it to the ground on YOUR terms', 'Body lock trips beat explosive double legs against heavier people — you\'re not lifting them, you\'re blocking their leg and steering.'],
                ['Attack the endurance', 'Bigger engines burn more fuel. Body shots, low kicks, constant movement — rounds 2 and 3 are where size becomes a liability.'],
                ['On the ground: never under them', 'Frames early, hips moving, get to your feet fast. Their weight in top position is their best weapon — deny it.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-bold text-sm text-gray-200">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <SectionTitle icon={Target} title="Fighting Taller Opponents" sub="Their reach only exists at long range. Delete that range." />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              {[
                ['Two ranges are safe: far out, or chest-to-chest', 'The kill zone is mid-range where their long shots land and yours don\'t. Never linger there.'],
                ['Enter behind something', 'Slip their jab and step in, or enter behind your own jab-cross. Head movement WHILE closing distance, not before.'],
                ['Body and legs first', 'Their head is far away; their lead leg and body aren\'t. Chop the lead leg — a tall fighter with a dead leg loses their jab and their base.'],
                ['Once inside, stay inside', 'Work hooks, uppercuts, knees and trips from the clinch. Resetting to long range restarts their advantage.'],
                ['Takedowns are shorter for you', 'Your level change is naturally deeper. Their long legs are far from their hands — singles on the lead leg are right there.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-bold text-sm text-gray-200">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <SectionTitle icon={Target} title="Fighting AS the Taller Man" sub="Your height is a weapon system — but only if you fight tall. Every metric, every art." />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="font-bold text-sm text-red-300">Boxing tall</p>
              {[
                ['Own the outside — permanently', 'Your jab should be a wall they live behind. Double it, triple it, jab to the chest and shoulder too. If they never get past your jab, the fight is already won.'],
                ['Never fight at THEIR range', 'Shorter opponents want to crowd your chest where your reach is worthless. The moment they close: pivot out, stiff-arm frame, or tie up — never stand and trade in a phone box.'],
                ['Punish every entry', 'They must lunge to reach you — that\'s your money moment. Meet entries with the check hook, straight down the pipe, or a step-back counter. Make closing distance expensive.'],
                ['Uppercuts when they duck in', 'Short fighters enter low. The uppercut is designed for exactly that head position — throw it as they duck, not after they arrive.'],
                ['Fight tall, literally', 'Stand up in your stance, chin down. Tall fighters who crouch to meet opponents donate their reach. Posture IS your range advantage.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-semibold text-sm text-gray-200">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="font-bold text-sm text-red-300">Muay Thai tall</p>
              {[
                ['The teep is your jab for legs', 'Push kick to the belly/hip every time they step in — it\'s a range-resetting weapon shorter fighters have no answer to. Snap it from the lead leg constantly.'],
                ['Long knees in the clinch', 'Height = knee leverage. Collar tie with your long frame, posture them down (your height makes the snap-down brutal), and drive knees to the body.'],
                ['Kicks from outside their reach', 'Your round kicks land from distances where their hands can\'t answer. Chop the legs and body from long range; head kicks open up as they slow.'],
                ['Elbows when they finally close', 'Inside range isn\'t lost for you — short elbows down onto entries use your height as an angle. Frame, elbow, exit.'],
                ['Don\'t get swept in the clinch', 'Tall = high centre of gravity. In the clinch keep hips back, base wide, and never let them lock your waist with your feet square.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-semibold text-sm text-gray-200">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              <p className="font-bold text-sm text-red-300">Grappling & MMA tall</p>
              {[
                ['Sprawl early, sprawl heavy', 'Shorter wrestlers shoot on tall guys all day — their level change is naturally deeper. Your keys: distance + jab so they shoot from too far, then hips-back sprawl with your long legs unreachable.'],
                ['The front headlock is your home', 'Every failed shot under your long frame lands them in your guillotine/anaconda territory. Drill the front headlock series until failed takedowns feel like gifts.'],
                ['Long limbs = submission reach', 'Triangles, armbars from guard, body triangles from the back — your levers close where others can\'t. If you end up on bottom, your guard is more dangerous than most.'],
                ['Knees and frames off the fence', 'In MMA, shorter opponents chain-wrestle against the cage. Underhooks + your height for whizzer leverage, frames on the face, and knees as they drop for legs.'],
                ['Watch the body lock', 'Your long torso is the target — never let them chest-to-chest you with hips connected. Fight the hands BEFORE the lock closes; once it\'s locked, your height works against you.'],
                ['Top game: long-range pressure', 'Knee cut and over-under passes suit long legs; from top your frames pin from distances they can\'t bridge against. Heavy hips, long arms posting — you\'re hard to sweep if you stay wide.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-semibold text-sm text-gray-200">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <SectionTitle icon={Zap} title="Fight IQ Essentials" />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
              {[
                ['Breathe or die', 'Holding your breath under pressure gasses you in 90 seconds. Exhale on every strike, slow nasal breathing in the clinch and on the ground.'],
                ['First 30 seconds: collect data', 'Are they a southpaw? Do they load the right hand? Do they panic in the clinch? Feints tell you everything before you commit.'],
                ['Damage follows defence', 'The best openings appear right after you make them miss. Slip → counter. Sprawl → front headlock. Block the kick → catch and sweep.'],
                ['Composure is a technique', 'Getting hit, getting swept, being under someone — panic is what finishes you, not the position. Slow exhale, frame, next step.'],
                ['Drill > spar > watch', 'Reps with a partner build the skill, sparring pressure-tests it, and watching breakdowns of real fights builds pattern recognition. All three, weekly.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-bold text-sm text-gray-200">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
