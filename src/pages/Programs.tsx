import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, Dumbbell } from 'lucide-react';
import LiftTracker from '../components/LiftTracker';
import BulkCheck from '../components/BulkCheck';
import Plan from './Plan';
import FoodLog from './FoodLog';
import Physique from './Physique';
import BottomNav from '../components/BottomNav';
import { SectionHeader, TabBar, OneThing } from '../components/Hud';
import { BatHero, SkinBackdrop, skinsOn } from '../components/Skins';
import { skin } from '../lib/themes';

type Tab = 'plan' | 'bulk' | 'push' | 'pull' | 'legs' | 'core' | 'recovery' | 'posture' | 'rules' | 'ai' | 'food' | 'physique';

// Thirteen pages grouped into seven tabs. The detailed id (`tab`) is still
// what ?tab= links, DayCards and FocusMap use; a group with several pages
// shows a second, smaller switch under the tab bar.
type Group = 'plan' | 'bulk' | 'sessions' | 'care' | 'ai' | 'food' | 'physique';
const GROUPS: { id: Group; label: string; subs: { id: Tab; label: string }[] }[] = [
  { id: 'plan', label: '★ The Plan', subs: [{ id: 'plan', label: 'This week' }, { id: 'rules', label: 'How to run it' }] },
  { id: 'bulk', label: 'Lean Bulk', subs: [{ id: 'bulk', label: 'Lean Bulk' }] },
  { id: 'sessions', label: 'Sessions', subs: [{ id: 'push', label: 'Push' }, { id: 'pull', label: 'Pull' }, { id: 'legs', label: 'Legs + Athletic' }, { id: 'core', label: 'Core & Abs' }] },
  { id: 'care', label: 'Mobility & Recovery', subs: [{ id: 'posture', label: 'Daily routine' }, { id: 'recovery', label: 'Recovery' }] },
  { id: 'ai', label: 'AI Plan', subs: [{ id: 'ai', label: 'AI Plan' }] },
  { id: 'food', label: 'Fuel Log', subs: [{ id: 'food', label: 'Fuel Log' }] },
  { id: 'physique', label: 'Physique', subs: [{ id: 'physique', label: 'Physique' }] },
];
const TAB_IDS = ['plan', 'bulk', 'push', 'pull', 'legs', 'core', 'recovery', 'posture', 'rules', 'ai', 'food', 'physique'] as const;
// Mobility was merged into Posture as one daily routine; old links land there.
function resolveTab(t: string | null): Tab | null {
  if (!t) return null;
  if (t === 'mobility') return 'posture';
  return (TAB_IDS as readonly string[]).includes(t) ? (t as Tab) : null;
}
const groupOf = (t: Tab) => GROUPS.find(g => g.subs.some(x => x.id === t))!;

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

/*
 * The Plan tab is the single gym-facing view: every session's exercises and sets
 * in one scroll, so nothing needs tab-hopping mid-workout. The exercise NAMES and
 * SETS are deliberately mirrored from the per-day tabs — those tabs keep the how
 * and the why, this one is the card you hold. If you change a session, change it
 * in both or they will drift apart.
 */
function DayCard({ day, name, focus, exercises, detailTab, setTab, note }: {
  day: string; name: string; focus: string; exercises: [string, string][];
  detailTab: Tab; setTab: (t: Tab) => void; note?: string;
}) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/8 flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <p className="font-black text-gray-100 text-sm">
            <span className="text-orange-400">{day}</span> · {name}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">{focus}</p>
        </div>
        <button onClick={() => setTab(detailTab)}
          className="text-[10px] font-bold bg-orange-500/10 border border-orange-500/25 text-orange-200 px-2.5 py-1 rounded-full flex-shrink-0">
          How &amp; why
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {exercises.map(([n, s]) => (
          <div key={n} className="flex items-baseline justify-between gap-3 px-4 py-2">
            <span className="text-[13px] text-gray-300">{n}</span>
            <span className="text-[11px] font-bold text-orange-400/90 flex-shrink-0">{s}</span>
          </div>
        ))}
      </div>
      {note && <p className="text-[11px] text-amber-200/70 leading-relaxed px-4 py-2.5 bg-amber-500/5">{note}</p>}
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
  ['Mon', 'Push', 'Chest, triceps, front delts'],
  ['Tue', 'Kickboxing', 'No lifting'],
  ['Wed', 'Legs + Speed', 'Sprints and jumps first, then heavy'],
  ['Thu', 'Pull', 'Back and biceps'],
  ['Fri', 'Shoulders & Arms', 'Width and arms'],
  ['Sat', 'Football', 'Your match'],
  ['Sun', 'Rest', 'Full rest — this is where it all happens'],
];

