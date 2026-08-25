import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Swords, Hand, AlertTriangle, Target, Users, Zap, ChevronDown } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'fundamentals' | 'hips' | 'takedowns' | 'ground' | 'chokes' | 'drills' | 'arts' | 'strategy' | 'gym' | 'tough';

const TABS: { id: Tab; label: string }[] = [
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'hips', label: 'Hips' },
  { id: 'takedowns', label: 'Takedowns' },
  { id: 'ground', label: 'Ground Game' },
  { id: 'chokes', label: 'Submissions' },
  { id: 'drills', label: 'Drills' },
  { id: 'arts', label: 'The Arts' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'gym', label: 'Strength & Power' },
  { id: 'tough', label: 'Toughness' },
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

function Block({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className="font-bold text-gray-100 mb-3">{title}</h3>
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
          <p className="text-xs text-red-400/70 mt-0.5">{tag}</p>
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
    return (['fundamentals', 'hips', 'takedowns', 'ground', 'chokes', 'drills', 'arts', 'strategy', 'gym', 'tough'] as const).includes(t as Tab) ? (t as Tab) : 'fundamentals';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-red-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
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
            <Technique name="The Cross (Rear Straight)" tag="Your power punch, thrown straight down the pipe"
              steps={[
                { title: 'Drive from the back foot', desc: 'Pivot your rear heel up and rotate it like stubbing out a cigarette — the power starts in the ground and travels up through the hip, not the arm.' },
                { title: 'Rotate hip and shoulder together', desc: 'Rear hip and shoulder snap forward as one unit as the fist travels straight to the target. Arm-only crosses are slaps; hip-driven crosses are power.' },
                { title: 'Non-throwing hand stays home', desc: 'Lead hand stays glued to your cheek while you throw — dropping it to "help" the punch is how the return jab/cross finds your chin.' },
                { title: 'Snap back on the same line', desc: 'The fist returns the way it came, not looping wide. A punch that doesn\'t reset your guard immediately is an invitation.' },
              ]}
              keyDetail="Thrown right after a jab, the cross lands because the jab already occupied their guard and eyes — jab-cross is the single most reliable combo in boxing." />
            <Technique name="The Hook" tag="The looping shot that ends fights"
              steps={[
                { title: 'Elbow at 90°, stay compact', desc: 'Bend the arm to roughly a right angle and keep it there through the whole punch — a straight, swinging hook telegraphs and loses power.' },
                { title: 'Pivot the lead foot', desc: 'Rotate your lead heel outward as you throw, turning your whole hip and shoulder into the target. The rotation IS the power, not the arm swing.' },
                { title: 'Level it to the body too', desc: 'A hook to the liver (their right side, your left hook) with the same mechanics dropped slightly lower ends fights faster than most head shots — and it\'s much harder for them to see coming.'},
                { title: 'Chin down behind the shoulder', desc: 'As you rotate into a hook, tuck your chin behind your lead shoulder — this is what stops you eating a counter hook on the same beat.' },
              ]}
              keyDetail="Hooks work best off an angle change — step slightly off their centre line first, then hook, so it arrives from outside their vision." />
            <Technique name="The Uppercut" tag="The close-range finisher, thrown up through the guard"
              steps={[
                { title: 'Drop the level slightly', desc: 'Bend your knees a touch to dip below the target line, then drive UP through your legs — the punch is powered by your legs extending, not your arm lifting.' },
                { title: 'Short, tight arc', desc: 'The fist travels a short vertical line close to your own body, not a wide loop — a looping uppercut gets seen and countered from a mile away.' },
                { title: 'Rotate the hip upward', desc: 'Same hip-drive principle as the cross and hook, just redirected vertically. Palm faces you at the start, rotates as it rises.' },
                { title: 'Best at close range, in the pocket or clinch', desc: 'Uppercuts shine when an opponent is leaning forward or ducking to slip — exactly the position their chin drops into your punch\'s path.' },
              ]}
              keyDetail="The classic finishing combo: hook to draw the guard up and across, uppercut through the gap it leaves underneath." />
            <Technique name="Kicks, Knees & Elbows" tag="For MMA / Muay Thai rulesets"
              steps={[
                { title: 'The low kick (round kick to the leg)', desc: 'Step slightly off-line with the lead foot, swing the rear leg through the target with the shin (not the foot/instep — that\'s how you break toes), hip fully rotating over. Repeated low kicks dead-leg an opponent\'s mobility within a few rounds.' },
                { title: 'The teep (push kick)', desc: 'Snap the ball of your foot straight into their hip/stomach to create distance or stop their forward pressure — think of it as a kicking jab, not a power shot.' },
                { title: 'Knees in the clinch', desc: 'From a collar tie or double-collar tie, drive your knee straight up into the thigh or body, pulling their head down onto it with your grip for extra impact. The clinch knee is one of the highest-damage exchanges in the sport.' },
                { title: 'Elbows at close range', desc: 'Short, sharp elbow strikes (horizontal or downward) work inside punching range where fists have no room to wind up. Devastating for cuts, but check your ruleset — many gyms/competitions restrict elbows for sparring safety.' },
                { title: 'Checking a kick', desc: 'Raise your shin/knee to meet an incoming low kick rather than absorbing it on soft tissue — a well-timed check often hurts the kicker more than the kickee.' },
              ]}
              keyDetail="Kicks committed from too close get caught and turned into takedowns — throw them at a range where you can retract before they close distance, or set them up behind hand combinations." />
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
        {tab === 'hips' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Zap} title="Using your hips" sub="The one thing that separates people who look like they know what they're doing from people who don't." />

            <div className="bg-gradient-to-br from-red-500/12 to-[#111] border border-red-500/25 rounded-2xl p-5">
              <h3 className="font-black text-red-300 mb-2">One principle, two completely different jobs</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                In striking, your hips are an <span className="text-gray-200 font-semibold">engine</span> — they rotate to
                generate speed that travels out through your fist or shin. In grappling, your hips are a
                <span className="text-gray-200 font-semibold"> lever and a wedge</span> — they create space, deny space,
                and act as the fulcrum you throw or sweep someone around. Same joint, opposite instructions. People who
                are strong but feel ineffective are almost always doing one of these with their arms instead.
              </p>
            </div>

            <SectionTitle icon={Target} title="Boxing and striking — the hip as an engine" />

            <Fold title="The rear hip drives every power shot" tag="Cross, rear hook, rear kick, rear elbow" items={[
              ['The sequence, in order', 'Push the floor with the rear foot → the rear heel spins outward → the hip turns → the trunk follows → the shoulder → the fist arrives last. If your fist moves before your hip does, you are arm-punching, and the shot has your arm weight behind it instead of your bodyweight.'],
              ['The heel is the tell', 'Watch anyone\'s rear heel on a cross. If it stays flat and pointing backwards, the hip could not rotate and the punch has nothing on it. The heel turning out is what allows the hip to open. Film yourself: this is the single fastest fault to spot and fix.'],
              ['Rotate around a fixed axis, do not lunge', 'Your spine is the axle. The hip rotates around it; your head should not travel forward past your lead knee. Lunging shifts your weight over your lead foot, which is how you end up falling into shots and getting countered.'],
              ['Connect the hip to the FLOOR, not the air', 'Force is only produced against the ground. A punch thrown while stepping, jumping or backing up has almost nothing behind it, no matter how hard the hip turns — because the hip has nothing to push against.'],
              ['Lead hook — the same thing mirrored', 'Lead hip and lead heel turn INTO the shot as the lead foot pivots. The arm stays a fixed frame; the power is the pivot. A lead hook thrown with a flat lead foot is an arm punch by definition.'],
              ['Relax, then arrive', 'Tension in the shoulder slows the whip and cuts the hip out of the chain. Stay loose through the throw and stiffen only at impact — this is what actually delivers your bodyweight rather than your arm weight.'],
            ]} />

            <Fold title="Hips in defence and movement" tag="Where most people forget the hips exist entirely" items={[
              ['Slipping is a hip movement', 'A slip is a small hip rotation that moves your head off the centre line, not a lean or a duck with the neck. Rotating from the hips keeps your feet under you and — crucially — leaves you loaded to counter. Leaning takes you off balance and gives you nothing back.'],
              ['Rolling under hooks', 'Bend the knees, rotate the hips, and travel in a U-shape under the punch, coming up on the other side already turned into your counter. If the movement happens above the waist, you end up dipping your head forward into knees and uppercuts.'],
              ['Pivoting off the line', 'Every pivot is driven by the hips turning the whole body around the lead foot. This is how you create angles rather than backing straight up — and backing straight up is how people get walked down and hit.'],
              ['Level changes come from the hips and knees', 'Drop by bending the knees and sitting the hips, keeping the chest tall. Bending at the waist to change level puts your head down in front of you, which is a guillotine or a knee waiting to happen.'],
              ['Absorbing body shots', 'Turning the hip slightly into an incoming body shot lets you take it on a braced oblique instead of an exposed liver. Small rotation, big difference.'],
            ]} />

            <SectionTitle icon={Users} title="Grappling — the hip as a lever, a wedge and a weapon" />

            <Fold title="Hip escapes — the single most important movement in grappling" tag="Shrimping, and why it is the answer to being on the bottom" items={[
              ['What it actually is', 'On your side, frame against them, post a foot, push off the floor and drive your HIPS away from them — not your shoulders. Almost every escape from bottom (mount, side control, knee-on-belly) is this movement plus a detail.'],
              ['Hips move first, shoulders follow', 'The most common error is pushing with the arms and dragging the hips along. Arms are a frame that creates the gap; hips are what travel through it. If your shoulders move and your hips do not, you have gone nowhere and burnt energy.'],
              ['Get on your side, always', 'You cannot move flat on your back — a flat person is a pinned person. Turning onto your side is the precondition for every escape, and it is the position you should return to by default any time you are underneath.'],
              ['Small repeated escapes beat one giant one', 'A few inches at a time, taken repeatedly, beats an explosive bridge-and-scramble that gasses you. Grappling from bottom is patient inch-work.'],
              ['Drill it daily', 'Ten minutes of shrimps, bridges and technical stand-ups on your floor at home compounds faster than almost anything else you can do without a partner. The full solo routine is in the Drills tab.'],
            ]} />

            <Fold title="Bridging and hip heists — generating force from your back" tag="How a smaller person moves a bigger one" items={[
              ['The bridge (upa)', 'Feet planted close to your hips, drive through the HEELS and throw your hips as high as possible, turning toward one shoulder. Your hips and legs are the strongest thing you own — this is why a bridge can move someone far heavier than a bench press ever could.'],
              ['Bridge into space, not into them', 'A bridge straight up just lifts them and sets them back down. A bridge angled toward a direction where they have no post is what takes them over. Trap their arm and leg on that side first, or you are just doing hip thrusts under a person.'],
              ['The hip heist', 'From bottom, post on one hand and the opposite foot, then whip your hips through underneath you to turn onto your knees or come to your feet. The movement that gets you up without giving up your back.'],
              ['Combine, do not repeat', 'Bridge to make them post their weight one way, then shrimp the other way. Attacking twice in the same direction is how you get flattened; the bridge creates the reaction that makes the shrimp work.'],
              ['This is why hip thrusts are in the programme', 'End-range hip extension under load is exactly the bridging pattern. Programs → Legs covers the loading; here is where it gets used.'],
            ]} />

            <Fold title="Hip pressure on top — being heavy without being strong" tag="Why some training partners feel like a car is parked on you" items={[
              ['Weight goes through the hips, not the arms', 'In side control, drop your hips low and drive them into them while your chest pins their far shoulder. People who post on their hands to hold position are holding themselves UP, which makes them feel light and gives away leverage.'],
              ['Hips down, toes on the mat, drive', 'Sprawled legs, hips low, weight going forward and down through your hip bones. This is the difference between being on top of someone and being on top of someone in a way they cannot breathe under.'],
              ['Kill the hips to kill the escape', 'Every bottom escape starts with them moving their hips. Control their hips — with a knee, a hip-to-hip connection, a cross-face that stops them turning — and their escapes stop working before they start.'],
              ['Guard passing is a hip battle', 'Passing is about getting your hips past their hips while stopping them from re-inserting a knee or a foot in the gap. Pressure passing keeps hips low and connected; speed passing gets hips around the outside. Both are decided at hip level, not by hand fighting.'],
              ['Mount: hips forward and low', 'Climb the hips high toward their armpits and grip with the knees. High mount takes their escape leverage away entirely; sitting back on the hips with your weight over your feet gives them room to bridge.'],
              ['Hip-to-hip in the clinch', 'Getting your hip inside and under theirs is what makes throws and trips available. Whoever has the lower, more connected hip usually wins the exchange — this is the whole game in judo and greco.'],
            ]} />

            <Fold title="Hips in takedowns and the clinch" tag="Where the hip is the fulcrum you throw around" items={[
              ['Level change with the hips, chest up', 'Drop your hips by bending the knees, keep the chest tall, then drive the hips FORWARD through them on the penetration step. Everything about a double leg is hip drive; the arms are only there to hold on to what your hips already moved.'],
              ['Finish through, not into', 'The finish is your hips driving through their centre while your feet keep moving. Stopping the hips and pulling with the arms is why takedowns stall against resisting opponents.'],
              ['Hip in for throws', 'Hip throws, uchi mata and harai goshi all work by getting your hip lower than theirs and beneath their centre of mass, then rotating. If your hip is behind or beside them instead of under them, you are lifting with your back — which is both weak and how backs get hurt.'],
              ['The sprawl is a hip drop', 'Hips down and back hard, legs kicked out behind, weight through the hips onto their head and shoulders. Sprawling with the chest while the hips stay high does nothing — they simply drive under you.'],
              ['Hip control in the clinch', 'Underhooks let you control their hips at range. An underhook plus a lowered hip is the setup for most of the clinch offence in MMA — and denying theirs is most of the defence.'],
            ]} />

            <Block title="How to actually train this" items={[
              ['Solo, daily, 10 minutes', 'Shrimps, bridges, technical stand-ups, hip heists. Free, no partner, and it builds the hip-first default that everything else depends on.'],
              ['On the bag, one round of hips only', 'Cross and lead hook only, watching the heel spin on every rep. No combinations, no speed — just the rotation, until it stops feeling like a thing you have to remember.'],
              ['Positional sparring from bottom', 'Start under side control or mount and try only to escape. It forces hip movement under real resistance, which is the only place it becomes reflex.'],
              ['Film it side-on', 'Both striking and grappling. You cannot feel a flat rear heel or a shoulder-led shrimp, but you can see both instantly.'],
              ['Mobility matters here', 'Restricted hip internal and external rotation limits both the punch and the guard. Ninety-ninety hip switches, cossack squats and deep squat holds, five minutes daily — Programs → Recovery has the routine.'],
              ['The strength that supports it', 'Hip thrusts, rotational med ball throws and Pallof work are the gym expressions of everything on this page. They are in Programs → Explosive and Programs → Legs — this tab is the technique, that is the engine.'],
            ]} />
          </div>
        )}

        {tab === 'drills' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Target} title="Technique drills" sub="How the technique in the other tabs actually gets into your body. Solo, on the bag, and with a partner." />

            <div className="bg-gradient-to-br from-red-500/12 to-[#111] border border-red-500/25 rounded-2xl p-5">
              <h3 className="font-black text-red-300 mb-2">The rule that decides whether drilling works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Reps do not make permanent — <span className="text-gray-200 font-semibold">correct reps against progressively
                more resistance</span> make permanent. Mindless volume on a bag or a compliant partner builds a technique
                that evaporates the moment someone fights back. Every drill below has a stated intent and a way to add
                resistance. One focus per round, corrected between rounds, is worth more than an hour of freestyling.
              </p>
            </div>

            <Block title="Shadowboxing — the highest-value thing you can do alone" items={[
              ['Do it with an opponent in your head', 'The single difference between useful and useless shadowboxing. Picture a specific person at a specific range, react to what they do, and let their reactions dictate yours. Flailing at air builds bad habits at speed.'],
              ['Round 1 — footwork only', 'No punches. Move in, out and at angles, pivot off the lead, cut angles off the rear. Feet only, checked in a mirror or on film for whether they ever cross or go flat.'],
              ['Round 2 — one technique, 50+ reps', 'The thing you were worst at this week. Jab only, or double jab-cross, or level change to shot. Slow at first, speed as it cleans up.'],
              ['Round 3 — defence and counters', 'Slip, roll, catch, frame, then counter immediately. React to imagined attacks so the defensive movement always ends in an offensive one, because that is the habit you want in a fight.'],
              ['Round 4 — free, at fight pace', 'Everything, at intent, with clean breathing. Exhale on every strike.'],
              ['Film one round a week', 'On your phone, side-on. You will see three things you cannot feel: your chin lifting, your hands dropping on the way back, and your feet stopping when you punch. That is a full month of corrections in ninety seconds of footage.'],
            ]} />

            <Block title="Bag work — protocols, not just hitting" items={[
              ['Heavy bag — power rounds', '3 min: single hard shots with full sequencing and full reset between them. Hit through the bag, not at it. Feel the rear heel spin and the floor drive. Quality over quantity: 30 genuinely hard, correct shots beats 300 arm punches.'],
              ['Heavy bag — volume rounds', '3 min: combinations at 70%, continuous movement, never square up. This is conditioning that is also skill work — the specific quality that keeps your output up in round three.'],
              ['Double-end bag — timing and accuracy', 'The best solo tool for timing, because it moves unpredictably and punishes a lazy guard by hitting you back. Jab, slip, counter. 10 minutes here does more for accuracy than an hour on the heavy bag.'],
              ['The bag does not teach distance', 'A bag never moves away or hits back, so range and timing must be built with a partner or a double-end bag. This is why bag-only fighters look sharp on pads and get outboxed in sparring.'],
              ['Kick and knee rounds', 'Round kicks with the shin, turning the standing foot fully so the hip clears. Check that you return to stance every time rather than admiring the kick — the return is the part that gets punished.'],
              ['Wall drills for elbows and clinch strikes', 'Elbows and short knees into pads or a wall pad at close range, from a real clinch position with the head controlled, not standing off it.'],
            ]} />

            <Block title="Wrestling drills you can do alone" items={[
              ['Penetration step — 3×20 each side', 'From stance: level change with the CHEST UP, drive the lead knee down and forward between their feet, back knee follows, stand up through them. Do it slowly and correctly first. This one movement is most of a double leg and most of a single.'],
              ['Sprawl reps — 3×15', 'Hips down and back, legs kicked out behind, chest pressure onto the imagined head. Then immediately circle to an angle rather than staying square. Sprawls that stop at the sprawl teach you to survive, not to counter.'],
              ['Shot-to-sprawl — 3×10', 'Alternate: shoot, recover, sprawl, recover. This is the actual rhythm of a wrestling exchange and it is also brutal conditioning that costs no equipment.'],
              ['Stand-ups and hip heists — 3×10 each side', 'From bottom: post, frame, hip heist to your feet without turning your back. The most under-drilled skill in MMA, and the one that decides whether being taken down costs you a round.'],
              ['Wall or dummy shots', 'A grappling dummy or a padded wall lets you drill the finish, not just the entry. If you have neither, drill the entry on air, but be aware the finish is the part you are missing.'],
              ['Duck-unders and arm drags on a post', 'A door frame or heavy bag works as a stand-in for a body. Arm drag, duck under, take the back position. Reps here transfer directly to the clinch.'],
            ]} />

            <Block title="Ground solo drills — 10 minutes daily beats an hour weekly" items={[
              ['Shrimping / hip escapes — 3×10 each side', 'The single most important solo movement in grappling. On your side, frame, push off the floor and move your hips AWAY. Almost every escape from bottom is this movement.'],
              ['Bridging — 3×10 each side', 'Drive through the heels, lift the hips high, turn to the shoulder. Combine with a shrimp for the full upa escape from mount.'],
              ['Technical stand-up — 3×10 each side', 'Post on one hand and the opposite foot, hips up, sweep the leg through, stand facing them. How you get up in a fight without giving up your back.'],
              ['Granby rolls and inversions — 3×5', 'Rolling over the shoulder, never the head or neck. Builds the spinal mobility that makes guard retention possible. Start slowly and stop if the neck loads at all.'],
              ['Guard retention drills', 'On your back, legs in the air, moving from one guard position to another continuously for 60 seconds. Unglamorous and directly responsible for not getting passed.'],
              ['Movement flow — 3 min continuous', 'String them together: shrimp, bridge, technical stand-up, sit-through, repeat. Also excellent aerobic work that carries no impact cost.'],
            ]} />

            <Block title="Partner drills — where the real learning happens" items={[
              ['Positional sparring — the most underused tool', 'Start in a specific position (bottom mount, back taken, pressed against the cage) and go live from there, reset on escape or submission. Fixes bad positions vastly faster than free rolling, because free rolling lets you avoid your weaknesses.'],
              ['Constraint games', 'Sparring with an artificial rule: jab only, no hands (kicks and clinch only), one partner attacking and the other only defending, or grappling with one hand behind the back. Constraints force problem-solving that free sparring lets you dodge.'],
              ['Flow rolling at 30%', 'Continuous, cooperative movement with no muscling and no finishing. Builds transitions, timing and volume of exposure without the cost. Most technical improvement in grappling happens here rather than in hard rounds.'],
              ['Pad work with call-outs', 'The holder calls combinations reactively rather than counting out a fixed sequence, and occasionally throws back. Reactive pads train timing; memorised pad combos mostly train pad combos.'],
              ['Takedown entries against light resistance', 'Partner gives 30-50% resistance and is allowed to defend. Ramp the resistance over weeks. A takedown that only works on a compliant partner is not a takedown yet.'],
              ['Timed hard sparring, planned in advance', 'Decide the intensity and the goal BEFORE the round starts, and agree it with your partner. "Rounds where nobody knows the intensity" is how injuries and unnecessary head trauma happen.'],
            ]} />

            <Fold title="How to actually learn a new technique" tag="The sequence that makes it stick" items={[
              ['1. Understand the mechanism', 'Why does it work — what does it take away, where does the force go? A technique you can explain is one you can adapt when it half-fails. One you only copied is one you abandon the first time it does not work.'],
              ['2. Slow correct reps, ~50 of them', 'Deliberately slow, no resistance, checking each position. Speed at this stage just builds an error faster. Get corrected by a coach here, before it is habitual.'],
              ['3. Add resistance in steps', '30% resistance, then 50%, then 70%. Each step will break the technique somewhere new — that is the point, and the break tells you exactly what to fix.'],
              ['4. Live, in a constrained round', 'Positional sparring where you can only attempt that technique. Expect it to fail a lot at first.'],
              ['5. Free sparring, unplanned', 'It is genuinely yours when it appears without you deciding to use it. That is typically hundreds of reps over weeks, not one session.'],
              ['Two or three techniques at a time, not ten', 'Adding a new move every session is why people have a hundred half-techniques and no weapons. Pick a small number, drill them to the point of automation, then add. Depth beats breadth in every combat sport.'],
            ]} />

            <Block title="Structuring your own week of drills" items={[
              ['Daily — 10 min solo ground movement', 'Shrimps, bridges, technical stand-ups. Costs nothing, needs no partner, and compounds.'],
              ['3×/week — 15 min shadowboxing', 'Structured in rounds as above, filmed once a week.'],
              ['3×/week — bag or pad work', 'One power round, one volume round, one defensive round minimum.'],
              ['2-3×/week — partner drilling at the gym', 'Technique of the week, ramped through the resistance steps.'],
              ['1-2×/week — positional sparring', 'Chosen deliberately around your worst position, which is the one you least want to pick.'],
              ['1×/week — free sparring', 'Controlled, with a stated goal, and a hard stop. This is a test of your training, not the training itself.'],
            ]} />
          </div>
        )}

        {tab === 'arts' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Swords} title="The martial arts, honestly" sub="What each one actually teaches, what it costs you, and where to start." />

            <div className="bg-gradient-to-br from-red-500/12 to-[#111] border border-red-500/25 rounded-2xl p-5">
              <h3 className="font-black text-red-300 mb-2">The one question that sorts every art</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Does the school practise against a <span className="text-gray-200 font-semibold">fully resisting opponent
                who is genuinely trying to stop you</span>? Arts that spar or roll live — boxing, wrestling, BJJ, judo,
                Muay Thai, sambo — produce skill that works under pressure, because it is tested every session. Arts that
                practise only against compliant partners produce skill that has never been tested, and the gap only shows
                up when it is too late to matter. That single question tells you more than any lineage, belt or history.
              </p>
            </div>

            <SectionTitle icon={Users} title="The grappling arts" />

            <Fold title="Brazilian Jiu-Jitsu (BJJ)" tag="Ground fighting, submissions, the great equaliser" items={[
              ['What it teaches', 'Controlling and submitting someone on the ground using position, leverage and joint locks or chokes. The core claim — that a smaller trained person can control a larger untrained one on the ground — is genuinely true, and it is the closest thing to a cheat code that martial arts offers.'],
              ['Gi vs no-gi', 'Gi uses the jacket for grips: slower, more technical, more control-based. No-gi is faster, closer to MMA, and grips rely on the body itself. Do both if you can; if you only want MMA, weight it toward no-gi, but the gi will make your details sharper.'],
              ['What a first class is like', 'Warm-up, technique of the day drilled with a partner, then rolling (live sparring) at the end. You will be submitted repeatedly by smaller people and it will be humbling. That is the normal, correct experience and it is not a sign you are bad at it.'],
              ['Grading and timeline', 'White, blue, purple, brown, black, with stripes in between. Blue belt typically takes 1-2 years of consistent training; black belt commonly takes 10 or more. It is one of the slowest grading systems in martial arts, deliberately.'],
              ['The honest limitation', 'On its own it does not address strikes, and going to the ground with multiple opponents or on concrete is a bad idea. Superb art, incomplete self-defence system by itself — which is exactly why it is one half of MMA rather than all of it.'],
              ['Gear and cost', 'A gi (£60-120) or rashguard and shorts for no-gi, plus a mouthguard. Typically £60-100/month in the UK. Trim your nails — it is the most common thing new people get told off for.'],
            ]} />

            <Fold title="Wrestling" tag="The highest-leverage base in MMA" items={[
              ['What it teaches', 'Taking someone down, staying on top, and refusing to be taken down. It also builds a conditioning base and a mentality that transfers to everything else — wrestling rooms are famously the hardest training environments in sport.'],
              ['Why it matters most in MMA', 'Wrestling decides WHERE the fight happens: standing or on the ground. Whoever controls that usually controls the fight. If you are choosing one grappling base purely to be good at MMA, wrestling is the answer.'],
              ['Freestyle, Greco-Roman, folkstyle', 'Freestyle allows attacks on the legs. Greco-Roman is upper-body only — brilliant for clinch and throws, and the best possible training for MMA cage work. Folkstyle (mostly American) emphasises control and riding on top.'],
              ['The catch in the UK', 'Wrestling clubs are far less common here than in the US or Eastern Europe. Look for MMA gyms with a dedicated wrestling coach, university clubs, or a judo/sambo club as a substitute. This scarcity is the single biggest practical obstacle to a British MMA career.'],
              ['What a session is like', 'Hard. Long warm-ups, drilling entries hundreds of times, live goes. Expect to be exhausted and expect mat burn. The technical rate of return per hour is very high.'],
              ['Gear', 'Wrestling shoes, a mouthguard, and headgear if you value your ears. Very cheap by martial arts standards.'],
            ]} />

            <Fold title="Judo" tag="Throws, grip fighting, and the most transferable clinch skill there is" items={[
              ['What it teaches', 'Throwing someone using their balance and momentum, plus grip fighting, pins and some submissions. A well-timed judo throw is the most spectacular thing in martial arts and it works because it uses their movement rather than your strength.'],
              ['Why it complements everything', 'Judo owns the clinch — exactly the range between striking and the ground where most real altercations and many MMA exchanges happen. Judo players also learn to fall properly (ukemi), which is a genuinely useful life skill.'],
              ['Timeline and grading', 'Coloured belts to black; black belt typically 4-6 years. Widely available in the UK through a well-organised club system, and usually cheaper than BJJ or MMA gyms.'],
              ['The adaptation needed for MMA', 'Competition judo relies heavily on gi grips that do not exist in MMA, and its rules discourage leg grabs. The throws still work, but the entries have to be rebuilt around body locks and underhooks rather than sleeve and lapel.'],
              ['Physical cost', 'You will be thrown, repeatedly, from day one. Learn to breakfall properly before anything else, and be honest with your coach about any back or shoulder issues.'],
            ]} />

            <Fold title="Sambo, catch wrestling and the rest" tag="Worth knowing they exist" items={[
              ['Sambo', 'Soviet-developed blend of judo throws and submission grappling; Combat Sambo adds striking, which makes it about the closest single traditional art to MMA. Excellent leglock culture. Rare in the UK but outstanding if you find a real coach.'],
              ['Catch wrestling', 'Submission wrestling with a brutal, pin-and-punish flavour. Historically important, currently niche, and quality varies enormously by coach.'],
              ['Sumo', 'Genuinely elite at balance, leverage and explosive clinch entries, though the ruleset limits transfer. Nobody is suggesting you take it up — but do not laugh at the athleticism.'],
              ['The general rule', 'Any grappling art where you regularly go live against someone resisting will make you meaningfully harder to handle. The specific label matters far less than whether the room does live rounds.'],
            ]} />

            <SectionTitle icon={Hand} title="The striking arts" />

            <Fold title="Boxing" tag="The best hands in the world, and the most refined footwork" items={[
              ['What it teaches', 'Punching, defensive head movement, footwork and distance management at a level no other art touches. Boxers hit harder and are far harder to hit than practitioners of arts that split their attention across more weapons.'],
              ['Why it is the best striking starting point', 'Fastest route to being genuinely dangerous with your hands, and its footwork and distance sense transfer to everything. Most great MMA strikers have a boxing layer underneath whatever else they do.'],
              ['The MMA adjustment', 'Boxing stance is narrower and more side-on than an MMA stance, which is fine for punching and terrible for defending takedowns and leg kicks. Learn boxing, then widen and square the stance for MMA — do not skip the adjustment.'],
              ['What a session looks like', 'Shadowboxing, bag work, pads, technical sparring. A good boxing gym will not let you spar hard for weeks, and that is a sign of quality, not gatekeeping.'],
              ['The cost, honestly', 'Head trauma. Boxing sparring means repeated head impacts, and that risk is cumulative. Control the dose deliberately — technical sparring, good headgear where appropriate, and never spar concussed.'],
            ]} />

            <Fold title="Muay Thai and kickboxing" tag="Eight limbs, and the best clinch in striking" items={[
              ['What Muay Thai teaches', 'Punches, elbows, knees, kicks and the plum clinch. Shin conditioning, brutally effective low kicks, and a clinch game that no other striking art has. It is arguably the most complete stand-up striking system there is.'],
              ['Why it fits MMA so well', 'Leg kicks, knees and clinch knees are all legal in MMA and all under-defended by pure boxers. The upright stance and heavy kicks do have to be adapted — a heavily loaded lead leg is a takedown invitation.'],
              ['Kickboxing (Dutch style especially)', 'Punch-kick combination heavy, with less clinch and no elbows. Dutch-style kickboxing has some of the best combination striking in the world and is often more available locally than authentic Muay Thai.'],
              ['What to expect early', 'Sore shins, and a lot of pad work. Shin conditioning is a slow adaptation through repeated moderate contact on pads and bags — not by hitting trees or bats, which is folklore that will just injure you.'],
              ['Gear', 'Shin guards, gloves, mouthguard, and hand wraps. Around £100 to get started properly.'],
            ]} />

            <Fold title="Karate, Taekwondo and the traditional strikers" tag="Real skills, often oversold, occasionally underrated" items={[
              ['What is genuinely good', 'Kyokushin karate spars hard with full-contact body shots and produces genuinely tough strikers. Point karate produces exceptional explosive distance closing — Lyoto Machida and Stephen Thompson made that work at the highest level of MMA. Taekwondo produces the best kicking speed and variety anywhere.'],
              ['What is oversold', 'Styles where sparring is light point-tag or non-existent, where kata is the main content, or where the syllabus is built around grading fees. These produce fitness and discipline — real benefits — but not fighting skill, and it is worth being honest with yourself about which you are buying.'],
              ['The distance question', 'Traditional strikers often excel at long range and struggle badly once someone closes in and clinches, because the ruleset never made them solve that problem. Anything you learn here needs a grappling layer added.'],
              ['How to judge a specific club', 'Watch a class before joining. Is there live sparring against resistance? Do senior students get hit and have to adapt? Is the instructor willing to spar? Those answers matter more than the style name on the door.'],
            ]} />

            <Fold title="The self-defence question, and what to be sceptical of" tag="Said plainly, because this is where people get sold things" items={[
              ['Arts that do not pressure-test', 'Aikido, wing chun and similar arts contain interesting principles but are typically practised with compliant partners, and their practitioners have not performed well when tested against resisting opponents. Train them if you enjoy them — just do not mistake them for a fighting skill you can rely on.'],
              ['"Too deadly to spar"', 'This claim is always a red flag. Eye gouges and groin strikes are not a system, and every effective art has found a safe way to practise its techniques against resistance. If a school cannot pressure-test anything, it cannot verify anything.'],
              ['Krav Maga and reality-based systems', 'Quality varies enormously. Good schools pressure-test drills against resisting partners and are genuinely useful; poor ones are choreography with aggressive branding. The live-resistance test sorts them.'],
              ['McDojo warning signs', 'Long contracts, expensive mandatory gradings on a fixed schedule, black belts awarded to young children, no sparring, an instructor who never rolls or spars, and claims of unbeaten lineages.'],
              ['What actually works for self-defence', 'Awareness, de-escalation and leaving. Then, if it is genuinely unavoidable: the ability to punch, to not be taken down, to get back to your feet, and the fitness to run. Boxing plus wrestling covers most of that. This is also stated in the Strategy tab, and it is worth repeating.'],
              ['Weapons and multiple attackers change everything', 'No unarmed art solves those reliably. Anyone claiming otherwise is selling something. Distance and exit are the answer.'],
            ]} />

            <SectionTitle icon={Target} title="Choosing and starting" />

            <Block title="What to train, in what order" items={[
              ['If you want to do MMA', 'Wrestling or BJJ as your base, plus boxing or Muay Thai for striking, then MMA classes to integrate them. Two to three sessions a week of each is plenty at the start — the integration is a skill in itself and it is easy to become two separate half-fighters.'],
              ['If you want one art only', 'BJJ for the deepest technical rabbit hole and the lowest injury rate; boxing for the fastest route to being genuinely dangerous; Muay Thai for the most complete striking; wrestling for the most transferable athleticism.'],
              ['If you are starting from zero and unsure', 'Do a month of BJJ and a month of boxing, then pick the room you actually enjoyed. Consistency beats optimal selection by a wide margin — the best art is the one you will still be doing in three years.'],
              ['Order within a session', 'Technical work while fresh, hard rounds later. Order within a week: hard sparring on a day you are recovered, not the day after heavy legs. The full scheduling logic is in Programs → The Week.'],
              ['How long until you are competent', 'Roughly 6-12 months of twice-weekly training before you stop feeling completely lost, 2-3 years before you are genuinely useful, and it never stops after that. Anyone promising faster is selling.'],
              ['Do not gym-hop', 'One good coach for two years beats five gyms for four months each. Depth compounds; breadth at the start just produces confusion.'],
            ]} />

            <Block title="How to pick a gym — the checklist" items={[
              ['Watch a class first', 'Any decent gym will let you. Look for live sparring, people of varied ages and sizes, and beginners being coached rather than punished.'],
              ['Look at how sparring is run', 'Is intensity controlled and agreed? Are new people protected? A gym where beginners get beaten up is not tough, it is badly run, and it has a high injury rate and a revolving door.'],
              ['Check the coach\'s actual record and lineage', 'For BJJ, who awarded their black belt. For boxing, who they have trained. Not because credentials are everything, but because the fraudulent end of this industry is large.'],
              ['Cleanliness is a real safety issue', 'Mats cleaned daily, a no-training-with-skin-infections rule that is enforced. Ringworm and staph are common in badly run grappling gyms.'],
              ['Trial before contract', 'Almost all good gyms offer a free or cheap trial week. Anyone demanding a 12-month commitment before you have trained once is telling you something.'],
              ['The vibe test', 'You will spend hours in close physical contact with these people. If the room feels egotistical or unsafe on the trial, it will not improve once you have paid.'],
            ]} />

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs leading-relaxed">
                The technique tabs here are references for what you learn in those rooms, not a substitute for them.
                Nothing on this page replaces a coach watching you move — particularly for throws and takedowns, where
                the errors that matter are ones you cannot feel yourself.
              </p>
            </div>
          </div>
        )}

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
            <SectionTitle icon={Target} title="Other opponent types" sub="The archetypes you actually meet, and the answer to each." />

            <Fold title="Someone more skilled than you" tag="The hardest problem, and the most useful to solve" items={[
              ['Accept the honest baseline', 'If they are genuinely more skilled, you will probably lose a clean technical exchange. Your goal is not to out-box a better boxer — it is to change the game to one they have practised less. Refusing to accept this is why people lose badly instead of narrowly.'],
              ['Take away their preferred range', 'Every skilled fighter has a range where their skill compounds. A slick boxer wants mid-range; a good grappler wants the clinch. Identify it in the first thirty seconds, then live anywhere else — even if the alternative is less comfortable for you too.'],
              ['Force scrambles and chaos', 'Skill advantages are largest in clean, predictable exchanges and smallest in scrambles. Grip fighting, clinch work, broken rhythm and constant position changes cost them more than they cost you.'],
              ['Volume and pressure over precision', 'You will not out-time them. You can sometimes out-work them. Constant forward pressure with a high guard, body work and clinch entries makes technical fighters uncomfortable and drains the composure their skill depends on.'],
              ['Break the rhythm deliberately', 'Skilled fighters read patterns. Change tempo, throw on odd counts, feint without following, pause mid-combination. Predictability is what they are feeding on.'],
              ['Steal something every round', 'Even in a loss: one clean entry, one takedown, one good exchange. Training with better people is the fastest way to improve, and the correct mindset is data collection, not survival. Ego here costs you years.'],
            ]} />

            <Fold title="Someone smaller and faster" tag="Being the bigger one is its own problem" items={[
              ['Do not chase — cut the ring', 'Chasing a faster person means running into counters all night. Move diagonally to cut off their escape routes rather than following them in a straight line. Take away space, not distance.'],
              ['Make them come to you', 'A jab held out as a wall, feints, and patience. Faster fighters are usually more comfortable initiating; take that away and many of them stall.'],
              ['Your weight is the weapon — use the clinch', 'Chest-to-chest, underhooks, and lean. Speed matters much less at zero distance, and this is where your size actually converts into an advantage instead of just being mass you carry.'],
              ['Expect uppercuts and low entries', 'Smaller fighters come in low and underneath. Keep your elbows in and your chin down, and meet their entries with knees or a frame rather than reaching down for them.'],
              ['Body work, not head hunting', 'Their head is a moving target; their body is not, and it does not move as fast. Body shots also slow legs, which is what their whole game runs on.'],
              ['Do not gas trying to catch them', 'The classic loss for a bigger fighter: three rounds of chasing, empty by round two. Set a pace you can hold and let them come to you.'],
            ]} />

            <Fold title="The aggressive brawler" tag="Wild, forward, hits hard, no defence" items={[
              ['The danger is real even though it is untrained', 'Wild swings from a big committed person hurt, and unpredictability is genuinely hard to read. Do not be dismissive because it is technically bad — untrained aggression has ended plenty of trained fighters.'],
              ['Circle away from the power hand', 'They load one side. Move away from it, not into it. This alone defuses most of the danger.'],
              ['Meet them with straight shots', 'Their punches loop; straight lines get there first. A jab or straight down the middle as they wind up lands before their swing arrives.'],
              ['Or tie them up immediately', 'Clinch, underhooks, walk them to a wall. A brawler with no space and no leverage becomes a much smaller problem, and they usually have no idea what to do there.'],
              ['Let them empty the tank', 'All-out aggression is expensive. If you survive the first thirty to sixty seconds intact, the situation often changes completely.'],
            ]} />

            <Fold title="The wrestler / grappler, and the pure striker" tag="Two opposite problems" items={[
              ['Against a wrestler — the fight starts before the shot', 'Takedown defence is mostly positioning: stay at range or in the clinch, not in the middle. Keep your hips back, chest up, elbows in. React to level changes, not to hand feints.'],
              ['Against a wrestler — punish entries', 'Every shot they miss costs them. Sprawl, front headlock, then knees or a guillotine threat. Make shooting expensive and the frequency drops.'],
              ['Against a wrestler — get up immediately', 'If you are taken down, the priority is standing up, not playing guard. Every second underneath is damage and lost rounds. Wall walks and technical stand-ups are the drills that matter.'],
              ['Against a pure striker — close the distance or take it down', 'Do not stand in their range trading. Level change behind a punch, clinch, and take the fight where their training stops.'],
              ['Against a pure striker — the clinch is the great equaliser', 'Most strikers with no grappling become passengers the moment underhooks are in and their base is broken.'],
              ['The general principle', 'Every specialist has a range where they are dangerous and a range where they are lost. Find the second one and stay there.'],
            ]} />

            <Fold title="Southpaws and the stance problem" tag="Why an orthodox fighter suddenly looks clumsy" items={[
              ['Win the outside foot', 'The whole open-stance game is decided by whose lead foot is on the outside. Get yours outside theirs and your rear hand has a clear line while theirs does not. Lose it and everything they throw arrives first.'],
              ['Circle away from their power hand', 'Against a southpaw that means circling to your left, away from their left cross. Circling the wrong way is the single most common orthodox error and it walks you straight into the shot.'],
              ['The lead hand fight', 'Open stance turns the lead hands into a wrestling match — pawing, parrying, controlling. Whoever controls the other\'s lead hand controls the exchange.'],
              ['Best weapons in open stance', 'Rear straight down the middle, lead hook over their lead hand, and rear low kick to the outside of their lead leg. These are the shots the angle gives you for free.'],
              ['Train it deliberately', 'Ask for southpaw partners on purpose. Most people are bad against southpaws purely from lack of exposure, and that is fixable in weeks rather than years.'],
            ]} />

            <SectionTitle icon={Shield} title="The street — the honest version" sub="Different rules, different stakes, and mostly a different skill set from the gym." />

            <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5">
              <h3 className="font-black text-amber-300 mb-2">Read this before the tactics below</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                There is no winning a street fight — there are only degrees of losing. The realistic outcomes are a
                criminal record, a hospital visit, a life-changing head injury from concrete, or a knife you never saw.
                People die from a single punch and an unlucky fall onto a kerb with genuine regularity. Being trained
                changes the odds inside the fight; it changes almost nothing about those consequences, and it can make
                things worse legally because a court may hold a trained person to what they should have known.
                <span className="text-amber-200 font-semibold"> Everything below assumes you have already failed to
                leave, and leaving remains the only actual win.</span>
              </p>
            </div>

            <Fold title="Not being scared — what fear actually is and how to work with it" tag="The part you asked about, and the part nobody explains" items={[
              ['You will not eliminate fear, and you should not want to', 'The adrenaline dump is a physiological response you do not get to switch off. It is also useful — it is speed, strength and pain tolerance being handed to you. The goal is to FUNCTION while afraid, not to feel nothing. Anyone claiming they feel nothing is lying or has a problem.'],
              ['Know what it does to your body so it does not surprise you', 'Tunnel vision, auditory exclusion (you stop hearing things), time distortion, shaking hands, loss of fine motor control, and the legs-like-jelly feeling. All normal, all temporary. Most of the panic in a confrontation is people being frightened BY their own fear response because nobody told them it was coming.'],
              ['Gross motor skills only', 'Fine motor control degrades sharply under adrenaline. Under real stress you get simple, big movements: straight punches, elbows, knees, clinch, sprawl. This is why your training should have a small number of very well-drilled tools rather than a large catalogue.'],
              ['Breathe — the one thing you can consciously control', 'Combat/box breathing: in for four, hold four, out for four, hold four. It genuinely lowers heart rate and restores peripheral vision. Practise it when you are calm so it is available when you are not.'],
              ['The only real cure is exposure', 'Sparring is graduated exposure to the fear of being hit. That is most of its value — far more than the techniques. Someone who has sparred for two years is not braver, they are just no longer surprised. This is why the gym answers the question "how do I stop being scared" better than any mindset content can.'],
              ['Fear of the confrontation, not the fight', 'Most of what people call fear is social: fear of looking weak, of backing down in front of others. That is ego, and it is what actually gets people into fights they could have walked away from. Separating the two is the single most valuable thing on this page.'],
              ['After the adrenaline: the crash', 'Shaking, nausea, exhaustion, sometimes tears, and often a delayed emotional hit hours later. Also normal. If a confrontation genuinely affects you afterwards, that is worth talking to someone about rather than sitting on.'],
            ]} />

            <Fold title="Before it starts — where it is actually won" tag="Awareness, de-escalation, and the exit" items={[
              ['Awareness is 90% of it', 'Most incidents are avoidable minutes before they happen. Head up, phone away in unfamiliar places, notice who is around and where the exits are. Predatory violence selects for distraction and isolation — being visibly aware moves you out of the selection set entirely.'],
              ['The fence — hands up, non-threatening, ready', 'Hands open and up around chest height, palms out, body angled slightly. It looks placating and it is actually a guard, and it maintains the distance you need. Never let someone close inside arm\'s reach while you have your hands down.'],
              ['De-escalate with your ego switched off', 'Calm voice, low tone, no insults, no sarcasm, no staring contest. "You\'re right, my fault, I\'m leaving." Being able to say that in front of other people is the highest form of composure this section describes, and it is far harder than throwing a punch.'],
              ['Watch for the pre-fight tells', 'The distance close, the glance around for witnesses, the shoulders dropping or squaring, the hands hiding or rising, sudden stillness after agitation, the "what did you say?" step in. When those stack up, the decision window is closing.'],
              ['Leave early and unapologetically', 'The moment you feel it turning, go. Not after one more sentence. The chance to leave is a door that closes, and people usually notice it only once it has.'],
              ['Know the UK legal position', 'You may use force that is reasonable in the circumstances as you honestly believed them to be, including pre-emptive force if you genuinely believe an attack is imminent. What you may NOT do is continue once the threat has stopped, or pursue. That distinction — defending versus continuing — is what decides most prosecutions. This is a summary, not legal advice.'],
            ]} />

            <Fold title="If it is genuinely unavoidable" tag="Assuming you cannot leave" items={[
              ['Do not wait to be hit', 'If you have genuinely reached the point where an attack is imminent and there is no exit, waiting to react hands them the first shot. In UK law reasonable pre-emptive force is lawful — the honest framing is that this is a judgement about imminence you have to make and account for.'],
              ['Simple, gross-motor tools only', 'Straight punch, elbow, knee, clinch, and get to a wall. Nothing fine, nothing flashy, nothing that requires the opponent to cooperate. Everything you would do under adrenaline should already be automatic.'],
              ['Do not go to the ground on purpose, ever', 'The ground is the worst place in a street context — concrete, his friends, no referee. Everything you know about the ground should be used to GET UP, not to play guard. This is the single biggest difference between the gym and the street.'],
              ['Assume there is a second person', 'Almost never one-on-one when it matters. Keep moving, never let anyone get behind you, never back yourself into a group. Fighting one person while three watch is a fight you are already losing.'],
              ['Assume a weapon until proven otherwise', 'Watch the hands. A hand that stays hidden, goes to a waistband or pocket, or leads the other person forward is the highest-priority thing in the situation. Against a weapon there is no technique — there is distance, an object between you, and leaving. Anyone teaching you knife disarms as a primary plan is selling you confidence, not safety.'],
              ['The exit is the objective, not the win', 'Create enough space or disruption to leave, then leave. Standing over someone to prove a point is how a self-defence case becomes an assault charge, and how a fight becomes a death.'],
              ['Afterwards', 'Leave the area, call the police yourself first if it was serious — the first person to report is treated very differently from the one who fled — get medical attention for any head impact, and write down what happened while it is fresh. Do not post about it.'],
            ]} />

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

        {/* ============ GYM ============ */}
        {tab === 'gym' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Zap} title="Force production for fighting" sub="Where power actually comes from, what transfers, and the plan that builds it." />

            <div className="bg-gradient-to-br from-red-500/12 to-[#111] border border-red-500/25 rounded-2xl p-5">
              <h3 className="font-black text-red-300 mb-2">Read this first — the one idea that organises everything</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You do not punch with your arm, and you do not lift someone with your back. Every hard thing you do in a
                fight is <span className="text-gray-200 font-semibold">force pushed into the floor, passed up through the
                hips and trunk, and delivered out of a limb</span>. That means three separate qualities have to be trained,
                and they are not the same thing: how much force you can produce at all (max strength), how fast you can
                express it (rate of force development), and how well your trunk transmits it instead of leaking it
                (stiffness and anti-rotation). A stronger bench does almost nothing for your cross. A faster hip turn
                through a braced trunk does.
              </p>
            </div>

            <Fold title="The kinetic chain — how a punch actually generates force" tag="The physics, because it changes what you train" items={[
              ['It starts at the floor', 'Ground reaction force. You push into the mat with the rear leg, and the floor pushes back. No floor contact, no power — which is exactly why punches thrown off the back foot, jumping, or while being walked backwards have almost nothing on them.'],
              ['Proximal to distal sequencing', 'Force travels legs → hips → trunk → shoulder → fist, each segment accelerating and then decelerating to pass energy to the next, like a whip. The hand is the last and lightest link. Elite strikers are not stronger in the arm — they sequence better and time the segments so the peaks stack.'],
              ['Rotation is the engine', 'Rear leg drive turns into hip rotation, hip rotation into trunk rotation. The single biggest contributor to cross and hook power is hip and trunk rotational velocity. This is why rotational medicine ball work and anti-rotation core work matter far more for a fighter than crunches ever will.'],
              ['Effective mass — the bit people miss', 'Force at impact depends on the mass BEHIND the fist at the moment of contact. A relaxed arm that stiffens at impact, with the shoulder locked and the whole body connected to the ground, lands vastly heavier than a tense arm thrown at the same speed. This is why "relax, then snap" is coached everywhere: relaxation lets the whip work, and the late stiffening delivers your bodyweight instead of your arm weight.'],
              ['Impulse — force applied over time', 'Takedowns, clinch drives and sweeps are impulse problems, not peak-force problems. You need a big force sustained for a few tenths of a second while your feet keep driving. That is a different quality from a maximal squat, and it is trained with sleds, bear crawls and live drilling against resistance.'],
              ['Why this makes bodybuilding a poor fit', 'Muscle that is not connected to the sequence is dead weight you have to carry and fuel for 15 minutes. Adding size for its own sake costs you conditioning and your weight class. Train the qualities, and let the size arrive as a side effect.'],
            ]} />

            <Fold title="The five qualities that actually transfer" tag="Everything in your programme should be one of these" items={[
              ['1. Maximal strength — the ceiling', 'You cannot express force you cannot produce. Below roughly a 1.5× bodyweight squat or 2× bodyweight trap-bar deadlift, general strength IS your limiting factor and getting stronger will make you a better fighter. Above it, extra maximal strength buys less and less, and the training focus should shift to speed and skill.'],
              ['2. Rate of force development (RFD)', 'How fast you can turn strength on. A fight gives you about 0.1-0.2 seconds to produce force in a punch or a shot — far less time than a heavy squat takes. RFD is trained with intent: light-to-moderate loads moved as fast as humanly possible, jumps, throws, and Olympic-lift derivatives.'],
              ['3. Elastic / reactive strength', 'Your tendons store and return energy. This is what makes level changes, re-shots, scrambles and rebounding footwork cheap instead of exhausting. Trained with plyometrics — pogos, bounds, hurdle hops, depth jumps — and it is the quality most fighters neglect entirely.'],
              ['4. Rotational power and trunk stiffness', 'The transmission. If your trunk gives way under rotation, force generated by the hips never arrives at the fist. Both halves matter: the ability to rotate fast (med ball throws, cable rotations) and the ability to REFUSE to rotate (Pallof, suitcase carries, anti-rotation holds).'],
              ['5. Repeatability — the engine', 'Producing a great punch once is training. Producing it in the last minute of round three is fighting. That is a conditioning quality, and it is trained separately, mostly aerobically, which surprises people who assume fight conditioning means constant suffering.'],
            ]} />

            <SectionTitle icon={Zap} title="The exercise menu" sub="Chosen for transfer, not for how hard they feel. Sets × reps and the intent that makes each one work." />

            <Block title="Maximal strength — 2×/week, the base" items={[
              ['Trap bar deadlift — 4×3-5 @ 80-88%', 'The single best general strength lift for a fighter: heavy loading of the whole posterior chain with a far lower spinal cost than a conventional pull. Drive the floor away, do not yank. This is your takedown and sprawl strength.'],
              ['Back or front squat — 4×4-6', 'Front squat if your trunk gives out first, back squat if your legs do. Go to depth you can control without the pelvis tucking. Half squats have their place for speed work, but build the full-range base first.'],
              ['Barbell hip thrust — 3×6-8', 'Trains hip extension at the exact end range that finishes takedowns, bridges people off you, and drives the rear hip through a cross. Squeeze hard at the top for a full second; bouncing the bar is wasted work.'],
              ['Weighted chin-up — 4×4-6', 'Grappling is decided by pulling. Add weight once you can do 10-12 clean bodyweight reps. Full hang each rep — the bottom is where the arm-bar-resisting strength lives.'],
              ['Push press or incline press — 3×5', 'Overhead pressing under a leg drive mirrors framing, posting and pushing off the cage. Incline over flat bench: it is closer to a punching angle and far kinder to the front of the shoulder.'],
              ['Heavy carries — 3×40m', 'Farmer\'s or suitcase carries. Trains grip, trunk stiffness and breathing under load in one, and the suitcase (single-side) version is anti-rotation training that also happens to be conditioning.'],
            ]} />

            <Block title="Speed and power — 2×/week, always fresh, never tired" items={[
              ['Rotational med ball throw — 4×3 each side', 'The most fight-specific power exercise there is. Load the rear hip, then throw the ball into a wall as violently as possible, letting the rear heel spin exactly as it does on a cross. Use a 3-5kg ball: heavier does not mean more power, it means slower and less like a punch.'],
              ['Med ball shot-put throw — 4×3 each side', 'From a staggered stance, drive with the rear leg and push the ball through your target line. This is the straight-punch pattern with resistance, and it teaches leg-drive-first sequencing better than any cue.'],
              ['Overhead slam — 3×5', 'Trains the trunk to produce force in flexion at speed — the pattern behind a hard elbow, a bodylock finish and passing pressure. Slam it with intent to break the floor.'],
              ['Trap bar jump — 4×3 @ 20-30% 1RM', 'Loaded jumps sit exactly in the middle of the force-velocity curve and are one of the best-evidenced ways to build lower-body power. Light load, maximum intent, land soft, full rest.'],
              ['Broad jump / bound — 4×3', 'Horizontal power, which is what a shot and a sprawl actually are. Vertical jumps alone miss the plane that fighting lives in.'],
              ['Pogo hops and hurdle hops — 3×8', 'Short ground contacts, stiff ankles, minimal knee bend. This is the elastic quality that makes footwork and re-shots cheap. Quality dies fast — stop the set the moment contacts get slow and mushy.'],
              ['The rule that makes all of this work', 'Every rep is at 100% intent, with FULL recovery (2-3 min). Power training done tired becomes conditioning, and conditioning done at power weights becomes injury. If reps are slowing down, the set is over.'],
            ]} />

            <Block title="Rotation and trunk — 3×/week, the transmission" items={[
              ['Pallof press — 3×8 each side', 'The foundational anti-rotation exercise: resist the pull rather than producing movement. Full progression with kneeling, split and overhead variations is in Programs → Core & Abs.'],
              ['Cable or landmine rotation — 3×8 each side', 'Rotate from the HIPS with the ribs stacked, not by twisting the lower back. The lumbar spine only safely rotates a few degrees in total — the rotation you want comes from the hips and the thoracic spine.'],
              ['Half-kneeling chop and lift — 3×10 each', 'Removes the legs so the trunk has to do the work, and it exposes exactly which side of you is leaking force. Almost everyone has a clearly worse side; that side gets an extra set.'],
              ['Suitcase carry — 3×30m each side', 'Load on one side only, walk without leaning. Anti-lateral-flexion strength, which is what keeps you upright when someone is dragging you sideways in the clinch.'],
              ['Hollow body and side plank holds — 3×30-45s', 'Braced positions under time. Unglamorous and directly responsible for whether hip force arrives at your fist or dissipates through a soft midsection.'],
              ['Thoracic mobility — daily 5 min', 'Rotation you do not have is force you cannot produce. Open-book rotations, thread-the-needle, and foam roller extensions. A stiff upper back forces the lower back to rotate instead, which is how backs get hurt.'],
            ]} />

            <Block title="Neck, grip and the durability work" items={[
              ['Neck — 3×/week, this is not optional', 'A stronger neck reduces head acceleration when you get hit, which is the mechanism behind concussion. Isometric holds in four directions (30s each), then harness or band work 2×15 for flexion, extension and both sides. Build slowly over months; the neck responds to consistency, not intensity, and aggressive bridging on a fresh neck is how people get hurt.'],
              ['Grip — the clinch decider', 'Fat-bar or towel hangs 3×max, gi or rope pull-ups, and plate pinches. Grip endurance loses more clinch exchanges than grip strength does, so train holds for time, not just heavy singles.'],
              ['Nordic hamstring curls — 3×5, 2×/week', 'Cuts hamstring injury risk substantially and protects you in the exact positions where legs get extended fast. Lower slowly, cheat back up with your hands.'],
              ['Copenhagen adductor plank — 3×20s each side', 'Groin strains are one of the most common and most annoying grappling injuries, and this is the best-evidenced prevention exercise for them. Start with the short-lever (knee-supported) version.'],
              ['Ankles and feet', 'Every level change, pivot and kick lands on an ankle. If yours are weak, the full ramp-up progression is in Programs → Legs — do that before adding heavy plyometrics, not after.'],
              ['Shoulders — external rotation and scapular work', 'Face pulls, band external rotations, and controlled dumbbell work 2×/week. Armbars, kimuras and posting all stress the shoulder, and the joint gets no protection from anything else you do.'],
            ]} />

            <SectionTitle icon={Zap} title="Conditioning — building the engine" sub="Fight conditioning is mostly aerobic. This surprises people who think it should mostly hurt." />

            <Fold title="The energy systems, and what each one is for" tag="Stop doing hard intervals for everything" items={[
              ['Alactic power (0-10s)', 'The explosive burst: a takedown entry, a scramble, a flurry. Trained with 6-10s maximum efforts and LONG rests (60-90s+), never to fatigue. Fatiguing this system trains something else entirely.'],
              ['Glycolytic (10s-2min)', 'The burning, gasping system. The one everyone over-trains because it feels like "real" conditioning. Some exposure is necessary so it does not shock you in a fight, but a lot of it wrecks recovery, blunts strength gains and eats the skill sessions that actually matter. One session a week is usually plenty.'],
              ['Aerobic (everything else)', 'This is the big one. It powers your steady output, and crucially it drives how fast you RECOVER between bursts, within a round and between rounds. Round three is an aerobic problem. Most amateurs are aerobically underdeveloped and try to fix it with more sprints, which makes it worse.'],
              ['Zone 2 — 2-3×/week, 30-60 min', 'Easy running, cycling or rowing at a pace where you could hold a conversation. Boring, and it is the single highest-return conditioning work a fighter can do. It builds the aerobic base without adding fatigue that costs you sparring quality.'],
              ['Hard intervals — 1×/week', '4×4 minutes hard with 3 min easy, or 8-10×1 min hard with 1 min easy. This raises your ceiling. Once a week is enough; twice is usually a recovery problem in disguise.'],
              ['Fight-specific conditioning — 1-2×/week', 'The most transferable version is simply hard rounds of your sport: 5×5 min bag or pad rounds with 1 min rest, or positional grappling rounds starting in bad positions. Same energy demand, and you get skill reps for free.'],
            ]} />

            <SectionTitle icon={Zap} title="The plan" sub="How it fits together across a week and across a camp." />

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
              <p className="text-gray-300 text-sm font-semibold mb-1.5">Your weekly schedule lives in Programs, not here</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                You already run a Push / Big Leg Day / Pull / Explosive / Shoulders split. Everything above is a set of
                QUALITIES, and almost all of them already have a home in those five days — so the answer is not a second
                programme competing with the first. Programs → The Week maps each quality onto the day it belongs on,
                lists the four finishers worth adding, and covers what to cut when MMA and football are also in the week.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/programs?tab=week" className="inline-block text-[11px] font-bold bg-orange-500/10 border border-orange-500/25 text-orange-200 px-3 py-1.5 rounded-full">
                  Programs &rarr; The Week
                </Link>
                <Link to="/programs?tab=explosive" className="inline-block text-[11px] font-bold bg-orange-500/10 border border-orange-500/25 text-orange-200 px-3 py-1.5 rounded-full">
                  Programs &rarr; Explosive Day
                </Link>
              </div>
            </div>

            <Block title="The two rules that decide whether it works alongside the split" items={[
              ['Never lift heavy legs within 48 hours of hard sparring', 'Big Leg Day and the Explosive day both need two clear days before anything competitive. This is the constraint that actually shapes the week — arrange everything else around it.'],
              ['Skill first, lifting second, on any shared day', 'If a session and a lift land on the same day, do the technical work fresh and lift after, separated by a few hours where possible. Skill practised tired builds tired-looking skill.'],
            ]} />

            <Fold title="Fight camp structure — how a pro periodises it" tag="What changes as the fight gets closer" items={[
              ['Off-camp (no fight booked) — build', '10-16 weeks. This is where strength and size are actually built, because you have the recovery budget for it. Heavier lifting, more volume, lower sparring intensity, aerobic base. Nobody gets meaningfully stronger during a camp; they just try not to lose it.'],
              ['Camp weeks 8-5 — convert', 'Strength volume drops, power and speed work rises, skill work becomes fight-specific (game-planning for a style), sparring volume climbs. Lifting shifts to maintenance: fewer sets, same intensity — that is the combination that preserves strength on minimal fatigue.'],
              ['Camp weeks 4-2 — sharpen', 'Peak sparring, hardest fight-specific conditioning, minimal gym work (2 short sessions, heavy but very low volume). Everything here is about being sharp, not about being fitter — fitness is already banked by now.'],
              ['Final 7-10 days — taper', 'Volume drops sharply, intensity stays. Short, crisp, high-quality sessions. Fatigue clears faster than fitness fades, which is exactly why a taper makes you better rather than rusty. No hard sparring in the last 10 days — the risk is all downside.'],
              ['The interference effect, managed', 'Heavy endurance work blunts strength adaptation when they are stacked too close. Where you have the choice, separate lifting and hard conditioning by 6+ hours, or put them on different days. Where you do not have the choice, put the quality you are prioritising FIRST in the day.'],
              ['Deload every 4th week', 'Cut volume roughly in half, keep intensity. Most training injuries and plateaus are just accumulated fatigue that never got cleared.'],
            ]} />

            <Block title="Benchmarks — how you know it is working" items={[
              ['Trap bar deadlift 2× bodyweight (3RM)', 'A reasonable general strength ceiling for a fighter. Past this, more maximal strength has diminishing returns and your training time is better spent on speed and skill.'],
              ['Standing broad jump ≥ your height', 'A clean, simple test of horizontal power that needs no equipment. Test it every 6 weeks in the same shoes on the same surface.'],
              ['Rotational med ball throw — track the distance', 'Same ball, same spot, same rules, every 6 weeks, both sides. Improvement here is the closest gym proxy you have for punching power, and a big left-right gap tells you which side to work.'],
              ['10-12 strict bodyweight chin-ups before adding load', 'The entry requirement for weighted work, and a decent proxy for grappling pulling strength.'],
              ['Zone 2 pace at a fixed heart rate', 'Run or row at the same heart rate every few weeks and see if you are covering more distance. Rising output at the same heart rate is aerobic fitness improving, and it is a far better signal than how tired a session made you feel.'],
              ['The honest one — round three', 'Can you still produce technically clean, hard work in the third round of hard sparring? Everything above is a proxy for that. That is the actual test.'],
            ]} />

            <Fold title="Going pro — the honest picture" tag="Worth knowing before you organise your life around it" items={[
              ['The path', 'Amateur record first (most sensible routes want 5+ amateur fights), then regional pro shows, then a regional promotion title, then possibly a bigger organisation. Realistically 4-8 years from starting to any meaningful pro level, with full-time training for most of it.'],
              ['The money reality', 'Regional pro purses are commonly a few hundred to a couple of thousand pounds per fight, with maybe 2-4 fights a year, out of which come coaching fees, camp costs, medicals and licensing. Almost everyone below the top tier has another job or another income. Plan for that rather than being surprised by it.'],
              ['The brain-health trade-off, stated plainly', 'Repeated head impacts carry a real, evidenced risk of long-term neurological damage, and that risk comes mostly from cumulative sparring exposure rather than fights. Control it deliberately: technical and light sparring most of the time, hard sparring rarely and with a purpose, never spar concussed, and take head-knock recovery seriously. This is the single most important decision you will make in the sport, and it is yours to make with the facts.'],
              ['What actually separates people', 'Not talent and not toughness — training age, coaching quality, injury avoidance and consistency over years. The fighters who make it are usually the ones who were still training normally in year five, having avoided the big injuries and the burnout.'],
              ['Wrestling is the highest-leverage base', 'Across MMA, wrestling ability most reliably decides where the fight takes place, and whoever decides that usually wins. If you are starting from scratch and want maximum return per hour, wrestle.'],
              ['Get a coach and get in rooms', 'None of this replaces a real coach watching you move. Use this section to understand WHY your coach is asking for something and to organise your own training around the sessions — not as a substitute for the sessions.'],
            ]} />
          </div>
        )}

        {tab === 'tough' && (
          <div className="fade-up stagger space-y-3">
            <SectionTitle icon={Shield} title="Conditioning the body" sub="Shins, forearms, body and hands — what genuinely adapts, what doesn't, and how to do it without wrecking yourself." />

            <div className="bg-gradient-to-br from-red-500/12 to-[#111] border border-red-500/25 rounded-2xl p-5">
              <h3 className="font-black text-red-300 mb-2">What "conditioning" actually is — three real mechanisms, and one myth</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bone responds to repeated moderate stress by remodelling denser and thicker along the lines of load —
                that is real, it is why experienced kickers have visibly different shins, and it takes
                <span className="text-gray-200 font-semibold"> months to years, not weeks</span>. Nerve endings in
                repeatedly stressed tissue become less sensitive, so the same impact hurts less. And trained muscle,
                braced at the right moment, absorbs and distributes force that would otherwise reach something fragile.
                What does NOT happen is bone becoming immune to breaking, or a body being trainable to shrug off
                anything. Every method below is a slow adaptation with a real injury cost if rushed — and the people who
                rushed it are the ones with permanent nerve damage and arthritis in their forties.
              </p>
            </div>

            <SectionTitle icon={Zap} title="Shin conditioning" />

            <Block title="How it is actually done" items={[
              ['Kick things, progressively — that is the whole method', 'Heavy bag and Thai pads, with volume and force built up over months. This is how every legitimate Muay Thai camp does it. There is no shortcut and no secret drill; the stimulus is simply repeated moderate impact with enough recovery between sessions for the bone to remodel.'],
              ['Start on soft, move to hard', 'Thai pads and a soft bag first. Only progress to a heavy, firm bag once light work stops being uncomfortable. Weeks 1-4: light-to-moderate kicks, maybe 50-100 per session, 2-3×/week. Then build force and volume gradually across months.'],
              ['Technique protects the shin more than toughness does', 'Kick with the middle-to-lower shin at an angle, turning the standing foot fully so the hip clears and the shin lands with the whole leg behind it. Kicking with the ankle, the foot, or a square hip is how shins get hurt regardless of conditioning.'],
              ['Rolling — the mild, useful version', 'Rolling a bottle, rolling pin or hard foam along the shin for a few minutes desensitises nerve endings and helps with soreness. Moderate pressure. This is a supplement to kicking, not a replacement for it, and rolling hard enough to bruise achieves nothing except bruising.'],
              ['Rest is where the adaptation happens', 'Bone remodels during recovery, not during impact. Hard shin work needs 48+ hours between sessions. Daily hammering produces microdamage faster than it can be repaired, which is the direct route to a stress fracture.'],
              ['The timeline, honestly', 'Noticeable desensitisation in 2-3 months of consistent work. Meaningful bone adaptation over 1-2 years. Anyone promising conditioned shins in six weeks is describing bruises, not adaptation.'],
            ]} />

            <Block title="What NOT to do — the folklore that injures people" items={[
              ['Do not hit your shins with bats, bottles or rolling pins to "break down" bone', 'This is a persistent myth, often falsely attributed to old Thai practice. Deliberately damaging bone does not build it back stronger in any controlled way — it causes periostitis, bone bruising, permanent nerve damage and stress fractures. The adaptation comes from KICKING, which loads the bone through its whole structure the way it is actually used.'],
              ['Do not kick trees, walls or concrete', 'Same reasoning, worse consequences. No serious camp does this.'],
              ['Sharp, localised or lingering pain is a stop sign', 'Aching after a hard session is normal. A specific painful spot, pain that worsens over days, pain at rest or at night, or pain when you press one point are signs of periostitis or a stress fracture. Stop, rest for weeks not days, and see a doctor if it persists. Training through this is how people lose a year.'],
              ['Numbness is not a trophy', 'Permanently numb shins mean nerve damage, not achievement. Desensitisation should plateau at "this no longer hurts much", not "I cannot feel this limb".'],
              ['Shin guards in sparring are not weakness', 'You cannot condition your way out of a shin-on-shin clash at full power. Guards in sparring are how professionals stay able to train next week.'],
            ]} />

            <SectionTitle icon={Shield} title="The rest of the body" />

            <Fold title="Forearms — for checking and blocking" tag="The most under-trained conditioning" items={[
              ['Why it matters', 'Blocking head kicks and hard hooks with the forearms is standard, and untrained forearms bruise, go numb and stop working within a round. Same adaptation as shins, milder.'],
              ['How', 'Blocking drills with a partner throwing at increasing power onto your guard, and light forearm-to-forearm clashing during pad work. Build over months exactly like shins.'],
              ['Technique first again', 'Take impact on the meat of the forearm with the elbow tight, not on the wrist or the point of the elbow. A well-positioned block hurts far less than a conditioned but badly placed one.'],
            ]} />

            <Fold title="Taking body shots" tag="What is trainable, and what is genuinely not" items={[
              ['Bracing is the trainable part', 'A braced abdominal wall distributes force. An unbraced one lets it reach organs. This is why the timing matters more than the muscle: exhale sharply and brace at the moment of impact, and take it on the obliques or the tensed rectus rather than a soft, inhaling midsection.'],
              ['The muscle itself does adapt', 'Thicker, stronger abdominal and oblique muscle genuinely provides more armour. That is a hypertrophy problem, and it is already covered — Programs → Core & Abs has the loaded work.'],
              ['Progressive body sparring, with a partner', 'Body-shot-only rounds at controlled power, building over months. Medicine ball drops onto a braced midsection are a legitimate old-school method — light ball, controlled height, and never while relaxed or unprepared.'],
              ['What cannot be trained away — say it plainly', 'The liver and the solar plexus are not conditionable in any meaningful sense. A clean liver shot drops trained professionals, and no amount of abdominal work changes that. The answer to body shots is elbows down, hips turned and not being there — defence, not toughness.'],
              ['Never let someone hit you unprepared as a "test"', 'The tensing has to be conscious and timed. Being hit while relaxed is how organs get damaged, and the party-trick version of this has genuinely killed people.'],
            ]} />

            <Fold title="Hands, knuckles and the chin" tag="Where conditioning is mostly the wrong answer" items={[
              ['Hands break easily — that is a technique problem, not a toughness one', 'The boxer\'s fracture (broken fifth metacarpal) comes from landing on the little-finger side with a bent wrist. The fix is wrapping properly, a straight wrist, and landing on the first two knuckles. No amount of conditioning survives bad alignment.'],
              ['Knuckle push-ups — modest and fine', 'On a mat, not concrete. Mildly toughens the skin and trains a straight wrist under load. Harmless and slightly useful.'],
              ['Makiwara and iron-palm work — high risk, low return', 'Traditional striking-post training does thicken tissue, and it also has a well-known association with arthritis and joint damage later in life. For someone training modern combat sports with gloves and wraps, the trade is not worth it.'],
              ['Bare-knuckle reality', 'In a street context the hand is the thing most likely to break, which is exactly why elbows, knees and the clinch matter so much more than punching power there.'],
              ['The chin cannot be conditioned — full stop', 'There is no such thing as training your brain to absorb impact. What genuinely helps is neck strength, which reduces how much your head accelerates when struck — that is in Strength & Power and it is the real version of this idea. Anyone doing drills where they get hit in the head to "toughen up" is accumulating brain injury for nothing, and the evidence on cumulative head impacts is not ambiguous.'],
            ]} />

            <SectionTitle icon={Zap} title="Being solid — the whole-body version" />

            <Block title="What actually makes someone feel immovable" items={[
              ['It is mostly leanness, force transfer and tension — not size', 'The full explanation of why a lighter athlete can feel harder and stronger than a heavier one is in Programs → Explosive ("Why a lighter athlete feels denser and stronger than you"). It is the most useful thing in the app on this question and it is not repeated here.'],
              ['Isometrics are the specific answer to "solid"', 'Overcoming isometrics — pushing maximally against something immovable for 5 seconds — build the ability to produce enormous tension without moving. That is the quality behind feeling like a wall in a clinch. Three sets of 5 seconds, 2×/week, in a couple of positions.'],
              ['Loaded carries', 'Heavy farmer\'s and suitcase carries train grip, trunk stiffness and breathing under load simultaneously. If you only added one thing for general physical solidity, this is it.'],
              ['The neck, again', 'Nothing changes how physically formidable someone looks and is more than a developed neck, and it is protective rather than cosmetic. Three sessions a week, light, controlled, built over months.'],
              ['Grip', 'Force you cannot transmit through your hands does not exist. Dead hangs, fat-bar holds, and not using straps for everything.'],
              ['Relative strength over bodyweight', 'Weighted chin-ups, dips and split squats — strength per kilo. Adding mass without adding force makes you slower and more tired, not harder to handle.'],
              ['Conditioning is what makes it usable', 'Being strong for ninety seconds and then empty is not being solid. The aerobic base in Strength & Power is what lets any of the above still be there in round three.'],
            ]} />

            <Fold title="Pain tolerance and mental toughness — the honest account" tag="Trainable, but not the way people think" items={[
              ['It is mostly familiarity, not willpower', 'People who cope well with being hurt are usually people for whom the sensation is familiar and no longer alarming. Graduated exposure through sparring does this. Grinding through arbitrary suffering does not transfer nearly as well as people assume.'],
              ['Specificity applies to toughness too', 'Cold showers and hard conditioning build some general discomfort tolerance, and the evidence for transfer to a completely different stressor is weak. If you want to be tough at being punched, the training is being punched, progressively, in a controlled room.'],
              ['Breathing is the technique', 'Composure under pain is largely a breathing skill. Panic, breath-holding and tensing everything is what turns a hard moment into a finished one. Slow exhale, keep working.'],
              ['Know the difference between pain and damage', 'Sore shins, a dead leg, a rib that aches — pain. Sharp localised bone pain, a joint that gives way, anything neurological, any head knock — damage. Training through the first is normal; training through the second ends careers, and the ability to tell them apart is a skill worth more than any amount of grit.'],
              ['The unglamorous truth about toughness', 'It is mostly showing up consistently for years, not doing something extreme once. The tough people in any gym are the ones still there in year five, not the ones doing the hardest single session.'],
            ]} />

            <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="font-bold text-amber-300">The limit worth stating.</span> Every method here has a dose
                where it builds you and a dose where it takes something permanent. Retired fighters with arthritic
                hands, numb shins and neurological symptoms did not get there by being weak — they got there by doing
                too much of this, too hard, for too long, usually while young enough to believe it was free. Build
                slowly, take the rest days, wear the guards, and never let anyone talk you into a "test".
              </p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
