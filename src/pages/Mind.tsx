import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Brain, Flame, MessageCircle, Lock, Unlock, Sparkles, Mic2, Eye, ChevronDown, Heart, BookOpen, ListChecks, Compass, Moon } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { SectionHeader, TabBar, OneThing } from '../components/Hud';
import KnowYourself from '../components/KnowYourself';
import MyNotes from '../components/MyNotes';

type Tab = 'him' | 'notes' | 'know' | 'social' | 'confidence' | 'discipline' | 'routine' | 'secret';
const TAB_IDS = ['him', 'notes', 'know', 'social', 'confidence', 'discipline', 'routine', 'secret'] as const;
// Old tab ids from before the merge, so saved links and search still land.
const LEGACY: Record<string, Tab> = {
  playbook: 'him', code: 'him', blueprint: 'him', dream: 'him', listening: 'social', people: 'social', charisma: 'social', aura: 'social', icons: 'social', focus: 'discipline', morning: 'routine', night: 'routine',
};
function resolveTab(t: string | null): Tab | null {
  if (!t) return null;
  if ((TAB_IDS as readonly string[]).includes(t)) return t as Tab;
  return LEGACY[t] ?? null;
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'him', label: '★ Start Here' },
  { id: 'notes', label: 'My Notes' },
  { id: 'know', label: 'Know Yourself' },
  { id: 'social', label: 'People & Charisma' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'discipline', label: 'Discipline' },
  { id: 'routine', label: 'Morning & Night' },
  { id: 'secret', label: '🔒 Game Plan' },
];


function Tldr({ points }: { points: string[] }) {
  return <OneThing points={points} />;
}