export default function Programs() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => resolveTab(params.get('tab')) ?? 'plan');
  // Follow ?tab= changes while already on this page (links between its own
  // tabs), not just on first mount.
  useEffect(() => {
    const t = resolveTab(params.get('tab'));
    if (t) setTab(t);
  }, [params]);

  const bat = skinsOn();
  const group = groupOf(tab);
  // Reopening a group returns to the page you last had open in it.
  const [lastSub, setLastSub] = useState<Partial<Record<Group, Tab>>>({});
  useEffect(() => { setLastSub(m => ({ ...m, [groupOf(tab).id]: tab })); }, [tab]);

  return (
    <main data-skin={skin('bat')} className={`min-h-screen bg-transparent text-white pb-24 ${bat ? '' : 'bg-gradient-to-b from-orange-950/30 via-transparent to-transparent'}`}>
      {bat && <SkinBackdrop kind="bat" />}
      <div className={`max-w-2xl mx-auto px-5 ${bat ? '' : 'pt-6'}`}>
        {bat
          ? <BatHero title="GYM" subtitle="Push, Pull, Legs, Shoulders around kickboxing — plus the bulk, fuel and physique." />
          : <SectionHeader icon={Dumbbell} title="Gym" subtitle="The plan · lean bulk · AI plan · food · physique" />}

        <TabBar tabs={GROUPS} active={group.id} onChange={g => setTab(lastSub[g] ?? GROUPS.find(x => x.id === g)!.subs[0].id)} />
        {group.subs.length > 1 && (
          <div className="flex gap-1.5 -mt-2 mb-5 overflow-x-auto scrollbar-hide" role="tablist">
            {group.subs.map(x => (
              <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${tab === x.id
                  ? 'bg-orange-400/15 border-orange-300/50 text-orange-100'
                  : 'bg-transparent border-white/10 text-gray-500 hover:text-gray-300'}`}>
                {x.label}
              </button>
            ))}
          </div>
        )}

        {/* ===== THE WEEK ===== */}
        {tab === 'plan' && (
          <div className="fade-up stagger space-y-4">
            <OneThing points={[
              'Your split, set up properly: Push Monday, kickboxing Tuesday, Legs Wednesday, Pull Thursday, Shoulders & Arms Friday, football Saturday, Sunday off.',
              'Legs once a week is fine for this look — kickboxing and football train them too. Make that one session count: heavy, hard and never skipped.',
              'Shoulders and arms get hit twice a week (Push or Pull, then Friday). That is where the Hemsworth look comes from.',
              'Eat for the sport: kickboxing, matches and big nights out all need more food — the Lean Bulk tab has the numbers.',
            ]} />
            <div className="bg-gradient-to-br from-orange-500/15 to-[#111] border border-orange-500/30 rounded-2xl p-5">
              <h3 className="font-black text-orange-300 mb-2">Push, Pull, Legs, Shoulders — around your kickboxing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your split was already the right idea: four lifting days, legs once, and a whole day for shoulders. The
                order is what makes it work. Legs goes the day after kickboxing, not the day before, so your kicks are
                not on dead legs, and it stays three days clear of Saturday's game. Shoulders goes on Friday, four days
                after Push, so the presses are fresh both times. Every session still starts with one explosive movement
                and ends with five minutes on your ankle.
              </p>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/8">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">The week</p>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  ['Mon', 'Push', 'Chest · triceps · front delts'],
                  ['Tue', 'Kickboxing', 'No lifting — eat for it'],
                  ['Wed', 'Legs + Speed', 'The one leg day'],
                  ['Thu', 'Pull', 'Back · biceps · rear delts'],
                  ['Fri', 'Shoulders & Arms', 'The Hemsworth day'],
                  ['Sat', 'Football', 'Your match'],
                  ['Sun', 'Rest', 'Daily routine, a walk'],
                ].map(([d, n, f]) => (
                  <div key={d} className={`flex items-center gap-3 px-4 py-2 ${n === 'Rest' ? 'bg-emerald-500/5' : ''}`}>
                    <span className={`text-[11px] font-black w-8 flex-shrink-0 ${n === 'Rest' ? 'text-emerald-400' : 'text-orange-400'}`}>{d}</span>
                    <span className={`text-[13px] font-bold flex-1 ${n === 'Rest' ? 'text-emerald-300' : 'text-gray-200'}`}>{n}</span>
                    <span className="text-[11px] text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setTab('bulk')} className="w-full text-left bg-[#111] border border-orange-500/30 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-bold text-orange-300">Building the Hemsworth look? Lifts stuck?</span>
                <span className="block text-[11px] text-gray-500 mt-0.5">The build, the lift standards, eating for kickboxing and nights out, and the lean bulk. Log lifts and weigh-ins there.</span>
              </span>
              <ChevronRight size={16} className="text-orange-300 flex-shrink-0" />
            </button>

            <DayCard day="MON" name="Push" focus="Chest, triceps and front delts" detailTab="push" setTab={setTab}
              exercises={[
                ['Med ball chest pass', '3 × 5'],
                ['Incline DB press', '4 × 8-10'],
                ['Bench press (barbell or machine)', '3 × 6-10'],
                ['Weighted dips', '3 × 8-10'],
                ['Cable fly or pec deck', '2 × 12-15'],
                ['Lateral raise', '3 × 12-15'],
                ['Triceps pushdown', '3 × 12'],
                ['+ Posture: band pull-aparts + doorway stretch', '2 × 15 · 2 × 30s'],
                ['+ Ankle finisher', '5 min'],
              ]}
              note="Chest gets its whole week here, so the two presses are both heavy. Shoulder pressing waits until Friday — doing it today as well would leave your front delts and triceps tired for both days. Pressing pulls the shoulders forward, so the pull-aparts and doorway stretch balance it out."
            />

            <DayCard day="TUE" name="Kickboxing" focus="Your class — this is your conditioning" detailTab="recovery" setTab={setTab}
              exercises={[
                ['Kickboxing class', 'as normal'],
                ['Extra food', '+500-800 kcal'],
                ['Protein meal within 2 hours after', '40g+'],
              ]}
              note="No lifting today. A hard class is a real training session, and it is your cardio for the week. Eat a proper carb meal 2-3 hours before and protein after. If your legs are smashed afterwards, that is fine — Wednesday's legs start with jumps, which wake them up."
            />

            <DayCard day="WED" name="Legs + Speed" focus="The one leg day — make it count" detailTab="legs" setTab={setTab}
              exercises={[
                ['Warm-up + build-up runs', '10 min'],
                ['Box jump or broad jump', '3 × 3'],
                ['Acceleration sprints', '4 × 20m'],
                ['Trap bar deadlift', '4 × 5'],
                ['Bulgarian split squat', '3 × 8/leg'],
                ['Leg extension', '2 × 12-15'],
                ['Nordic hamstring curl', '2 × 5'],
                ['Calf raises (straight + bent knee)', '2 × 15 each'],
                ['+ Posture: couch stretch + glute bridge', '2 × 45s/side · 2 × 12'],
                ['+ Ankle finisher', '5 min'],
              ]}
              note="Once a week means this session has to be hard: last sets 1-2 reps from failure, beat the logbook every week. Jumps and sprints BEFORE the lifting, never after. The leg extension is new — quads get less from football than glutes and hamstrings do."
            />

            <DayCard day="THU" name="Pull" focus="Back, biceps and rear delts" detailTab="pull" setTab={setTab}
              exercises={[
                ['Explosive pull-up', '3 × 3'],
                ['Weighted pull-up', '4 × 6-8'],
                ['Chest-supported row', '4 × 8-10'],
                ['Face pull', '3 × 15'],
                ['Incline DB curl', '3 × 10-12'],
                ['Hammer curl', '2 × 12'],
                ['+ Posture: prone Y-T-W + chin tucks', '2 × 10 · 2 × 10'],
                ['+ Ankle finisher', '5 min'],
              ]}
            />

            <DayCard day="FRI" name="Shoulders & Arms" focus="The Hemsworth day — width and arms" detailTab="push" setTab={setTab}
              exercises={[
                ['Seated DB shoulder press', '3 × 8-10'],
                ['Lateral raise', '4 × 12-20'],
                ['Cable lateral raise (lean-away)', '2 × 15/side'],
                ['Rear delt fly / reverse pec deck', '3 × 15'],
                ['Overhead cable triceps extension', '3 × 10-12'],
                ['Preacher or Bayesian cable curl', '3 × 10-12'],
                ['+ Posture: chin tucks + wall slides', '2 × 10 · 2 × 10'],
              ]}
              note="About 50 minutes. Side delts get three hits a week (Monday, Friday twice over) because width is the biggest part of the look and they recover fast. Upper body only, so Saturday's game is unaffected. Friday is also the most likely night out — train first, and see Lean Bulk for the clubbing rules."
            />

            <div className="bg-gradient-to-br from-amber-500/12 to-[#111] border border-amber-500/30 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-amber-500/20">
                <p className="font-black text-amber-300 text-sm">The ankle finisher</p>
                <p className="text-[11px] text-gray-500 mt-0.5">5 minutes, end of every session, plus rest days if you can</p>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  ['1. Banded eversion', '2 × 15/side', 'Band round the outside of your foot, push outward against it. Trains the muscles that actually fail when an ankle rolls.'],
                  ['2. Tibialis raises', '2 × 15', 'Heels forward against a wall, pull your toes up toward your shins. Balances out the calf.'],
                  ['3. Single-leg balance', '3 × 30s', 'Eyes open first. Once that is easy, eyes closed. Then standing on a cushion. Progress it or it stops doing anything.'],
                  ['4. Hop and stick', '2 × 5/side', 'Small hop forward, land on one leg, hold 3 seconds without wobbling. Only add this once the balance work is solid.'],
                ].map(([n, s, how]) => (
                  <div key={n} className="px-4 py-2.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-semibold text-gray-200">{n}</span>
                      <span className="text-[11px] font-bold text-amber-400/90 flex-shrink-0">{s}</span>
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">{how}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-amber-200/70 leading-relaxed px-4 py-2.5 bg-amber-500/5">
                Two months on and still not right is worth getting looked at — especially if it gives way, still swells
                after playing, or hurts at night. This routine is what to do meanwhile, and it is the part that actually
                stops the next sprain.
              </p>
            </div>

            <Fold title="Fitting it around kickboxing and games" tag="Short version: legs never the day before a kick or a kick-off" items={[
              ['The two rules', 'No heavy legs the day before kickboxing (you kick on dead legs and your technique goes), and none within 48 hours of a game. Wednesday is the only day that clears both.'],
              ['Saturday game', 'Mon Push · Tue Kickboxing · Wed Legs · Thu Pull · Fri Shoulders & Arms · Sat game. The default above.'],
              ['Sunday game', 'Same week works — legs are four days clear. Rest Saturday instead.'],
              ['No game that week', 'Keep the same days. Saturday becomes a rest day or a long walk.'],
              ['Kickboxing moves day', 'Keep legs the day AFTER it, and keep two days between Push and Shoulders & Arms. Pull can go anywhere.'],
              ['Two games that week', 'Skip leg day. Two matches plus kickboxing is already more leg work than a session would give you.'],
              ['If you only get one session', 'Make it Wednesday. One-a-week legs is the session you can least afford to miss.'],
            ]} />

            <Fold title="Is it optimal? The honest version" tag="What your split does well, and what it trades" items={[
              ['What it does well', 'Shoulders and arms twice a week, chest and back hit hard once, and every session short enough to actually finish. For the Hemsworth look — width up top, athletic legs — that is the right priority.'],
              ['What legs-once trades', 'Legs will grow slower than on twice a week. With kickboxing and football also training them, that is a fair trade for this goal. If you ever want bigger legs, add a second, lighter leg session on Monday after Push — not before kickboxing.'],
              ['Chest and back once a week', 'Fine while every session is hard and progressing. If chest lags, add 3 sets of incline press to Friday; if back lags, add 3 sets of pulldowns.'],
              ['Six hard sessions is the ceiling', 'Four lifting days, kickboxing and a match is a lot — add nights out and recovery is the limit, not the plan. Sunday stays completely off.'],
              ['Heavy week? Drop Friday first', 'Exams, two matches or poor sleep: drop Shoulders & Arms that week and keep the rest. Never drop legs — it only comes round once.'],
              ['If a session feels too easy', 'Add weight, not exercises. The programme stays the same for months; the numbers on it go up.'],
            ]} />
          </div>
        )}

        {/* ===== LEAN BULK ===== */}
        {tab === 'bulk' && (
          <div className="fade-up stagger space-y-4">
            <OneThing points={[
              'Stuck lifts are almost always food, not the programme. Football, padel and combat burn far more than the calorie number assumes — weigh in, and let the trend below tell you to eat more.',
              'Gain 0.1-0.35kg a week. Faster than that is mostly fat, and it shows on your face first.',
              'Log your best set on every main lift and beat it next time. Hit the top of the rep range, then add weight.',
              'For the Hemsworth build, Friday is Shoulders & Arms. Shoulders and arms get trained twice a week, chest and back once, legs once.',
            ]} />
            <div className="bg-gradient-to-br from-orange-500/15 to-[#111] border border-orange-400/40 rounded-2xl p-5" data-testid="hemsworth">
              <p className="font-hud text-[10px] font-bold uppercase tracking-[0.3em] text-orange-300/80">Target</p>
              <h3 className="font-black text-xl text-white mt-0.5">The Hemsworth build</h3>
              <p className="text-gray-400 text-sm leading-relaxed mt-1">
                Big round shoulders, a thick upper chest, arms and back that fill a T-shirt, and lean enough to show it — around
                12-14%, not shredded. Athletic legs, not bodybuilder legs. On a 6ft 4 frame, the shoulders do most of the work:
                wide delts make everything below them look smaller.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {[['92-98kg', 'bodyweight, lean'], ['84-88cm', 'waist at navel'], ['41-43cm', 'arm, flexed']].map(([v, k]) => (
                  <div key={k} className="rounded-xl bg-black/30 py-2.5">
                    <p className="font-hud text-base font-bold text-orange-200">{v}</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{k}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Rough targets for your height, not his published stats. The waist and the mirror matter more than the scale.</p>
            </div>

            <Block title="How you get there — what changes" items={[
              ['Push, Pull, Legs, Shoulders & Arms', 'Your own split, ordered around kickboxing (see The Plan). Shoulders and arms twice a week is the difference between "trains" and "built".'],
              ['Side delts three times a week', 'Lateral raises on Monday, then two kinds on Friday. Width is the single biggest part of this look, and side delts recover fast enough to train often.'],
              ['Every lift has a standard', 'Each lift in the tracker below shows its Hemsworth standard and how close you are. They are rough natural targets for this look on your frame — beat your last session, and the percentage takes care of itself.'],
              ['Lean bulk to about 92-95kg', 'Use the bulk check. If your waist climbs past 88cm before you get there, run a 4-6 week mini-cut, then carry on.'],
              ['Sport stays', 'Kickboxing and football keep the athletic look and your conditioning. You just eat for them — see the calorie table below.'],
            ]} />

            <Block title="The honest timeline" items={[
              ['What his build took', 'Years of training, a full-time trainer, a chef and a film schedule built around it. You are building the same look naturally, around uni and football, so it takes longer — and that is normal.'],
              ['6 months', 'Visibly bigger shoulders and arms, around 4-6kg up, lifts clearly heavier. People start to notice.'],
              ['1-2 years', 'Clearly built in a T-shirt. Most of the standards above 70%.'],
              ['3-4 years', 'The full look on a 6ft 4 frame. Tall builds take longer to fill out — that is the frame, not a lack of progress.'],
            ]} />

            <Block title="Lock in — the weekly non-negotiables" items={[
              ['Lift Mon, Wed, Thu, Fri — kickboxing Tuesday, football Saturday', 'Missed a day? Do it the next day. Never miss two in a row, and never miss legs.'],
              ['Log every main lift, weigh in 3-4 mornings', 'Two minutes a day. It is the only way to know whether you are progressing or just turning up.'],
              ['Protein at every meal, 8 hours in bed, 8-10k steps', 'The three things that decide whether the work turns into muscle.'],
              ['Sunday review, 5 minutes', 'Check the bulk-check verdict and any stalled lifts, take your progress photo in Physique, and make ONE change for the week. Then plan the week on Command.'],
              ['Use Lock In for sessions', 'Hit Lock In on Command when you start a session. Gym time counts toward your daily locked-in minutes, so the streak reflects training too.'],
            ]} />

            <BulkCheck />
            <LiftTracker />

            <Block title="Why your lifts have stalled — most likely first" items={[
              ['1. You are not actually in a surplus', 'A 90-minute match burns 800-1,000 kcal, kickboxing 500-800 and a big night of dancing several hundred more. The AI Plan calorie number counts gym days only, so it is probably below your real maintenance. If the bulk check says you are not gaining, this is the reason — no programme fixes it.'],
              ['2. Nothing is written down', 'Without a logbook most people lift the same weights for months without noticing. The tracker above sets the number to beat every session.'],
              ['3. Sets stop too far from failure', 'If you could have done 4-5 more reps, the set barely counts. Finish most working sets with 1-2 reps left, and take the last set of each isolation exercise to failure.'],
              ['4. Sessions that are not hard enough to need four days', 'With legs, chest and back trained once a week, every one of those sessions has to be heavy and progressing. A once-a-week session done at 70% effort barely counts.'],
              ['5. Sleep under 8 hours', 'Strength recovery and testosterone both run on sleep. Six-hour nights stall lifts on their own, and they make the surplus go to fat.'],
              ['6. The exercise keeps changing', 'A different machine, grip, depth or tempo every week makes progress impossible to see. Keep the setup identical and the same exercise for at least 8 weeks.'],
              ['7. Nights out and fatigue on lifting days', 'Drinking the night before a session costs you reps, and a hangover costs you the session. Keep nights out away from the night before legs (Tuesday) and the night before a game (Friday after training is the one that fits).'],
            ]} />


            <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden" data-testid="day-calories">
              <div className="px-4 py-3 border-b border-white/8">
                <p className="font-black text-orange-300 text-sm">Eat for the day you are having</p>
                <p className="text-[11px] text-gray-500 mt-0.5">On top of your base number (the AI Plan figure, corrected by the bulk check). Rough burns for a ~90kg lad — they vary a lot with effort.</p>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  ['Lifting day (Mon, Wed, Thu, Fri)', 'base', 'The AI Plan number already counts these.'],
                  ['Kickboxing (Tue)', '+500-800', 'A hard 60-90 min class. Carbs before, protein after.'],
                  ['Match day (Sat)', '+600-900', 'More if you play the full 90. Carbs the night before and the morning.'],
                  ['Big night out, dancing', '+300-500 food', 'Dancing for hours burns several hundred, but the drinks usually cover it — 4 pints is about 800 kcal. Eat a proper protein meal before you go, not just after.'],
                  ['Sunday rest', 'base', 'Do not cut it — rest days are when the growing happens.'],
                ].map(([d, k, n]) => (
                  <div key={d} className="px-4 py-2.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-semibold text-gray-200">{d}</span>
                      <span className="text-[12px] font-bold text-orange-300 flex-shrink-0">{k}</span>
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">{n}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-orange-200/70 leading-relaxed px-4 py-2.5 bg-orange-500/5">
                You do not need to count this exactly. Eat a bit more on the hard days, weigh in, and let the bulk check
                correct the base number every two weeks.
              </p>
            </div>

            <Block title="Clubbing and the build — the honest version" items={[
              ['The burn is real, the drinks cancel it', 'A few hours of dancing burns a lot, but alcohol is the bigger effect: heavy drinking after training measurably cuts muscle building for that day, wrecks deep sleep, and holds water in your face for 2-3 days.'],
              ['Pick the night', 'Saturday after the game, or Friday after Shoulders & Arms when there is no game the next day. Never the night before legs (Tuesday) or a match.'],
              ['Before you go', 'A proper meal with 40g+ protein and carbs. You drink less, you feel better, and the night still counts toward your protein.'],
              ['While you are out', 'Spirits with a diet mixer instead of pints, and a water between drinks. Same night, roughly half the calories and half the hangover.'],
              ['After', 'Water and something with protein before bed. A takeaway is fine now and then on a bulk — just expect a puffier face for a day or two from the salt.'],
              ['The next day', 'Train if you can — hungover training beats no training — but drop the weight 10% and do not chase records.'],
            ]} />

            <Block title="The lean bulk, set up properly" items={[
              ['Calories', 'Start at the AI Plan number and add for the day you are having (table above). After two weeks, let the bulk check adjust the base in 150-200 kcal steps. The scale trend beats any calculator.'],
              ['Protein', '1.6-2.2g per kg every day, split across 4 meals. Aura → Diet has the meal plan and the Sainsbury\'s prep recipes.'],
              ['Carbs around training', 'Rice, oats, potatoes and fruit before and after sessions and matches. Carbs are what let you add reps, and they are the easiest surplus calories to eat.'],
              ['Rate', '0.1-0.35kg a week, about 0.5-1.5kg a month. At 19 that is mostly muscle when you train hard. Faster than that is mostly fat.'],
              ['Length', 'Run it 4-6 months, then reassess. If your jawline has softened, do a 4-6 week mini-cut at 400-500 kcal under maintenance, keeping the same lifting. Then bulk again.'],
              ['What to expect', 'Past the first year, good progress is a rep or a small jump every 1-3 weeks on each lift — about 2.5-5kg a month on trap bar and bench, and 2kg per hand every month or two on dumbbells. Slow and steady is still progress.'],
            ]} />

            <Block title="Keeping your jawline while you grow" items={[
              ['Start lean', 'Begin the bulk with a visible jawline (roughly 12-14% body fat). Bulking from a softer starting point puts you in the "puffy" zone within weeks.'],
              ['Watch your waist, not just the scale', 'Measure at the navel every two weeks in Physique. More than about 1cm a month means the surplus is too big — the bulk check flags it.'],
              ['Same photo every week', 'Same mirror, same light, first thing in the morning, in the Physique tab. A face slowly softening is invisible day to day, but obvious side by side.'],
              ['Puffy is not the same as fat', 'A salty takeaway, big carb days and alcohol hold water in your face for 1-3 days. Judge the weekly trend, not one morning. Aura → Body & Habits has the debloat routine.'],
              ['Keep steps at 8-10k', 'Bulking is not a licence to stop moving. Daily steps keep the surplus going to muscle and stop your appetite running the show.'],
              ['Posture', 'Holding your head forward hides your jaw at any body fat. Keep doing the posture finishers.'],
            ]} />

            <Fold title="When to add weight — double progression" tag="The rule the tracker uses" items={[
              ['The rule', 'Each lift has a rep range, e.g. 8-10. Keep the same weight and add a rep each session. When your best set reaches the top of the range, add the smallest jump and drop back to the bottom.'],
              ['Smallest jumps', 'Dumbbells 2kg per hand, barbell lifts 2.5kg, trap bar 5kg, dips and pull-ups 2.5kg added. If the gym jumps more than that, add a rep at a time instead.'],
              ['Log the best set', 'Log the heaviest set you did with clean form, not your warm-ups. Same depth, same pause, same range every time, or the number means nothing.'],
              ['A bad day is not a stall', 'Bad sleep or a match the day before can cost you a rep. The tracker only flags a stall after three sessions over two weeks without a new best.'],
            ]} />
          </div>
        )}

        {/* ===== AI PLAN, FOOD LOG, PHYSIQUE — merged into Gym ===== */}
        {tab === 'ai' && <div className="fade-up"><Plan embedded /></div>}
        {tab === 'food' && <div className="fade-up"><FoodLog embedded /></div>}
        {tab === 'physique' && <div className="fade-up"><Physique embedded /></div>}

        {/* ===== PUSH ===== */}
        {tab === 'push' && (
          <div className="fade-up stagger space-y-4">
            <OneThing points={["Explosive first while fresh, then heavy presses, then shoulders and triceps.", "Stop most sets with 1-2 reps left; take the last isolation set to failure."]} />
            <Session
              title="Monday — Push"
              tag="Chest, shoulders, triceps · explosive first"
              block="Bodybuilding day: 6-12 reps, 1-2 reps left in the tank on most sets, 90-120s rest on compounds and 60s on isolation. Take the last set of each isolation exercise to genuine failure."
              exercises={[
                { name: 'Med ball chest pass', sets: '3 × 5', targets: 'Chest · shoulders · triceps — power', how: "Half-kneeling or standing a metre from a wall, ball at your chest. Throw it into the wall as hard as you physically can, catch, reset. Half-kneeling takes the legs out so the upper body does the work.", why: 'The explosive movement of the day and the reason it goes first. Pressing heavy builds the capacity; throwing hard is what teaches you to use it fast — which is what shrugging someone off a ball actually is.' },
                { name: 'Incline DB press', sets: '4 × 8-10', targets: 'Upper chest · front delts · triceps', how: "Bench at 30 degrees — steeper turns it into a shoulder press. Dumbbells start at chest level with wrists stacked over elbows. Lower under control until you feel a stretch across the upper chest, then press up and slightly together without clanging them. Shoulder blades pulled back and down into the bench the whole set.", why: 'Upper chest first while you are freshest — it is the region that most decides how a chest looks in clothes, and the one that lags when you always start flat.' },
                { name: 'Seated DB shoulder press', sets: '4 × 8-10', targets: 'Front and side delts · triceps · upper traps', how: "Back supported, dumbbells starting at ear height with elbows slightly in front of the body rather than flared straight out to the sides. Press up and slightly in until they nearly touch. Do not lock out and rest at the top — keep tension and come straight back down.", why: 'Overhead pressing for front delt mass and overhead strength. Seated removes leg drive so the delts do the work.' },
                { name: 'Weighted dips', sets: '3 × 8-10', targets: 'Lower chest · triceps · front delts', how: "Lean the torso forward about 30 degrees to bias the chest — staying upright shifts it to triceps. Lower until your upper arms are roughly parallel to the floor, no deeper if your shoulders complain. Elbows tucked in, not flaring wide. Add weight via a dip belt.", why: 'Lower chest and triceps under a big stretch. Lean forward about 30 degrees to bias the chest rather than sitting upright.' },
                { name: 'DB lateral raise', sets: '4 × 12-15', targets: 'Side delts — the width builder', how: "Very light. Slight forward lean, tiny bend in the elbows, lead with the elbows rather than the hands as if pouring a jug. Raise to shoulder height only. Lower slowly over 2-3 seconds — most people get nothing from this exercise because they drop the weight.", why: 'THE width exercise. Side delts create the shoulder-to-waist silhouette. Light, strict, no swinging — this is the one lift where ego costs you the most.' },
                { name: 'Triceps pushdown', sets: '3 × 12-15', targets: 'Triceps — lateral and medial heads', how: "Elbows glued to your ribs, torso upright, no leaning in to cheat the weight down. Push down until the arms are fully locked, spread the rope at the bottom, then control the way back up until the triceps are stretched.", why: 'Finishes the lateral head with high-rep work. Elbows pinned, last set to failure.' },
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
            <OneThing points={["A wide, thick back is what makes a frame look big in a T-shirt. Weighted pull-ups are the lift.", "Pull with your elbows, pause the squeeze, control the way down."]} />
            <Session
              title="Thursday — Pull"
              tag="Back and biceps · explosive first"
              block="Width first, then thickness, then arms. Back responds well to high volume — do not be afraid of the set count here. Neck and grip at the end are the combat-specific pieces almost nobody trains."
              exercises={[
                { name: 'Explosive pull-up', sets: '3 × 3', targets: 'Lats · biceps · upper back — pulling power', how: "From a dead hang with shoulders set, pull as fast as you can, aiming to get your chest to the bar. Lower under control, reset fully, then go again. Speed is the point — stop the set the moment a rep slows down.", why: 'Pulling power for duels and grappling without any hinge, so your lower back gets the day off the day after Wednesday\'s deadlifts.' },
                { name: 'Weighted pull-ups', sets: '4 × 6-8', targets: 'Lats · teres major · biceps · mid back', how: "Slightly wider than shoulder-width, full hang at the bottom with shoulders active rather than dead. Think about pulling your elbows down into your back pockets rather than pulling your chin up. Chest to the bar, controlled descent to a full stretch every rep.", why: 'The best lat width builder there is. Add weight once you can do 10 clean bodyweight reps. Lats are also your clinch and grappling strength.' },
                { name: 'Chest-supported row', sets: '4 × 8-10', targets: 'Mid back · lats · rear delts', how: "Lie face-down on a bench set to about 30-45 degrees with a dumbbell in each hand (or use a chest-pad T-bar or machine row). Let the shoulder blades stretch forward at the bottom, then drive the elbows back toward your hips and squeeze for a beat. Chest stays on the pad the whole time — no heaving.", why: 'All of the back thickness of a barbell row with none of the lower-back load. A bent-over row two days after heavy deadlifts is the classic way to overload the lower back; this removes it.' },
                { name: 'Face pulls', sets: '3 × 15-20', targets: 'Rear delts · external rotators · mid and lower traps', how: "Rope set at roughly face height. Pull the rope apart and toward your forehead, finishing with hands beside your ears and elbows high. Externally rotate at the end so your knuckles face the ceiling. Light weight and a two-second squeeze beats heavy.", why: 'Rear delts and external rotators. This is both a posture exercise and the thing that keeps your shoulders healthy under all the pressing.' },
                { name: 'Incline DB curl', sets: '3 × 10-12', targets: 'Biceps — long head, under stretch', how: "Bench at 45-60 degrees, arms hanging straight down behind the body line — that stretch is the whole point of the exercise. Curl without letting the elbows drift forward, squeeze at the top, lower slowly to a full stretch.", why: 'Incline puts the biceps long head on stretch, which is where the growth is. Biceps also assist every pull and underhook.' },
                { name: 'Hammer curl', sets: '3 × 12', targets: 'Brachialis · brachioradialis · forearms', how: "Neutral grip, palms facing each other, held throughout. Elbows fixed at your sides, no swinging. Curl to shoulder height and lower under control. The brachialis sits under the biceps and pushes it up, adding visible arm thickness.", why: 'Brachialis and forearm — arm thickness plus the grip strength that decides clinch battles.' },
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
        {/* ===== LEGS ===== */}
        {tab === 'legs' && (
          <div className="fade-up stagger space-y-4">
            <OneThing points={["Fast first, then heavy: jumps and sprints while fresh, trap bar deadlift, split squats, Nordics, calves.", "Your ankle is not fully healed — step down from boxes, no depth jumps yet, and do the finisher every session.", "Keep legs at least 48 hours before a game.", "The trap bar is your one heavy back exercise of the week: brace hard and leave two reps in the tank. Pull day uses chest-supported rows so your lower back recovers."]} />
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">One leg day: fast first, then heavy</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Wednesday opens with jumps and sprints while you are fresh, which is what makes you quicker, then the trap bar
                and single-leg work for strength, then Nordics and calves. The ankle finisher closes it. Everything a footballer
                needs from legs, in one session, four days clear of Saturday.
              </p>
            </div>
            <Session
              title="Wednesday — Legs + Athletic"
              tag="Explosive first · then heavy · one session"
              block="ORDER MATTERS: jumps, throws and sprints first while the nervous system is fresh, then the trap bar heavy with full recovery (3 min), then the short accessory block. Deliberately lean — about 11 lifting sets on top of the jumps and sprints. You are training legs once a week alongside football, so this is about quality and recovery, not volume. It is the longest session of the week by design, because it is the only leg day."
              exercises={[
                { name: 'Thorough warm-up', sets: '10-12 min', targets: 'Whole body · nervous system prep', how: "5 min easy jog, then leg swings front-to-back and side-to-side, walking lunges, A-skips and high knees. Finish with 3-4 build-up runs of about 40m at 60, 70, 80 then 90 percent. You should feel warm and springy before the first real sprint.", why: 'Non-negotiable before sprinting. Easy jog, leg swings, A-skips, then 3-4 build-up runs at 60, 70, 80 and 90%. Cold hamstrings plus max sprints is how you tear something.' },
                { name: 'Box jump or broad jump', sets: '3 × 3', targets: 'Glutes · quads · calves — triple extension', how: "Box: quarter squat, swing the arms, explode up and land softly in the same quarter-squat position on top. Step down, never jump down. Broad: same swing, jump forward for distance and stick the landing. Full reset between reps — this is quality work, not conditioning.", why: 'Pure triple extension — ankle, knee and hip firing together. Step down from box jumps, never jump down. Full reset between reps.' },
                { name: 'Acceleration sprints', sets: '4 × 20m', targets: 'Glutes · hamstrings · quads — starting power', how: "Start from a staggered stance, torso leaning forward around 45 degrees. Drive the knees and push the ground back behind you, rising gradually to upright over 15-20m rather than popping up immediately. Walk back slowly for full recovery between reps.", why: 'Football is won in the first 5-20 metres. Vary the start — standing, side-on, rolling — and walk back slowly for full recovery.' },
                { name: 'Trap bar deadlift', sets: '4 × 5', targets: 'Glutes · hamstrings · quads · spinal erectors · grip', how: "Stand inside the bar, feet hip-width. Hips slightly higher than a squat but lower than an RDL, chest up, lats tight, arms straight. Push the floor away rather than pulling with the back — the bar should leave the ground with your hips and chest rising together. Reset your brace between reps rather than bouncing them off the floor.", why: 'Your main strength lift. It loads the whole posterior chain plus the quads in one movement, with far less spinal cost than a conventional pull and less technical demand than a heavy squat — which is exactly what you want on a day that also has sprints in it.' },
                { name: 'Bulgarian split squat', sets: '3 × 8/leg', targets: 'Quads · glutes · adductors · balance', how: "Rear foot on a bench behind you, front foot far enough forward that your front shin stays near vertical. Drop straight down until the back knee is just off the floor. More forward lean hits glutes, more upright hits quads. The front leg does everything — the back leg is only balance.", why: 'Football happens on one leg. Single-leg strength transfers more directly to cutting, kicking and planting than any bilateral lift.' },
                { name: 'Nordic hamstring curl', sets: '2 × 5', targets: 'Hamstrings — eccentric strength', how: "Kneel with your ankles anchored under something solid or held by a partner. Body straight from knees to head, squeeze the glutes. Lower yourself forward as slowly as you possibly can, resisting the whole way, then catch with your hands and push back up. Even lowering 20-30 degrees under control is a working rep at the start.", why: 'The single most evidence-backed hamstring injury prevention exercise there is. Now only once a week rather than twice, so the extra sets here make up part of the difference — see the note below.' },
                { name: 'Standing calf raise', sets: '2 × 12-15', targets: 'Gastrocnemius', how: "Balls of the feet on a raised edge, knees straight. Drop the heels for a full stretch, pause a beat at the bottom, then drive up onto the toes and hold the top for a second. Straight knees are what target the gastroc rather than the soleus.", why: 'Stiff, springy ankles are free speed and protect against rolled ankles. Pause at the top, full stretch at the bottom.' },
                { name: 'Seated calf raise', sets: '2 × 12-15', targets: 'Soleus', how: "Seated with the pad over the knees, balls of the feet on the platform. Knees bent to 90 degrees is what shifts the work from the gastroc to the soleus. Full stretch at the bottom, hard squeeze at the top, slow throughout.", why: 'Seated targets the soleus, which the standing version misses. The soleus takes enormous load in running.' },
              ]}
            />
            <Block title="Your back — how the week protects it" items={[
              ['One heavy hinge a week, and this is it', 'The trap bar deadlift on Wednesday is the only exercise in the plan that loads your lower back heavily. Pull day uses chest-supported rows and pull-ups, so your lower back recovers between Wednesday and Saturday\'s football.'],
              ['Why the trap bar, not a straight bar', 'You stand inside the weight, so your torso stays more upright and the load sits closer to your spine. It is the most back-friendly way to lift heavy from the floor.'],
              ['Brace before every rep', 'Big breath into your belly, tighten as if someone is about to punch you in the stomach, then lift. Reset the brace on the floor between reps — no bouncing.'],
              ['Leave two reps in the tank', 'Every set of 5 should feel like you could have done 7. Grinding out the last rep is where backs round and get hurt.'],
              ['If your back feels it the next day', 'Normal muscle soreness in the lower back for a day is fine. Stiffness past 48 hours means the load or the form is off: drop the weight 10-15% for two weeks and film a set from the side.'],
              ['Swaps if your back is sore', 'Trap bar deadlift → leg press or belt squat for the same sets. Bulgarian split squat → hold one dumbbell in front (goblet) instead of two at your sides. Ab wheel on core day → dead bugs.'],
              ['When to see someone', 'Pain that travels down your leg, numbness or tingling, or pain that wakes you at night is not a gym problem. See a GP or physio before lifting heavy again.'],
            ]} />
            <Fold title="Starting legs with weak ankles" tag="Where to begin, and what to leave until later" items={[
              ['Get it checked if any of this applies', 'Be honest about which problem you have. "Weak" is trainable. But if you get actual pain, swelling, a feeling of the ankle giving way under you, or you had a bad sprain that never got proper rehab, that needs a physio looking at it rather than a training plan — recurrent instability usually means specific tissue that did not heal properly, and loading it harder makes it worse. Everything below assumes weak and stiff, not injured.'],
              ['The principle: train legs hard where the ankle is not the limit', 'You do not have to wait for your ankles to be strong before training legs. You just have to pick movements where the ankle is not the thing being tested — which is most of the highest-value leg exercises anyway.'],
              ['Start here — minimal ankle demand', 'Leg press, hack squat, leg extension, leg curl, hip thrust and glute bridge. Your foot is supported or fixed throughout, so you can load these genuinely heavy from week one and build real quad, hamstring and glute mass while the ankle catches up. Nothing about this is a downgrade — the leg press and hip thrust are in the main session for a reason.'],
              ['Then bilateral free weights, with two adjustments', 'Goblet squat, then back squat. Adjustment one: elevate your heels (small plates or proper lifting shoes) — that reduces how much ankle dorsiflexion the squat demands and instantly makes depth easier. Adjustment two: squat to a box at first so you control the depth rather than discovering it.'],
              ['Leave single-leg work until later — it is the ankle test', 'Bulgarian split squats, lunges and single-leg RDLs all demand real ankle stability, which is exactly what you do not have yet. They are in the main programme and they are excellent, but they are a week 4-6 addition, not a week 1 one. When you add them, start with a hand on something for balance and no weight at all.'],
              ['Plyometrics come LAST, and this matters', 'Jumping and especially LANDING is the single highest ankle-stability demand in the whole programme. Until your ankle is solid, modify the explosive block at the start of leg day: keep the sprint build-ups, swap broad jumps for box jumps, and step down from the box every time. No depth jumps or lateral bounds yet. Landing badly on a weak ankle is the most likely way to turn "a bit weak" into a genuine injury.'],
              ['The ankle work itself — 10 min, 4-5× a week', 'Standing calf raises 3 × 12-15 with a slow lowering and a full stretch at the bottom. Seated calf raises 3 × 15 (knees bent hits the soleus, which the standing version misses). Tibialis raises 3 × 15 — back against a wall, heels forward, pull your toes up toward your shins; almost nobody trains the front of the shin and it is what balances the calf. Banded eversion 2 × 15 each side — band around the outside of the foot, push outward against it; this trains the peroneals, the muscles that actually fail in a rolled ankle.'],
              ['Balance, progressed properly', 'Single-leg stand 3 × 30s per side. When that is easy: eyes closed. Then on a cushion or folded towel. Then single-leg stand while reaching to touch the floor. This trains the reflexive stability that stops an ankle rolling in the first place, and it costs you nothing but a few minutes.'],
              ['Fix the dorsiflexion while you are at it', 'Test it: kneel with your toes about 10cm from a wall and try to touch your knee to the wall with your heel down. If you cannot, that stiffness is limiting your squat and pushing load elsewhere. Fix with calf stretches held 45s, and banded ankle mobilisations — band around the ankle pulling backwards while you drive the knee forward over the toes, 2 × 15 each side.'],
              ['Footwear, since it genuinely matters', 'Lift in flat, firm shoes or barefoot — not soft running shoes, whose compressible heel makes an unstable ankle worse. If your dorsiflexion is the limiting factor on squats, actual weightlifting shoes with a raised heel are a legitimate purchase rather than a gimmick.'],
              ['A realistic 8-week ramp', 'Weeks 1-3: machines and hip thrusts heavy, plus the ankle work daily. Weeks 4-6: add goblet and box squats heels-elevated, begin single-leg work bodyweight only. Weeks 6-8: load the single-leg work, start reintroducing jumps with soft landings. Week 8+: full session including plyometrics. Do not compress this because your legs feel ready — your legs will be ready before your ankles are, and that mismatch is what causes the injury.'],
              ['When to stop and reassess', 'Sharp pain, swelling that appears after sessions, the ankle giving way, or pain that is worse the next morning rather than better. Ordinary muscle soreness in the calves and shins from new work is expected and fine — joint pain is not.'],
            ]} />

            <Fold title="Copenhagen planks — the complete guide" tag="The groin exercise, in full: progression, form, protocol, evidence" items={[
              ['What it actually is', 'A side plank where your TOP leg is supported on a bench and holds your hips up, so the inner thigh of that top leg is doing the work. It loads the adductors — mainly adductor longus — in a lengthened, weight-bearing position, which is precisely the position where groin strains happen.'],
              ['Why it matters more than it looks', 'Groin and adductor problems are among the most common injuries in football and a persistent nuisance in grappling. Low adductor strength is one of the better-established risk factors, and the Copenhagen is the single best-evidenced way to raise it — a large randomised trial in footballers found a substantially lower rate of groin problems in the group doing it. Treat that as a meaningful reduction in risk, not immunity.'],
              ['Step 1 — Isometric ball squeeze (if you are starting from nothing)', 'Lying on your back, knees bent, ball or rolled towel between the knees. Squeeze at about 70% for 20-30 seconds, 3-5 reps. Costs almost nothing in fatigue or soreness and is the right entry point if your groin is currently cranky or you are mid-season.'],
              ['Step 2 — Side-lying adductor raise', 'Lie on your side, top leg bent and resting in front of you, bottom leg straight. Lift the BOTTOM leg toward the ceiling using the inner thigh. 3×10-12 each side. Bodyweight only, no bench needed, and it teaches you where the adductor actually is.'],
              ['Step 3 — Short-lever Copenhagen (the real starting point)', 'Side plank position on your forearm, top leg resting on the bench AT THE KNEE. Lift your hips and bottom leg until your body is one straight line, hold, then lower under control. Start with 3×10-15 second holds, or 3×5 slow reps. This is where almost everyone should begin — the knee-supported version roughly halves the lever and the load.'],
              ['Step 4 — Long-lever Copenhagen', 'Same position, but the bench now supports the top leg at the ANKLE. This is the full version and it is genuinely hard. Build to 3×8-12 reps or 3×20-30 second holds per side. Do not jump here from nothing.'],
              ['Step 5 — Progress beyond bodyweight', 'Once long-lever 3×12 is comfortable: slow the lowering to 3-4 seconds, add a pause at the top, wear a light ankle weight on the bottom leg, or have a partner hold your top leg instead of a bench (harder, because there is no friction to help you).'],
              ['Form — the five cues that matter', 'One: body in a straight line from ear to ankle, no sagging and no piking up. Two: drive the top leg DOWN into the bench — that is what holds you up. Three: hips stay stacked and square, do not let the top hip roll backwards (the most common cheat, and it takes the adductor out of it entirely). Four: ribs down, glutes on, do not arch the lower back. Five: the bottom leg lifts to meet the top, it does not dangle.'],
              ['The protocol that the evidence uses', 'Roughly an eight-week progressive build, 2-3 sessions a week: start at 1 set of 3-5 reps, add reps and then sets each week, working toward about 3 sets of 12-15 by the end. Then drop to one session a week to maintain. The exact published numbers vary between studies — the shape matters more than the precise figures: start absurdly easy, add slowly, then maintain forever.'],
              ['Expect brutal soreness if you rush it', 'Adductor DOMS from a first long-lever session is famously severe and can last three or four days, which is exactly how people end up abandoning the exercise. Starting short-lever with low volume is not being soft, it is the difference between doing this for years and doing it once.'],
              ['Where it goes in your week', 'End of this session, after the heavy work. Never the day before a match or hard sparring — sore adductors change how you move and that is its own injury risk.'],
              ['When NOT to do it', 'Do not start it with an acute groin strain, with hip pain that pinches in the front of the joint (possible impingement or labral issue), or after a hernia repair without clearance. Groin pain that has lasted weeks needs a physio, not a harder plank — the differential includes hip joint, hernia and pubic bone problems that this exercise will not fix.'],
              ['Why it works for football specifically', 'Cutting, decelerating and the kicking swing all load the adductors eccentrically at long lengths. That is the exact demand the long-lever version trains, which is why it transfers better than machine adduction.'],
              ['Why it works for grappling', 'Closed guard, knee shield, butterfly hooks and defending leg entries are all adductor-dominant, often held for long periods under someone actively trying to open them. Strong adductors are also why some people are miserable to pass.'],
              ['The pairing', 'Nordics for hamstrings, Copenhagens for groin. Between them they cover the two most common non-contact soft-tissue injuries in the sports you play, they need no equipment beyond a bench, and they take about six minutes.'],
              ['The honest limit', 'This lowers risk, it does not remove it, and it only works while you keep doing it — the benefit fades once you stop. Adherence, not the exercise, is the actual problem: most people who get injured knew about this and had stopped doing it weeks earlier.'],
            ]} />
            <Fold title="Hip thrusts and everything else you could add" tag="What is actually worth a slot, and what is filler" items={[
              ['Hip thrusts — not bullshit, just not needed here', 'They are a legitimate exercise: they load hip extension at the top range where a squat is easiest, they produce very high glute activation, and they cost almost nothing in spinal load. The overselling is the sprint claim — the research comparing hip thrusts to squats for sprint speed is genuinely mixed, with neither clearly better. So they are real, just not magic.'],
              ['Why they are out of your programme', 'Hip extension is already covered three times on Wednesday: the trap bar, Bulgarian split squats and the sprints themselves. Adding a fourth is volume without new stimulus, and volume is the thing you asked to cut. Add them back only if your glutes become a visible weak point, or if a back issue ever stops you loading the trap bar.'],
              ['Genuinely worth their slot', 'Trap bar deadlift, Bulgarian split squats, Nordics, Copenhagens, calf raises both straight and bent-knee, sprints and jumps. Every one is either the main driver of a quality you need or the cheapest insurance against an injury that would cost you months. Nothing on that list is there for looks.'],
              ['Worth adding only for a specific reason', 'Leg press if leg SIZE becomes the goal again. Single-leg extensions if the quad on your sprained side is visibly weaker. Romanian deadlifts if hamstrings keep tightening after sprints. Hip thrusts if glutes lag. Hack squat if your lower back is the thing limiting your squatting. Each of these solves one named problem — if you cannot name the problem, you do not need the exercise.'],
              ['Actual filler, for you', 'Banded glute kickbacks, abductor and adductor machines, BOSU and wobble-board work, "activation" circuits before lifting, and most of what appears in gym content designed to look novel. None of it is harmful; it just takes the slot of something that does more. The exception is the balance work in your ankle rehab, which has a real evidence base and a specific job.'],
              ['The test before adding anything', 'What quality does this build, is that quality already covered on this day, and what am I removing to make room? If you cannot answer all three, the answer is no. That question is how this session went from twenty-five sets to sixteen.'],
            ]} />

            <Block title="Why one leg day, and what it costs" items={[
              ['This day is deliberately short now', 'The trap bar replaced the squat, hip thrust and leg press as the single main lift — it loads the same posterior chain and quads in one movement, and cutting those three frees Saturday for rest, sport, or extra padel/football rather than a second gym session.'],
              ['What lowering the volume costs you', 'Less leg size, honestly. About 11 lifting sets instead of 25 is enough to keep and slowly build strength alongside football, but it is not a hypertrophy programme for legs any more. That is the correct trade while an ankle is still settling and you want the athletic block done well — but it is a trade, not a free win.'],
                            ['If you add single-leg extensions, this is why', 'Not for size. After an ankle sprain the quad on that side is almost always measurably weaker, and bilateral lifts hide that gap because the good leg quietly takes more. One leg at a time exposes it. Train the weaker side first, let it set the reps, and let the strong side match — that is how the gap closes rather than widens.'],
              ['If you add RDLs, this is why', 'The trap bar is a squat-hinge hybrid: it loads the hamstrings, but not at long length. Hamstrings tear at long lengths during the swing phase of sprinting, which is the single most common non-contact injury in football. Two moderate sets chasing the stretch — not a max attempt — is the cheapest protection available for the exact thing you do most.'],
              ['Rotate the squat back in every third week', 'Trap bar is the main lift because it is the best strength-per-unit-of-fatigue option on a day that also has sprints. But the squat pattern is worth keeping: every third week, swap the trap bar for back squats 4 x 5 at a load you can control. Same slot, same sets, no extra volume.'],
              ['If you want the leg size back later', 'Add the fifteen-minute machine finisher to the Push day — leg press, leg curl, calves. High rep, low fatigue, and it does not touch this session or your ankle.'],
              ['The one real trade-off: Nordic frequency', 'Research protocols that roughly halve hamstring injury rates use Nordics twice a week. Dropping to once a week is still valuable, just not quite as protective. With this day trimmed, the honest fix is a short Nordic-only set on a rest day — three sets, five minutes, no equipment — rather than reviving a second leg day. Hamstrings are the most commonly torn muscle in football and this is the cheapest insurance there is.'],
              ['Will heavy legs make me slower? No', 'Strength is the foundation of power. What makes people slow is gaining weight while dropping the sprint and jump work that teaches the body to use it — which is exactly what the explosive block at the start of leg day exists to prevent.'],
              ['Strength first, then convert it', 'A stronger leg can produce more force. The jumps and sprints that open this session train you to produce that force fast. Doing only one of the two is why people end up either strong and slow, or fast and fragile.'],
              ['Do not chase a trap bar number at any cost', 'Once your trap bar pull is roughly 2x bodyweight, extra maximal strength returns less for sport than more speed work. Keep progressing, but never at the expense of the jumps and sprints.'],
            ]} />

            <Fold title="Isometrics — the quality nobody trains" tag="Two types, two completely different jobs" items={[
              ['Overcoming isometrics — pushing against something immovable', 'Push or pull as hard as humanly possible against an object that will not move: a loaded bar set on safety pins at a fixed height, a wall, a doorframe, an immovable strap. 3-5 sets of 3-5 seconds at genuine maximum effort. This builds the ability to produce force FAST from a dead stop, which is exactly what a first step and a collision are.'],
              ['Yielding isometrics — holding a position under load', 'Hold a hard position against gravity and resist it moving: a paused split squat at the bottom, a Copenhagen hold, a mid-range chin-up hold, a wall sit. 3 sets of 20-45 seconds. This builds tendon stiffness and the ability to hold a joint position under someone else pushing on it — the "immovable" feeling.'],
              ['Why they are worth your time', 'You can produce more force isometrically than you can in any moving rep, with almost no eccentric component — which means high force with very little soreness or recovery cost. That combination is rare, and it is why they fit perfectly in a week that already has football and a heavy leg day in it.'],
              ['The honest limitation', 'Strength gains from isometrics are strongest around the joint angle you train, and carry over less to angles you did not train. So pick positions that matter: the bottom of a squat, mid-range of a press, the position you actually get stuck in. Do not treat them as a replacement for lifting through a full range.'],
              ['The four worth doing', 'Overcoming mid-thigh pull (drive a fixed bar upward — full-body force production). Split-squat hold at the bottom (single-leg strength in the position football puts you in). Wall-supported isometric press. Copenhagen hold for the groin, which is already in your Legs tab.'],
              ['Where to put them', 'Overcoming isometrics go in the explosive block at the start of this session while you are fresh; yielding holds go at the very end when fatigue no longer matters. Twice a week if you also add a set on a rest day. Breathe out through the hold — when the fatigue does not matter. Breathe out through the hold — holding your breath through a maximal iso spikes blood pressure hard.'],
              ['The cue that makes them work', 'Intent is everything. A 4-second push at 80% builds almost nothing; the same 4 seconds at genuine 100% builds a lot. If you can hold a conversation during it, you are not doing it properly.'],
            ]} />
          </div>
        )}

        {/* ===== CORE ===== */}
        {tab === 'core' && (
          <div className="fade-up stagger space-y-4">
            <OneThing points={["Ten minutes at the end of each session, a different job each day.", "Visible abs are made by body fat, not crunches. The core work is for strength and sport."]} />
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2">Core — a different job each session</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trunk has four jobs: resist extension, resist rotation, resist sideways bend, and produce rotation.
                Football and fighting need all four, and visible abs need loaded reps rather than endless crunches. Each of
                your three sessions ends with ten minutes covering a different job, so the week covers everything without
                an extra day. Rotational power beyond this is in Combat → Strength &amp; Power.
              </p>
            </div>
            <Session
              title="Mon (Push) — Rotational power + ab growth"
              tag="Produce rotation"
              open={false}
              block="End of Push day, before the ankle finisher. 12 minutes. The cable crunch is the growth slot: load it and progress the weight like any other muscle."
              exercises={[
                { name: 'Cable woodchop', sets: '3 × 10/side', targets: 'Obliques · rotational chain', how: "Cable set high (or low for the reverse). Feet planted, pivot the back foot and rotate through the hips while the arms stay relatively straight. Pull across and down to the opposite hip. Rotate from the trunk and hips, not by yanking with the arms.", why: 'Loaded rotation through a full range. This is the pattern behind a punch, a kick and a shot.' },
                { name: 'Pallof press', sets: '3 × 30s/side', targets: 'Deep core · obliques — anti-rotation', how: "Stand side-on to a cable at chest height, hands at your sternum. Press straight out and hold — the cable is trying to twist you and your job is to not let it. Ribs down, glutes tight, breathe normally through the hold.", why: 'Anti-rotation to finish. Teaches the trunk to transmit force rather than leak it — you cannot punch hard through a soft midsection.' },
                { name: 'Cable crunch', sets: '4 × 10-15', targets: 'Rectus abdominis — loadable ab growth', how: "Kneel facing the stack, rope beside your head, hips fixed in place. Crunch by rounding the spine and driving your ribs toward your hips — the hips must not hinge. Squeeze hard at the bottom, control the way back up. This is the ab exercise you progressively add weight to.", why: 'The best loadable ab exercise. Round the spine and crunch the ribs toward the hips — do not just hinge at the hips. Add weight over time.' },
              ]}
            />
            <Session
              title="Tue (Legs + Speed) — Anti-extension + anti-lateral flexion"
              tag="Resist arching, resist sideways bend"
              open={false}
              block="After the lifting, before the ankle finisher. Keeps the lower back out of work that belongs to the abs."
              exercises={[
                { name: 'Hanging leg raise', sets: '3 × 10-15', targets: 'Lower abs · hip flexors', how: "Hang from a bar, shoulders active. Curl the pelvis up toward your ribs rather than just lifting the legs — that posterior tilt is what makes it an ab exercise instead of a hip flexor swing. Lower slowly with no swinging. Bend the knees if straight legs are too hard.", why: 'Lower abs and hip flexors. Control the lowering — swinging turns it into a hip flexor swing with no ab work at all.' },
                { name: 'Ab wheel rollout', sets: '3 × 8-12', targets: 'Whole anterior core — anti-extension', how: "Start on your knees, wheel under the shoulders. Roll out keeping the ribs pulled down and the lower back flat — the moment your back arches, you have gone past your range. Only roll out as far as you can control and pull back with the abs, not the hips.", why: 'One of the highest ab-activation exercises measured. Keep the ribs down and the lower back flat throughout.' },
                { name: 'Side plank with reach-through', sets: '3 × 30-40s/side', targets: 'Obliques · QL — anti-lateral flexion', how: "Side plank on the forearm, body in a straight line, hips lifted high. Reach the top arm under your body, rotate slightly, then return and open back up. Hips must not sag toward the floor at any point.", why: 'Obliques and quadratus lumborum. Keeps you upright when someone leans into you mid-stride.' },
              ]}
            />
            <Session
              title="Thu (Pull) — Anti-rotation + carries"
              tag="Stay rigid under load"
              open={false}
              block="Doubles as grip work, which is why it sits on pull day."
              exercises={[
                { name: 'Suitcase carry', sets: '3 × 40m/side', targets: 'Obliques · quadratus lumborum · grip · traps', how: "Heavy dumbbell or kettlebell in one hand only. Stand tall, shoulders level, and walk without leaning away from or toward the weight. The whole exercise is refusing to bend sideways. Swap hands each set.", why: 'One-sided load forces the whole trunk to resist collapsing sideways. This IS shielding a ball, trained under load.' },
                { name: 'Renegade row or bird dog row', sets: '3 × 8/side', targets: 'Deep core · lats — anti-rotation', how: "Press-up position on dumbbells, feet wide for stability. Row one dumbbell to your ribs while keeping the hips completely square to the floor — no twisting. Slow and controlled; if the hips rotate, go lighter.", why: 'Resisting rotation while one arm works — the exact demand of holding position while grappling.' },
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
            <OneThing points={["Sleep 8 hours, eat enough protein (1.6-2.2g per kg), and deload every 6-8 weeks.", "Your WHOOP recovery on the command screen tells you whether today is a push day or a back-off day."]} />
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
              ['Carbs before and after training', 'Glycogen is the fuel for both lifting and sprinting. Training depleted is why some sessions feel inexplicably heavy. Carbs before, carbs after, and more of them on leg day and match day.'],
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
              ['Count your sport as training', 'A football match is roughly a hard leg session plus conditioning. If you had a midweek game or extra training, going into leg day still fatigued is not brave, it is a mistake. Move it back a day or halve the lifting sets.'],
              ['Match day plus 48 hours', 'Leave at least two days between a match or hard sparring and leg day. That is when hamstring injuries happen.'],
              ['Hard days hard, easy days easy', 'If both a sport session and a lift must happen, do them on the SAME day and keep the next day genuinely easy. Two moderately hard days in a row is worse recovery than one very hard day plus a real rest day.'],
              ['In-season, cut volume not intensity', 'Keep the weights heavy and drop the number of sets by about a third. You maintain strength on far less volume than you needed to build it.'],
            ]} />
          </div>
        )}

        {/* ===== POSTURE ===== */}
        {tab === 'posture' && (
          <div className="fade-up stagger space-y-4">
            <OneThing points={["One routine, every day, about 15 minutes: it fixes forward head and rounded shoulders AND keeps your hips, ankles and upper back moving for kickboxing and football.", "Busy day? Do the five starred moves — five minutes. Never zero.", "Posture and mobility are strength you can hold without thinking — train them, do not force them."]} />
            <div className="card-premium p-5" data-testid="daily-routine">
              <h3 className="font-bold mb-1">The daily routine — posture + mobility, ~15 minutes</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">Floor first, then standing, so you never get up and down twice. Any time of day — evening in front of the TV is the version people keep doing. Slow and controlled; a strong stretch is fine, sharp or pinching pain is not.</p>
              <ol className="space-y-2.5">
                {([
                  ['Chin tucks', '2 × 10, 5s holds', 'posture', true, 'Lying on your back, slide the back of your head along the floor into a double chin. Move to seated, then the wall, as it gets easier (progression below). Fixes the forward head.'],
                  ['Upper-back extension + open books', '10 reps + 10/side', 'both', true, 'Over a foam roller or rolled towel across the mid back, lean back and breathe out. Then on your side, knees bent, open the top arm across like a book. A stiff upper back is why the shoulders round AND why punches and rotation lose power.'],
                  ['90/90 hip switches', '10/side', 'mobility', false, 'Both knees at 90°, rotate them to the other side without hands. Hip rotation drives kick height, squat depth and the hip turn behind a punch.'],
                  ['Adductor rock-backs', '10/side', 'mobility', false, 'On all fours, one leg out to the side, rock the hips back. Groin range for kicking — and the best protection against the strains kickboxing and football both cause.'],
                  ['Couch stretch', '45-60s/side', 'both', true, 'Back knee down against a sofa, squeeze that glute and tuck the hips under. Undoes sitting, fixes the forward tilt that makes you lean when you walk, and opens the hip for kicks.'],
                  ['Glute bridge', '2 × 12', 'posture', false, 'Drive the hips up, ribs down, squeeze hard at the top. Strong glutes are what hold the pelvis level once the couch stretch has opened it.'],
                  ['Deep squat hold', '60s', 'mobility', false, 'Heels down, elbows pushing the knees out, chest up, rock gently side to side. Ankles and hips — hold a door frame if your heels lift. Your ankle needs this range.'],
                  ['Doorway chest stretch', '2 × 30s', 'posture', true, 'Forearms on the frame at shoulder height, step through. Opens the chest that pressing and phones tighten.'],
                  ['Wall slides', '2 × 10', 'posture', true, 'Back, elbows and wrists on the wall, slide up and down without the lower back arching. Trains the muscles that hold your shoulders back, plus overhead range.'],
                  ['Towel + sleeper stretch', '30s each way, each side', 'mobility', false, 'Towel behind your back, pull up then down; then on your side, gently press the forearm down. Shoulder rotation — closes the gap when your hands will not meet behind your back.'],
                  ['Dead hang', '30-60s', 'both', false, 'Any bar or door-frame pull-up bar. Decompresses the spine, opens the shoulders and lats, builds grip. If you have no bar, do band pull-aparts 2 × 15 instead.'],
                ] as [string, string, string, boolean, string][]).map(([name, dose, kind, star, cue], i) => (
                  <li key={name} className="flex gap-3">
                    <span className="font-orbitron text-orange-300 text-sm w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-100">
                        {star && <span className="text-orange-300 mr-1" aria-label="In the 5-minute version">★</span>}{name} <span className="text-orange-300 font-normal text-xs">· {dose}</span>
                        <span className={`ml-1.5 text-[9px] font-hud uppercase tracking-wider px-1.5 py-0.5 rounded ${kind === 'posture' ? 'bg-cyan-400/10 text-cyan-300' : kind === 'mobility' ? 'bg-orange-400/10 text-orange-300' : 'bg-white/5 text-gray-400'}`}>{kind === 'both' ? 'posture + mobility' : kind}</span>
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">{cue}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="text-[11px] text-gray-500 mt-3 border-t border-white/5 pt-2.5">★ = the 5-minute version: chin tucks, upper-back extension, couch stretch, doorway stretch, wall slides. The lifting days still end with their own two-move posture finisher — that is on top, not instead.</p>
            </div>
            <Block title="Why your hands do not meet behind your back" items={[
              ['What it is', 'The "back-scratch test". The bottom hand needs the shoulder to rotate inwards; the top hand needs it to rotate outwards, plus loose lats and triceps. Rounded shoulders and a stiff upper back block both.'],
              ['What fixes it', 'The towel and sleeper stretches open the rotation, the doorway stretch and upper-back extension let the shoulders sit back, and the strengthening keeps them there. Expect the gap to close over 4-8 weeks of daily work.'],
              ['Track it', 'Once a week, try it both ways and measure the gap between your fingertips with a ruler. One side is almost always worse — give that side an extra set of the towel and sleeper stretches.'],
              ['All day', 'Screen at eye level, phone up instead of head down, and a chin tuck every time you sit down. The routine undoes a day of hunching only if the day is not all hunching.'],
              ['See a physio if', 'It hurts, clicks with pain, you get pins and needles down the arm, or one side has not improved at all after six weeks.'],
            ]} />
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
            <Fold title="The wall test — what yours is telling you" tag="Heels, bum, upper back and head against a wall" items={[
              ['How to do it', 'Heels about 5cm from the wall, bum and upper back touching, then try to rest the back of your head on the wall with your chin level — not tipped up. Take a side-on photo.'],
              ['Head will not reach without the chin lifting', 'Forward head posture. The head has drifted in front of the shoulders.'],
              ['Shoulders and upper back will not touch', 'Rounded shoulders and a stiff upper back. This is why your chin tuck feels impossible: your head sits on top of your upper back, so while that is rounded the head physically cannot go back. Fix the upper back and the chin tuck follows.'],
              ['Big gap at the lower back', 'More than a flat hand of space means an arched lower back (anterior pelvic tilt) — tight hip flexors, weak glutes. Often the reason you tip forward when walking.'],
              ['Redo it monthly', 'Same wall, same photo. Expect visible change in 4-8 weeks of daily work.'],
            ]} />
            <Fold title="When chin tucks feel impossible — the progression" tag="Do not force it against the wall" items={[
              ['Why forcing it fails', 'If the upper back is rounded, pushing your head to the wall makes you lean back from the hips or tip your chin up. That trains the wrong thing. Start where gravity helps.'],
              ['Stage 1 (weeks 1-2): on the floor', 'Lie on your back, knees bent, head on the floor or a thin folded towel. Nod slightly and slide the back of your head along the floor into a double chin. 3 × 10 with 5-second holds. You will feel the front of the neck working.'],
              ['Open the upper back at the same time', 'Thoracic extensions over a foam roller or rolled towel, 10 reps. Then lie lengthwise on a rolled towel along your spine with arms out wide for 3 minutes — a passive chest opener.'],
              ['Stage 2 (weeks 2-4): seated with a pillow', 'Sit with your back against a wall and a pillow behind your upper back, so your head has somewhere to reach. Tuck back to the pillow. Make the pillow thinner each week.'],
              ['Stage 3 (week 4+): standing at the wall', 'Shoulders as close to the wall as they comfortably go — not forced — then tuck. When the back of your head touches with the chin level, you have fixed it.'],
              ['All day', 'One chin tuck every time you sit down, stop at a red light or pick up your phone. Twenty small reps a day beat one big session.'],
              ['Strength keeps it there', 'Face pulls, Y-T-W raises, rows and pull-aparts build the muscles that hold your shoulders back. Stretching alone always slides back — that is why the posture finishers are in your lifting days now.'],
            ]} />
            <Fold title="Leaning forward when you walk" tag="Hips, head and habits" items={[
              ['Why it happens', 'Forward head, tight hip flexors from sitting, weak glutes and looking at your phone tip your whole torso forward. Tall people also stoop without realising.'],
              ['Cues while you walk', 'Tall through the crown, as if a string lifts the back of your head. Ribs down, not chest puffed out. Eyes on the horizon, not the pavement or your phone. Push off with the back foot and feel the glute work. Walk 20% slower.'],
              ['Fix the hips', 'Couch stretch 2 × 45 seconds a side daily, glute bridges 2 × 12, and dead bugs to keep the ribs down. They are on your Legs day now and fine to do at home.'],
              ['At 6ft 4', 'When you talk to shorter people, do not stoop from the neck — bend the knees slightly or lean in from the hips.'],
              ['Check it', 'Film yourself walking side-on once a week for a month. You will see it, and seeing it is what makes it change.'],
            ]} />
            <Fold title="Why it changes your face" tag="Posture is the fastest jawline fix there is" items={[
              ['What forward head does', 'It pushes the soft tissue under your chin forward and opens the angle between your chin and neck, so the jaw blurs into the neck. You look softer and less defined even when you are lean.'],
              ['What fixing it does', 'Head back over the shoulders tightens the under-chin and shows the jawline — visible in photos within weeks, before any fat loss.'],
              ['Tongue up', 'Whole tongue resting on the roof of your mouth firms the under-chin further. Do it with every chin tuck.'],
              ['The honest bit', 'Posture does not create bone; it reveals what is there. Getting to 10-14% body fat does the rest — see Aura → Blueprint and the hyoid section.'],
            ]} />
            <Block title="The two patterns worth addressing" items={[
              ['Upper cross — forward head, rounded shoulders', 'Tight and overactive: chest, upper traps, deep chest muscles. Weak and lengthened: deep neck flexors, mid and lower traps, rhomboids, rear delts. This is the one that visibly changes your silhouette.'],
              ['Anterior pelvic tilt — arched lower back, stomach pushed forward', 'Tight hip flexors and lower back, weak glutes and abs. A small degree of tilt is completely normal — only worth addressing if it is pronounced.'],
              ['The single most effective intervention', 'Strengthening the weak, lengthened muscles. Stretching the tight side alone reliably fails, because nothing is holding the new position. Strength is what holds posture; mobility just makes the position available.'],
            ]} />
            <Session
              title="The full version"
              tag="When you have more time — adds Y-T-W raises, dead hangs and the hip work"
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
              ['Rear delt flies (Push day, 4 × 15-20)', 'Second weekly dose of exactly what rounded shoulders need.'],
              ['Rows and pull-ups', 'Building your mid and upper back is itself posture training, and it does more for your silhouette than any stretch.'],
              ['Suitcase carries (core rotation)', 'Trains you to stand tall and rigid under asymmetric load, which is posture under real-world demand.'],
              ['Nordics and hip thrusts', 'Posterior chain strength directly opposes the tilted-forward pelvis pattern.'],
            ]} />
            <p className="font-hud text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 pt-2">Mobility — the detail</p>
            <Fold title="Flexibility vs mobility — the difference that matters" tag="Why the routine is mostly strength through range" items={[
              ['Flexibility', 'How far a joint can be moved passively — someone pushing your leg up.'],
              ['Mobility', 'How far you can move it yourself, under control, with strength at the end of the range. Only this one shows up in a kick, a squat or a sprint.'],
              ['So', 'Passive range you cannot control is not useful, which is why the routine is mostly strength through range rather than sitting in stretches.'],
            ]} />
            <Fold title="Why you feel tight — and why it is usually not short muscles" tag="This changes what you should do about it" items={[
              ['Tightness is mostly a nervous-system setting', 'Short-term flexibility gains come from increased STRETCH TOLERANCE — your nervous system deciding the position is safe — not from muscle physically lengthening. This is why you can gain 20 degrees in one session and lose it by tomorrow, and why warm muscles stretch further.'],
              ['"Tight" often means weak', 'A muscle with no strength at long lengths gets protectively guarded by your nervous system. Hamstrings that feel permanently tight are frequently hamstrings that are weak at end range. Stretching them feels good and changes little; loading them at length changes it properly.'],
              ['Tight can also mean overworked or protective', 'A joint guarding an unstable neighbour will feel tight. Chronically tight hip flexors in someone who sits all day, or a stiff lower back doing the rotating that stiff hips refuse to do, are both examples. Chase the cause, not the sensation.'],
              ['Real tissue change is possible but slow', 'Long-term, consistent loaded stretching does produce structural adaptation — added sarcomeres and altered tissue stiffness. That is a months-to-years process, not a session.'],
              ['So the rule is', 'Use stretching to open a range, then immediately use strength to own it. Range you do not load, you do not keep.'],
            ]} />
            <Fold title="Mobility methods, and when each one is right" tag="Dynamic before training, static after, loaded for keeps" items={[
              ['Dynamic mobility — BEFORE training', 'Controlled movement through a full range: leg swings, arm circles, 90/90 switches, walking lunges with a twist, cat-cow. 5-10 minutes. This raises tissue temperature and prepares the range you are about to use. This is the correct pre-session choice.'],
              ['Static stretching — AFTER training, or its own session', '30-60 second holds, breathing out into the position, 5+ days a week for a range you actually want to change. Two or three times a week maintains; once a week does very little.'],
              ['The pre-lifting caveat, stated accurately', 'Long static holds (60s+) immediately before maximal strength or sprint work cause a small, short-lived drop in force output. It is a modest effect and it clears within about ten minutes of warming up — so it is not a disaster, it is simply not the best use of those minutes. Dynamic before, static after.'],
              ['Contract-relax (PNF) — the fastest way to add range', 'Get into a stretch, contract the stretched muscle against resistance for 5-10 seconds at moderate effort, relax and move deeper. Repeat 3-4 times. Reliably produces more range in one session than passive holding, and it is the technique most worth learning.'],
              ['Loaded stretching — the version that lasts', 'Strength work through the fullest range you can control: deep front squats, Romanian deadlifts to a real stretch, deficit split squats, Cossack squats, full-range dumbbell pullovers, deep dips. This is how you convert borrowed range into range you own, and it doubles as your training.'],
              ['End-range control drills', 'CARs (slow, maximal-effort circles at one joint), 90/90 hip lift-offs, and active straight-leg raises. Unimpressive-looking and they are what makes new range usable under speed and load.'],
              ['Yoga — useful, not magic', 'A good class is consistent structured mobility plus breathing, and consistency is most of the battle. It is not a substitute for loading the range, and it will not fix a strength problem that presents as tightness.'],
            ]} />
            <Fold title="Priorities for what you actually train" tag="If you only fix three things, fix these" items={[
              ['Ankles — first, given yours', 'Restricted dorsiflexion limits squat depth, changes how you land, and pushes load into the knee. It is also the joint you have already flagged as weak. Do the full progression in the Legs tab before adding range work on top — strength first, then range.'],
              ['Hips — the highest return for you', 'Internal and external rotation drive kicking height, guard retention, squat depth and the hip turn behind a cross. 90/90 work and the couch stretch daily. The technical side of using that range is in Combat → Hips.'],
              ['Thoracic spine — for punching and pressing', 'Rotation and extension. A stiff upper back caps your rotational power and forces the lower back to compensate. Two minutes of open-books daily is a genuinely disproportionate return.'],
              ['Hamstrings and adductors — load them long', 'RDLs and Cossack squats do more for kicking range and groin durability than passive stretching, and they build the Copenhagen-style resilience that prevents the most annoying grappling injuries.'],
              ['Shoulders — range under control', 'Overhead range matters for pressing and for surviving armbars and kimuras. Hangs, pass-throughs and controlled end-range work; avoid aggressive passive cranking, which is how shoulders get irritated.'],
              ['Neck — mobility as well as strength', 'Slow controlled rotations through a full range, gently. Strength work is in Combat; range matters too, and stiff necks take strikes worse.'],
            ]} />
            <Fold title="Mobility — honest expectations and the myths" tag="Timelines, injury prevention, what stretching does not do" items={[
              ['Timeline', 'Noticeable change in 2-4 weeks of near-daily work. Meaningful, durable change in 3-6 months. Splits or head-height kicks, if you want them, are a year-plus project from a stiff starting point — and entirely achievable.'],
              ['Use it or lose it', 'Range is maintained by being used. Stop for a month and most of what you gained goes. Two or three short sessions a week maintains what daily work built.'],
              ['Stretching does not meaningfully prevent injury', 'The evidence for static stretching as injury prevention is weak. What DOES reduce injury is strength at long muscle lengths — Nordics, Copenhagens, RDLs, full-range training. Stretch for the range you need; strengthen for the durability.'],
              ['It does not reduce soreness much either', 'Stretching after training feels pleasant and has a small effect on DOMS at best. Sleep, food and easy movement do far more — that is in the Recovery tab.'],
              ['Do not stretch a fresh injury or a hypermobile joint', 'Pulling on a strain makes it worse. And if you are already very flexible, more passive range is the last thing you need — your problem is control and strength, not length.'],
              ['Pain is not the target', 'A strong stretch sensation, breathing normally, is right. Sharp, pinching or nerve-like sensation is not, and forcing it is how people damage hamstring tendons and hip labrums.'],
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
            <OneThing points={["Explosive first, heavy second, accessories last.", "Write every session down. If nothing has moved in a month, the problem is sleep, food or effort — not the programme.", "Give it 8-12 weeks before judging it."]} />
            <Block title="The rules that make this work" items={[
              ['Explosive work first and fresh, always', 'Jumps, throws and sprints go at the START of a session, never at the end. Power trained tired is conditioning with injury risk attached.'],
              ['Hypertrophy: 1-2 reps in reserve', 'Stop most sets when you could have done 1-2 more clean reps. Take the last set of isolation exercises to genuine failure. Training everything to failure wrecks recovery for marginal extra growth.'],
              ['Progressive overload, written down', 'Every session, try to beat the logbook by a rep or the smallest weight increment. If nothing has moved in a month, the problem is recovery, food or effort — not the programme.'],
              ['Rest properly', '2-3 min on heavy compounds and all power work, 60-90s on isolation. Cutting rest to feel worked costs you load, and load is what drives growth.'],
              ['Keep legs away from match day and kickboxing', 'Legs + Speed on Wednesday is the day after kickboxing and three days before Saturday football. If either moves, keep legs the day after kickboxing and at least 48 hours before kick-off.'],
              ['Deload every 6-8 weeks', 'One week at roughly 60% of normal volume, keeping intensity. Not optional. This is when your body catches up and the next block goes better.'],
            ]} />
            <Block title="How to adjust it" items={[
              ['If you are always sore or run down', 'Drop one set from every exercise for a week before changing anything else. Three days plus football is already a full week.'],
              ['If a muscle is lagging', 'Add 2-4 sets a week to it before adding anything else, and put it first in its session after the explosive movement. Do not add whole exercises.'],
              ['If you miss a day', 'Do not stack two sessions together. Do the missed one next, and keep the explosive movement at the start of it — that is the part that makes you faster.'],
              ['If your sport volume spikes', 'Pre-season or two games in a week: keep the jumps and sprints on leg day, halve the lifting sets. Your sport is training; count it as such.'],
              ['Give it 8-12 weeks before judging it', 'Strength moves in weeks, visible size in months, speed and power somewhere between. Programme-hopping every 3 weeks is the single most common reason people make no progress.'],
            ]} />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
