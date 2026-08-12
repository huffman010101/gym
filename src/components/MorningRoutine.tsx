import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

/*
 * Self-contained so it can be moved between sections without rewriting it
 * to match a host page's local Block/Fold helpers.
 */
function Block({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className="font-bold mb-3 text-amber-300">{title}</h3>
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
          <p className="text-xs text-amber-400/70 mt-0.5">{tag}</p>
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

const BAD = [
  'Snooze × 3',
  'Phone in bed, 20 min scroll',
  'Coffee first, no water',
  'No daylight',
  'Skipped or sugary breakfast',
  'Emails / easy tasks first',
];

const GOOD = [
  'Up on the first alarm',
  'No phone for 30-60 min',
  '500ml water',
  'Daylight within 30 min',
  'Protein, coffee 90 min later',
  'Hardest task first',
];

function Compare() {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-3 text-center">
        Two versions of the same day
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Bad morning */}
        <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <XCircle size={14} className="text-red-400 flex-shrink-0" />
            <p className="font-black text-[12px] text-red-300 whitespace-nowrap">Bad morning</p>
          </div>
          <ul className="space-y-1.5">
            {BAD.map(x => (
              <li key={x} className="text-[11px] text-gray-400 leading-snug flex gap-1.5">
                <span className="text-red-400/60 flex-shrink-0">·</span>{x}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2.5 border-t border-red-500/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/70 mb-1">The day you get</p>
            <p className="text-[11px] text-gray-400 leading-snug">
              Foggy till noon · can&apos;t focus · 3pm crash · scroll all evening · bed too late · repeat
            </p>
          </div>
        </div>

        {/* Good morning */}
        <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <p className="font-black text-[12px] text-emerald-300 whitespace-nowrap">Good morning</p>
          </div>
          <ul className="space-y-1.5">
            {GOOD.map(x => (
              <li key={x} className="text-[11px] text-gray-300 leading-snug flex gap-1.5">
                <span className="text-emerald-400/60 flex-shrink-0">·</span>{x}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2.5 border-t border-emerald-500/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 mb-1">The day you get</p>
            <p className="text-[11px] text-gray-300 leading-snug">
              Sharp by 8 · real work done early · steady energy · training feels good · evening is yours
            </p>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed mt-3 text-center">
        Same person, same amount of sleep. The only difference is the first hour —
        and it compounds every single day.
      </p>
    </div>
  );
}

export default function MorningRoutine() {
  return (
    <div className="fade-up stagger space-y-4">
      <div className="card-premium p-5">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Sun size={16} className="text-amber-400" /> The Morning Routine</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          The first hour decides the other fifteen. Get light in your eyes, water in you, and your phone out of
          your hands, and your energy, focus and mood are set before the day has a chance to hijack them.
          Everything below is ordered — do it top to bottom.
        </p>
      </div>

      <Compare />

      <div className="bg-gradient-to-br from-amber-500/15 to-[#111] border border-amber-500/30 rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-300/70 mb-3">The 6 non-negotiables</p>
        <div className="space-y-3">
          {[
            ['Same wake time, every day', 'Including weekends, within about an hour. This one habit does more for your energy than everything else combined — a lie-in on Saturday is self-inflicted jet lag you feel until Tuesday.'],
            ['Light in your eyes within 30 minutes', 'Outside if you possibly can: 5-10 min on a bright day, 15-20 if overcast. Through a window is far weaker but better than nothing. This sets your body clock, triggers the cortisol pulse that wakes you properly, and starts the ~16h timer on tonight\'s melatonin.'],
            ['No phone for the first 30-60 minutes', 'Checking it first thing spikes dopamine before you have done anything, and everything real feels flat by comparison. It also hands your attention to other people\'s priorities before you have set your own.'],
            ['500ml of water before anything else', 'You just went 7-9 hours without fluid. Most morning grogginess is mild dehydration, not tiredness. A pinch of sea salt helps you actually absorb it.'],
            ['Move for 5-10 minutes', 'Walk, mobility, press-ups, anything. Movement raises body temperature and clears sleep inertia far faster than sitting still waiting to feel awake.'],
            ['Hardest thing first', 'Your focus is at its peak in the first few hours. Spend it on the work that matters, not on email, admin or your feed. This is the whole reason the routine exists.'],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-3">
              <span className="text-amber-400/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Block title="The first hour, minute by minute" items={[
        ['0-2 min — Feet on the floor, no snooze', 'Snoozing drops you back into a sleep cycle you cannot finish, which is exactly why you feel worse after it. Alarm across the room if needed. Open the curtains immediately.'],
        ['2-5 min — Water', '500ml, pinch of salt. Make your bed while you drink it — a 30-second win before the day has asked anything of you.'],
        ['5-15 min — Light + walk', 'Get outside. No phone, no headphones. This is the highest-value ten minutes of your morning and the one most people skip.'],
        ['15-25 min — Move', 'Mobility, stretching, or your training session if you train mornings. Nothing heroic — the point is raising temperature and heart rate.'],
        ['25-35 min — Shower, finish cold', '30-60 seconds cold at the end. Sharp, unpleasant, and it produces a genuine, hours-long lift in alertness and mood.'],
        ['35-45 min — Grooming + dress properly', 'Skincare, teeth, fragrance, actual clothes. Dressing like you are going somewhere changes how you work even when you are not.'],
        ['45-60 min — Protein breakfast', 'Eggs, Greek yoghurt, or a shake. Protein-led beats cereal or toast: steadier blood sugar, no 11am crash, and it starts hitting your daily protein target early.'],
        ['60 min+ — First deep work block', 'Phone in another room. One task. 90 minutes. This is where your degree, your training and your money actually get built.'],
      ]} />

      <Fold title="Why each piece works" tag="The reasoning, so you can adapt it" items={[
        ['Morning light', 'Bright light early anchors your circadian rhythm, sharpens the natural cortisol peak that makes you feel awake, and starts the countdown to melatonin release tonight. It genuinely improves how fast you fall asleep 16 hours later.'],
        ['Delaying caffeine 60-90 minutes', 'Adenosine — the chemical that makes you sleepy — is still clearing when you wake. Caffeine straight away masks it rather than removing it, which is what produces the mid-afternoon crash. Wait an hour and the same coffee works better and lasts longer.'],
        ['Cold exposure', 'A cold finish to your shower produces a sustained rise in noradrenaline and dopamine — sharper focus and better mood for hours, not minutes. It is also a daily rep of doing something you do not want to do (see the Focus & Discipline tab).'],
        ['Protein first', 'Protein blunts the blood-sugar spike and crash that a carb-heavy breakfast causes, keeps you full, and front-loads the intake you need for the training in your Program.'],
        ['No phone', 'Your dopamine baseline in the morning sets how rewarding ordinary effort feels all day. Flooding it with short-form content first thing makes deep work feel unbearable by comparison.'],
        ['Movement', 'Sleep inertia is a real physiological state, not weakness. Raising your core temperature and heart rate clears it far faster than caffeine or willpower.'],
      ]} />

      <Block title="Caffeine protocol" items={[
        ['Wait 60-90 minutes after waking', 'Water and light first, coffee second. You get a stronger effect from the same amount and avoid the crash.'],
        ['Last cup 8-10 hours before bed', 'Half the caffeine from a 2pm coffee is still in you at 8pm. It may not stop you falling asleep, but it quietly strips out your deep sleep — which you feel the next morning.'],
        ['Do not stack it on an empty stomach if it makes you jittery', 'With or just after food is gentler and lasts longer.'],
        ['If you train in the morning', 'Coffee 30-45 min before is genuinely performance-enhancing. Just still hydrate first.'],
      ]} />

      <Block title="Supplements — what actually belongs in the morning" items={[
        ['Take with breakfast, not on an empty stomach', 'Vitamin D3 (2,000-4,000IU) and omega-3 (1-2g EPA/DHA) are fat-soluble — taken with the protein breakfast at 45-60 min they absorb properly. Taken with water on an empty stomach you waste most of the D3 and get fish burps from the omega-3.'],
        ['Creatine 5g — timing genuinely does not matter', 'Morning is only the best time because it is the time you will not forget. Stir it into your water or your shake. It works by saturating your muscles over weeks, so the only thing that matters is that you take it every single day, including rest days.'],
        ['Magnesium is a NIGHT supplement, not a morning one', 'Magnesium glycinate 200-400mg goes before bed, not now — it supports sleep depth and relaxation. Taking it in the morning wastes the main reason to take it.'],
        ['Caffeine is a supplement too — treat it like one', 'It is on the list above for a reason: 60-90 minutes after waking, 100-200mg, and the protocol below is the rest of it.'],
        ['What you do not need in the morning', 'Fat burners, test boosters, BCAAs and greens powders do nothing that your breakfast and your sleep are not already doing. Zinc only if you are actually deficient or a heavy sweater. Do not build a ten-pill morning ritual — it is procrastination dressed as optimisation.'],
        ['The whole thing takes 20 seconds', 'Creatine in the water, D3 and omega-3 with the eggs. If you cannot remember it, keep them next to the kettle. The full reasoning and the complete stack lives in Looks → Methods → Supplement stack; this is only the morning slice of it.'],
      ]} />

      <div className="bg-[#111] border border-emerald-500/25 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-300 mb-2">The morning is only the setup — the work block is the point</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Everything above exists to hand you one clean 90-minute block at 60 min+. If you get to that block and
          still cannot start, the problem is not your morning — it is the task. Three fixes, in order:
        </p>
        <div className="space-y-2 mb-3">
          {[
            ['Shrink the task until it is stupid', '"Write the essay" is unstartable. "Open the doc and write the title" is not. Shrink it until starting feels almost embarrassing, because starting is the only part that is actually hard.'],
            ['The 5-minute contract', 'Commit to five minutes and give yourself full permission to stop after them. You almost never will — the resistance is at the start, not in the middle.'],
            ['Design the environment, not the willpower', 'Phone in another room, one tab, materials already out from last night. Willpower loses to convenience every time, so make the right thing the easy thing before you sit down.'],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="font-semibold text-sm text-gray-200">{t}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <Link to="/mind?tab=focus" className="inline-block text-xs font-bold bg-emerald-500/15 text-emerald-300 px-3 py-1.5 rounded-full">
          Full method → Mind · Focus &amp; Discipline
        </Link>
      </div>

      <Fold title="The mistakes that undo all of it" tag="Fix these before adding anything" items={[
        ['Snoozing', 'You start a sleep cycle you cannot complete. That grogginess is fragmented sleep, and it can last hours.'],
        ['Phone in bed', 'The single biggest one. It sabotages the morning before you have stood up — and it is why the phone belongs outside the bedroom overnight.'],
        ['Coffee before water and light', 'Works against the natural wake-up mechanism instead of with it, then bills you for it at 3pm.'],
        ['A big carb-only breakfast', 'Cereal, toast, pastries — a spike then a crash right when your first work block needs focus.'],
        ['Weekend lie-ins', 'A 3-hour shift is the same as flying across a few time zones every Friday and back on Monday. This is why Mondays feel awful.'],
        ['All-or-nothing thinking', 'Missing the walk does not mean the morning is ruined. Do the next thing on the list. Consistency at 80% beats perfection twice a month.'],
      ]} />

      <div className="bg-[#111] border border-emerald-500/25 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-300 mb-2">The 5-minute version, for bad mornings</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Overslept, hungover, exam day, whatever. On the worst mornings you still do these three. They take five
          minutes and preserve about 80% of the benefit.
        </p>
        <div className="space-y-2">
          {[
            ['1. Get up at your normal time anyway', 'Protects the clock. You can nap later if you need to.'],
            ['2. Light in your eyes', 'Curtains open, step outside for even 60 seconds.'],
            ['3. Water, and do not touch your phone', 'That is it. Everything else is a bonus.'],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="font-semibold text-sm text-gray-200">{t}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <Block title="Adapting it to your day" items={[
        ['9am lecture', 'Wake 07:00. Light and water immediately, walk on the way in, protein breakfast, and use the walk itself as your light exposure. Deep work in the gaps between lectures, not at midnight.'],
        ['Morning training or football', 'Water and light first, coffee 30-45 min before, small protein-and-carb meal if you can stomach it. Full breakfast after. Your session replaces the movement block.'],
        ['Match day', 'Wake at the normal time, eat a proper carb-and-protein breakfast 3-4 hours before kick-off, hydrate from the moment you wake, and keep the morning calm and low-stimulation.'],
        ['Very early start', 'Shift the whole sequence earlier and go to bed earlier — do not just cut sleep. Sleep length is what makes any of this work; the routine amplifies good sleep, it cannot replace it.'],
        ['Pair it with the night before', 'Tomorrow\'s 3 priorities written down (Home → Plan tomorrow), clothes out, phone out of the room. A good morning is mostly assembled the night before.'],
      ]} />
    </div>
  );
}
