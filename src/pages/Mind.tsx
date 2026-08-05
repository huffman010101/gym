import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Brain, Flame, MessageCircle, Lock, Unlock, Sparkles, Mic2, Eye, ChevronDown, Heart, BookOpen, ListChecks, Compass } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DailyHabits from '../components/DailyHabits';
import MorningRoutine from '../components/MorningRoutine';
import NightRoutine from '../components/NightRoutine';
import HighValue from '../components/HighValue';
import Security from '../components/Security';

type Tab = 'code' | 'security' | 'charisma' | 'highvalue' | 'aura' | 'stoic' | 'icons' | 'confidence' | 'focus' | 'morning' | 'night' | 'selftalk' | 'secret';

const TABS: { id: Tab; label: string }[] = [
  { id: 'code', label: 'The Code' },
  { id: 'security', label: 'Security' },
  { id: 'charisma', label: 'Charisma' },
  { id: 'highvalue', label: 'High Value' },
  { id: 'aura', label: 'Aura' },
  { id: 'stoic', label: 'Stoic' },
  { id: 'icons', label: 'Icons' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'focus', label: 'Focus & Discipline' },
  { id: 'morning', label: 'Morning Routine' },
  { id: 'night', label: 'Night Routine' },
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
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = params.get('tab');
    return (['code', 'security', 'charisma', 'highvalue', 'aura', 'stoic', 'icons', 'confidence', 'focus', 'morning', 'night', 'selftalk', 'secret'] as const).includes(t as Tab) ? (t as Tab) : 'code';
  });
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
    <main className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-pink-950/40 via-[#0a0a0a] to-[#0a0a0a] text-white pb-24">
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

        <DailyHabits section="mind" />

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

        {/* ============ THE CODE (whole-section takeaway) ============ */}
        {tab === 'code' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Compass size={16} className="text-pink-400" /> The Code — one page, the whole section</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Twelve tabs is a lot to hold in your head. This is exactly one line per tab — the single highest-leverage
                move from each, nothing skipped and nothing doubled up. Everything else in Mind is the deeper version of
                one of these twelve.
              </p>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <div className="space-y-4">
                {[
                  ['Keep your word to yourself', 'Said you\'d train at 7, train at 7. From Security — every kept promise is a deposit, every broken one a withdrawal, and your self-belief is just the balance.', 'Security'],
                  ['Listen like it\'s the only thing happening', 'Full eye contact, phone away, use their name, react to what they actually said. From Charisma — this single habit does more for how people experience you than anything else in this section.', 'Charisma'],
                  ['Your life is the actual source, not a technique', 'Body, frame, warmth are all downstream of what you\'re actually building. From High Value — non-neediness can\'t be performed, it\'s a by-product of a genuinely full week.', 'High Value'],
                  ['Speak less, let output answer for you', 'Say 70% of what you could. Don\'t announce plans, reveal results. From Aura — restraint reads as more secure than any amount of explaining.', 'Aura'],
                  ['The sacred pause', 'One slow breath between what happens and how you respond. From Stoic — this is where every regrettable text, outburst and bad decision gets stopped before it happens.', 'Stoic'],
                  ['How you lose is your real reputation', 'Grace under a bad result outlasts almost every win. From Icons — Federer\'s whole legend is built on this one trait.', 'Icons'],
                  ['Do one scared thing daily', 'A hard conversation, a cold finish, a rejection risked on purpose. From Confidence — courage precedes confidence, never the reverse, so this is the actual rep.', 'Confidence'],
                  ['Effort before reward, no exceptions', 'Phone after the work block, not before. From Focus & Discipline — motivation follows action, it never leads it, and this single sequencing rule rewires the rest.', 'Focus & Discipline'],
                  ['Win the first hour, phone-free', 'Feet on the floor, water, light outside, then a real deep work block. From Morning Routine — this sets the ceiling on how the whole day goes before it\'s properly started.', 'Morning Routine'],
                  ['Phone leaves the room 30 minutes before lights out', 'Every night, no exceptions. From Night Routine — this is the one step the rest of the wind-down actually depends on.', 'Night Routine'],
                  ['Talk to yourself like a coach, not a critic', 'Catch the thought, name it, reframe it — in second person. From Self-Talk — "you\'ve got this" measurably outperforms "I\'ve got this" because it creates distance from the emotion.', 'Self-Talk'],
                  ['Hold your frame', 'Your version of reality doesn\'t move because someone tested it. From Secret — the concept underneath everything else in that section, and the one that generalises furthest beyond it.', 'Secret'],
                ].map(([t, d, from], i) => (
                  <div key={t} className="flex gap-3">
                    <span className="text-pink-400/70 font-black text-sm mt-0.5 w-5 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-200">{t}</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400/50 flex-shrink-0">{from}</span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/15 to-[#111] border border-pink-500/30 rounded-2xl p-5">
              <h3 className="font-bold text-pink-300 mb-2">How to actually use this</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Don't try to run all twelve at once — that's how nothing sticks. Pick the one that's the biggest gap for
                you right now, run it for a month until it's automatic, then add the next. Same rule the Icons tab
                gives for absorbing a trait from someone you admire: one at a time, actually installed, beats twelve
                held loosely.
              </p>
            </div>
          </div>
        )}

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
            <Card icon={MessageCircle} title="How to Be Funny (it's mechanics, not magic)" items={[
              ['Funny = truth + exaggeration or truth + unexpected angle', 'Notice the true absurd thing everyone half-sees, then push it further ("this gym playlist was chosen by someone going through something") or flip the frame. Observation is 80% of comedy — train it by narrating life absurdities in your head.'],
              ['Commit fully or don\'t', 'A bit delivered at 100% conviction lands; the same line mumbled with a pre-apology dies. If you start a joke, ride it to the end — even a miss committed to reads as confidence.'],
              ['Timing: pause BEFORE the punchline', 'The half-second beat is what makes lines land. Rushing to the punchline because you\'re nervous kills more jokes than bad material.'],
              ['Callbacks are cheat codes', 'Referencing the group\'s earlier joke ("this is the gym playlist guy all over again") gets bigger laughs than new material — it rewards the group\'s shared history.'],
              ['Self-deprecation: small doses, from height', 'Mocking your own small flaws from obvious confidence = charming. Constantly putting yourself down = the group\'s designated target. Ratio: 1 self-jab per 5 outward observations, never about things you\'re actually insecure about.'],
              ['Steal structure, not jokes', 'Watch stand-ups and funny mates for HOW they build (setup economy, act-outs, escalation), not lines to repeat. Repeated jokes land once; mechanics land forever.'],
            ]} />
            <Card icon={Mic2} title="Delivering It — the voice half of funny" items={[
              ['Drop pace before the punchline, not after', 'Speed up slightly through the setup, then slow right down for the last few words. The change in rhythm itself signals "this is the important part" before people have even processed the words — it\'s why the same line lands harder slowed down.'],
              ['Drop pitch and volume on the punchline, don\'t raise it', 'The instinct when nervous is to get louder and higher to "sell" the joke — it reads as trying. A punchline delivered slightly quieter and lower than the setup reads as effortless, which is funnier than effort every time.'],
              ['Let the pause do the work, then hold your face still', 'After the line lands, resist the urge to laugh at your own joke or add a follow-up explaining it. A flat, slightly amused expression while everyone else reacts is what a comedian calls "holding" — it\'s the difference between a line that gets a laugh and one that gets a bigger laugh.'],
              ['Act-outs beat descriptions', 'Instead of "he was so nervous," briefly BE the nervous person — the voice, the fidget, the face — for two seconds, then snap back to your normal voice. A three-second impression lands harder than a well-worded description of the same thing.'],
              ['Deadpan needs a flat delivery to work', 'If the line is absurd, keep your voice completely normal — mismatch between calm delivery and ridiculous content IS the joke. Smiling or over-emphasising while saying something deadpan kills it; let the words do the surprising.'],
              ['Match energy to the room, not to your nerves', 'A quiet room needs a quieter, more controlled delivery; a loud one needs more projection. Reading the room\'s volume and matching it (rather than just going louder because you\'re nervous) is what separates landing a joke from talking over people.'],
            ]} />
            <Card icon={Heart} title="Your Laugh — the most contagious sound you make" items={[
              ['A real laugh is felt before it\'s heard', 'The tell of a genuine laugh is that it starts in the chest/stomach and catches you slightly off guard — a small exhale or "huh" before the sound fully arrives. A performed laugh starts already at full volume with no build, and people register the difference instantly even if they can\'t say why.'],
              ['Let your face move first', 'Genuine amusement shows in the eyes and cheeks a half-second before any sound — practice letting your face react honestly to things that are actually funny rather than jumping straight to a noise. The sound without the face reads as fake.'],
              ['Volume: match, don\'t dominate', 'A laugh loud enough that it takes over the room reads as needing the moment to be about you. Loud when something\'s genuinely hilarious is fine — loud as your default setting isn\'t. Let the material set the volume, not habit.'],
              ['The lower register is more likable, not the highest one', 'An unforced laugh usually sits lower and rougher than the polite, high, closed-mouth version most people default to in professional settings. Practice: the next time something is actually funny alone, notice what your real laugh sounds like — that\'s the one to bring into groups, not the safe version.'],
              ['Fix a fake laugh by fixing what you find funny', 'A forced laugh usually isn\'t a voice problem, it\'s an honesty problem — laughing at things that aren\'t actually funny to be polite. The fix isn\'t performing a better fake laugh, it\'s only laughing at what\'s genuinely landing, which makes the laughs that do happen read as real because they are.'],
              ['A great laugh is a compliment other people chase', 'People who make you laugh easily and audibly keep talking to you, because your laugh is rewarding to earn. A stingy, controlled laugh (or a fake one) gives nothing back — being easy to delight, genuinely, is charisma fuel most men underrate.'],
            ]} />
            <Card icon={Eye} title="Group Status — never the punching bag" items={[
              ['Why groups test you', 'Every group playfully probes for who can be teased hardest. The test isn\'t the joke — it\'s your response. Pass the test and it stops; fail repeatedly and it becomes your role. Roles calcify fast, so respond right EARLY.'],
              ['The response ladder', 'Level 1 — laugh WITH genuinely and add to it ("mate you\'ve been saving that one all week"). Level 2 — agree and amplify to absurdity ("yeah I sleep in my gym clothes, saves time"). Level 3 — flip it back with a smile, once, clean. Never: visible hurt, over-explaining, or silent sulking — those feed it.'],
              ['Amused, never wounded', 'The unbotherable guy is untouchable. The moment teasing visibly lands, you\'ve taught the group where the button is. If something genuinely crosses a line, address it once, privately, calm: "the X stuff — done with it." Calm directness ends what reactions escalate.'],
              ['Give status to get status', 'High-status group members bring others in: set up mates\' stories ("tell them about Saturday"), laugh loudly at others\' jokes, remember details. The guy who makes the group work is above the pecking order, not in it.'],
              ['Don\'t compete for every laugh', 'Trying to top every joke reads as thirsty. Land your moments, let others have theirs. Scarcity applies to humour too.'],
              ['Never punch down, rarely punch first', 'Tease the confident mates, never the struggling one. Groups clock cruelty instantly and it costs more status than it wins laughs.'],
            ]} />
            <Card icon={MessageCircle} title="Text Game — What the Different Moves Actually Signal" items={[
              ['Reply speed says more than words', 'Instant replies (under a minute, always) read as: nothing else going on, low value on your time. Calibrated replies (minutes to a few hours, varies naturally) read as: you have a life. Deliberately slow, scheduled replies read as a game — most people clock it and it repels more than it attracts.'],
              ['Double texting: dead vs alive', 'A second text that ADDS something (a new thought, a joke, a plan) is fine and often good — it shows you\'re thinking about them. A second text that just chases a reply ("hello??", "you there?") signals anxiety and should never happen. Test: does this message stand alone with something new, or is it just asking "why haven\'t you replied"?'],
              ['Slow replies aren\'t always disinterest', 'People read a 6-hour gap as rejection when it\'s often just someone living their life. The fix isn\'t decoding gaps like tea leaves — it\'s not over-indexing on any single data point. Look at the PATTERN over a week, not any one delay.'],
              ['Message length should roughly mirror', 'If they\'re sending one-liners, matching their effort avoids looking over-invested. If they\'re writing paragraphs, matching that shows engagement. Wildly mismatched effort (their essay, your "lol") reads as disinterest even if you\'re just busy.'],
              ['Every message should do a job', 'A question, a joke, or a plan — never just filler to keep a thread alive. "Haha yeah" with nothing added is the moment to either ask something real or suggest doing something instead of texting about it.'],
              ['The real skill: not needing the reply', 'Whether you get a fast reply or a slow one shouldn\'t change your mood. The moment you\'re checking your phone waiting, you\'ve handed them your state. Text well, then go live your life — the phone will still be there.'],
            ]} />
            <Card icon={Sparkles} title="High-Value Traits at Uni" items={[
              ['Be the reliable one', 'Show up when you say you will, deliver on group work, remember what people told you. In an environment full of flakes, consistency alone puts you in the top 10%.'],
              ['Have a visible thing you\'re building', 'Gym, a side hustle, a sport, a skill — something people can see you\'re serious about beyond lectures and nights out. A direction is more attractive than good banter alone; it signals you\'re going somewhere.'],
              ['Know people across groups, not just your clique', 'The guy who says hi to people outside his friend group — sports teams, societies, different years — reads as secure and well-connected. Cliquey behaviour reads as small and insecure, even when it isn\'t meant to.'],
              ['Skip the performance, keep the standards', 'You don\'t need to be out every night to be liked — you need to be good company when you ARE out, and have a life outside it the rest of the time. Missing things sometimes because you\'re training or working builds more respect than being everywhere.'],
              ['Handle group dynamics with ease, not anxiety', 'Deadlines, flatmate drama, society politics — the guy who stays level while everyone else spirals becomes the one people go to. Composure under normal uni chaos is a status signal nobody can fake for long.'],
              ['Don\'t need the story to be about you', 'Let others have the floor, bring people into conversations, remember details about people who aren\'t "important." The guy who makes everyone feel included is remembered more fondly than the loudest guy in the room.'],
            ]} />
            <Card icon={Heart} title="Making Anyone Feel Comfortable" items={[
              ['Lower the temperature first', 'People arrive slightly guarded. A relaxed tone, a genuine smile, and an easy opener ("mad day or good day?") signals it\'s safe to drop the guard before you ask for anything real.'],
              ['Match their energy, then lead it gently up', 'Meeting someone quiet with loud energy overwhelms them; meeting someone loud with flat energy falls flat. Start where they are, then bring warmth up a notch — people follow calibrated energy, not mismatched energy.'],
              ['Give them the floor', 'Ask about them, then actually stop talking. Most people are starved for someone who listens without waiting to speak. Comfort is mostly the absence of feeling rushed or judged.'],
              ['No sudden judgement, ever', 'The fastest way to make someone guarded is a visible reaction of surprise or disapproval to something they share. Neutral, curious face — "tell me more" — keeps people opening up instead of clamming shut.'],
              ['Use their name and specifics', 'Saying someone\'s name and referencing something they said earlier makes people feel individually seen rather than processed. It\'s a small move with an outsized effect.'],
              ['Physical ease helps', 'Relaxed posture, open body, normal distance (not looming, not distant), unhurried movement. People\'s nervous systems read your body before your words — a tense host makes for a tense guest.'],
              ['Fill silence with patience, not pressure', 'If someone\'s shy or slow to open up, a comfortable silence beats a barrage of questions. Rushing someone to open up has the opposite effect — ease invites more than pressure ever does.'],
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
            <Card icon={Eye} title="Becoming Unreadable & Mysterious" items={[
              ['Emotion felt, not broadcast', 'Unreadable doesn\'t mean cold — it means your face and voice don\'t leak every internal reaction in real time. Feel the surprise, the hurt, the excitement fully — then choose a measured response instead of an instant one. The gap between feeling and showing IS the mystery.'],
              ['Give information, not narration', 'Answer what\'s asked, don\'t volunteer the surrounding story. "Good weekend, you?" beats a 4-sentence recap. People fill silence with curiosity about you — talkers fill it for them and empty the tank.'],
              ['Nobody gets the full picture', 'Different people know different slices of your life — one knows your training, another your work, another your family stuff. Nobody has the complete file. This isn\'t deception, it\'s just not narrating your whole life to everyone who asks.'],
              ['React late, react less', 'Let a beat pass before responding to news, jokes, or provocations. Instant, big reactions are readable and give away exactly what buttons exist. A slow, measured "interesting" gives away nothing.'],
              ['Keep one or two things entirely private', 'A goal, a relationship, a plan you\'re building — something that\'s just yours, not for group consumption. Having a private layer is what makes people sense there\'s more to you, because there genuinely is.'],
              ['Ask questions instead of answering fully', 'When someone probes, redirect with warmth: "why do you ask?" or answer a fraction then pivot to them. Not evasive — just never fully an open book. People find what they can\'t fully read more interesting, not less.'],
              ['Predictability kills mystery', 'Vary your routine\'s visible parts — don\'t announce every plan, don\'t always give the same reaction to the same joke. A man who\'s slightly unpredictable stays interesting; a man who\'s a known quantity gets ignored.'],
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

        {/* ============ STOIC ============ */}
        {tab === 'stoic' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Brain size={16} className="text-pink-400" /> Stoicism — the Operating System</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Marcus Aurelius ran an empire on this. Seneca advised one. Epictetus taught it as a freed slave.
                It isn't suppressing emotions or being cold — it's <span className="text-gray-200 font-semibold">feeling everything and being commanded by nothing</span>.
                The core: some things are in your control (your judgements, responses, effort, character), everything else isn't
                (others' opinions, outcomes, the past, the weather). Spend your energy exclusively on the first list.
              </p>
            </div>
            <Card icon={Flame} title="Controlling Emotions — the actual mechanics" items={[
              ['Emotions are data, not commands', 'Anger, fear, jealousy, desire — all information about what you value. Feel it fully, read it, THEN decide the response. The untrained man IS his emotions; the trained man HAS them.'],
              ['The sacred pause', 'Between what happens and how you respond there is a gap — that gap is your whole power. Practice: when triggered, one slow breath before any word or action. The pause is where every regrettable text, punch and outburst dies.'],
              ['Name it to tame it', 'Literally label the emotion in your head: "this is anger", "this is embarrassment". Naming shifts activity from the amygdala (react) to the prefrontal cortex (choose) — proven in brain imaging. Sounds too simple; works every time.'],
              ['The body is the volume dial', 'Emotions live in physiology. Slow long exhales (double the inhale), unclench the jaw, drop the shoulders — you cannot stay furious with a slow heart rate. Regulate the body and the mind follows.'],
              ['It\'s the judgement, not the event', '"Men are disturbed not by things, but by their opinions about things" — Epictetus. Traffic isn\'t stressful; "I must not be late" is. Find the judgement under the emotion and question it — half of them collapse on inspection.'],
              ['The 10-10-10 test', 'Will this matter in 10 minutes? 10 months? 10 years? Most storms fail the second question. Respond at the scale the thing actually deserves.'],
              ['Never act at the peak', 'Make no decisions, send no messages, have no confrontations at maximum emotion. The rule: strong feeling = automatic 24h delay on anything irreversible. You\'ll keep the same options with a clearer head.'],
            ]} />
            <Card icon={Brain} title="The Great Stoic Lessons" items={[
              ['Amor fati — love your fate', 'Don\'t just tolerate what happens — use it. Every setback is training material: rejection trains detachment, loss trains gratitude, failure trains humility. "The impediment to action advances action. What stands in the way becomes the way." — Marcus Aurelius.'],
              ['Memento mori — remember you die', 'Not morbid — clarifying. You have limited days; acting like they\'re infinite is how men waste decades on games, grudges and scrolling. Ask daily: if this were a numbered day, is this how I\'d spend it?'],
              ['Premeditatio malorum — rehearse the worst', 'Before big things, calmly imagine them going wrong: she says no, you fail the exam, the business flops. Two effects: the fear shrinks when examined, and you\'re prepared instead of shocked. Then the actual outcome is usually better than rehearsed.'],
              ['Voluntary discomfort', 'Cold showers, fasting till dinner, sleeping on the floor occasionally, hard training. Seneca practised poverty days on purpose: "Is this the condition I so feared?" Comfort is a drug; regular hardship keeps your baseline unbreakable.'],
              ['The view from above', 'Zoom out: you\'re one man in a city of millions on a rock in space. The embarrassing moment nobody will remember, the argument that means nothing — perspective is instant emotional medicine.'],
              ['Judge yourself only on what you control', 'Effort, preparation, character, response — yours. Results, opinions, luck — not yours. A man who grades himself on inputs is unshakeable; a man who grades himself on outcomes is a slave to dice.'],
              ['The evening review', 'Seneca\'s nightly practice: What did I do well? Where did I fail my standards? What will I do differently? Three questions, three minutes, compounding self-command. (Pairs with the 3 wins log in the tracker.)'],
            ]} />
            <Card icon={Heart} title="Being a Man — the code" items={[
              ['Strength exists to protect', 'The whole point of building a dangerous, capable body and mind is having it and choosing gentleness. A strong man is safe to be around — his family relaxes when he enters the room, not tenses.'],
              ['Your word is the whole currency', 'Say what you\'ll do, do what you said — to others and to yourself. A man whose word is reliable needs no reputation management; his track record IS the reputation.'],
              ['Take radical responsibility', 'Your body, your money, your reactions, your failures — yours, even when circumstances contributed. "Whose fault is it?" is a boy\'s question. "What do I do now?" is a man\'s.'],
              ['Handle hard things quietly', 'Do the difficult thing without announcing the difficulty. Complaining recruits an audience for your suffering; acting recruits a solution. People notice the man who just handles it.'],
              ['Protect the smaller, respect the weaker', 'How you treat waiters, children, animals, and people who can do nothing for you is your actual character. Cruelty-down is the most reliable red flag in men; kindness-down is the most reliable green one.'],
              ['Emotions felt in private, composure held in public', 'Not suppression — timing. Cry, rage, grieve fully — with people you trust or alone, then return composed. The men people lean on have feelings AND a container for them.'],
              ['Build more than you consume', 'A man\'s ledger: what did you create, teach, fix, and provide vs what did you take, watch, and scroll? Keep the first column longer, forever.'],
              ['Standards over moods', 'Train when unmotivated, work when tired, kind when irritated. Moods are weather; standards are climate. The entire difference between men you respect and men you don\'t is which one they obey.'],
            ]} />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-pink-300">Daily Stoic Practice — 10 minutes</h3>
              <div className="space-y-2">
                {[
                  ['Morning (3 min)', 'Read one Stoic passage (Meditations, or the Daily Stoic) + premeditate the day\'s hardest moment and choose your response in advance.'],
                  ['Midday (1 min)', 'One voluntary discomfort: cold finish to the shower, skip the snack, take the stairs, hold the tongue.'],
                  ['During the day', 'The sacred pause on every trigger. Name the emotion. Ask: in my control or not? Act only on the first category.'],
                  ['Evening (3 min)', 'Seneca\'s review: what went well, where did I fail my code, what changes tomorrow. Write it — thinking it doesn\'t count.'],
                  ['Reading list', 'Meditations (Marcus Aurelius, Gregory Hays translation) · Letters from a Stoic (Seneca) · The Daily Stoic (Holiday) · Discourses (Epictetus). One page a day beats a binge.'],
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

        {/* ============ ICONS ============ */}
        {tab === 'icons' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={16} className="text-pink-400" /> Steal Like an Artist</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every man people love has a specific, learnable signature. Don't copy the whole person — extract the ONE
                trait that makes them magnetic and install it. Below: the icon, why people love them, and the exact thing to take.
              </p>
            </div>
            {[
              ['David Beckham', 'Beloved for: relentless grooming + soft-spoken humility despite mega-fame.', 'Three decades in front of cameras and paparazzi and there is barely a scruffy photo of him — that is not luck, it is a standard he never drops even off-duty. He also lets his career do the talking; you\'d struggle to find him hyping himself in an interview.', 'Take: the grooming standard — never once caught scruffy in 30 years — and the trick of letting achievements talk while you stay understated. Quiet + immaculate is a devastating combo.'],
              ['Cristiano Ronaldo', 'Beloved for: the most public work ethic in sport. Nobody questions whether he earned it.', 'Teammates across three different countries have said the same thing independently: he is always first in and last out. His body at 40 versus most players at 40 is the entire argument for consistency over talent.', 'Take: the routine IS the identity — sleep, training, diet, recovery, non-negotiable. And his answer to doubters: no speeches, just scoreboard. Let output be your response to everything.'],
              ['Ryan Reynolds', 'Beloved for: quick wit that never punches down; self-deprecation from obvious confidence.', 'His own marketing (Aviation Gin, Mint Mobile) is built almost entirely on him mocking himself first — which is why the jokes land instead of feeling like a brand talking down to you.', 'Take: his humour formula — deadpan delivery, jabs at himself before anyone else can, warmth under every roast. Proof that funny + kind beats funny + cruel every time.'],
              ['Daniel Craig\'s Bond', 'Beloved for: total composure — economy of words and movement under chaos.', 'Watch any scene under pressure: minimal facial movement, no wasted motion, and when he does react it\'s small and deliberate. The stillness reads as more dangerous than any amount of shouting would.', 'Take: the physical stillness. No fidgeting, no rushing, no nervous laughter. Speak 30% less, move 30% slower, react 30% later. (Full breakdown in the Aura tab.)'],
              ['David Gandy', 'Beloved for: proof that classic beats trendy — the most successful male model ever, mostly in timeless tailoring.', 'Two decades in and his signature look (well-cut suits, classic grooming) hasn\'t chased a single trend cycle — which is exactly why it hasn\'t dated either.', 'Take: find your 3-4 signature looks and repeat them relentlessly. A signature style compounds recognition; chasing trends resets you to zero every season.'],
              ['Michael B. Jordan', 'Beloved for: physique discipline paired with visible enjoyment of life — intense yet warm.', 'Interviews about his brutal training regimes are consistently followed by him laughing, joking, clearly enjoying himself — the discipline never curdles into misery, which is what makes people want it rather than pity it.', 'Take: intensity with a smile. Train like it\'s war, carry it like it\'s easy. The lightness AFTER the discipline is what people find magnetic.'],
              ['Roger Federer', 'Beloved for: grace in victory AND defeat — two decades without a public tantrum.', 'His 2009 Australian Open runner-up speech — crying, composed, generous to the winner in the same breath — is still cited as the standard for how to lose in public.', 'Take: how you lose is your reputation. Losing a point, a match, a girl, a deal with class is remembered longer than most wins. (Pairs with the rejection-grace rule in Secret.)'],
              ['Keanu Reeves', 'Beloved for: genuine humility and kindness to everyone regardless of status.', 'Decades of stories from crew members, drivers and strangers — never solicited by him, always volunteered by them — describe the same private generosity. The reputation exists because he never tried to build one.', 'Take: how you treat waiters, drivers and juniors IS your character in everyone\'s eyes. The quiet-generosity reputation is built in moments nobody\'s supposed to see — which is exactly why everyone hears about it.'],
              ['Nick Nayersina', 'Beloved for: reading the room and the person in front of him better than almost anyone in his space — presence and emotional intelligence over volume.', 'Left the NELK crew and rebuilt on his own terms, staying genuinely close with people like SteveWillDoIt without needing the group to matter — proof a good reputation travels with the person, not the crew he came from.', 'Take: presence over performance. He is rarely the loudest person in a room — he is the one actually listening, tracking how someone is really feeling, and responding to that instead of running a bit. Emotional intelligence is the hardest trait on this list to fake, which is exactly why it is the rarest one worth genuinely building.'],
            ].map(([name, why, detail, take]) => (
              <div key={name as string} className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h3 className="font-bold text-pink-300 mb-1">{name as string}</h3>
                <p className="text-gray-400 text-sm mb-2">{why as string}</p>
                <p className="text-gray-600 text-xs leading-relaxed mb-2 italic">{detail as string}</p>
                <p className="text-gray-500 text-sm leading-relaxed"><span className="text-gray-300 font-semibold">{(take as string).split(':')[0]}:</span>{(take as string).split(':').slice(1).join(':')}</p>
              </div>
            ))}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold mb-2">How to actually use this</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Pick ONE icon whose gap matches yours (fidgety? Craig. Scruffy? Beckham. Too harsh? Reynolds. Sore loser? Federer. Talk more than you listen? Nayersina).
                Study 20 minutes of their interviews watching for the trait, then run it for a month until it\'s yours.
                One trait at a time — a collage of impressions is a costume; one absorbed trait is character.
              </p>
            </div>
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
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-xs leading-relaxed">
                Feeling no drive to start things is usually a dopamine problem, not a confidence problem — that full
                breakdown (the 14-day detox, deep work, why motivation never comes first) lives in the
                <span className="text-pink-300 font-semibold"> Focus & Discipline</span> tab so it's covered once, properly.
              </p>
            </div>
            <Card icon={Flame} title="Approval-Seeking Detox" items={[
              ['Spot the leaks first', 'Checking who liked your story, rephrasing opinions mid-sentence when someone frowns, laughing at unfunny jokes, saying "yeah" to plans you hate, posting then monitoring. These are approval leaks — each one trains your brain that other people hold your remote control.'],
              ['The core reframe', 'People\'s reactions to you are mostly about THEM — their mood, their day, their insecurities. You\'re a background character in everyone else\'s film. This isn\'t sad, it\'s freedom: the audience you\'re performing for isn\'t even watching.'],
              ['Opinion reps', 'State small preferences plainly, daily, without softening: "I don\'t rate that film." No "haha idk maybe it\'s just me though". Disagreement survived = evidence you don\'t need consensus to be fine.'],
              ['Do things without broadcasting', 'Train, read, build for a month without posting any of it. Decoupling achievement from announcement rewires WHO the achievement was for.'],
              ['The 24-hour test', 'Before chasing any validation (rewording a text 5 times, fishing for a compliment), ask: will this person\'s approval matter in 24 hours? A year? Almost nothing passes the test.'],
              ['Approval comes back inverted', 'The brutal irony: needing approval repels it, indifference attracts it. People sense which one you are within minutes. Fix the need and the approval arrives unrequested — at which point you won\'t need it.'],
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

        {/* ============ FOCUS & DISCIPLINE ============ */}
        {tab === 'focus' && (
          <div className="fade-up stagger space-y-4">
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Brain size={16} className="text-pink-400" /> Why You Feel Groggy and Scroll Instead of Working</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                It's not laziness, it's a dopamine economy problem. Short-form content, porn, junk food and gaming deliver huge,
                effort-free dopamine spikes constantly — next to that, deep work and hard tasks feel like they pay in pennies,
                so your brain rationally avoids them. The fix isn't more willpower; it's resetting the baseline so real effort
                feels rewarding again. Everything below is that reset, in order.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/15 to-[#111] border border-pink-500/30 rounded-2xl p-5">
              <h3 className="font-black mb-1 flex items-center gap-2 text-pink-300"><Flame size={16} /> Uncook Your Brain</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                Ten rules. Not a program, not a phase — just how you live. Do these and the fog lifts within about two weeks.
              </p>
              <div className="space-y-3">
                {[
                  ['No music in the shower', 'Sit with your own thoughts. If every quiet moment is filled with audio you never actually process anything — the shower is where ideas surface.'],
                  ['Wake up to sunlight, not your phone', 'Light in your eyes within 30 min sets your body clock. Phone first thing spikes dopamine before you\'ve earned anything, and the whole day feels flat by comparison.'],
                  ['No gooning', 'Porn is the single biggest artificial dopamine hit available on demand. Cutting it moves your drive, focus and confidence more than anything else on this list.'],
                  ['Chill with the short-form', 'You don\'t have to quit forever — but 20 minutes of scrolling rewires what "interesting" feels like. Cap it, and never before a work block.'],
                  ['One task, phone in another room', 'Not face down. Not on silent. Another room. Proximity beats willpower every single time.'],
                  ['Go 100% in or don\'t bother', 'Half-focused work for 3 hours is worse than 45 fully locked-in minutes. Decide which one you\'re doing before you start.'],
                  ['Walk without headphones', '20 minutes, no input. This is when your brain files things away and solves the problems you were stuck on.'],
                  ['Eat one meal a day with no screen', 'Nothing else happening. Trains the ability to just be present, which is the whole skill underneath all of this.'],
                  ['Boredom is the point', 'That restless itch when you put the phone down IS your baseline recovering. Sit in it instead of reaching — it passes faster than you think.'],
                  ['No phone first or last 30 min of the day', 'These two windows set your daily baseline and your sleep quality. Protect them and everything else gets easier.'],
                ].map(([t, d], i) => (
                  <div key={t} className="flex gap-3">
                    <span className="text-pink-400/70 font-black text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-200">{t}</p>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card icon={Brain} title="The Dopamine Detox — a real 14-day protocol" items={[
              ['What you\'re actually detoxing', 'Not dopamine itself (you\'d die — it drives all motivation) but the CHEAP, high-frequency sources: short-form video, porn, junk food, gaming, random browsing. You\'re lowering the noise floor so normal life registers as rewarding again.'],
              ['Days 1-4 — withdrawal (expect this)', 'Delete or screen-time-lock TikTok/Reels/Shorts, no porn, phone stays outside the bedroom, no snacking between meals. You WILL feel restless, grey, and bored — that\'s receptors healing, not depression. Do not quit here; this is the part that works.'],
              ['Days 5-9 — the flat zone', 'Boredom peaks, then starts lifting. Fill freed time with training, walking, reading, and people — not another screen. Journaling what you notice (energy, sleep, urges) keeps you honest about progress you can\'t feel day-to-day.'],
              ['Days 10-14 — the payoff', 'Normal activities — a conversation, a workout, a boring lecture — start generating real interest again. This is the point of the whole protocol: hard, valuable things become startable without dragging yourself.'],
              ['What stays in, the whole time', 'Training, reading, real conversations, sunlight, music/podcasts while moving. You\'re cutting the cheap dopamine, not living like a monk — the detox targets specific sources, not all pleasure.'],
              ['After day 14 — controlled reintroduction', 'Add things back ONE at a time, with a rule attached (e.g. short-form only after the day\'s deep work block is done). If a reintroduced habit creeps back to compulsive, cut it again for a week. This is maintenance forever, not a one-time fix.'],
            ]} />
            <Card icon={Flame} title="Mastering Dopamine — the operating rules" items={[
              ['Effort BEFORE reward, always', 'Phone after the work block, dessert after the meal, scroll after the study session. Sequencing alone retrains the brain that effort precedes reward — the exact wiring "lazy" brains have backwards.'],
              ['Motivation follows action, it never leads it', 'Waiting to "feel like it" is the trap — dopamine releases DURING progress, not before it. Start any task at 10% effort and motivation typically arrives within 5 minutes. Action first, feeling second, no exceptions.'],
              ['Variable reward is why apps win — use it against them', 'Unpredictable rewards (a great video, a like, a match) are more addictive than predictable ones. You can\'t out-willpower an engineered system — you remove access instead (delete the app, greyscale the phone, log out).'],
              ['Novelty-seeking needs a legal outlet', 'The same brain chemistry that loves infinite scroll loves new skills, new places, new training stimuli. Redirect the craving for "new" into deliberate variety in productive things — new lifts, new topics, new routes — instead of fighting the craving itself.'],
              ['Protect the morning dopamine baseline', 'Checking your phone first thing spikes dopamine artificially before you\'ve done anything — everything real then feels dull by comparison. No phone for the first 30-60 minutes keeps your baseline low enough that real tasks still feel rewarding.'],
            ]} />
            <Card icon={Brain} title="Deep Work — the actual system" items={[
              ['Define the block, not the day', '90-minute sessions, one single task, phone physically in another room (proximity beats willpower every time). Two real 90-min blocks outperform 8 distracted hours — most people never get level 2 focus, they get the illusion of work.'],
              ['Environment does half the work', 'Same desk, same time, same starting ritual (water poured, notifications off, one specific playlist with no lyrics). Repetition trains an association: "this setup = deep focus" — you drop into the state faster every time you run the ritual.'],
              ['Kill switching cost, not just distraction', 'Every notification or tab-switch costs ~20 minutes of full refocus, even if the check itself takes 5 seconds. Batch messages/emails into 2-3 windows a day instead of live-checking — the batching alone can double usable focus time.'],
              ['Single-tasking is a trained skill', 'Multitasking is a myth — you\'re rapidly switching, and each switch has a cost. Close every tab except the one you need. If research is required, do it in a separate block, not mid-task.'],
              ['Shallow work has a place — after, not during', 'Admin, replies, and easy tasks go in low-energy windows (post-lunch dip, evening). Never let shallow work eat your peak-energy hours — that\'s the highest-value theft your day can suffer.'],
            ]} />
            <Card icon={Flame} title="Discipline for Hard Things — when everything in you wants to quit" items={[
              ['The 5-minute contract', 'Commit to just 5 minutes of the avoided task. Quitting after 5 is technically allowed — you almost never will, because starting was 90% of the resistance. Use this on literally anything you\'re avoiding.'],
              ['Shrink the task until it\'s stupid', '"Revise the whole module" paralyses; "read 3 pages" doesn\'t. If you\'re stalling, the task is too big — cut it in half repeatedly until starting feels trivial. Momentum rebuilds the scope on its own once you\'re moving.'],
              ['Discipline is a trainable muscle, literally', 'The anterior midcingulate cortex — the brain region tied to doing things you don\'t want to do — grows with use, confirmed in longevity/willpower research. Every cold shower, every session done unmotivated is a physical rep for this region. You\'re not born with or without discipline; you\'re training a muscle that atrophies from comfort.'],
              ['Design your environment, don\'t rely on willpower', 'Phone in another room, gym bag packed the night before, distracting apps deleted (reinstalling is enough friction to matter). Willpower is a finite, exhaustible resource; environment design doesn\'t run out by 3pm.'],
              ['Track the streak, not the mood', 'A visible daily-habit streak converts "do I feel like it?" into "do I break the chain?" — a far easier question to answer honestly. Never miss twice: one missed day is life happening; two in a row is the old pattern creeping back.'],
              ['Reframe the discomfort itself', 'Boredom and effort during deep work or training are supposed to feel like that — it\'s not a sign something\'s wrong, it\'s the cost of a life most people won\'t pay. The people you respect most simply accepted that cost earlier and more often than everyone else.'],
            ]} />
            <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-pink-300">Daily System — putting it all together</h3>
              <div className="space-y-2">
                {[
                  ['On waking', 'No phone for 30-60 min. Water, light, movement. This protects your dopamine baseline before the day starts spiking it artificially.'],
                  ['First work block', 'Hardest task of the day, first, while willpower is highest. 90 min, phone in another room, one task, environment ritual run beforehand.'],
                  ['Midday', 'Shallow work (emails, admin, replies) in the post-lunch dip — never during peak focus hours.'],
                  ['Second work block', 'Second 90-min session if the day allows it. Same ritual, same rules.'],
                  ['Reward, deliberately placed', 'Phone/scrolling/games AFTER the blocks are done, not as a break from them. This is the effort-before-reward rule in daily practice.'],
                  ['Evening', 'Screens down earlier than you think you need to. Review: did I run the blocks? Track the leading behaviour, not just how the day felt.'],
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

        {/* ============ SECURITY ============ */}
        {tab === 'security' && <Security />}

        {/* ============ HIGH VALUE ============ */}
        {tab === 'highvalue' && <HighValue />}

        {/* ============ MORNING ROUTINE ============ */}
        {tab === 'morning' && <MorningRoutine />}

        {/* ============ NIGHT ROUTINE ============ */}
        {tab === 'night' && <NightRoutine />}

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-widest">
                <Unlock size={13} /> Unlocked — The Social Playbook
              </div>
              <button onClick={relock}
                className="flex items-center gap-1.5 text-gray-500 hover:text-pink-400 text-xs font-bold transition-colors">
                <Lock size={12} /> Lock it
              </button>
            </div>
            <Link to="/cheatsheet"
              className="flex items-center justify-between bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-500/25 rounded-2xl px-5 py-4 hover:from-pink-500/20 transition-all group press">
              <div className="flex items-center gap-3">
                <BookOpen className="text-pink-400 flex-shrink-0" size={20} />
                <div>
                  <p className="font-black text-sm">Open the Cheat Sheet</p>
                  <p className="text-gray-500 text-xs">One page, everything you need — check it before you go out</p>
                </div>
              </div>
            </Link>
            <Link to="/dating"
              className="flex items-center justify-between bg-white/3 border border-white/10 rounded-2xl px-5 py-3.5 hover:border-pink-500/25 transition-all group press">
              <div className="flex items-center gap-3">
                <ListChecks className="text-pink-400/70 flex-shrink-0" size={17} />
                <p className="font-bold text-xs text-gray-300">Or browse the Full Reference — every principle, by category</p>
              </div>
            </Link>
            <div className="card-premium p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Heart size={16} className="text-pink-400" /> Ground Rules First</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                None of this works as a trick, and all of it works as a skill. You're not extracting anything from anyone —
                you're becoming someone women genuinely enjoy being around, and being direct about your interest.
                Read her signals honestly: if she's engaged, continue; if she's polite-but-flat, wish her a good day and exit
                gracefully. Grace in rejection is the single most attractive trait you can build, because it means you were never desperate.
              </p>
            </div>
            <Collapsible title="Frame — Hold It, Never Hand It Over" tag="The concept underneath everything else here">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Frame is whose reality the interaction runs on.</span> Two people meet with two versions of "what's happening here" — attraction, banter, and outcomes all get decided by whichever frame wins. You keep yours by not flinching, over-explaining, or auditioning for the other person's approval.</p>
                <p><span className="font-bold text-gray-200">Never put her on a pedestal.</span> The instant you treat someone as above you — more impressive, more valuable, someone you need to win over — you've handed them the frame and it shows in every word after. She's a person you're getting to know, not a judge scoring you. You approach; you don't apply.</p>
                <p><span className="font-bold text-gray-200">You are the prize too.</span> Not arrogance — accuracy. You bring a full life, standards, and things you won't compromise on. The right mindset going in isn't "I hope she likes me," it's "let's see if we actually vibe" — a two-way evaluation, not an interview where only you're being assessed.</p>
                <p><span className="font-bold text-gray-200">Qualify, don't perform.</span> Instead of stacking reasons she should like you, ask questions that check if SHE'S someone worth your time: her humour, her ambition, how she treats people. The switch from "please be impressed" to "let's see if you're interesting" changes your entire energy — and it's usually the difference people can't name but feel instantly.</p>
                <p><span className="font-bold text-gray-200">Reframe rejection before it happens.</span> A "no" doesn't mean you lost — it means poor fit, found early, cheaply. Frame stays intact when outcomes don't define your worth. This is why the men with real frame are calm about rejection: it was never a referendum on them.</p>
                <p><span className="font-bold text-gray-200">Frame breaks in small moments, not big ones.</span> Changing your opinion because she disagreed, over-explaining a joke that didn't land, rushing to fix a silence, apologising for existing — these tiny concessions leak frame faster than any single big mistake. Hold your positions lightly and calmly; you can be flexible without being someone who folds.</p>
                <p><span className="font-bold text-gray-200">Standards over impressing.</span> Decide beforehand what you won't tolerate — disrespect, flakiness, disappearing acts — and hold that line regardless of how attracted you are. A man with standards he actually enforces is rarer and more magnetic than a man with a perfect opening line.</p>
              </div>
            </Collapsible>
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
            <Collapsible title="Taking Her Home from the Club" tag="The endgame — done right">
              <div className="space-y-3 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Prerequisites, honestly.</span> This only happens when the whole night built it: strong connection, escalating vibe, her matching your energy at every step. You can't "technique" someone home who isn't feeling it — and both of you need to be sober enough that it's a real choice. If she's drunk past clear judgement, the strong move is her number and a proper date; that restraint reads as class AND gets the girl more often than the push does.</p>
                <p><span className="font-bold text-gray-200">Build the bridge early.</span> Mid-conversation, plant seeds naturally: mention your amazing rooftop view, the vinyl collection, that you make the best 2am toastie in the city. Now "coming back" has a story attached that isn't just the obvious — it gives her a comfortable yes to say.</p>
                <p><span className="font-bold text-gray-200">The invitation: casual, specific, low-pressure.</span> Near the night\'s peak (not closing time desperation): "I\'m heading back to mine — come see the view / for a drink. You can judge my flat." Light tone, direct intent. One ask. If it\'s "I shouldn\'t / not tonight" — "fair, then let me take your number and do this properly." Zero sulk. The graceful reaction converts half of tonight\'s no\'s into next week\'s date.</p>
                <p><span className="font-bold text-gray-200">Logistics are seduction.</span> Uber ordered in one tap, you know your address flow, place is CLEAN (the state of your room has ended more nights than rejections have — clean sheets, no chaos, decent lighting, phone charger available). Water and snacks in the fridge. The guy whose life is together at 2am is rare.</p>
                <p><span className="font-bold text-gray-200">Friends checkpoint.</span> She\'ll often check with friends — encourage it, don\'t fight it: "make sure your mates know where you are." Supporting her safety check makes YOU the safe option and defuses friend-blocking.</p>
                <p><span className="font-bold text-gray-200">Back at yours: no lunging.</span> Keep the night\'s energy — music on, the drink/toastie you promised, show the view. Sit close, keep the flirt running, let it build to a kiss naturally. Escalate step by step with her response as the throttle (Intimacy section covers the rest). The rush communicates "the talking was fake"; the patience communicates the opposite.</p>
                <p><span className="font-bold text-gray-200">Any no along the way is final and fine.</span> A no to coming back, a no to anything at yours — instant, cheerful acceptance. "All good — the toastie offer stands for another night." Aftercare applies to the whole night: whatever happens, she gets home safe (order the car yourself if needed), and the next-day text isn\'t cold. That\'s the reputation that keeps working long after tonight.</p>
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
