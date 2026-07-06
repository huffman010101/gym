import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Flame, MessageCircle, Lock, Unlock, Sparkles, Mic2, Eye, ChevronDown, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Tab = 'charisma' | 'aura' | 'confidence' | 'selftalk' | 'secret';

const TABS: { id: Tab; label: string }[] = [
  { id: 'charisma', label: 'Charisma' },
  { id: 'aura', label: 'Aura' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'selftalk', label: 'Self-Talk' },
  { id: 'secret', label: '🔒 Secret' },
];

function Card({ title, items, icon: Icon }: { title: string; items: [string, string][]; icon: typeof Brain }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-pink-400" />
        <h3 className="font-bold">{title}</h3>
      </div>
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
  const [tab, setTab] = useState<Tab>('charisma');
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

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5">
          <ArrowLeft size={15} /> Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-pink-500/10 rounded-xl flex items-center justify-center">
            <Brain className="text-pink-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Mind</h1>
            <p className="text-gray-500 text-sm">Charisma · Confidence · Self-Belief · Social Skill</p>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ============ CHARISMA ============ */}
        {tab === 'charisma' && (
          <div className="fade-up stagger space-y-4">
            <Card icon={Sparkles} title="The Charisma Formula" items={[
              ['Presence', 'Charisma is 90% making people feel like the only person in the room. Phone away, full eye contact, react to what they actually said — not what you were waiting to say.'],
              ['Warmth + Power', 'Warmth alone = nice but forgettable. Power alone = intimidating. Both together = magnetic. Smile easily AND hold your ground on opinions.'],
              ['Slow down everything', 'Charismatic people move, speak and turn their head unhurried. Rushed movement broadcasts nervousness. Pause before you answer — it reads as thoughtful, not slow.'],
              ['Expressiveness', 'Monotone kills. Let your face and voice actually show amusement, curiosity, surprise. People mirror the energy you bring.'],
            ]} />
            <Card icon={Mic2} title="Voice" items={[
              ['Speak from the chest', 'Breathe into your belly and let the voice resonate low. Higher, throaty voice = nerves. Practice reading aloud 5 min/day at the bottom of your comfortable range.'],
              ['End statements DOWN', 'Upward inflection turns statements into questions and leaks approval-seeking. Drop the pitch at the end of sentences.'],
              ['Volume slightly above comfortable', 'Quiet talkers get talked over. You should never be asked to repeat yourself twice in one conversation.'],
              ['Silence is a power tool', 'Comfort with pauses signals status. Don\'t fill every gap — let a beat land after you make a point.'],
            ]} />
            <Card icon={Eye} title="Body Language" items={[
              ['Take up space calmly', 'Shoulders back and down, chest open, arms uncrossed, feet planted shoulder-width. Shrinking postures read as apologising for existing.'],
              ['Eye contact rhythm', 'Hold while THEY speak (shows engagement), break naturally to the side (not down — down reads submissive) while you think.'],
              ['Slow nod, real smile', 'A slow triple-nod while listening makes people open up. A smile that reaches the eyes beats a held grin.'],
              ['Walk like you own the route', 'Head level, pace unhurried, no darting eyes. Practice literally: walk through busy places holding your line politely.'],
            ]} />
            <Card icon={MessageCircle} title="Conversation Skill" items={[
              ['Statements > questions', 'Interviews are boring. Instead of "Where are you from?" try "You\'ve got a London accent — I\'m guessing south." Assumptions invite play; interrogations invite one-word answers.'],
              ['Thread, don\'t topic-hop', 'Every sentence someone says contains 3 threads. "I just got back from Spain with my sister" = Spain, travel, family. Pick one and pull.'],
              ['Give real reactions', '"No way — that changes everything, what did you do?" beats "oh nice". Being easily delighted is charisma fuel.'],
              ['Exit on a high', 'Leave conversations at the peak, not the fizzle. "I need to head off — this was the best chat I\'ve had all week." People remember endings.'],
            ]} />
            <Card icon={MessageCircle} title="Storytelling & Banter" items={[
              ['Story structure: setup → tension → payoff', 'Setup: one line of context ("So I\'m at the gym at 6am, dead empty…"). Tension: the thing that went wrong or got weird. Payoff: the punchline or the lesson. Cut everything that isn\'t one of those three.'],
              ['Tell it for them, not for you', 'Eye contact, act out the voices, pause before the payoff. A mid story told with energy beats a great story mumbled.'],
              ['Callback humour', 'Reference a joke or moment from earlier in the conversation ("classic — just like your Spain disaster"). Callbacks build an inside world and prove you were listening. The longer the gap, the harder it lands.'],
              ['Banter = playful disagreement', 'Take the opposite side of something trivial with a grin, exaggerate, never punch at real insecurities. If they escalate the bit, play along — dropping the bit to be literal kills it.'],
              ['Know when to lead vs follow', 'Lead when energy dips (new topic, suggestion, tease). Follow when they light up about something — feed it with reactions and questions. Charisma is reading which mode the moment needs.'],
              ['Ask real questions, then actually listen', 'The upgrade from small talk isn\'t better questions, it\'s using their ANSWER. If you\'re queueing your next line while they talk, they can feel it.'],
            ]} />
          </div>
        )}

        {/* ============ AURA ============ */}
        {tab === 'aura' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={16} className="text-pink-400" /> What "Aura" Actually Is</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Bond effect is not mystery for its own sake — it's <span className="text-gray-200 font-semibold">composure plus competence plus restraint</span>.
                People read hundreds of micro-signals: how you enter a room, how you react to spilled drinks, how much you need
                to be noticed. High-value reads as "this person is complete without my approval." Every habit below feeds that signal.
              </p>
            </div>
            <Card icon={Sparkles} title="The Bond Habits" items={[
              ['Unshakeable under small chaos', 'Order is wrong, train\'s cancelled, someone\'s rude — your reaction is a raised eyebrow and a plan, never a flap. Composure in trivial moments is what people extrapolate to everything else.'],
              ['Decisive by default', 'Order without re-reading the menu three times. Pick the restaurant. Choose the plan. Decisiveness in small things builds the aura of a man who knows what he wants in big things.'],
              ['Speak less, land more', 'Bond wins conversations with a sentence, not a monologue. Say 70% of what you could; the withheld 30% is the aura. Never narrate your whole life to fill silence.'],
              ['Immaculate by default', 'Pressed clothes, clean shoes, groomed always — not for events, as baseline. Aura dies the day someone sees you scruffy at the shop.'],
              ['Unbothered by attention either way', 'Neither seeking the spotlight nor shrinking from it. Enter rooms calmly, greet who you know, settle in — no scanning for validation.'],
              ['Politeness with edge', 'Courteous to everyone — waiters, bouncers, strangers — but never a pushover. "No" said pleasantly and finally, once, is the most high-status sentence there is.'],
            ]} />
            <Card icon={Eye} title="Scarcity & Restraint" items={[
              ['Don\'t announce plans, reveal results', 'Talking about goals leaks the reward before the work. Show up transformed instead — mystery plus proof beats promises.'],
              ['Miss occasionally', 'Not every party, not every reply within minutes, not endlessly available. People value what has scarcity. (Genuine busyness building your life — not games.)'],
              ['Never over-explain', 'Reasons on request, not preemptive essays. Over-explaining signals you expect to be doubted.'],
              ['Keep confidences like a vault', 'Never gossip. The person hearing your gossip learns you leak. "He never talks about people" is elite reputation.'],
              ['Compliment rarely, precisely', 'When compliments are scarce and specific, yours mean something. The person who validates everything validates nothing.'],
            ]} />
            <Card icon={Brain} title="Psychology of Positivity (the real kind)" items={[
              ['The no-complaint rule', 'Zero complaining unless paired with an action ("this is broken, here\'s what I\'m doing"). Complainers signal helplessness; problem-solvers signal power. Try 7 days clean.'],
              ['Reframe on impact', 'First thought after a setback: "good — because…". Missed train = time to make the call. Rejection = data + a story. This is trainable and it\'s the core of resilience psychology.'],
              ['Gratitude with teeth', 'Nightly: 3 specific things that went right and WHY they happened. Trains your attention to spot opportunity instead of threat — measurable mood and optimism shifts within weeks.'],
              ['Energy is a choice you make hourly', 'People remember how you made the room feel. Deciding to bring warmth and energy — especially when neutral — is the most underrated social skill on earth.'],
              ['Abundance beats scarcity in every decision', 'One opportunity/person/chance is never the only one. Scarcity thinking causes clinging, rushing, settling. Abundance thinking is calm — and it\'s self-fulfilling because calm attracts options.'],
              ['Guard the inputs', 'Doomscrolling, gossip, blackpill content — your mind eats what you feed it. Curate feeds as strictly as your diet. Positivity is an input problem before it\'s a mindset problem.'],
            ]} />
          </div>
        )}

        {/* ============ CONFIDENCE ============ */}
        {tab === 'confidence' && (
          <div className="fade-up stagger space-y-4">
            <Card icon={Flame} title="Where Real Confidence Comes From" items={[
              ['Evidence, not affirmations alone', 'Confidence = a stack of kept promises to yourself. Every workout finished, every cold shower, every scary conversation had — that\'s a deposit. The account balance is self-belief.'],
              ['Competence loop', 'Pick skills and actually get good: lifting, fighting, talking, a craft. Confidence without competence collapses under pressure; competence makes it unshakeable.'],
              ['Do the thing scared', 'Courage precedes confidence, never the reverse. The rep is: feel the fear, act anyway, survive, update your identity. Repeat until fear becomes fuel.'],
              ['Stop outsourcing your worth', 'If a like, a text-back or someone\'s mood can move your state, they own your state. Self-validation is a practice: judge YOUR day by YOUR standards each night.'],
            ]} />
            <Card icon={Flame} title="Daily Confidence Protocol" items={[
              ['Morning: win the first hour', 'Make the bed, train or move, cold exposure, no phone for 30 min. Starting with discipline colours the whole day\'s self-image.'],
              ['One rejection or discomfort daily', 'Ask for a discount, give a stranger a compliment, take the front seat in class. Deliberately touching discomfort daily shrinks its power everywhere.'],
              ['Posture audit x3', 'Three times a day: shoulders down-and-back, spine tall, slow exhale. State follows body.'],
              ['Night: log 3 wins', 'Write three things you did right today, however small. Your brain keeps score of whatever you count — count wins.'],
            ]} />
            <Collapsible title="Handling Nerves in the Moment" tag="Pre-approach, pre-talk, pre-fight">
              <div className="space-y-3 text-sm">
                <p className="text-gray-400"><span className="font-bold text-gray-200">Physiological sigh:</span> double inhale through the nose, long exhale through the mouth, x3. Fastest known way to drop acute stress.</p>
                <p className="text-gray-400"><span className="font-bold text-gray-200">Rename it:</span> anxiety and excitement are the same chemistry. Say "I'm excited" — performance measurably improves versus trying to calm down.</p>
                <p className="text-gray-400"><span className="font-bold text-gray-200">3-second rule:</span> when you notice the urge to act (approach, speak up, raise your hand), move within 3 seconds. Hesitation compounds; action interrupts it.</p>
                <p className="text-gray-400"><span className="font-bold text-gray-200">Focus outward:</span> nerves come from self-monitoring. Put 100% attention on the other person or the task — self-consciousness needs an audience of you.</p>
              </div>
            </Collapsible>
          </div>
        )}

        {/* ============ SELF-TALK ============ */}
        {tab === 'selftalk' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Brain size={16} className="text-pink-400" /> How Self-Talk Actually Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your brain treats your own voice as the most credible source it knows. Repeated statements become the default
                filter you see yourself through — this is trainable. Rules: present tense, personal, and either believable
                or phrased as becoming ("I'm becoming…"). Say them in the mirror, out loud, morning and night. Cringe fades;
                the wiring stays.
              </p>
            </div>
            {[
              ['Identity', ['I keep the promises I make to myself.', 'I am the kind of man who does hard things first.', 'I don\'t need the room\'s approval — I bring my own.', 'Discipline is my default, not my exception.']],
              ['Before social situations', ['People are lucky to talk to me — I bring energy others don\'t.', 'I\'m curious about everyone and intimidated by no one.', 'My presence is enough. I don\'t perform, I connect.', 'Whatever happens, I handle it. I always handle it.']],
              ['Before training / competing', ['My body does what my mind commands.', 'Fatigue is information, not an instruction.', 'I\'ve done the work. Now I collect.', 'Pressure is a privilege — it means I\'m in the arena.']],
              ['After setbacks', ['This is data, not a verdict.', 'I judge myself on response, not results.', 'Losing a rep doesn\'t make me a loser. Quitting would.', 'Six months from now this is a story I tell, not a wound I carry.']],
            ].map(([title, lines]) => (
              <div key={title as string} className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h3 className="font-bold mb-3 text-pink-300">{title as string}</h3>
                <div className="space-y-2">
                  {(lines as string[]).map(l => (
                    <p key={l} className="text-gray-300 text-sm bg-white/3 border border-white/5 rounded-lg px-3 py-2">“{l}”</p>
                  ))}
                </div>
              </div>
            ))}
            <Card icon={Brain} title="Kill the Inner Critic" items={[
              ['Catch → Name → Reframe', 'Notice the thought ("I\'ll embarrass myself"), label it ("that\'s the fear talking"), replace with a coach\'s line ("worst case, I learn something").'],
              ['Talk to yourself in second person', '"You\'ve got this, Roy" outperforms "I\'ve got this" in studies — it creates coach-distance from the emotion.'],
              ['Never narrate a miss with identity', '"I missed the lift" ✅. "I\'m weak" ❌. Behaviour language is fixable; identity language sticks.'],
            ]} />
          </div>
        )}

        {/* ============ SECRET ============ */}
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
          <div className="fade-up stagger space-y-4">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-widest">
              <Unlock size={13} /> Unlocked — The Social Playbook
            </div>
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Heart size={16} className="text-pink-400" /> Ground Rules First</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                None of this works as a trick, and all of it works as a skill. You're not extracting anything from anyone —
                you're becoming someone women genuinely enjoy being around, and being direct about your interest.
                Read her signals honestly: if she's engaged, continue; if she's polite-but-flat, wish her a good day and exit
                gracefully. Grace in rejection is the single most attractive trait you can build, because it means you were never desperate.
              </p>
            </div>
            <Collapsible title="The Approach" tag="First 10 seconds">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Within 3 seconds of noticing her</span> — hesitation builds a story in your head and weirdness in your walk-up. See, decide, go.</p>
                <p><span className="font-bold text-gray-200">Front or side, never behind.</span> Approach from an angle she can see, comfortable distance, relaxed pace. In daytime, a slight pause + "excuse me" is perfect.</p>
                <p><span className="font-bold text-gray-200">Be direct and own it:</span> "This is random, but I saw you and thought you looked interesting — I had to say hi. I'm Roy." Direct beats routines because it demonstrates the scarcest asset: nerve.</p>
                <p><span className="font-bold text-gray-200">Voice slow, volume up, smile real.</span> Nerves make guys rush and mumble. If you feel shaky, slow down 20% more.</p>
                <p><span className="font-bold text-gray-200">Situational openers work too:</span> comment on the thing you're both experiencing (the queue, the playlist, her book) then transition: "I'm Roy, by the way."</p>
              </div>
            </Collapsible>
            <Collapsible title="How to Speak to Her" tag="Conversation that creates attraction">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Statements and assumptions, not interviews.</span> "You seem like the friend who plans the whole trip" invites her to play. "What do you do?" invites autopilot.</p>
                <p><span className="font-bold text-gray-200">Tease lightly, warmly.</span> Playful disagreement and gentle teasing ("you're trouble, I can tell") signals confidence — always with a smile, never at her insecurities.</p>
                <p><span className="font-bold text-gray-200">Push-pull rhythm.</span> Show interest, then playfully withdraw it: "You're actually funny… this might be a terrible idea." Tension is what separates flirting from friendliness.</p>
                <p><span className="font-bold text-gray-200">Hold eye contact a beat longer</span> than friendly, with a slight smile. Most attraction is communicated in the look, not the words.</p>
                <p><span className="font-bold text-gray-200">Don't hide your intent.</span> You're not her buddy. Flirting = your interest is visible AND you're unbothered about the outcome.</p>
              </div>
            </Collapsible>
            <Collapsible title="Building Comfort" tag="From stranger to 'I feel like I've known you ages'">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Trade depth gradually.</span> Share something real about yourself first (dreams, family, an embarrassing story) — vulnerability from strength invites hers.</p>
                <p><span className="font-bold text-gray-200">Listen like it's a skill, because it is.</span> Remember details and call back to them later ("wait — is this the sister from the Spain story?"). Callbacks build an inside world between you two.</p>
                <p><span className="font-bold text-gray-200">Us-frame.</span> Little conspiracies: "we're definitely judging this DJ together." Shared jokes create "us vs the room."</p>
                <p><span className="font-bold text-gray-200">Comfort ≠ boring.</span> Keep flirting while going deeper. Deep + zero tension = friend zone; tension + zero depth = forgettable.</p>
              </div>
            </Collapsible>
            <Collapsible title="Making Her Feel Special" tag="The part most guys skip">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Compliment what she chose, not just what she was born with.</span> Her taste, her humour, her ambition, the way she tells a story. "You light up when you talk about that" lands deeper than "you're pretty."</p>
                <p><span className="font-bold text-gray-200">Specific beats generic, always.</span> One precise observation about her ("you ask better questions than anyone I've met this month") outweighs ten "you're amazing"s.</p>
                <p><span className="font-bold text-gray-200">Full presence is the gift.</span> Phone away, body turned to her, unhurried. In a distracted world, undivided attention feels rare because it is.</p>
                <p><span className="font-bold text-gray-200">Remember and follow through.</span> If she mentions an exam, a trip, a hard week — ask about it next time unprompted. Reliability is romance.</p>
              </div>
            </Collapsible>
            <Collapsible title="Texting Game" tag="Momentum over monologues">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Match her length and pace, roughly.</span> She sends two lines, you send around two lines. She takes an hour, you don't need to reply in 30 seconds. Mirroring reads as calibrated; triple-texting reads as anxious. One follow-up max, then let it breathe.</p>
                <p><span className="font-bold text-gray-200">Text with intent.</span> Every text should have a job: a question, a bit, or a plan. "haha yeah" is a dead-end — if you have nothing to add, that's the moment to propose something instead.</p>
                <p><span className="font-bold text-gray-200">Humour and specificity beat "hey, how's it going".</span> Callback to your conversation ("saw a guy order the thing you swore you'd never admit you like") lands 10× harder than a generic check-in. Specific = you remembered = you care.</p>
                <p><span className="font-bold text-gray-200">Don't perform interest you don't have.</span> Hot-and-cold reads worse than honest and direct. If you like her, text like it. If you're unsure, don't manufacture daily conversation out of obligation — inconsistency is the real turn-off.</p>
                <p><span className="font-bold text-gray-200">The plan is the point.</span> Texting exists to get to the date. Two or three good exchanges, then: "Thursday, that ramen place you doubted — 7?" Prolonged pen-pal phases kill more connections than bad openers ever have.</p>
              </div>
            </Collapsible>
            <Collapsible title="Building Genuine Connection" tag="The difference between game and connection">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Make her feel heard, specifically.</span> Generic compliments bounce off; specific callbacks stick. "You said last week you were dreading that presentation — how did it actually go?" is worth more than a hundred "you're gorgeous" texts.</p>
                <p><span className="font-bold text-gray-200">Escalate at HER pace, not a script's.</span> Depth, flirting, touch, plans — each step should match the energy she's giving back. If she opens up, meet her there. If she keeps it light, stay light and let it build. Scripted sequences ignore the person in front of you, and it shows.</p>
                <p><span className="font-bold text-gray-200">Read actual signals, don't project.</span> Interested looks like: she asks questions back, extends conversations, remembers your details, finds reasons to stay near. Polite looks like: short answers, no questions, exits when convenient. Believe the pattern, not the one ambiguous moment — and never argue with a no.</p>
                <p><span className="font-bold text-gray-200">Let her surprise you.</span> Curiosity about who she actually is — not a category of girl — is rare enough to be magnetic. The guys who connect are the ones who update what they think in real time instead of running a routine.</p>
              </div>
            </Collapsible>
            <Collapsible title="Nights Out — The Full Game Plan" tag="Bars, clubs, and how to actually talk to women out">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Logistics first.</span> Go earlier than the crowd (11pm energy is friendlier than 1am chaos), small group of 2-3 (big packs are unapproachable and distracting), and stay light on drink — 2 drinks of social lubricant, never sloppy. You cannot run any of this drunk.</p>
                <p><span className="font-bold text-gray-200">Warm up immediately.</span> Talk to EVERYONE for the first 30 min — bouncers, bartenders, groups of guys, everyone. You\'re not approaching yet; you\'re getting your social engine warm so the first real approach isn\'t cold.</p>
                <p><span className="font-bold text-gray-200">Positioning beats approaching.</span> Stand where traffic flows — near the bar, not hidden in a booth. Eye contact + smile at girls as they pass; if she holds it or looks back twice, that\'s your green light and half the work is done.</p>
                <p><span className="font-bold text-gray-200">Loud venue = simple and close.</span> Forget clever openers, they can\'t hear you. Warm smile, lean toward her ear: "I had to come say hi — I\'m Roy." Then physically position side-by-side (easier than shouting face-to-face).</p>
                <p><span className="font-bold text-gray-200">Handle the group.</span> Her friends decide your fate. Greet them early ("are you looking after her tonight? good"), win a smile from them, then turn back. Ignoring friends = friends extract her in 5 minutes.</p>
                <p><span className="font-bold text-gray-200">Move it somewhere quieter.</span> "It\'s way too loud here — let\'s grab a drink at the bar / get some air by the smoking area." Venue changes within the night build hours of comfort in minutes. Always an invitation, never a pull.</p>
                <p><span className="font-bold text-gray-200">Close honestly.</span> Number early once it\'s clearly on ("we\'re getting food this week — what\'s your number?"), because clubs eat conversations. If the vibe is instant, suggest the food spot after. And if she\'s hesitant at ANY step — smile, wish her a good night, exit like a king. The whole room notices how you handle a no.</p>
              </div>
            </Collapsible>
            <Collapsible title="The Emotional Rollercoaster" tag="Why 'nice and pleasant' gets forgotten">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">The principle: emotion is the memory glue.</span> People remember how you made them FEEL, and a range of feelings beats one pleasant note held for hours. A conversation that goes laughter → mock outrage → genuine depth → back to laughter is an experience; polite agreement is wallpaper. This isn't about hurting anyone — it's about being emotionally alive instead of flat.</p>
                <p><span className="font-bold text-gray-200">Contrast is the mechanism.</span> Tease her, THEN drop a sincere specific compliment — the sincerity lands 5× harder against the teasing backdrop. Be playfully disagreeable, then genuinely fascinated by her answer. All warmth = friend. All tease = clown. The switch between them = tension.</p>
                <p><span className="font-bold text-gray-200">Take her through emotional locations.</span> Within one conversation, visit: funny (banter, absurd hypotheticals), competitive ("you'd lose and you know it"), nostalgic ("what did tiny [her name] want to be?"), dreamy (travel, ambitions), conspiratorial (whispered judging of the room), sincere (one real moment). Each shift feels like time passing together — this is why one great conversation can feel like three dates.</p>
                <p><span className="font-bold text-gray-200">Push-pull, the clean version.</span> "You're actually terrible news… and I kind of like it." Push (playful distance) + pull (real interest) in one line. Use sparingly — one or two per conversation, always with a grin, never targeting real insecurities.</p>
                <p><span className="font-bold text-gray-200">Plan dates that ARE rollercoasters.</span> Adrenaline transfers: fast rides, scary films, spicy food challenges, competitive games — the arousal of excitement gets attributed to you (misattribution of arousal — real psychology). Structure: activity with energy → wind-down with depth. The date tells the emotional story so you don't have to force it.</p>
                <p><span className="font-bold text-gray-200">Absence is part of the ride.</span> An intense, brilliant evening followed by a quiet day is the rhythm that creates thinking-about-you. Constant contact flattens the wave (see Making Her Chase below).</p>
                <p><span className="font-bold text-gray-200">The hard line:</span> variance in FUN and DEPTH, never in respect or reliability. Hot-cold on "do I actually care about you" isn't a rollercoaster, it's manipulation, and it attracts anxious attachment, not love. Be a rollercoaster of experiences and a rock of character — that combination is rare and it's the whole formula.</p>
              </div>
            </Collapsible>
            <Collapsible title="Making Her Chase" tag="Scarcity that's real, not games">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">The principle: pursuit follows value + scarcity.</span> People chase what's valuable AND not fully available. Fake scarcity (ignoring texts on a timer) collapses the moment she gets bored; real scarcity — a genuinely full life — only gets more attractive the closer she looks. Build the real version.</p>
                <p><span className="font-bold text-gray-200">Actually be building something.</span> The gym, the football, the money skills, this whole app's contents — a man with a mission has natural slow replies because he's genuinely mid-set, mid-session, mid-work. "Sorry, was training" hits different when it's true and their Instagram confirms it. Purpose is the aphrodisiac; busyness is just its side effect.</p>
                <p><span className="font-bold text-gray-200">Reply pace: calibrated, not calculated.</span> Don't be glued to your phone answering in 30 seconds, and don't run a 3-hour timer either. Natural rhythm: respond when you actually surface from what you're doing. Quality of reply beats speed — one funny, specific message after 2 hours beats five instant "lol"s.</p>
                <p><span className="font-bold text-gray-200">End interactions first (sometimes).</span> Leave the conversation at its peak — "right, gym calls. Continue this Thursday." The person who ends the interaction on a high is the one who gets thought about. Never abruptly, never as punishment.</p>
                <p><span className="font-bold text-gray-200">Let her invest.</span> Chasing dies when you do 100% of the work. After you've led the start, leave space: let her text first sometimes, ask you questions, suggest the next plan. People value what they invest in — psychology 101. If you always fill every gap, there's nothing for her to reach for.</p>
                <p><span className="font-bold text-gray-200">Be visibly desired, quietly.</span> A social life with women friends, group photos, stories of a full life — pre-selection is the strongest attraction trigger there is. Never flaunt it at her or name-drop other girls; the signal works because it's ambient, not performed.</p>
                <p><span className="font-bold text-gray-200">Warmth when present, gone when gone.</span> The combination that creates chase: fully engaged, magnetic attention when you're with her — then genuinely absorbed in your life when you're not. Hot-present/cold-absent, not lukewarm-always. Constant mediocre contact kills more attraction than distance ever has.</p>
                <p><span className="font-bold text-gray-200">The line you don't cross:</span> all of this only works from abundance, not strategy-anxiety. If you're staring at your phone calculating minutes, you're chasing — just silently. Go train, go build, and let the fullness be real. And once she IS chasing and you like her — reward it. Punishing interest she shows is how you lose the ones worth keeping.</p>
              </div>
            </Collapsible>
            <Collapsible title="Getting a Girlfriend" tag="From dates to something real">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Screen, don\'t just chase.</span> You\'re choosing too. Watch for: how she treats waiters, whether she asks about you, reliability (does she flake?), how she talks about exes, whether her life has its own engine. Beauty gets someone dates; character gets them a relationship.</p>
                <p><span className="font-bold text-gray-200">Consistency is the courtship.</span> One date a week minimum, planned by you, escalating in depth: activity date → dinner → cooking at yours → meeting friends. Momentum with patience — rushing reads as scarcity, drifting reads as indifference.</p>
                <p><span className="font-bold text-gray-200">Depth trades build the bond.</span> Each date, exchange something realer: fears, family, ambitions, embarrassments. You lead the vulnerability, she matches. That ladder IS falling for each other.</p>
                <p><span className="font-bold text-gray-200">Be boyfriend material before asking for the title.</span> Emotional steadiness, keeping plans, remembering details, having your own mission (gym, money, football — this whole app). The relationship conversation goes well when it\'s obvious you\'re a catch committing, not a fan hoping.</p>
                <p><span className="font-bold text-gray-200">The exclusivity talk — direct, relaxed.</span> After 6-10 great dates when it\'s clearly mutual: "I\'m not interested in seeing anyone else — I want this to be us. What do you think?" No ultimatums, no hint-dropping. If she hesitates, don\'t negotiate; take it as information.</p>
                <p><span className="font-bold text-gray-200">Red flags override chemistry.</span> Contempt, chronic flaking, secret-keeping, punishing you with silence — attraction makes these easy to excuse and they only grow. Walking away early is a skill that saves years.</p>
              </div>
            </Collapsible>
            <Collapsible title="Intimacy — Doing It Right" tag="18+ · what actually matters in bed">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Consent and communication are the foundation — and they\'re attractive.</span> Enthusiastic yes at every stage, and check-ins that double as dirty talk ("you like that?"). A partner who clearly cares about her experience is rarer and hotter than any technique. If she\'s hesitant or drunk, the move is always to slow down or stop.</p>
                <p><span className="font-bold text-gray-200">Slow is the cheat code.</span> The #1 mistake is rushing. Kissing, neck, ears, inner thighs — build for far longer than feels necessary. Arousal for her is a slow curve, and the buildup decides everything that follows. Teasing (approaching, retreating) beats grabbing.</p>
                <p><span className="font-bold text-gray-200">Fingering — technique over enthusiasm.</span> Start outside: the clitoris is the centre of her pleasure, not the inside. Gentle circles over/around it, light pressure first, through underwear before under. Wetness first, always — if she\'s not, more kissing and buildup, never force. Inside: one finger, then two, pads facing upward with a slow "come here" curl toward the front wall (the spongier area a couple of inches in) while your palm or thumb keeps contact with the clit. <span className="text-gray-300">Rhythm and consistency beat speed and force</span> — when something makes her respond, keep doing exactly that; changing it up at the peak is the classic error.</p>
                <p><span className="font-bold text-gray-200">Read her, not a script.</span> Breathing quickening, hips moving toward you, hands pulling you in = continue. Stillness, tensing up, pulling back = change or pause and check in softly. Her body gives constant feedback; the skill is listening.</p>
                <p><span className="font-bold text-gray-200">Sex itself — pace and presence.</span> Start slower than you think, full attention on her reactions. Angles matter more than speed: positions where she controls depth (her on top) or where there\'s clitoral contact/access (a hand or hers during) are how most women actually finish — penetration alone often isn\'t. Deep, consistent rhythm when she\'s building; don\'t sprint-finish the moment it feels good for you.</p>
                <p><span className="font-bold text-gray-200">Lasting longer.</span> Slow your breathing (long exhales), vary pace before you\'re at the edge not after, switch positions to reset, and focus on her. Kegels and less frequent, slower self-pleasure train control. Nerves cause most early finishes — experience and comfort fix more than any trick.</p>
                <p><span className="font-bold text-gray-200">Aftercare is part of it.</span> The minutes after — staying close, warmth, no phone-grab — are what she remembers and retells. Cold exits undo everything the rest did.</p>
                <p className="text-gray-600">Protection every time until you\'re exclusive and tested — condoms are non-negotiable with new partners. This is the confident-guy move, not the buzzkill.</p>
              </div>
            </Collapsible>
            <Collapsible title="Numbers, Dates & Momentum" tag="Closing without weirdness">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Ask at the peak,</span> not the fizzle: "I need to run — but I want to continue this. What's your number?" Assumptive, warm, simple.</p>
                <p><span className="font-bold text-gray-200">Text with purpose.</span> Callback to your conversation within a day ("found the song you butchered at karaoke"), then propose something concrete: day, time, place. Endless texting kills momentum.</p>
                <p><span className="font-bold text-gray-200">Plan dates that create stories.</span> Walk + street food + a view beats a staring contest over dinner. Movement and novelty do the bonding for you.</p>
                <p><span className="font-bold text-gray-200">If she's hesitant or goes quiet — release gracefully.</span> "No stress at all — enjoy your week." Chasing communicates scarcity; grace communicates options. And it's just the right way to treat people.</p>
              </div>
            </Collapsible>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
