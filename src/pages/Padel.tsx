import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CircleDot } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';

type Tab = 'technique' | 'strategy' | 'walls' | 'gym';

const TABS: { id: Tab; label: string }[] = [
  { id: 'technique', label: 'Technique' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'walls', label: 'Wall Play' },
  { id: 'gym', label: 'Gym' },
];

function Block({ title, items, accent = 'text-sky-300' }: { title: string; items: [string, string][]; accent?: string }) {
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
          <p className="text-xs text-sky-400/70 mt-0.5">{tag}</p>
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

export default function Padel() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['technique', 'strategy', 'walls', 'gym'] as const).includes(t as Tab) ? (t as Tab) : 'technique';
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-sky-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-sky-500/10 rounded-xl flex items-center justify-center">
            <CircleDot className="text-sky-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Padel</h1>
            <p className="text-gray-500 text-sm">Technique · Strategy · Wall Play · Fitness</p>
          </div>
        </div>

        <DailyHabits section="padel" />

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-sky-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== TECHNIQUE ===== */}
        {tab === 'technique' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Grip & Ready Position" items={[
              ['Continental grip, always', 'Hold it like shaking hands with the racket edge-on — same grip for forehand, backhand, and volleys. Switching grips mid-point is what beginners waste years on; padel rewards one grip mastered deeply.'],
              ['Ready stance', 'Knees soft, racket up in front of your chest, weight forward on the balls of your feet. You should be able to move in any direction within one step.'],
              ['Short backswing', 'Padel courts are small — a big tennis-style backswing arrives late. Take the racket back short and compact, punch through the ball instead of swinging at it.'],
            ]} />
            <Block title="Forehand — the groundstroke you'll hit most" items={[
              ['Setup', 'Turn your shoulders sideways to the ball early — hips and shoulders rotate together as one unit, not arm-only. Racket back to about waist height, continental grip unchanged.'],
              ['Contact point', 'Strike out in front of your lead hip, not level with your body — hitting late (ball beside or behind you) is the #1 forehand error and kills both power and direction.'],
              ['Low-to-high swing path', 'Start the racket slightly below the ball\'s eventual contact height and brush up and through — this is what gives you topspin and net clearance without needing to muscle the shot.'],
              ['Finish across your body', 'Let the racket finish up near your opposite shoulder. A swing that stops dead at contact is a swing with no follow-through power — finish it every time, even on soft shots.'],
              ['Off the bounce vs off the glass', 'Most forehands in padel come after the ball has bounced once (sometimes off the back glass too) — track the FULL bounce pattern before committing your swing, not just the first bounce.'],
            ]} />
            <Block title="Backhand — build it early, don't avoid it" items={[
              ['One-handed is standard in padel', 'Unlike tennis, most padel players use a one-handed backhand even at high levels — the compact swing suits the small court. Same continental grip, just rotate your knuckles slightly.'],
              ['Turn side-on, lead with the shoulder', 'Your back (non-hitting) shoulder should point at the net before you swing — this shoulder turn IS the backhand, not an add-on to it.'],
              ['Keep the elbow away from your body', 'A cramped elbow tucked into your ribs produces a weak, stabbing backhand. Let your arm extend with room to swing freely across your body line.'],
              ['Contact slightly further out front', 'Because the backhand naturally has a shorter lever, hit it a touch earlier / further in front than you would a forehand, or you\'ll feel rushed and mis-hit.'],
              ['Drill it as much as your forehand', 'Most players avoid backhands in practice because they\'re less comfortable — which is exactly why opponents will target it in matches. Deliberately hit 50/50 forehand/backhand in every practice session.'],
            ]} />
            <Block title="Spin — topspin, backspin, and when to use each" items={[
              ['Topspin (groundstrokes)', 'Low-to-high racket path brushing up the back of the ball. Makes the ball dip down into the court after clearing the net and kick up higher off the bounce — your safety margin on hard groundstrokes.'],
              ['Backspin/slice (bandeja, defensive shots)', 'High-to-low racket path, chopping down and through. Keeps the ball low and skiddy off the bounce, which is exactly why it\'s the standard technique for the bandeja and defensive returns from deep.'],
              ['Sidespin (vibora, angled shots)', 'A slicing swing path across the side of the ball rather than over the top — makes the ball curve and skid sideways off the wall, which is what makes the vibora so hard to read.'],
              ['Why spin matters more than power in padel', 'The court is enclosed and small — pure flat power sends balls long or into the glass awkwardly. Spin is what lets you hit committed, full swings while keeping the ball in play. Prioritise learning spin before learning to hit harder.'],
            ]} />
            <Block title="The Lob — as a shot, not just a tactic" items={[
              ['Grip and stance stay the same', 'A lob is not a different swing family — same continental grip, same ready position. What changes is the racket face angle (more open) and the swing path (steeper low-to-high).'],
              ['Open the racket face early', 'Let the ball sit slightly deeper on the strings with the face tilted skyward at contact — this lifts the ball rather than driving it flat.'],
              ['Defensive lob: high and deep, no exceptions', 'When you\'re under pressure, prioritise height and depth over placement — a lob that lands short gets punished immediately. Aim for the back third of their court, always.'],
              ['Offensive lob: flatter and to a target', 'When you have time and they\'re at the net, a lower, faster, well-placed lob (over the weaker player\'s backhand shoulder) can be an outright winner, not just a reset.'],
              ['Disguise it', 'Prepare every overhead-height ball with the same racket takeback whether you intend to smash or lob — telegraphing the lob early lets opponents retreat in time to smash it back at you.'],
            ]} />
            <Block title="The Bandeja — your most important shot" items={[
              ['What it is', 'A controlled overhead smash hit with backspin/slice instead of full power — used from the back of the court when the ball is high but you\'re not in a killing position.'],
              ['Why power kills you here', 'A full-power smash from deep court usually goes long or gets lobbed back. The bandeja trades power for control, keeping you in the point instead of gifting it away.'],
              ['Technique', 'Racket back early, continental grip, chop DOWN and THROUGH the ball with a slicing motion rather than a flat hit — the backspin holds it in the court and low off the bounce for your opponents.'],
              ['When to use it', 'Any time you\'re hitting an overhead from your own back third of the court. Save the full smash (vibora/remate) for when you\'re close to the net with a clear winner.'],
            ]} />
            <Block title="Volleys — win the net battle" items={[
              ['Short, punchy, no backswing', 'At the net, there\'s no time for a swing — block and punch through the ball with a firm wrist. Think "catch and redirect", not "hit hard".'],
              ['Volley low ones up, high ones down', 'A volley below net height: lift it gently back over, deep, to buy time. A volley above net height: punch it down and away — that\'s your putaway.'],
              ['Split step on their contact', 'Small hop as your opponent strikes the ball, landing ready to push off either direction. This single habit fixes most "couldn\'t react in time" volleys.'],
            ]} />
            <Block title="Smash (Remate) & Vibora" items={[
              ['Remate — the finishing smash', 'Full power overhead when you\'re close enough to the net that the ball can\'t be chased down. Aim at gaps and feet, not at bodies — placement wins points, not raw speed.'],
              ['Vibora — the spin smash', 'A sliced, angled smash hit across your body that skids sideways off the wall or ground, much harder to read and return than a flat remate. Learn remate first, then add vibora as your point-ending variety.'],
            ]} />
          </div>
        )}

        {/* ===== STRATEGY ===== */}
        {tab === 'strategy' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Court Position — the whole game in one rule" items={[
              ['Get to the net, stay at the net', 'Padel is won and lost at the net. The team at the net controls the point; the team stuck at the back is defending. Every rally, your first job is advancing forward safely.'],
              ['Move as a pair, not two singles', 'You and your partner should move side to side together, maintaining the same depth — if one pushes to the net, the other follows. Gaps between partners are where points are lost.'],
              ['Cover the middle, not the lines', 'Most winning shots go through the middle of the court, not down the lines. Stand slightly toward the middle and let the lines go if forced to choose.'],
            ]} />
            <Block title="The Lob — your ticket back to the net" items={[
              ['When you\'re stuck at the back', 'If your opponents control the net, a deep, high lob over their heads (toward the back glass) buys time to advance behind it. Padel\'s entire back-court strategy runs through the lob.'],
              ['Lob to the middle or the weaker player', 'A lob hit down the middle is harder for a pair to coordinate on (who takes it?). A lob to the weaker player\'s backhand overhead is close to a free point.'],
              ['Never lob short', 'A short lob gets smashed for a winner. If in doubt, hit it deeper — a long lob is a reset; a short one is a gift.'],
            ]} />
            <Block title="Doubles Tactics" items={[
              ['Target the weaker player', 'Politely but relentlessly — most points at amateur level are won by finding and attacking the lesser player, especially their backhand.'],
              ['Poach when your partner\'s pulled wide', 'If your partner is stretched to a sideline, shift toward the middle to cover the gap they\'ve left — communication ("mine"/"yours") prevents both confusion and collisions.'],
              ['Serve to set up your net game', 'Serve, then advance immediately behind it. The serve-and-advance pattern is how you get to the net position that wins padel points.'],
            ]} />
          </div>
        )}

        {/* ===== WALL PLAY ===== */}
        {tab === 'walls' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Reading the Glass" items={[
              ['The wall is your friend, not your enemy', 'Balls off the back glass are still very playable — the bounce is predictable once you\'ve read enough of them. Panic at the wall loses more points than the wall itself does.'],
              ['Let it bounce off the glass before you swing', 'The instinct is to hit the ball before it hits the wall — usually wrong. Let ball-bounce-then-wall (or wall-then-bounce) happen and read the angle before committing to your swing.'],
              ['Side walls change the angle sharply', 'A ball coming off a side wall changes direction more than most players expect — turn your body to face where it\'s GOING, not where it came from.'],
            ]} />
            <Fold title="Common Wall Situations" tag="What to do when the ball hits the glass" items={[
              ['Ball bounces then hits back glass', 'The most common, most playable pattern. Wait for the ball to come off the glass and settle, then hit as normal — it usually slows down and sits up nicely.'],
              ['Ball hits back glass then bounces (fast, low ball)', 'Trickier — the ball comes off the glass with pace and stays low. Get low yourself, racket ready early, block don\'t swing.'],
              ['Ball hits the side glass', 'Watch the rebound angle carefully — it can come back at a sharper angle than tennis players expect. Move to the new line, not the old one.'],
              ['Double-wall (back + side) combinations', 'Slow down mentally rather than physically — these look chaotic but usually die into a very hittable, low-paced ball if you just wait and track it.'],
            ]} />
            <Block title="Using the Wall Offensively" items={[
              ['The wall extends the court, don\'t fear it', 'Once comfortable, you can deliberately send balls into the back glass to buy an extra half-second to recover position — it\'s a tool, not just a defensive accident.'],
              ['Vibora off the side wall', 'An angled smash that clips the side glass on the way down becomes almost unreturnable — the reason it\'s the shot advanced players lean on to finish points.'],
            ]} />
          </div>
        )}

        {/* ===== GYM ===== */}
        {tab === 'gym' && (
          <div className="fade-up stagger space-y-4">
            <Block title="Padel-Specific Fitness" items={[
              ['Lateral quickness over straight-line speed', 'Padel is a small court full of side-to-side and split-step movement, not long sprints. Lateral bounds, side shuffles with resistance bands, and cone agility drills transfer directly.'],
              ['Rotational power for the smash & bandeja', 'Medicine ball rotational throws and cable woodchops build the hip-and-shoulder rotation that powers overheads — the same pattern as a tennis serve or a golf swing.'],
              ['Shoulder health, non-negotiable', 'Overheads are repetitive overhead load. Rotator cuff work (external rotation with a light band, face pulls) 2-3×/week prevents the shoulder injuries that plague racket-sport players.'],
              ['Reactive agility', 'Short, sharp reaction drills — a partner calling a direction, or a ball dropped for you to react to — train the split-step reflex that padel constantly demands.'],
            ]} />
            <Block title="Weekly Split (in-season friendly)" items={[
              ['2×/week — lower body & lateral power', 'Squats, lateral lunges, and lateral bounds. Padel\'s movement is 80% side-to-side — train it that way, not just straight ahead.'],
              ['1-2×/week — rotational power + shoulders', 'Medicine ball throws, cable rotations, band rotator cuff work. Directly builds smash and bandeja power while protecting the shoulder joint.'],
              ['On-court conditioning', 'Play itself is the best conditioning for padel-specific endurance — but add 2×20min sessions of short sprint + recovery intervals if matches leave you fading in the third set.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
