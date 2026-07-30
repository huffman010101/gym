import { useState } from 'react';
import { Moon, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

/* Self-contained, same shape as MorningRoutine so either can be moved freely. */
function Block({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <h3 className="font-bold mb-3 text-indigo-300">{title}</h3>
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
          <p className="text-xs text-indigo-400/70 mt-0.5">{tag}</p>
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
  'Scrolling in bed',
  'Bright lights till lights-out',
  'Late heavy meal / late coffee',
  'Mind racing about tomorrow',
  'Random bedtime',
  'Drink to wind down',
];

const GOOD = [
  'Screens down 45 min before',
  'Lights dim after sunset',
  'Tomorrow written down',
  'Same bedtime nightly',
  'Cool, dark, quiet room',
  'Read until sleepy',
];

function Compare() {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-3 text-center">
        Two versions of the same night
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <XCircle size={14} className="text-red-400 flex-shrink-0" />
            <p className="font-black text-[12px] text-red-300 whitespace-nowrap">Bad night</p>
          </div>
          <ul className="space-y-1.5">
            {BAD.map(x => (
              <li key={x} className="text-[11px] text-gray-400 leading-snug flex gap-1.5">
                <span className="text-red-400/60 flex-shrink-0">·</span>{x}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2.5 border-t border-red-500/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/70 mb-1">What you wake to</p>
            <p className="text-[11px] text-gray-400 leading-snug">
              An hour to fall asleep · awake at 3am · alarm feels brutal · snooze · straight into a bad morning
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <p className="font-black text-[12px] text-emerald-300 whitespace-nowrap">Good night</p>
          </div>
          <ul className="space-y-1.5">
            {GOOD.map(x => (
              <li key={x} className="text-[11px] text-gray-300 leading-snug flex gap-1.5">
                <span className="text-emerald-400/60 flex-shrink-0">·</span>{x}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2.5 border-t border-emerald-500/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 mb-1">What you wake to</p>
            <p className="text-[11px] text-gray-300 leading-snug">
              Asleep in minutes · slept through · awake before the alarm · morning routine runs itself
            </p>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed mt-3 text-center">
        Your morning is decided the night before. This is the other half of the same system.
      </p>
    </div>
  );
}

export default function NightRoutine() {
  return (
    <div className="fade-up stagger space-y-4">
      <div className="card-premium p-5">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Moon size={16} className="text-indigo-400" /> The Night Routine</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          You cannot win the morning if you lose the night. Everything the morning routine gives you — energy,
          focus, mood — is built while you sleep. This is how you protect it.
        </p>
      </div>

      <Compare />

      <div className="bg-gradient-to-br from-indigo-500/15 to-[#111] border border-indigo-500/30 rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-300/70 mb-3">The 6 non-negotiables</p>
        <div className="space-y-3">
          {[
            ['Same bedtime, every night', 'Within about 30 minutes, weekends included. Wake time and bedtime are one system — fixing only one of them does half the job.'],
            ['Screens down 30-60 minutes before bed', 'It is not only the blue light. The content — messages, arguments, short-form video — keeps your brain alert long after you put the phone down.'],
            ['Phone charges outside the bedroom', 'The single highest-impact change. It removes bedtime scrolling AND the 3am check, and it forces you to use a real alarm so your morning does not start in your feed.'],
            ['Last big meal 2-3 hours before, last coffee 8-10 hours before', 'Digestion and caffeine both fragment deep sleep. Half of a 2pm coffee is still in you at 8pm — you will fall asleep, you just will not sleep as deeply.'],
            ['Write tomorrow down before you get in bed', 'Three priorities on paper. Rumination is the number one sleep killer for driven people, and it is almost always your brain refusing to drop something it is scared of forgetting.'],
            ['Cool, dark, quiet', '17-19°C, blackout or an eye mask, earplugs if needed. Your core temperature has to drop for you to fall asleep — a warm room fights that all night.'],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-3">
              <span className="text-indigo-400/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-200">{t}</p>
                <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Block title="The last 90 minutes, in order" items={[
        ['90 min out — Last food, lights down', 'Stop eating. Turn off the big ceiling light and switch to lamps low in the room. Bright overhead light at 10pm tells your brain it is midday.'],
        ['75 min out — Screens off or blue-blockers on', 'If you must be on a screen, amber glasses and maximum warmth on the display. Better: put it down entirely.'],
        ['60 min out — Hot shower', 'Counter-intuitive but well established: the drop in body temperature afterwards is what makes you sleepy. Skincare while you are in there anyway.'],
        ['45 min out — Tomorrow, on paper', 'Three priorities written down (Home → Plan tomorrow). Clothes out, bag packed, gym kit ready. Every decision you make now is one you do not make while groggy.'],
        ['30 min out — Phone leaves the room', 'Plug it in somewhere else. Set a real alarm. This is the moment the whole routine either works or does not.'],
        ['20 min out — Read a paper book', 'Fiction or something undemanding. Paper, not a screen. This is the off-ramp that stops you lying there wide awake.'],
        ['5 min out — Breathe', 'Three physiological sighs (double inhale through the nose, long exhale through the mouth), then 4-7-8 breathing. Long exhales flip you into the rest state — it is a dimmer switch you control.'],
        ['Lights out — same time nightly', 'Consistency beats duration. A steady 7 hours beats a chaotic 9.'],
      ]} />

      <Fold title="Why each piece works" tag="The reasoning, so you can adapt it" items={[
        ['Dim light in the evening', 'Melatonin release is suppressed by bright light, especially overhead and blue-heavy. Dimming after sunset lets it rise on schedule so you actually feel sleepy at the right time.'],
        ['The hot shower trick', 'Warming your skin pulls heat to the surface; when you get out, core temperature drops sharply. That drop is one of the strongest sleep-onset signals your body has.'],
        ['Writing tomorrow down', 'An unfinished intention keeps working in the background. Putting it on paper genuinely releases it — this is why the plan card exists and why doing it before bed matters more than doing it in the morning.'],
        ['Phone out of the room', 'Removes the decision entirely. Willpower at 11pm, tired, is the weakest willpower you have all day — do not rely on it.'],
        ['Alcohol, honestly', 'It knocks you out and then destroys REM and deep sleep for the rest of the night. "I sleep fine after a drink" means you were unconscious, not rested.'],
        ['Bed is for sleep only', 'If you scroll, work and watch things in bed, your brain stops associating it with sleep. Keep the association clean and falling asleep gets measurably easier.'],
      ]} />

      <Block title="If you cannot fall asleep" items={[
        ['The 20-minute rule', 'Lying there frustrated trains your brain that bed means stress. After roughly 20 minutes, get up, keep the lights low, read something dull, and go back when you feel sleepy.'],
        ['Do not look at the clock', 'It converts tiredness into anxiety and maths. Turn it away from you.'],
        ['Do not reach for your phone', 'It is the one guaranteed way to turn 20 minutes awake into two hours.'],
        ['One bad night does not matter', 'Your body handles it. Panicking about lost sleep causes far more damage than the lost sleep does — and it is what turns one bad night into a bad week.'],
        ['Do not compensate the next day', 'No lie-in, no long late nap, no extra caffeine binge. Get up at your normal time, get light, and the following night fixes itself.'],
      ]} />

      <Fold title="The mistakes that wreck your sleep" tag="Fix these first" items={[
        ['Scrolling in bed', 'The single most common one. Light plus stimulating content plus infinite scroll is close to the worst possible pre-sleep combination.'],
        ['Weekend late nights', 'Two late nights shift your clock, and Monday morning is the bill. This is exactly why Mondays feel like jet lag — because they are.'],
        ['Using alcohol to wind down', 'Sedation is not sleep. It reliably costs you the deep and REM sleep that recovery and memory depend on.'],
        ['Training hard within ~2 hours of bed', 'Core temperature and adrenaline stay elevated. Train earlier where you can, or allow a longer wind-down after.'],
        ['Going to bed before you are tired', 'You lie there, get frustrated, and teach yourself that bed means being awake. Shift bedtime earlier gradually — 15 minutes at a time.'],
        ['Long or late naps', 'After 3pm or over about 25 minutes, a nap eats into your sleep pressure and pushes bedtime later. 20 minutes early afternoon, or a full 90-minute cycle.'],
      ]} />

      <div className="bg-[#111] border border-emerald-500/25 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-300 mb-2">The 5-minute version, for bad nights</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          Home late, been out, nothing went to plan. Do these three and you still protect tomorrow.
        </p>
        <div className="space-y-2">
          {[
            ['1. Phone out of the room', 'Non-negotiable, even when everything else slipped.'],
            ['2. Three priorities on paper', 'Thirty seconds. Stops your brain running them all night.'],
            ['3. Go to bed at roughly your normal time', 'Protect the clock. Losing an hour is far better than shifting your whole rhythm.'],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="font-semibold text-sm text-gray-200">{t}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <Block title="How much sleep you actually need" items={[
        ['7-9 hours for almost everyone', 'The people who genuinely function on 5 are a rounding error. If you need an alarm to wake and feel rough for an hour, you are under-slept — not "not a morning person".'],
        ['Count backwards from your wake time', 'Fixed wake time is the anchor. Want up at 07:00 with 8 hours? Lights out by 22:45, allowing 15 minutes to fall asleep.'],
        ['Training increases the requirement', 'Hard gym, football and Muay Thai raise your sleep need. Growth, repair and skill consolidation all happen while you are asleep — under-sleeping actively wastes the training.'],
        ['Judge by mornings, not by hours', 'Waking before your alarm, most days, without dread — that is the target. If you cannot, add 30 minutes and reassess in a week.'],
      ]} />
    </div>
  );
}