function GStep({ n, title, desc, products }: { n: string; title: string; desc: string; products?: string[] }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/25 flex items-center justify-center flex-shrink-0 text-pink-400 font-black text-[11px] mt-0.5">{n}</div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-200">{title}</p>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        {products && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {products.map(p => <span key={p} className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">{p}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function GFold({ title, tag, children, defaultOpen = false }: { title: string; tag?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          {tag && <p className="text-xs text-pink-400/70 mt-0.5">{tag}</p>}
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function GPairs({ items }: { items: [string, string][] }) {
  return (
    <div className="space-y-3">
      {items.map(([t, d]) => (
        <div key={t}>
          <p className="font-semibold text-sm text-gray-200">{t}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
        </div>
      ))}
    </div>
  );
}

function GCallout({ title, text, tone = 'amber' }: { title: string; text: string; tone?: 'amber' | 'red' | 'emerald' }) {
  const tones = {
    amber: 'bg-pink-500/5 border-pink-500/20 text-pink-200/85',
    red: 'bg-red-500/5 border-red-500/20 text-red-200/85',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200/85',
  };
  return (
    <div className={`border rounded-xl px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs leading-relaxed"><span className="font-bold">{title}:</span> {text}</p>
    </div>
  );
}

function GLists({ left, right, leftTitle, rightTitle }: { left: string[]; right: string[]; leftTitle: string; rightTitle: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="bg-black/30 border border-red-500/15 rounded-xl p-4">
        <p className="text-xs font-bold text-red-300 mb-2">{leftTitle}</p>
        {left.map((l, i) => <p key={i} className="text-gray-400 text-xs leading-relaxed mb-1.5">• {l}</p>)}
      </div>
      <div className="bg-black/30 border border-emerald-500/15 rounded-xl p-4">
        <p className="text-xs font-bold text-emerald-300 mb-2">{rightTitle}</p>
        {right.map((l, i) => <p key={i} className="text-gray-400 text-xs leading-relaxed mb-1.5">• {l}</p>)}
      </div>
    </div>
  );
}

// Collapsed by default so a tab reads as a list of headlines, not a wall.
function Card({ title, items, icon: Icon }: { title: string; items: [string, string][]; icon: typeof Brain }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={16} className="text-pink-400 flex-shrink-0" />
          <h3 className="font-bold">{title}</h3>
        </div>
        <span className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-gray-600">{items.length}</span>
          <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
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

function Collapsible({ title, tag, children }: { title: string; tag?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden press">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div>
          <p className="font-bold text-gray-100">{title}</p>
          {tag && <p className="text-xs text-pink-400/70 mt-0.5">{tag}</p>}
        </div>
        <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`collapse-wrap ${open ? 'open' : ''}`}>
        <div className="collapse-inner">
          <div className="collapse-content px-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Mind() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => resolveTab(params.get('tab')) ?? 'him');
  const [routineView, setRoutineView] = useState<'morning' | 'night'>(() => {
    const t = params.get('tab');
    if (t === 'night') return 'night';
    if (t === 'morning') return 'morning';
    return new Date().getHours() < 15 ? 'morning' : 'night';
  });
  // Follow ?tab= changes while already on this page, not just on first mount.
  useEffect(() => {
    const t = params.get('tab');
    const r = resolveTab(t);
    if (r) setTab(r);
    if (t === 'morning' || t === 'night') setRoutineView(t);
  }, [params]);
  const [pw, setPw] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem('gymforge_secret_unlocked') === '1'); } catch {}
  }, []);

  const tryUnlock = () => {
    if (pw.trim().toLowerCase() === 'roy') {
      setUnlocked(true);
      try { localStorage.setItem('gymforge_secret_unlocked', '1'); } catch {}
    } else {
      setPw('');
    }
  };

  const relock = () => {
    setUnlocked(false);
    setPw('');
    try { localStorage.removeItem('gymforge_secret_unlocked'); } catch {}
  };

  return (
    <main className="min-h-screen bg-transparent bg-gradient-to-b from-pink-950/40 via-transparent to-transparent text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <SectionHeader icon={Brain} title="Mind" subtitle="Start Here is the whole section on one screen. The other tabs are the detail." />

        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {/* ============ START HERE — the whole section on one screen ============ */}
        {tab === 'him' && (
          <div className="fade-up stagger space-y-4">
            <Tldr points={[
              'The guy people are in awe of is not chasing anything. He has a full life — training, mates, uni, a plan — and people want in on it.',
              'Confident is keeping promises to yourself. Charismatic is making people feel heard. Both are habits, not personality.',
              'Slow down, be warm first, listen properly, and do one scared thing a day. That is ninety per cent of it.',
              'Knowing is not changing. Pick one thing, decide exactly when and where you will do it, make the old way harder, and never miss twice.',
            ]} />

            <div className="bg-[#111] border border-pink-500/25 rounded-2xl p-5">
              <h3 className="font-bold text-pink-200 mb-1">Who he is — six pillars</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">Each one has a standard, a 90-day target and the place in this app where it gets done. Weak in one, and the others carry less weight.</p>
              <div className="space-y-3">
                {([
                  ['Body', 'Trains four times a week, eats enough to grow, sleeps eight hours.', '+4-5kg lean, every lift up, a visibly different frame.', '/programs', 'Gym'],
                  ['Looks', 'A fresh cut every 3-4 weeks, skin routine twice a day, clothes that fit at 6ft 4.', 'Clear skin, a haircut picked for your face, a wardrobe of ten pieces that all work.', '/looksmax', 'Looks'],
                  ['Social life', 'Talks to everyone, listens properly, hosts things, knows people in several circles.', '50 new people met, two societies or teams, one thing hosted a month.', '/mind?tab=social', 'People'],
                  ['Women', 'Goes out to have fun, starts conversations easily, shows interest without needing it back.', '100 conversations started, a handful of dates. Count attempts, not results.', '/mind?tab=secret', 'Game Plan'],
                  ['Uni', 'Turns up, does the work in focused blocks, is known by the lecturers.', 'A first or a high 2:1 pace, no all-nighters, nothing handed in late.', '/uni', 'Uni & Brain'],
                  ['Career and money', 'Has a direction, builds a skill people pay for, applies early.', 'CV done, 20 applications or one internship, one skill visibly better.', '/money', 'Money'],
                ] as [string, string, string, string, string][]).map(([name, standard, target, to, label], i) => (
                  <div key={name} className="flex gap-3">
                    <span className="font-orbitron text-pink-300/80 text-sm w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-100">{name}</p>
                        <Link to={to} className="text-[10px] font-hud font-bold uppercase tracking-wider text-pink-300 hover:underline flex-shrink-0">{label} →</Link>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{standard}</p>
                      <p className="text-xs text-pink-200/90 mt-1"><span className="font-hud font-bold uppercase tracking-wider text-[10px] text-pink-400 mr-1.5">90 days</span>{target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-pink-500/25 rounded-2xl p-5">
              <h3 className="font-bold text-pink-200 mb-1">The eight rules</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                You will never be perfect at all of them. Pick the one that is your biggest gap, run its rep every day for a
                month, then add the next.
              </p>
              <div className="space-y-4">
                {[
                  ['Keep your word to yourself', 'Confidence is evidence. Every kept promise is proof you can rely on yourself; every broken one teaches the opposite.', 'Make one small promise before noon and keep it.'],
                  ['Slow down', 'Rushed speech, fast walking and instant reactions read as nervous. Calm reads as someone who is not worried about the outcome.', 'Speak 20% slower in every conversation today.'],
                  ['Be warm first', 'Smile, eye contact, say hello before they do. Warmth plus composure is what people mean by charisma.', 'Be the first to greet three people today.'],
                  ['Listen like it is the only thing happening', 'People remember how you made them feel, and nothing makes them feel better than being properly heard.', 'In one conversation, ask three follow-up questions before you talk about yourself.'],
                  ['Hold your frame', 'Do not over-explain, do not change your opinion just to be agreeable, stay amused rather than wounded when teased.', 'When someone teases you, agree and exaggerate it instead of defending yourself.'],
                  ['Do one scared thing a day', 'Nerves shrink with repetitions, never with more thinking. The discomfort is the training.', 'One approach, one honest opinion, or one ask you would normally avoid.'],
                  ['Want it, do not need it', 'Neediness leaks through your body before your words. Having your own life full is what makes you unpressed.', 'Tonight, count what you did rather than how it went.'],
                  ['Look after the vessel', 'Posture, grooming, training and sleep change how people read you before you speak — and how you feel walking in.', 'Three posture checks today: chin level, shoulders down and back.'],
                ].map(([rule, why, rep], i) => (
                  <div key={rule} className="flex gap-3">
                    <span className="font-orbitron text-pink-300/80 text-sm w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-100">{rule}</p>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{why}</p>
                      <p className="text-xs text-pink-200/90 mt-1"><span className="font-hud font-bold uppercase tracking-wider text-[10px] text-pink-400 mr-1.5">Today's rep</span>{rep}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <Card icon={Flame} title="In the moment — quick fixes" items={[
              ['Nervous before approaching', 'Breathe out longer than you breathe in, three times. Then go within three seconds — waiting only feeds the nerves.'],
              ['The conversation dies', 'Stop asking new questions. Pick something they already said and go deeper: "Wait, how did that happen?"'],
              ['You got rejected', 'Smile, "no worries, have a good night", walk away slowly. You did the rep; that is the whole win.'],
              ['Teased in front of the group', 'Agree and exaggerate, laugh, move on. Defending yourself is what makes it land.'],
              ['A room where you know nobody', 'Find the host or the person on their own and introduce yourself. Everyone else is waiting for someone to go first.'],
              ['You said something awkward', 'Name it lightly — "that came out wrong" — and carry on. Nobody remembers the slip, only whether you panicked.'],
              ['You feel small next to someone', 'Slow your speech, drop your shoulders, ask them a real question. Curiosity is the fastest way out of comparison.'],
            ]} />

            <GFold title="Actually changing — not just knowing" tag="Why you keep going back, and how to stop">
              <GCallout title="Why it keeps happening" text="Realising something feels like progress, so your brain gives you the reward without the change. But behaviour runs on cues and habits, not on what you understood last night. The old way is automatic; the new way is effort. Under stress or tiredness, automatic wins — unless you set it up so it cannot." />
              <GPairs items={[
                ['1. One change at a time', 'Ten new rules collapse in a week. Pick the one change that would fix the most, run it until it is automatic, then add the next. Slower on paper, far faster in real life.'],
                ['2. Decide the when and where', 'Not "I will be more confident" but "When I walk into a seminar, I say hello to the person next to me." "When I get into bed, the phone goes on the desk." A fixed when-then plan roughly doubles follow-through compared with a goal on its own.'],
                ['3. Make the old way harder', 'Change your surroundings, not your willpower. Delete the app, phone out of the bedroom, no snacks in your room, gym bag packed by the door. Add 20 seconds of hassle to the old habit and take 20 seconds away from the new one.'],
                ['4. Replace it, do not just remove it', 'Every old habit does a job: boredom, stress, loneliness, avoiding something. Work out the job, then give it a new route. Bored at night → a walk or a call with a mate. Stressed → a 10-minute lock-in. A gap left empty gets refilled by the old habit.'],
                ['5. Act as him before you feel like him', 'Ask "what would the guy I am becoming do right now?" and do that, even when you do not feel like it. Every time you do, it is a vote for the new identity. Feelings catch up with actions, never the other way round.'],
                ['6. Ride out the urge', 'Urges peak and fade, usually within 15-20 minutes. When one hits, wait ten minutes and do something physical. You do not have to beat it forever, only for the next ten minutes.'],
                ['7. Never miss twice', 'A slip is not a relapse. The danger is the thought "I have blown it now", which turns one bad day into a bad month. Miss once, and the very next chance you get, do the new thing — even a smaller version.'],
                ['8. Keep the evidence', 'Write one line every night of what you did, not what you meant to do (the evidence log in Know Yourself). Seeing a run of proof is what makes the new you feel real, and it shows you exactly when you slip.'],
                ['9. Tell someone', 'Tell a mate the one thing you are changing and ask them to check in on Sunday. Being accountable to someone else is one of the strongest levers there is.'],
                ['10. Give it the time it actually takes', 'New habits take around two months on average to feel automatic, and some take much longer. Weeks 2-4 are where most people quit, because the novelty has gone and it is not automatic yet. Expect that dip and push through it.'],
              ]} />
              <GCallout tone="emerald" title="Tonight" text="Write the one change on your Home week goals as a when-then sentence. Remove one thing that makes the old way easy. Tell one mate. That is the whole start." />
              <GCallout tone="red" title="When it is more than a habit" text="If the thing you keep going back to feels out of your control (porn, gambling, drinking, weed), or comes with low mood that will not lift, that is not a willpower problem. Your GP or uni wellbeing service can refer you to CBT, which works well for exactly this, and it is free." />
              <Link to="/mind?tab=know" className="block text-xs text-pink-300 hover:underline">Open Know Yourself — values, leaks and your evidence log →</Link>
            </GFold>

            <GFold title="The 90 days" tag="Foundations, then volume, then leverage">
              <GPairs items={[
                ['Month 1 — foundations', 'Train four times a week, eat to your target, skin routine, a proper haircut, sort the wardrobe, sleep on a schedule. One social rep a day. A study timetable you actually keep.'],
                ['Month 2 — volume', 'Out one or two nights a week to have fun, ten hellos a night. Join two societies or a team. Host one thing. CV finished.'],
                ['Month 3 — leverage', 'Ask girls out from the conversations you are having. Take on a role: captain, committee, organiser. Applications out. By now people know who you are.'],
                ['Every Sunday, five numbers', 'Gym sessions, conversations started, new people met, hours of focused work, nights you genuinely enjoyed. Write them as week goals on Home and beat last week.'],
              ]} />
              <GCallout title="The honest bit" text="Nobody is admired by everyone, and chasing that is just approval-seeking with extra steps. Aim to be respected by the people you respect. Keep the standards, do the reps, and the reputation comes after — usually later than you want, then faster than you expect." />
            </GFold>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Where everything lives</h3>
              <div className="space-y-2">
                {([
                  ['notes', 'My Notes', 'Your own rules, three a day, and the affirmations'],
                  ['know', 'Know Yourself', 'Values, standards, evidence log and your personal plan'],
                  ['social', 'People & Charisma', 'Active listening, conversation, voice, humour, frame, going out'],
                  ['confidence', 'Confidence', 'Rejection therapy, nerves, self-talk, approval detox'],
                  ['discipline', 'Discipline', 'Dopamine, deep work, controlling emotions, the stoics'],
                  ['routine', 'Morning & Night', 'The routines that make the rest easy'],
                  ['secret', 'Game Plan', 'Girls, clubs, texting, dates'],
                ] as [Tab, string, string][]).map(([id, label, desc]) => (
                  <button key={id} onClick={() => { setTab(id); window.scrollTo(0, 0); }}
                    className="w-full text-left flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] px-3.5 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200">{label}</p>
                      <p className="text-[11px] text-gray-500">{desc}</p>
                    </div>
                    <ChevronDown size={15} className="-rotate-90 text-pink-400/70 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className="fade-up space-y-4">
            <Tldr points={[
              'Act like the man you want to be, and need no one\'s approval but your own.',
              'Be interested in people: let them talk, use their name, remember the details, tease lightly.',
              'Speak loud, clear and slow, walk slow, stop scanning the room. No pedestal, no thirst — the win is in the approach.',
            ]} />
            <MyNotes unlocked={unlocked} />
          </div>
        )}

        {tab === 'know' && (
          <div className="fade-up space-y-4">
            <Tldr points={[
              'Pick five values and write your standards — that is who you are when nobody is watching.',
              'Log evidence daily: what you did, not what you intend. Identity is built from receipts.',
              'Find the leak that eats the most hours and make it harder to reach.',
              'Then build your personal plan — it reads everything you wrote here.',
            ]} />
            <KnowYourself />
          </div>
        )}

        {/* ============ PEOPLE & CHARISMA — listening first, then everything social ============ */}
        {tab === 'social' && (
          <div className="fade-up stagger space-y-3">
            <Tldr points={[
              'Listen to understand, not to reply. Make people feel heard and they will want to be around you.',
              'Slow down everything — speech, walk, reactions. Warm first: smile, eye contact, say hello before they do.',
              'Hold your frame: do not over-explain, stay amused rather than wounded when you are teased.',
              'Go out to have fun, treat girls like everyone else, and match their energy.',
            ]} />
            <GFold title="Active listening — the skill under all the others" tag="Make people feel heard and they will want you around" defaultOpen>
              <GCallout title="Why it matters most" text="People rarely remember what you said; they remember how you made them feel, and nothing feels better than being properly heard. It also takes the pressure off you: you do not need to be interesting if you are interested." />
              <GPairs items={[
                ['Full attention', 'Phone away, not face-down on the table. Turn your body to them, eye contact around 60-70%, nod and react. They can tell within seconds whether you are really there.'],
                ['Listen to understand, not to reply', 'If you are rehearsing your next line, you are not listening. Let it go — the right reply comes from what they actually said.'],
                ['Let them talk 70-80%', 'Your job is to keep them going, not to fill the air. Short prompts — "no way", "then what?", "why?" — do more than speeches.'],
                ['Follow the thread', 'Ask about what they just said, not a new topic. Go three questions deep: what happened → why → how did that feel. That is where conversations get good.'],
                ['Reflect it back', 'Sum up in a few words: "So you basically got thrown in at the deep end." It proves you got it, and they will correct or add to it.'],
                ['Name the feeling', '"Sounds like that properly stressed you out." Responding to the emotion, not just the facts, is what makes people feel understood.'],
                ['Mirror the last words', 'Repeat their last two or three words as a question — "Thrown in at the deep end?" — and they will keep talking without you asking anything.'],
                ['Let the pause breathe', 'Wait a second or two after they finish. People often add the real thing in that gap.'],
                ['Do not hijack', '"That happened to me too" turns their story into yours. Ask a follow-up first; if you share your story, keep it shorter than theirs.'],
                ['Do not fix unless asked', 'Most people want to be heard, not solved. "Do you want advice or just to vent?"'],
                ['Remember and call back', 'Use their name, keep one detail, bring it up next time: "How did the interview go?" Nothing makes people feel more valued.'],
              ]} />
              <GLists leftTitle="KILLS IT" rightTitle="BUILDS IT"
                left={[
                  'Interrupting or finishing their sentences',
                  'Checking your phone, even once',
                  'Waiting for your turn to talk',
                  'Steering every topic back to you',
                  'Fixing when they wanted to vent',
                  'Interview mode: question, question, question',
                ]}
                right={[
                  'Leaning in, nodding, reacting for real',
                  'Phone away for the whole conversation',
                  'Asking about what they just said',
                  'Their name and one remembered detail',
                  'Naming how they felt about it',
                  'Mixing questions with your own take',
                ]} />
              <GCallout tone="emerald" title="Daily drill" text="In one conversation a day: no phone, three follow-up questions before you mention yourself, and sum up what they said in one sentence before you reply. Two weeks of that and people will start saying you are easy to talk to." />
              <GCallout title="With girls" text="Listening is not interviewing. Mix follow-ups with statements, teasing and your own opinion — curious and playful, not a questionnaire." />
            </GFold>

            <Card icon={MessageCircle} title="Conversation" items={[
              ['Go deeper, not wider', 'Pick something they said and follow it: "Wait, why did you quit?" beats a new topic every time.'],
              ['Statements over questions', '"You seem like the one who plans every trip" invites play. "What do you do?" invites autopilot.'],
              ['React for real', 'Laugh when it is funny, be surprised when it is surprising. Flat, polite responses kill conversations.'],
              ['Stories: setup, tension, payoff', 'Cut everything that is none of those three. Thirty seconds, not three minutes.'],
              ['Leave on a high', 'End while it is still good. People remember the peak and the end.'],
            ]} />
            <Card icon={Mic2} title="Voice and body language" items={[
              ['Speak from the chest, slower', 'Lower and 20% slower than feels natural. Rushed, high speech is the most common tell of nerves.'],
              ['End statements down', 'Rising at the end turns a statement into a request for approval.'],
              ['Pause instead of filling', 'A one-second pause beats "um" and "like". Silence reads as composure.'],
              ['Take up space calmly', 'Feet shoulder-width, shoulders down, hands still. Not puffed up — just not shrinking.'],
              ['Eye contact', 'Hold it while you listen, break it sideways while you think. Looking down reads as submission.'],
            ]} />
            <Card icon={Sparkles} title="Humour and banter" items={[
              ['Funny = truth, exaggerated', 'Say the true thing everyone noticed, then push it slightly too far.'],
              ['Pause before the punchline', 'Slow down right before it, then hold a straight face after.'],
              ['Callbacks', 'Referencing an earlier moment is the easiest laugh there is and builds an inside joke.'],
              ['Banter is playful disagreement', 'Tease what they chose, never what they cannot change. Never punch down.'],
            ]} />
            <Card icon={Compass} title="Frame" items={[
              ['What it is', 'Non-reactivity, not dominance. You stay yourself whether people approve or not.'],
              ['Do not over-explain', 'The main tell. State it once, calmly, and stop.'],
              ['Agree and amplify', 'When teased, agree and exaggerate it. Defending yourself is what makes it land.'],
              ['Do not accept a framing you disagree with', 'You can be relaxed and still say "nah, I do not see it like that".'],
              ['Apologise when you are wrong', 'Owning a mistake quickly is a frame move. Only insecure people cannot.'],
            ]} />
            <Card icon={Eye} title="Status in a group" items={[
              ['Why groups test you', 'Teasing is how groups find out who stays level. It is usually not hostility.'],
              ['Amused, never wounded', 'Laugh, return it lightly, move on. Sulking or over-reacting is what makes you the target.'],
              ['Give status to get status', 'Bring quieter people in, credit others\' jokes. The one who elevates others is the one people follow.'],
              ['Restraint', 'Speak less than you want to, compliment rarely and precisely, keep confidences, do not narrate your life.'],
            ]} />
            <GFold title="Being known around uni" tag="Status is earned in public, slowly, then all at once">
              <GPairs items={[
                ['Be in more than one circle', 'Course mates, a sports team (football or padel), a society, the gym. Someone known in four circles is "everyone knows him".'],
                ['Host things', 'Pres, a five-a-side, a Sunday roast, a group revision session. The person who organises things becomes the centre of them.'],
                ['Connect people', 'Introduce people who should know each other. You become the link everyone owes a good night to.'],
                ['Names and follow-ups', 'Remember names and one thing about each person, and ask about it next time. Most people do neither; it makes you stand out instantly.'],
                ['Be visibly good at something', 'Top scorer, the strongest in the gym, the one who gets firsts, the one building a business. Respect sticks to competence.'],
                ['Never gossip, never punch down', 'Status built on putting people down disappears fast. Be the guy who is good to everyone, including the people who cannot do anything for you.'],
              ]} />
            </GFold>

            <h2 className="font-hud text-[12px] font-bold uppercase tracking-[0.25em] text-pink-300/80 pt-3">Going out and girls</h2>
            <GFold title="Go out to have fun — not to get something" tag="The single biggest shift">
              <GPairs items={[
                ['The goal of the night is a great night', 'Dance badly, take the mick out of your mates, talk to the bouncer, start the chant. If you go home having had the best night in the room, it was a win whoever you met.'],
                ['Give energy, do not look for it', 'Approval-seeking is going out to take something: attention, validation, a number. The guy everyone notices is the one adding to the night. People are drawn to that, girls included.'],
                ['Girls are part of the night, not the point of it', 'Talk to them the way you talk to everyone else: warmly, curious, a bit cheeky. When she is not the whole mission, there is no pressure in your voice, and that is what she picks up on.'],
                ['Your mates come first', 'Hype them, open groups for them, be the one who keeps the group moving. Being the centre of a fun group does more for you than any line.'],
              ]} />
              <GLists leftTitle="APPROVAL-SEEKING" rightTitle="UNBOTHERED"
                left={[
                  'Laughing at jokes that are not funny',
                  'Checking whether people are looking at you',
                  'Over-explaining, apologising, filling every silence',
                  'Changing your opinion to agree with the room',
                  'The whole night riding on one girl',
                  'Checking whether she has texted back',
                ]}
                right={[
                  'Laughing when you find it funny',
                  'Watching the room because you are interested',
                  'Saying it once, then letting the silence sit',
                  'Disagreeing with a smile',
                  'A good night whatever happens',
                  'Getting on with your day; she fits around it',
                ]} />
            </GFold>

            <GFold title="Girls are just people — match the energy" tag="The pedestal is the problem, not your chat">
              <GPairs items={[
                ['Why you tense up', 'The pedestal comes from scarcity: when you rarely talk to girls, each one feels like a big deal. The cure is volume — talk to lots of girls in normal places (course, gym, shops) with no agenda at all, until they are just people again.'],
                ['Same guy, every time', 'Same voice, same jokes, same energy you use with your mates. If your voice goes up, you get extra polite or you start performing when she shows up, that is the pedestal showing.'],
                ['Match her energy', 'Chatty and playful? Go with it. Short answers and looking away? Do not chase or double up — ease off. Mirror her pace, her volume, how much she is giving. Lead one step warmer than her, never five steps.'],
                ['If she drops off, you drop back', 'Interest is a two-way thing. If she stops investing, stop investing too, and leave it with a smile. That is not playing games; it is self-respect.'],
                ['Texting too', 'Similar length, similar speed, similar effort. Three messages to her one is chasing.'],
                ['You can disagree with her', 'Tease her, say no, have your own opinion. She is a person, not a prize to be careful around.'],
                ['Normal does not mean less respect', 'Treat her exactly like anyone you respect — no more, no less. Want her, do not need her.'],
              ]} />
              <Link to="/mind?tab=secret" className="block text-xs text-pink-300 hover:underline">The Game Plan has the club, approach and texting detail →</Link>
            </GFold>
            <GFold title="Why your mate cracks it and you do not (yet)" tag="Find where it breaks, fix that one thing">
              <GPairs items={[
                ['He has done more reps', 'Good chat is not a gift. It is hundreds of conversations where he stopped caring how each one went. You can close that gap in a term.'],
                ['Find where yours breaks', 'Not starting conversations → reps and the warm-up. Starting but it goes flat → statements, teasing, going deeper. Good chat but nothing comes of it → show intent and ask for the number at the peak. Numbers that go nowhere → a plan in the first text. Each one has a fix in Game Plan.'],
                ['Go out with him and watch', 'Do not copy his lines. Watch his pace, how he stands, how quickly he moves on after a no. Then ask him what he is thinking when he walks over. It is usually "nothing".'],
                ['Stop comparing, start counting', 'Comparing makes you hesitate. Count your own attempts each week and watch that number, not his results.'],
              ]} />
              <Link to="/mind?tab=secret" className="block text-xs text-pink-300 hover:underline">Open the Game Plan — the warm-up, momentum rules, what to say and texting →</Link>
            </GFold>

            <Collapsible title="Icons — steal one trait" tag="Pick one, study it for a month">
              <div className="space-y-3 text-sm">
                {[
                  ['Daniel Craig\'s Bond', 'Composure. Economy of words and movement under pressure.'],
                  ['David Beckham', 'Relentless grooming and soft-spoken humility despite everything.'],
                  ['Ryan Reynolds', 'Quick wit that never punches down.'],
                  ['Roger Federer', 'Grace in winning and losing.'],
                  ['Cristiano Ronaldo', 'A work ethic nobody questions.'],
                ].map(([n, t]) => (
                  <p key={n} className="text-gray-400"><span className="font-semibold text-gray-200">{n}</span> — {t}</p>
                ))}
              </div>
            </Collapsible>
          </div>
        )}

        {/* ============ CONFIDENCE ============ */}
        {tab === 'confidence' && (
          <div className="fade-up stagger space-y-3">
            <Tldr points={[
              'Confidence is evidence, not a feeling. Keep small promises to yourself and it builds on its own.',
              'Do one scared thing a day. Nerves shrink with reps, never with more thinking.',
              'Stop outsourcing your worth: decide your standards before the moment, then act on them.',
              'Talk to yourself like a coach: second person, specific, never "I am an idiot".',
              'Rejection therapy: go and collect one "no" a day. The fear only dies through reps.',
            ]} />

            <GFold title="Rejection therapy — kill the fear" tag="Go looking for a no, every day, for 30 days" defaultOpen>
              <GCallout title="Why it works" text="Fear of rejection is learned, and it is un-learned the same way every fear is: repeated, gradual exposure until your body stops treating a no as a threat. Thinking about it never shrinks it. Doing it does — usually within two or three weeks." />
              <GPairs items={[
                ['The goal is the no', 'You are not trying to get a yes. You are collecting nos. Every attempt counts as a win, whatever the answer. That takes the outcome out of your hands and the fear with it.'],
                ['Week 1 — easy', 'Ask a stranger for directions or the time. Say hello to five people. Give one genuine compliment to a stranger.'],
                ['Week 2 — a bit awkward', 'Ask for a discount on your coffee. Ask someone for a recommendation and keep the chat going. Ask a stranger to take your photo.'],
                ['Week 3 — properly uncomfortable', 'Start a conversation with someone in a lecture, at the gym or in a queue. Make an odd request (ask for a free refill on something that does not have one). Sit with a group you do not know.'],
                ['Week 4 — the real ones', 'Stop a girl in the day just to say hi and tell her she looks good. Ask for a number. Ask someone out.'],
                ['The rules', 'Do it within three seconds of thinking of it. Be polite. Take every no with a smile — "no worries, have a good one" — and never push past it. Move up a level when the current one stops scaring you.'],
                ['Log it', 'One line in your evidence log each night: what you asked, what happened. Seeing the count go up is proof you are not that guy any more.'],
              ]} />
              <GPairs items={[
                ['What you will find out', 'Most people are nicer than you expect. A no stings for about a minute. After ten of them you will barely feel it.'],
                ['What a no actually means', '"Not this, not now" — not "not you". She does not know you. A rejection from a stranger is a verdict on two seconds, not on your life.'],
                ['After a no', 'Smile, walk away slowly, and start another conversation within sixty seconds. Rejection only sticks if you stop moving.'],
              ]} />
            </GFold>

            <Card icon={Flame} title="Where it actually comes from" items={[
              ['Evidence', 'Every kept promise to yourself is proof you can rely on you. Affirmations without evidence do not hold.'],
              ['Competence', 'Get good at something hard — lifting, football, a skill that pays. Competence spills into everything.'],
              ['Reps of discomfort', 'You do not wait to feel confident, then act. You act, and the feeling follows.'],
              ['Your own scoreboard', 'If your mood depends on how a night went or how many likes you got, someone else holds the controls.'],
            ]} />
            <Card icon={Heart} title="Nerves in the moment" items={[
              ['Long exhale', 'Breathe out for twice as long as you breathe in, three times. It is the fastest off-switch your body has.'],
              ['Name it', '"This is nerves, it is normal." Naming a feeling lowers it.'],
              ['Three seconds', 'Decide, then move within three seconds. Waiting only lets the story in your head grow.'],
              ['Turn outward', 'Get curious about them. Nerves are self-focus; curiosity replaces it.'],
            ]} />
            <Card icon={Mic2} title="Self-talk that works" items={[
              ['Use your own name or "you"', '"Roy, you have done harder than this" works better than "I can do this" — it creates distance from the fear.'],
              ['True, specific, present', '"You kept your word three days running" beats "I am amazing". The brain rejects claims it has no evidence for.'],
              ['Before social', '"Be warm first. Say the thing. The outcome is not the point."'],
              ['After a miss', '"What is the lesson? Next rep." Never turn a mistake into an identity: "I messed that up", not "I am useless".'],
            ]} />
            <Card icon={ListChecks} title="Unbothered — approval detox" items={[
              ['Spot the leaks', 'Over-explaining, fishing for compliments, checking faces after a joke, posting for reactions.'],
              ['Opinion reps', 'Give a real opinion once a day, even a small one. Disagree politely at least once a week.'],
              ['Do things without broadcasting', 'Train, build, improve — and tell nobody for a month. Watch how little you need the audience.'],
              ['Criticism', 'Ask: is it true, and is this person someone whose advice I would take? If neither, let it go.'],
              ['Comparison', 'You are comparing your inside to their highlight reel. Compare yourself to you three months ago.'],
            ]} />
            <Card icon={Sparkles} title="Positivity — the real kind" items={[
              ['No complaining', 'Complaining trains your brain to hunt for problems and makes you tiring company. Act or accept.'],
              ['Gratitude with teeth', 'Three specific things each night. It is what stops you needing the next win to feel okay.'],
              ['Guard the inputs', 'Doomscrolling, gossip, blackpill content — your mind eats what you feed it.'],
            ]} />
          </div>
        )}

        {/* ============ DISCIPLINE ============ */}
        {tab === 'discipline' && (
          <div className="fade-up stagger space-y-3">
            <Tldr points={[
              'Your phone wins because it pays instantly. Put it in another room while you work and the fight is over.',
              'Effort before reward, always: the scroll comes after the work, never before it.',
              'Start with five minutes. Motivation follows action; it never leads. Use LOCK IN on the command screen.',
              'When emotion spikes, pause before you act: name it, breathe out slowly, then decide.',
            ]} />
            <Card icon={Flame} title="Uncook your brain — the rules" items={[
              ['Phone out of the bedroom', 'It charges in another room. This single change fixes mornings and nights.'],
              ['No phone for the first and last hour', 'The first hour sets your dopamine baseline for the day.'],
              ['No short-form before the work is done', 'Short-form video makes everything slower feel unbearable. It goes after, not before.'],
              ['Remove the easiest apps', 'Delete or move them off the home screen. Friction beats willpower every time.'],
              ['Let yourself be bored', 'Walks without headphones, meals without a screen. Boredom is where ideas and calm come back.'],
              ['No porn', 'It is the most concentrated effort-free reward there is, and it drains drive for everything else.'],
            ]} />
            <Card icon={Brain} title="Deep work" items={[
              ['One block, one outcome', '60-90 minutes on one specific result: "finish problem set 3", not "revise".'],
              ['Environment', 'Phone in another room, one tab, water on the desk, door shut.'],
              ['Hardest thing first', 'Before messages, before the gym if you can. Willpower is highest early.'],
              ['Shallow work after', 'Emails, admin, messages go in a block at the end, never scattered through.'],
            ]} />
            <Card icon={ListChecks} title="When you want to quit" items={[
              ['The five-minute contract', 'Just start for five minutes. You will almost always keep going.'],
              ['Never miss twice', 'Missing once is life. Missing twice is the start of a new habit.'],
              ['Track the streak, not the mood', 'Your feelings will lie; the streak on the command screen will not.'],
              ['Rename the discomfort', 'That feeling is not a sign to stop. It is the feeling of getting better.'],
            ]} />
            <Card icon={Heart} title="Controlling emotions" items={[
              ['Emotions are data, not commands', 'Feel it fully; you do not have to act on it.'],
              ['The pause', 'Between the trigger and your response, breathe out slowly once. That pause is the whole skill.'],
              ['Never act at the peak', 'No texts, decisions or confrontations while angry. Sleep on it.'],
              ['10-10-10', 'Will this matter in 10 minutes, 10 months, 10 years?'],
            ]} />
            <Card icon={Compass} title="The Stoic core" items={[
              ['Control what you control', 'Your effort, judgement and response are yours. Other people, outcomes and the past are not. Spend energy only on the first.'],
              ['Memento mori', 'You will die, and you do not know when. Not morbid — clarifying.'],
              ['Rehearse the worst', 'Picture what could go wrong, calmly. It takes the fear out and lets you prepare.'],
              ['Choose discomfort', 'Cold showers, hard sessions, early starts. Chosen hardship makes unchosen hardship smaller.'],
              ['The evening review', 'What did I do well, what could I do better, what will I do tomorrow.'],
            ]} />
            <Card icon={Eye} title="The code" items={[
              ['Your word is the currency', 'Say less, do what you said.'],
              ['Radical responsibility', 'Whatever happened, what is your part and what will you do now?'],
              ['Handle hard things quietly', 'Composure in public, feelings dealt with in private or with people you trust.'],
              ['Strength protects', 'Strength exists to protect, never to intimidate.'],
              ['Build more than you consume', 'Every day, make something: a rep, a page, a skill, a pound earned.'],
            ]} />
          </div>
        )}

        {/* ============ MORNING & NIGHT ============ */}
        {tab === 'routine' && (
          <div className="fade-up space-y-3">
            <Tldr points={[
              'Morning: phone stays away for the first hour. Water, daylight, move, five minutes of meditation, say your three lines out loud.',
              'Night: phone charges outside the bedroom, same bedtime every night, write tomorrow\'s top three.',
              'The routine is not the goal. It is what makes the rest of the day easy.',
            ]} />
            <div className="flex gap-1.5">
              {(['morning', 'night'] as const).map(v => (
                <button key={v} onClick={() => setRoutineView(v)}
                  className={`flex-1 py-2 rounded-xl font-hud text-sm font-bold uppercase tracking-wider border transition-all ${routineView === v ? 'bg-cyan-400/15 border-cyan-300/60 text-cyan-50' : 'bg-white/[0.03] border-white/10 text-gray-400'}`}>
                  {v === 'morning' ? 'Morning' : 'Night'}
                </button>
              ))}
            </div>
            {routineView === 'morning' ? (
              <>
                <Card icon={ListChecks} title="The first hour — in order" items={[
                  ['1. Wake at the same time', 'Every day, within 30 minutes, weekends included. It is the anchor for everything else.'],
                  ['2. Water and daylight', '500ml of water, then 5-10 minutes outside. Daylight sets your body clock and wakes you faster than coffee.'],
                  ['3. Move', 'A 10-minute walk or mobility. Finish your shower cold for 30-60 seconds if you want the edge.'],
                  ['4. Meditate — five minutes', 'See below. Five minutes, not twenty; you will actually do it.'],
                  ['5. Say your three lines', 'Out loud. See below.'],
                  ['6. Top three, then the hardest one', 'Write today\'s three priorities and start the hardest with a LOCK IN session. Phone only after that.'],
                ]} />
                <Card icon={Brain} title="Meditation — how to actually start" items={[
                  ['The whole method', 'Sit, eyes closed, breathe normally. Count breaths from 1 to 10, then start again. When you drift — and you will — notice it and go back to 1.'],
                  ['That drift is the rep', 'Noticing you wandered and coming back is the exercise, not a failure of it.'],
                  ['Build slowly', 'Five minutes for two weeks, then ten. An app like Waking Up or Headspace helps if you want guidance.'],
                  ['What you get', 'A longer gap between feeling something and reacting to it. That gap is composure.'],
                ]} />
                <Card icon={Mic2} title="Saying positive things — the version that works" items={[
                  ['Three lines, present tense', 'For example: "I keep my word to myself." "I am warm first." "I finish what I start."'],
                  ['True or being made true', 'Only say what you are acting on. A line with no evidence behind it gets rejected by your own brain.'],
                  ['Then prove one', 'Pick one line and do something today that makes it true. That is what turns words into identity.'],
                ]} />
              </>
            ) : (
              <>
                <Link to="/" className="flex items-center justify-between rounded-2xl border border-yellow-400/30 bg-yellow-400/[0.06] px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm text-yellow-100">Plan tomorrow</p>
                    <p className="text-xs text-gray-500">Your daily plan is on the command screen.</p>
                  </div>
                  <ChevronDown size={16} className="-rotate-90 text-yellow-300" />
                </Link>
                <Card icon={ListChecks} title="The last hour — in order" items={[
                  ['1. Screens off 30-60 minutes before bed', 'Phone on charge outside the bedroom. Use a cheap alarm clock.'],
                  ['2. Plan tomorrow', 'Your top three, on the command screen. A decided morning is an easy morning.'],
                  ['3. The three-minute review', 'What went well, what to do better, one win for your evidence log in Know Yourself.'],
                  ['4. Wind down', 'Shower, five minutes of stretching, read something on paper.'],
                  ['5. Same bedtime', 'Within 30 minutes every night. 8 hours is what training, skin and mood all run on.'],
                ]} />
                <Card icon={Moon} title="Sleep that actually works" items={[
                  ['The room', 'Cool (16-19°C), dark, quiet. An eye mask and earplugs are cheap and work.'],
                  ['Cut-offs', 'No caffeine after 2pm, no big meal in the last 2-3 hours. Alcohol wrecks sleep quality even when it knocks you out.'],
                  ['Cannot sleep?', 'After 20 minutes, get up, read somewhere dim, come back when sleepy. Lying there frustrated trains your brain that bed means awake.'],
                  ['Your WHOOP', 'Log it each morning on the command screen. Low recovery two days running usually means sleep, alcohol or stress.'],
                ]} />
              </>
            )}
          </div>
        )}








        {tab === 'secret' && !unlocked && (
          <div className="fade-up">
            <div className="card-premium p-8 text-center">
              <Lock size={28} className="text-pink-400 mx-auto mb-4" />
              <h3 className="font-black text-lg mb-1">Members Only</h3>
              <p className="text-gray-500 text-sm mb-6">This section is password-protected.</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryUnlock()}
                  placeholder="Password"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500/50"
                />
                <button onClick={tryUnlock}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'secret' && unlocked && (
          <div className="fade-up stagger space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-hud text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/80 flex items-center gap-1.5"><Unlock size={12} /> Game Plan</p>
              <button onClick={relock} className="text-[11px] text-gray-500 hover:text-gray-300 flex items-center gap-1"><Lock size={11} /> Lock it</button>
            </div>
            <Tldr points={[
              'Approach more — it is not close. Waiting for a look filters out exactly the ones you want.',
              'Warm first and smile before you speak. At your height, stand side-by-side, not face-to-face.',
              'Want it, do not need it: count conversations started, not results.',
              'Move within the first twenty minutes and leave on a high rather than outstaying it.',
            ]} />
            <Link to="/cheatsheet" className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.06] px-4 py-3">
              <div>
                <p className="font-semibold text-sm text-cyan-100">The cheat sheet</p>
                <p className="text-xs text-gray-500">One page. Read it before you go out.</p>
              </div>
              <ChevronDown size={16} className="-rotate-90 text-cyan-300" />
            </Link>

            <Card icon={Compass} title="Your diagnosis — why mates who look worse are pulling more" items={[
              ['Looks get you looked at. Almost nothing else.', 'They do not start conversations or end the night with anyone. A 7 who talks to fifteen people beats a 9 who talks to three.'],
              ['You are not approaching enough', 'Almost certainly the whole gap. Attempts, initiative and warmth — all trainable.'],
              ['You are waiting to be chosen', 'Only approaching girls who look first filters out the ones you want: the ones who get looked at all night have learned not to look back.'],
              ['You have more to lose, so you risk less', 'Good-looking guys protect the image. The fix is volume at zero stakes until a "no" means nothing.'],
              ['It has dropped because of a spiral', 'Fewer attempts → fewer results → more hesitation. Break it with reps, not with thinking.'],
            ]} />
            <Card icon={Eye} title="Being 6ft 4 in a club" items={[
              ['You loom and you cannot hear', 'Standing over someone reads as intimidating. Lean in, lower yourself, get to ear level.'],
              ['Side-by-side, not face-to-face', 'Stand next to her facing the room. Less pressure, easier to hear, easier to stay.'],
              ['Smile before you speak, every time', 'Height plus a neutral face reads as stern. The smile is what makes it approachable.'],
              ['Do not shrink', 'Slouching to seem less tall just looks unsure. Use your height at distance, soften it up close.'],
            ]} />
            <Card icon={Flame} title="The warm-up — like a match, not a cold start" items={[
              ['At home: raise the energy', 'Shower, your loudest playlist, move around while you get ready. Say your three lines out loud — it warms your voice up too.'],
              ['On the way: talk first', 'Chat to the taxi driver, the person in the queue, the bouncer. Three easy conversations before you are even inside.'],
              ['First 20 minutes: compliment everyone', 'Bar staff, lads, a group of girls on the way past — "love the jacket", "you lot are the best-dressed table here". No agenda. It flips you from watching to talking.'],
              ['Then go — while you are warm', 'Your first real approach happens inside the first half-hour, before the warm-up wears off. Waiting until midnight means starting cold again.'],
            ]} />
            <Card icon={Flame} title="Momentum rules — keep the night moving" items={[
              ['3-2-1, go', 'The moment you notice her, count down 3-2-1 and move. Your brain cannot talk you out of it in three seconds; it always can in thirty.'],
              ['Compliment five people before the first approach', 'Genuine, specific, quick, then walk on. By the fifth one you are talking easily and nothing feels like a big deal.'],
              ['Never stand still for more than five minutes', 'Stillness is where nerves build. Move to the bar, the dance floor, another room — momentum is physical.'],
              ['Ten hellos by 11pm', 'Count conversations started, not results. A number to hit turns the night into reps instead of a test.'],
              ['Straight back in after a no', 'Start another conversation within sixty seconds — anyone, about anything. A rejection only stings if you stop moving afterwards.'],
              ['Be the one who hypes your mates', 'Open groups for them, laugh loudest, suggest the next move. The energy you give the group comes straight back to you.'],
              ['Two drinks, not ten', 'Enough to loosen up, not enough to lose your timing. Momentum comes from reps, not from the bar.'],
            ]} />
            <Card icon={Flame} title="How to move in a club" items={[
              ['Go earlier, small group, two drinks', '11pm is friendlier than 1am. Two or three mates. You cannot run any of this drunk.'],
              ['Warm up first', 'Talk to everyone for 20-30 minutes — bar staff, groups of lads, anyone. The first real approach should not be cold.'],
              ['Circulate, do not stand still', 'Loop the venue, stand where people pass, face outward not into your group.'],
              ['Three seconds', 'See her, decide, go. Hesitation builds a story in your head and weirdness in your walk-up.'],
              ['Keep it simple — it is loud', 'Smile, lean to her ear: "I had to come say hi — I\'m Roy." Then side-by-side.'],
              ['Win the friends', 'Greet them early and warmly. Ignored friends extract her within five minutes.'],
              ['Somewhere quieter', '"It\'s way too loud — come grab a drink at the bar." An invitation, never a pull.'],
            ]} />
            <Card icon={MessageCircle} title="What to actually say" items={[
              ['Direct beats lines', '"This is random, but you looked interesting and I had to say hi." Nerve is the attractive part.'],
              ['Situational works too', 'Comment on the shared thing — the queue, the music — then "I\'m Roy, by the way."'],
              ['Statements, not interviews', '"You seem like trouble" invites play. "What do you do?" invites autopilot.'],
              ['Tease lightly, then be sincere', 'Playful teasing followed by one specific, genuine compliment. The contrast is what creates tension.'],
              ['Show your intent', 'Hold eye contact a beat longer, with a slight smile. You are not trying to be her mate.'],
            ]} />
            <Card icon={Heart} title="Frame and mindset" items={[
              ['No pedestal', 'The moment someone is "above" you, it shows in every word. You are both finding out if you get on.'],
              ['Qualify, do not perform', 'Instead of proving yourself, find out if she is someone worth your time — her humour, her ambition.'],
              ['Outcome attachment', 'Needing a result leaks through your body: laughing early, hovering, checking. Define the night by what you did.'],
              ['Rejection is information', 'A "no" is poor fit found early. Smile, "no worries, have a good night", walk away slowly. The room notices grace.'],
              ['A full life is the real scarcity', 'Training, building, football, friends. You are naturally less available because you are busy — and it shows.'],
            ]} />
            <Card icon={MessageCircle} title="Texting and getting the date" items={[
              ['Number at the peak', '"I need to find my mates — but I want to continue this. What\'s your number?"'],
              ['Callback within a day', 'Reference something from the night, then a concrete plan: day, time, place.'],
              ['Every text has a job', 'A question, a joke or a plan. "Haha yeah" is where you propose something instead.'],
              ['Match her pace', 'Similar length, natural reply speed. No timers, no double texts that only chase a reply.'],
              ['Not needing the reply', 'Send it and go live your life. Your mood should not depend on how fast she answers.'],
            ]} />
            <Card icon={Sparkles} title="Dates and connection" items={[
              ['Dates that move', 'Walk, street food, a view, a game, something competitive. Movement and novelty do the bonding.'],
              ['Range of feeling', 'Funny, competitive, sincere, back to funny. One flat pleasant note is forgettable.'],
              ['Make her feel heard', 'Specific callbacks ("how did that presentation go?") beat any compliment about looks.'],
              ['Escalate at her pace', 'Match the energy she gives back. Believe the pattern of signals, not one ambiguous moment.'],
            ]} />
            <Card icon={ListChecks} title="Reading interest — and respecting it" items={[
              ['Interested looks like', 'She asks questions back, stays close, remembers your details, extends the conversation.'],
              ['Polite looks like', 'Short answers, no questions, eyes elsewhere. Wish her a good night and move on.'],
              ['Consent is the whole game', 'Enthusiastic yes at every step. If she is drunk or hesitant, the move is her number and a proper date.'],
              ['Any no is final and fine', 'Instant, cheerful acceptance. Whatever happens, she gets home safe.'],
            ]} />
            <Card icon={Heart} title="Going back, and intimacy" items={[
              ['Only when the night built it', 'Strong connection, her matching your energy, both sober enough for a real choice.'],
              ['Low-pressure invite', '"I\'m heading back to mine — come for a drink." One ask. "Not tonight" → "then let me take you out properly."'],
              ['Your place, sorted', 'Clean room, clean sheets, water in the fridge, a charger. More nights have been lost to a messy room than to rejection.'],
              ['Slow is the skill', 'Build for longer than feels necessary, read her body, check in. Protection every time until exclusive and tested.'],
              ['After', 'Stay close, no phone-grab, make sure she gets home safe, and a warm text the next day.'],
            ]} />
            <Card icon={Compass} title="Getting a girlfriend" items={[
              ['You are choosing too', 'How she treats waiters, whether she asks about you, whether she flakes, how she talks about exes.'],
              ['Consistency is the courtship', 'A date a week, planned by you, getting deeper each time.'],
              ['The talk', 'After 6-10 good dates: "I\'m not interested in seeing anyone else — I want this to be us. What do you think?"'],
              ['Red flags beat chemistry', 'Contempt, chronic flaking, silent treatment. Walking away early saves years.'],
            ]} />
            <GCallout tone="emerald" title="The honest part" text="Kisses per night is a bad scoreboard, and clubs are the hardest venue there is. This is a skill, not a verdict on you — and being genuinely liked beats being briefly wanted." />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
