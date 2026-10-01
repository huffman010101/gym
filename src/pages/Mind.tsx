import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Brain, Flame, MessageCircle, Lock, Unlock, Sparkles, Mic2, Eye, ChevronDown, Heart, BookOpen, ListChecks, Compass, Moon } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { SectionHeader, TabBar, OneThing } from '../components/Hud';
import KnowYourself from '../components/KnowYourself';

type Tab = 'playbook' | 'know' | 'social' | 'confidence' | 'discipline' | 'routine' | 'secret';
const TAB_IDS = ['playbook', 'know', 'social', 'confidence', 'discipline', 'routine', 'secret'] as const;
// Old tab ids from before the merge, so saved links and search still land.
const LEGACY: Record<string, Tab> = {
  code: 'playbook', charisma: 'social', aura: 'social', icons: 'social', focus: 'discipline', morning: 'routine', night: 'routine',
};
function resolveTab(t: string | null): Tab | null {
  if (!t) return null;
  if ((TAB_IDS as readonly string[]).includes(t)) return t as Tab;
  return LEGACY[t] ?? null;
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'playbook', label: '★ The Playbook' },
  { id: 'know', label: 'Know Yourself' },
  { id: 'social', label: 'Charisma & Presence' },
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
  const [tab, setTab] = useState<Tab>(() => resolveTab(params.get('tab')) ?? 'playbook');
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
        <SectionHeader icon={Brain} title="Mind" subtitle="Start with The Playbook. Everything else is the detail behind it." />

        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {/* ============ THE PLAYBOOK — the whole section on one screen ============ */}
        {tab === 'playbook' && (
          <div className="fade-up stagger space-y-4">
            <Tldr points={[
              'Confident is keeping promises to yourself. Charismatic is making other people feel good around you. Both are habits, not personality.',
              'Slow down, be warm first, listen properly, and do one scared thing a day. That is ninety per cent of it.',
              'Want things without needing them. Count what you did, not how it went.',
            ]} />

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

            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold mb-3">Go deeper — only when you need it</h3>
              <div className="space-y-2">
                {([
                  ['know', 'Know Yourself', 'Your values, standards, evidence log and a personal plan built from them'],
                  ['social', 'Charisma & Presence', 'Voice, body language, humour, listening, frame'],
                  ['confidence', 'Confidence', 'Where it comes from, nerves, self-talk, security'],
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

        {/* ============ CHARISMA & PRESENCE ============ */}
        {tab === 'social' && (
          <div className="fade-up stagger space-y-3">
            <Tldr points={[
              'Slow down everything — speech, walk, reactions. Calm reads as confident before you say a word.',
              'Warm first: smile, eye contact, say hello before they do. Warmth plus composure is the whole formula.',
              'Listen properly: stop queueing your reply, ask the follow-up, remember a detail and bring it up next time.',
              'Hold your frame: do not over-explain, stay amused rather than wounded when you are teased.',
            ]} />
            <Card icon={Mic2} title="Voice and body language" items={[
              ['Speak from the chest, slower', 'Lower and 20% slower than feels natural. Rushed, high speech is the most common tell of nerves.'],
              ['End statements down', 'Rising at the end turns a statement into a request for approval.'],
              ['Pause instead of filling', 'A one-second pause beats "um" and "like". Silence reads as composure.'],
              ['Take up space calmly', 'Feet shoulder-width, shoulders down, hands still. Not puffed up — just not shrinking.'],
              ['Eye contact', 'Hold it while you listen, break it sideways while you think. Looking down reads as submission.'],
            ]} />
            <Card icon={MessageCircle} title="Conversation" items={[
              ['Go deeper, not wider', 'Pick something they said and follow it: "Wait, why did you quit?" beats a new topic every time.'],
              ['Statements over questions', '"You seem like the one who plans every trip" invites play. "What do you do?" invites autopilot.'],
              ['React for real', 'Laugh when it is funny, be surprised when it is surprising. Flat, polite responses kill conversations.'],
              ['Stories: setup, tension, payoff', 'Cut everything that is none of those three. Thirty seconds, not three minutes.'],
              ['Leave on a high', 'End while it is still good. People remember the peak and the end.'],
            ]} />
            <Card icon={Heart} title="Listening — the charisma nobody sees" items={[
              ['Stop queueing your reply', 'If you are rehearsing what to say next, you are not listening. This one habit is most of it.'],
              ['Follow up, do not switch', 'Ask about what they just said before you move on.'],
              ['Do not hijack', '"That happened to me too" turns their story into yours. Save it.'],
              ['Do not fix unless asked', 'Most people want to be heard, not solved. Ask: "Do you want advice or just to vent?"'],
              ['Remember and call back', 'Bring up a detail days later. Nothing makes people feel more valued.'],
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
            ]} />
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
